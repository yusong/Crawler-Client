define(['tools/jquery-1.9.1.min'], function(){

	/**
	 * Using Jquery Ajax to Request a URL
	 *
	 * option = {
	 *		type : 'GET' | 'POST',
	 *		data : 'content string',
	 *		hreder : {}
	 * }
	 */
	var http_agent = function(url, option, callback) {

		var arg = {
			url : url,
			type : (option && option.type) ? option.type : 'GET',
			data : (option && option.data) ? option.data : null,
			success : function(data) { callback(null, data); }
		};
		$.ajax( arg ).fail(function(jqXHR, msg){
			callback(msg, null);
			console.dir(arg);
		});

	};

	return http_agent;

});