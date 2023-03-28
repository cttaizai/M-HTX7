import {  HYEventStore } from 'hy-event-store';
import { getRankings } from '../api/song';

const rankingStore =  new HYEventStore({
  state:{
    hotRanking:{} // 1 热门 
  },
  actions:{
    getRankingAction(ctx){
      // 5059661515 民谣
      // 6688069460 听歌识曲
      // 3779629 新歌
      // 热歌榜
      let id = '3778678';
      getRankings(id).then((res)=>{
        ctx['hotRanking'] = res.playlist;
      })
    }
  }
})


export {
  rankingStore
}

console.log(rankingStore)

