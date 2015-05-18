var fs = require('fs');
var http = require('http');
var url = require('url');
var path = require('path');
var formidable=require('formidable');
var querystring = require('querystring');
var resStatic = require('./static/static.js');

var db='db.json';


http.createServer(function(req, res) {
	var reqUrl = url.parse(req.url);
	switch (reqUrl.pathname) {
		case '/':
			resStatic(reqUrl.pathname, req, res);
			break;
		case '/api/words/all':
			resAllWords(req, res);
			break;
		case '/api/words/add':
			resAddWords(req,res);
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
			words.sort(function(a,b){
				return b.value-a.value;
			})
			body.words = words;

			res.writeHead(200, 'Ok', {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify(body));
		})
	})
}
function resAddWords(req,res){
	var form=new formidable.IncomingForm();
	form.on('file',function(name,file){
		generateWords(file.path);
	});
	form.on('end',function(){
		res.setHeader('Content-Type','text/plain');
		res.write('upload complete');
		res.end('util.inspect(files)');
	})
	form.parse(req);	
}	
function isFormData(req){
	var type=req.headers['content-type']||'';
	return 0==type.indexOf('multipart/form-data');	
}
function generateWords(path) {
	var wordReg = /[A-Za-z]+/g;
	var db = 'db.json';

	fs.readFile(path, function(err, data) {
		var text = data.toString().toLowerCase();
		var wordsRow = text.match(wordReg);

		fs.exists(db, function(exists) {
			if (exists) {
				fs.readFile(db, function(err, data) {
					if (err) throw err;
					var wordsDb = JSON.parse(data.toString() || '{}');
					saveWords(wordsRow, wordsDb,db);
				});
			} else {
				saveWords(wordsRow, {
				},db);
			}
		});
	});
}

function saveWords(wordsRow, wordsDb,db) {
	wordsRow.forEach(function(e, i) {
		if (!wordsDb[e]) {
			wordsDb[e] = 10;
			// wordsDb._length += 1;
		}
	});
	fs.writeFile(db, JSON.stringify(wordsDb), 'utf8', function(err) {
		console.timeEnd(1);
		if (err) throw err;
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




// console.log('saved');