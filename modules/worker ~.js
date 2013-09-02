define(['modules/handler/dispatcher', 'modules/async', 'modules/http_agent', 'modules/taskQueue'], function(dispatcher, async, agent, Queues){

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

		_self.queue = [];
		_self.CONTROL = 0;
		_self.Map = Queues.map;
		Queues = Queues.Queues;
		var date = new Date();

		// task = {
		// 	url : 'url',
		// 	handler : 'name of handler'
		// }
		Queues.forEach(function(Queue){
			if( Queue.lastTime == null ) {
				Queue.lastTime = date.getTime();
			}

			_self.queue[Queue.name] = async.tqueue(function(){
				// CONTROL：轮询控制器
				CONTROL = (CONTROL+1) % Queues.length;
				if( Queues[CONTROL].name == Queue.name ) {
					// 轮询到当前队列了
					var currentTime = date.getTime()
					if( Queue.lastTime + Queue.timeSlice <= currentTime ) {
						// 时间间隔超过 timeSlice，更新时间
						Queue.lastTime = currentTime;
						return true;
					} else {
						// 没到规定时间间隔
						return false;
					}
				} else {
					// 还没轮询到当前队列
					return false;
				}
			}, function(task, callback){
				if( dispatcher[task.handler] ) {
					try {
					dispatcher[task.handler](task.url, function(err, data){
						if( err ) callback();
						else {
							// Todo: Add conditions of when to push task to cargo
							_self.cargo.push({
								handler : task.handler,
								data : data
							});
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
			}, 20)
		});


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

			console.log('[ACK a Job]: ');console.dir(JSON.stringify(pack));

			post_agent(_self.config.server + 'ack', JSON.stringify(pack), function(err, result){
				if(err) console.log('Agent ACK Error');
				else {
					console.log('[ACK Server Result] ' + result);
				}
			});

			callback();
		}, 20);

		_self.finishedJobsCnt = 0;

		_self.run = function(callback) {

			if( !_self.queue.length() ) {
				// Last Job Has been Finished.
				if( _self.finishedJobsCnt++ > 15 && (typeof window !== 'undefined') ) {
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
										_self.queue[_self.Map[task.handler].push({
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
			if( _self.on ) _self.run(loop);
		};

		/**
		 * Loop _self.run Function When _self.on
		 * Pull Tasks and Handle That Again and Again.
		 */
		var loop = function(err, sec) {
			if( err ) console.log('ERROR: ' + err);
			var second = sec || 20;
			setTimeout(function(){
				if( _self.on ) _self.run(loop);
			}, second*1000);
		}

	};

	return new Worker();

});