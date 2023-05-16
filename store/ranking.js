import {  HYEventStore } from 'hy-event-store';
import { getRankings } from '../service/song';


// '5059661515','6688069460','3779629','3778678'
let rankingsIdMap = {
  recommendSongs:3778678, // 推荐歌曲
  newlist:3779629, // 热门歌单
  originlist:2884035, // 原创歌单
  // surgelist:19723756, // // 原创歌单:
  soundlist:6688069460
}

const rankingStore =  new HYEventStore({
  state:{
    recommendSongs:[], // 1 热门 ,
    newlist:[],
    originlist:[],
    soundlist:[]
  },
  actions:{
    getRankingAction(ctx){
      // 5059661515 民谣
      // 6688069460 听歌识曲
      // 3779629 新歌
      // 3778678 热歌榜
      for (const key in rankingsIdMap) {
        let id = rankingsIdMap[key]
        getRankings(id).then((res)=>{
          ctx[key] = res.playlist;
        })
      }
    }
  }
})


export {
  rankingStore
}

console.log(rankingStore)

