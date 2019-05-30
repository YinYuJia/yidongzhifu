<template>
  <div>
    <div id="l-map"></div>
	  <div id="r-result"></div>
  </div>
</template>
<script>
import BMap from "BMap";
export default {
  name: "walk",
  created() {
    this.start = JSON.parse(sessionStorage.getItem("start"));
    this.end = JSON.parse(sessionStorage.getItem("end"));
  },
  data() {
    return {
      start: {},
      end: {},
    };
  },
  methods: {
    //获取公交信息
    getDrive() {
      let map = new BMap.Map("l-map");
      map.centerAndZoom(new BMap.Point(this.start.lng,this.start.lat), 11);
      let walking = new BMap.WalkingRoute(map, {
        renderOptions: { map: map, panel: "r-result", autoViewport: true }
      });
      let p1 = new BMap.Point(this.start.lng,this.start.lat);  
      let p2 = new BMap.Point(this.end.lng,this.end.lat);  
      walking.search(p1, p2);
    }
  },
  mounted() {
    this.getDrive();
  }
};
</script>
<style scoped>
#l-map {
  height: 250px;
  width: 100%;
}
#r-result {
  position: absolute;
  bottom: 0;
  top:290px;
  overflow: auto;
}
#r-result,
#r-result table {
  width: 100%;
}
</style>
