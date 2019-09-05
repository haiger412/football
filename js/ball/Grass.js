
import AniObject from "./AniObject.js"
/**
 * 
 * 草
 * 
 * **/
export default class Grass  extends AniObject{
   
  move(x,y){
    super.move(x * this.dpr, y * this.dpr);
  }
}