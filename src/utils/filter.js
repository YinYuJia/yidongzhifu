Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

/* 字符串脱敏显示,front为前面保留几位，back为后面保留几位*/
export function tuoMin(str, front, back) {
  if (typeof str == 'string') { //参数为字符串类型
    if (str.length < 3) {
      return str;
    }
    let t = "************************"
    let ruten = str.substr(front, (str.length - front - back)); //提取字符串下标之间的字符。
    return str.replace(ruten, t.substr(0, ruten.length < 3 ? 3 : ruten.length)); //字符串中用字符替换另外字符，或替换一个与正则表达式匹配的子串。
  }
  return str;
}

/* 格式化日期显示*/
export function formatTime(value, formatStyle) {
  if (!value) {
    return "";
  }
  if (!formatStyle) {
    formatStyle = "yyyy-MM-dd hh:mm:ss";
  }
  return new Date(value).Format(formatStyle);
}

/*格式化金额显示*/
export function fixedNumber(value, fixNum) {
  if (!value) {
    return 0.00;
  }
  if (!fixNum) {
    fixNum = 2;
  }
  return value.toFixed(fixNum);
}

/*格式化付款方式显示*/
export function transPayMode(value) {
  let str = "";
  switch (parseInt(value)) {
    case 1:
      str = "社保金融卡账户支付";
      break;
    case 8:
      str = "微信支付";
      break;
    case 9:
      str = "支付宝支付";
      break;
    case 5:
      str = "银联云闪付";
    break;
    default: 
      str = "其他支付";
    break;
  }
  return str;
}

/*格式化支付状态显示*/
export function transPayState(value) {
  let str = "";
  switch (parseInt(value)) {
    case 1:
      str = "付款中";
      break;
    case 2:
    case 6:
      str = "已完成";
      break;
    case 3:
      str = "退款中";
      break;
    case 4:
      str = "退款完成";
      break;
    case 8:
      str = "已取消";
      break;
    case 9:
      str = "无效订单";
      break;
    default:
      break;
  }
  return str;
}
