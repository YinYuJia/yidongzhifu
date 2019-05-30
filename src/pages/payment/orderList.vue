<template>
  <div>
    <mt-loadmore
      v-if="orderList.length"
      :bottom-method="loadBottom"
      :bottom-all-loaded="allLoaded"
      ref="loadmore"
    >
      <ul class="ul_list">
        <li v-for="item in orderList" class="border_bottom">
          <div>
            <label>医院名称</label>
            <span>{{ item.hospital }}</span>
          </div>
          <div>
            <label>姓名</label>
            <span>{{ user.idName }}</span>
          </div>
          <div>
            <label>金额（元）</label>
            <span>{{ parseFloat(item.total).toFixed(2) || '0.00' }}</span>
          </div>
          <div>
            <label>{{ item.visitTime }}</label>
            <span>
              <button @click="payClick(item)">去支付</button>
            </span>
          </div>
        </li>
      </ul>
    </mt-loadmore>
    <div v-if="!orderList.length" class="blank">
      <div class="pic_null"></div>
      <div class="tip">暂无记录</div>
    </div>
  </div>
</template>

<script>
let ua = navigator.userAgent;
let isIos = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
if (!isIos) {
  window.EPSdk.subscribe("order");
}
export default {
  name: "orderList",
  data() {
    return {
      orderList: [],
      pageQueryReq: {},
      user: {},
      allLoaded: true,
      signLevel: sessionStorage.getItem("signLevel") // 获取的签发等级
    };
  },
  beforeCreate(){
    console.log(123)
  },
  created() {
    this.pageQueryReq = this.util.getUser();
    this.user = this.util.getUser();
    this.pageQueryReq.state = "0";
    this.pageQueryReq.expiration = "min";
    this.pageQueryReq.pageSize = 10;
    this.pageQueryReq.pageNumber = 1;
    
  },
  mounted() {
    
    console.log("pageQueryReq",this.pageQueryReq)
    this.showList();
       
  },
  methods: {
    // 获取待支付订单列表
    showList() {
      console.log(111111133334)
      this.$http
        .post("/msc/app/visit/pageQuery", this.pageQueryReq)
        .then(res => {
           console.log(111)
          if (res.success) {
            this.orderList = [...this.orderList, ...res.body.list];
            if (res.body.totalPage > this.pageQueryReq.pageNumber) {
              this.pageQueryReq.pageNumber += 1;
              this.allLoaded = false;
              
              console.log("待支付",this.orderList)
            }
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
      let url =
        location.href.substring(0, location.href.indexOf("#")) +
        "#/payDetail?obj=" +
        JSON.stringify(item) +
        "&signNo=" +
        sessionStorage.getItem("signNo") +
        "&idCard=" +
        this.user.idNo +
        "&name=" +
        this.user.idName;
      let ua = navigator.userAgent;
      let isIos = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isIos) {
        window.webkit.messageHandlers.goToPay.postMessage(url);
      } else {
        window.EPSdk.newHtml(url);
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
.ul_list {
  padding: 0 4% 15px;
  overflow: auto;
  background: #fff;
  font-size: 14px;
}
.ul_list li {
  padding: 8px 0;
}

.ul_list div {
  display: flex;
  align-items: center;
  padding: 5px 0;
}
.ul_list label {
  flex: 0 0 auto;
  width: 140px;
  color: #999;
}
.ul_list span {
  flex: 1;
  text-align: right;
  color: #333;
}

.ul_list button {
  width: 88px;
  height: 32px;
  border: none;
  outline: none;
  border-radius: 3px;
  background: #3399ff;
  font-size: 16px;
  color: #fff;
}
.blank {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.pic_null {
  width: 105px;
  height: 85px;
  background: url("../../assets/icon/iconnodata.png") no-repeat center;
  background-size: 105px 85px;
}
.tip {
  margin-top: 20px;
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
.ul_list li:last-child:after {
  background-color: transparent;
}
</style>
