// pages/music_player/music_player.js
import { getSongDetail } from '../../service/player'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight:20,
    id:0,
    currentPage:0,
    playSong:{}
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
      console.log(res);
      if(res.code === 200){
        this.setData({
          playSong: res.songs[0]
        })
      }
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