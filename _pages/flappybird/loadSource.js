// JavaScript Document
function load(source,callback){
	var imgs={};
	var imgCount=source.length;
	for(var i=0;i<imgCount;i++){
		var name=source[i].name;
		var newImg=new Image();
		newImg.src=source[i].src;
		imgs[name]=newImg;
		imgs[name].addEventListener('load',function(){
			imgCount--;
			if(imgCount==0){
				callback(imgs);
			}
		})
	}
}