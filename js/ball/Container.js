import Box from "./Box.js"
import Ball from "./Ball.js"
import LeftBoard from "./LeftBoard.js"
import RightBoard from "./RightBoard.js"
import Utils from "./Utils.js"
import ScoresBar from "./ScoresBar.js"
import Background from "./Background.js"
import Music from "./Music.js"
import GrassGroup from "./GrassGroup.js"
import CloudGroup from "./CloudGroup.js"
import BeeGroup from "./BeeGroup.js"
import ButterflyGroup from "./ButterflyGroup.js"
import TimeBar from "./TimeBar.js"
import ServiceEvent from "../event/ServiceEvent.js"
import EventTimeCounter from "./EventTimeCounter.js"
import BallFacade from "./BallFacade.js"
import GameOverPage from "./GameOverPage.js"
import GameStartPage from "./GameStartPage.js"
/**
 * 画布坐标系x正方向向右，y正方向向下。
 * 原点在左下角。此坐标为世界坐标。绝对坐标。其它所有组件的坐标都相对当前坐标。
 */
export default class Container extends Box {
  speed = 40;
  gamestart = false;
  ball = null;
  leftboard = null;
  rightboard = null;
  showboard = "left";//当前展示的篮板。默认左篮板。
  cross_left_board_status = null;//穿越左篮板的状态标志变量。用于计算左篮板得分。
  cross_right_board_status = null;//穿越右篮板的状态标志变量。用于计算右篮板得分。
  scorebar = null;
  bg = null;
  music = null;//背景音乐
  callback = null;
  stopflag = true;//默认为true的原因是为了让渲染游戏开始界面。一旦点击开始游戏再修改为false。
  constructor( ) {  
    super();
  }
   
  onInit(... param){ 
    //初始化全局参数。
    Box.prototype.cavs = param[0];
    Box.prototype.box_w = param[1];
    Box.prototype.box_h = param[2];
    Box.prototype.cxt = param[3];
    Box.prototype.dpr = param[4];
    Box.prototype.container = param[5];//Container实例。

    
    //初始化其它组件。
    this.initGameStartPage().onInit();
    this.initBackground().onInit();//初始化背景。
    this.initMusic().onInit();//初始化背景音乐。
    this.initBall().onInit();//初始化小球。
    this.initScoreBar().onInit();//得分组件。
    this.initBoard().onInit(); 
    this.initGrassGroup().onInit();//草。
    this.initCloudGroup().onInit();
    this.initBeeGroup().onInit();
    this.initButterflyGroup().onInit();
    this.initTimeBar().onInit();
    this.initGameOverPage().onInit();
    //事件初始化
    this.initEvent(param[0]);
  }
 
   
  setEventListener(listener){
    if (! listener instanceof ServiceEvent){
      throw new RuntimeError("非法的事件实例，请实现ServiceEvent" + listener);
    }
    
    this.callback = listener;
    //立即回调onInit
    if (this.callback && typeof this.callback.onInit == "function"){
      this.callback.onInit(); 
    }
     //将当前容器对象，注意不是传进来的监听器。传入开始界面。因为点击开始后要回调修改标志位。
    this.gameoverpage.setEventListener(this);

    //将当前容器对象，注意不是传进来的监听器。传入开始界面。因为点击开始后要回调修改标志位。
    this.gamestartpage.setEventListener(this);
  }
  /**
   * 
   */
  onRestart(){
      this.startGame();
      //回调业务层的onRestart
      if (this.callback && typeof this.callback.onRestart == "function") {
         this.callback.onRestart();
      }
  }
  /**
   * 上面在启动界面设置了监听器。这里被回调。
   */
  onStart(){
      this.stopflag = false; 
      this.updateFrame();
      //回调业务层的onStart
      if (this.callback && typeof this.callback.onStart == "function") {
        this.callback.onStart();
      }
  }
  /**
   * 上面在启动界面设置了监听器。这里被回调。
   */
  onShare(){
     //回调业务层的onShare
    if (this.callback && typeof this.callback.onShare == "function") {
      this.callback.onShare();
    }
  }
  initGameStartPage(){
    this.gamestartpage = new  GameStartPage();
    return this.gamestartpage;
  }
  initBackground() {
    this.bg = new Background( );
    return this.bg;
  }
  initMusic() {
    this.music = new Music();
    return this.music;
  }
  initBall() {
    this.ball = new Ball( );
    this.ballfacade = new BallFacade(this.ball);
    return this.ball;
  }
  initBeeGroup(){
    this.beegroup = new BeeGroup();
    return this.beegroup;
  }
  initButterflyGroup(){
    this.butterflygroup = new ButterflyGroup();
    return this.butterflygroup;
  }
  initBoard() {
    this.leftboard = new LeftBoard( );
    this.rightboard = new RightBoard( );
    let _this = this; 
    this.board = {
      update() {
        if (_this.showboard == "left") {
          _this.leftboard.show(true);
          _this.rightboard.show(false);
        } else {
          _this.rightboard.show(true);
          _this.leftboard.show(false);
        }
      },
      update2(){
        if (_this.showboard == "left") {
          _this.leftboard.showlefthalf( ); 
        } else {
          _this.rightboard.showrighthalf( );  
        }
      },
      onInit(){
        _this.leftboard.onInit();
        _this.rightboard.onInit();
      },
      moveUpAndDown(){
        if (_this.showboard == "left") {
          _this.leftboard.moveUpAndDown();
        } else {
          _this.rightboard.moveUpAndDown();
        }
      }
    }
    return this.board;
  }
  initScoreBar() {
    this.scorebar = new ScoresBar();
    this.scorebar.setBallFacade(this.ballfacade);
    return this.scorebar;
  }
  initGrassGroup() {
    this.grassgroup = new GrassGroup();
    return this.grassgroup;
  }

