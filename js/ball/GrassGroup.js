/**
 * 方向：
 * Container--> new GrassGroup ---> 8 new Grass(); 
 */
import Grass from "./Grass.js"
export default class GrassGroup{
  basepath = "img/grass/";
  grasslist =[];

  onInit(){
    for( let i=1 ; i<=8 ; i++ ) {
      let grass = new Grass();
      let imgpath = [];
      for(let j=1;j<=3;j++){
        imgpath.push( this.basepath.concat(i).concat("/").concat(j).concat(".png") );
      }
      grass.generateFrameP();
      grass.onInit(imgpath);
      this.grasslist.push(grass);
    }
    //详细初始化。
    let dpr = this.grasslist[0].dpr; 
    let box_w = this.grasslist[0].box_w;
    this.grasslist[0].move(235*(dpr-1),-300);
    this.grasslist[1].move(150,-150);
    this.grasslist[2].move(120, -250);
    this.grasslist[3].move(160, -50);
    this.grasslist[4].move(50, -220);
    this.grasslist[5].move(120, -120);
    this.grasslist[6].move(220, -300);
    this.grasslist[7].move(40, -120);
  }

  update(){
    this.grasslist.map(( grass )=>{
      grass.update();
    });
  }
}