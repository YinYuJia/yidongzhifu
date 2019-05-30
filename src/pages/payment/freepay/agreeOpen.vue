<template>
    <div class="agree-open">
        <!-- <div class="agree-list">
            <div class="list-name">商户名称</div>
            <div class="list-text">{{merchantName}}</div>
        </div>
        <div class="agree-list">
            <div class="list-name">电子社保卡</div>
            <div class="list-text">{{cardCode}}</div>
        </div> -->
        <div class="see-protocol">
            查看<span @click="openProtocol()">《医保移动支付免密支付协议》</span>
        </div>
        <div class="btn-box">
            <div class="agree-btn" @click="getSignCode()">同意协议并开通免密支付</div>
        </div>
    </div>
</template>

<script>
import Utils from "../../../utils/util";
export default {
    data(){
        return{
            // merchantName: '商户名称',
            // cardCode: '******************0030',
            signInfo:{},
            user: this.util.getUser(),
            signCode: "",
        }
    },
    methods:{
        openProtocol(){
            this.$router.push('/codeProtocol');
        },
        // 获取签名串
        getSignCode() {
            let params = {
                channelNo: sessionStorage.getItem("channelNo") || "",
                signNo: sessionStorage.getItem("signNo") || "",
                aab301: this.user.aab301,
                aac002: this.user.idNo,
                aac003: this.user.idName,
                busiSeq: "",
                aac067: this.user.aae005,
                returnUrl: ""
            };
            this.$http.post("/msc/csb/sign", params).then(res => {
                if (res.success) {
                this.signCode = res.body;
                this.openAgree();
                } else {
                this.$toast(res.message);
                }
            });
        },
        openAgree(){
            let _this = this;
            let certData = {
                sign: this.signCode || ""
            };
            dsBridge.call("validatePwd", certData, res => {
                res = JSON.parse(res);
                if (res.success) {
                    _this.signInfo.aac002 = _this.user.idNo;
                    _this.signInfo.channelNo = sessionStorage.getItem("channelNo");
                    _this.signInfo.signNo = sessionStorage.getItem("signNo");
                    _this.signInfo.busiSeq = res.body.busiSeq;
                    _this.saveToken(_this.signInfo);
                } else {
                    _this.$messagebox.alert(res.message);
                }
            });
        },
        saveToken(signInfo) {
            this.$http
                .post("/msc/csb/savetoken", signInfo)
                .then(res => {
                if (res.success) {
                    let SignInfo = {
                        type: '1',
                        signNo: signInfo.signNo,
                        busiSeq: signInfo.busiSeq, //免密传递
                        payModel: '1'
                    }
                    
                    this.$http.post('/msc/app/microPayments', SignInfo).then(res => {
                        if(res.success){
                            let user = this.util.getUser();
                            user.bae027 = "1";
                            this.util.setUser(user);
                            this.$router.push("/openSuccess");
                        }else{
                            this.$messagebox.alert(res.message).then(r => {
                                this.$router.push("/");
                            });
                        }
                    }).catch(err => {
                        this.$messagebox.alert(err);
                    })
                } else {
                    this.$messagebox.alert(`密码验证失败：${res.message}`).then(() => {
                    let medicalIndex = sessionStorage.getItem("medicalIndex") || "";
                    if (medicalIndex) {
                        this.$router.push("/");
                    } else {
                        let ua = navigator.userAgent;
                        let isIos = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                        if (!isIos) {
                        dsBridge.call("close", "");
                        } else {
                        window.webkit.messageHandlers.close.postMessage("yes");
                        }
                    }
                    });
                }
                })
                .catch(ex => {
                let _ex = JSON.stringify(ex);
                let __ex = JSON.parse(_ex);
                this.$messagebox
                    .alert(`密码验证失败：${__ex.response.data.message}`)
                    .then(() => {
                    let medicalIndex = sessionStorage.getItem("medicalIndex") || "";
                    if (medicalIndex) {
                        this.$router.push("/");
                    } else {
                        let ua = navigator.userAgent;
                        let isIos = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                        if (!isIos) {
                        dsBridge.call("close", "");
                        } else {
                        window.webkit.messageHandlers.close.postMessage("yes");
                        }
                    }
                    });
                });
            }
    }
}
</script>

<style scoped>
.agree-open{
    max-width: 768px;
    width: 100%;
    height: 100%;
    background: white;
}
.agree-open>.agree-list{
    width: 100%;
    padding: 5px 15px;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
}
.agree-open>.agree-list:first-child{
    padding-top: 20px;
}
.agree-open>.agree-list>.list-text{
    text-align: right;
    font-weight: bold;
}
.agree-open>.see-protocol{
    width: 100%;
    padding: 20px 15px;
    box-sizing: border-box;
}
.agree-open>.see-protocol>span{
    margin-left: 10px;
    font-weight: bold;
    color: #6699FF;
}
.agree-open>.btn-box{
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
}
.agree-open>.btn-box>.agree-btn{
    height: 40px;
    width: 100%;
    line-height: 40px;
    text-align: center;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    background: #169BD5;
}
</style>