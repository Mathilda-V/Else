function formatDate(time) {

  let currentDate = new Date(time);

  let year = currentDate.getFullYear()
  let month = currentDate.getMonth() + 1
  let date = currentDate.getDate()
  let hour = currentDate.getHours()
  let minute = currentDate.getMinutes()
  let second = currentDate.getSeconds()

  month < 10 && (month = `0${month}`)
  date < 10 && (date = `0${date}`)
  hour < 10 && (hour = `0${hour}`)
  minute < 10 && (minute = `0${minute}`)
  second < 10 && (second = `0${second}`)

  return `${year}-${month}-${date} ${hour}:${minute}:${second}`
}

function countDownDate(end, period = ''){
  let date = new Date()
  let now = date.getTime()
  if(!end){
    var endTime = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${period}:00`
    var end = new Date(endTime).getTime()
    // console.log(endTime)
  } else {
    end = new Date(end).getTime()
  }
  if(now - end > 0){
    return ''
  } else {

    let lastTime = Math.round(end - now)
    const day = 1000 * 60 * 60 * 24;
    const hour = 1000 * 60 * 60;
    const minute = 1000 * 60;
    const second = 1000;
    let d = Math.floor(lastTime / day);
    let h = Math.floor((lastTime - d * day) / hour);
    let m = Math.floor((lastTime - d * day - h * hour) / minute);
    let s = Math.floor((lastTime - d * day - h * hour - m * minute) / second);
    // d < 10 && (d = `0${d}`)
    h < 10 && (h = `0${h}`)
    m < 10 && (m = `0${m}`)
    s < 10 && (s = `0${s}`)

    let formated = `${d}天${h}:${m}:${s}`
    return formated.substr(0,2) == '00' ? `${h}:${m}:${s}` : formated
  }
}
function timeStamp(s) {
  var t;
  if (s > -1) {
    var day = Math.floor(s / 86400);
    var hour = Math.floor(s / 3600)%24;
    var min = Math.floor(s / 60) % 60;
    var sec = s % 60;
    t = `${day}天 `;
    if (hour < 10) {
      t += `0${hour}:`;
    } else {
      t += `${hour}:`;
    }
    if (min < 10) { t += "0"; }
    t += `${min}:`;
    if (sec < 10) { t += "0"; }
    t += sec;
  }
  return t;
}
module.exports = {
  countDownDate, formatDate, timeStamp
}