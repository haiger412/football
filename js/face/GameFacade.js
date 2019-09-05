import Container from "../ball/Container.js"

const canvas = wx.createCanvas();//上屏画布对象
const cxt = canvas.getContext("2d");//画布绘制上下文对象。
const container = new Container();//游戏容器对象，容器包含了一切：花、草、树木、蓝天、白云... 

export default class GameFacade {

  constructor() {
    this.onInit();
  }
  /**
   * 清空画布。在游戏运行期间清空无效。必须在游戏停止后或者游戏开始前。
   */
  clearAll() {
    container.clearAll();
  }

  /**
   * 设置监听器，以便在游戏的各个生命周期内回调。
   * 注意监听器必须继承实现：js/event/ServiceEvent类，并覆盖自己感兴趣的方法。
   */
  setEventListener(listener) {
    container.setEventListener(listener);
  }
  onInit() {
    //获取系统信息。这里主要获取dpr。
    wx.getSystemInfo({
      success: function (res) {
        console.info(res);
        let dpr = res.pixelRatio;// res.pixelRatio;
        canvas.width = canvas.width * dpr;
        canvas.height = canvas.height * dpr;
        let box_w = canvas.width;
        let box_h = canvas.height;
        let parameter = [canvas, box_w, box_h, cxt, dpr, container];
        container.onInit(...parameter);
      }
    });
  }
 
  /**
   * 停止游戏。
   */
  stopGame(){
    container.stop();
  }
  
  /**
   * 重新开始游戏。
   */
  reStart(){
    container.restartGame();
  }

}