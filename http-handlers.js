var fs = require('fs');
var zlib = require('zlib');
var path = require('path');

module.exports = {
    serveHtml: function(req, res) {
        var pathToHtml = __dirname + '/public/index.html';
        fs.stat(pathToHtml, function(err, stats) {
            if (err) {
                throw err;
            }

            if (stats.isFile()) {
                fs.readFile(pathToHtml, function(err, template) {
                    if (err) {
                        throw err;
                    }
                    res.writeHead(200, {
                        'Content-Type': 'text/html',
                        'Content-Length': Buffer.byteLength(template)
                    });
                    res.write(template.toString());
                    res.end();
                });
            }
        });
    },

    serveStatic: function(req, res) {
        var pathToFile = __dirname + '/public' + req.url;

        if (req.url === '/favicon.ico') {
            res.end();
            return
        }

        fs.stat(pathToFile, function(err, stats) {
            if (err) {
                throw err;
            }
            if (stats.isFile()) {
                fs.readFile(pathToFile, function(err, fileContent) {
                    if (err) {
                        throw err;
                    }
                    var extension = path.extname(req.url);
                    switch (extension) {
                        case '.js':
                            res.writeHead(200, {
                                'Content-Type': 'text/javascript',
                                'Content-Length': Buffer.byteLength(fileContent)
                            });
                            break;
                        case '.css':
                            res.writeHead(200, {
                                'Content-Type': 'text/css',
                                'Content-Length': Buffer.byteLength(fileContent)
                            });
                            break;
                    }
                    res.write(fileContent.toString());
                    res.end();
                });  
            }
        });


    }
};
