// index.js
import { rankingStore } from '../../store/index';

import { getBanners,getPlaylist } from '../../service/song'

import queryBoundRect from '../../utils/queryBoundRect.js';
import { debounce } from '../../utils/subtract.js';
import playStore from '../../store/player';
let debounceBoundRect = debounce(queryBoundRect);

Page({
  data(){
    return {
      banners:[],
      swiperHeight:0,
      // 推荐歌曲
      recommendSongs:[],

      // 当前播放歌曲
      playSong:{}, 
      isPlaying:false,

      // 热门歌单
      hotList:[],
      // 推荐歌单
      recommendList:[],
      // 榜单数据
      rankings:{
        newlist:{},
        originlist:{},
        soundlist:{}
      }
    }
  },
  openPlayer(){
    wx.navigateTo({
      url: `../music_player/music_player?id=${this.data.playSong.id}`,
    })
  },

  triggerPlay(){
    playStore.dispatch("controlPlayback",!this.data.isPlaying);
  },

  handleRecommendMore(){
   wx.navigateTo({
     url: '../music_detail/index?type=ranking&key=recommendSongs',
   })
  },

  // 歌曲推荐添加播放歌曲，播放列表
  startPlaySong(e){
    let { index ,id } = e.currentTarget.dataset;
    
    wx.navigateTo({
      url: '/pages/music_player/music_player?id='+id,
    })

    playStore.setState('playList',this.data.recommendSongs);
    playStore.setState('playListIndex',index)
  },

  // 到搜索页
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
    // 获取共享状态
    this.handleStoreState();
  },
  handleStoreState(){
    // 需要共享的数据

    // 请求排名音乐的数据
    rankingStore.dispatch('getRankingAction');
    rankingStore.onState('recommendSongs',(res)=>{
      if(!res.tracks) return;
      const recommendSongs = res.tracks.slice(0,7);
      this.setData({
        recommendSongs
      })
    })

    rankingStore.onState('newlist',this.handleEffectState('newlist'))
    rankingStore.onState('originlist',this.handleEffectState('originlist'))
    rankingStore.onState('soundlist',this.handleEffectState('soundlist'))

    playStore.onStates(['playSong','isPlaying'],({playSong ,isPlaying})=>{
      if(playSong){
        this.setData({ playSong })
      }

      if(isPlaying!=undefined){
        this.setData({ isPlaying })
      }
    })
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
          recommendList:res.playlists
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
