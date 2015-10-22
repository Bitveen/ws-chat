var WebSocketServer = require('ws').Server;
var redis = require('redis');
var uuid = require('node-uuid');
var httpHandlers = require('./http-handlers');
var http = require('http');

//var redisClient = redis.createClient();
//var wsServer = new WebSocketServer({ port: 8181 });

http.createServer(function(req, res) {
    if (req.url === '/') {
        httpHandlers.serveHtml(req, res);
    } else {
        httpHandlers.serveStatic(req, res);
    }
}).listen(8080);


