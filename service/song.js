import request from './index';

export const getBanners = ()=>request.get('/banner',{type:2})

export const getRankings = id => {
  return request.get("/playlist/detail", {
    id
  })
}

export const getPlaylistDetail = (id)=>{
  return request.get('/playlist/detail',{
    id
  })
}

export const getPlaylist = (cat="全部",limit=6,offset=0,order='hot')=>{
  return request.get("/top/playlist", {
    cat,
    limit,
    offset,
    order
  })
}

