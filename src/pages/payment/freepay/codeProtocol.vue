<template>
    <div class="code-protocol">
        <div class="title">协议内容</div>
        <div class="text">
            <p>&nbsp&nbsp&nbsp医保移动APP支付服务小额免密支付功能开通协议，以下简称“本协议”。用户通过网络页面勾选或以其他方式选择接受本协议，即表示用户与我司已达成协议并同意接受本协议的全部约定内容。</p>
            <p>&nbsp&nbsp&nbsp根据本协议，我公司将为您合法拥有的医保账户在移动端（即无线设备，包括但不限于手机、便携式电脑等能够连接并使用WIFI、2G/3G网络等无线网络的电子设备）开通医保移动APP支付服务的小额免密支付功能。</p>
            <p>&nbsp&nbsp&nbsp根据本协议开通本功能后，您在使用无线设备、通过无线网络向医保移动APP发送构成授权付款指示的指令时，对于付款金额在一定数额以下的小额支付，将无需输入密码或手机验证码，您点击确认或支付或类似的行为，即被视为您确认交易和交易金额，且该行为已不可撤销地向支付钱包发出指令，支付钱包将根据该指令委托银行或第三方从您的银行卡中划扣资金给收款人。同时，您可以通过APP中的开启免密支付一栏，关闭或开通本功能，保证您的财产的安全。 </p>
            <p>&nbsp&nbsp&nbsp当您选择开通本功能时，医保移动APP按照收到的上述符合约定的支付指令完成支付的行为不承担任何责任，您需自行承担因自己管理支付钱包账户、登录密码、交易密码、无线终端等与支付有关的信息和设备不善所造成的后果。</p>
            <p>&nbsp&nbsp&nbsp当您关闭本功能时，您将无法通过本功能在移动端实现小额免密支付。</p>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
        }
    }
}
</script>

<style scoped>
.code-protocol{
    max-width: 768px;
    width: 100%;
    height: 100%;
    background: white;
    padding: 0 15px;
    box-sizing: border-box;
}
.title{
    padding: 10px 0;
    text-align: center;
}
</style>