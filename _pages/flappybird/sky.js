// JavaScript Document//同Land类似设置sky的构造函数
var Sky=function (img,x,speed,ctx) {
	this.img=img;
	this.x=x;
	this.speed=speed;
	this.ctx=ctx;
}


Sky.prototype.draw=function() {
	this.ctx.drawImage(
		this.img,this.x,0
	)
}
//背景向左以规定速度移动，当地图完全消失时，重新设置x坐标为起点
//设置地图的数目
Sky.prototype.setNum=function(num){
	Sky.num=num;
}

Sky.prototype.update=function(duration){
	this.x=this.x+this.speed*duration;
	if(this.x<-800){
		this.x=Sky.num*800+this.x;
	}
}
