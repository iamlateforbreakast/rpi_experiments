// const app = require('express')();
// const server = require('http').createServer(app);
// const io = require('socket.io')(server);
// const port = process.env.PORT || 8080;
var http = require('http').createServer(handler) ;
var io = require('socket.io').listen(http);
var fs = require('fs');
var counter; 

// app.get('/', function(req, res) {
//   res.sendfile('index.html');
// });
function SendHtmlDoc(resp){
   var myhtml = fs.readFileSync("/home/pi/app/CountingApp/index.html");
   resp.writeHead(200,{"Content-Type": "text/html"} );
   resp.end(myhtml);
}

function SendJavascript(resp){
   var myscript = fs.readFileSync("/home/pi/raphael-min.js");
   resp.writeHead(200,{"Content-Type": "text/script"} );
   resp.end(myscript,'utf-8');
}

function handler(req,resp) {
 // A web page always looks first for an icon "favicon" to display in the tab in the brower, this returns an icon
  if(req.url === '/favicon.ico'){
    resp.writeHead(200, {'Content-Type':'image/x-icon'});
    return resp.end();
  }
  else  if(req.url === '/raphael-min.js'){
    SendJavascript(resp);
    return resp;
  }
  else {
    SendHtmlDoc(resp);
  }
};

// server.listen(port, function() {
//   console.log(`Listening on port ${port}`);
// });
http.listen(8080);

//io.on('connection', (socket) => {
//  console.log('user connected');
//  socket.on('disconnect', function () {
//    console.log('user disconnected');
//  });
//})

io.sockets.on('connection', function (socket) {
 
    //socket.on('message', function (message) {
        console.log("Got connection");
        counter = 0;
        setInterval(function () {
          counter = counter + 1;
          console.log("Counting " + counter);
          socket.emit('counter', { 'val': counter });
        }, 500);
        
    //});

});

