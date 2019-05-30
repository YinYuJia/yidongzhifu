// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/basic.css'
import './assets/iconfont/iconfont.css'
import 'mint-ui/lib/style.css'
import MintUi from 'mint-ui'
import {
  Indicator,
  MessageBox
} from 'mint-ui';
import req from './utils/requestType'
import Utils from './utils/util'
import './utils/rem'
import './utils/userAgent'
import * as filters from './utils/filter'
import dsBridge from 'dsbridge'
import './utils/vconsole'

Vue.config.productionTip = false


import VueTouch from 'vue-touch'

Vue.use(VueTouch, {name: 'v-touch'})

VueTouch.config.swipe = {

threshold: 100 //手指左右滑动距离

}

router.beforeEach((to, from, next) => {
  Indicator.close();
  if (to.meta.title) {
    Utils.setWechatTitle(to.meta.title);
  }
  if (to.meta.sign === 'special') {
    dsBridge.register('goWebBack', function () {
      return false;
    })
    window.goWebBack = function () {
      return false;
    };
  } else {
    dsBridge.register('goWebBack', function () {
      history.go(-1);
      return true;
    })
    window.goWebBack = function () {
      history.go(-1);
      return true;
    }
  }
  if (to.meta.isLogin === 'no') {
    next()
  } else {
    let token = Utils.getToken();
    if (token) {
      next();
    } else {
      let ticket = Utils.params('ticket');
      let channelNo = Utils.params('channelNo');
      let signNo = Utils.params('signNo');
      if (ticket && channelNo) {
        sessionStorage.setItem("channelNo", channelNo);
        sessionStorage.setItem("signNo", signNo);
        req.post("/msc/user/token", {
          ticket: ticket
        }).then(res => {
          if (res.success) {
            Utils.setUser(JSON.parse(res.body));
            Utils.setToken(res.token);
            let params = {
              inData: {
                channelNo: channelNo,
                signNo: signNo,
              }
            };
            req.post("/msc/8500", params).then(res => {
              if (res.success && res.body) {
                this.signLevel = res.body.signLevel;
                sessionStorage.setItem("signLevel", this.signLevel);
                next()
              } else {
                console.log("暂未开通电子社保卡业务");
                next()
              }
            });
          } else {
            MessageBox.alert(res.message).then(res => {
              dsBridge.call("close", "");
            });
          }
        })
      } else {
        // SDK需要
        let ticket;
        dsBridge.call("getUser", "", (res) => {
          let user = JSON.parse(res);
          sessionStorage.setItem("channelNo", user.channelNo);
          sessionStorage.setItem("signNo", user.signNo);
          ticket = user.ticket;
          req.post("/msc/user/token", {
            ticket: ticket
          }).then(res => {
            if (res.success) {
              Utils.setUser(JSON.parse(res.body));
              Utils.setToken(res.token);
              let params = {
                inData: {
                  channelNo: sessionStorage.getItem("channelNo") || "",
                  signNo: sessionStorage.getItem("signNo") || "",
                }
              };
              req.post("/msc/8500", params).then(res => {
                if (res.success && res.body) {
                  this.signLevel = res.body.signLevel;
                  sessionStorage.setItem("signLevel", this.signLevel);
                  next()
                } else {
                  console.log("暂未开通电子社保卡业务");
                  next()
                }
              });
            } else {
              MessageBox.alert(res.message).then(res => {
                dsBridge.call("close", "");
              });;
            }
          })
        });

        // 本地测试 
        // sessionStorage.setItem("channelNo", '3300000001');
        // sessionStorage.setItem("signNo", '8D82D578C0491D5DCA4D71CE9E7360AF');
        // req.post("/msc/user/token", {
        //   ticket: 'fab2d58a2e4e4c0085ab724babdb2270'
        // }).then(res => {
        //   if (res.success) {
        //     Utils.setUser(res.body);
        //     Utils.setToken(res.token);
        //     let params = {
        //       inData: {
        //         channelNo: sessionStorage.getItem("channelNo") || "",
        //         signNo: sessionStorage.getItem("signNo") || "",
        //       }
        //     };
        //     req.post("/msc/8500", params).then(res => {
        //       if (res.success && res.body) {
        //         this.signLevel = res.body.signLevel;
        //         sessionStorage.setItem("signLevel", this.signLevel);
        //         next()
        //       } else {
        //         console.log("暂未开通电子社保卡业务");
        //         next()
        //       }
        //     });
        //   } else {
        //     MessageBox.alert(res.message);
        //   }
        // })
      }
    }
  }
})

router.afterEach((to, from, next) => {
  MessageBox.close();

})

Vue.use(MintUi);
Vue.use(dsBridge)
Vue.prototype.$http = req;
Vue.prototype.util = Utils
//vue过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})

window.Indicator= Indicator