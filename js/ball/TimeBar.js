import Box from "./Box"
export default class TimeBar extends Box {
  x = 0;
  y = 0;
  basepath = "img/timebar/";
  outerimg = null;
  innerimg = null;
  inner_length = 0;
  max_time = 15000;//最长时间。
  ori_max_time = 15000;
  min_time = 3000;//最小时间。
  count_time = 0;
  current = 30;
  mydpr = 1;
  timesup = false;//时间到。
  onInit(){
    this.mydpr = this.dpr -1;
    this.outerimg= wx.createImage();
    this.outerimg.src = this.basepath +"outer.png";
    this.outerimg.onload=()=>{
      this.x = (this.box_w - this.outerimg.width * this.mydpr  )/2;
      this.y = -(this.box_h - 100 * this.mydpr);
      this.calcOffset();
    }

    this.innerimg = wx.createImage();
    this.innerimg.src = this.basepath + "inner.png";
    this.innerimg.onload=()=>{
      this.calcOffset();
    }
   
  }

reInit(){
  this.max_time = this.ori_max_time;
  this.reset();
}
  calcOffset(){
    if (this.outerimg.width && this.innerimg.width){
         let off_h = this.outerimg.height - this.innerimg.height;
         off_h = Math.round(off_h / 2);
         let off_w = 6;
         this.off_h = off_h;
         this.off_w = off_w;
         this.inner_length = this.outerimg.width * this.mydpr - this.off_w * 2;
    }
    
  }

  update(mills_time){
    if (this.count_time < this.max_time ){
       this.count_time += mills_time;
      if (this.count_time >= this.max_time ){
         this.count_time = this.max_time;
         this.timesup = true;
      }
    }
    this.repaint();
  }

  repaint() {
    // this.count_time / this.max_time = x / inner_length
    let consume_length = Math.round((this.inner_length * this.count_time / this.max_time) );
    this.cxt.save();
    this.cxt.beginPath();
    this.cxt.translate(0, this.box_h);//设置画布上的(0,0)位置 
    this.cxt.drawImage(this.outerimg,
      //0, 0, this.outerimg.width, this.outerimg.height,
      this.x,
      this.y,
      this.outerimg.width * this.mydpr,
      this.outerimg.height * this.mydpr);
    this.cxt.drawImage(this.innerimg, 
             //0, 0, this.innerimg.width, this.innerimg.height,
             this.x + this.off_w,
             this.y + this.off_h * this.mydpr,
      this.inner_length - consume_length,
      this.innerimg.height * this.mydpr);
    this.cxt.restore();
  }

  reset(){
    this.timesup = false;
    this.count_time = 0;
    this.repaint();
  }
  isTimeUp(){
    return this.timesup;
  }
  /**
   * 时间减少。
   */
  reduceTime(t =50){
    if ( this.max_time > this.min_time ){
       this.max_time -= t;
      if (this.max_time < this.min_time){
          this.max_time = this.min_time;
      }
    }
   
  }
}  