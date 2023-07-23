import { getPlaylistDetail } from '../../../service/song';
import playStore from '../../../store/player';
import { rankingStore } from '../../../store/ranking' 
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type:'',
    playlist:[]
  },

  handleSongPlay(e){
      let { id , index } = e.currentTarget.dataset;

      wx.navigateTo({  
        url: '/pages/music_player/music_player?id='+id,  
      })

      playStore.setState('playListIndex',index);
      playStore.setState('playList',this.data.playlist.tracks);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const type = options.type;
    this.setData({
      type
    })
    // 从共享数据获取
    if(type==='ranking'){
      const key = options.key;
      rankingStore.onState(key,(playlist)=>{
        this.setData({
          playlist
        })
      })
    }else if(type === 'id'){
      // 根据id查询歌单
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