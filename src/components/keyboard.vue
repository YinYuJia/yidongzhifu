<template>
  <div class="keyboard">
    <div class="input">{{codeNum}}</div>
    <table cellspacing="0" cellpadding="0">
      <tr>
        <td @click="chooseNum('1')">1</td>
        <td @click="chooseNum('2')">2</td>
        <td @click="chooseNum('3')">3</td>
      </tr>
      <tr>
        <td @click="chooseNum('4')">4</td>
        <td @click="chooseNum('5')">5</td>
        <td @click="chooseNum('6')">6</td>
      </tr>
      <tr>
        <td @click="chooseNum('7')">7</td>
        <td @click="chooseNum('8')">8</td>
        <td @click="chooseNum('9')">9</td>
      </tr>
      <tr>
        <td class="td_bg"></td>
        <td @click="chooseNum('0')">0</td>
        <td @click="chooseNum('delete')" class="delete"></td>
      </tr>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'ep-keyboard',
    props: ['value'],
    data() {
      return {
        codeNum: ''
      }
    },
    created() {
    },
    watch: {
      value:function(val,oldvalue){
          this.codeNum = val;
      }
    },
    methods: {
      chooseNum(num) {
        if (num != "delete") {
          this.codeNum = this.codeNum + num;
        } else {
          this.codeNum = this.codeNum.substring(0, (this.codeNum.length - 1));
        }
        this.$emit('input', this.codeNum)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .keyboard table {
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
  }

  .keyboard td {
    height: 50px;
    border-left: 0.5px solid #C9C9C9;
    border-top: 0.5px solid #C9C9C9;
  }

  .keyboard td:first-child {
    border-left: none !important;
  }

  .delete {
    background: #D1D5DB url("../assets/icon/icon-delete.png") no-repeat center;
    background-size: 20px;
  }

  .input {
    height: 48px;
    border: 1px solid #BABABA;
    border-radius: 4px;
    width: 92%;
    margin: 23px auto;
    line-height: 48px;
    font-size: 18px;
  }
</style>