  initCloudGroup() {
    this.cloudgroup = new CloudGroup();
    return this.cloudgroup;
  }
  initTimeBar(){
    this.timebar = new TimeBar();
    return this.timebar;
  }
  
  initGameOverPage(){
    this.gameoverpage = new GameOverPage();
    return this.gameoverpage;
  }
  initEvent(cavs) {
    let et = new EventTimeCounter();
    wx.onTouchStart((e) => {
      this.gamestartpage.onClick(e.touches[0].pageX, e.touches[0].pageY);
      this.gameoverpage.onClick(e.touches[0].pageX, e.touches[0].pageY);
      if (this.stopflag) return;
      if (!this.gamestart) {
         this.startGame();
      }
      //console.info("速度：" + et.getSpeed());
      this.music.playHitting();
      //小球球根据当前速度进行加速。
      this.ball.speedUp(et.getSpeed() );
    })
  }
  
  startGame() {
    this.gamestart = true;
    this.stopflag = false;  
    var _this = this;
    this.clearTimer();
    this.timer = setInterval(() => {
      try {
        _this.updateFrame();
      } catch (e) {
         // console.error(e);
        _this.onGameOver();
      }
    }, this.speed);
  }
  
  clearAll() {
    this.cxt.clearRect(0, 0, this.box_w, this.box_h);
  } 
  
  /**
   * 每一帧的更新函数。
   */
  updateFrame() {
    this.bg.update();//先刷背景。
    this.grassgroup.update();//刷草。
    this.cloudgroup.update();
    this.beegroup.update();//蜜蜂
    this.butterflygroup.update();//蝴蝶
    this.timebar.update(this.speed);//时间条。
    this.scorebar.update();
    this.board.update();
    this.ball.update(this.speed);
    this.board.update2();
    this.check();
    this.board.moveUpAndDown();
  }

  lastUpdate(){
    this.bg.update();//先刷背景。
    this.grassgroup.update();//刷草。
    this.cloudgroup.update();
    this.beegroup.update();//蜜蜂
    this.butterflygroup.update();//蝴蝶
    this.timebar.update(this.speed);//时间条。
    this.scorebar.update();
    this.board.update();
    this.board.update2();
  }
  check() {
    if (this.timebar.isTimeUp()){
      //时间到了之后。锁住游戏不能动。让小球下落到地面时才算输。
      this.stopflag = true;
    }
    
    if (this.isLeftBoardShown()) {//左篮板。
      this.checkLeftBoard();
    } else if (this.isRightBoardShown()) {
      this.checkRightBoard();
    }
  }
  
  stop(msg){
    throw new Error(msg);
  }

