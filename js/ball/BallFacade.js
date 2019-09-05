export default class BallFacade{
  ball = null ;
  constructor(ball){
    this.ball = ball;
  }
  
  clearDropDownStatus(){
    this.ball.clearDropDownStatus();
  }

  getDropDownStatus(){
    return this.ball.getDropDownStatus();
  }
}