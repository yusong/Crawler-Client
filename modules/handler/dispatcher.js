define(['modules/handler/fetcher'], function(fetcher){

	var Dispatcher = function() {};

	/**
	 * Dispatcher of JingDong
	 */
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
			callback('No JingDong Fetcher For ' + url);
		}

	};

	/**
	 * Dispatcher of Tmall
	 */
	Dispatcher.prototype.tmall = function(url, callback) {
		if( url.match('detail.tmall.com') ) {
			// Index Page, async Category
			fetcher.tmall.productInfo(url, function(err, result){
				if(err) ;
				else {
					callback(null, result);
				}
			});
		} 
		else if( url.match('http://list.tmall.com/') ) {
			// JingDong Product Info Page
			fetcher.tmall.productList(url, function(err, result){
				if(err) ;
				else {
					callback(null, result);
				}
			});
		}
		else {
			callback('No Tmall Fetcher For ' + 'http://www.tmall.com/go/rgn/mfp2012/all-cat-asyn.php');
		}

	};

	/**
	 * Dispatcher of Weibo
	 */
	Dispatcher.prototype.weibo = function(url, callback) {

		if( url.match(/weibo.com\/[\d|\w]+/) ) {
			// User Home Page
			fetcher.weibo.home(url, function(err, result){
				if(err) ;
				else {
					callback(null, result);
				}
			});
		}
		else {
			callback('No Weibo Fetcher For ' + url);
		}

	}


	return new Dispatcher();
	
});

	

	

