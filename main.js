require(['modules/worker', 'tools/jquery-1.9.1.min'], function(worker, jq) {

	chrome.browserAction.onClicked.addListener( worker.turn_on_off.bind(worker) );
	worker.turn_on_off();

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