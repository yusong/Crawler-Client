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

});