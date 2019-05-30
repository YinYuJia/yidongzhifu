<template>
  <div class="main" :sytle="{height: height}">
    <div class="wrap" >
      <h3 class="title">中国工商银行“浙江省医疗保险移动支付平台”使用协议</h3>
      <div class="content">
        <p>　　重要提示：尊敬的客户：为维护您的权益，请在签署本协议前，仔细阅读本协议各条款，特别是黑体字部分。关注您在协议中的权利、义务及责任。如您对本协议有任何疑问，请向经办行咨询。请您在自愿接受乙方按照本协议提供的服务以及充分理解本协议条款的基础上签署本协议。</p>
        <p>　　甲方：{{user.idName | tuoMin(1, 1)}}</p>
        <p>　　乙方：中国工商银行浙江省分行</p>
        <p>　　甲方和乙方本着自愿、平等的原则，经充分协商，就甲方使用乙方“浙江省医疗保险移动支付平台”线上支付其应缴费用事宜达成如下协议。</p>
        <p>　　1、甲方委托乙方通过乙方电子银行向“浙江省医疗保险移动支付平台”（以下简称省医保移动支付）主动支付甲方应个人自负支付的款项。并自愿选择甲方社会保障卡金融账户（或绑定账户）作为优先账户。</p>
        <p>　　2、乙方根据省省医保移动支付平台的电子交易指令，将甲方应支付的金额从甲方账户扣划至收费单位账户，甲方应对支付行为负责。乙方对于甲方与收费单位之间就费用金额产生的纠纷或因支付行为造成的损失不承担任何责任。</p>
        <p>　　3、如甲方通过第三方支付方式向省医保移动支付，甲方有责任确认第三方支付机构办理支付业务的真实性，并对该支付行为负责。</p>
        <p>　　4、本协议自甲方确认接受该协议后生效，至甲方注销服务时终止，但甲方在协议停止使用前向收费客户发出的所有收费指令仍为有效指令，由甲方承担责任。</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'protocol',
    data() {
      return {
        user: {},
        height: window.innerHeight + 'px',
      }
    },
    created() {
      this.user = this.util.getUser();
    },
    methods: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .main {
    background: #fff;
    overflow: auto;
  }
  .wrap {
    width: 90%;
    margin: 0 auto;
    padding-bottom: 20px;
  }
  .title {
    margin: 15px 0;
    text-align: center;
  }

</style>
