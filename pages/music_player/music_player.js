// pages/music_player/music_player.js
import { getSongDetail, getSongLyric } from '../../service/player'
import { audioContext } from '../../store/player';
import { parseLyric } from '../../utils/parseLyric.js';

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight:20,
    id:0, // 歌曲id
    currentPage:0, // 当前Tab索引
    playSong:{}, // 播放歌曲信息
    durationTime:0, // 总播放时长
    currentTime:0, // 当前播放时间
    playProgress:0, // 播放进度
    handChange:false, // 是否手动改变
    lyricList:[], // 歌词列表
    lyric_t:'', // 当前显示歌词
    lyric_i:0, // 当前歌词索引
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
  getPageState(){
    getSongDetail(id).then(res=>{
      if(res.code === 200){
        this.setData({
          playSong: res.songs[0],
          durationTime:res.songs[0].dt
        })
      }
    })


    getSongLyric(id).then(res=>{
      if(res.code === 200){
        const lyricString = res.lrc.lyric;
        console.log(res);
        let lyricList = parseLyric(lyricString);
        this.setData({
          lyricList
        })
      }
    })

    this.setupPlaySong();
  },
  setupPlaySong(id){
    
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    
    audioContext.autoplay = true;
    // 歌曲准备完成
    audioContext.onCanplay(()=>{
      audioContext.play();
    })

   
    
    this.songPlayHandler();
  },
  matchLrc(currentTime){
    // 匹配歌词显示歌词
    let i = 0;
    for(;i<this.data.lyricList.length;i++){
      let item = this.data.lyricList[i]
      if(currentTime < item.time){
        break;
      }
    }


    let index = i -1 ;
    if(index !== this.data.lyric_i){
      currentLyric = this.data.lyricList[index];
      currentLyric && this.setData({
          lyric_t:currentLyric.words,
          lyric_i:index,
      })
    }
  },
  songPlayHandler(){
    audioContext.onTimeUpdate(()=>{
      let currentTime = audioContext.currentTime * 1000;
      // 设置当前播放时间，播放进度
      if(!this.data.handChange){
        let durationTime = this.data.durationTime;
        let progress =  currentTime / durationTime * 100;

        this.setData({
          currentTime,
          playProgress:progress
        })
      }

      this.matchLrc(currentTime);
       
    })
  },
  sliderChange(e){
    // 跳转到播放位置
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
    // 更新播放时间
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