  checkLeftBoard() {
    let nothitting_up_down = false;
    if (this.ball.isDown()) {
      if (Utils.isDropdownHittingOnLeftBoard(this.ball, this.leftboard.top_left, this.leftboard.top_middle)) {
        this.ball.setUp();
        //必须要将球位置，更新到上挡板以上   
        this.ball.setY(this.leftboard.top_left.y - this.ball.r);
        nothitting_up_down = true;
        //数值方向上减速。
        this.ball.slowdownY(0.65)
      }
    } else if (this.ball.isUp()) {
      if (Utils.isUpHittingOnLeftBoard(this.ball, this.leftboard.base, this.leftboard.bottom_middle)) {
        this.ball.setDown();
        //必须要将球的位置，更新到下挡板以下 
        this.ball.setY(this.leftboard.base.y + this.ball.r);
        nothitting_up_down = true;
      }
    }
    if (nothitting_up_down) return;
    //左挡板检测。
    if (Utils.isCrossingLeftLine(this.ball, this.leftboard.top_middle, this.leftboard.bottom_middle)) {
      this.ball.setRight();
      //必须要将球的位置，更新到垂直挡板右边。 
      this.ball.setX(this.leftboard.top_middle.x + this.ball.r);
      this.ball.slowdownX();//水平减速。
    }
 
    if (this.ball.isDown()) {
      let target_x = this.leftboard.middle_right_up.x;
      let target_y = this.leftboard.middle_right_up.y;
      //得分状态1                      x右边范围需要给宽一点。
      if (this.ball.x >= this.leftboard.middle_left_up.x   && this.ball.x <= target_x - 10 ){
        if (this.ball.y <= target_y - this.ball.r+5) {//给个5px的范围减小误差。
          this.cross_left_board_status = "up";//状态1：上
        } 
      }

      //下落反弹检测。左篮框的x轴反弹范围： 篮框最外圈往左10px的范围。 也就是：  [target_x -10 ~ target_x]
      if (this.ball.x > target_x - 10 && this.ball.x < target_x + this.ball.r) {
        if (this.ball.y < target_y && this.ball.y >target_y - this.ball.r ) {           
          if (this.ball.x - this.ball.rect_r > target_x) {
               this.ball.setRight();//向右
               this.ball.setDown();//向下
               this.ball.setX(target_x + this.ball.r );
          } else if (this.ball.x - this.ball.rect_r < target_x) {
              this.ball.setUp();//向上。
              this.ball.setLeft();//向左。
              this.ball.setY(target_y - this.ball.r);
          } 
        }
      }
      
      //下落得分检测 
      else if (this.ball.x  <= target_x -10 ) {//
        if (this.ball.y > target_y - this.ball.r && this.ball.y < target_y + 4 * this.ball.r){//要加下限控制。 
            if (this.ball.x > target_x - 10 - this.ball.r) {//滑落得分范围。
               this.ball.setUp();//向上。
               this.ball.slowdownY(0.4);//可微调。
               this.ball.setY(target_y - this.ball.r);
            } else {//无碰撞下落得分。
                //什么都不用写。
            }
          if (this.ball.y > target_y ){
            if (this.cross_left_board_status =="up"){
              this.cross_left_board_status = null;
              this.onGainScores("left");
            }
          }
        }
      } 

    } else if (this.ball.isUp()) {
      this.cross_left_board_status = null;

      let target_x = this.leftboard.middle_right_down.x;
      let target_y = this.leftboard.middle_right_down.y;
      
      //上升反弹检测。左篮框的x轴反弹范围： 篮框最外圈往左10px的范围。 也就是：  [target_x -10 ~ target_x+ this.ball.r]
      if (this.ball.x > target_x - 10 && this.ball.x < target_x + this.ball.r) {
        if (this.ball.y < target_y && this.ball.y > target_y - this.ball.r) {
          if (this.ball.x - this.ball.rect_r > target_x) {
            this.ball.setRight();//向右
            this.ball.setUp();//向上
            this.ball.setX(target_x + this.ball.r);
          } else if (this.ball.x - this.ball.rect_r < target_x) {
            this.ball.setDown();//向下。
            this.ball.setLeft();//向左。
            this.ball.setY(target_y + this.ball.r);
          }
        }
      }
    }
  }

