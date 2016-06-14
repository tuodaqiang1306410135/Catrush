var express=require("express");
var app=express();
var server=require("http").createServer(app);
var io=require("socket.io").listen(server);
var level=0;
var time=0;
var players=new Array();
app.use('/',express.static(__dirname));
server.listen(80);
console.log("server started");

function Player(name){
	this.name=name;
}

function timecount(){
	if(time<300){
		io.sockets.emit("timecount",time,players.length);
		time++;
		setTimeout(timecount,1000);
	}else{
		level++;
		if(level>1)
			level=0;
		io.sockets.emit("changemap",level);
		time=0;
		timecount();
	}
}
timecount();

	function update(){
		var t=Math.random()*3000+3000;
		io.sockets.emit("check");
		setTimeout(update,t);
	}
	setTimeout(update,3000);

io.on("connection",function(socket){

	socket.on("postInfo",function(pos,sprite,name){
		socket.broadcast.emit("getInfo",pos,sprite,socket.index,name);
	});
	socket.on("setName",function(name){
		for(var i=0;i<players.length;i++){
			if(name==players[i].name){
				socket.emit("nameerror");
				return;
			}
		}
		socket.index=players.length;
		socket.name=name;
		players.push(new Player(name));
		console.log(name+" is connected");
		socket.emit("loginsuccess",level,time,players.length);
	});
	socket.on("push",function(name,bl){
		socket.broadcast.emit("pushPlayer",name,bl);
	});
	socket.on("up",function(name,spd){
		socket.broadcast.emit("Playerup",name,spd);
	});
	socket.on("close",function(name){
		socket.broadcast.emit("logout",name);
		for(var i=0;i<players.length;i++){
			if(players[i].name==name){
				players.splice(i,1);
			}
		}
		console.log(name+" is disconnected");
	});
	socket.on("throw",function(name,dir){
		socket.broadcast.emit("bethrow",name,dir);
	});
})

