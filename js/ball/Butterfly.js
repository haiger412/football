/**蝴蝶**/
import AniObject from "./AniObject.js"
import Utils from "./Utils.js"

export default class Butterfly extends AniObject {
  basepath = "img/butterfly/";
  x_move_stp = -1;
  y_offset = 60;
  onInit() {
    let imgpath = [];
    for (let j = 1; j <= 5; j++) {
      imgpath.push(this.basepath.concat(j).concat(".png"));
    }
    super.onInit(imgpath);
    this.updateXStep();
    this.updateYoffset();
    this.Y(-this.y_offset);
  }


  update() {
    this.XStep(this.x_move_stp);
    if (this.x <= - this.w) {
      this.updateXStep();
      this.updateYoffset();
      this.Y(- this.y_offset);
      this.X(this.box_w);
    }
    super.update();
  }

  updateXStep() {
    this.x_move_stp = -Utils.randomInt(1, 3) * this.dpr;
  }

  updateYoffset() {
    this.y_offset = Utils.randomInt(50, 200) * this.dpr;
  }
}