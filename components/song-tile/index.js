// components/song-tile/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:Object,
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
    songItemTap(){
      let id  = this.properties.item.id;
      wx.navigateTo({
        url: '/pages/music_player/music_player?id='+id,
      })
    }
  }
})
