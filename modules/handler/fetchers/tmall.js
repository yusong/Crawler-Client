define(['modules/http_agent', 'tools/commonutil'], function(http_agent,commonutil){
  console.dir(commonutil);
	var Tmall = function() {};
	Tmall.prototype.index = function(url, callback) {
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

	Tmall.prototype.productList=function(url, callback){
    http_agent(url, {type: 'GET'}, function(err, dom){
      if(err) {
        console.log('[Fetcher] tmall.productList Error');
        callback(err);
      } 
      else {
        var result = [];
        var number = 1;
        var current = 1;
        var currentpageurl = url;
        dom=dom.substring(dom.indexOf("<")); 
        $(dom).find('div.product p.productTitle a').each(function(){
          result.push( $(this).attr("href").replace(/^\//,"http:/"));
        });
        // Instead of Getting Link of Next Page, We Get Pages Number
        var pagePositionInfo=$(dom).find('b.ui-page-s-len')[0].innerText;
        pagePositionInfo=pagePositionInfo.replace(/\s/g,"");
        current=parseInt(pagePositionInfo.match(/(\d+)\//)[1]);
        number=parseInt(pagePositionInfo.match(/\/(\d+)/)[1]);

        // Get Category Info for InfoPage
        var cnt = 0;
        var category = [];
        $(dom).find('#J_CrumbSlideCon a').each(function(){
          // console.log( cnt );
          // console.dir( $(this).html() );
          if($(this).html()!=""){
             if( cnt < 4 ) {
                category.push( $(this).html() );
                cnt++;
              }
          }
        });
        category.shift();
        console.dir( category );
        var rto = { urls: result, category: category };
        if( current == 1 ) {
          rto.pages = [];
          currentpageurl=currentpageurl.replace(/#J_Filter/,"");
           if(currentpageurl.indexOf("&s=")==-1){
              currentpageurl=currentpageurl+"&s=0";
            }
          for( var i = current+1; i <= number; i++ ){
            var ipageurl=currentpageurl.replace(/&s=\d+/,"&s="+((i-1)*60));
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




	Tmall.prototype.productInfo=function(url, callback){
	try{
    var productinfojs={};
    http_agent(url,{
						headers:{
							'Referer':'http://www.google.com.hk/',
						},
					},function(err,basehtmldoc){   
 		 if(err) {
        console.log('[Fetcher] tmall.productInfo Error');
        callback(err);
      } 
      else {
 	   basehtmldoc=basehtmldoc.substring(basehtmldoc.indexOf("<"));
 	   //来源
 	   productinfojs["pro_source"]="天猫";
 	   // console.log($(basehtmldoc).find('div #name')[0]);
 	  //商品名称
 	   productinfojs["pro_name"]=$(basehtmldoc).find('div.tb-detail-hd a')[0].innerText.replace(/\s/g,'');
  	  //商品地址
 	  productinfojs["pro_url"]=url;
  	  //商品时间
 	   productinfojs["pro_date"]=new Date();
 	   //图片地址
 	   productinfojs["pro_imgurl"]=$(basehtmldoc).find('ul#J_UlThumb li.tb-selected img').attr('src');
 	   //商品参数
  	  var attr={};
 	  $(basehtmldoc).find('ul#J_AttrUL li').each(function(){
 	    var attrarr=$(this).text().replace(":","：").split("：");
	     attr[attrarr[0]]=attrarr[1];
       });
 	   productinfojs["pro_attr"]=attr;


     //---------------start 获取天猫页面中TShop.Setup的数据-------------------//
      // var tShopst=$(basehtmldoc).find('script')[0].innerText;
     var tShopst="";
      var scriptArr=$(basehtmldoc).find('script');
      for (arri in scriptArr)//获取script中TShop.Setup的内容
          {
            if(arri.match(/\d+/)&&scriptArr[arri].text.indexOf("TShop.Setup")>-1){
              tShopst=scriptArr[arri].innerText;
            }
          }
      tShopst=tShopst.replace(/\s/g,"");
      var regTShop=/TShop.Setup(.+?)\)/i;
      var tShopJSONst=regTShop.exec(tShopst)[0];//initAPI地址
      tShopJSONst=tShopJSONst.substring(tShopJSONst.indexOf("{"),tShopJSONst.lastIndexOf("}")+1);
      tShopJSONst=commonutil.standardizingJSONst(tShopJSONst);
      tShopJSONst=tShopJSONst.replace(/\'/g,"\"");
      var jsonTShop=JSON.parse(tShopJSONst);//TShop.set的JSON数据,包括initapi,skumap...
      //---------------end 获取天猫页面中TShop.Setup的数据-------------------//

      //---------------start 获取天猫页面中所有SKU参数选项与中文的对应-------------------//
       var selectionsCodeMapTitle={};
    $(basehtmldoc).find('dl.tb-prop.tm-clear li').each(function(){
      var title=$(this).text().replace(/\s/g,"");
      var code=$(this).attr("data-value");
       // attr[attrarr[0]]=attrarr[1];
      selectionsCodeMapTitle[code]=title;
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
       var skuNameMapIdArr=[];
       var skuNameMapId={};
       var skuMap=jsonTShop.valItemInfo.skuMap;
       for (x in skuMap)
       {
        var skuName="";
        var arrCode=x.split(";");
        for (arri in arrCode)
            {
              if(arrCode[arri]){
            skuName=skuName + selectionsCodeMapTitle[arrCode[arri]];
          }
          }
        skuNameMapId["skuName"]=skuName;
        skuNameMapId["skuId"]=skuMap[x].skuId;
        skuNameMapIdArr.push(skuNameMapId);
        }
        //---------------end 获取天猫页面中所有SKUId与中文的对应-------------------//
    //----------------------------------//
     productinfojs["pro_skuNameMapId"]=skuNameMapId;
     analyseSKUPrice(jsonTShop.initApi,callback);
     function analyseSKUPrice(url2,callback2){
        http_agent(url2,{
            headers:{
              'Referer':'http://www.google.com.hk/',
               },
             },function(err,asb){   
                   if(asb){
                   var tempobj=asb.responseText;
                   tempobj=tempobj.replace(/[\s]/g,"");
                   tempobj=commonutil.standardizingJSONst(tempobj);
                   var SKUInfoJSON=JSON.parse(tempobj);
                   productinfojs["pro_moonsellcount"]=SKUInfoJSON.defaultModel.sellCountDO.sellCount;//月销量
                   productinfojs["pro_postage"]={};
                   productinfojs["pro_skuprice"]={};
                   productinfojs["pro_postage"]=SKUInfoJSON.defaultModel.deliveryDO.deliverySkuMap;
                   productinfojs["pro_skuprice"]=SKUInfoJSON.defaultModel.itemPriceResultDO.priceInfo;
                    //结果存在这里，还没筛取,有价格，月销量，运费      
                                 
                 }
                callback2(null, {product: productinfojs});
              });
         }
       }
 	  // console.log(productinfojs);
  		});
 	 }catch(e){
	console.log(e);
	}
    }




	return new Tmall();

});