// components/top-nav/top-nav.js
Component({
  options:{
    multipleSlots:true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title:String,
    value:"标题"
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
    backPage(){
      wx.navigateBack();
    }
  }
})
