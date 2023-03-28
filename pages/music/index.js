// index.js
import { rankingStore } from '../../store/index';

import { getBanners } from '../../api/song';

import queryBoundRect from '../../utils/queryBoundRect.js';
import { debounce } from '../../utils/subtract.js';
let debounceBoundRect = debounce(queryBoundRect);

Page({
  data(){
    return {
      banners:[],
      swiperHeight:0,
      recommedList:[]
    }
  },
  blankSearch(){
      wx.navigateTo({
        url: '../search/index',
      })
  },

  swiperImageLoad(){
    debounceBoundRect('.swiper-image').then(res=>{
      console.log('exec count')
      let props = res[0];
      this.setData({
        swiperHeight:props.height
      })
    })
  },

  onLoad(options){
    this.getPageState();

    // 获取共享状态
    this.getShareState();
  },
  getShareState(){
    // 请求排名音乐的数据
    rankingStore.dispatch('getRankingAction');
    // 请求排名音乐的数据
    rankingStore.onState('hotRanking',(res)=>{
      if(!res.tracks) return;
      const recommedList = res.tracks.slice(0,7);
      console.log(recommedList);

      this.setData({
        recommedList
      })
    })
  },
  getPageState(){
    getBanners().then(res=>{
      if(res.code==200){
        // 小程序中 setData在设置data数据是同步的，
        // 通过最新的数据对wxml进行渲染，渲染过程是异步的
        this.setData({
          banners:res.banners
        })

        // react -> setState 是异步的
      }
    })


  }
})
