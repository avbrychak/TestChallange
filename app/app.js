var http = require('http'),
    fs = require('fs'),
    // NEVER use a Sync function except at start-up!
    index = fs.readFileSync(__dirname + '/index.html');
var socketServer = require('socket.io');
var request = require("request");

// Send index.html to all requests
var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});

var io = socketServer.listen(app);

var spawn = require('child_process').spawn,
    ls = spawn('python',['main.py', "/dev/pts/22"]);

ls.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
    request({
    	url: 'https://polar-falls-75205.herokuapp.com/api/bill_status',
    	method: "POST",
    	json: JSON.parse(data.toString())
		}, function (error, response, body){
        });
    io.emit('credit', { credit: data.toString() });
});

app.listen(3001);
