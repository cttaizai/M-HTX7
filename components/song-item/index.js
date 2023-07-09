// components/song-item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    index:Number,
    song:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSongPlay(){
      const id = this.properties.song.id;

      console.log(id);
      wx.navigateTo({
        url: '../../pages/music_player/music_player?id='+id,
      })
    }
  }
})
