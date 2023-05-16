import request from './index';

export const getSearchHot = ()=>{
  return request.get('/search/hot');
}

export const getSearchSuggest = (keywords)=>{
  return request.get('/search/suggest',{
    keywords,
    type:'mobile'
  });
}

export const searchSong = (keywords)=>{
  return request.get('/search',{
    keywords
  });
}

