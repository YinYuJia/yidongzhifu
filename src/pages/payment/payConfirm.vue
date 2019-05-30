<template>
  <div class="main">
    <div style="width:100%;background-color:#ffffff;">
      <ul class="payment">
        <li class="border_bottom">
          <label>个人支付金额：</label>
          <span class="text_color">
            ¥
            <b>{{payOrder.amount}}</b>
          </span>
        </li>
        <li>
          <label>收款方：</label>
          <span>{{payOrder.hosName}}</span>
        </li>
      </ul>
    </div>
    <ep-radio
      align="right"
      title="选择支付方式"
      v-model="payOrder.payModel"
      :options="items"
      defaultVal="1"
    ></ep-radio>
    <div class="btn_sure" v-show="payOrder.amount && payOrder.amount > 0" @click="confirmClick">确定</div>
    <mt-popup v-model="popupVisible" position="bottom" class="pop">
      <div class="pophead border_bottom">
        <ul>
          <li>
            <i @click="popupVisible=false"></i>
          </li>
          <li v-show="sendAuthCode">
            <span @click="fetchValidCode">获取验证码</span>
          </li>
          <li v-show="!sendAuthCode">{{authTime}}秒之后重发</li>
          <li>
            <span @click="cardPay(payOrder,true)">确认</span>
          </li>
        </ul>
      </div>
      <ep-keyboard v-model="payOrder.validCode"></ep-keyboard>
    </mt-popup>
    <div v-show="modelShow" class="model"></div>
  </div>
</template>

