<template>
    <div class="ep-guide">
        <img :src="`${url}/msc/qrcode/context?token=${this.util.getToken()}&context=${this.context}`">
        <p>取药位置：{{ direct }}</p>
    </div>
</template>

<script>
export default {
    name: "guideInfo",
    data() {
        return {
            direct: this.$route.query.direct,
            context: this.$route.query.context,
            url: process.env.ApiUrl
        };
    },
    mounted() {
        // this.qrcode = `${process.env.ApiUrl}/msc/qrcode/context?token=${this.util.getToken()}&context=${this.context}`;
    }
}
</script>

<style scoped>
.ep-guide {
    padding: 20px;
}
.ep-guide p {
    padding-top: 10px;
    text-align: center;
}
.ep-guide img {
    width: 100%;
}
</style>