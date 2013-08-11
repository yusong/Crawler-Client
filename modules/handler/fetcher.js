define(function(){

	var Fetcher = function() {

		var _self = this;

		_self.jingdong = function() {};

		_self.jingdong.hello = function() {
			console.log('_self.jingdong.prototype.hello');
		};

	};

	return new Fetcher();

});