import Cloud from "./Cloud.js"
export default class CloudGroup{
  basepath = "img/cloud/";
  cloudlist = [];

  onInit() {
 
    for (let i = 1; i <= 8; i++) {
      let cloud = new Cloud();
      let imgpath = [];
      imgpath.push(this.basepath.concat(i%4+1).concat(".png"));
      cloud.onInit(imgpath);
      let offset = Math.round( cloud.box_w / 8) * i;
      cloud.X( offset );
      this.cloudlist.push(cloud);
    }
   
    
  }

  update() {
    this.cloudlist.map((cloud) => {
      cloud.update();
    });
  }
}