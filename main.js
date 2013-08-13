require(['modules/worker', 'tools/jquery-1.9.1.min', 'modules/http_agent'], function(worker, jq, agent) {

	// chrome.browserAction.onClicked.addListener( worker.turn_on_off.bind(worker) );
	// worker.turn_on_off();

	agent('http://weibo.com/u/2813262187', {type: 'POST', header: 'true'}, function(err, result){
		console.log('hello world');
	});

	// $.ajax({
	// 	url : 'http://weibo.com/u/2813262187',
	// 	type : 'GET',
	// 	success : function(data, status){
	// 		console.log(data);
	// 	},
	// 	error : function (XMLHttpRequest, textStatus, errorThrown) {
	// 		console.log('ERROR');
	// 	}
	// });

	// $.ajax({
	// 	url : 'http://www.tmall.com/go/rgn/mfp2012/all-cat-asyn.php',
	// 	type : 'GET',
	// 	success : function(data, status){
	// 		// console.log(data);
	// 		// $(data).find('.j_SubView .subItem .subItem-cat a').each(function(){
	// 		// 	console.log($(this).attr("href") + $(this).html());
	// 		// });
	// 			console.log($(data).find('.j_SubView .subItem .subItem-cat a'));
	// 	},
	// 	error : function (XMLHttpRequest, textStatus, errorThrown) {
	// 		console.log('ERROR');
	// 	}
	// });

	// $.ajax({
	// 	url : 'http://channel.jd.com/kitchenware.html',
	// 	type : 'POST',
	// 	success : function(data, status){
	// 		console.log(data);
	// 		$(data).find('div#sortlist .con a').each(function(){
	// 			console.log($(this).attr("href") + $(this).attr("title"));
	// 		});
	// 	},
	// 	error : function (XMLHttpRequest, textStatus, errorThrown) {
	// 		console.log('ERROR');
	// 	}
	// });

	// $.ajax({
	// 	url : 'http://list.jd.com/6196-6197-6199-0-0-0-0-0-0-0-1-1-1-1.html',
	// 	type : 'POST',
	// 	success : function(data, status){
	// 		$(data).find('#plist li .p-name a').each(function(){
	// 			console.log($(this).attr("href"));
	// 		});
	// 		$(data).find('.pagin-m .next').each(function(){
	// 			console.log($(this).attr("href"));
	// 		});
	// 	},
	// 	error : function (XMLHttpRequest, textStatus, errorThrown) {
	// 		console.log('ERROR');
	// 	}
	// });

	// $.ajax({
	// 	url : 'http://item.jd.com/207551.html',
	// 	type : 'GET',
	// 	success : function(data, status){
	// 		// console.log(data);

	// 		var productInfo = {};
	// 		productInfo.name = $(data).find('#name h1').html(); // 商品名
	// 		console.dir(productInfo);
			
	// 	},
	// 	error : function (XMLHttpRequest, textStatus, errorThrown) {
	// 		console.log('ERROR');
	// 	}
	// });

});