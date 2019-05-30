<template>
  <div class="main">
    <div v-show="success" class="success">
      <div class="upper">
        <div class="icon"></div>
        <div class="tip_title">支付成功</div>
        <div class="btn_back" @click="goBack">返回首页</div>
      </div>
      <div class="lower">
        <div class="title border_bottom">
          <label>付款金额</label>
          <span>¥{{payOrder.amount}}</span>
        </div>
        <ul class="payment">
          <li>
            <label>订单编号</label>
            <span>{{payOrder.orderNo}}</span>
          </li>
          <li>
            <label>支付方式</label>
            <span>{{payOrder.payModel|transPayMode}}</span>
          </li>
          <li>
            <label>总金额</label>
            <span>{{payOrder.totalAmount}}元</span>
          </li>
          <li>
            <label>医保支付</label>
            <span>{{payOrder.fundAmount}}元</span>
          </li>
        </ul>
      </div>
    </div>
    <div v-show="!success" class="fail">
      <div class="upper">
        <div class="icon"></div>
        <div class="tip_title">支付失败</div>
        <p class="tip_title_p"> 如发生扣费，系统将自动退回</p>
        <div class="btn_back" @click="goBack">返回首页</div>
      </div>
    </div>
    <!-- 免密支付弹窗 -->
    <hintOpen :isShow="isShow" @closeHint="closeHint()" visible></hintOpen>
  </div>
</template>

<script>
import OrderMsg from "../../utils/orderMsg";
import hintOpen from './freepay/hintOpen';
import Utils from "../../utils/util";
export default {
  components:{
    hintOpen
  },
  data() {
    return {
      payOrder: {},
      success: this.$route.query.paySuccess,
      payMessage: this.$route.query.payMessage,
      isShow: true,
    };
  },
  created() {
    this.payOrder = OrderMsg.getOrder();
    console.log("resultpayorder",this.payOrder)
    if (!this.payOrder.orderNo) {
      let medicalIndex = sessionStorage.getItem("medicalIndex") || "";
      if (medicalIndex) {
        
      } else {
        let ua = navigator.userAgent;
        let isIos = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (!isIos) {
          dsBridge.call("close", "");
        } else {
          window.webkit.messageHandlers.close.postMessage("yes");
        }
      }
      return;
    }
    if (this.$route.query.paySuccess) {
      OrderMsg.resetOrder();
    }
    // 判断是否显示免密支付提示
    let user = Utils.getUser();
    if(user.bae027 == 1){
      this.isShow = false;
    }else{
      let showHint = localStorage.getItem('ShowFreeCodePay');
      if (showHint === 'false' || showHint === false || showHint === 'null'){
        this.isShow = false;
      }else{
        this.isShow = true;
      }
    }
  },
  mounted() {
    let ua = navigator.userAgent;
    let isIos = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (!isIos) {
      window.EPSdk.notify('{"code":"order","value":"回调成功"}');
    }
    let medicalIndex = sessionStorage.getItem("medicalIndex") || "";
    if (medicalIndex) {
      let _this = this;
      dsBridge.register("goWebBack", function() {
        _this.$router.push("/");
        return true;
      });
      window.goWebBack = function() {
        _this.$router.push("/");
        return true;
      };
    } else {
      dsBridge.register("goWebBack", function() {
        return false;
      });
      window.goWebBack = function() {
        return false;
      };
    }
  },
  methods: {
    goBack() {
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
    },
    // 关闭免密提示
    closeHint(){
      this.isShow = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main {
  max-width: 768px;
}
.success {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  background: #f2f2f2;
}
.fail {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  background: #ffffff;
}
.success .icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: url("../../assets/icon/icon-success.png") no-repeat center;
  background-size: 100%;
  margin: 0 auto;
}
.fail .icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: url("../../assets/icon/icon-fail.png") no-repeat center;
  background-size: 100%;
  margin: 0 auto;
}
.tip_title {
  font-size: 15px;
  color: #353535;
  line-height: 46px;
  text-align: center;
  font-weight: bold;
}
.tip_title_p{
  font-size: 13px;
  color: #999;
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
  line-height: 53px;
  background: #1492ff;
  border-radius: 4px;
  margin: 10px;
  text-align: center;
  font-size: 18px;
  color: #fff;
}
.upper {
  background: #f8f8f8;
  padding-top: 30px;
  padding-bottom: 15px;
}
.lower {
  background: #ffffff;
}
.lower .title {
  line-height: 57px;
  margin-left: 4%;
}
.title > label {
  font-size: 16px;
  color: #353535;
}
.title > span {
  font-size: 23px;
  color: #000000;
  float: right;
  margin-right: 4%;
}
.payment {
  width: 100%;
  background: #fff;
  margin-top: 10px;
}
.payment li {
  list-style: none;
  line-height: 45px;
}
.payment label {
  margin-left: 4%;
}
.payment span {
  float: right;
  margin-right: 4%;
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
