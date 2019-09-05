
const domain = "https://order.yuzhiculture.com";

export default class URL{
  urls =[];
  constructor(){
    //登陆地址。
    this.urls.push(domain.concat("/mini/miniUser/wxLogin"));
    //保存分数的地址。
    this.urls.push(domain.concat("/mini/gameRecord/add"));
  }
   
   /**
    * 获取登陆地址。
    */
   getLoginUrl(){
     return this.urls[0];
   }

   /**
    * 获取保存分数的地址。
    */
   getSaveScoresUrl(){
     return this.urls[1];
   }  

}