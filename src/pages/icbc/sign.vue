<template>
  <div class="main">
    <div  v-show="!success">
      <ul class="border_bottom">
        <li class="border_bottom"><label>姓名</label>{{sms.cardName | tuoMin(1, 1)}}</li>
        <li class="border_bottom"><label>身份证号</label>{{sms.idNo | tuoMin(3, 4)}}</li>
        <li><label>持卡人户名</label>{{sms.cardName | tuoMin(1, 1)}}</li>
      </ul>
      <hr/>
      <ul class="border_bottom">
        <li class="border_bottom"><label  v-show="sms.bankName && sms.bankName.length > 0">开户行</label>{{sms.bankName}}</li>
        <li class="border_bottom"><label>银行账号</label>{{sms.cardNo | tuoMin(3, 4)}}</li>
        <li class="border_bottom"><label>手机号码</label><input class="mobile" type="text" v-model.trim="sms.mobileNo" placeholder="请输入手机号" :maxlength="11"/></li>
        <li><label>验证码</label><input class="yzm box_right" type="text" placeholder="请输入验证码" v-model="sms.validCode" :maxlength="6"><input
          class="hq_yzm" type="button" @click="codeClick" value="获取验证码" v-show="sendAuthCode && sms.cardNo && sms.cardNo.length > 0"><span v-show="!sendAuthCode" class="tm_yzm">{{authTime}}秒之后重发</span></li>
      </ul>
      <div class="check" @click="curId = !curId" :class="{'check-true':curId}"></div>
      <div class="agree">阅读并同意 <router-link to="protocol" class="protocol">开通相关协议</router-link></div>
      <input class="btn_sure" type="button" @click="signClick" value="签约" v-show="sms.cardNo && sms.cardNo.length > 0" :disabled="isAll" :class="{'btn_false':isAll}">
    </div>
    <div v-show="success" class="success">
      <div class="icon"></div>
      <div class="tip_title">签约成功</div>
      <div class="btn_back" @click="back">返回首页</div>
    </div>

  </div>
</template>

