define(['modules/http_agent'], function(http_agent){

	var Jingdong = function() {};

	/**
	 * Channel Page, Get Classification Info
	 */
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

	/**
	 * Product List Page, Get Products' Url
	 */
	Jingdong.prototype.productList = function(url, callback) {
		http_agent(url, {type: 'GET'}, function(err, dom){
			if(err) {
				console.log('[Fetcher] jingdong.productList Error');
				callback(err);
			} 
			else {
				var result = [];
				var number = 1;
				var current = 1;
				var url = ''
				$(dom).find('#plist li .p-name a').each(function(){
					// Product Item
					result.push( $(this).attr("href") );
				});

				// Next Pages Are Created at Crawler Server!!
				// 
				// $(dom).find('.pagin-m .next').each(function(){
				// 	// Next Page
				// 	result.push( 'http://list.jd.com/' + $(this).attr("href") );
				// });

				// Instead of Getting Link of Next Page, We Get Pages Number
				$(dom).find('.pagin-m').each(function() {
					$(this).find('.text').each(function() {
						$(this).find('i').each(function() {
							current = parseInt($(this).html());
						});
						number = parseInt($(this).html().match(/\/(\d+)/)[1]);
					});
					$(this).find('.next').each(function() {
						url = $(this).attr("href").replace(/(\d+)-(\d+)\.html/, '');
					});
				});

				var rto = { urls: result };
				if( current == 1 ) {
					rto.pages = [];
					for( var i = current+1; i <= number; i++ ){
						rto.pages.push( 
							{
								tasks: [{
							 		handler: 'jingdong',
							 		urls: ['http://list.jd.com/' + url + i + '-1.html']
							 	}]
							}
						);
					}
					console.log('[Next Pages]: '); console.dir(rto.pages);
				} 
				else {
					console.log('[Next Pages]: None');
				}

				callback(null, rto);
			}
		});
	}

	/**
	 * Product Info Page, Get Product's Info 
	 */
	Jingdong.prototype.productInfo = function(url, callback) {
		http_agent(url, {type: 'GET'}, function(err, dom){
			if(err) {
				console.log('[Fetcher] jingdong.productInfo Error');
				callback(err);
			} 
			else {
				dom = $(dom);				
				var productInfo = {
					pro_source : '京东',
					pro_sku : url.match(/\/(\d*)\./)[1], // SKU
					pro_name : dom.find('#name h1').html(), // 商品名
					pro_url : url,
					pro_date : new Date(),
					pro_imgUrl : dom.find('div.jqzoom img').attr('src'),
					pro_attr : null,
					pro_relateSKU : null,
					pro_comment : null
				};

				//商品参数
    			var attr={};
   				dom.find('ul.detail-list li').each(function(){
     				var attrarr = $(this).text().replace(":","：").split("：");
     				attr[attrarr[0]] = attrarr[1];
   				});
   				productInfo["pro_attr"] = attr;

   				// 获取该商品相关的SKU
				var skust = dom.find('#choose script').html();
				if( skust ) {
					skust = skust.substring(skust.indexOf('=')+1,skust.indexOf(';'));				
					productInfo['pro_relateSKU'] = JSON.parse(skust);
				}

				//商品评论详情URL
				var commentURL = 'http://club.jd.com/clubservice/newproductcomment-' + productInfo.pro_sku + '-0-0.html';
				var comment = {};

				http_agent(commentURL, {}, function(err, commenthtmldoc){
					//获取回来的data就是json对象
				    if(commenthtmldoc!=null && commenthtmldoc!="" && commenthtmldoc.CommentSummary){
					   	comment["评论数"]=commenthtmldoc.CommentSummary.CommentCount;
					    comment["好评数"]=commenthtmldoc.CommentSummary.GoodCount;
					    comment["中评数"]=commenthtmldoc.CommentSummary.GeneralCount;
					    comment["差评数"]=commenthtmldoc.CommentSummary.PoorCount;
					    productInfo["pro_comment"]=comment;
					}

					callback(null, {product: productInfo});
				});
			}
		});
	}


	return new Jingdong();

});