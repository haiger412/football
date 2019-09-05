/**
 * 蜜蜂群
 */
import Bee from "./Bee.js"

export default class BeeGroup{
  beelist = [];
  onInit(){
       for(let i=0;i<5;i++){
         let bee = new Bee();
         bee.onInit();
         bee.move(i*2+15,-i*3-20);
         this.beelist.push(bee);
       }
    //this.beelist[0].move(300,-400);
    //this.beelist[1].move(10, -45);
  }

  update() {
    this.beelist.map((bee) => {
      bee.update();
    });
  }

}