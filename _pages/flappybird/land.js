//Land构造函数 
var Land=function(img,x,speed,ctx){
	this.img=img;
	this.x=x;
	this.speed=speed;
	this.ctx=ctx;
}
Land.prototype.draw=function () {
	//画出背景land，设置左上角坐标
	this.ctx.drawImage(
		this.img,this.x,488
		)
}
Land.prototype.setNum=function (num) {
	Land.num=num;
}
Land.prototype.update=function(dt){
	this.x=this.x+this.speed*dt;
	console.log(this.x);
	if(this.x<-336){
		this.x=this.x+Land.num*336;
	}
}