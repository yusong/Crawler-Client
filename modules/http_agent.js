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

		if( option && option.headers ) {

			if( option.headers.Cookie ) {
				option.headers.Cookie = option.headers.Cookie.join(';');
			}

			chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {

				var exist = false;
				/* Set Headers, Add option.headers to details.requestHeaders */
				for (var i = 0; i < details.requestHeaders.length; i++) {
				    if ( option.headers[details.requestHeaders[i].name] ) {
						details.requestHeaders[i].value = option.headers[details.requestHeaders[i].name];
				   	}
				}

				if(option.headers.Referer && option.headers.Referer.length) {
					for (var i = 0; i < details.requestHeaders.length; ++i) {
						if (details.requestHeaders[i].name === 'Referer') {
							exist = true;
							if(details.requestHeaders[i].value != option.headers.Referer){
							    details.requestHeaders[i].value = option.headers.Referer ;
						    }
							break;
						}
				    }
					if( !exist ) {
						details.requestHeaders.push({name:'Referer', value:option.headers.Referer});
					}
				}
				return {requestHeaders: details.requestHeaders};
			// }, {urls: [url]}, ["blocking", "requestHeaders"]);
			
			}, {urls: ["<all_urls>"]}, ["blocking", "requestHeaders"]);
		}

		var arg = {
			url : url,
			type : (option && option.type) ? option.type : 'GET',
			data : (option && option.data) ? option.data : null,
			success : function(data) { 
				callback(null, data); 
			},
      		error :function(data){
            	callback(null,data);
            }
  		};
    	if(option.method) arg.type = option.method;
   		if(option.payload) arg.data = option.payload;
  		$.ajax(arg);

	};

	return http_agent;

});