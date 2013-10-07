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

	/* Submit a Task */
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
	});

	/* Update JingDong Category */
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

	/* Tamll' Category that We Want */
	var TMALL_CAT = {
		'旅行箱包':     'lx',
		'男士护肤':     'hf',
		'个人洗护':     'xh',
		'厨房电器':     'cf',
		'生活电器':     'sh',
		'个人护理':     'hl',
		'精品家具':     'jj',
		'灯饰照明':     'zm',
		'厨卫装修':     'cw',
		'五金电工':     'wj',
		'精品家纺':     'jf',
		'冬季床品':     'cp',
		'布艺软饰':     'by',    
		'家居饰品':     'sp',
		'居家日用':     'ry',
		'厨房餐饮':     'cy',
		'计生用品':     'js'
	};

	/* Get The List of Tmall's Category */
	$(document).on('click', '#get-tmall-cat', function(){
		$.ajax({
			url:'http://www.tmall.com/go/rgn/mfp2012/all-cat-asyn.php',
			get:'GET',
			success: function(data){

				var cat = {};
				var zNodes = [];

				$(data).find('.subItem').each(function(){
					var self = $(this);
					var first = self.find('.subItem-hd a').html();
					cat[first] = {};

					self.find('.subItem-cat a').each(function(){
						var second = $(this);
						cat[first][second.html()] = second.attr('href');
					});
				});

				console.log(cat);

				for(var first in cat) {
					if( first in TMALL_CAT ) {
						zNodes.push({ id: first, pId: 0, name: first });
						for(var second in cat[first]) {
							zNodes.push({
								id: second, pId: first,
								name: second,
								url : cat[first][second],
								target : '_blank',
							});
						}
					}
				}

				var setting = {
					check: { enable: true, chkboxType: { Y : 'ps', N : 'ps' } },
					data: { simpleData: { enable: true } }
				};

				$.fn.zTree.init($("#show"), setting, zNodes);
			},
			error:function(data){
				console.log('error');
			}
		});
	});

	/* Submit Tasks of Tmall */
	$(document).on('click', '#submit-tmall-task', function(){
		var nodes = $('li.level1');
		var tasks = [];
		var rto = {};
		nodes.each(function(){
			var flag = $(this).find('span.chk').hasClass('checkbox_true_full');
			if( flag ) {
				var task = {};
				task.category = [];
				task.category.push( $(this).parent().siblings('a').attr('title') );
				task.category.push( $(this).find('a').attr('title') );
				task.urls = [ $(this).find('a').attr('href') ];
				task.handler = 'tmall';
				tasks.push( task );
			}			
		});
		rto.tasks = tasks;

		$.ajax({
			url : SERVER + 'submitTask',
			type: 'POST',
			data: JSON.stringify( rto ),
			success: function(data){
				console.log('submit success', data);
			},
			error: function(data){
				console.log('submit error', data);
			}
		});
	});

	/* Update Tmall's Category of MongoDB */
	$(document).on('click', '#update-tmall-cat', function() {
		$.ajax({
			url:'http://www.tmall.com/go/rgn/mfp2012/all-cat-asyn.php',
			get:'GET',
			success: function(data){
				var cat = {};
				$(data).find('.subItem').each(function(){
					var self = $(this);
					var first = self.find('.subItem-hd a').html();
					if( first in TMALL_CAT ) {
						cat[first] = [];
						self.find('.subItem-cat a').each(function(){
							var second = $(this);
							cat[first].push( second.html() );
						});
					}					
				});

				var sendData = {};
				sendData.handler = 'tmall'
				sendData.category = cat;

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
			error:function(data){
				console.log('ERROR: GET Tmall Category File Fail.');
			}
		});
	});		

});