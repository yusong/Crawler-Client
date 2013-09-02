define([], function(){
	
	var Queues = {

		jingdong : {
			timeSlice: 0,
			lastTime: null
		},
		tmall : {
			timeSlice: 2000,
			lastTime: null
		},
		weibo : {
			timeSlice: 0,
			lastTime: null
		}

	};

	console.dir(Queues);
	return Queues;

});