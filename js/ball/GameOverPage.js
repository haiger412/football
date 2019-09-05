import Box from "./Box.js"
export default class GameOverPage extends Box{
  
  show = false;

  onInit(){
    //背景
    this.bgimg = wx.createImage();
    this.bgimg.onload = () => {
      this.w = this.bgimg.width;
      this.h = this.bgimg.height;
    } 
    this.bgimg.src = "img/gameover/bg.png";

    //时间到
    this.timeupimg = wx.createImage();
    this.timeupimg.src = "img/gameover/timeup.png";
    this.timeup_offset_top = 100 * this.dpr;

    //使用复活
    this.realiveimg = wx.createImage();
    this.realiveimg.src = "img/gameover/realive.png";
    this.realiveimg.onload=()=>{
        this.realive.width = this.realiveimg.width * (this.dpr - 1);
        this.realive.left = (this.box_w - this.realive.width) / 2;
        this.realive.height = this.realiveimg.height * (this.dpr - 1);
      this.realive.bottom = -(100 * this.dpr + this.realive.height + 50 * this.dpr);
    };
    //跳过
    this.skipimg = wx.createImage();
    this.skipimg.src = "img/gameover/skip.png";
    this.skipimg.onload=()=>{
      this.skip.width = this.skipimg.width * (this.dpr - 1);
      this.skip.left = (this.box_w - this.skip.width) / 2;
      this.skip.height = this.skipimg.height * (this.dpr - 1);
      this.skip.bottom = - 100 * this.dpr;
    }
    //得分
    this.scores.x = this.box_w/2;
    this.scores.y = -(this.box_h - this.timeup_offset_top*2);
    this.scores.font = this.dpr * 24 +"px 微软雅黑";
    this.scores.pre_text = "金币 ";
    this.scores.color = "white";
  }
  update(){
    if (this.show == false )return;
    this.repaint();
  } 
  realive={};
  skip={};
  scores={};
  repaint(){
    //绘制背景。
    this.cxt.drawImage(this.bgimg, 0, 0, this.box_w, this.box_h);
    //参数设置。
    
    this.cxt.save();
    this.cxt.translate(0, this.box_h);// 
    //时间到
    this.cxt.drawImage(this.timeupimg, (this.box_w - this.timeupimg.width) / 2, -(this.box_h - this.timeup_offset_top));
   //具体得分：
    this.cxt.font = this.scores.font;
    this.cxt.fillStyle = this.scores.color;
    this.cxt.lineWidth = "2";
    this.cxt.textAlign = "center";//文字居中。
    this.cxt.textBaseline = "middle";//文字居中。
    this.cxt.fillText(this.scores.pre_text+this.scores.total, this.scores.x, this.scores.y);

    this.cxt.drawImage(this.realiveimg, this.realive.left, this.realive.bottom, this.realive.width,  this.realive.height ); //height
    //点击跳过。
    this.cxt.drawImage(this.skipimg, this.skip.left, this.skip.bottom, this.skip.width, this.skip.height );
    this.cxt.restore();
  }

  setScores(total){
     this.scores.total = total;
  }
  setEventListener(listener){ 
      this.listener = listener;
  }
  /**
   * 由于没有组件和事件的实现。
   * 需要自己定位置来实现点击事件。
   * 当背景隐藏时，事件无效。
   * 当背景显示时，事件才有作用。
   * @param pageX 事件的发生的x坐标。
   * @param pageY 事件发生的y坐标。
   */
  onClick(pageX,pageY){
    if (this.show == false) return;
    //console.info("--over  进来---");
    pageX = pageX * this.dpr;
    pageY = pageY*this.dpr - this.box_h;
      //先检测 点击跳过是否被点击。
      //再检测 使用复活是否被点
    let triggleflag = false;
    if (pageX >= this.realive.left && pageX <= this.realive.left + this.realive.width ){
      if (pageY >= this.realive.bottom && pageY <= this.realive.bottom + this.realive.height){
         triggleflag = true;
      }
    }

    if (pageX >= this.skip.left && pageX <= this.skip.left + this.skip.width) {
      if (pageY >= this.skip.bottom && pageY <= this.skip.bottom + this.skip.height) {
          triggleflag = true;
      } 
    }

    //回调。
    if (triggleflag){
        this.showPage(false);
        //调用结束游戏或者开始游戏那妞。
      if ( this.listener && typeof this.listener.onRestart =="function"){
        this.listener.onRestart();
      }
    }
     
  }

  /**
   * 显示 
   */
  showPage(flag){
    this.show = flag;
    this.update();
  }
     
}