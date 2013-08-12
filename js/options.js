(function(){

	/* Get Handler */
	$.ajax({
		url : 'http://127.0.0.1:8000/getHandler',
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

}());