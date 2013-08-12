define(['modules/handler/fetcher'], function(fetcher){

	var Dispatcher = function() {};

	Dispatcher.prototype.jingdong = function(url, callback) {

		if( url.match('channel.jd.com') ) {
			// JingDong Channel Page
			fetcher.jingdong.channel(url, function(err, result){
				if(err) ;
				else {
					callback(null, result);
				}
			});
		}
		else if( url.match('list.jd.com') ) {
			// JingDong Product List Page
			fetcher.jingdong.productList(url, function(err, result){
				if(err) ;
				else {
					callback(null, result);
				}
			});
		}
		else if( url.match('item.jd.com') ) {
			// JingDong Product Info Page
			fetcher.jingdong.productInfo(url, function(err, result){
				if(err) ;
				else {
					callback(null, result);
				}
			});
		}
		else {
			// console.log('No Fetcher For ' + url);
			callback('No Fetcher For ' + url);
		}

	};

	return new Dispatcher();
	
});

	

	

