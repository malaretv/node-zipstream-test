/* 
 * Zip Stream Test... the simpler version
 * 
 * Sets up a barebones server that when it receives a request
 * responds by streaming a compressed version of some files
 *
 */

var http = require('http'),
	fs = require('fs')
	zipstream = require('zipstream');

var server = http.createServer(function(req, res) {
	console.log('Request Received');
    var zip = zipstream.createZip({ level: 1 });
    zip.pipe(res);
    
    var files = [
    	'main.js',
    	'package.json'
    ]
    addFiles(zip, files)();
});

function addFiles(zip, files) {
	var f = files.pop();
	if(f) {
		return function() {
			console.log('... compressing ' + f + ' ...');
			zip.addFile(fs.createReadStream(f), {name: f}, addFiles(zip, files));
		}
	} else {
		
		return function() {
			console.log('Finalizing stream');
			zip.finalize(function(written) { console.log(written + ' total bytes written'); });
		}
	}
}

server.listen(8181);