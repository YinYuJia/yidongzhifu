<template>
  <div class="wapper" :style="{height: height}">
    <div class="content">
      <div class="person">
        <span class="icon-pic iconfont icon-renxiang"></span>
        {{user.idName}}
      </div>
      <div id="qrcode" class="qrcode">
        <img v-if="toogle" src="../../assets/icon/icon_rsb@2x.png">
      </div>
      <div class="text">电子社保卡二维码</div>
      <button @click="back">返 回</button>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcodejs2";
export default {
  name: "Qrcode",
  components: { QRCode },
  data() {
    return {
      user: {},
      codeNum: "",
      qrcode: "",
      authtime: "",
      toogle: false,
      height: window.innerHeight + "px"
    };
  },
  created() {
    this.user = this.util.getUser();
  },
  mounted() {
    this.getCode();

    let second = 60;
    this.authtime = setInterval(() => {
      second--;
      if (second === 0) {
        this.getCode();
        second = 60;
      }
    }, 1000);
  },
  methods: {
    // 获取二维码
    getCode() {
      let channelNo = sessionStorage.getItem("channelNo") || "";
      let signNo = sessionStorage.getItem("signNo") || "";
      let params = {
        channelNo: channelNo,
        signNo: signNo
      };
      this.$http.post("msc/8502", params).then(res => {
        if (res.success) {
          this.codeNum = res.body.qrCode;
          this.getQrcode();
        } else {
          this.$messagebox.alert(res.message).then(() => {
            history.go(-1);
          });
        }
      });
    },
    getQrcode() {
      if (this.qrcode === "") {
        let width = window.innerWidth * 0.623;
        let height = window.innerWidth * 0.623;
        this.qrcode = new QRCode("qrcode", {
          width: width,
          height: height,
          text: this.codeNum,
          correctLevel: QRCode.CorrectLevel.H
        });
      } else {
        this.qrcode.makeCode(this.codeNum);
      }
      this.toogle = true;
    },
    back() {
      this.$router.go(-1);
    }
  },
  beforeDestroy() {
    clearInterval(this.authtime);
  }
};
</script>
<style lang="less" scoped>
.wapper {
  height: 100%;
  background: rgb(71, 70, 70);
}
.content {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 84%;
  transform: translate(-50%, -50%);
  padding: 15px 0 10px;
  background: #fff;
}
.person {
  margin-bottom: 20px;
  padding-left: 13%;
  line-height: 24px;
  font-size: 16px;
}
.icon-pic {
  margin-right: 5px;
  font-size: 16px;
  color: #0909f7;
}
.qrcode {
  position: relative;
  margin: 14px auto 0;
  width: 74%;
  height: 74%;
}
img {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 34%;
  transform: translate(-50%, -50%);
  vertical-align: middle;
}
.text {
  margin-top: 14px;
  font-size: 10px;
  color: #333;
  line-height: 20px;
  text-align: center;
}
button {
  width: 6.4rem;
  height: 46px;
  margin: 10px 1rem 15px;
  background: #3399ff;
  border: none;
  outline: none;
  border-radius: 5px;
  font-size: 18px;
  color: #fff;
}
</style>
