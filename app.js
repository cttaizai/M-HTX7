// app.js

import { getWxCode , getToken ,checkSession, checkToken } from './service/login';
import { TOKEN_KEY } from './utils/constant';
App({
  globalData:{
    screenWidth:375,
    screenHeight:667,
    statusBarHeight:20,
  },
 async onLaunch(){
    wx.getSystemInfoAsync({
      success:(systemInfo)=>{
        this.globalData.screenHeight = systemInfo.screenHeight;
        this.globalData.screenWidth = systemInfo.screenWidth;
        this.statusBarHeight = systemInfo.statusBarHeight;
      }
    });

    this.handleLogin();
  },
  async handleLogin(){
    const token = wx.getStorageSync(TOKEN_KEY);

    const checkResult = await checkToken();

    const isSession = await checkSession();

    if(!token || checkResult.errorCode || !isSession){
      this.startLogin()
    }
  },
  async startLogin(){
    const code = await getWxCode();
    const tokenResult = await getToken(code);
    wx.setStorageSync(TOKEN_KEY,tokenResult.token)
  }
})
