<template>
  <div class="main">
    <div class="tool box_bottom">
      <span  :class="{'active':curId ===1}" @click="check1">公交</span>
      <span  :class="{'active':curId ===2}" @click="check2">驾车</span>
      <span  :class="{'active':curId ===3}" @click="check3">步行</span>
    </div>
    <component :is="curView"></component>
  </div>
</template>
<script>
import Transit from "./transit";
import Drive from "./drive";
import Walk from './walk'
export default {
  name: "navigation",
  components:{'Transit':Transit,'Drive':Drive,'Walk':Walk},
  created() {
   
  },
  data() {
    return {
      curView: "Transit",
      curId: 1,
      params: {}
    };
  },
  methods: {
    check1() {
      this.curId = 1;
      this.curView = 'Transit';
    },
    check2() {
      this.curId = 2;
      this.curView = 'Drive';
    },
    check3() {
      this.curId = 3;
      this.curView = 'Walk';
    },
  },
  mounted() {
    
  }
};
</script>
<style scoped>
  .tool {
    position: absolute;
    top: 250px;
    width: 100%;
    z-index: 999;
    background: #fff;
    font-size: 0;
  }
  span {
    display: inline-block;
    padding:0 15px;
    box-sizing: border-box;
    line-height: 40px;
    font-size: 14px;
  }
  .box_bottom {
    box-shadow: inset 0px -1px 1px -1px #ccc;
  }
  .active {
    border-bottom: 3px solid #3399ff;
    color: #3399ff;
  }
</style>
