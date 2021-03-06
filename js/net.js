var isReady=false;
this.socket.on("nameerror",function(){
	document.getElementById("tips").innerHTML="你输入的昵称已经有人在用了";
});

this.socket.on("loginsuccess",function(level,time,pc){
	var p=new Player(new Position(maps[e.level].startpos.x,maps[e.level].startpos.y),0,document.getElementById("text").value,0);
	e.Players.push(p);
	isReady=true;
	document.getElementById("ipt").style.display="none";
	e.canvas.style.display="block";
	e.level=level;
	e.time=time;
	e.playercount=pc;
	e.run();
});

this.socket.on("getInfo",function(pos,sprite,socekt_index,name,left,right){
	if(isReady){
		for(var i=0;i<e.Players.length;i++){
			if(e.Players[i].name==name){
				e.Players[i].position=pos;
				e.Players[i].sprite=e.Resource.pic[sprite];
				e.Players[i].left=left;
				e.Players[i].right=right;
				if(sprite==7||sprite==14)
					e.Players[i].col_height=18;
				else
					e.Players[i].col_height=28;
				return;
			}
		}
		e.Players.push(new Player(pos,sprite,name,e.Players.length));
	}
});

this.socket.on("timecount",function(time,pc){
	e.time=time;
	e.playercount=pc;
})

this.socket.on("pushPlayer",function(name,dir){
	if(e.Players[0].name==name){
		e.Players[0].push(dir);
	}
})

this.socket.on("Playerup",function(name,spd){
	if(e.Players[0].name==name){
		e.Players[0].vv=spd;
	}
});

this.socket.on("logout",function(name){
	for(var i=0;i<e.Players.length;i++){
		if(e.Players[i].name==name){
			e.Players.splice(i,1);
		}
	}
});

this.socket.on("check",function(Player){
	e.ischeck=true;
});

this.socket.on("bethrow",function(name,dir){
	if(e.Players[0].name==name){
		e.Players[0].bethrow(dir);
	}
});

this.socket.on("changemap",function(level){
	e.level=level;
	e.Cubes=maps[e.level].Cubes;
	if(e.Players.length>0){
		for(var i=0;i<e.Players.length;i++){
			e.Players[i].win=false;
		}
		e.Players[0].position=new Position(maps[e.level].startpos.x,maps[e.level].startpos.y);
	}
});


this.socket.on("sbwin",function(name){
	for(var i=0;i<e.Players.length;i++){
		if(e.Players[i].name==name){
			e.Players[i].win=true;
		}
	}
});

this.socket.on("postmsg",function(name,msg){
	e.content.value=e.content.value+name+":"+msg+"\r\n";
	for(var i=0;i<e.Players.length;i++){
		if(e.Players[i].name==name){
			e.Players[i].sayct=0;
			e.Players[i].saysth=true;
			e.Players[i].saymsg=msg;
		}
	}
});