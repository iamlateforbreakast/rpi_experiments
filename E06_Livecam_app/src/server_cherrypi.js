var http = require('http').createServer(handler) ;
/* fs is the function to access the harddrive*/
var url = require('url');
var fs = require('fs');
var io = require('socket.io').listen(http);
var util = require('util');
var mysocket; //set up a global to keep track between calls
var SerialPort = require("serialport");
var baud = 9600;
var port = '/dev/ttyAMA0';//'/dev/ttyACM0'  # adjust this port for your RPi
var radioResp = "nothing";
var radioOn = 0;
var RaspiCam = require("raspicam");
var serialPort = new SerialPort.SerialPort(port,{baudrate: 9600 });
var mpg321 = require('mpg321');
var player = mpg321().remote();
var playorstop = false;
var filename = "";
var filename1 = "";
var camera = new RaspiCam({mode:"photo",
                           output:"/home/pi/nodejs_photo1.jpg",
                           encoding: "jpg",
                           timeout: 1,
                           exposure:"auto"	
						   });

                           
camera.on("start", function(){
        console.log("LOG: photo started");
});

camera.on("read", function( err, timestamp, f ){
        console.log("LOG: photo image captured with filename: " + f );
        camera.stop();
        //setTimeout(function() {camera.stop();}, 5000);
	//setTimeout(function() {mysocket.emit('Photo taken', { Picfilename: filename.replace("~","") });}, 5000);
});

camera.on("stop", function(){
        console.log("LOG: Stopped taking picture: ");
});

camera.on("exit", function(){
        console.log("photo child process has exited at "); // added an exit function as a test
});

serialPort.on('data', function(data) {
            console.log('Serial Port: data received: ' + data);
            radioResp = radioResp + data;
});

//This function takes the picture
function TakePicture(){
	filename = "/home/pi/nodejs_photo"+Math.floor((Math.random()*100)+1)+".jpg";
        //filename = "nodejs_photo1.jpg"
	camera.set("output",filename);
        console.log("output is set to", camera.get("output"));
        camera.start();
        setTimeout(function() {
                      console.log('Blah blah blah blah extra-blah');
                      mysocket.emit('Photo taken', { Picfilename: filename });
                      }, 3000);
        //setTimeout(function() {mysocket.emit('Photo taken', { Picfilename: filename.replace("~","") });camera.stop();}, 5000);
        console.log("taking picture");
}

//This function sends the picture taken and displays it according to writehead and logs it.
function SendPicture(resp){
      console.log("Sending picture");
      filename1 = camera.get("output");
      var myPicture = fs.readFileSync(filename1);//"/home/pi/nodejs_photo1.jpg");
      resp.writeHead(200, {"Content-Type": "image/jpeg"} );
      resp.end(myPicture,'binary');
      console.log("Picture 1 is sent");
      console.timeEnd("start");
}
function ListMP3(){
     var fileList = [];
     console.log('got to ListMP3');
     console.log('The current directory is : ' + __dirname);
      fs.realpath(__dirname, function(err, path){
        if (err){ 
         console.log(err);
         return;
        }
       console.log('Path is : ' + path);
      }); 
       fs.readdir(__dirname, function(err, files){
       if(err) return;
       files.filter(function(f) { return f.substr(-4) === '.mp3'; })
         .forEach(function(f) { 
          console.log('Files: ' + f);
          fileList.push(f);
        });
        console.log('fileList length : '+ fileList.length);
        console.log('fileList : '+ fileList);
        mysocket.emit('listMp3', fileList, playorstop);
       });
     }

//This function sends the html file home page
function SendHtmlDoc(resp){
   var myhtml = fs.readFileSync("/home/pi/index.html","utf8" );
   resp.writeHead(200,{"Content-Type": "text/html"} );
   
   //filename.replace("~","")
  // resp.end(myhtml);
   resp.end(myhtml.replace("rhubarb","cherrypi"));
}
//Send any other file requested
function SendOtherFile(resp, file){
	console.log("sending other file " + file);
    var myfile = fs.readFileSync("/home/pi"+file);
	resp.writeHead(200,{"Content-Type": "text/html"});
	resp.end(myfile);
}
//send back the style sheet for the html
function SendCssDoc(resp){
   var mycss = fs.readFileSync("/home/pi/mystylesheet.css");
   resp.writeHead(200,{"Content-Type": "text/css"} );
   resp.end(mycss);
}
//This function returns the raphael script that is on the server ie draw shape.
function SendJavascript(resp){
   var myscript = fs.readFileSync("/home/pi/raphael-min.js");
   resp.writeHead(200,{"Content-Type": "text/script"} );
   resp.end(myscript,'utf-8');
}

//This function returns the data entered on the HTML web screen.
function getData(resp,url_parts){
 	writePilite(url_parts.query.myname);
	resp.end("Data submitted by the user name:  " + url_parts.query.myname);
	console.log(url_parts.query.myname);
}
//This function sends the data entered on the HTML web screen out the serial port.
function RadioSensorData(resp,url_parts){
 	writeRadio(url_parts.query.myname);
    console.log("Open serial port for radio call" + url_parts.query.myname);
	resp.end("Data Sent to Radio  " + url_parts.query.myname);
	console.log(url_parts.query.myname);
}

