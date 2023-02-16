export function debounce(fn,dalay){
  let timer = null;
  return function (...args){
    return new Promise((resolve, reject) => {
      if(timer){ clearTimeout(timer) };
        timer = setTimeout(()=>{
          let result = fn.apply(this,args)
          resolve(result)
        },dalay)
      })
  }
}

function throttle (fn,delay) {
  let bef = 0;  // 第一次调用此函数时执行，重复调用函数只执行return函数
  return function (){
      //获取当前时间戳
      let now = new Date().getTime();
      //如果当前时间减去上次时间大于限制时间时才执行
      if(now - bef > delay){
          fn.call(this);
          bef = now;
      }
  }
}