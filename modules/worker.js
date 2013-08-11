define(['modules/handler/dispatcher', 'modules/async', 'modules/http_agent'], function(dispatcher, async, agent){

	// var Worker = function(){
	// 	dispatcher.jingdong('a');
	// };

	var Worker = function() {

		var _self = this;

		_self.on = 0; // Status of Worker, 1-Run or 0-Off

		_self.config = {
			server : 'http://127.0.0.1:8000/'
		};

		var post_agent = function(url, data, callback) {
			agent(url, {type: 'POST', data: data}, function(err, result){
				callback(err, result);
			});
		};

		// task = {
		// 	url : 'url',
		// 	handler : 'name of handler'
		// }
		_self.queue = async.queue(function(task, callback){
			if( dispatcher[task.handler] ) {
				dispatcher[task.handler](task.url, function(err, data){
					if( err ) callback();
					else {
						_self.cargo.push({
							handler : task.handler,
							// data : data
							data : {
								urls : [task.url]
							}
						});
						callback();
					}
				});				
			} else {
				console.log('Handle: '+task.handler+' Not Found.');
				callback();
			}
		}, 5);

		// ack Accept Data = [
		// 	{
		// 		handler : 'name of handler',
		// 		results : [
		// 			{
		// 				param : 'param'
		// 			}
		// 		]
		// 	}
		// ]
		_self.cargo = async.cargo(function(items, callback){
			var goods = {};
			items.forEach(function(item){
				goods[item.handler] = goods[item.handler] || { handler:item.handler, results:[] };
				goods[item.handler].results.push(item.data);
			});

			var pack = [];
			for( var i in goods ){
				pack.push( goods[i] );
			}

			console.dir(JSON.stringify(pack));

			post_agent(_self.config.server + 'ack', JSON.stringify(pack), function(err, result){
				if(err) console.log('Agent ACK Error');
				else {
					console.log('[Server Result] ' + result);
				}
			});

			callback();
		}, 1);

		_self.finishedJobsCnt = 0;

		_self.run = function(callback) {
			// console.log('##### call run function.');
			// _self.queue.push({ handler:'jingdong', url:'www.baidu.com' });
			// _self.queue.push({ handler:'jingdong', url:'www.google.com.hk' });
			// _self.queue.push({ handler:'jingdong', url:'www.yahoo.com' });
			// _self.queue.push({ handler:'jingdong', url:'www.sina.com' });

			if( !_self.queue.length() ) {
				// Last Job Has been Finished.
				if( _self.finishedJobsCnt++ > 15 && (typeof window !== 'undefined') ) {
					window.location.reload();
				}

				post_agent(_self.config.server + 'pull', '', function(err, task){
					if(err) callback(err);
					else {
						if( task ) {
							try {
								task = JSON.parse(task);
								console.log('Pull Job as: '+task);
								if( task.urls ) {
									task.urls.forEach(function(url){
										_self.queue.push({
											handler : task.handler,
											url : url
										});
									});
								}
							} catch(e) { console.log(Date(), 'sth worng', e);
							} finally { callback(); }
						} else {
							callback('No task recieved.');
						}
					}
				});

			} else {
				// Last Job Hasn't been Finished.
				callback('Worker is too busy.');
			}
		};

		var icons = ['media/icon_on.png','media/icon_off.png'];

		/**
		 * Turn the Worker On/Off.
		 */
		_self.turn_on_off = function() {
			/* Change Chrome Extension's Icon */
			if( typeof chrome != 'undefined' ) {
				chrome.browserAction.setIcon({path: icons[_self.on]});
			}
			/* Change Status of Worker */
			_self.on = 1 - _self.on;
			/* Run Worker */
			if( _self.on ) _self.run(loop);
		};

		/**
		 * Loop _self.run Function When _self.on
		 * Pull Tasks and Handle That Again and Again.
		 */
		var loop = function(err, sec) {
			if( err ) console.log('ERROR: ' + err);
			var second = sec || 5;
			setTimeout(function(){
				if( _self.on ) _self.run(loop);
			}, second*1000);
		}

	};

	return new Worker();

});