import Box from "./Box.js"
/**
 *  当前小球的坐标原点为：球心，圆心是绘制点也在球心。
 *  世界坐标原点为：Box左下角。
 */
export default class Ball extends Box {
	x = 0;//当前小球的x坐标。
	y = 0;//当前小球的y坐标。
	r = 25;//小球半径。
	
	v0 = 10; //沿着某个角的初速度。
	radius=80;//抛物角度。
	v0_y = 0;//v0在y轴的分解初速度。
	v0_x = 0;//v0在x轴的分解初速度。
	vt_y = 0;//y轴瞬时速度。
	unit_y_s= 0;//单位时间内的y轴方向的位移。
	unit_x_s =0;//单位时间内的x轴方向的位移。
	dir_x = "left";//x轴运动方向。 
	dir_y = "up";//y轴运动方向 
	g = 9.8;//重力加速度。
  timeuint = 400;
	rate = 10;// 米和像素单位的转换。 1m = rate px。可动态调整。
	speedsubrate = 0.50;//速度递减因子。用于递减速度。 只在下落底部后反弹时，初速度递减。
					  //由于不考虑空气阻力。和摩擦力。 
				    //所以通过简单递减速度来实现停止条件的判断。
	//max_speed = 50;//最大速度。不允许超过它。
  
				  //vt = v0 + at     v0是初速度。a是重力加速度g。t是运动时间。
  original_x_speed =0;
  original_y_speed = 0;
  speed_radius = 10;//速度夹角
  rest_r = 0;
  img = null;
  debuggermode= false;//true 开启调试模式。
  dropdwonflag = false;
  
   reset(){
     this.r = 25;
     this.rate = 20;
     this.inity = -250;
     this.v0 = 12;
     this.dir_x = "left";//x轴运动方向。 
     this.dir_y = "up";//y轴运动方向 
     this.dropdwonflag = false;
   }
	 onInit( ){
     this.reset();
     this.rate *= this.dpr; 
     this.r *= this.dpr; 

		 let hd =  (this.radius / 180) *Math.PI;//弧度
		 let sin_hd = Math.sin(  hd  );//sin角度的值。
		 let cos_hd =  Math.cos(   hd  ); //cos角度的值。
	 
		 this.v0_x  =  cos_hd * this.v0;
		 this.v0_x = Number( this.v0_x.toFixed( 2));
		 this.v0_y =   sin_hd * this.v0;
		 this.v0_y = Number( this.v0_y.toFixed( 2));
     this.x = (this.box_w) / 2;
     this.y = this.inity * this.dpr;//从高度为600px的高空向下抛物。
     
     this.original_x_speed = this.v0_x;
     this.original_y_speed = this.v0_y;

    //以小球圆到第三项象限的圆弧做一个角度为45度的延长线，作为圆内正方形的对接线。
    //假设边长为a, 由于是正方形。则有： a * a + a * a = r * r;    2*a*a = r*r ==>  a = Math.sqrt(r*r*/2));
     this.rect_r = parseInt(Math.sqrt(this.r * this.r / 2));//正方形边长。
     this.rest_r = this.r - this.rect_r;//半径 - 四边形的边长

     this.img = wx.createImage();
     this.img.src = "img/ball.png";
	}

  restart() {
    this.onInit( );
  }
	speedUp(  speed ){
    //console.info("加速为：" + speed);
		//在当前方向上。增大初速度。
		//入射角固定死。
    this.v0_x = this.original_x_speed * speed;
    this.v0_y = this.original_y_speed * speed;
		this.dir_y = "up";
     
    //根据篮板的方向
    this.setXaxisDir(this.container.whichBoard());
	}
	 
  clearDropDownStatus(){
    this.dropdwonflag = false;
  }

  getDropDownStatus(){
     return this.dropdwonflag;
  }

	stop(msg){
	 		 throw new Error(msg);
	}
	update(milis){
		this.calc(milis/this.timeuint);
		this.repaint();  
	}

	calc( s_t ){//单位时间间隔。
		//y 方向位移：匀减速。或匀加速。
    if ( this.isRight() ) {
      this.Xmove(s_t);
    } else if ( this.isLeft() ) {
      this.Xmove(-s_t);//1数
    }
		if( this.isUp() ){//斜向上。 
			this.Yup( s_t );
		}else if( this.isDown() ){//斜向下。
			this.Ydown( s_t );
		}
		this.checkBounds();
		this.x = Number(this.x.toFixed(2)); 
		this.y = Number(this.y.toFixed(2)); 
		this.v0_x = Number(this.v0_x.toFixed(2)); 
		this.v0_y = Number(this.v0_y.toFixed(2)); 
		this.vt_y = Number(this.vt_y.toFixed(2)); 

    //计算速度的角度。
    let rd = Math.atan(this.vt_y / this.v0_x);
    rd = Number(rd.toFixed(2));
    this.speed_radius = rd;
    if (this.isReachTopEdge()) {
      this.setReachTopEdge();
    }
	}
   
	Yup(t){
		//如果速度<=0 改变方向的同时。将初速度设置为0。重算时间。
		this.vt_y = this.v0_y  - this.g * t; //Vy=V0.sinθ + g.t 
		if( this. vt_y < 0){//如果速度小于0，则变为0
			this.vt_y = 0;
			this.setDown();//下落。
		}
		//位移公式：v0^2 - vt^ = 2as 
		this.unit_y_s  = ( Math.pow(this.v0_y,2) - Math.pow( this.vt_y,2))/(2*this.g);
		this.unit_y_s  = Number( this.unit_y_s.toFixed(2));
		//别忘记，更新v0
		this.unit_y_s  = this.exchange( this.unit_y_s );
		this.y -= this.unit_y_s;//上升 y要递减。
		this.vt_y = Number( this.vt_y.toFixed(2));
		this.v0_y = this.vt_y;
	}

