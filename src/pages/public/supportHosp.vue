<template>
  <div class="main">
    <template v-if="status === '1'">
      <div class="header border_bottom">
        <input type="text" placeholder="搜索定点医院" v-model="params.akb021">
        <span class="search_icon" @click="clear"></span>
        <button @click="search">搜索</button>
      </div>
      <div class="content" :style="{height: height}">
        <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
          <ul class="border_bottom">
            <li v-for="item in List" class="border_bottom" @click="check(item)"
            v-if="isShow"
            >
              <h4 class="name">{{ item && item.akb021 }}</h4>
              <div class="info">
                <label>{{(item && item.aae006 && item.aae006 !== 'null') ? item.aae006: '暂无' }}</label>
                <span>距离{{item && item.disTwoPlace}}km</span>
              </div>
            </li>
          </ul>
        </mt-loadmore>
        <div class="footer" v-if="List.length < 20 && List.length > 0">没有更多数据了~</div>
      </div>
    </template>
    <template v-if="status === '-1'">
      <div class="pic_null"></div>
      <div class="tip">暂无数据~</div>
    </template>
  </div>
</template>

<script>
import BMap from "BMap";
export default {
  name: "hosital",
  created() {},
  data() {
    return {
      List: [],
      status: "",
      params: {
        pageSize: 20,
        pageNum: 1,
        akb021: "",
        // lng: 120.158772, //电脑上测试使用
        // lat: 30.2753 //电脑上测试使用
      },
      allLoaded: true,
      height: window.innerHeight - 50 + "px",
      isShow:true
    };
  },
  filters: {
    subStr: function(value) {
      if (value.length > 17) {
        return value.substr(0, 16) + "...";
      } else {
        return value;
      }
    }
  },
  methods: {
    //获取医院列表
    getList() {
      if (!this.params.lng || !this.params.lat) {
        this.$messagebox.alert("暂未获取当前位置的经纬度").then(() => {
          this.$router.go(-1);
        });
        return;
      }
      this.$http.post("/msc/account/open", this.params).then(res => {
        if (res.success) {
          if (res.body.length > 0) {
            this.List = [...this.List, ...res.body];
            if (res.body[0].totalPage > this.params.pageNum) {
              this.params.pageNum += 1;
              this.allLoaded = false;
            }
            this.status = "1";
            sessionStorage.setItem("pointList", JSON.stringify(this.List));
            sessionStorage.setItem("params", JSON.stringify(this.params));
          } else {
            this.status = "-1";
          }
        } else {
          this.$messagebox.alert(res.message);
        }
      });
    },

    //点击查看详情
    check(item) {
      this.$router.push({
        path: "/hospital-info",
        query: { obj: JSON.stringify(item) }
      });
    },
    //搜索
    search() {
      this.allLoaded = true;
      this.List = [];
      this.params.pageNum = 1;
      this.getList();
      console.log(this.List)
      if(this.List.length!=0){
        this.isShow=true
      }else{
        this.isShow=false
      }
    },
    //清空输入框
    clear() {
      this.params.akb021 = "";
      console.log(333)
      console.log(this.params)
      console.log(this.List)
    },
    //获取当前位置
    getPosition() {
      this.$indicator.open();
      let _this = this;
      dsBridge.call("getLocation", res => {
        _this.$indicator.close();
        res = JSON.parse(res);
        console.log(res);
        if (res.success) {
          _this.params.lng = res.body.longitude;
          _this.params.lat = res.body.latitude;
          let point = new BMap.Point(_this.params.lng, _this.params.lat);
          //坐标转换完之后的回调函数
          function translateCallback(data) {
            if (data.status === 0) {
              _this.params.lng = data.points[0].lng;
              _this.params.lat = data.points[0].lat;
              sessionStorage.setItem("start", JSON.stringify(_this.params));
              _this.getList();
            }
          }
          setTimeout(function() {
            var convertor = new BMap.Convertor();
            var pointArr = [];
            pointArr.push(point);
            convertor.translate(pointArr, 3, 5, translateCallback);
          }, 10);
        } else {
          // _this.$messagebox.alert(res.message).then(() => {
          //   _this.$router.go(-1);
          // });
          _this.$http
            .get(
              "http://api.map.baidu.com/location/ip?ak=242c7ba3243ec5c2a8ff5f4e9d5ccd89&coor=gcj02"
            )
            .then(res => {
              console.log(res.content.point);
            });
        }
      });
    },
    //加载更多
    loadBottom() {
      if (!this.allLoaded) {
        console.log(this.allLoaded);
        this.getList();
      }
      this.allLoaded = true;
      this.$refs.loadmore.onBottomLoaded();
    }
  },
  mounted() {
    //如果有保存医院列表就从session里获取，没有就发起请求
    let List = JSON.parse(sessionStorage.getItem("pointList"));
    let params = JSON.parse(sessionStorage.getItem("params"));
    if (List) {
      this.List = List;
      this.status = '1';
      this.params = params;
      if (List.length > 9) {
        this.allLoaded = false;
      }
    } else {
      this.getPosition();
      // sessionStorage.setItem("start", JSON.stringify(this.params)); //电脑上测试使用
      // this.getList(); //电脑上测试使用
    }
  }
};
</script>
<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  padding: 10px 0.4rem;
}
input {
  flex: 0 0 auto;
  width: 7.7rem;
  height: 30px;
  padding-left: 30px;
  border-radius: 3px;
  border: 1px solid #dfdfdf;
  outline: none;
  box-sizing: border-box;
  background: #fff url("../../assets/icon/Group@2x.png") no-repeat 6px center;
  background-size: 18px 18px;
}
.search_icon {
  flex: 0 0 auto;
  position: relative;
  left: -0.666667rem;
  width: 0.533333rem;
  height: 20px;
  background: url("../../assets/icon/Shape_wrong@1.5x.png") no-repeat;
  background-size: 18px 18px;
}
button {
  flex: 0 0 auto;
  position: relative;
  left: -0.666667rem;
  width: 1.5rem;
  height: 30px;
  margin-left: 0.3rem;
  padding: 0;
  background: #3399ff;
  border: none;
  outline: none;
  border-radius: 3px;
  font-size: 14px;
  color: #fff;
}
.content {
  overflow: auto;
}
ul {
  list-style: none;
  background: #fff;
}
li {
  min-height: 45px;
  padding: 8px 10px 8px 15%;
  background: url("../../assets/icon/hosp.png") no-repeat 5px center;
  background-size: 10%;
  color: #333;
}
.name {
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.info {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #888;
  label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  span {
    flex: 0 0 auto;
    width: 3.2rem;
    text-align: right;
  }
}
.container {
  position: fixed;
  top: 50px;
  left: 0;
  bottom: 0;
  right: 0;
  background: #000;
  opacity: 0.3;
}

.footer {
  padding: 8px 0;
  background: #f2f2f2;
  font-size: 14px;
  text-align: center;
}

.pic_null {
  width: 150px;
  height: 125px;
  background: url("../../assets/icon/no_infor.png") no-repeat center;
  background-size: 100%;
  margin: 90px auto 20px auto;
}
.tip {
  font-size: 16px;
  color: #353535;
  text-align: center;
}
</style>
