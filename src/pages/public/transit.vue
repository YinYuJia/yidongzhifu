<template>
  <div>
    <div id="l-map"></div>
	  <div id="r-result" class="result" v-show="!long">
      <div v-if="short">
        距离太短，建议步行~
      </div>
    </div>
    <div class="result" v-show="long">
       <div>
        很抱歉，未找到公交线路,请选择其他方式~
      </div>
    </div>
  </div>
</template>
<script>
import BMap from "BMap";
export default {
  name: "transit",
  created() {
    this.start = JSON.parse(sessionStorage.getItem("start"));
    this.end = JSON.parse(sessionStorage.getItem("end"));
  },
  data() {
    return {
      start: {},
      end: {},
      short: false,
      long: false,
    };
  },
  methods: {
    //获取公交信息
    getTransit() {
      let map = new BMap.Map("l-map");
      let p1 = new BMap.Point(this.start.lng, this.start.lat);
      let p2 = new BMap.Point(this.end.lng, this.end.lat);
      map.centerAndZoom(new BMap.Point(this.start.lng, this.start.lat), 15);
      let transit = new BMap.TransitRoute(map, {
        onSearchComplete:(result)=> {
         if(transit.getStatus()==3) {
            this.long = true;
         }
        },
        renderOptions: { map: map, panel: "r-result" }
      });
      if (map.getDistance(p1, p2) < 300) {
        this.short = true;
        return;
      }
      // if (map.getDistance(p1, p2) > 50000) {
      //   this.long = true;
      //   return;
      // }
      transit.search(p1, p2);
    }
  },
  mounted() {
    this.getTransit();
  }
};
</script>
<style scoped>
#l-map {
  height: 250px;
  width: 100%;
}
.result {
  position: absolute;
  bottom: 0;
  top: 290px;
  overflow: auto;
}
.result,
.result table {
  width: 100%;
}
.result > div {
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translate(0, -50%);
  font-size: 16px;
  text-align: center;
}
</style>
