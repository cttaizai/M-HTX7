// pages/music_detail/index.js
import { getPlaylistDetail } from '../../service/song';
import { rankingStore } from '../../store/ranking' 
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type:'',
    playlist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const type = options.type;
    this.setData({
      type
    })
    if(type==='ranking'){
      const key = options.key;
      rankingStore.onState(key,(state)=>{
        this.setData({
          playlist:state
        })
      })
    }else if(type === 'id'){
      const id = options.id;
      getPlaylistDetail(id).then(res=>{
        this.setData({
          playlist:res.playlist
        })
      })
    }
  },

  
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },
})