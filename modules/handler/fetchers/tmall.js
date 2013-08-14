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


	return new Tmall();

});