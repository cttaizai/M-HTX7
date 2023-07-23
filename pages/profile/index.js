// pages/profile/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  getPhoneNumber(e){
    const code = e.detail
    console.log(code);
  },
  getUserProfile(){
    wx.getUserProfile({
      desc: '爷',
      success: (res) => {
       console.log(res);
      }
    })
  }
})