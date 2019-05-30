<template>
    <div class="hint-open" v-if="isShow">
        <div class="hint-content">
            <div class="hint-head">开通免密支付</div>
            <div class="hint-msg">
                <div class="title">免密条件</div>
                <div class="text">自费费用小于等于500元，即刻扣款</div>
            </div>
            <div class="hint-msg">
                <div class="title">免密支付渠道</div>
                <div class="text">目前支持：社保卡银行账户、银联云闪付</div>
            </div>
            <div class="hint-msg">
                <div class="title">生效时间</div>
                <div class="text">开通后即刻生效</div>
            </div>
            <div class="open-btn" @click="openNow()">立即开通</div>
            <div class="switch-content">
                <span>不再提示</span>
                <mt-switch v-model="showSwitch"></mt-switch>
            </div>
        </div>
        <div class="close-btn" >
            <img @click="closeHint()" src="../../../assets/icon/icon-close.png">
        </div>
    </div>
</template>

<script>
export default {
    name: 'hint-open',
    data(){
        return{
            showSwitch: false,
        }
    },
    watch: {
        // 将是否提示存入localStorage
        showSwitch: function(){
            if( this.showSwitch === false){
                localStorage.setItem('ShowFreeCodePay',true);
            }else{
                localStorage.setItem('ShowFreeCodePay',false);
            }
        }
    },
    props:{
        isShow: Boolean,
    },
    methods:{
        openNow(){
            this.$router.push("/agreeOpen");
        },
        closeHint(){
            this.$emit('closeHint');
        }
    }
}
</script>

<style scoped>
.hint-open{
    position: absolute;
    top: 0;
    left: 0;
    max-width: 768px;
    width: 100%;
    height: 100%;
    background: rgba(220, 220, 220, .6);
    z-index: 999;
}
.hint-content{
    position: absolute;
    width: 80%;
    height: 280px;
    left: 50%;
    margin-left: -40%;
    top: 50%;
    margin-top: -200px;
    background: white;
    padding-bottom: 10px;
    display: flex;
    flex-direction: column;
    box-shadow: 2px 2px 5px 2px #ddd;
}
.hint-content>.hint-head{
    padding: 8px 0;
    text-align: center;
    font-size: 17px;
    font-weight: bold;
}
.hint-content>.hint-msg{
    padding: 5px 30px;
}
.hint-content>.hint-msg>.title{
    font-weight: bold;
}
.hint-content>.hint-msg>.text{
    font-size: 13px;
}
.hint-content>.hint-msg>.text>span{
    color: red;
}
.hint-content>.open-btn{
    height: 33px;
    width: 50%;
    margin: 10px auto;
    border-radius: 5px;
    background: #169BD5;
    text-align: center;
    line-height: 33px;
    color: white;
    font-weight: bold;
    cursor: pointer;
}
.hint-content>.switch-content{
    height: 40px;
    line-height: 40px;
    margin: auto;
    display: flex;
}
.hint-content>.switch-content>span{
    padding: 0 10px;
}
.hint-open>.close-btn{
    height: 28px;
    width: 28px;
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    margin-left: -15px;
    top: 50%;
    margin-top: 100px;
}
.hint-open>.close-btn>img{
    height: 100%;
    width: 100%;
}
</style>