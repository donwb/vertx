load('vertx.js');

var rm = new vertx.RouteMatcher();
var eb = vertx.eventBus;
var pa = 'vertx.mongopersistor';

var config = {
	"host" : "ds033307.mongolab.com",
	"port" : 33307,
	"db_name" : "flow",
	"username" : "flowuser",
	"password" : "flow1234"
}


rm.get('/network/:code', function(req) {
	var code = req.params()['code'];

	console.log('finding network: ' + code);

	var action = 'findone';
	var matcher = {"Code" : code};

	var wrapper = {"collection" : "network",
					"action" : action,
					"matcher" : matcher};

	eb.send('vertx.mongopersistor', wrapper, function(reply) {
		// when doing a findone the result is wrapped in "result"
		var result = reply.result;
		req.response.end(JSON.stringify(result));
	})

});

rm.get('/networks', function(req) {
	console.log('finding all networks');

	var action = 'find';
	var matcher = {};
	var wrapper = {"collection" : "network", "action" : action, "matcher" : matcher};

	eb.send('vertx.mongopersistor', wrapper, function(reply) {
		// when doing a find, the result is wrapped in "results"
		var result = reply.results;
		req.response.end(JSON.stringify(result));
	})
});

rm.get('/tms/:id', function(req) {
	var id = req.params()['id'];
	var url = '/v1/programs/' + id + '?api_key=h5t2xh7qeu6un2e86arp7673';

	console.log('getting detail for: ' + id);


	vertx.createHttpClient()
		.setPort(80)
		.setHost('data.tmsapi.com')
		.getNow(url, function(res) {
		
		console.log('got response: ' + res.statusCode);
		res.bodyHandler(function(body) {
			req.response.end(body);
		});
	});
});

rm.get('/mu-3fb8ca5b-1a109a61-53cb32bd-c47e007e', function(req) {
	req.response.end('42');
})

rm.getWithRegEx('.*', function(req) {
	req.response.sendFile("index.html");
});

vertx.deployModule('vertx.mongo-persistor-v1.2', config, 1, function() {
  console.log('configed');
});

vertx.createHttpServer().requestHandler(rm).listen(8080);

