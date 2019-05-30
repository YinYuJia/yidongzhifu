<template>
    <!-- <v-touch tag="div" touch-action: pan-y!important  v-on:swiperight="swiperright" v-on:swipeleft="swiperleft" class="wrapper"> -->
      <div class="main">
    <mt-loadmore
      v-show="orderList.length"
      :bottom-method="loadBottom"
      :bottom-all-loaded="allLoaded"
      ref="loadmore"
    >
      <ul class="ul_list">
        <li v-for="item in orderList">
          <div class="icon"></div>
          <div class="hosp_info"  @click="payClick(item)">
            <label>{{item.hospital}}-{{item.dept}}</label>
            <span>{{ item.visitTime }}</span>
          </div>
          <div class="pay_info">
            <label>
              <p>¥</p>
              {{ item.total }}
            </label>
            <span @click="payClick(item)" class="pay_go">去支付</span>
          </div>
        </li>
      </ul>
    </mt-loadmore>
    <div v-show="!orderList.length" class="blank">
      <div class="pic_null"></div>
      <div class="tip">暂无待支付订单</div>
    </div>
  </div>

    <!-- </v-touch> -->
  
</template>

<script>
export default {
  name: "payList",
  data() {
    return {
      orderList: [],
      pageQueryReq: {},
      user: {},
      allLoaded: true,
      signLevel: sessionStorage.getItem("signLevel") // 获取的签发等级
    };
  },
  created() {
    this.pageQueryReq = this.util.getUser();
    this.user = this.util.getUser();
    this.pageQueryReq.state = "0";
    this.pageQueryReq.expiration = "min";
    this.pageQueryReq.pageSize = 10;
    this.pageQueryReq.pageNumber = 1;
    this.showList();
    
  },
  methods: {           
    // 获取待支付订单列表
    showList() {
      this.$http
        .post("/msc/app/visit/pageQuery", this.pageQueryReq)
        .then(res => {
          if (res.success) {
            this.orderList = [...this.orderList, ...res.body.list];
            if (res.body.totalPage > this.pageQueryReq.pageNumber) {
              this.pageQueryReq.pageNumber += 1;
              this.allLoaded = false;
            }
            console.log("待支付",this.orderList)
          } else {
            this.$messagebox
              .alert("查询订单列表失败：" + res.message)
              .then(r => {
                this.$router.go(-1);
              });
          }
        });
    },
    // 获取8500
    get8500() {
      let channelNo = sessionStorage.getItem("channelNo") || "";
      let signNo = sessionStorage.getItem("signNo") || "";
      let params = {
        inData: {
          channelNo: channelNo,
          signNo: signNo
        }
      };
      this.$http.post("/msc/8500", params).then(res => {
        if (res.success && res.body) {
          this.signLevel = res.body.signLevel;
          sessionStorage.setItem("signLevel", this.signLevel);
          this.flag = false;
        } else {
          this.flag = false;
          this.$toast("暂未开通电子社保卡业务");
        }
      });
    },
    // 跳转到确认支付页面
    payClick(item) {
      if (this.signLevel != 2) {
        this.$messagebox
          .confirm("请点击电子社保卡开通缴费结算功能")
          .then(() => {
            this.getSignCode();
          })
          .catch(() => {});
        return;
      }
      this.$router.push({
        path: "/payDetail",
        query: { obj: JSON.stringify(item) }
      });
    },
    // 获取签名串
    getSignCode() {
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
          this.jumpSdk();
        } else {
          this.$toast(res.message);
        }
      });
    },
    // 跳转部平台SDK
    jumpSdk() {
      let _this = this;
      let certData = {
        sign: this.signCode || ""
      };
      dsBridge.call("startEsscSdk", certData, res => {
        res = JSON.parse(res);
        if (res.success) {
          if (res.body.signNo) {
            sessionStorage.setItem("signNo", res.body.signNo);
          }
          setTimeout(()=>{
            _this.get8500();
          },0)
          
        }
      });
    },
    // 下拉刷新
    loadBottom() {
      if (!this.allLoaded) {
        this.showList();
      }
      this.allLoaded = true;
      this.$refs.loadmore.onBottomLoaded();
    }
  }
};
document.body.style.background = "#F2F2F2";
</script>
<style scoped>
vue-touch{
  touch-action: pan-y!important
}
.ul_list {
  list-style: none;
  overflow: auto;
}
.ul_list li {
  position: relative;
  width: 100%;
  margin-top: 10px;
  background: #fff;
}
.ul_list li > div {
  display: inline-block;
}
.icon {
  width: 10%;
  height: 40px;
  background: url("../../assets/icon/icon-hospital.png") no-repeat top 12px
    center;
  background-size: 16px;
}
.hosp_info {
  height: 100%;
  width: 65%;
  vertical-align: top;
  margin-bottom: 10px;
}
.hosp_info > label {
  font-size: 16px;
  color: #000000;
  display: block;
  margin-top: 10px;
}
.hosp_info > span {
  font-size: 12px;
  color: #999999;
  display: block;
  margin-top: 10px;
}
.pay_info {
  position: absolute;
  top: 50%;
  left: 78%;
  transform: translate(0, -50%);
  width: 20%;
  vertical-align: middle;
  text-align: center;
}
.pay_info > label {
  font-size: 16px;
  color: #f65150;
  display: block;
}
.pay_info > label > p {
  font-size: 12px;
  color: #f65150;
  display: inline-block;
  margin-right: 3px;
}
.pay_go {
  position: relative;
  display: block;
  width: 65px;
  height: 20px;
  font-size: 12px;
  color: #f65150;
  border-radius: 5px;
  line-height: 20px;
  margin: 5px auto;
}
.pay_go:after {
  content: "  ";
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  width: 200%;
  height: 200%;
  border: 1px solid #999999;
  transform-origin: 0 0;
  transform: scale(0.5, 0.5);
  border-radius: 10px;
}
.btn_sure {
  background: #249dee;
  height: 50px;
  width: 100%;
  border: none;
  position: fixed;
  bottom: 0px;
  font-size: 18px;
  color: #fff;
}
.pic_null {
  width: 150px;
  height: 152px;
  background: url("../../assets/icon/icon-null.png") no-repeat center;
  background-size: 100%;
  margin: 90px auto 30px auto;
}
.tip {
  font-size: 16px;
  color: #353535;
  text-align: center;
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
