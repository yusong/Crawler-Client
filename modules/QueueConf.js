define([], function(){
	
	var Queues = {

		jingdong : {
			timeSlice: 0,
			lastTime: null
		},
		tmall : {
			timeSlice: 0,
			lastTime: null
		},
		weibo : {
			timeSlice: 0,
			lastTime: null
		}

	};

	return Queues;

});