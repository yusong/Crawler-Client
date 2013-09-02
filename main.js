require(['modules/worker', 'tools/jquery-1.9.1.min', 'modules/http_agent', 'modules/async'], function(worker, jq, agent, async) {

	chrome.browserAction.onClicked.addListener( worker.turn_on_off.bind(worker) );
	worker.turn_on_off();

	// cnt = 0;
	// queue = async.tqueue(function(){
	// 		cnt++;
	// 		if( cnt % 4 == 0 ) {
	// 			return true;
	// 		} else {
	// 			return false;
	// 		}
	// 	}, function(item, callback){
	// 		console.log('Deal with item: ' + item + ' cnt=' + cnt);
	// }, 3);
	// queue.push('a1');
	// queue.push('b2');
	// queue.push('c3');
	// queue.push('d4');
	// queue.push('e5');
	// queue.push('f6');
	// queue.push('g7');
	// queue.push('h8');
	// queue.push('i9');
	// queue.push('j10');
	// queue.push('k11');
	// queue.push('l12');
	// queue.push('m13');
	// queue.push('n14');


	// $.ajax({
	// 	url : 'http://weibo.com/u/2813262187?wvr=5',
	// 	type : 'GET',
	// 	success : function(data, status){
 //            console.log(data);
	// 		data = data.replace(/[\n\r\f\t\v]/g, '');
	// 		data = data.match(/FM.view\((.*?)}\)/g);

	// 		for( var i in data ){
	// 			data[i] = data[i].substring(8, data[i].length-1);
	// 			data[i] = JSON.parse(data[i]);
	// 		}
	// 		console.dir(data);
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
	// 	// url:'http://list.jd.com/652-654-7170-0-0-0-0-0-0-0-1-1-2-1.html',
	// 	url : 'http://list.jd.com/652-654-7170.html',
	// 	type : 'POST',
	// 	success : function(data, status){
	// 		$(data).find('.pagin-m').each(function() {
	// 				console.log($(this))
	// 				$(this).find('.text').each(function() {
	// 					$(this).find('i').each(function() {
	// 						current = parseInt($(this).html());
	// 						console.log('current='+current);
	// 					});
	// 					number = parseInt($(this).html().match(/\/(\d+)/)[1]);
	// 					console.log('number='+number);
	// 				});
	// 				$(this).find('.next').each(function() {
	// 					url = $(this).attr("href").replace(/(\d+)-(\d+)\.html/, '');
	// 					console.log('url='+url);
	// 				});

	// 				for( var i = current+1; i <= number; i++ ){
	// 					console.log( 'http://list.jd.com/' + url + i + '-1.html' );
	// 				}
	// 			});
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