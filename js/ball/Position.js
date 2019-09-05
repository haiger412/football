export default class Position{
   x = 0;
   y = 0;
   constructor(x,y){
      this.x = x;
      this.y = y;
   }
   X( x ,newstance=true){
     if (newstance){
       return new this.constructor(this.x + x, this.y);
     }else{
       this.x += x;
       return this;
     }
    
   }
  Y(y, newinstance = true){
    if (newinstance){
      return new this.constructor(this.x, this.y + y);
    }else{
      this.y += y;
      return this;
    }
    
   }
  setXY(x, y) {
    this.x = x;
    this.y = y;
  }
/* 实现对象池
  instance = [];
  static pop(){
    
  }

  static push(instance){

  }*/

}