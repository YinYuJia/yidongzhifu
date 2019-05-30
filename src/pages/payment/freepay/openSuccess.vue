<template>
    <div class="open-success">
        <div class="success-box">
            <div class="success-icon">
                <img src="../../../assets/icon/icon-select.png">
            </div>
            <div class="success-msg">开通成功</div>
            <div class="back-btn" @click="back()">返回“我的移动支付”</div>
        </div>
    </div>
</template>

<script>
export default {
    methods:{
        back(){
            this.$router.push('/');
        }
    }
}
</script>

<style scoped>
.open-success{
    max-width: 768px;
    width: 100%;
    height: 100%;
    background: white;
}
.success-box{
    width: 100%;
    height: 300px;
    position: absolute;
    top: 50%;
    margin-top: -180px;
    text-align: center;
}
.success-msg{
    font-size: 18px;
    font-weight: bold;
    margin-top: 15px;
}
.back-btn{
    height: 40px;
    width: 180px;
    line-height: 40px;
    font-weight: bold;
    color: white;
    margin-top: 30px;
    background: #169BD5;
    border-radius: 5px;
    margin: 30px auto;
}
</style>
