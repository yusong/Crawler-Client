define(['modules/http_agent', 
		'modules/handler/fetchers/tmall',
		'modules/handler/fetchers/jingdong',
		'modules/handler/fetchers/weibo'], 
		function(http_agent, tmall, jingdong, weibo) {


	var Fetcher = function() {

		var _self = this;

		/* Create Jingdong Fetcher */
		_self.jingdong = jingdong;

		/* Create Tmall Fetcher */
		_self.tmall = tmall;

		/* Create Weibo Fetcher */
		_self.weibo = weibo;
		
	};

	return new Fetcher();

});