<script>
import OrderMsg from "../../utils/orderMsg";
import EpKeyboard from "../../components/keyboard";
import EpRadio from "../../components/epRadio";
export default {
  name: "payConfirm",
  components: { EpKeyboard, EpRadio },
  data() {
    return {
      payOrder: {},
      ePayRes: {},
      signInfo: {},
      popupVisible: false,
      items: [],
      List:[],
      sendAuthCode: true, // 布尔值，通过v-show控制显示‘获取按钮’还是‘倒计时’
      authTime: 0, // 倒计时 计数器
      modelShow: false, // 控制蒙层是否显示
      flag: false, // 防止点击支付
      authTimetimer: "", // 定时器的赋值变量
      user: this.util.getUser()
    };
  },
  created: function() {
    console.log("payConfirm")
    this.payOrder = OrderMsg.getOrder(); // 获取payDetail页面存贮的信息
    if (!this.payOrder && !this.payOrder.id) {
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
    }
          console.log("kb05List",this.payOrder.kb05List)
          this.List=this.payOrder.kb05List
          this.items=this.List.map(item=>{ 
            let data={
              value:item.akb040,
              imgUrl:"",
              label:item.name 
            }
            if(item.akb040==1){
              // data.label="社保卡银行账号（工行）"
                   
              data.imgUrl=require('../../assets/icon/icon-wtdk.png')
            }
            if(item.akb040==5){
              // data.label="银联云闪付"
              data.imgUrl=require('../../assets/icon/icon-unionpay.png')
            }
            if(item.akb040==8){
              // data.label="微信支付"
              data.imgUrl=require("../../assets/icon/icon-wx.png")
            }
            if(item.akb040==9){
              // data.label="支付宝支付"
              data.imgUrl=require("../../assets/icon/icon-zfb.png")
            }
            if(item.akb040==0){
              // data.label="其他"
              data.imgUrl=require("../../assets/icon/icon-zfmm.png")
            }
              return data
             
          })
      // else if (this.payOrder.amount === 0) {
      //   this.sattlement();
      // }
      this.payOrder.payModel = "1"; // 默认选择社保卡银行账户支付
      // 获取社保卡金融账户信息
      console.log("payOrder",this.payOrder)
      console.log("user",this.user)
      this.getUserCard();
      },
      


  methods: {
    // 获取社保卡金融账户信息
    getUserCard() {
      let user = {};
      let agreementInfo = {};
      this.$http.post("/msc/user/get", this.user).then(res => {
        if (res.success) {
          agreementInfo.cardNo = res.body.cardNo;
          agreementInfo.idNo = res.body.idNo;
          this.payOrder.agreementInfo = agreementInfo;
        } else {
          this.$toast({
            message: "获取社保卡金融账户信息失败！",
            duiation: 1000
          });
        }
      });
    },
    /**
     * 订单确认，分俩步操作，1预下单，2真正付款操作
     */
    confirmClick() {
      if (this.flag) return;
      this.flag = true;
      setTimeout(() => {
        this.flag = false;
      }, 3000);
      //付款方式为其它直接结算--测试库使用
      // if (this.payOrder.payModel === "0") {
      //   this.sattlement();
        
      //   return;
      // }
      let _this = this;
      /**统一下订单**/
      this.$http.post("/mpc/pay/createOrder", this.payOrder).then(res => {
        console.log("payConfirm",this.payOrder.payModel)
        OrderMsg.updateOrder("payModel", _this.payOrder.payModel);
        if (res.success) {
          if (_this.payOrder.payModel == "1") {
            OrderMsg.updateOrder("agreementInfo", res.body.agreementInfo);
            //判断是否需要输入验证码
            if (res.body.payAuthMode == "2") {
              _this.popupVisible = true;
            } else {
              _this.cardPay(_this.payOrder);
            }
          } else if (_this.payOrder.payModel == "8") {
            //微信支付，需要调起SDK功能
            let wechartPayParam = JSON.stringify(res.body);

            dsBridge.call("wechatPay", wechartPayParam, res => {
              res = JSON.parse(res);
              if (res.success) {
                _this.$router.push({
                  path: "checkPayresult",
                  query: { id: this.payOrder.id }
                });
                // _this.$router.push({
                //   path: "payResult",
                //   query: { paySuccess: res.success }
                // });
              } else {
                _this.payFaildAndReOrder();
                _this.$toast({
                  message: "支付失败：" + res.message,
                  duiation: 1000
                });
                _this.flag = false;
              }
            });
          } else if (_this.payOrder.payModel == "9") {
            //支付宝支付，需要调起SDK功能
            let aliPayParam = JSON.stringify(res.body);
            dsBridge.call("aliPay", aliPayParam, res => {
              res = JSON.parse(res);
              if (res.success) {
                _this.$router.push({
                  path: "checkPayresult",
                  query: { id: this.payOrder.id }
                });
                // _this.$router.push({
                //   path: "payResult",
                //   query: { paySuccess: res.success }
                // });
              } else {
                _this.payFaildAndReOrder(); 
                _this.$toast({
                  message: "支付失败：" + res.message,
                  duiation: 1000
                });
                _this.flag = false;
              }
            });
          } else if (_this.payOrder.payModel == "5") {
            //云闪付
            let unionPayParam = JSON.stringify(res.body);
            dsBridge.call("unionPay", unionPayParam, res => {
              res = JSON.parse(res);
              if (res.success) {
                _this.$router.push({
                  path: "checkPayresult",
                  query: { id: this.payOrder.id }
                });
                // _this.$router.push({
                //   path: "payResult",
                //   query: { paySuccess: res.success }
                // });
              } else {
                _this.payFaildAndReOrder();
                _this.$toast({
                  message: "支付失败：" + res.message,
                  duiation: 1000
                });
                _this.flag = false;
              }
            });
          }
        } else {
          _this.flag = false;
          if (
            res.code == "B0350" ||
            res.code == "E001" ||
            res.code == "B0351"
          ) {
            _this.$router.push("/sign");
            return;
          } else {
            _this.reOrder();
            _this.$toast({
              message: "下单失败：" + res.message,
              duiation: 1000
            });
          }
        }
      });
    },
    /**
     * 验证码发送
     */
    fetchValidCode() {
      this.$http.post("/mpc/pay/getPayCode", this.payOrder).then(res => {
        if (res.success) {
          this.sendAuthCode = false;
          this.authTime = 60;
          this.authTimetimer = setInterval(() => {
            this.authTime--;
            if (this.authTime <= 0) {
              this.sendAuthCode = true;
              clearInterval(this.authTimetimer);
            }
          }, 1000);
        } else {
          this.$messagebox.alert("获取验证码失败：" + res.message);
        }
      });
    },
    /**
     * 代扣订单支付
     */
    cardPay(payOrder, valid) {
      //签约直接输入验证码付款或者直接付款
      if (valid && !payOrder.validCode) {
        this.$messagebox.alert("请输入验证码");
        return;
      }
      this.popupVisible = false;
      this.modelShow = true;
      this.$http.post("/mpc/pay/unified", payOrder).then(res => {
        if (!res.success) {
          //该客户未绑定支付银行卡，跳转到签约页面进行签约
          if (
            res.code == "B0350" ||
            res.code == "E001" ||
            res.code == "B0351"
          ) {
            this.$router.push("/sign");
            return;
          } else if (
            res.code == "B0451" ||
            res.code == "B0461" ||
            res.code == "B0460"
          ) {
            //验证码失效需要重新输入验证码
            this.modelShow = false;
            this.$messagebox.alert(res.message).then(() => {
              payOrder.validCode = "";
              this.popupVisible = true;
              this.sendAuthCode = true;
              clearInterval(this.authTimetimer);
            });
            return;
          }
        }
        this.$router.push({
          path: "checkPayresult",
          query: { id: this.payOrder.id }
        });
        // this.$router.push({
        //   path: "payResult",
        //   query: { paySuccess: res.success, payMessage: res.message }
        // });
      });
    },
    /**
     * 订单结算
     */
    sattlement() {
      this.ePayRes.payAmount = "0";
      let settleUrl = "/msc/app/settle/order/" + this.payOrder.orderNo;
      this.$http.post(settleUrl, this.ePayRes).then(res => {
        if (res.success) {
          this.$router.push({
            path: "checkPayresult",
            query: { id: this.payOrder.id }
          });
          // this.$router.push({
          //   path: "payResult",
          //   query: { paySuccess: res.success }
          // });
        } else {
          this.$messagebox.alert("订单结算失败：" + res.message);
        }
      });
    },
    // 支付失败时重新获取订单号:第一次订单号在支付详情页面调用接口的时候获取
    payFaildAndReOrder() {
      let _this = this;
      let settleUrl = "/msc/app/reorder/" + this.payOrder.visitId;
      this.$http
        .post(settleUrl, _this.payOrder.orderNo)
        .then(res => {
          if (res.success) {
            _this.payOrder.orderNo = res.body.order.orderNo;
          }
        })
        .catch(ex => {
          let _ex = JSON.parse(JSON.stringify(ex));
        });
    },

    /**
     * 下单失败页面重载新订单信息
     */
    reOrder() {
      this.$http.post("/msc/app/order/" + this.payOrder.visitId).then(res => {
        if (res.success) {
          this.payOrder.orderNo = res.body.order.orderNo;
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
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main {
  max-width: 768px;
  width: 100%;
}

img {
  width: 100%;
  height: 100%;
}

.btn_sure {
  width: 92%;
  line-height: 45px;
  background: #2296e4;
  border-radius: 4px;
  margin: 40px auto;
  text-align: center;
  font-size: 18px;
  color: #ffffff;
}

.pophead {
  height: 42px;
}

.pophead ul {
  width: 100%;
}

.pophead li {
  list-style: none;
  float: left;
}

.pophead li:first-child {
  width: 10%;
  margin-left: 4%;
}

.pophead li:nth-child(2) {
  width: 70%;
  text-align: center;
  line-height: 42px;
  font-size: 16px;
  color: #000000;
}

.pophead li:nth-child(3) {
  width: 70%;
  text-align: center;
  line-height: 42px;
  font-size: 16px;
  color: #000000;
}

.pophead li:last-child {
  width: 16%;
  line-height: 42px;
}

.pophead i {
  width: 12px;
  height: 12px;
  background: url("../../assets/icon/icon-fork.png") no-repeat;
  background-size: 12px;
  display: inline-block;
  margin-left: 4%;
  margin-top: 15px;
}

.pophead span {
  display: inline-block;
  padding: 0 8px;
  border: none;
  border-radius: 3px;
  background: #1492ff;
  line-height: 32px;
  font-size: 16px;
  color: #fff;
}

.pop {
  width: 100%;
}

.payment {
  width: 99%;
  background: #fff;
  margin-bottom: 15px;
  margin-left: 1%;
}

.payment li {
  list-style: none;
  line-height: 45px;
}

.payment label {
  margin-left: 3%;
  font-size: 15px;
  color: #333333;
  font-weight: 600;
}

.payment span {
  float: right;
  margin-right: 4%;
}

.payment b {
  margin-left: 5px;
}

.text_color {
  color: #f65150 !important;
  font-size: 18px;
}

.model {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0.5;
  background: rgba(0, 0, 0, 0.5);
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
</style>
