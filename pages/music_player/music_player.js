// pages/music_player/music_player.js
import { audioContext } from '../../store/player';

import playStore from '../../store/player';

const playTypes = ["order", "repeat", "random"];

import throttle from '../../utils/throttle';

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 20,
    currentPage: 0, // 当前Tab索引
    id: 0, // 歌曲id
    playSong: {}, // 播放歌曲信息
    durationTime: 0, // 总播放时长
    currentTime: 0, // 当前播放时间
    lyricList: [], // 歌词列表
    lyric_t: '', // 当前显示歌词
    lyric_i: 0, // 当前歌词索引

    isPlaying: false, // 当前播放状态
    playModeId:0, // 播放模式对应id
    playMode:playTypes[0], // 播放模式
    playProgress: 0, // 播放进度
    handChange: false, // 是否手动改变
    scrollTop: 0, // 当前歌词滚动位置
  },
  backPage(){
    wx.navigateBack();
  },

  handlePrevSong(){
    playStore.dispatch('changeSongAction','prev')
  },
  handleNextSong(){
    playStore.dispatch('changeSongAction','next')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id;
    this.setData({ id })

    // 播放歌曲
    playStore.dispatch('startPlaySong', id);
    // 读取共享数据
    this.onStoreState();
  },
  // 切换播放状态
  onPlaySwitch(){
    playStore.dispatch("controlPlayback",!this.data.isPlaying)
  },
  
  // 切换播放模式
  onChangeMode() {
    let index = ++this.data.playModeId % playTypes.length
    playStore.setState("playModeId",index)
  },
  onStoreState() {
    playStore.onStates(['playSong', 'durationTime', 'currentTime'], (
      { playSong, durationTime, currentTime }) => {
      if (playSong) {
        this.setData({
          playSong
        })
      }
      if (durationTime != undefined) {
        this.setData({
          durationTime
        })
      }

      if (currentTime != undefined) {
        // console.log('手动修改');
        // this.updateProgress(currentTime)

        if(!this.data.handChange){
          let playProgress = currentTime / this.data.durationTime * 100;
          this.setData({
            currentTime,
            playProgress
          })
        }
      }
    })
    playStore.onStates(['isPlaying', 'playModeId'], ({
      isPlaying, playModeId }) => {

      if (playModeId !== undefined) {
        this.setData({ playModeId,
        playMode:playTypes[playModeId]  })
      }
      if (isPlaying !== undefined) {
        this.setData({ isPlaying })
      }
    })

    playStore.onStates(['lyricList', 'lyric_t', 'lyric_i'], (states) => {
      let markState = Object.entries(states).filter(([_, value]) => value != undefined);
      this.setData(Object.fromEntries(markState))
    })
  },
  // 点击切换页码
  clickPageTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentPage: index
    })
  },
  // 切换页码
  changePage(event) {
    const index = event.detail.current;
    this.setData({
      currentPage: index
    })
  },
  // 不使用
  updateProgress:throttle(function (currentTime) {
    if(!this.data.handChange){
      let playProgress = currentTime / this.data.durationTime * 100;
      this.setData({
        currentTime,
        playProgress
      })
    }
  },500,{ leading: false, trailing: false }),
  // songPlayHandler() {
  //   audioContext.onTimeUpdate(() => {
  //     let currentTime = audioContext.currentTime * 1000;
  //     // 设置当前播放时间，播放进度
  //     if (!this.data.handChange) {
  //       let durationTime = this.data.durationTime;
  //       let progress = currentTime / durationTime * 100;

  //       this.setData({
  //         currentTime,
  //         playProgress: progress
  //       })
  //     }

  //     this.matchLrc(currentTime);
  //   })
  // },
  sliderChange(e) {
    // 跳转到播放位置
    let value = e.detail.value;
    let targetTime = this.data.durationTime * value / 100;
    // audioContext.pause();
    audioContext.seek(targetTime / 1000);
    // audioContext.play();

    this.setData({
      currentTime:targetTime,
      handChange: false
    })

    // 这里存在一个bug,脸黑被我遇到了， 调用完pause后 onTimeUpdate回调会不工作
    // https://developers.weixin.qq.com/community/develop/doc/00068a72a2c588d3c6c8edeac56800
    // setTimeout(() => { 
    //   console.log(audioContext.paused)
    // },100);
  },

  sliderChanging(e) {
    const value = e.detail.value

    // 计算当前时间
    const currentTime = value / 100 * this.data.durationTime
    this.setData({ currentTime: currentTime, handChange: true })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight
    })
  },
})