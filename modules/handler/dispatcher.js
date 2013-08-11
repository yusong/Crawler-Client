define(['modules/handler/fetcher'], function(fetcher){

	var Dispatcher = function() {};

	Dispatcher.prototype.jingdong = function(url, callback) {
		// if( url == 'a' ) {
		// 	fetcher.jingdong.hello();
		// }
		fetcher.jingdong.hello();
		callback();
	};

	return new Dispatcher();
	
});

	

	

