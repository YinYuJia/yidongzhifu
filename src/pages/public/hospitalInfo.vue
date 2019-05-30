<template>
  <div class="main" >
    <div id="allmap"></div>
    <div class="container">
       <h4>{{params.akb021 | subStr}}</h4>
       <div>电话：{{(params.aae005 && params.aae005 !== 'null') ? params.aae005 : "暂无"}}</div>
       <div>地址：{{(params.aae006 && params.aae006 !== 'null') ? params.aae006 : "暂无" | subStr}}</div>
       <button @click="call">电话</button><button @click="go">导航</button>
    </div>
  </div>
</template>
<script>
import BMap from "BMap";
export default {
  name: "hospitalInfo",
  created() {
    let routerQuery = this.$route.query;
    this.params = JSON.parse(routerQuery.obj);
    sessionStorage.setItem("end",JSON.stringify(this.params));
  },
  data() {
    return {
      params: {}
    };
  },
  filters: {
    subStr: function(value) {
      if (value.length > 21) {
        return value.substr(0, 20) + "...";
      } else {
        return value;
      }
    }
  },
  methods: {
    //获取地图信息
    getPosition() {
      let map = new BMap.Map("allmap");
      let point = new BMap.Point(this.params.lng, this.params.lat);
      map.centerAndZoom(point, 15);
      let marker = new BMap.Marker(point);// 创建标注
      let opts = {
        position: point, // 指定文本标注所在的地理位置
        offset: new BMap.Size(10, -40) //设置文本偏移量
      };
      let label = new BMap.Label(
        this.params.akb021,
        opts
      ); // 创建文本标注对象
      label.setStyle({
        color: "#000",
        fontSize: "12px",
        height: "20px",
        lineHeight: "20px",
        fontFamily: "微软雅黑"
      });
      map.addOverlay(label);              // 将文本信息添加到地图中
      map.addOverlay(marker);             // 将标注添加到地图中
      map.enableScrollWheelZoom(true);
    },
    //打电话
    call() {
      if(!this.params.aae005) {
        this.$toast("暂未获取电话");
        return;
      }
      window.location.href = `tel:${this.params.aae005}`;
    },
    go() {
      this.$router.push("/navigation");
    },
  },
  mounted() {
    this.getPosition();
  }
};
</script>
<style scoped>
  #allmap {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .container {
    position: absolute;
    left: 5%;
    bottom: 5%;
    width: 90%;
    border-radius: 5px;
    background: #fff;
  }
  h4 {
    line-height: 45px;
    padding-left: 5%;
  }
  .container>div {
    padding-left: 5%;
    line-height: 30px;
    font-size: 12px;
    color: #888;
  }
  button {
    width: 50%;
    height: 40px;
    border:none;
    background: #fff;
    outline: none;
    font-size: 16px;
    color: #3399ff;
  }
  .box_right {
    box-shadow: inset -1px 0px 1px -1px #ccc;
  }
  
</style>
