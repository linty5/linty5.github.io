// JavaScript Document//为鸟构造函数
var Bird = function (img,x,y,speed,a,ctx){
    this.img = img;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.a =a ;
    this.ctx = ctx;
    this.index = 0;
}

Bird.prototype.init = function(img,x,y,speed,a,ctx){
    this.img = img;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.a =a ;
    this.ctx = ctx;
    this.index = 0;
}
 
Bird.prototype.draw = function (){
    //save是保存一次状态 这保存所有的canvas 上下文属性。
    //restore 恢复上一次save的状态，从堆栈里面推出一个状态。
    this.ctx.save();
 
    this.ctx.translate(this.x ,this.y);
    this.ctx.rotate((Math.PI /6) * this.speed / 0.3 );
 
    this.ctx.drawImage(
        this.img,52*this.index,0,52,45,
        -52/2,-45/2,52,45
    )
    this.ctx.restore();
}
var durgather=0;
Bird.prototype.update = function(dt){
    durgather+=dt;
    if(durgather>100){
        this.index++;
        if(this.index===2){
             this.index=0;
        }
      durgather -= 100;
    }
    this.speed = this.speed + this.a *dt;
    this.y = this.y + this.speed * dt;
}