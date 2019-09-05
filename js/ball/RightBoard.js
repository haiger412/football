import Board from "./Board.js"
import Position from "./Position.js"
/**
 * 右篮板。
 * 锚点(x,y)在左下角。
 */
export default class RightBoard extends Board {
   
  onInit() {
    super.onInit("img/rightboard.png", "img/righthalf.png");
    this.updateXY(this.box_w, -180*this.dpr);
  }

  //私有方法。外界不应该调用。
  updatePosi() {
    this.base = new Position(this.x, this.y);//左下角基准点。
    this.top_right = this.base.Y(-this.h);//顶左。
    this.top_middle = this.base.X(-this.offset_x).Y(-this.h);
    this.middle_right_up = this.base.X(-this.offset_x).Y(-this.offset_y2);
    this.middle_left_up = this.base.X(-this.w).Y(-this.offset_y2);
    this.middle_left_down = this.base.X(-this.offset_x).Y(-this.offset_y1);
    this.middle_right_down = this.base.X(-this.w).Y(-this.offset_y1);
    this.bottom_middle = this.base.X(-this.offset_x);
  }
  moveUpAndDown() {
    super.moveUpAndDown();
    this.updatePosi();
  }
  
  drawImage() {
    this.cxt.drawImage(this.img, this.x - this.w, this.y - this.h, this.w, this.h);
  }
  drawOutline() {
    if (this.debugmode == false) return;
    this.lineTo(this.base)
    this.lineTo(this.top_right)
    this.lineTo(this.top_middle)
    this.lineTo(this.middle_right_up)
    this.lineTo(this.middle_left_up)
    this.lineTo(this.middle_right_down)
    this.lineTo(this.middle_left_down)
    this.lineTo(this.bottom_middle)
    this.lineTo(this.base);
  }

  showrighthalf() {
    this.cxt.save();
    this.cxt.beginPath();
    this.cxt.translate(0, this.box_h);//设置画布上的(0,0)位置
    //this.cxt.drawImage(this.halfimg, this.x + this.offset_x, this.y - this.offset_y1-10, 60, 10);
    //图片大小不规范，导致左边和右边无法保持参数规律一致，需要微调。
    //所有参数需要乘以dpr。
    this.cxt.drawImage(this.halfimg.img, 
                       this.x - this.w - this.dpr, 
                       this.y - this.offset_y1 - this.halfimg.h , 
                      this.halfimg.w,
                      this.halfimg.h);
    this.cxt.closePath();
    this.cxt.restore();
  }
}