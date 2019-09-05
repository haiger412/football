import Box from "./Box.js"
/**
 *  因为分数图片共有10个，并不需要一次性显示10个。
 * 需要根据情况动态显示。所以不适合继承与AniObject类。
 */
export default class ScoresBar extends Box{
  w=0;
  h=0;
  x=0;
  y=0;
  single_w = 0;
  single_h = 0;
  total = 0;
  basepath = "img/number/";
  imgs =[];
  plusimg = null;
  
  ballfacade = null;
  
  onInit(){
    this.x = this.box_w /2;
    this.y = - (this.box_h -120*this.dpr);
    //初始化10个图片对象。
    for(let i=0;i<10;i++){
        let src = this.basepath + i+".png";
        this.imgs[i] = wx.createImage();
        this.imgs[i].src = src;
    }
    // +号 
    this.plusimg = wx.createImage();
    this.plusimg.src = this.basepath+"+.png";
    this.plusimg.onload=()=>{
      this.single_w = this.imgs[0].width * this.dpr;
      this.single_h = this.imgs[0].height * this.dpr;
    };
   
  }

  setBallFacade(ballfacade){
     this.ballfacade = ballfacade;
  }

  update(){
    this.repaint();
  }
  //根据分数绘制图片。
  repaint() { 
    this.cxt.save();
    this.cxt.translate(0, this.box_h);//设置画布上的(0,0)位置
    //居中显示。
    let ss = this.total +"";
    let t_w = this.single_w * ss.length;
    let offset_x = (this.box_w - t_w)/2;

    for (let i = 0; i < ss.length ; i++){
        let index = Number(ss.charAt(i));
        let img = this.imgs[index];
      this.cxt.drawImage(img, offset_x + this.single_w * i, this.y, this.single_w, this.single_h) ;

    }
    this.cxt.closePath();
    this.cxt.restore();
    
    if(this.total > 0){
       this.showUpdateScoreByAminate(); //只有总分>0时，才会显示加分动画。
    }
   
  }


  updateTotal(){
    this.calcScores();
    this.start_index = 0 ;
    this.ballfacade.clearDropDownStatus();
  }
   //得分规则细化：
    /**
		正常：
			第一个球，8分。
			以后每个球如果落地+1，没落地+2。
		连续得分：
			在连续未落地8个球内，每个球得分*8。 
			超过20分。只能加20分。
     * 
     * 
     * 
     */
  continue_count = 0;
  calcScores(){
    if ( ! this.ballfacade.getDropDownStatus( )  ){
        this.continue_count ++;
    }else{
       this.continue_count = 0;
    }

    if (this.continue_count == 8){
      this.continue_count = 0;//清空连续得分统计变量。
      this.step = 8;
    }else{
      this.step =2;
    }
    this.total += this.step;
    this.ballfacade.clearDropDownStatus();
  }

  step = 5;
  start_index = 0;//当前帧
  end_index = 8;//总帧
  offset_height = 120;//往下高度。
  offset_top = -10; //顶部偏移
  offset_width = 10;//左偏移。


  /**
   * 加分动画。
   */
  showUpdateScoreByAminate( ){
      let images = [this.plusimg ];
      let str = this.step + "";
      for (let i = 0; i < str.length;i++){
         let index = Number(str.charAt(i));
         images.push( this.imgs[index]); 
      }
      //得分动画设计 由(_x1,_y1) 经过n次水平上升至(_x1,_y2)
      //_x1 的位置在总分数最右边。计算方式如下。
      let score_num_width = this.single_w * (this.total+"").length;
      let _x1 = (this.box_w - score_num_width) / 2 + score_num_width + this.offset_width;
      //_y2的位置和总分数位置一样。
      let _y2 = this.y + this.offset_top;
      let _y1 = 0;
      if(this.start_index < this.end_index ){
        this.start_index++;
        if (this.start_index >= this.end_index  ){
          this.start_index = this.end_index ;
        }
        _y1 = this.offset_height * ((this.end_index - this.start_index) / this.end_index);
        _y1 = Math.round(_y1);//四舍五入。
        _y1 *= (this.dpr - 1);// 适配。
        _y1 = _y2+ _y1; //负数 + 整数 。
      }else{
        _y1 = _y2;
      }
     
      let width = images[0].width;
      this.cxt.save();
      this.cxt.translate(0, this.box_h);//设置画布上的(0,0)位置
      for (let i = 0; i < images.length; i++) {
        let img = images[i];
        this.cxt.drawImage(img, _x1 + width * i, _y1);
      }
      this.cxt.closePath();
      this.cxt.restore();

      images = null;
  }
  reset(){
    this.total = 0;
    this.repaint();
  }

  /**
   * 获得当前总分。
   */
  getTotal(){
    return this.total;
  }

  getStep(){
    return this.step;
  }
}