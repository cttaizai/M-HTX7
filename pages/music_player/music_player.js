// pages/music_player/music_player.js
import { getSongDetail } from '../../service/player'
import { audioContext } from '../../store/player'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight:20,
    id:0,
    currentPage:0, // 当前Tab索引
    playSong:{}, // 播放歌曲信息
    durationTime:0, // 总播放时长
    currentTime:0, // 当前播放时间
    playProgress:0,
    handChange:false // 是否手动改变
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id;
    this.setData({id})
    this.setupPlaySong(id);
  },


  changePage(event){
    const index = event.detail.current;
    this.setData({
      currentPage:index
    })
  },

  setupPlaySong(id){
    getSongDetail(id).then(res=>{
      if(res.code === 200){
        this.setData({
          playSong: res.songs[0],
          durationTime:res.songs[0].dt
        })
      }
    })

    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    
    audioContext.autoplay = true;
    // 歌曲准备完成
    audioContext.onCanplay(()=>{
      audioContext.play();
    })

    audioContext.onTimeUpdate(()=>{
      if(!this.data.handChange){
        let currentTime = audioContext.currentTime * 1000;
        let durationTime = this.data.durationTime;
        let progress =  currentTime / durationTime * 100;

        this.setData({
          currentTime,
          playProgress:progress
        })
      }

      
    })
  },

  sliderChange(e){
    let value = e.detail.value;
    audioContext.pause();
    let targetTime = this.data.durationTime * value / 100;
    audioContext.seek(targetTime / 1000);
    audioContext.play();
    
    this.setData({
      handChange:false
    })
  },

  sliderChanging(e){
    let value = e.detail.value;
    let currentTime = this.data.durationTime * value / 100;
    this.setData({
      currentTime,
      handChange:true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.setData({
      statusBarHeight:app.globalData.statusBarHeight
    })
  },
})