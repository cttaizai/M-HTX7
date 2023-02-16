import request from './index';

export const getBanners = ()=>request.get('/banner',{type:2})