import ServiceEvent from "../event/ServiceEvent.js"
import GameFacade from "../face/GameFacade.js"
import Promise from "../utils/Promise.js"
import URL from "./URL.js"
const url = new URL();
let facade = null;
export default class GameService extends ServiceEvent{
   static main(){
     let _this = new GameService();
     facade = new GameFacade();//通过门面类，创建游戏实例。
     facade.setEventListener(_this);//设置回调函数。
    _this.setLifeCycileEvent();
     
   }
  onInit(){
    
  }
  onGameOver(total){
    console.info("回调。。");
    try {
     //参数赋值。
      let param = { userId: wx.getStorageSync('openid'), scores: total };
      wx.request({
        url: url.getSaveScoresUrl(),
        method: "POST", 
        data: param //contentType默认为"application/json" 不用设置。
      });
    } catch (e) {
       console.info(e);
    }
    //此处应该获取分数和用户id，调用后台接口。后台写入游戏记录，以及判断最高分，作为用户的共享金币余额。
    //前端只需要传参即可。
  }
  onRestart(){
    
  }
  onGainScores(step,total){
   
  }
  onStart(){
   
  }
  onShare(){
   
  }

  /**
   * 设置应用级别的事件。
   */
  setLifeCycileEvent(){
    wx.onShow(this.onShow);
  }
  
  onShow(){
    //wx.clearStorage();//用于测试。
    let wxlogin = Promise(wx.login)
    let wxrq = Promise(wx.request );
    let value = wx.getStorageSync('openid')
    if (!value) {
      //1 获取code
       wxlogin().then((res)=>{
         //2换取openid
         wxrq({
           url: url.getLoginUrl(),
           data: {
             code: res.code
           }}).then((rs)=>{ 
             if (rs.code ==200 ){
               wx.setStorageSync('openid', rs.data.openid)
             }
           }).catch((rs)=>{
             console.log('登录失败！' + rs)
           });
      });  
    }
  }

}
