export default class Utils{
  

  /**
    * 左篮板，下落是否发生了碰撞。
    */
  static isDropdownHittingOnLeftBoard(ball, point1, point2) {
    //如果球下方已经超过了顶部挡板。并且球上方还未超过。
    //先进去部分，超越，后进去部分。还为超越。
    if (ball.y + ball.r > point1.y && ball.y < point1.y) {
      if (ball.x - ball.rest_r < point2.x && ball.x + ball.r > point1.x) 
        return true;
    }
    return false;
  } 
   
  /**
   * 左篮板，上升是否发生了碰撞。  
   */
  static isUpHittingOnLeftBoard(ball, point1, point2) {
    if (ball.y > point1.y && ball.y - ball.r < point1.y) {
      if (ball.x - ball.rest_r  < point2.x && ball.x + ball.r > point1.x  ) {
        return true;
      }
    }
    return false;
  }

  /**
    *  右篮板,下落是否发生了碰撞。
    */
  static isDropdownHittingOnRightBoard(ball, point1, point2) {
    //如果球下方已经超过了顶部挡板。并且球上方还未超过。
    //先进去部分，超越，后进去部分。还为超越。
    if (ball.y + ball.r > point1.y && ball.y < point1.y) {
      if (ball.x + ball.rest_r > point1.x && ball.x - ball.r < point2.x) {
        return true;
      }
    }
    return false;
  }

  /**
    * 右篮板，上升是否发生了碰撞。  
    */
  static isUpHittingOnRightBoard(ball, point1, point2) {
    if (ball.y > point1.y && ball.y - ball.r < point1.y) {
      if (ball.x + ball.rest_r  > point1.x && ball.x - ball.r < point2.x) {
        return true;
      }
    }
    return false;
  }

  
  /**
   * 向左穿过判断。
   */
  static isCrossingLeftLine(ball, point1, point2){
    if (ball.x - ball.r < point1.x && ball.x > point1.x) {
      if (ball.y + ball.rest_r > point1.y && ball.y - ball.rest_r < point2.y )
       return true; 
    }
    return false;
  } 

  /**
   * 向右穿过判断。
   */
  static isCrossingRightLine(ball, point1, point2) {
    if (ball.x + ball.r > point1.x && ball.x < point1.x) {
      if (ball.y + ball.rest_r > point1.y && ball.y - ball.rest_r < point2.y)
      return true;
    }
    return false;
  }

  static randomInt(a,b){
    return parseInt(Math.random() * (b - a)) + a;
  }

}