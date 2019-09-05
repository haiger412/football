/**
 * 动画对象。
 * 所有由多张图组成的动画类都应该继承这个类。
 * 例如：草、蜜蜂、蝴蝶、白云。
 * 变化的参数主要有两个：图片帧、位置。
 * 图片帧：一个物体动态效果的每个动作分解图。例如：草有3张图。蜜蜂有5张。
 *        通过刷图，实现动态效果。
 * 位置：位置就是物体的运动轨迹。
 * 
 * 在此游戏中，每个素材的参数变化如下：
 * 白云：只有一静态图。位置变化即可。运动轨迹是在天空飘来飘去。上下左右。考虑穿墙。
 * 草：3张静态图，需要一定时间来刷。位置不需要变化。
 * 蜜蜂： 5张图，刷，位置需要变化。并且蜜蜂围着花儿转。运动轨迹比较繁琐。
 * 蝴蝶： 5张图，刷，位置需要比那话。围着草来转。运动轨迹比较繁琐。
 * 
 * 物体的绘制点：左上角。
 * 
 */
import Box from "./Box.js" 
import Utils from "./Utils.js"
export default class AniObject extends Box{
  startindex = 0;//起始
  timestrap = 0;
  maxtimestrap = 8;
  imgs = [];
  x = 0;
  y = 0;
  w = 0;
  h = 0;
  gerneratemaxtimesstrapFlag = false;
  constructor( ) {
     super();
  }
  //生成随机帧率。
  generateFrameP() {
    this.maxtimestrap = Utils.randomInt(10, 25);
    this.gerneratemaxtimesstrapFlag = true;
  }

  onInit(imgspath, maxtimestrap=5) {
    if (this.gerneratemaxtimesstrapFlag == false ){
      this.maxtimestrap = maxtimestrap;
    }
    this.maxindex = imgspath.length;
    for (let i = 0; i < imgspath.length; i++) {
      this.imgs[i] = wx.createImage();
      this.imgs[i].onload = (e) => {
        this.w = e.target.width;
        this.h = e.target.height;
      } 
      this.imgs[i].src = imgspath[i];
    }
  }

 
  repaint() {
    let img = this.imgs[this.startindex];
    this.cxt.save();
    this.cxt.beginPath();
    this.cxt.translate(0, this.box_h);//设置画布上的(0,0)位置 
    this.cxt.drawImage(img, this.x, this.y);
    this.cxt.restore();  
  }

  update() {
    this.repaint();
    this.timestrap++;
    if (this.timestrap == this.maxtimestrap) {
      this.timestrap = 0;
      this.startindex++;
      if (this.startindex == this.maxindex) this.startindex = 0;
    }
  }

  move(x,y){
     return this.X(x).Y(y);
  }

  X(x){
    this.x = x;
    return this;
  }

  XStep(x) {
    this.x += x;
    return this;
  }

  Y(y) {
    this.y = y;
    return this;
  }
  YStep(y) {
    this.y += y;
    return this;
  }
}