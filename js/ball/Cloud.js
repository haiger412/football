import AniObject from "./AniObject.js"
import Utils from "./Utils.js"
export default class Cloud extends AniObject{
  x_move_stp =  -1;
  y_offset = 60;
  onInit(imgspaths){
    super.onInit(imgspaths,1);
    this.updateXStep();
    this.updateYoffset();
    this.Y(- (this.box_h - this.y_offset));
  }
  update() {
    this.XStep( this.x_move_stp );
    if( this.x <= - this.w){
      this.updateXStep();
      this.updateYoffset();
      this.Y(- (this.box_h - this.y_offset));
      this.X(this.box_w);
    }
    super.update();
  }
  updateXStep(){
     this.x_move_stp = -Utils.randomInt(1, 5) * this.dpr;
  }

  updateYoffset() {
    this.y_offset = Utils.randomInt(0, 60) * this.dpr;
  }
}
