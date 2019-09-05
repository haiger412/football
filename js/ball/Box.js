import Event from "./Event.js"
/**
 * 每个组件必须继承的类。
 */
export default class Box extends Event{
  //以下写法不支持。
   /* 
    static cavs = null; //画布对象。
    static box_w = 0;//容器宽度。
    static box_h = 0;//容器高度。
    static cxt = null; //画布对象。
    static container = null; //容器对象。
    static dpr = null; //
  */
    constructor(){ 
        super();
    }

}