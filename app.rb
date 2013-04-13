require "vertx"
require "json"
include Vertx

rm = RouteMatcher.new
eb = Vertx::EventBus
pa = "vertx.mongopersistor"


mongo_config = {
  "host" => "ds033307.mongolab.com",
  "port" => 33307,
  "db_name" => "flow",
  "username" => "flowuser",
  "password" => "flow1234"
}

rm.get("/test") do |req|
  req.response.end("hello world!")
end

rm.get("/network/:code") do |req|
  code = req.params()["code"]
  puts "Looking for : #{code}"

  action = "findone"
  matcher = {"Code" => code}
  wrapper = {
    "collection" => "network",
    "action" => action,
    "matcher" => matcher
  }

  eb.send(pa, wrapper) do |reply|
    result = reply.body
    req.response.end("#{result.to_json}")
  end
end

rm.get("/networks") do |req|
  puts "getting all networks"

  action = "find"
  matcher = {}
  wrapper = {"collection" => "network",
              "action" => action,
              "matcher" => matcher
  }

  eb.send(pa, wrapper) do |reply|
    result = reply.body
    req.response.end("#{result.to_json}")
  end
end

rm.get("/tms/:id") do |req|
  id = req.params()["id"]
  puts "ID: " + id
  url = "/v1/programs/" + id + "?api_key=h5t2xh7qeu6un2e86arp7673"

  client = HttpClient.new
  client.port = 80
  client.host = "data.tmsapi.com"

  client.get_now(url) do |res|
    puts "Response code: #{res.status_code}"

    res.body_handler do |buffer|
      req.response.end("#{buffer}")
    end
  end
end

rm.get_re('.*') do |req|
  req.response.send_file("index.html");
end

Vertx.deploy_module("vertx.mongo-persistor-v1.2", mongo_config) do
  puts "configed!"
end

HttpServer.new.request_handler(rm).listen(8080, "localhost")