<script>
import OrderMsg from "../../utils/orderMsg";
export default {
  name: "sign",
  data() {
    return {
      payOrder: OrderMsg.getOrder(),
      sms: {},
      curId: false,
      success: false,
      sendAuthCode: true,
      authTime: 0,
      authTimetimer: "",
    };
  },
  computed: {
    isAll: function() {
      if (this.sms.validCode && this.curId) {
        return false;
      }
      return true;
    }
  },
  created() {
    this.getUser();
  },
  methods: {
    //获取用户信息
    getUser() {
      let user = this.util.getUser();
      this.$http.post("/msc/user/get", user).then(res => {
        if (res.success) {
          this.sms = res.body;
        } else {
          this.$messagebox.alert(res.message).then(result => {
            this.$router.go(-1);
          });
        }
      });
    },
    //发送短信验证码
    codeClick() {
      if (!this.sms.mobileNo) {
        this.$toast("请填写手机号");
        return;
      }
      let phoneReg = /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/;
      if (!phoneReg.test(this.sms.mobileNo)) {
        this.$toast("手机号格式不正确");
        return;
      }
      if (this.payOrder.orderNo) {
        this.sms.verifyType = "2";
        this.sms.orderAmount = this.payOrder.amount;
        this.sms.orderNo = this.payOrder.orderNo;
        this.sms.subInstId = this.payOrder.hosCode;
      } else {
        this.sms.verifyType = "0";
      }
      this.$http.post("/mpc/pay/code", this.sms).then(res => {
        if (res.success) {
          this.sms.orderNo = res.body.orderNo;
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
          this.$messagebox.alert(res.message);
        }
      });
    },
    //签约
    signClick() {
      if (this.payOrder.orderNo) {
        this.payOrder.validCode = this.sms.validCode;
        this.pay();
      } else {
        this.$http.post("/mpc/pay/sign", this.sms).then(res => {
          if (res.success) {
            this.$messagebox.alert("签约成功").then(() => {
              this.success = true;
            });
          } else {
            this.$messagebox.alert("签约失败：" + res.message).then(() => {
              this.sms.validCode = "";
              this.curId = false;
              this.sendAuthCode = true;
              clearInterval(this.authTimetimer);
            });
          }
        });
      }
    },
    //付款
    pay() {
      this.payOrder.payModel = "1";
      this.payOrder.agreementInfo = this.sms;
      this.$http.post("/mpc/pay/unified", this.payOrder).then(res => {
        if (res.success) {
          this.$router.push({
            name: "Result",
            params: { paySuccess: res.success }
          });
        } else {
          this.$router.push({
            name: "Result",
            params: { paySuccess: res.success, payMessage: res.message }
          });
        }
      });
    },
    back() {
      this.$router.push("/");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.main {
  max-width: 768px;
}

ul {
  background: #fff;
}

li {
  list-style: none;
  line-height: 45px;
  margin-left: 4%;
}

label {
  display: inline-block;
  width: 30%;
}

input[type="text"] {
  height: 45px;
  width: 35%;
  border: none;
  outline: none;
  text-align: left;
  font-size: 14px;
}
.mobile[type="text"] {
  width: 65%;
}
hr {
  background: #f2f2f2;
  height: 10px;
  border: none;
}

.hq_yzm {
  background: none;
  border: none;
  height: 45px;
  float: right;
  margin-right: 5%;
  color: #3399ff;
  font-size: 14px;
}
.tm_yzm {
  height: 45px;
  float: right;
  margin-right: 5%;
  color: #000;
  font-size: 14px;
}
.btn_sure {
  height: 52px;
  width: 94.6%;
  margin: 44px 2.7%;
  border: none;
  border-radius: 5px;
  background: #1492ff;
  font-size: 18px;
  color: #fff;
}
.btn_sure.btn_false {
  background: #ccc;
}
.success .icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: url("../../assets/icon/icon-success.png") no-repeat center;
  background-size: 100%;
  margin: 70px auto 0 auto;
}

.tip_title {
  font-size: 15px;
  color: #353535;
  line-height: 46px;
  text-align: center;
  font-weight: bold;
}

.tip {
  text-align: center;
  font-size: 15px;
  color: #353535;
}

.tip span {
  color: #f65150;
}

.btn_back {
  width: 92%;
  line-height: 45px;
  background: #249dee;
  border-radius: 4px;
  margin: 40px auto;
  text-align: center;
  font-size: 18px;
  color: #fff;
}
.container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.5;
}
.wrap {
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 2;
  width: 90%;
  height: 60%;
  overflow: auto;
  -webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
  background-color: rgb(242, 242, 242);
  border-radius: 5px;
  font-size: 12px;
}
.wrap p {
  padding: 0 5%;
}
.title {
  margin-top: 12px;
  margin-bottom: 6px;
  padding: 0 5%;
  font-weight: bold;
  text-align: center;
  line-height: 24px;
  font-size: 16px;
}
.check {
  float: left;
  margin-left: 5%;
  width: 40px;
  height: 47px;
  background: url("../../assets/icon/icon-check.png") no-repeat center;
  background-size: 20px 20px;
}
.check.check-true {
  background: url("../../assets/icon/icon-check2.png") no-repeat center;
  background-size: 20px 20px;
}
.agree {
  float: left;
  height: 47px;
  line-height: 47px;
}
.protocol {
  text-decoration: none;
  color: #3399ff;
}
.d_btn {
  margin-top: 12px;
  border-top: 0.5px solid #e7e7e7;
}

// .border_bottom {
//   position: relative;
// }
// .border_bottom:after {
//   content: "  ";
//   position: absolute;
//   left: 0;
//   bottom: 0;
//   width: 100%;
//   height: 1px;
//   background-color: #dfdfdf;
//   transform: scaleY(0.5);
// }
.box_right {
  box-shadow: inset -1px 0px 1px -1px #ccc;
}
</style>
