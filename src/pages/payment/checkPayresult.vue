<template>
    
</template>
<script>
export default {
    data(){
        return{
            orderId: '',
            timeStamp: false,
            message:{
                id:"",
                numb:"0",
            }
        }
    },
    created(){       
    },
    mounted(){
        console.log('123')
        this.orderId =this.$route.query.id;
        this.message.id="APP_"+this.orderId;
        console.log(this.message.id);
        console.log(this.timeStamp);
        Indicator.open('')
        this.getPayResult()
        setTimeout(()=>{
            this.timeStamp = true;
            console.log(this.timeStamp);
        },30000);
    },
    methods:{
        getPayResult: function(){
            this.$http.post('/longRunning/pay/getPayResult/',this.message)
            .then(res => {
                console.log(this.message)
                if(res.success){
                    if(this.timeStamp){
                        // 请求超时
                        Indicator.close()
                        this.$router.push({
                            path: "payResult",
                            query: { paySuccess: false }
                        });
                        return;
                    }else if(res.body == "1"){
                        Indicator.close()
                        this.$router.push({
                            path: "payResult",
                            query: { paySuccess: res.success }
                        });
                    }else if(res.body == "0"){
                        this.message.numb=`${this.message.numb-0+1}`
                        console.log("numb",this.message.numb)
                        // console.log("message",this.message)
                        this.getPayResult();
                    }else if(res.body == "-1"){
                        Indicator.close()
                        this.$router.push({
                            path: "payResult",
                            query: { paySuccess: false }
                        });
                    }
                }
            })
            .catch(err => {
                console.log(err);
            })
        }

    },
}
</script>
//1成功 0轮询 -1失败

<style lang="less" scoped>

</style>
