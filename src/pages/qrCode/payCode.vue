<template>
  <div class="wapper" :style="{height: height}">
    <div class="content">
      <div class="pic1"></div>
      <svg id="barcode"></svg>
      <div class="pic2"></div>
      <div id="qrcode"></div>
      <div class="text">支付码</div>
      <button @click="back">返 回</button>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcodejs2";
import JsBarcode from "jsbarcode";
import OrderMsg from "../../utils/orderMsg";
export default {
  name: "Qrcode",
  components: { QRCode },
  data() {
    return {
      user: {},
      codeNum: "",
      barcode: "",
      qrcode: "",
      authtime: "",
      second: "",
      websock: "",
      height: window.innerHeight + "px",
      token: this.util.getToken(),
      signCode: "",
      settleResult: {},
      order: {},
      visitEvent: {},
      signInfo: {},
      item:{},
      itemResults: [],
      settleResult: {},
    };
  },
  created() {
    this.user = this.util.getUser();

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
    this.getCode();
    // console.log("useridNo",this.user.idNo)
    // console.log("token",this.token)
   

  },
  methods: {
    // 获取二维码、条形码的值
    getCode() {
      let channelNo = sessionStorage.getItem("channelNo") || "";
      let signNo = sessionStorage.getItem("signNo") || "";
      let params = {
        channelNo: channelNo,
        signNo: signNo
      };
      this.$http.post("msc/8503", params).then(res => {
        if (res.success) {
          this.codeNum = res.body.qrCode;
          // //页面刚进入时开启长连接
          this.initWebpack();
          this.getBarcode();
          this.getQrcode();
          clearInterval(this.authtime);
          this.second = 60;
          this.authtime = setInterval(() => {
            this.second--;
            if (this.second === 0) {
              this.getCode();
              this.second = 60;
            }
          }, 1000);
        } else {
          this.$messagebox.alert(res.message).then(() => {
            history.go(-1);
          });
        }
      });
    },
    // 条形码
    getBarcode() {
      JsBarcode("#barcode", this.codeNum, {
        format: "CODE128", //选择要使用的条形码类型
        text: this.codeNum,
        displayValue: true, //是否在条形码下方显示文字
        textPosition: "bottom", //设置文本的垂直位置
        margin: 20, //设置条形码周围的空白边距
        textAlign: "center", //设置文本的水平对齐方式
        textMargin: 5 //设置条形码和文本之间的间距
      });
    },
    // 二维码
    getQrcode() {
      if (this.qrcode === "") {
        let width = window.innerWidth * 0.52;
        let height = window.innerWidth * 0.52;
        this.qrcode = new QRCode("qrcode", {
          width: width,
          height: height,
          text: this.codeNum,
          correctLevel: QRCode.CorrectLevel.H
        });
      } else {
        this.qrcode.makeCode(this.codeNum);
      }
    },
    back() {
      let medicalIndex = sessionStorage.getItem("medicalIndex") || "";
      if (medicalIndex) {
        this.$router.go(-1);
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
    // websocket长链接
    initWebpack() {
      //初始化websocket
      let channelNo = sessionStorage.getItem("channelNo") || "";
      // const wsuri =
      //   "ws://192.168.1.150:8888/msc/websocket/ID=" +
      //   channelNo +
      //   this.user.idNo;
      const wsuri =
      "ws://115.236.191.153:9090/longRunning/websocket/ID="+channelNo+this.user.idNo
      +"&token="+this.token;
      this.websock = new WebSocket(wsuri);
      this.websock.onopen = this.websocketopen;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onclose = this.websocketclose;
      this.websock.onerror = this.websocketerror;
    },
    websocketopen() {
      //打开
      
      // console.log("WebSocket连接成功");
    },
    websocketonmessage(e) {
      //数据接收 
      
      console.log(111)
      if (e && e.data) {
        
        let param = JSON.parse(e.data);//json转对象
        this.order = param.order;
        this.settleResult = param.settleResult;
        //获取免密信息
        this.visitEvent = param.visitEvent;
        //通过免密信息判断是否需要调用方法
        console.log("param",param)
        console.log(this.user)
        console.log(this.user.bae027)  
       if(this.user.bae027=="0"){
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
            this.checkPwd();
          } else {
            this.$toast(res.message);
          }
        });
      }
       else if (this.user.bae027=="1"){
        // 开通了免密支付
        console.log("bae027=1")
        let busiSeq = this.generateUUID();
        this.order.token = busiSeq; // 部支付密码验证返回的操作验证串
        this.order.hosName = this.visitEvent.hospital; //当前订单产生医院的名称
        this.order.amount = this.settleResult.cash; //当前订单需支付的金额
        this.order.visitId = this.visitEvent.id; //当前订单的就诊号
        this.order.hosCode = this.order.merchant; // 医疗机构编码
        OrderMsg.setOrder(this.order);
        //免密必传
        this.signInfo.aac002 = this.user.idNo;
        this.signInfo.channelNo = sessionStorage.getItem("channelNo");
        this.signInfo.busiSeq = busiSeq;
        this.signInfo.signNo = sessionStorage.getItem("signNo");
        this.signInfo.bae027 = "1";
        
        this.item =this.visitEvent;
        console.log("item",this.item)
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

        console.log("signInfo",this.signInfo);
        this.saveToken(this.signInfo);
        // this.getSignCode();
       }
      else {
        this.$messagebox.alert("未获取到订单信息").then(() => {
          this.getCode();
        });
      }
    }},
    websocketclose() {
      //关闭
      console.log("WebSocket关闭");
    },
    websocketerror() {
      //失败
      console.log("WebSocket连接失败");
    },
    // 获取签名串
    // getSignCode() {
    //   let params = {
    //     channelNo: sessionStorage.getItem("channelNo") || "",
    //     signNo: sessionStorage.getItem("signNo") || "",
    //     aab301: this.user.aab301,
    //     aac002: this.user.idNo,
    //     aac003: this.user.idName,
    //     busiSeq: "",
    //     aac067: this.user.aae005,
    //     returnUrl: ""
    //   };
    //   this.$http.post("/msc/csb/sign", params).then(res => {
    //     if (res.success) {
    //       this.signCode = res.body;
    //       this.checkPwd();
         
    //     } else {
    //       this.$toast(res.message);
    //       this.getCode();
    //     }
    //   });
    // },
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
    getList() {
      this.$http.post("/msc/app/order/" + this.visitEvent.id).then(res => {
        if (res.success) {
          this.order = res.body.order;
          this.itemResults = res.body.itemResults;
          this.settleResult = res.body.settleResult;
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
    // 调起部平台密码验证
    checkPwd() {
      let _this = this;
      let certData = {
        sign: this.signCode || ""
      };
      dsBridge.call("validatePwd", certData, res => {
        res = JSON.parse(res);
        if (res.success) {
          _this.order.token = res.body.busiSeq; // 部支付密码验证返回的操作验证串
          _this.order.hosName = _this.visitEvent.hospital; // 当前订单产生医院的名称
          _this.order.amount = _this.settleResult.cash; // 当前订单需支付的金额
          _this.order.visitId = _this.visitEvent.id; // 当前订单的就诊号
          _this.order.hosCode = _this.order.merchant; // 医疗机构编码
          OrderMsg.setOrder(_this.order);
          _this.signInfo.aac002 = _this.user.idNo;
          _this.signInfo.channelNo = sessionStorage.getItem("channelNo");
          _this.signInfo.signNo = sessionStorage.getItem("signNo");
          _this.signInfo.busiSeq = res.body.busiSeq;
          _this.saveToken(_this.signInfo);
        } else {
          _this.$messagebox.alert(res.message).then(() => {
            _this.getCode();
          });
        }
      });
    },
    saveToken(signInfo) {
      this.$http
        .post("/msc/csb/savetoken", signInfo)
        .then(res => {
          if (res.success) {
            this.$router.push("/payConfirm");
          } else {
            this.$messagebox.alert(`密码验证失败：${res.message}`).then(() => {
              this.$router.push("/");
            });
          }
        })
        .catch(ex => {
          let _ex = JSON.stringify(ex);
          let __ex = JSON.parse(_ex);
          this.$messagebox
            .alert(`密码验证失败：${__ex.response.data.message}`)
            .then(() => {
              this.$router.push("/");
            });
        });
    }
  },
  beforeDestroy() {
    clearInterval(this.authtime);
    //页面销毁时关闭长连接
    this.websocketclose();
  }
};
</script>
<style lang="less" scoped>
.wapper {
  background: #f2f2f2;
  padding-top: 24px;
  box-sizing: border-box;
}
.content {
  margin: 0 0.6rem;
  background: #fff;
  .pic1 {
    width: 8.8rem;
    height: 15px;
    background: #f2f2f2 url("../../assets/icon/paycode1.png") no-repeat center;
    background-size: 8.8rem 15px;
  }
  #barcode {
    width: 8.8rem;
  }
  .pic2 {
    position: relative;
    top: -15px;
    background: url("../../assets/icon/paycode2.png") no-repeat center;
    background-size: 100%;
    height: 20px;
  }
  #qrcode {
    margin-left: 1.8rem;
  }
}
.text {
  margin: 14px 0;
  font-size: 18px;
  color: #3399ff;
  line-height: 24px;
  text-align: center;
}
button {
  width: 7rem;
  height: 46px;
  margin: 10px 0.9rem 25px;
  background: #3399ff;
  border: none;
  outline: none;
  border-radius: 5px;
  font-size: 18px;
  color: #fff;
}
</style>
