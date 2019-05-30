<template>
    <div class="free-code">
        <div class="btn">
            <span>免密支付</span>
            <mt-switch v-model="showSwitch"></mt-switch>
        </div>
        <div class="hint">开通后，您将享受小额免密支付体验（500元及以下）</div>
    </div>
</template>

<script>
import Utils from "../../../utils/util";
export default {
    data(){
        return{
            showSwitch: null,
            firstEnter: true
        }
    },
    created(){
        // 判断是否已开通免密支付
        let user = Utils.getUser();
        if(user.bae027 == '1'){
            this.showSwitch = true;
        }else{
            this.showSwitch = false;
        }
    },
    watch:{
        showSwitch(val){
            if(this.firstEnter == true){
                this.firstEnter = false;
                return false;
            }else{
                if(val == false){
                    console.log("准备关闭");
                    let user = Utils.getUser();
                    let signInfo = {
                        'aae135': user.idNo,
                        'aae500': user.sbkNo,
                        'bae070': user.bae070
                    }
                    this.$http.post('/msc/app/microPaymentsShut',signInfo)
                    .then(res => {
                        if(res.success){
                            let user = this.util.getUser();
                            user.bae027 = "0";
                            this.util.setUser(user);
                            this.$messagebox.alert("关闭成功");
                        }else{
                            this.$messagebox.alert("关闭失败");
                        }
                    })
                    .catch(err =>{
                        this.$messagebox.alert(err);
                    })
                }else{
                    console.log("准备开通");
                    this.$router.push("/agreeOpen");
                }
            }
        }
    },
    methods:{

    }
}
</script>

<style lang="less" scoped>
.free-code{
    height: 100%;
    background: white;
    font-size: 14px;
    padding: 0 15px;
    .btn{
        padding: 15px 0;
        display: flex;
        justify-content: space-between;
        span{
            display: block;
            line-height: 32px;
        }
    }
    .hint{
        padding: 10px 0;
    }
}
</style>
