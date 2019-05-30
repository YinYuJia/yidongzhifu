<template>
  <div class="main">
    <div class="order_detail">
      <div class="title">{{ item.hospital }}-{{item.dept}}</div>
      <ul>
        <li><label>就诊人：</label><span>{{order.name | tuoMin(1, 1)}}</span></li>
        <li><label>社保卡号：</label><span>{{order.card | tuoMin(3, 3)}}</span></li>
        <li><label>开方医生：</label><span>{{item.doctor}}</span></li>
      </ul>
      <table cellpadding="0" cellspacing="0" class="border_top">
        <tr class="line">
          <td class="border_bottom">项目/规格类</td>
          <td class="border_bottom">金额（元）</td>
          <td class="border_bottom">数量</td>
          <td class="border_bottom">自理自费（元)</td>
        </tr>
        <tr v-for="(item,index) in itemResults" v-show="index <= 1 || (index >= 2 && showMore)">
          <td>{{item.name }} </td>
          <td>{{item.money | fixedNumber}}</td>
          <td>{{item.num}}</td>
          <td>{{(item.selfCareExpense + item.selfExpense + item.overrun) | fixedNumber}}</td>
        </tr>
      </table>
      <div class="lookMore" v-show="itemResults.length > 2" @click="showMoreClick">{{displayName}}</div>
    </div>
    <div>
      <ul class="payment">
        <li class="border_bottom"><label>结算总金额：</label><span>¥<b>{{order.totalAmount | fixedNumber}}</b></span></li>
        <li class="border_bottom"><label>医保支付：</label><span>¥<b>{{order.fundAmount | fixedNumber}}</b></span></li>
        <li class="border_bottom"><label>个人支付：</label><span class="text_color">¥<b>{{order.amount | fixedNumber}}</b></span></li>
        <li><label>支付方式：</label><span>{{order.payModel | transPayMode}}</span></li>
      </ul>
      <ul class="time sp_color">
        <li class="border_bottom"><label>订单状态：</label><span 
        v-bind:class="{ 'text_color':order.state == '4'}">{{order.state | transPayState}}</span></li>
        <li class="border_bottom"><label>订单编号：</label><span>{{order.orderNo}}</span></li>
        <li class="border_bottom"><label>下单时间：</label><span>{{order.orderTime | formatTime}}</span></li>
        <li class="border_bottom"><label>支付时间：</label><span>{{order.payTime | formatTime}}</span></li>
        <li v-show="order.state == '4'"><label>退款时间：</label><span>{{order.refundTime | formatTime}}</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "payDetail",
  data() {
    return {
      item: {},
      itemResults: [],
      settleResult: {},
      order: {},
      displayName: "查看更多",
      showMore: false
    };
  },
  created: function() {
    console.log("payhistorydetail")
    this.item = JSON.parse(this.$route.query.obj);
    if (!this.item || !this.item.id) {
      this.$messagebox.alert("未获取到支付订单信息").then(r => {
        this.$router.push("/");
      });
    } else {
      console.log("item",this.item)  
      this.getList();
    }
  },

  methods: {
    getList() {
      this.$http.post("/msc/app/history/" + this.item.id).then(res => {
        if (res.success) {
          if (res.body.order) {
            this.order = res.body.order;
          }
          if (res.body.itemResults) {
            this.itemResults = res.body.itemResults;
          }
          if (res.body.settleResult) {
            this.settleResult = res.body.settleResult;
          }
        } else {
          this.$messagebox.alert(res.message).then(r => {
            this.$router.go(-1);
          });
        }
      });
    },
    showMoreClick: function() {
      this.showMore = !this.showMore;
      if (!this.showMore) {
        this.displayName = "查看更多";
      } else {
        this.displayName = "隐藏";
      }
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
  margin-bottom: 15px;
}

.price span,
.text_color {
  color: #f65150 !important;
}

.price label {
  color: #f65150;
  font-size: 26px;
}

.sp_color span {
  color: #888888;
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
