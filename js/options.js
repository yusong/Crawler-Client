$(document).ready(function(){

	// var SERVER = 'http://127.0.0.1:8000/';
	var SERVER = 'http://192.168.86.223:8000/';

	/* Get Handler */
	$.ajax({
		url : SERVER + 'getHandler',
		type : 'POST',
		success : function(data, status) {
			data = JSON.parse(data);
			console.dir(data);
			data.forEach(function(handler) {
				$("<option value=" + handler + ">" + handler + "</option>").appendTo('#handler');
			});
		},
		error : function (XMLHttpRequest, textStatus, errorThrown) {
			console.log('ERROR: Get Handler Fail.');
		}
	});


	$('#submit').click(function(){
		var sendData = {};
		sendData.urls = [$('#url').val()];
		sendData.handler = $('#handler').val();

		$.ajax({
			url : SERVER + 'push',
			type : 'POST',
			data : JSON.stringify(sendData),
			success : function(data, status) {
				console.log(data);
			},
			error : function (XMLHttpRequest, textStatus, errorThrown) {
				console.log('ERROR: Push Task Fail.');
			}
		});
		// console.dir(JSON.stringify(sendData));
	});


	$('#cat-jd').click(function(){

		var target = [
			'JDS_01', 'JDS_02', 'JDS_04', 'JDS_07', 'JDS_08',
			'JDS_16', 'JDS_18'
		];

		var handler = $(this).attr('data');

		$.ajax({
			url : 'http://www.jd.com/allSort.aspx',
			type : 'GET',
			success : function(dom, status) {
				var rto = {};
				target.forEach( function(id) {
					var node = $(dom).find('#'+id);
					var first_key = $(node).find('.mt a').html();
					var first = {};

					$(node).find('dl').each(function(){
						var second = $(this).find('dt a').html();
						first[second] = [];
						$(this).find('dd a').each(function() {
							first[second].push( $(this).html() );
						});
					});
					rto[first_key] = first;
				});

				// console.dir( rto );

				var sendData = {};
				sendData.handler = handler
				sendData.category = rto;

				console.dir(sendData);

				$.ajax({
					url : SERVER + 'updateCategory',
					type : 'POST',
					data : JSON.stringify(sendData),
					success : function(data, status){
						console.log(data);
					},
					error : function (XMLHttpRequest, textStatus, errorThrown) {
						console.log('ERROR: Update Category Fail.');
					}
				});

			},
			error : function (XMLHttpRequest, textStatus, errorThrown) {
				console.log('ERROR: Get Category Error.');
			}
		});	

	});

	$('#cat-tmall').click(function(){
  var target = [
      '旅行箱包', '个人洗护', '厨房电器', '生活电器', '个人护理',
      '精品家具', '商业办公家具','灯饰照明','厨卫装修','五金电工',
      '精品家纺','真丝床品','厨房餐饮','婴幼用品',
      '家庭器械','计生用品'
    ];

    var handler = $(this).attr('data');

    $.ajax({
      url : 'http://www.tmall.com/go/rgn/mfp2012/all-cat-asyn.php',
      type : 'GET',
      success : function(dom, status) {
        var rto = {};
        var nextJobs=[];
        nextJobs["首页"]=[];
        target.forEach( function(name) {
          var node = $(dom).find("a:contains("+name+")");
          // node.attr("href");
          nextJobs["首页"].push(node.attr("href"));
        // console.dir( rto );
      });


      // tmall_getCagteory(1,null,nextJobs);

       async.waterfall([  
          function(callback){  
            console.log("第一层开始");
            tmall_getCagteory(1,null,nextJobs,callback);
          },  
          function(upperParantCat,upperResultCat,level,jobs,callback){  
              console.log("第二层开始");
              tmall_getCagteory(level,upperResultCat,jobs,callback);
                
          }
	   ], function (err,upperParantCat,upperResultCat,level,nextJobs) {  
	          console.log("天猫目录更新end");
	          for(var subCat in upperResultCat){
	            rto[subCat]=upperResultCat[subCat];
	          }
	          console.log("更新结果");
	          console.log(rto);
	          
	          /*--------------------start 结果提交到服务器-----------------------*/
	        var sendData = {};
			sendData.handler = handler
			sendData.category = rto;

			console.dir(sendData);

			$.ajax({
				url : SERVER + 'updateCategory',
				type : 'POST',
				data : JSON.stringify(sendData),
				success : function(data, status){
					console.log(data);
				},
				error : function (XMLHttpRequest, textStatus, errorThrown) {
					console.log('ERROR: Update Category Fail.');
					}
			});
				/*--------------------end 结果提交到服务器-----------------------*/
	          // result now equals 'done'  
	      });  


	      },
	      error : function (XMLHttpRequest, textStatus, errorThrown) {
	        console.log('ERROR: Get Category Error.');
	      }
	    }); 
	});
	
		/*
	* jobs     => [paranCagtegoryName[subCagtegoryURLs]]
	* callback => 
	*/
	function tmall_getCagteory(level,upperCagtegory,jobs,callback){
	  
	    var nextJobs=[];
	    var resultCat=[];
	    console.log(resultCat);
	    console.dir(jobs);
	    var finishedParentCatNum=0;//完成的父目录分析数
	    var jobsLength=0;
	    for(var parentCagtegory0 in jobs){
	        jobsLength++;
	    }
	    var catFinishedUrlNum=[];
	    for(var parentCagtegory in jobs){
	    resultCat[parentCagtegory]=[];
	    catFinishedUrlNum[parentCagtegory]=0;
	    jobs[parentCagtegory].forEach(function(url){
	      var parentCagtegoryName=parentCagtegory;
	      http_agent(url,{type: 'GET'}, function(err, domdoc){//访问子目录的URL
	          if(err){
	            console.log(err);
	          }
	          // console.log("当前分析URL"+url);
	         domdoc=domdoc.substring(domdoc.indexOf("<"));
	        // 获取目录名
	          var category = [];
	          var categoryURL = [];
	          $(domdoc).find('#J_CrumbSlideCon a').each(function(){
	            if($(this).text!=""){      
	                  //面包屑中的目录名  
	                  category.push( $(this)[0].text );   
	                  //面包屑中该目录名对应的链接,为了防止URL不与实际层次对应
	                   // $(this)[0].attr("href");    
	                  categoryURL.push($(this).attr("href"));       
	            }
	          });
	          if($.inArray(category[level],resultCat[parentCagtegoryName])==-1){
	            resultCat[parentCagtegoryName].push(category[level]);
	             // nextJobs.push(category[level]);
	            nextJobs[category[level]]=[];
	             var subCatUrls=[];
	            // if(false){
	            if(category.length!=(level+1)){
	                //url指定level目录链接
	               http_agent("http://list.tmall.com/search_product.htm"+categoryURL[level],{type: 'GET'}, function(err, domdoc){
	               	if(domdoc instanceof Object){
	               		console.log(domdoc);
	               	}
	                 domdoc=domdoc.substring(domdoc.indexOf("<"));
	                  $(domdoc).find('div.j_Cate.attr a').each(function(){
	                    subCatUrls.push("http://list.tmall.com/search_product.htm"+$(this).attr("href"));
	                    nextJobs[category[level]].push("http://list.tmall.com/search_product.htm"+$(this).attr("href"));     
	                  });
	                  // nextJobs[category[level]].push(subCatUrls);     
	                  catFinishedUrlNum[parentCagtegoryName]++;
	                  console.log(catFinishedUrlNum);
	                  if(catFinishedUrlNum[parentCagtegoryName]==(jobs[parentCagtegoryName].length)){
	                    finishedParentCatNum++;               
	                    console.log(finishedParentCatNum);
	                    if(finishedParentCatNum==jobsLength){
	                      console.log(level+"层目录获取，任务结束");
	                        console.log(resultCat);
	                        console.log(nextJobs);
	                      callback(null,upperCagtegory,resultCat,level+1,nextJobs);
	                    }
	                      // callback();
	                  } 
	                });
	            }
	            else{
	               // Get Category Info for InfoPage
	                  $(domdoc).find('div.j_Cate.attr a').each(function(){
	                    subCatUrls.push("http://list.tmall.com/search_product.htm"+$(this).attr("href"));
	                    nextJobs[category[level]].push("http://list.tmall.com/search_product.htm"+$(this).attr("href"));     
	                  });
	                  // nextJobs[category[level]].push(subCatUrls);     
	                // }
	                  catFinishedUrlNum[parentCagtegoryName]++;
	                  console.log(catFinishedUrlNum);
	                  if(catFinishedUrlNum[parentCagtegoryName]==(jobs[parentCagtegoryName].length)){
	                      console.dir(nextJobs);
	                      finishedParentCatNum++;
	                      console.log(finishedParentCatNum);
	                      if(finishedParentCatNum==jobsLength){
	                        console.log(level+"层目录获取，任务结束");
	                        console.log(resultCat);
	                        console.log(nextJobs);
	                         callback(null,upperCagtegory,resultCat,level+1,nextJobs);
	                      }
	                  }
	            }
	          }
	          else{
	           catFinishedUrlNum[parentCagtegoryName]++;
	           console.log(catFinishedUrlNum);
	                  if(catFinishedUrlNum[parentCagtegoryName]==(jobs[parentCagtegoryName].length)){
	                      console.dir(nextJobs);
	                      finishedParentCatNum++;
	                      console.log(finishedParentCatNum);
	                      if(finishedParentCatNum==jobsLength){
	                        console.log(level+"层目录获取，任务结束");
	                        console.log(resultCat);
	                        console.log(nextJobs);
	                        callback(null,upperCagtegory,resultCat,level+1,nextJobs);
	                      }
	                    } 
	            }
	       });
	      });
	  }
	}



});