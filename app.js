// app.js
App({
  globalData:{
    screenWidth:375,
    screenHeight:667,
    statusBarHeight:20,
  },
  onLaunch(){
    wx.getSystemInfoAsync({
      success:(systemInfo)=>{
        this.globalData.screenHeight = systemInfo.screenHeight;
        this.globalData.screenWidth = systemInfo.screenWidth;
        this.statusBarHeight = systemInfo.statusBarHeight;
      }
    });
  }
})
