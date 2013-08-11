require(['modules/worker'], function(worker) {

	chrome.browserAction.onClicked.addListener( worker.turn_on_off.bind(worker) );
	worker.turn_on_off();

});