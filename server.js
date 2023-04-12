const http = require('http')
const fs = require('fs')
const url = require('url')

http.createServer((request, response) => {
    let address = request.url,
        q = url.parse(address, true)
        filePath = '';

    fs.appendFile('log.txt', 'URL: ' + address + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
        if (err){
            console.log(err);
        } else {
            console.log('Added to log.');
        }
    });

if (q.pathname.includes('documentation')){
    filePath = (_dirname + '/documentation.html');
    } else {
        filePath = 'index.html';
    }

    fs.readFile(filePath, (err, data) => {
        if (err){
            throw err;
        }

        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
    });
    
}).listen(8080);
console.log('My first Node test server is running on Port 8080.');