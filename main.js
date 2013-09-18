require(['modules/worker', 'tools/jquery-1.9.1.min', 'modules/http_agent', 'modules/async'], function(worker, jq, agent, async) {

	chrome.browserAction.onClicked.addListener( worker.turn_on_off.bind(worker) );
	worker.turn_on_off();

});