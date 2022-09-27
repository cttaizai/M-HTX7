import request from './index';
export function getTopMV(offset,limit=10){
  return request.get('/top/mv',{
    offset,
    limit
  })
}