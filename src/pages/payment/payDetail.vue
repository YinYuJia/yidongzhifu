<template>
  <div class="main">
    <div class="order_detail">
      <div class="title">{{ item.hospital }}-{{item.dept}}</div>
      <ul>
        <li>
          <label>就诊人：</label>
          <span>{{order.name | tuoMin(1, 1)}}</span>
        </li>
        <li>
          <label>社保卡号：</label>
          <span>{{order.card | tuoMin(3, 3)}}</span>
        </li>
        <li>
          <label>开方医生：</label>
          <span>{{item.doctor}}</span>
        </li>
      </ul>
      <table cellpadding="0" cellspacing="0" class="border_top">
        <tr class="line">
          <td class="border_bottom">项目/规格类</td>
          <td class="border_bottom">金额（元）</td>
          <td class="border_bottom">数量</td>
          <td class="border_bottom">自理自费（元)</td>
        </tr>
        <tr v-for="(item,index) in itemResults" v-show="index <= 1 || (index >= 2 && showMore)">
          <td>{{item.name }}</td>
          <td>{{item.money | fixedNumber}}</td>
          <td>{{item.num}}</td>
          <td>{{(item.selfCareExpense + item.selfExpense + item.overrun) | fixedNumber}}</td>
        </tr>
      </table>
      <div class="lookMore" v-show="itemResults.length > 2" @click="showMoreClick">{{displayName}}</div>
    </div>
    <div>
      <ul class="payment">
        <li class="border_bottom">
          <label>结算总金额：</label>
          <span>
            ¥
            <b>{{ settleResult.total | fixedNumber}}</b>
          </span>
        </li>
        <li class="border_bottom">
          <label>医保支付：</label>
          <span>
            ¥
            <b>{{settleResult.fundTotal | fixedNumber}}</b>
          </span>
        </li>
        <li>
          <label>个人支付：</label>
          <span class="text_color">
            ¥
            <b>{{settleResult.cash | fixedNumber}}</b>
          </span>
        </li>
      </ul>
      <ul class="time">
        <li>
          <label>下单时间：</label>
          <span>{{order.orderTime | formatTime}}</span>
        </li>
      </ul>
      <div class="foot">
        <div class="price border_top">
          支付金额：
          <span>¥</span>
          <label>{{settleResult.cash | fixedNumber}}</label>
        </div>
        <div @click="getSignCode()">立即支付</div>
      </div>
    </div>
  </div>
</template>

<script>
import OrderMsg from "../../utils/orderMsg";

