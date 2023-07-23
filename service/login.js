import { loginRequest } from "./index";

export function checkSession(){
  return new Promise((resolve,reject)=>{
    wx.checkSession({
      success: ()=>resolve(true),
      fail:()=>resolve(false),
    })
  })
}


export function getWxCode(){
  return new Promise((resolve,reject)=>{
    wx.login({
      success: (res) => {
        resolve(res.code)
      },
      fail(err){
        reject(err)
      }
    })
  })
}

export function getToken(code){
  return loginRequest.post('/login',{
    code
  })
}

export function checkToken(){
  return loginRequest.post('/auth',{})
}