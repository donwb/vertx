load('vertx.js');

var res = '{"response": "ok"}';

vertx.createHttpServer().requestHandler(function (req) {
	req.response.end(res);
}).listen(8080, 'localhost');

