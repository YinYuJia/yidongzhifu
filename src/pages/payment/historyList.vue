<template>
  <div class="main" >
    <mt-loadmore v-show="orderList.length" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
      <ul class="ul_list" >
        <li v-for="item in orderList" @click="showDtlClick(item)">
          <div class="icon"></div>
          <div class="hosp_info"><label>{{ item.hospital }}-{{item.dept}}</label><span>{{ item.visitTime }}</span></div>
          <div class="pay_info"><label><p>¥</p>{{ item.total }}</label><span>支付成功</span></div>
        </li>
      </ul>
    </mt-loadmore>
    <div v-show="!orderList.length">
      <div class="pic_null"></div>
      <div class="tip">暂无支付成功订单</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "payHis",
  created: function() {
    this.pageQueryReq = this.util.getUser();
    this.pageQueryReq.state = "1";
    this.pageQueryReq.pageSize = 10;
    this.pageQueryReq.pageNumber = 1;
    this.showList();
    
  },
  data() {
    return {
      orderList: [],
      pageQueryReq: {},
      allLoaded: true,
    };
  },
  methods: {
    showList() {
      this.$http
        .post("/msc/app/visit/pageQuery", this.pageQueryReq)
        .then(res => {
          if (res.success) {
            this.orderList = [...this.orderList, ...res.body.list];
            if (res.body.totalPage > this.pageQueryReq.pageNumber) {
              this.pageQueryReq.pageNumber += 1;
              this.allLoaded = false;
            } else {
              this.allLoaded = true;
            }
            console.log("支付成功",this.orderList)
          } else {
            this.$messagebox
              .alert("查询订单列表失败：" + res.message)
              .then(r => {
                this.$router.go(-1);
              });
          }
        });
        
    },
    showDtlClick(item) {
      this.$router.push({
        path: "/payHisDetail",
        query: { obj: JSON.stringify(item) }
      });
    },
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
<style lang="less" scoped>
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
  color: #888888;
  display: block;
}
.pay_info > label > p {
  font-size: 12px;
  color: #888888;
  display: inline-block;
  margin-right: 3px;
}
.pay_info > span {
  font-size: 12px;
  color: #888888;
  display: block;
  width: 65px;
  height: 20px;
  line-height: 20px;
  margin: 5px auto;
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
