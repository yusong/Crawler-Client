define(['modules/http_agent', 'tools/commonutil'], function(http_agent, util){

	var Tmall = function() {};

	/**
	 * Index page
	 */
	Tmall.prototype.index = function(url, callback) {
		http_agent(url, {type: 'GET'}, function(err, dom){
			if(err) {
				console.log('[Fetcher] tmall.index Error');
				callback(err);
			}
			else {
				$(dom).find('.j_SubView .subItem .subItem-cat a').each(function(){
					console.log($(this).attr("href") + $(this).html());
					// Todo: what to do about index page
				});
				callback(null, null);
			}
		});
	}

	/**
	 * Pruduct List page
	 */
	Tmall.prototype.productList = function(url, callback) {
		http_agent(url, {type: 'GET'}, function(err, dom){
			if(err) {
		        console.log('[Fetcher] tmall.productList Error');
		        callback(err);
      		} 
      		else {
      			try {
      				console.log(url);

	      			if( dom.match !== undefined ) {
		      			var result = []; // collection of products

		      			dom = dom.substring(dom.indexOf('<'));
		      			dom = $(dom);
		      			// Get all products of current page
		      			dom.find('div.product p.productTitle a').each(function(){
		      				result.push( $(this).attr("href").replace(/^\//,"http:/"));
		        		});

		        		// Get Category Info for InfoPage
		        		var cnt = 0;
		        		var category = [];
		        		dom.find('#J_CrumbSlideCon a').each(function(){
		        			var cat = $(this).html();
		        			if( cat && cnt > 0 && cnt < 4 ){
		        				category.push( cat );
		        			}
		        			cnt++;
		        		});

		        		var rto = { urls: result, category: category };

		        		// Instead of Getting Link of Next Page, We Get Pages Number
		        		var pagePositionInfo = dom.find('b.ui-page-s-len')[0].innerText.replace(/\s/g,"");
				        var current = parseInt(pagePositionInfo.match(/(\d+)\//)[1]);
				        var number = parseInt(pagePositionInfo.match(/\/(\d+)/)[1]);
				        if( current == 1 ) {
				        	rto.pages = [];
				        	var currentpageurl = url.replace(/#J_\S+/,"");
				        	if( currentpageurl.indexOf('&s=') == -1 ){
		              			currentpageurl = currentpageurl + '&s=0';
		            		}
		            		for( var i = current+1; i <= number; i++ ){
		            			var ipageurl = currentpageurl.replace(/&s=\d+/,"&s="+((i-1)*60));
		            			rto.pages.push( 
		              				{
		                				tasks: [{
		                  					handler: 'tmall',
		                  					urls: [ipageurl]
		                				}]
		              				}
		              			);
		            		}
				        }

		        		callback(null, rto);      				
	      			}
	      			else {
	      				callback( null, { urls: [url] } );
	      			}
      			} catch(e) {
      				console.log(url + " 分析异常 " + e);
                	callback( null, { urls: [url] } );
      			}
      		}
		});
	}

	/**
	 * Product detail page
	 */
	Tmall.prototype.productInfo = function(url, callback) {

		http_agent(url, {headers: {'Referer': 'http://www.google.com.hk/'}}, function(err, dom){
			if(err) {
				console.log('[Fetcher] tmall.productInfo Error');
                callback(err);
			}
			else {
				try {	
					console.log(url);

					if( dom.match !== undefined ) {						
						if( dom.match(/<title>(.+)<\/title>/)[1] === '亲，访问受限了' ) {
							console.log( dom.match(/<title>(.+)<\/title>/)[1] );
							// 访问受限时直接推回给服务端
							callback( null, { urls: [url] } );
							return;
						}
						else {
							// 没被拒绝，进行分析
							dom = dom.substring(dom.indexOf('<'));
							dom = $(dom);

							productInfos = {
								pro_source : '天猫',
								pro_sku : null,// 商品ID
								pro_name : dom.find('div.tb-detail-hd h3')[0].innerText.replace(/\s/g,""), // 商品名
								pro_url : url,
								pro_date : new Date(),
								pro_imgUrl : dom.find('ul#J_UlThumb li.tb-selected img').attr('src'),
								pro_attr : null,
								pro_relateSKU : null,
								pro_comment : null
							};

							//商品参数
							var attr = {};
							dom.find('ul#J_AttrUL li').each(function(){
		           	    		var attrarr = $(this).text().replace(":","：").split("：");
		          	     		attr[attrarr[0]] = attrarr[1];
		                 	});
		                 	productInfos["pro_attr"] = attr;

		                 	//---------------start 获取天猫页面中TShop.Setup的数据-------------------//
		                 	// var tShopst=$(basehtmldoc).find('script')[0].innerText;
		                 	var tShopst = '';
		                 	var scriptArr = dom.find('script');
		                 	for ( var arri in scriptArr )//获取script中TShop.Setup的内容
		                    {
		                      	if( arri.match(/\d+/) && scriptArr[arri].text.indexOf("TShop.Setup") > -1) {
		                        	tShopst = scriptArr[arri].innerText;
		                      	}
		                    }
		                    // tShopst = tShopst.replace(/\s/g,"");
		          			var regTShop=/TShop\.Setup((.|\n)+?)}\);/im;
							var tShopJSONst = regTShop.exec(tShopst)[0]; // initAPI地址
							tShopJSONst = tShopJSONst.substring(tShopJSONst.indexOf("{"), tShopJSONst.lastIndexOf("}")+1);
							tShopJSONst = util.standardizingJSONst(tShopJSONst);
							var jsonTShop = JSON.parse(tShopJSONst); // TShop.set的JSON数据,包括initapi,skumap...
							productInfos['pro_sku']=util.get( jsonTShop, 'itemDO.itemId');//商品ID获取
							//---------------end 获取天猫页面中TShop.Setup的数据-------------------//
							
							//---------------start 获取天猫页面中所有SKU参数选项与中文的对应-------------------//
		                	var selectionsCodeMapTitle = {};
		              		dom.find('dl.tb-prop.tm-clear li').each(function(){
				                var title = $(this).text().replace(/\s/g,"");
				                var code = $(this).attr("data-value");
		                 		// attr[attrarr[0]]=attrarr[1];
		                		selectionsCodeMapTitle[code] = title;
		                 	});
		                	//---------------end 获取天猫页面中所有SKU参数选项与中文的对应-------------------//

		                	//---------------start 获取天猫页面中所有SKUId与中文的对应-------------------//
							var skuNameMapIdArr = [];
							var skuNameMapId = {};
							var skuMap = util.get( jsonTShop, 'valItemInfo.skuMap');
							for ( var x in skuMap ) {
								var skuName = '';
								var arrCode = x.split(';');
								for ( var arri in arrCode ) {
									if( arrCode[arri] ){
										skuName = skuName + selectionsCodeMapTitle[arrCode[arri]];
									}
								}
								skuNameMapId["skuName"] = skuName;
								skuNameMapId["skuId"] = skuMap[x].skuId;
								skuNameMapIdArr.push(skuNameMapId);
							}
		                	//---------------end 获取天猫页面中所有SKUId与中文的对应-------------------//

		                	var analyseSKUPrice = function(url2, ori_url, callback2) {
								http_agent(url2, {headers: {'Referer': 'http://www.google.com.hk/'}}, function(err,asb){
									var flag = true;
									if( asb ) {
										try {
											var tempobj = asb.responseText;
											// tempobj = tempobj.replace(/[\s]/g,"");
											tempobj = util.standardizingJSONst(tempobj);
											var SKUInfoJSON = JSON.parse(tempobj);
											productInfos["pro_moonsellcount"] = parseInt(util.get( SKUInfoJSON, 'defaultModel.sellCountDO.sellCount' )) || 0; // 月销量
											productInfos["pro_postage"] = {};
											productInfos["pro_skuprice"] = {};
											productInfos["pro_postage"] = util.get( SKUInfoJSON, 'defaultModel.deliveryDO.deliverySkuMap');
											productInfos["pro_skuprice"] = util.get( SKUInfoJSON, 'defaultModel.itemPriceResultDO.priceInfo' );
											
											//强制设置默认价格（某个SKU的价格）
											var _def = '';
											// if( productInfos["pro_skuprice"].def && productInfos["pro_skuprice"].def.promotionList && productInfos["pro_skuprice"].def.promotionList.constructor === Array ) {
											var promotionList = util.get( productInfos["pro_skuprice"], 'def.promotionList');
											if( promotionList.constructor === Array && promotionList.length > 0 ) {
												_def = promotionList[0].price;
											}
											else {
												_def = util.get( productInfos["pro_skuprice"], 'def.price');
											}
											productInfos["pro_price"] = productInfos["pro_skuprice"].def ? _def : function() {
												var tag = false;
												for( var skuidi in productInfos["pro_skuprice"] ){
													promotionList = util.get( productInfos["pro_skuprice"][skuidi], 'promotionList');
													if( promotionList.constructor === Array && promotionList.length > 0 ) {
											    		tag = true;
											    		return promotionList[0].price;
											  		}
												}
												if( !tag ) return 0;
											}();

											//结果存在这里，还没筛取,有价格，月销量，运费									
										} catch(e) {
											console.log("skuprice analys err");
											flag = false;
											// throw(e);
											callback2( null, { urls: [ori_url] } );
										}
									}
									if( flag ) callback2( null, {product: productInfos});
								});
					   		};

		                	productInfos["pro_skuNameMapId"] = skuNameMapId;
		               		analyseSKUPrice( jsonTShop.initApi, url, callback );
						}
					} 
					else {
						callback( null, { urls: [url] } );
					}
				} catch(e) {
					console.log(url + " 分析异常 " + e);
                	callback(e);
				}
			}
		});
	}

	return new Tmall();

});