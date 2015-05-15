var fs = require('fs');
var http = require('http');
var url = require('url');
var path = require('path');
var zlib = require('zlib');
var querystring = require('querystring');
var resStatic = require('./static/static.js');
// var resIndex=require('./route/index');
// var mime = require('./mime').types;
// var config = require('./config');

http.createServer(function(req, res) {
	var reqUrl = url.parse(req.url);
	switch (reqUrl.pathname) {
		case '/':
			resStatic(reqUrl.pathname, req, res);
			break;
		case '/api/words/all':
			resAllWords(req, res);
			break;
		case '/api/word/disapear':
			disapearWord(req, res);
			break;
		case '/api/word/remember':
			rememberWord(req,res);
			break;
		case '/api/word/forget':
			forgetWord(req,res);
			break;
		default:
			resStatic(reqUrl.pathname, req, res);
	}
	// res.end(JSON.stringify(url1) + '/n');	
}).listen(3000);



var wordReg = /[A-Za-z]+/g;
var db = 'db.json';
var script = 'word.srt';


function resAllWords(req, res) {
	fs.stat(db, function(err, stats) {
		if (err) {
			res.writeHead(404, 'Not Found', {
				'Content-Type': 'application/json'
			});
			res.end('[]');
			return;
		}
		fs.readFile(db, function(err, data) {
			data = JSON.parse(data.toString());
			var body = {
				length: 0
			};
			var words = [];
			for (var w in data) {
				if (data[w] > 0) {
					words.push({
						word: w,
						value: data[w]
					});
					body.length++;
				}
			}
			body.words = words;
			res.writeHead(200, 'Ok', {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify(body));
		})
	})
}

function disapearWord(req, res) {
	var query = '';
	req.on('data', function(chunk) {
		query += chunk;
	}).on('end', function() {
		query = querystring.parse(query);
		fs.stat(db, function(err, stats) {
			if (err) {
				res.writeHead(404, 'Not Found', {
					'Content-Type': 'text/plain'
				});
				res.end('[]');
				return;
				// console.log('err');
			}
			fs.readFile(db, function(err, data) {
				data = JSON.parse(data.toString());

				// console.log(data[query.word]);
				data[query.word] = -1;

				fs.writeFile(db, JSON.stringify(data), 'utf8', function(err) {
					// console.timeEnd(1);
					if (err) throw err;
				});
				res.writeHead(200, 'Ok', {
					'Content-Type': 'text/plain'
				});
				res.end('disapear '+query.word);
				console.log('disapear '+query.word);
			})
		})
	});
}
function rememberWord(req, res) {
	var query = '';
	req.on('data', function(chunk) {
		query += chunk;
	}).on('end', function() {
		query = querystring.parse(query);
		// console.log(typeof query, query);
		fs.stat(db, function(err, stats) {
			if (err) {
				res.writeHead(404, 'Not Found', {
					'Content-Type': 'text/plain'
				});
				res.end('[]');
				return;
				console.log('err');
			}
			fs.readFile(db, function(err, data) {
				data = JSON.parse(data.toString());

				// console.log(data[query.word]);
				data[query.word] /= 2;

				fs.writeFile(db, JSON.stringify(data), 'utf8', function(err) {
					// console.timeEnd(1);
					if (err) throw err;
				});
				res.writeHead(200, 'Ok', {
					'Content-Type': 'text/plain'
				});
				res.end('remember '+query.word);
				console.log('remember '+query.word);

			})
		})
	});
}
function forgetWord(req, res) {
	var query = '';
	req.on('data', function(chunk) {
		query += chunk;
	}).on('end', function() {
		query = querystring.parse(query);
		// console.log(typeof query, query);
		fs.stat(db, function(err, stats) {
			if (err) {
				res.writeHead(404, 'Not Found', {
					'Content-Type': 'text/plain'
				});
				res.end('[]');
				return;
				console.log('err');
			}
			fs.readFile(db, function(err, data) {
				data = JSON.parse(data.toString());

				// console.log(data[query.word]);
				data[query.word] *= 1.1;

				fs.writeFile(db, JSON.stringify(data), 'utf8', function(err) {
					// console.timeEnd(1);
					if (err) throw err;
				});
				res.writeHead(200, 'Ok', {
					'Content-Type': 'text/plain'
				});
				res.end('forget '+query.word);
				console.log('forget '+query.word);
			})
		})
	});
}

// resAllWords();
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
					// if (!wordsDb._length) wordsDb._length = 0;

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

// setTimeout(function() {
// 	reduceWordValue('gett')
// }, 2);

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