export default {
  name: "payDetail",
  data() {
    return {
      id: "",
      user: this.util.getUser(),
      item: {},
      itemResults: [],
      settleResult: {},
      order: {},
      displayName: "查看更多",
      showMore: false,
      signInfo: {},
      pwdRet: "",
      signCode: ""
    };
  },
  created() {
    console.log("paydetail")
    this.item = JSON.parse(this.$route.query.obj);
    if (!this.item && !this.item.id) {
      this.$messagebox.alert("未获取到支付订单信息").then(r => {
        let medicalIndex = sessionStorage.getItem("medicalIndex") || "";
        if (medicalIndex) {
          this.$router.push("/");
        } else {
          let ua = navigator.userAgent;
          let isIos = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
          if (!isIos) {
            dsBridge.call("close", "");
          } else {
            window.webkit.messageHandlers.close.postMessage("yes");
          }
        }
      });
    } else {
      this.getList();
    }
    console.log("item",this.item)
    console.log("user",this.user)
  },
  mounted() {
    let medicalIndex = sessionStorage.getItem("medicalIndex") || "";
    if (!medicalIndex) {
      dsBridge.register("goWebBack", function() {
        return false;
      });
      window.goWebBack = function() {
        return false;
      };
    }
  },
  methods: {
    getList() {
      this.$http.post("/msc/app/order/" + this.item.id).then(res => {
        if (res.success) {
          console.log("res",res)
          this.order = res.body.order;
          this.itemResults = res.body.itemResults;
          this.settleResult = res.body.settleResult;
          this.order.kb05List=res.body.kb05List;
        } else {
          this.$messagebox.alert(res.message).then(r => {
            let medicalIndex = sessionStorage.getItem("medicalIndex") || "";
            if (medicalIndex) {
              this.$router.push("/");
            } else {
              let ua = navigator.userAgent;
              let isIos = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
              if (!isIos) {
                dsBridge.call("close", "");
              } else {
                window.webkit.messageHandlers.close.postMessage("yes");
              }
            }
          });
        }
      });
    },
    // 生成随机字符串
    generateUUID() {
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    },
    // 获取签名串
    getSignCode() {
      let user = this.util.getUser();
      if(user.bae027 == '1' ){
        // 开通了免密支付
        let busiSeq = this.generateUUID();
        this.order.token = busiSeq; // 部支付密码验证返回的操作验证串
        this.order.hosName = this.item.hospital; //当前订单产生医院的名称
        this.order.amount = this.settleResult.cash; //当前订单需支付的金额
        this.order.visitId = this.item.id; //当前订单的就诊号
        this.order.hosCode = this.order.merchant; // 医疗机构编码
        OrderMsg.setOrder(this.order);
        //免密必传
        this.signInfo.aac002 = this.user.idNo;
        this.signInfo.channelNo = sessionStorage.getItem("channelNo");
        this.signInfo.busiSeq = busiSeq;

        this.signInfo.signNo = sessionStorage.getItem("signNo");
        this.signInfo.bae027 = "1";
        console.log("signInfo",this.signInfo)
        this.saveToken(this.signInfo);
      }else{
        // 没有开通免密支付
        let params = {
          channelNo: sessionStorage.getItem("channelNo") || "",
          signNo: sessionStorage.getItem("signNo") || "",
          aab301: this.user.aab301,
          aac002: this.user.idNo,
          aac003: this.user.idName,
          busiSeq: "",
          aac067: this.user.aae005,
          returnUrl: ""
        };
        this.$http.post("/msc/csb/sign", params).then(res => {
          if (res.success) {
            this.signCode = res.body;
            this.orderClickCsb();
          } else {
            this.$toast(res.message);
          }
        });
      }
    },
    orderClickCsb() {
      let _this = this
      let certData = {
        sign: this.signCode || ""
      };
      dsBridge.call("validatePwd", certData, res => {
        res = JSON.parse(res);
        if (res.success) {
          _this.order.token = res.body.busiSeq; // 部支付密码验证返回的操作验证串
          _this.order.hosName = _this.item.hospital; // 当前订单产生医院的名称
          _this.order.amount = _this.settleResult.cash; // 当前订单需支付的金额
          _this.order.visitId = _this.item.id; // 当前订单的就诊号
          _this.order.hosCode = _this.order.merchant; // 医疗机构编码
          OrderMsg.setOrder(_this.order);
          _this.signInfo.aac002 = _this.user.idNo;
          _this.signInfo.channelNo = sessionStorage.getItem("channelNo");
          _this.signInfo.signNo = sessionStorage.getItem("signNo");
          _this.signInfo.busiSeq = res.body.busiSeq;
          this.signInfo.bae027 = "0";
          _this.saveToken(_this.signInfo);
        } else {
          _this.$messagebox.alert(res.message);
        }
      });
    },
    showMoreClick() {
      this.showMore = !this.showMore;
      if (!this.showMore) {
        this.displayName = "查看更多";
      } else {
        this.displayName = "隐藏";
      }
    },
    saveToken(signInfo) {
      console.log("saveToken",signInfo);
      this.$http
        .post("/msc/csb/savetoken", signInfo)
        .then(res => {
          console.log("res",res);
          if (res.success) {
            this.$router.push("/payConfirm");
          } else {
            this.$messagebox.alert(`密码验证失败：${res.message}`).then(() => {
              let medicalIndex = sessionStorage.getItem("medicalIndex") || "";
              if (medicalIndex) {
                this.$router.push("/");
              } else {
                let ua = navigator.userAgent;
                let isIos = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                if (!isIos) {
                  dsBridge.call("close", "");
                } else {
                  window.webkit.messageHandlers.close.postMessage("yes");
                }
              }
            });
          }
        })
        .catch(ex => {
          let _ex = JSON.stringify(ex);
          let __ex = JSON.parse(_ex);
          this.$messagebox
            .alert(`密码验证失败：${__ex.response.data.message}`)
            .then(() => {
              let medicalIndex = sessionStorage.getItem("medicalIndex") || "";
              if (medicalIndex) {
                this.$router.push("/");
              } else {
                let ua = navigator.userAgent;
                let isIos = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                if (!isIos) {
                  dsBridge.call("close", "");
                } else {
                  window.webkit.messageHandlers.close.postMessage("yes");
                }
              }
            });
        });
    }
  }
};
</script>
<style lang="less" scoped>
.main {
  max-width: 768px;
  width: 100%;
}

.order_detail {
  background: url("../../assets/icon/icon-circular.png") no-repeat left 7px top
      7px,
    url("../../assets/icon/icon-circular.png") no-repeat right 7px top 7px;
  background-size: 13px;
  background-color: #ffffff;
  width: 92%;
  margin: 15px auto 0 auto;
}

.title {
  font-size: 16px;
  color: #333333;
  font-weight: bold;
  padding-top: 30px;
  margin-left: 20px;
}

.order_detail ul {
  margin: 10px 0;
}

.order_detail li {
  list-style: none;
  margin-left: 20px;
  margin-right: 20px;
  line-height: 30px;
}

.order_detail label {
  color: #888888;
}

.order_detail span {
  float: right;
}

.order_detail table {
  text-align: center;
  width: 100%;
}

.order_detail td {
  height: 36px;
}

.line td {
  color: #888888;
}

.lookMore {
  background: #f9f9f9;
  line-height: 37px;
  text-align: center;
}

.payment,
.time {
  width: 100%;
  background: #fff;
  margin-top: 15px;
}

.payment li,
.time li {
  list-style: none;
  line-height: 45px;
}

.payment label,
.time label {
  margin-left: 4%;
}

.payment span {
  float: right;
  margin-right: 4%;
}

.payment b {
  margin-left: 5px;
}

.time span {
  float: right;
  margin-right: 4%;
}

.time {
  margin-bottom: 60px;
}

.foot {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 48px;
  background: #fff;
  width: 100%;
  overflow: hidden;
}

.foot > div {
  float: left;
  line-height: 48px;
  text-align: center;
}

.foot > div:first-child {
  width: 53%;
}

.foot > div:last-child {
  width: 47%;
  background: #2296e4;
  font-size: 18px;
  color: #ffffff;
}

.price span,
.text_color {
  color: #f65150 !important;
}

.price label {
  color: #f65150;
  font-size: 18px;
}
.border_bottom {
  position: relative;
}
.border_bottom:after {
  content: "  ";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background-color: #dfdfdf;
  transform: scaleY(0.5);
}
.border_top {
  position: relative;
}
.border_top:after {
  content: "  ";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 1px;
  background-color: #dfdfdf;
  transform: scaleY(0.5);
}
</style>
