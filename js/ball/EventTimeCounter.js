export default class EventTimeCounter{
    lasttime = null;
    
    getSpeed(){
      let speed =1;
      if (this.lasttime == null) {
        this.lasttime = Date.now();
      } else {
        let t = Date.now();
        let offset = t - this.lasttime;
        if (offset < 100){
            speed =1.3;
        }else if (offset < 150) {
          speed = 1.25;
        } else if (offset < 200) {
          speed = 1.2;
        } else if (offset < 250) {
          speed = 1.15;
        } else if (offset < 300) {
          speed = 1.1;
        }else{
          speed = 1;
        }
        this.lasttime = t;
      }
      return speed;
      
    }
   
}