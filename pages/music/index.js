// index.js
import { rankingStore } from '../../store/index';

import { getBanners,getPlaylist } from '../../service/song'

import queryBoundRect from '../../utils/queryBoundRect.js';
import { debounce } from '../../utils/subtract.js';
let debounceBoundRect = debounce(queryBoundRect);

Page({
  data(){
    return {
      banners:[],
      swiperHeight:0,
      // 推荐歌曲
      recommendSongs:[],

      // 热门歌单
      hotList:[],
      // 推荐歌单
      recommedList:[],
      // 榜单数据
      rankings:{
        newlist:{},
        originlist:{},
        soundlist:{}
      }
    }
  },
  blankSearch(){
      wx.navigateTo({
        url: '../search/index',
      })
  },

  pushMusicPlayDetail(e){
    let key = e.currentTarget.dataset.rankingKey;
    wx.navigateTo({
      url: `../music_detail/index?type=ranking&key=${key}`,
    })
  },

  swiperImageLoad(){
    debounceBoundRect('.swiper-image').then(res=>{
      console.log('swiperImageLoad count')
      let props = res[0];
      this.setData({
        swiperHeight:props.height
      })
    })
  },

  onLoad(options){
    this.getPageState();

    console.log('l',this.data);
    // 获取共享状态
    this.handleStoreState();
  },
  handleStoreState(){
    // 需要共享的数据

    // 请求排名音乐的数据
    rankingStore.dispatch('getRankingAction');
    rankingStore.onState('recommendSongs',(res)=>{
      console.log(res,'the');
      if(!res.tracks) return;
      const recommendSongs = res.tracks.slice(0,7);
      this.setData({
        recommendSongs
      })
    })

    rankingStore.onState('newlist',this.handleEffectState('newlist'))
    rankingStore.onState('originlist',this.handleEffectState('originlist'))
    rankingStore.onState('soundlist',this.handleEffectState('soundlist'))
  },
  handleEffectState(index){
    return (res)=>{
      if(Object.keys(res).length==0){ return; }
      const name = res.name;
      const coverUrl = res.coverImgUrl;
      const songList = res.tracks.slice(0,3);
      const playCount = res.playCount;
      const item = {
        name,
        coverUrl,
        songList,
        playCount
      }

      const rankings = { ...this.data.rankings,[index]:item }
      this.setData({
        rankings
      })
    }
  },
  getPageState(){
    getBanners().then(res=>{
      if(res.code==200){
        // 通过最新的数据对wxml进行渲染，渲染过程是异步的
        this.setData({
          banners:res.banners
        })
      }
    })

    getPlaylist().then(res=>{
      if(res.code==200){
        // 通过最新的数据对wxml进行渲染，渲染过程是异步的
        this.setData({
          recommedList:res.playlists
        })
      }
    })

    // 获取流行歌曲
    getPlaylist("流行").then(res=>{
      if(res.code==200){
        this.setData({
          hotList:res.playlists
        })
      }
    })

  }
})
