// pages/vdetail/index.js
import { getMVURL,getMVDetail,getMVRelated } from '../../../service/video';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvURL:'',
    introduction:[],
    relatedVideos:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let id = options.id;

    this.getPageState(id);
  },


  getPageState(id){
    // 预期同时3个数据
    getMVURL(id).then(res=>{
      if(res.code==200){
        this.setData({
          mvURL:res.data.url
        })
      }
    })
    // 这里不建议使用await，他会阻塞后续请求执行，不希望等待上个数据请求完再请求 
    getMVDetail(id).then(res=>{
      if(res.code==200){
        this.setData({
          introduction:res.data
        })
      }
    })

    getMVRelated(id).then(res=>{
      if(res.code==200){
        this.setData({
          relatedVideos:res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})