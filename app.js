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

rm.get('/name', function(req) {
	req.response.end('{"name":"don"}');
});

rm.get('/test', function(req) {
	var action = 'findone';
	var matcher = {"Code" : "CTN"};

	var wrapper = {"collection" : "network",
					"action" : action,
					"matcher" : matcher};

	//console.log(JSON.stringify(wrapper));

	eb.send('vertx.mongopersistor', wrapper, function(reply) {
		//console.log(JSON.stringify(reply.result));
		var result = reply.result;
		req.response.end(JSON.stringify(result));
	})

});

rm.get('/echo/:name', function(req) {
	var name = req.params()['name'];
	req.response.end('{"name":"' + name + '"}');
	//req.resonse.end('test');
});

rm.getWithRegEx('.*', function(req) {
	req.response.sendFile("index.html");
});

vertx.deployModule('vertx.mongo-persistor-v1.2', config, 1, function() {
  console.log('configed');
});

vertx.createHttpServer().requestHandler(rm).listen(8080);

