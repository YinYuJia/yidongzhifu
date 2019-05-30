<template>
    <div class="default-pay">
        <div class="title">请勾选您的默认支付渠道</div>
        <ul class="list">
            <li v-for="item in payList" :key="item.aaa102" class="border_bottom check" @click="changePaytype(item.aaa102)">
                <span>{{item.aaa103}}</span>
                <div class="checked-img" v-if="defaultWay==item.aaa102"><img src="../../../assets/icon/icon-select.png"></div>
            </li>
        </ul>
    </div>
</template>

<script>
import Utils from "../../../utils/util";
export default {
    data(){
        return{
            payList: [],
            defaultWay: '',
        }
    },
    created(){
        // 获取所有支付渠道
        this.$http.post('/msc/app/microPayChanneNo', {'aaa102': ''}).then(res => {
            console.log("res",res)
            if(res.success){
                this.payList = res.body;
            }else{
                this.$messagebox.alert("获取支付渠道失败");
            }
        });
        // 获取当前的默认支付渠道
        let user = Utils.getUser();
        // 1社保卡金融账户 5银联云闪付 8微信支付 9支付宝支付
        this.defaultWay = user.payModel;
        
    },
    methods:{
        changePaytype(val){
            // 如果是默认方式则不操作
            if(val == this.defaultWay){
                return false;
            }else{
                // 否则判断是不是做更改
                let user = Utils.getUser();
                if(user.bae027 == '0'){
                    this.$messagebox.alert("请先开通免密支付").then(action=>{
                        this.$router.push('/freeCode');
                        return false;
                    })
                }else{
                    let SignInfo = {
                        'aae135': user.idNo,
                        'aae500': user.sbkNo,
                        'bae070': user.bae070
                    }
                    this.$http.post('/msc/app/microPaymentsOpen/' + val , SignInfo).then(res => {
                        if(res.success){
                            let user = this.util.getUser();
                            user.payModel = val;
                            this.util.setUser(user);
                            this.defaultWay = val;
                            
                            this.$messagebox.alert("更改成功").then(action=>{
                                this.$router.push('/');
                            })
                        }else{
                            this.$messagebox.alert("更改失败");
                        }
                    })
                    .catch(err =>{
                        this.$messagebox.alert(err);
                    })
                }
            }
        }
    },
}
</script>

<style lang="less" scoped>
.default-pay{
    background: white;
    font-size: 14px;
    .title{
        padding: 10px;
        border-bottom: 1px solid #ccc;
    }
    .list{
        .check{
            padding: 10px;
            display: flex;
            justify-content: space-between;
            .checked-img{
                height: 20px;
                width: 20px;
                img{
                    height: 100%;
                    width: 100%;
                }
            }
        }
    }
}
</style>