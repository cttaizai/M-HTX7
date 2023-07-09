import { HYEventStore } from 'hy-event-store'
import { getSongDetail, getSongLyric } from '../service/player'

import { parseLyric } from '../utils/parseLyric.js';

export const audioContext = wx.createInnerAudioContext();

const playStore = new HYEventStore({
  state: {
    id: 0, // 歌曲id
    playSong: {}, // 播放歌曲信息
    durationTime: 0, // 总播放时长

    currentTime: 0, // 当前播放时间
    lyricList: [], // 歌词列表
    lyric_t: '', // 当前显示歌词
    lyric_i: 0, // 当前歌词索引

    playModeId: 0, // 播放模式
    isPlaying: true, // 播放状态
  },
  actions: {
    playSong(ctx, id) {
      ctx.id = id;
      // 获取歌曲信息
      this.dispatch('getPlaySongAction', id);

      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.autoplay = true
      // 歌曲准备完成
      audioContext.onCanplay(() => {
        audioContext.play();
        ctx.isPlaying = true;
      })

      this.dispatch("handleSongPlaying")
    },
    getPlaySongAction(ctx, id) {
      getSongDetail(id).then(res => {
        if (res.code === 200) {
          ctx.playSong = res.songs[0];
          ctx.durationTime = ctx.playSong.dt;
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
      audioContext.onTimeUpdate(() => {
        ctx.currentTime = audioContext.currentTime * 1000;
        this.dispatch('getLyric', ctx.currentTime)
      })
    },
    switchPlayState(ctx){
      ctx.isPlaying = !ctx.isPlaying;
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
    },
    // 匹配歌词当前播放歌词
    getLyric(ctx, currentTime) {
      if (!ctx.lyricList.length) return;
      // 找到当前第一个播放时间大于的当前时间的，需要显示的是他前一个
      let findLineIndex = ctx.lyricList.findIndex(item => currentTime < item.time);

      console.log(findLineIndex,ctx.lyricList,currentTime)
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
