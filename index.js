var fs = require('fs');
var http = require('http');
var url = require('url');
var path=require('path');

http.createServer(function(req, res) {
	var reqUrl = url.parse(req.url);
	switch (reqUrl.pathname) {
		case '/':
			resStatic('index.html',res);
			break;
		case '/api/words':
			resStatic(reqUrl.pathname,res);
			break;
		default:
			resStatic(reqUrl.pathname,res);
	}
	// res.end(JSON.stringify(url1) + '/n');	
}).listen(3000);

function resStatic (pathname,res) {
	var realPath=path.join('public',pathname);
	// console.log(realPath);
	fs.exists(realPath,function(exists){
		if (!exists){
			console.log(realPath);
			res.writeHead(404,{
				'Content-Type':'text/plain'
			});

			res.write('This request URL '+pathname+' was not found');
			res.end();
		}else{
			fs.readFile(realPath,function(err,data){
				if (err) {
					res.writeHead(500,{
						'Content-Type':'text/plain'
					});
					res.end('err');
				}else{
					res.writeHead(200,{
						'Content-Type':'text/html'
					});
					res.write(data);
					res.end();
				}
			})
		}
	})
}






/*

var wordReg = /[A-Za-z]+/g;
var db = 'db.json';
var script = 'word.srt';

console.time(1);

function getWords() {
	fs.readFile(script, function(err, data) {
		var text = data.toString().toLowerCase();
		var wordsRow = text.match(wordReg);

		fs.exists(db, function(exists) {
			if (exists) {
				fs.readFile(db, function(err, data) {
					if (err) throw err;

					var wordsDb = JSON.parse(data.toString() || '{}');
					// console.log(wordsDb);
					if (!wordsDb._length) wordsDb._length = 0;

					saveWords(wordsRow, wordsDb);

				});
			} else {

				saveWords(wordsRow, {
					_length: 0
				});

			}

		});
	});
}

setTimeout(function() {
	reduceWordValue('gett')
}, 2);

function reduceWordValue(word) {
	fs.readFile(db, function(err, data) {
		if (err) throw err;

		var wordsDb = JSON.parse(data.toString());

		wordsDb[word] ? wordsDb[word] /= 2 : wordsDb[word] = 10;

		saveWords([], wordsDb);
	})
}



function saveWords(wordsRow, wordsDb) {
	wordsRow.forEach(function(e, i) {
		if (!wordsDb[e]) {
			wordsDb[e] = 10;
			wordsDb._length += 1;
		}
	});
	// console.log(wordsDb,wordsRow);
	fs.writeFile(db, JSON.stringify(wordsDb), 'utf8', function(err) {
		console.timeEnd(1);
		if (err) throw err;
	})
}

// console.log('saved');


*/