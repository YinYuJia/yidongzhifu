<template>
    <div></div>
</template>

<script>
export default {
    created(){
//         this.$messagebox({
//           title: '温馨提示',
//           message: '该功能建设中',
//         })
this.$messagebox.alert('该功能正在建设中，敬请期待！').then(action => {
//   this.$router.push('/payResult')
  this.$router.push('/checkPayresult')
  
});
    }
}
</script>

