import Box from "./Box.js"
export default class GameStartPage extends Box{
  
  show = true;//游戏开始前的启动画面，肯定要为true。只显示一次。包括重新开始都不会显示。除非重新进来一次。

  start = {};
  share = {};
  ball = {};
  onInit(){
    //背景
    this.bgimg = wx.createImage();
    this.bgimg.onload = () => {
      this.w = this.bgimg.width;
      this.h = this.bgimg.height;
      this.repaint();
    } 
    this.bgimg.src = "img/gamestart/bg.png";
     
    //标题：疯狂的毽子。
    this.gametitleimg = wx.createImage();
    this.gametitleimg.src = "img/gamestart/gametitle.png";
    this.gametitle_offset_top = 100 * this.dpr;
   
    //毽子
    this.ballimg = wx.createImage();
    this.ballimg.src = "img/gamestart/ball.png";
    this.ballimg.onload=()=>{
        //居中显示。
        this.ball.width = this.ballimg.width *  (this.dpr+1);
        this.ball.left = (this.box_w - this.ball.width) / 2;
        this.ball.height = this.ballimg.height * (this.dpr + 1);
        this.ball.bottom = -(this.box_h +  this.ball.height )/2;
        //console.info(this.ball);
        this.repaint();
    };

    //开始游戏按钮。
    this.startimg = wx.createImage();
    this.startimg.src = "img/gamestart/start.png";
    this.startimg.onload=()=>{
        this.start.width = this.startimg.width * (this.dpr - 1);
        this.start.left = (this.box_w - this.start.width) / 2;
        this.start.height = this.startimg.height * (this.dpr - 1);
        this.start.bottom = -(100 * this.dpr + this.start.height + 50 * this.dpr);
        this.repaint();
    };   
    //分享文字链接。
    this.shareimg = wx.createImage();
    this.shareimg.src = "img/gamestart/share.png";
    this.shareimg.onload=()=>{
      this.share.width = this.shareimg.width * (this.dpr - 1);
      this.share.left = (this.box_w - this.share.width) / 2;
      this.share.height = this.shareimg.height * (this.dpr - 1);
      this.share.bottom = -100 * this.dpr;
      this.repaint();
    }

 
  }
  update(){
    if (this.show == false )return;
    this.repaint();
  } 
  repaint(){
    //绘制背景。
    this.cxt.drawImage(this.bgimg, 0, 0, this.box_w, this.box_h);
    //参数设置。
    
    this.cxt.save();
    this.cxt.translate(0, this.box_h);// 
     //标题：疯狂的毽子。
    this.cxt.drawImage(this.gametitleimg, (this.box_w - this.gametitleimg.width) / 2, -(this.box_h - this.gametitle_offset_top));
    //毽子显示
    this.cxt.drawImage(this.ballimg, this.ball.left, this.ball.bottom,this.ball.width,this.ball.height);
    //开始游戏按钮。
    this.cxt.drawImage(this.startimg, this.start.left, this.start.bottom, this.start.width,  this.start.height ); //height
    //分享文字链接。
    this.cxt.drawImage(this.shareimg, this.share.left, this.share.bottom, this.share.width, this.share.height );
    this.cxt.restore(); 
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
    //console.info("--gamestart  进来---");
    pageX = pageX * this.dpr;
    pageY = pageY*this.dpr - this.box_h;
      //先检测 点击跳过是否被点击。
      //再检测 使用复活是否被点
    let startflag = false;
    let shareflag = false;
    if (pageX >= this.start.left && pageX <= this.start.left + this.start.width ){
      if (pageY >= this.start.bottom && pageY <= this.start.bottom + this.start.height){
        startflag = true;
      } 
    } 

    if (pageX >= this.share.left && pageX <= this.share.left + this.share.width) {
      if (pageY >= this.share.bottom && pageY <= this.share.bottom + this.share.height) {
        shareflag = true;
      }  
    } 

    //回调开始游戏。
    if (startflag){
        this.showPage(false);
        //调用结束游戏或者开始游戏那妞。
      if ( this.listener && typeof this.listener.onStart =="function"){
        this.listener.onStart();
      }
    }
    if(shareflag){
      if (this.listener && typeof this.listener.onShare == "function") {
        this.listener.onShare();
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