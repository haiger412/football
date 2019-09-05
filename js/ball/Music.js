
export default class Music {
  constructor() {
  }
  onInit(){
    //背景音乐  循环播放。
   this.bgmAudio = wx.createInnerAudioContext();
    this.bgmAudio.src = 'audio/bgm.mp3'
    this.bgmAudio.autoplay = true
    this.bgmAudio.loop = true
 
    //踢毽子音乐。也就是手指按下屏幕瞬间要响起的音乐。 单帧播放。
    this.hittingAudio = wx.createInnerAudioContext();
    this.hittingAudio.src = 'audio/da.mp3'

    //得分或失败音乐。    单帧播放。
    this.gainscoreAudio = wx.createInnerAudioContext();
    this.gainscoreAudio.src = 'audio/winorfail.mp3'
 
     this.playBGM();
  }
  playBGM() {
    this.bgmAudio.play()
  }

  playHitting(){
    this.hittingAudio.play()
  }

  playWinOrFail(){
    this.gainscoreAudio.play()
  }


}
