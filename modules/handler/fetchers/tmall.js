define(['modules/http_agent'], function(http_agent){

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
				$(dom).find('div.view.view-noSku.clearfix p.productTitle a').each(function(){
					// Product Item
					result.push( $(this).attr("href") );
				});
				callback(null, {urls: result});
			}
		});
	}

	Tmall.prototype.productInfo=function(url, callback){
	try{
    var productinfojs={};
    http_agent(url,{
						headers:{
							'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
							'Accept-Charset':'GBK,utf-8;q=0.7,*;q=0.3',
							'Accept-Encoding':'gzip,deflate,sdch',
							'Accept-Language':'zh-CN,zh;q=0.8',
							'Cache-Control':'max-age=0',
							'Connection':'keep-alive',
							'Referer':'http://www.google.com.hk/',
							'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.95 Safari/537.4',
						},
					},function(err,basehtmldoc){   
 		
     console.log(basehtmldoc);
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
      for (arri in scriptArr)
            {
              if(scriptArr[arri].innerText.contain("TShop.Setup")){
            tShopst=scriptArr[arri].innerText;
          }
          }
      tShopst=tShopst.replace(/\s/g,"");
      var regTShop=/TShop.Setup(.+?)\)/i;
      var tShopJSONst=regTShop.exec(tShopst)[0];//initAPI地址
      tShopJSONst=tShopJSONst.substring(tShopJSONst.indexOf("{"),tShopJSONst.lastIndexOf("}")+1);
      tShopJSONst=standardizingJSONst(tShopJSONst);
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
        skuNameMapId[skuName]=skuMap[x].skuId;
        }
        //---------------end 获取天猫页面中所有SKUId与中文的对应-------------------//
    //----------------------------------//
     productinfojs["pro_skuNameMapId"]=skuNameMapId;
     analyseSKUPrice(jsonTShop.initApi);

     function analyseSKUPrice(url2,callback){
        http_agent(url2,{
            headers:{
              'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Charset':'GBK,utf-8;q=0.7,*;q=0.3',
              'Accept-Encoding':'gzip,deflate,sdch',
              'Accept-Language':'zh-CN,zh;q=0.8',
              'Cache-Control':'max-age=0',
              'Connection':'keep-alive',
              'Referer':'http://www.google.com.hk/',
              'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.95 Safari/537.4',
               },
             },function(err,asb){   
                   var tempobj=asb.responseText;
                   console.log(tempobj);
                   tempobj=tempobj.replace(/[\s]/g,"");
                   tempobj=standardizingJSONst(tempobj);
                   var SKUInfoJSON=JSON.parse(tempobj);
                   productinfojs["pro_moonsellcount"]=SKUInfoJSON.defaultModel.sellCountDO.sellCount;//月销量
                   productinfojs["pro_postage"]={};
                   productinfojs["pro_skuprice"]={};
                   productinfojs["pro_postage"]=SKUInfoJSON.defaultModel.deliveryDO.deliverySkuMap;
                   productinfojs["pro_skuprice"]=SKUInfoJSON.defaultModel.itemPriceResultDO.priceInfo;
                   console.log(productinfojs);
                    //结果存在这里，还没筛取,有价格，月销量，运费 
                   callback();
              });
      }

 	  // console.log(productinfojs);
		});

 	 }catch(e){
	console.log(e);
	}
    }




	return new Tmall();

});