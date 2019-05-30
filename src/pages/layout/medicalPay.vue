<template>
  <div class="main">
    <!-- 背景图片 -->
    <img class="bg" src="../../assets/icon/imagesbg.png" width="100%">
    <!-- 导航栏 -->
    <ul class="qrCode">
      <li class="border_right" @click="gotoBlank('blank')">
        <img src="../../assets/icon/yuyueguahao.png" width="30px">
        <p>预约/挂号</p>
      </li>
      <li class="border_right" @click="gotoBlank('blank')">
        <img src="../../assets/icon/paiduijiaohao.png" width="30px">
        <p>排队叫号</p>
      </li>
      <li class="border_right" @click="gotoBlank('blank')">
        <img src="../../assets/icon/jianchabaogao.png" width="30px">
        <p>检查报告</p>
      </li>
      <li @click="gotoPay('paycode')">
        <img src="../../assets/icon/zhifuma.png" width="30px">
        <p>支付码</p>
      </li>
      <!-- <li class="border_right" @click="gotoHandle('qrcode')">
        <img src="../../assets/icon/icon-sbewm.png" width="30px">
        <p>二维码</p>
      </li> -->
    </ul>
    <div class="content">
      <!-- 支付订单模块 -->
      <div class="payment">
        <div class="title1 border_bottom" @click="gotoPay('payList')">
          <label>支付订单</label>
          <span v-if="payNum > 0" :style="{width: widnthNum}">{{ payNum | moreNum}}</span>
        </div>
        <ul class="detail" v-if="List.length > 0">
          <li v-for="item in List" class="border_bottom_blue">
            <div class="status">
              <p>等待支付</p>
              <div>{{item.visitTime | subStr}}</div>
            </div>
            <!-- <div class="icon">
            </div>-->
            <div class="info">
              <div class="hospital">{{item.hospital}}</div>
              <div class="total">￥{{item.total}}</div>
            </div>
            <div class="btn" @click="gotoDetail(item)">去支付</div>
          </li>
        </ul>
      </div>
      <!-- 我的消息 -->
      <div class="message">
        <div class="title2" @click="gotoPublic('message')">我的消息</div>
        <ul class="guidance" v-if="msgList.length > 0">
          <li
            v-for="(item, index) in msgList"
            :key="index"
            class="border_bottom"
            @click="gotoMsg(item)"
          >
            <label>{{ item.title }}</label>
            <span>{{ item.createTime | time }}</span>
          </li>
        </ul>
      </div>
      <!-- 列表 -->
      <ul class="list">
        <li class="border_bottom list_1" @click="gotoPay('historyList')">历史订单</li>
        <li class="border_bottom list_2" @click="getSignCode">电子社保卡</li>
        <li class="border_bottom list_3" @click="gotoPublic('supportHosp')">支持医院</li>
        <!-- <li class="border_bottom list_4" @click="gotoPublic('mobilePayment')">关于移动支付</li> -->
      </ul>
      <!-- 免密支付列表 -->
      <ul class="list">
        <li class="border_bottom list_4" @click="gotoPublic('defaultPay')">默认支付渠道</li>
        <li class="border_bottom list_5" @click="gotoPublic('freeCode')">小额免密支付</li>
      </ul>
    </div>
    <div class="bottomline">
      <span class="border_bottom"></span>
      <p v-if="isShow==true" @click="show">我是有底线的</p>
      <p v-if="isShow==false" @click="unshow">v-0.0.1</p>
      <span class="border_bottom"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "medicalPay",
  data() {
    return {
      user: this.util.getUser(),
      signLevel: sessionStorage.getItem("signLevel"), // 获取的签发等级
      pageQueryReq: {}, // 获取待支付订单的对象
      List: [], // 待支付订单列表
      payNum: "", // 待支付订单数量
      widnthNum: "16px",
      msgList: [], // 我的消息列表
      signCode: "",
      isShow:true,
      orderList:[]//订单详情对象
    };
  },
  created() {
    sessionStorage.removeItem("codeSource");
    sessionStorage.setItem("medicalIndex", true);
    this.pageQueryReq = this.user;
    this.pageQueryReq.state = "0";
    this.pageQueryReq.expiration = "min";
    this.pageQueryReq.pageSize = 10;
    this.pageQueryReq.pageNumber = 1;
    this.getList();
    this.getPayCount();
    this.getMsgList();
  },
  filters: {
    subStr(value) {
      return value.substr(10);
    },
    moreNum(val) {
      if (val > 99) {
        return "99+";
      }
      return val;
    },
    time(val) {
      if (!val) return;
      return new Date(val).Format("yyyy-MM-dd hh:mm:ss");
    }
  },
  methods: {
    show(){
        this.isShow=false
    },
    unshow(){
        this.isShow=true
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
    // 获取待支付订单
    // getList() {
    //   this.$http
    //     .post("/msc/app/visit/pageQuery", this.pageQueryReq)
    //     .then(res => {
    //       if (res.success) {
    //         this.List = res.body.list.slice(0,2);
    //       } else {
    //         this.$toast(res.message);
    //       }
    //     });
    // },
    getList() {
      this.$http
        .post("/msc/app/visit/pageQuery", this.pageQueryReq)
        .then(res => {
          if (res.success) {
            this.List = res.body.list.slice(0,2);
          } else {
            this.$toast(res.message);
          }            
        });
    },
    //获取待付款数量
    getPayCount() {
      this.$http
        .post("/msc/account/getPayCount", this.util.getUser()) 
        .then(res => {
          if (res.success) {
            this.payNum = res.body;
            
            if (res.body > 9) {
              this.widnthNum = "30px";
            }
          } else {
            this.$toast(res.message);
          }
        });
    },
    // 获取我的消息列表
    getMsgList() {
      this.$http
        .post("/msc/news/myNews", {
          pageSize: 10,
          pageNumber: 1,
          aac002: this.user.idNo
         
        })
        .then(res => {
          if (res.success) {
            this.msgList = res.body.list.slice(0,3);
            console.log("msgList",this.msgList)
          } else {
            this.$toast(res.message);
          }
        });
    },

    // 跳转待支付订单、历史订单页面
    gotoPay(url) {
      if (this.signLevel >= 1) {
        if (url !== "paycode") {
          this.$router.push("payOrder");
          sessionStorage.setItem("itemPage", url);
        } else {
          sessionStorage.setItem("codeSource", "index");
          this.$router.push(url);
        }
      } else {
        this.$messagebox
          .confirm("请先申领电子社保卡")
          .then(() => {
            this.getSignCode();
          })
          .catch(() => {});
      }
    },
    // 跳转支付页面
    gotoDetail(item) {
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
    // 跳转二维码页面
    // gotoHandle(url) {
    //   if (this.signLevel >= 1) {
    //     this.$router.push({
    //       path: url
    //     });
    //   } else {
    //     this.$messagebox
    //       .confirm("请先申领电子社保卡")
    //       .then(() => {
    //         this.getSignCode();
    //       })
    //       .catch(() => {});
    //   }
    // },
    gotoBlank(url) {
      if (this.signLevel >= 1) {
        this.$router.push({
          path: url
        });
      } else {
        this.$messagebox
          .confirm("请先申领电子社保卡")
          .then(() => {
            this.getSignCode();
          })
          .catch(() => {});
      }
    },
    // 跳转消息详情页面
    gotoMsg(item) {
      if (item.pushUrl.indexOf("medicalGuide") > 0) {
        let context = this.util.urlParam(item.pushUrl, "context");
        let direct = this.util.urlParam(item.pushUrl, "direct");
        this.$router.push({
          path: "/medicalGuide",
          query: { context: context, direct: direct }
        });
      } else if (item.pushUrl.indexOf("payList") > 0) {
        this.$router.push({
          path:"PayDetail",
          query:{

          }
          }
          );
        sessionStorage.setItem("itemPage", "payList");
      } else if (item.pushUrl.indexOf("historyList") > 0) {
        this.$router.push({
          path:"PayHisDetail",
          query:{
            
          }
          }
          );
        sessionStorage.setItem("itemPage", "historyList");
        console.log(999)
      } else if (item.pushUrl.indexOf("refund") > 0) {
        this.$router.push("payOrder");
        sessionStorage.setItem("itemPage", "refund");
      }
    },
    // 跳转我的消息、支持医院、关于移动支付页面
    gotoPublic(url) {
      if (this.signLevel >= 1) {
        this.$router.push({
          path: url
        });
      } else {
        this.$messagebox
          .confirm("请先申领电子社保卡")
          .then(() => {
            this.getSignCode();
          })
          .catch(() => {});
      }
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
    }
  },
  mounted() {
    sessionStorage.removeItem("pointList");
    sessionStorage.removeItem("params");
    sessionStorage.removeItem("record");
  }
};
document.body.style.background = "#f2f2f2";
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.main {
  font-size: 14px;
}
.bg {
  height: 120px;
  vertical-align: middle;
}
/* 二维码和电子社保卡 */
.qrCode {
  display: flex;
  position: relative;
  top: -42px;
  left: 0.4rem;
  width: 9.2rem;
  padding: 13px 0;
  list-style: none;
  background: #fff;
  border-radius: 5px;
  li {
    flex: 1;
    text-align: center;
    img {
      vertical-align: middle;
    }
    p {
      margin-top: 12px;
      height: 18px;
    }
  }
}

.content {
  margin-top: -32px;
}
/* 移动支付模块 */
.payment {
  width: 10rem;
  background: #fff;
  .title1 {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 1.02rem;
    line-height: 40px;
    background: url("../../assets/icon/images9.png") no-repeat 0.4rem center,
      url("../../assets/icon/icon-choose.png") no-repeat 9.36rem center;
    background-size: 18px auto, 9px auto;
    label {
      flex: 0 0 auto;
    }
    span {
      flex: 0 0 auto;
      margin-left: 10px;
      border-radius: 35px;
      height: 16px;
      line-height: 18px;
      background: #f65150;
      text-align: center;
      color: #fff;
      font-size: 10px;
    }
  }
  .detail {
    padding: 14px 0.4rem;
    border-radius: 5px;
    li {
      display: flex;
      // position: relative;
      align-items: center;
      padding: 16px 0.4rem;
      background: #ebf7ff;
      .status {
        flex: 0 0 auto;
        width: 48px;
        line-height: 18px;
        font-size: 11px;
        color: #666;
      }
      // .icon {
      //   position: absolute;
      //   top: 0;
      //   bottom: 0;
      //   left: 60px;
      //   width: 32px;
      //   background: url("../../assets/icon/images14.png") no-repeat center;
      //   background-size: 16px;
      // }
      // .icon::after {
      //   content: "";
      //   display: block;
      //   position: absolute;
      //   top: 0;
      //   left: 16px;
      //   bottom: 0;
      //   width: 1px;
      //   background-color: #3399ff;
      // }
      .info {
        flex: 1;
        margin-left: 32px;
        line-height: 20px;
      }
      .hospital {
        color: #1aa5ff;
      }
      .total {
        color: #f65150;
      }
      .btn {
        flex: 0 0 auto;
        margin-left: 10px;
        width: 55px;
        height: 25px;
        line-height: 25px;
        border-radius: 3px;
        background: #3399ff;
        text-align: center;
        color: #fff;
        font-size: 14px;
      }
    }
    li:first-child {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }
    li:last-child {
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
    }
    li:last-child:after {
      background-color: transparent;
    }
  }
}

/* 我的消息 */
.message {
  width: 10rem;
  margin: 10px auto 0;
  background: #fff;
  .title2 {
    height: 40px;
    padding: 0 1.02rem;
    line-height: 40px;
    background: url("../../assets/icon/xiaoxi.png") no-repeat 0.4rem center,
      url("../../assets/icon/icon-choose.png") no-repeat 9.36rem center;
    background-size: 18px auto, 9px auto;
  }
  .guidance {
    li {
      display: flex;
      align-items: center;
      padding: 10px 0.4rem;
      line-height: 22px;
      font-size: 12px;
      color: #888;
      label {
        flex: 1;
      }
      span {
        flex: 0 0 auto;
        width: 125px;
        margin-left: 15px;
        text-align: right;
      }
    }
  }
}
/* 列表 */
.list {
  margin-top: 10px;
  background: #fff;
  li {
    height: 45px;
    line-height: 45px;
    padding-left: 0.867rem;
  }
  .list_1 {
    background: url("../../assets/icon/lishidd.png") no-repeat 0.3rem center,
      url("../../assets/icon/icon-choose.png") no-repeat 9.36rem center;
    background-size: 16px auto, 9px auto;
  }
  .list_2 {
    background: url("../../assets/icon/shebaocard.png") no-repeat 0.3rem center,
      url("../../assets/icon/icon-choose.png") no-repeat 9.36rem center;
    background-size: 16px auto, 9px auto;
  }
  .list_3 {
    background: url("../../assets/icon/hospital.png") no-repeat 0.3rem center,
      url("../../assets/icon/icon-choose.png") no-repeat 9.36rem center;
    background-size: 16px auto, 9px auto;
  }
  .list_4 {
    background: url("../../assets/icon/ydzf2.png") no-repeat 0.3rem center,
      url("../../assets/icon/icon-choose.png") no-repeat 9.36rem center;
    background-size: 16px auto, 9px auto;
  }
  .list_5 {
    background: url("../../assets/icon/shebaocard.png") no-repeat 0.3rem center,
      url("../../assets/icon/icon-choose.png") no-repeat 9.36rem center;
    background-size: 16px auto, 9px auto;
  }
  .list_6 {
    background: url("../../assets/icon/freecode.png") no-repeat 0.3rem center,
      url("../../assets/icon/icon-choose.png") no-repeat 9.36rem center;
    background-size: 16px auto, 9px auto;
  }
}
/* 底线 */
.bottomline {
  display: flex;
  align-items: center;
  margin: 10px 0;
  padding: 0 20%;
}
.bottomline > span {
  flex: 1;
}
.bottomline > p {
  flex: 0 0 auto;
  margin: 0 10px;
  line-height: 25px;
  color: #888;
}
.bottomline> button{
  background: white;
  border: none;
}
</style>