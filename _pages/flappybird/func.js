/**
 * @description: 用于canvas绘制按钮
 * @param {*} ctx canvas的2d对象上下文
 * @param {*} startPoint 按钮的左上角坐标点
 * @param {*} width 按钮的宽度
 * @param {*} height 按钮的高度
 * @param {*} radius 按钮的圆角
 * @param {*} borderColor 边框颜色
 * @param {*} backgroundColor 背景色
 * @param {*} text 按钮文字
 * @param {*} textColor 文字颜色
 * @param {*} fontSize 文字大小
 * @return {*}
 */
var drawButton = function(ctx, startPoint, width, height, radius, borderColor, backgroundColor, text, textColor, fontSize) {
  ctx.strokeStyle=borderColor;
  ctx.fillStyle=backgroundColor;
  ctx.beginPath();
  ctx.moveTo(startPoint.x, startPoint.y+radius);
  ctx.arcTo(startPoint.x, startPoint.y, startPoint.x+radius, startPoint.y,  radius);
  ctx.lineTo(startPoint.x+width-radius, startPoint.y)
  ctx.arcTo(startPoint.x+width, startPoint.y, startPoint.x+width, startPoint.y+radius,  radius);
  ctx.lineTo(startPoint.x+width, startPoint.y+height-radius)
  ctx.arcTo(startPoint.x+width, startPoint.y+height, startPoint.x+width-radius, startPoint.y+height,  radius);
  ctx.lineTo(startPoint.x+radius, startPoint.y+height)
  ctx.arcTo(startPoint.x, startPoint.y+height, startPoint.x, startPoint.y+height-radius, radius)
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  //ctx.fillStyle=textColor;
  //ctx.font = '${fontSize}px sans-serif';
  //ctx.textAlign='center';
  //ctx.textBaseline='middle';
  ctx.fillText(text, startPoint.x+width/2, startPoint.y+height/2);
}


