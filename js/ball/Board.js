import Position from "./Position.js"
import Box from "./Box.js"

export default class Board extends Box{
  showflag = false;//是否显示出来。
  w = 0;
  h = 0;
  offset_x = 0;
  offset_y1 = 0;
  offset_y2 = 0;
  boardstatus= null;//篮板状态。
  debugmode = false;
  constructor( ) {
    super();
  }
  onInit(path,halfofdownimgpath) {
    this.w = 100 *  this.dpr;
    this.h = 120 * this.dpr;
    this.offset_x = 25 * this.dpr;
    this.offset_y1 = 60 * this.dpr; 
    this.offset_y2 = 75 * this.dpr;
    this.img = wx.createImage(); 
    this.img.onload = () => {
      //this.repaint();
    }
    this.img.src = path;

    this.halfimg={};
    this.halfimg.img= wx.createImage(); 
    this.halfimg.img.src = halfofdownimgpath;
    this.halfimg.w = this.w - this.offset_x - this.dpr;
    this.halfimg.h = 10*this.dpr;
  }
 
  show(flag = true) {
    if (flag) {
      this.repaint();
    }
  }
  

  updateXY(x, y) {
    this.x = x;
    this.y = y;
    this.updatePosi();
  }

  updateY(y) {
    this.y = y;
    this.updatePosi( );
  }
  dir = "up";
  moveUpAndDown(){
  
    if (this.dir =="down"){
       this.y+=3; 
      if (this.y > -(150 * this.dpr)){
         this.dir = "up";
      }
    }else if(this.dir =="up"){
      this.y -= 3;
      if (this.y < -(this.box_h - 150 *this.dpr)) {
        this.dir = "down";
      }
    }
  }

  //私有方法。外界不应该调用。
  updatePosi() {
     throw new Error("请子类覆盖这个方法");
  }
  //私有方法。
  repaint() {
    this.cxt.save();
    this.cxt.beginPath();
    this.cxt.translate(0, this.box_h);//设置画布上的(0,0)位置
    this.drawImage();
    this.cxt.strokeStyle = "blue";
    this.drawOutline();
    this.cxt.stroke();
    this.cxt.closePath();
    this.cxt.restore();

  }

  drawOutline(){
    throw new Error("请子类覆盖这个方法");
  }

  //私有方法。
  lineTo(pos) {
    this.cxt.lineTo(pos.x, pos.y);
  }
  setStatus(status){
    this.boardstatus = status;
    if(status =="up"){
       this.onstartCross();
    }else if(status ==null){

    }
  }
  getStatus(){
    return this.boardstatus();
  }
  
  clearStatus(){
    this.setStatus(null);
  }
}