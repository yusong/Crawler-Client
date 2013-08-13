define(['modules/http_agent'], function(http_agent){

	var Fetcher = function() {

		var _self = this;

		_self.jingdong = function() {};


		_self.jingdong.channel = function(url, callback) {
			http_agent(url, {type: 'GET'}, function(err, dom){
				if(err) {
					console.log('[Fetcher] jingdong.channel Error');
					callback(err);
				} 
				else {
					var result = [];
					$(dom).find('div#sortlist .con a').each(function(){
						result.push( $(this).attr("href") );
					});
					callback(null, {urls: result});
				}
			});
		}


		_self.jingdong.productList = function(url, callback) {
			http_agent(url, {type: 'GET'}, function(err, dom){
				if(err) {
					console.log('[Fetcher] jingdong.productList Error');
					callback(err);
				} 
				else {
					var result = [];
					$(dom).find('#plist li .p-name a').each(function(){
						// Product Item
						result.push( $(this).attr("href") );
					});
					$(dom).find('.pagin-m .next').each(function(){
						// Next Page
						result.push( 'http://list.jd.com/' + $(this).attr("href") );
					});
					callback(null, {urls: result});
				}
			});
		}


		_self.jingdong.productInfo = function(url, callback) {
			http_agent(url, {type: 'GET'}, function(err, dom){
				if(err) {
					console.log('[Fetcher] jingdong.productInfo Error');
					callback(err);
				} 
				else {
					var productInfo = {};
					productInfo.name = $(dom).find('#name h1').html(); // 商品名
					callback(null, {product: productInfo});
				}
			});
		}


		_self.tmall = function() {};


		_self.tmall.index = function(url, callback) {
			http_agent(url, {type: 'GET'}, function(err, dom){
				if(err) {
					console.log('[Fetcher] tmall.index Error');
					callback(err);
				} 
				else {
					$(dom).find('.j_SubView .subItem .subItem-cat a').each(function(){
						console.log($(this).attr("href") + $(this).html());
					});
					callback(null, null);
				}
			});
		};

	};

	return new Fetcher();

});