	Ydown(t){
		this.vt_y = this.v0_y  + this.g * t; //Vy=V0.sinθ + g.t 
		//位移公式：v0^2 - vt^ = 2as  正常：末速度>初速度恒成立。 异常：末速度<= 初速度。由于浮点数计算误差导致。
    this.vt_y = Number(this.vt_y.toFixed(2));
		this.unit_y_s  = ( Math.pow( this.vt_y,2) - Math.pow( this.v0_y,2))/(2*this.g);
		this.unit_y_s  = Number( this.unit_y_s.toFixed(2));
		this.unit_y_s  = this.exchange( this.unit_y_s );
		this.y += this.unit_y_s;//下落y要增。
    if (this.isReachBottom() ){//大于下边界。
      this.dropdwonflag = true;
		  this.setToBottom();
			this.setUp();//反弹。
      this.slowdown();
      if (this.v0_y < 1 && this.v0_x< 1 ){
        this.stop("停止");
      }
      return;
		} 
		this.v0_y = this.vt_y;		
	}
	Xmove( t ){
		this.unit_x_s = this.v0_x * t;  //   
		//转换为像素	
		this.unit_x_s *= this.rate;
		this.unit_x_s = Number( this.unit_x_s.toFixed(2)  );
		this.x += this.unit_x_s;
	}
  
	checkBounds(){
		if( this.isRight() && this.isReachRightEdge() ){//右墙边检测。
			 this.setToLeftEdge();
    } else if ( this.isLeft() && this.isReachLeftEdge() ) {//左墙边检测。
		   this.setToRightEdge();
		}
	}

	repaint(){
		this.cxt.save();
    this.cxt.beginPath();
    let X_0 = this.x;
    X_0 = Math.round(X_0);
    let Y_0 = Math.abs(this.y);
    Y_0 = Math.round(Y_0 );
    Y_0 = this.box_h - Y_0;
    //this.cxt.translate(0,this.box_h);//原来：将坐标移动到世界坐标原点。
    this.cxt.translate(X_0, Y_0);
    if (this.debuggermode){
        this.cxt.fillStyle = "#25d36f";
        this.cxt.arc(0, 0, this.r, 0, 2 * Math.PI);
        this.cxt.fill();
    }
    this.updateRadius();
    this.cxt.drawImage(this.img, -this.r,-this.r, this.r*2 , this.r*2);
    this.cxt.closePath();
		this.cxt.restore();
    
   
	}
  updateRadius(){
    //this.cxt.rotate旋转时，正值为顺时针，负值为逆时针。
    if(this.isUp() ){
        if(this.isLeft()){ //角度变化：大角度-->小角度。
          this.cxt.rotate((this.speed_radius + Math.PI * 0.5));//先顺时针旋转90°再 +  this.speed_radius
        } else if (this.isRight()) {//角度变化：大角度-->小角度。
          this.cxt.rotate((-this.speed_radius - Math.PI * 0.5));//先逆时针旋转90°再  - this.speed_radius
        } 
    }else if(this.isDown () ){
      if (this.isLeft()) {   //角度变化：小角度--> 大角度
        this.cxt.rotate((Math.PI * 0.5 - this.speed_radius   ));
      
      } else if (this.isRight()) {//角度变化：小角度--> 大角度
        this.cxt.rotate((this.speed_radius - Math.PI * 0.5 ));
      }
    }
   
  }
 
  slowdown(){
    this.v0_y *= this.speedsubrate;
    this.v0_x *= this.speedsubrate;
    this.v0_y = Number(this.v0_y.toFixed(2));
    this.v0_x = Number(this.v0_x.toFixed(2));
  }
  slowdownX(speed = 0.1) {
    this.v0_x *= speed;
  }
  slowdownY(speed=0.2) {
    this.v0_y *= speed;
  }
	exchange(x){
		x *= this.rate;
		return Number( x.toFixed(2)  );
	}
 
 
  X( x ){
     this.x +=x;
     return this;
  }
  Y(y) {
    this.y += y;
    return this;
  }
  setX(x){
    this.x = x;
    return this;
  }
  setY(y){
      this.y = y;
      return this;
  }
  setXY(posi){
    this.setX(posi.x);
    this.setY(posi.y);
  }

  isReachTopEdge(){return this.y < - this.box_h - 60; }
  setReachTopEdge() { this.y = - this.box_h - 60 ;}

  isReachBottom(){ return this.y> - this.r;}/* 因为y轴正方向向下。 */
  setToBottom(){this.y=- this.r;}
  isReachLeftEdge() {return this.x < -this.r;}/*因为可以穿墙。所以要小于球的半径。*/
  setToLeftEdge() { this.x = - this.r; }
  isReachRightEdge() { return this.x > this.box_w+this.r; }/*因为可以穿墙。所以要大于墙的宽度。*/
  setToRightEdge() { this.x = this.box_w + this.r; }

  setXaxisDir(dir){this.dir_x = dir;}/* 设置x轴的运动方向。*/
  setLeft(){this.dir_x = "left";}
  setRight() {this.dir_x = "right";}
  setUp() {this.dir_y = "up";}
  setDown() {this.dir_y = "down";}
  isLeft(){return this.dir_x == "left";}
  isRight() {return this.dir_x == "right";}
  isUp() {return this.dir_y == "up";}
  isDown() { return this.dir_y == "down";}
}