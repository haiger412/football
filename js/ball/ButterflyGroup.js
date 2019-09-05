/**
 * 蜜蜂群
 */
import Butterfly from "./Butterfly.js"
export default class ButterflyGroup {
  butterflylist = [];
  onInit() {
    for (let i = 0; i < 5; i++) {
      let butterfly = new Butterfly();
      butterfly.onInit();
      butterfly.move(i * 2 + 15, -i * 3 - 20);
      this.butterflylist.push(butterfly);
    }
     
  }
  update() {
    this.butterflylist.map((butterfly) => {
      butterfly.update();
    });
  }

}