/**
 * Created by leazx on 2017/2/9.
 */

/**
 * 获取请求参数
 */
function params(name) {
  var after = window.location.hash.split("?")[1];
  if (after) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = after.match(reg);
    if (r != null) {
      return decodeURIComponent(r[2]);
    } else {
      return null;
    }
  }
}

/**
 * 是否为微信内置浏览器
 */
function isWeiXin() {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true;
  } else {
    return false;
  }
}

/**
 * 是否为支付宝内置浏览器
 */
function isAlipay() {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/AlipayClient/i) == 'alipayclient') {
    return true;
  } else {
    return false;
  }
}

/**
 * 保存用户信息
 * idName,idNo
 */
function setUser(user) {
  if (!user) {
    sessionStorage.removeItem("userInfo")
  } else {
    sessionStorage.setItem("userInfo", JSON.stringify(user))
  }

}

/**
 * 获取用户信息
 * @returns {string}
 */
function getUser() {
  let user = sessionStorage.getItem("userInfo");
  if (!user) {
    return null;
  }
  return JSON.parse(user);
}


/**
 * 保存token
 */
function setToken(token) {
  if (!token) {
    sessionStorage.removeItem("token")
    setUser() //为了清除用户信息
  } else {
    sessionStorage.setItem("token", token);
  }

}

/**
 * 获取token
 */
function getToken() {
  let token = sessionStorage.getItem("token");
  if (!token) {
    return
  }
  return token
}
/**
 * 设置cookie
 */
function setCookie(key, value, time) {
  var d = new Date();
  d.setTime(d.getTime() + time);
  document.cookie = key + '=' + value + ';expires=' + d.toGMTString();

}
/**
 * 清除cookie
 */
function removeCookie(key) {
  setCookie(key, '', -1); //这里只需要把Cookie保质期退回一天便可以删除
}
/**
 * 获取cookie
 */
function getCookie(key) {
  var cookieArr = document.cookie.split('; ');
  for (var i = 0; i < cookieArr.length; i++) {
    var arr = cookieArr[i].split('=');
    if (arr[0] === key) {
      return arr[1];
    }
  }
  return false;
}

// 改变页面标题的办法
function setWechatTitle(title) {
  document.title = title;
  // try {
  //   let mobile = navigator.userAgent.toLowerCase();
  //   if (/iphone|ipad|ipod/.test(mobile)) {
  //     if (window.AndroidJs || window.webkit) {
  //       window.webkit.messageHandlers.changeTitle.postMessage(title);
  //     }
  //   }
  // } catch (e) {
  //   console.log(e)
  // }
}

/**
 * 获取一个地址附带的参数值
 */
function urlParam(url,name) {
  var after = url.split("?")[1];
  if (after) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = after.match(reg);
    if (r != null) {
      return decodeURIComponent(r[2]);
    } else {
      return null;
    }
  }
}
export default {
  params,
  isWeiXin,
  isAlipay,
  setUser,
  getUser,
  getToken,
  setToken,
  setCookie,
  removeCookie,
  getCookie,
  setWechatTitle,
  urlParam
}