  checkRightBoard() {
    let nothitting_up_down = false;
    if (this.ball.isDown()) {
      if (Utils.isDropdownHittingOnRightBoard(this.ball, this.rightboard.top_middle, this.rightboard.top_right)) {
        this.ball.setUp();
        //必须要将球位置，更新到上挡板以上   
        this.ball.setY(this.rightboard.top_right.y - this.ball.r);
        nothitting_up_down = true;
        this.ball.slowdownY(0.65);
      }
    } else if (this.ball.isUp()) {
      if (Utils.isUpHittingOnRightBoard(this.ball, this.rightboard.bottom_middle, this.rightboard.base)) {
        this.ball.setDown();
        //必须要将球的位置，更新到下挡板以下 
        this.ball.setY(this.rightboard.base.y + this.ball.r);
        nothitting_up_down = true;
      }
    }
    if (nothitting_up_down) return;

    //右挡板检测。
    if (Utils.isCrossingRightLine(this.ball, this.rightboard.top_middle, this.rightboard.bottom_middle)) {
      this.ball.setLeft();
      //必须要将球的位置，更新到垂直挡板左边。 
      this.ball.setX(this.rightboard.top_middle.x - this.ball.r);
      this.ball.slowdownX();//水平减速。
    }
    
    //【下落】 
    if (this.ball.isDown()) {
      let target_x = this.rightboard.middle_left_up.x;
      let target_y = this.rightboard.middle_left_up.y;

      //得分状态1                      x范围需要给宽一点。
      if (this.ball.x >= target_x && this.ball.x <= this.rightboard.middle_right_up.x) {
        if (this.ball.y <= target_y - this.ball.r + 5) {//给个5px的范围减小误差。
          this.cross_right_board_status = "up";//状态1：上
        }
      }
      //下落反弹检测。左篮框的x轴反弹范围： 篮框最外圈往右10px的范围。 也就是：  [ target_x - this.ball.r ~target_x + 10]
      if (this.ball.x > target_x - this.ball.r && this.ball.x < target_x + 10 ) {
        if (this.ball.y < target_y && this.ball.y + this.ball.r > target_y) {
          if (this.ball.x + this.ball.rect_r < target_x) {
            this.ball.setLeft();//向左
            this.ball.setDown();//向下
            this.ball.setX(target_x - this.ball.r);
          } else if (this.ball.x + this.ball.rect_r > target_x) {
            this.ball.setUp();//向上。
            this.ball.setRight();//向右
            this.ball.setY(target_y - this.ball.r );
          }
        }
      }
      //得分检测。

      //下落得分检测 
      else if (this.ball.x >= target_x + 10) {//
        if (this.ball.y > target_y - this.ball.r && this.ball.y < target_y + 2 * this.ball.r) {//要加下限控制。 
          if (this.ball.x < target_x + 10 + this.ball.r) {//滑落得分范围。
              this.ball.setUp();//向上。
              this.ball.setY(target_y - this.ball.r);
              this.ball.slowdownY();
          } else {//无碰撞下落得分。
            //什么都不用写。
          }
          if (this.ball.y > target_y ) { 
            if (this.cross_right_board_status == "up") {
              this.cross_right_board_status = null;
              this.onGainScores("right");
            }
          }
        }
      } 
    } else if (this.ball.isUp()) {
       this.cross_right_board_status = null;

      let target_x = this.rightboard.middle_left_down.x;
      let target_y = this.rightboard.middle_left_down.y;

      //下落反弹检测。左篮框的x轴反弹范围： 篮框最外圈往右10px的范围。 也就是：  [ target_x - this.ball.r ~target_x + 10]
      if (this.ball.x > target_x - this.ball.r && this.ball.x < target_x + 10) {
        if (this.ball.y < target_y && this.ball.y + this.ball.r > target_y) {
          if (this.ball.x + this.ball.rect_r < target_x) {
            this.ball.setLeft();//向左
            this.ball.setDown();//向下
            this.ball.setX(target_x - this.ball.r);
          } else if (this.ball.x + this.ball.rect_r > target_x) {
            this.ball.setUp();//向上。
            this.ball.setRight();//向右
            // this.ball.slowdownY( );
            this.ball.setY(target_y + this.ball.r);
          }
        }
      }
    }
  }
  restartGame() {
    this.showLeftBoard();
    this.timebar.reInit();
    this.scorebar.reset();
    this.ball.restart();
    this.startGame();
  }

  isLeftBoardShown() {
    return this.showboard == "left";
  }
  isRightBoardShown() {
    return this.showboard == "right";
  }
  showLeftBoard() {
    this.showboard = "left";
  }
  showRightBoard() {
    this.showboard = "right";
  }

  whichBoard() {
    return this.showboard;
  }

  /**
   *  
   * 在得分时回调。 
   */
  onGainScores(dir) {
    this.stopflag = false;  //不能删
    this.scorebar.updateTotal();
    this.timebar.reset();
    this.timebar.reduceTime();
      if (dir == "left") {
      this.showRightBoard();
      //this.leftboard.updateY(-Utils.randomInt(200 * this.dpr, 350 * this.dpr));
    } else if (dir == "right") {
      this.showLeftBoard();
      //this.rightboard.updateY(-Utils.randomInt(200 * this.dpr, 350 * this.dpr));
    }
    //回调业务层的得分时间。不是游戏层。
    if (this.callback && typeof this.callback.onGainScores == "function") {
      this.callback.onGainScores(this.scorebar.getStep(),this.scorebar.getTotal());
    }
  }
   
  clearTimer(){
    if (this.timer && this.timer != 0 ){
        try{
          clearInterval(this.timer);
        }catch(e){}finally{
          this.timer = null;
        }
    }
  }

  onGameOver() {
    this.clearTimer();
    let _this = this; 
    this.stopflag = true;  
    this.music.playWinOrFail();
    const total = this.scorebar.getTotal();//先获取分数
    this.scorebar.reset();//再重置。
    this.lastUpdate();
    this.gamestart = false; 
    //回调。
    if (this.callback && typeof this.callback.onGameOver == "function") {
      this.callback.onGameOver(total );
    }

    this.showGameOverView(total);
  }

  /**
   * 展示游戏结束画面。
   */
  showGameOverView(total){
    this.gameoverpage.setScores(total);
    this.gameoverpage.showPage(true);
  }
}