var fs = require('fs');
var http = require('http');
var url = require('url');
var path = require('path');
var zlib = require('zlib');
var resStatic=require('./static');
var mime = require('./mime').types;
var config = require('./config');

module.exports=function resStatic(pathname, req, res) {
	var realPath = path.join('public', pathname);
	fs.stat(realPath, function(err, stats) {
		// console.log(realPath,stats);
		if (err) {
			console.log(err);
			res.writeHead(404, 'Not Found', {
				'Content-Type': 'text/html'
			});
			res.end('This request URL ' + pathname + ' was not found');
			return;
		}
		if (stats.isDirectory()) {
			realPath = path.join(pathname,config.welcome.file);
			resStatic(realPath,req,res);								//这一句一定要有，不然地址改变了，但是stat没有改变，会造成所引用的stat一直是改变地址之前的文件/文件夹的stat
			return ;
		}
		var ext = path.extname(realPath);
		ext = ext ? ext.slice(1) : 'unknown';

		if (ext.match(config.Expires.fileMatch)) {
			var expires = new Date();
			expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
			res.setHeader('Expires', expires.toString());
			res.setHeader('Cache-Control', 'max-age=' + config.Expires.maxAge);
		}

		var lastModified = stats.mtime.toUTCString();
		res.setHeader('Last-Modified', lastModified);

		if (req.headers['if-modified-since'] && lastModified == req.headers['if-modified-since']) {
			res.writeHead(304, 'Not Modified');
			res.end();
		} else {
			var raw = fs.createReadStream(realPath);
			var acceptEncoding = req.headers['accept-encoding'] || '';
			var matched = ext.match(config.compress.match);
			if (matched && acceptEncoding.match(/\bgzip\b/)) {
				res.writeHead(200, 'Ok', {
					'Content-Encoding': 'gzip',
				});
				raw.pipe(zlib.createGzip()).pipe(res);
			} else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
				res.writeHead(200, 'Ok', {
					'Content-Encoding': 'deflate',
				});
				raw.pipe(zlib.createDlate()).pipe(res);
			} else {
				res.writeHead(200, {
					'Content-Type': mime[ext]
				});
				raw.pipe(res);
			}
		}

	});
}