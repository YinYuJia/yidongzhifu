<template>
<v-touch v-on:swipeleft="swiperleft" v-on:swiperight="swiperright" class="wrapper">
  <div class="main">
    <mt-navbar v-model="selected" fixed>
      <mt-tab-item id="payList">待支付</mt-tab-item>
      <mt-tab-item id="historyList">支付成功</mt-tab-item>
      <mt-tab-item id="refund">退款记录</mt-tab-item>
      <mt-tab-item id="expireList">已失效</mt-tab-item>
      <mt-tab-item id="payFail">支付失败</mt-tab-item>
    </mt-navbar>
    <div class="pay-list" :style="{height: height}">
      <mt-tab-container >
        <mt-tab-container-item >
          <component v-bind:is="selected"></component>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</v-touch>
</template>

<script>
  import payList from './payList'
  import historyList from './historyList'
  import expireList from './expirePayList'
  import refund from './refund'
  import payFail from './payFail'
  export default {
    name: 'payOrder',
    components:{
      'payList':payList,
      'historyList':historyList,
      'expireList':expireList,
      'refund':refund,
      'payFail':payFail
      },
    data() {
      return {
        selected: "",
        height: window.innerHeight - 49 + 'px',
      }
    },
    created() {
      sessionStorage.setItem("medicalIndex", true);
      let itemPage = sessionStorage.getItem("itemPage") || this.$route.query.itemPage;
      if(itemPage){
         sessionStorage.setItem("itemPage",itemPage);
         this.selected = itemPage;
      } else {
        this.selected = 'PayList';
      }
    },
    methods: {
        swiperleft: function () {
        if(this.selected=="payList"){
          this.selected="historyList"
          return 
        }
        if(this.selected=="historyList"){
          this.selected="refund"
          return
        }    
        if(this.selected=="refund"){
          this.selected="expireList"
          return
        }
        if(this.selected=="expireList"){
          this.selected="payFail"
          return
        }    
        },
        swiperright: function () {
        if(this.selected=="historyList"){
          this.selected="payList"
          return
        }
        if(this.selected=="refund"){
          this.selected="historyList"
          return
        }
        if(this.selected=="expireList"){
          this.selected="refund"
          return
        }
        if(this.selected=="payFail"){
          this.selected="expireList"
          return
        }
        },
    },
    watch:{
      selected: function(val){
        sessionStorage.setItem("itemPage",val);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
   .pay-list{
     margin-top: 49px;
     overflow: auto;
   }
</style>
