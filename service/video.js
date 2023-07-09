import request from './index';
export function getTopMV(offset,limit=10){
  return request.get('/top/mv',{
    offset,
    limit
  })
}


/**
 * 获取MV视频地址
 * @param {number} id 
 */
export function getMVURL(id){
  return request.get('/mv/url',{
    id
  })
}

/**
 * 获取MV详细信息
 * @param {number} mvid 
 */
export function getMVDetail(mvid){
  return request.get('/mv/detail',{
    mvid
  })
}

/**
 * 获取MV相关视频
 * @param {number} id 
 */
export function getMVRelated(id){
  return request.get('/related/allvideo',{
    id
  })
}