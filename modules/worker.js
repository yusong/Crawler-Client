define(['modules/handler/dispatcher', 'modules/async', 'modules/http_agent', 'modules/QueueConf'], function(dispatcher, async, agent, QueuesConf){

	var Worker = function() {

		var _self = this;

		_self.on = 0; // Status of Worker, 1-Run or 0-Off

		_self.config = {
			// server : 'http://127.0.0.1:8000/'
			server : 'http://192.168.86.223:8000/'
		};

		var post_agent = function(url, data, callback) {
			agent(url, {type: 'POST', data: data}, function(err, result) {
				callback(err, result);
			});
		};


		// task = {
		// 	url : 'url',
		// 	handler : 'name of handler'
		// }
		_self.queue = async.queue(function(task, callback){

			setTimeout(function(){
				// console.log(''+task.handler+' after '+QueuesConf[task.handler].timeSlice);
				if( dispatcher[task.handler] ) {
					try {
						dispatcher[task.handler](task.url, function(err, data){
							if( err ) callback();
							else {
								// Todo: Add conditions of when to push task to cargo
								var rto = {
									handler : task.handler,
									data : data
								};
								if( task.category !== undefined ) {
									// rto.data.category = task.category;
									rto.category = task.category;

									if( rto.data['product'] !== undefined ) {
										rto.data['product'].category = task.category;
									} else {
										rto.data.category = task.category;
									}	

									if( data.pages !== undefined ) {
										data.pages.forEach(function(page){
											page.tasks.forEach(function(t){
												t.category = task.category;
											});
										});
									}
								}							
								_self.cargo.push( rto );
								callback();
							}
						});							
					} catch(e) {
						console.log('Page Error.'+e);
						callback();
					}			
				} else {
					console.log('Handle: '+task.handler+' Not Found.');
					callback();
				}
			}, QueuesConf[task.handler].timeSlice); 

		}, 1);


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
				if( items.category !== undefined ) item.data.category = items.category;
				goods[item.handler].results.push(item.data);
			});

			var pack = [];
			for( var i in goods ){
				pack.push( goods[i] );
			}

			console.log('[ACK a Job]: ');console.dir(pack);

			post_agent(_self.config.server + 'ack', JSON.stringify(pack), function(err, result){
				if(err) console.log('Agent ACK Error');
				else {
					// console.log('[ACK Server Result] ' + result);
				}
			});

			callback();
		}, 20);

		_self.finishedJobsCnt = 0;

		_self.run = function(callback) {

			if( !_self.queue.length() && !_self.cargo.length() ) {
				// Last Job Has been Finished.
				if( _self.finishedJobsCnt++ > 8 && (typeof window !== 'undefined') ) {
					window.location.reload();
					return;
				}

				post_agent(_self.config.server + 'pull', '', function(err, task){
					if(err) {
						callback(err);
					} 						
					else {
						if( task ) {
							try {
								task = JSON.parse(task);
								console.log('[Pull] Job as: '); console.dir(task);

								if( task.urls ) {
									task.urls.forEach(function(url){
										var rto = {
											handler : task.handler,
											url : url
										};
										if( task.category !== undefined ) rto.category = task.category;
										_self.queue.push( rto );
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
				callback('Worker is too busy.'+_self.queue.length());
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
			console.log(_self.on);
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
	console.log("new worker");
	return new Worker();

});