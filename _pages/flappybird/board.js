// JavaScript Document
var Board=function (img,x,bestscore,score,ctx) {
	this.img=img;
	this.x=x;
	this.bestscore=bestscore;
	this.score=score;
	this.ctx=ctx;
}

Board.prototype.draw=function(score) {
	this.ctx.drawImage(
		this.img,this.x,0
	)
	this.score=score;
	this.ctx.fillStyle = 'white';
	this.ctx.font = 'normal 12pt "微软雅黑"';
	this.ctx.fillText("Best : " + bestscore, 15, 25);
	this.ctx.fillText("Score: " + score, 15, 55);
}