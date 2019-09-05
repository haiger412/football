export default class ServiceEvent{
  /** 
 * 游戏开始时。【实现】
 */
  onInit() { }
  /**
   * 游戏开始时。【实现】
   */
  onStart(){}

  /**
   * 游戏得分时。【实现】
   */
  onGainScores(){}

 /**
  * 游戏结束时。【实现】
  */
  onGameOver(){}

  /**
   * 游戏重新开始时。【实现】
   */
  onRestart(){ }
  /**
   * 点击分享链接时。【实现】
   */
  onShare(){}
  /**
   * 退出游戏时【未实现预留】
   */
  onExsit() { }
}