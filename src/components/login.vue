<template>
  <div class="main">
    <ul>
      <li class="border_bottom">
        <label>身份证</label>
        <input type="text" v-model.trim="user.idNo">
      </li>
      <li class="border_bottom">
        <label>姓名</label>
        <input type="text" v-model.trim="user.idName">
      </li>
    </ul>
    <button @click="login">提交</button>
  </div>
</template>

<script>
  export default {
    name: 'ep-login',
    data() {
      return {
        user: {},
      }
    },
    created() {
      
    },
    methods: {
      login() {
        if (!this.user.idNo) {
          this.$messagebox.alert("请输入身份证号码");
          return;
        }
        if (!this.user.idNo) {
          this.$messagebox.alert("请输入姓名");
          return;
        }
        this.$http.post("/msc/user/token", this.user).then(res => {
          if (res.success) {
            this.util.setUser(res.body);
            this.util.setToken(res.token);
            sessionStorage.setItem("channelNo", res.body.bae072);
            sessionStorage.setItem("signNo", res.body.bae071);
            let params = {
              inData: {
                channelNo:  sessionStorage.getItem("channelNo") || "",
                signNo: sessionStorage.getItem("signNo") || "",
              }
            };
            this.$http.post("/msc/8500", params).then(res => {
              if (res.success && res.body) {
                this.signLevel = res.body.signLevel;
                sessionStorage.setItem("signLevel", this.signLevel);
                this.$router.push('/')
              } else {
                console.log("暂未开通电子社保卡业务");
                this.$router.push('/')
              }
            })
          } else {
            this.$messagebox.alert(res.message);
          }
        })
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
ul {
  background: #fff;
  li {
    display: flex;
    align-items: center;
    padding: 10px 0.4rem;
    label {
      flex: 0 0 auto;
      width: 2rem;
    }
    input {
      flex: 1;
      border: none;
      outline: none;
      text-align: right;
      font-size: 16px;
    }
  }
}
button {
  width: 9.2rem;
  height: 50px;
  margin: 25px 0.4rem;
  border: none;
  border-radius: 5px;
  outline: none;
  background: #3399ff;
  font-size: 18px;
  color: #fff;
}
</style>
