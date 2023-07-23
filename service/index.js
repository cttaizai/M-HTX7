const BASE_URL = "http://123.207.32.32:9002";
const LOGIN_BASE = "http://123.207.32.32:3000";

import { TOKEN_KEY } from '../utils/constant'

const token = wx.getStorageSync(TOKEN_KEY);
class Request{
  constructor(BASE_URL){
    this.BASE_URL = BASE_URL
    this.baseHeader = {
      token
    }
  }
  // http://123.207.32.32:9002/
  request(url,method,params,header={}){
    return new Promise((resolve,reject)=>{

      console.log({ ...this.baseHeader,...header })
      wx.request({
        url: this.BASE_URL + url,
        method,
        data:params,
        header:{ ...this.baseHeader,...header},
        success(res){
          resolve(res.data)
        },
        fail:reject
      })
    })
  }

  get(url,params,header){
    return this.request(url,'GET',params,header);
  }

  post(url,data,header){
    return this.request(url,'POST',data,header);
  }
}

export default new Request(BASE_URL);

const loginRequest = new Request(LOGIN_BASE)

export {
  loginRequest
}