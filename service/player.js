import request from './index';


// 获取歌曲信息
export const getSongDetail = (ids)=>{
  return request.get("/song/detail",{
    ids
  })
}

// 获取歌词
export const getSongLyric = (id)=>{
  return request.get({
    url:'/lyric',
    data:{
      id
    }
  })
} 