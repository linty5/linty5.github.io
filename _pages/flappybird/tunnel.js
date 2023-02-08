// JavaScript Document//管道的构造函数
var Tunnel=function(up,down,x,speed,ctx){
	this.up=up;
	this.down=down;
	this.x=x;
	this.speed=speed;
	this.ctx=ctx;
	//随机产生管道的高度最低100，最高300
	this.height=Math.random()*200+100;
	this.checked=false;
	this.score=0;
}

Tunnel.prototype.init=function(up,down,x,speed,ctx){
	this.up=up;
	this.down=down;
	this.x=x;
	this.speed=speed;
	this.ctx=ctx;
	//随机产生管道的高度最低100，最高300
	this.height=Math.random()*200+100;
	this.score=0;
}

Tunnel.prototype.check_score=function(start_posx){
	if(!this.checked){
		if(this.x<start_posx){
			this.checked = true;
			this.score += 1;
		}
	}
}

Tunnel.prototype.draw=function(){
	//绘制上方的管道 -420原因是管道的高为420px
	this.ctx.drawImage(
		this.up,this.x,this.height-420
		)
	//绘制下方的管道
	this.ctx.drawImage(
		this.down,this.x,this.height+150
		)
}
//数量，间隔
Tunnel.prototype.setNum=function(num,step){
	Tunnel.num=num;
	Tunnel.step=step;
}
Tunnel.prototype.update=function(dt){
	this.x=this.x+this.speed*dt;
	if(this.x<-52){
		this.x=this.x+Tunnel.num*Tunnel.step;
		this.height = Math.random() *200 + 150;
		this.checked = false;
	}
		
}
 
Tunnel.prototype.Collide=function(x,y){
	return ( x>this.x && x<this.x+52 ) && (!( y>this.height && y<this.height+150));
}