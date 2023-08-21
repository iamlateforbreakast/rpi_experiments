const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8080;

app.get('/', function(req, res) {
   res.sendFile(__dirname + "/index.html");
});

app.get('/raphael-min.js', function(req, res) {
   res.sendFile(__dirname + "/raphael-min.js");
});

server.listen(port, function() {
   console.log(`Listening on port ${port}`);
});

//io.on('connection', function(socket) {
//  console.log('user connected');
//  socket.on('disconnect', function () {
//    console.log('user disconnected');
//  });
//})

io.on('connection', function (socket) {
    console.log("Got connection");
    counter = 0;
    setInterval(function () {
       counter = counter + 1;
       console.log("Counting " + counter);
       socket.emit('counter', { 'val': counter });
        }, 500);
});

