(function () {
    let u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
        window.isAndroid = true;
    } else if (u.indexOf('iPhone') > -1) {//苹果手机
        window.isiOS = true;
    } else if (u.indexOf('Windows Phone') > -1) {//winphone手机
        window.isWinphone = true;
    }
})()