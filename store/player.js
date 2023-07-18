import { HYEventStore } from 'hy-event-store'
import { getSongDetail, getSongLyric } from '../service/player'

import { parseLyric } from '../utils/parseLyric.js';

// export const audioContext = wx.createInnerAudioContext();
export const audioContext = wx.getBackgroundAudioManager();

const playStore = new HYEventStore({
  state: {
    isSetup:false,
    isStop:false,

    id: 0, // 歌曲id
    playSong: {}, // 播放歌曲信息
    durationTime: 0, // 总播放时长

    currentTime: 0, // 当前播放时间
    lyricList: [], // 歌词列表
    lyric_t: '', // 当前显示歌词
    lyric_i: 0, // 当前歌词索引

    playModeId: 0, // 播放模式 0->顺序 1->循环 2 随机
    isPlaying: true, // 播放状态

    playList:[], // 播放列表
    playListIndex:0 // 当前索引
  },
  actions: {
    changeSongAction(ctx,type){
      let posIndex = ctx.playListIndex;
      let playList = ctx.playList;
      let len = playList.length

      console.log(playList,posIndex);

      switch(ctx.playModeId){
        case 0: // 顺序播放
          posIndex+= type=='next' ? 1: -1;
          if(posIndex == -1) posIndex = len -1
          if(posIndex == len) posIndex = 0
          break;
        case 1:
          // 单曲循环
          break;
        case 2: // 随机播放
          posIndex = Math.floor(Math.random() * len)
          break;
      }

      // 获取歌曲
      let prePlaySong = playList[posIndex];
      if(!prePlaySong){
        prePlaySong = ctx.playSong;
      }else{
        ctx.playListIndex = posIndex;
      }

      this.dispatch("startPlaySong",prePlaySong.id)
    },
    // 播放歌曲
    startPlaySong(ctx, id) {
      if(ctx.id == id){
        // 重新播放
        this.dispatch('controlPlayback',true)
        // 阻止下面加载相同歌曲，导致重新播放
        return;
      }
      ctx.id = id;
      // 清除之前播放的歌曲信息
      this.dispatch('clearPlaySong')
      // 获取歌曲信息
      this.dispatch('getPlaySongAction', id);

      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.autoplay = true
      audioContext.title = 'M-HTX7'


      if(!ctx.isSetup){
        this.dispatch("handleSongPlaying")
        ctx.isSetup = true
      }
    },
    // 清除上次播放信息
    clearPlaySong(ctx){
      ctx.playSong = {};
      ctx.currentTime = 0;
      ctx.durationTime = 0;
      ctx.lyricList = [];
      ctx.lyric_t = '';
      ctx.lyric_i = 0;
    },
    getPlaySongAction(ctx, id) {
      getSongDetail(id).then(res => {
        if (res.code === 200) {
          ctx.playSong = res.songs[0];
          ctx.durationTime = res.songs[0].dt;
          audioContext.title =res.songs[0].name;
        }
      })
      getSongLyric(id).then(res => {
        if (res.code === 200) {
          const lyricString = res.lrc.lyric;
          ctx.lyricList = parseLyric(lyricString);
        }
      })
    },
    handleSongPlaying(ctx) {
      // 歌曲准备完成
      audioContext.onCanplay(() => {
         audioContext.play();
         ctx.isPlaying = true;
      })

      audioContext.onTimeUpdate(() => {
        ctx.currentTime = audioContext.currentTime * 1000;
        this.dispatch('getLyric', ctx.currentTime)
      })

      audioContext.onEnded(()=>{
        this.dispatch("changeSongAction",'next')
      })

      audioContext.onPlay(()=>{
        ctx.isPlaying = true;
      })

      audioContext.onPause(()=>{
        ctx.isPlaying = false;
      })

      audioContext.onStop(()=>{
        ctx.isPlaying = false;
        ctx.isStop = true;
      })
    },
    controlPlayback(ctx,isPlaying=true){
      ctx.isPlaying = isPlaying
      if(isPlaying && ctx.isStop){
        //  如果是停止状态，重新设置src
         audioContext.singer = ctx.playSong.ar[0].name
         audioContext.coverImgUrl = ctx.playSong.al.picUrl
         audioContext.seek(ctx.currentTime / 1000);
         ctx.isStop = false;
      }
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
    },
    // 匹配歌词当前播放歌词
    getLyric(ctx, currentTime) {
      if (!ctx.lyricList.length) return;
      // 找到当前第一个播放时间大于的当前时间的，需要显示的是他前一个
      let findLineIndex = ctx.lyricList.findIndex(item => currentTime < item.time);
      // let i = 0;
      // for (; i < ctx.lyricList.length; i++) {
      //   let item = ctx.lyricList[i]
      //   console.log(item,'拿到的',i,ctx.lyricList);
      //   if (currentTime < item.time) {
      //     // break;
      //   }
      // }
      let index = findLineIndex - 1;
      if (index == ctx.lyric_i || index < 0) return;

      let currentLyric = ctx.lyricList[index];
      ctx.lyric_t = currentLyric.words;
      ctx.lyric_i = index;
    },
  }
})

export default playStore;
