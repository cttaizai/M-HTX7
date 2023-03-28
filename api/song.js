import request from './index';

export const getBanners = ()=>request.get('/banner',{type:2})

export const getRankings = id => {
  return request.get("/playlist/detail", {
    id
  })
}

