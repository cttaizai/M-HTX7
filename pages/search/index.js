// pages/search/index.js
import { getSearchHot, getSearchSuggest } from '../../service/search'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue:'',
    hots:[],
    suggestSongs:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getPageData();
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
  },

  getPageData(){
    getSearchHot().then(res=>{
      if(res.code === 200){
        let hots = res.result.hots;
        this.setData({
          hots
        })
      }
    })
  },

  changeSearch(event){
    const value = event.detail;
    this.setData({
      searchValue:value
    })

    if(!value){ 
      this.setData({
        suggestSongs:[]
      })
      return;
     }

    getSearchSuggest(value).then(res=>{
      console.log(res.result.allMatch);
      if(res.code==200){
        this.setData({
          suggestSongs:res.result.allMatch
        })
      }
    })
  }
})