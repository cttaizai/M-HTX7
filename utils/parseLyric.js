let pattern = /\[(?<m>\d{2}):(?<s>\d{2})\.(?<ms>\d{2,3})\]/;
export function parseLyric(lyricString){
  let splitShort = lyricString.split('\n');
  console.log(splitShort);
  let lyricList = []
  for (const lineStr of splitShort) {
    let matcher  = pattern.exec(lineStr);
    if (!matcher) continue
    let time =  matcher.groups;
    let minute =  time.m * 60 * 1000;
    let second =   time.s * 1000;
    let millis =  time.ms.length == 2? time.ms * 10: +time.ms;
    
    console.log(minute,second,millis,lineStr);
    lyricList.push({
      time: minute + second + millis,
      words: lineStr.replace(pattern,'')
    })
  }
  return lyricList;
}