define(['modules/http_agent', 'tools/commonutil'], function(http_agent, commonutil){

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
        			if( cat && cat !== '首页' ){
        				if( cnt < 3 ) {
        					category.push( cat );
        					cnt++;
        				}
        			}
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
					dom = dom.substring(dom.indexOf('<'));
					dom = $(dom);
					var productInfo = {
						pro_source : '天猫',
						pro_sku : url.match(/[?&]id=(\d+)/)[1], // SKU
						pro_name : dom.find('div.tb-detail-hd a')[0].innerText.replace(/\s/g,''), // 商品名
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
                 	productInfo["pro_attr"] = attr;

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
                    tShopst = tShopst.replace(/\s/g,"");
                    var regTShop = /TShop.Setup(.+?)\)/i;
					var tShopJSONst = regTShop.exec(tShopst)[0]; // initAPI地址
					tShopJSONst = tShopJSONst.substring(tShopJSONst.indexOf("{"), tShopJSONst.lastIndexOf("}")+1);
					tShopJSONst = commonutil.standardizingJSONst(tShopJSONst);
					var jsonTShop = JSON.parse(tShopJSONst); // TShop.set的JSON数据,包括initapi,skumap...
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
					// var skuNameMapId={};
					// var skuMap=jsonTShop.valItemInfo.skuMap;
					// for (x in skuMap)
					// {
					//  var skuName="";
					//  var arrCode=x.split(";");
					//  for (arri in arrCode)
					//      {
					//        if(arrCode[arri]){
					//      skuName=skuName + selectionsCodeMapTitle[arrCode[arri]];
					//    }
					//    }
					//  skuNameMapId[skuName]=skuMap[x].skuId;
					//  }
					var skuNameMapIdArr = [];
					var skuNameMapId = {};
					var skuMap = jsonTShop.valItemInfo.skuMap;
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
				
                	var analyseSKUPrice = function(url2, callback2) {
						http_agent(url2, {headers: {'Referer': 'http://www.google.com.hk/'}}, function(err,asb){
							var flag = true;
							if( asb ) {
								try {
									var tempobj = asb.responseText;
									tempobj = tempobj.replace(/[\s]/g,"");
									tempobj = commonutil.standardizingJSONst(tempobj);
									var SKUInfoJSON = JSON.parse(tempobj);
									productInfo["pro_moonsellcount"] = SKUInfoJSON.defaultModel.sellCountDO.sellCount;//月销量
									productInfo["pro_postage"] = {};
									productInfo["pro_skuprice"] = {};
									productInfo["pro_postage"] = SKUInfoJSON.defaultModel.deliveryDO.deliverySkuMap;
									productInfo["pro_skuprice"] = SKUInfoJSON.defaultModel.itemPriceResultDO.priceInfo;
									//强制设置默认价格（某个SKU的价格）
									var _def = '';
									if( productInfo["pro_skuprice"].def && productInfo["pro_skuprice"].def.promotionList && productInfo["pro_skuprice"].def.promotionList.constructor === Array ) {
										_def = productInfo["pro_skuprice"].def.promotionList[0].price;
									}
									productInfo["pro_price"] = productInfo["pro_skuprice"].def ? _def : function() {
										var tag = false;
										for( var skuidi in productInfo["pro_skuprice"] ){
											if( productInfo["pro_skuprice"][skuidi].promotionList && productInfo["pro_skuprice"][skuidi].promotionList.length>0){
									    		tag = true;
									    		return productInfo["pro_skuprice"][skuidi].promotionList[0].price;
									  		}
										}
										if( !tag ) return 0;
									}();
									//结果存在这里，还没筛取,有价格，月销量，运费									
								} catch(e) {
									flag = false;
									throw(e);
								}
							}
							if( flag ) callback2( null, {product: productInfo});
						});
               		};

                	productInfo["pro_skuNameMapId"] = skuNameMapId;
               		analyseSKUPrice( jsonTShop.initApi, callback );

				} catch(e) {
					console.log(url + " 分析异常 " + e);
                	callback(e);
				}
			}
		});
	}

	return new Tmall();

});