function RadioSensorDataDisp(resp){
    //console.log("Open serial port for radio call" + radioResp);
	resp.end("Radio Response from Sensor:  " + radioResp);
	console.log(radioResp);
}
//This function plays mp3 file selected on the webpage
function playMP3(resp,mp3list){
     console.log('got to playMP3 ' + mp3list);
     //mp3list.foreach(function(file){
     //player.play("./app/Harvest.mp3");
     //if ((playorstop === false) && (mp3list.length != 0)){ 
        player.play("app/" + mp3list);
     //}
     //else{ 
     //  player.stop()
     //  playorstop === false;
   //  }
     //console.log("currently playing" + file);
   //}  
  //);
}    

//This function is to write out the data entered on web screen to piLite serial port

function writePilite(message){
   	    serialPort.on("open", function () {
	    console.log("Open serial port Pilite");
        console.log(baud.toString());
        serialPort.write(message.toString('utf8'));
 		//serialPort.DiscardOutBuffer();
        //serialPort.close();
       });
	   serialPort.on("close", function() {
	      console.log("Closed serial port");
	      });  
}
function writeRadio(message){
  	   serialPort.write(message.toString('utf8'));
}

//This is the main handler function for all the calls to the server
function handler(req,resp) {
  var url_parts = url.parse(req.url,true);
  //console.log(url_parts);
  console.log("LOG: Serving file" + url_parts.pathname);
  console.time("start");
 // A web page always looks first for an icon "favicon" to display in the tab in the brower, this returns an icon
  if(req.url === '/favicon.ico'){
    resp.writeHead(200, {'Content-Type':'image/x-icon'});
    return resp.end();
  }
  //Send the photo to the browser
  else if(req.url === '/nodejs_photo1.jpg'){
	SendPicture(resp);
    return resp;
  }
  //send the raphael script to draw the shape on the browser  
  else  if(req.url === '/raphael-min.js'){
    SendJavascript(resp);
    return resp;
  }
  else  if(req.url === '/mystylesheet.css'){
    console.log("this is the stylesheet"+ req.url);
	SendCssDoc(resp);
    return resp;
  }
  //send back the data entered on the html screen to display on another page.
  else if(url_parts.pathname === '/getData'){//checks that if the url has a pathname of /getData
      console.log("THis is parts bit" + url_parts.query.myname);
	  getData(resp,url_parts);//call the getData() function
  }
  //return response to calling browser application.
  else if(url_parts.pathname === '/RadioSensorData'){//checks that if the url has a pathname of /RadioSensorData
      radioOn=1;
      console.log("THis is radio bit" + url_parts.pathname);
	  RadioSensorData(resp,url_parts);//call the RadioSensorData() function
  }
  else if(url_parts.pathname === '/RadioSensorDatadisp'){//checks that if the url has a pathname of /RadioSensorDatadisp
      radioOn=0;
      RadioSensorDataDisp(resp);//call the RadioSensorDataDisp() function
  }
  else if(url_parts.pathname === '/selectaction'){
      if((url_parts.query.mp3files ==="List Of MP3 Files") || (url_parts.query.mp3files == 0)){ //this is not a selection its the list header
           console.log("This is parts bit" + url_parts.query.mp3files);
      }
      else{
        console.log("THis is parts bit" + url_parts.query.mp3files);
         if (playorstop === false) {
           if(url_parts.query.mp3files != 0){ 
             playMP3(resp,url_parts.query.mp3files);
             playorstop = true;
             console.log('playing status' + playorstop);
             //resp.end("Data submitted " + url_parts.query.mp3files);     
             SendHtmlDoc(resp);
           }
                       
        }
        else{
           player.stop();
           playorstop = false;
           SendHtmlDoc(resp);
                 
        }     
        return resp;
      } 
  }
  console.log("URL Match " + req.url);
  if (req.url.match(/photo/g))
  {
	  SendPicture(resp);
	  return resp;
  } else if (req.url != '/'){
	// Send another file
	SendOtherFile(resp,req.url);  
  }
  else
  {
	// Send the default HTML page
    SendHtmlDoc(resp);
  }
  //
};
http.listen(8080);
// Code for the io socket
io.sockets.on('connection', function(socket) 
{
   mysocket = socket; //intialising our global 
   console.log('got to the socket listen function');
   socket.emit('news', { hello: 'Hi Im Cherrypi!' });
   socket.on('picture', function(data) 
   {
      console.log('taking picture now');
      TakePicture();
    });
    socket.on('audiofile', function(data) 
   {
      console.log('checking for audio');
      ListMP3();
   });
    // Poll the radio sensors once a second
    if (radioOn === 1) {
      setInterval(function () {
          var queryRadio = "aX2TEMP-----aX1LVAL-----"; 
          serialPort.write(queryRadio.toString('utf8'));
          var res = radioResp.substr(7, 5) + "C"; //remove the header of response string
          var res2 = radioResp.substr(19,5) + "%";
          res = "Temp " +res + " " + "Light "+res2;
          if( res !== "C"){ //got a response
            console.log("radio write and read here" + radioResp);
            socket.emit('radio', { temp : res});
          }
          radioResp ="";
       }, 3000);
    }; 
});

