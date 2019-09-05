import Box from "./Box.js"
export default class Background extends Box{
  constructor( ) {
    super();
  }
  onInit(){
    this.img = wx.createImage();
    this.img.src = "img/bg.png";
  }

  repaint(){
    this.cxt.drawImage(this.img, 0, 0, this.box_w, this.box_h);
  } 
  update(){
    this.repaint();
  }
}