// index.js
import { getBanners } from '../../api/music';
import queryBoundRact from '../../utils/queryBoundRact.js';
import { debounce } from '../../utils/subtract.js';

let debounceBoundRact = debounce(queryBoundRact);
Page({
  data(){
    return {
      banners:[],
      swiperHeight:0
    }
  },
  blankSearch(){
      wx.navigateTo({
        url: '../search/index',
      })
  },

  swiperImageLoad(){
    debounceBoundRact('.swiper-image').then(res=>{
      console.log('执行次数')
      let ractProp = res[0];
      this.setData({
        swiperHeight:ractProp.height
      })
    })
  },

  onLoad(options){
    this.getPageState();
  },

  getPageState(){
    getBanners().then(res=>{
      if(res.code==200){
        this.setData({
          banners:res.banners
        })
      }
    })
  }
})
