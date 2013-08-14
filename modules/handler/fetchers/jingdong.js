define(['modules/http_agent'], function(http_agent){

	var Jingdong = function() {};


	Jingdong.prototype.channel = function(url, callback) {
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


	Jingdong.prototype.productList = function(url, callback) {
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


	Jingdong.prototype.productInfo = function(url, callback) {
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


	return new Jingdong();

});