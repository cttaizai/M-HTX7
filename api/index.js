class Request{
  BASE_URL = "http://123.207.32.32:9001"

  request(url,method,params){
    return new Promise((resolve,reject)=>{
      wx.request({
        url:this.BASE_URL + url,
        method,
        data:params,
        success(res){
          resolve(res.data)
        },
        fail:reject
      })
    })
   
  }

  get(url,params){
    return this.request(url,'GET',params);
  }

  post(url,data){
    return this.request(url,'POST',data);
  }
}

export default new Request();