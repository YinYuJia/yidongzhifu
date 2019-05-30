<template>
  <div>
    <div class="container" v-if="status === '1'" :style="{height:height}">
      <mt-loadmore
        :bottom-method="loadBottom"
        :bottom-all-loaded="allLoaded"
        ref="loadmore"
      >
        <ul>
          <li v-for="(item, index) in List" :key="index" class="border_bottom" @click="check(item)">
            <div class="item1">
              <label>{{ item.title }}</label>
              <span>{{ item.createTime | time }}</span>
            </div>
            <div class="item2">{{ item.content }}</div>
          </li>
        </ul>
        <!-- <div class="footer" v-if="List.length < 20 && List.length > 0">没有更多数据了~</div> -->
      </mt-loadmore>
    </div>
    <div v-if="status === '-1'">
      <div class="pic_null"></div>
      <div class="tip">暂无消息~</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "message",
  data() {
    return {
      status: "",
      List: [],
      height: window.innerHeight + "px",
      allLoaded: true,
      pageNumber: 1,
      pageSize: 20,
      user: {}
    };
  },
  created() {
    this.user = this.util.getUser();
    this.getList();
  },
  filters: {
    time(val) {
      if (!val) return;
      return new Date(val).Format("yyyy-MM-dd hh:mm:ss");
    }
  },
  methods: {
    getList() {
      this.$http
        .post("/msc/news/myNews", {
          pageSize: this.pageSize,
          pageNumber: this.pageNumber,
          aac002: this.user.idNo
        })
        .then(res => {
          if (res.success) {
            if (res.body.list.length > 0) {
              this.List = [...this.List, ...res.body.list];
              this.status = "1";
              if (res.body.totalPage > this.pageNumber) {
                this.pageNumber += 1;
                this.allLoaded = false;
              } else {
                this.allLoaded = true;
              }
            } else {
              this.status = "-1";
            }
          } else {
            this.$messagebox.alert(res.message).then(() => {
              this.$router.go(-1);
            });
          }
        });
    },
    loadBottom() {
      if (!this.allLoaded) {
        this.getList();
      }
      this.allLoaded = true;
      this.$refs.loadmore.onBottomLoaded();
    },
    check(item) {
      if (item.pushUrl.indexOf("medicalGuide") > 0) {
        let context = this.util.urlParam(item.pushUrl, "context");
        let direct = this.util.urlParam(item.pushUrl, "direct");
        this.$router.push({
          path: "/medicalGuide",
          query: { context: context, direct: direct }
        });
      } else if (item.pushUrl.indexOf("payList") > 0) {
        this.$router.push("payOrder");
        sessionStorage.setItem("itemPage", "payList");
      } else if (item.pushUrl.indexOf("historyList") > 0) {
        this.$router.push("payOrder");
        sessionStorage.setItem("itemPage", "historyList");
      } else if (item.pushUrl.indexOf("refund") > 0) {
        this.$router.push("payOrder");
        sessionStorage.setItem("itemPage", "refund");
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.container {
  overflow: auto;
}
ul {
  background: #fff;
  font-size: 15px;
  li {
    padding: 10px 0.6rem 10px 0.4rem;
    background: url("../../assets/icon/icon-choose.png") no-repeat 9.6rem center;
    background-size: 9px auto;
    .item1 {
      display: flex;
      align-items: center;
      label {
        flex: 0 0 auto;
        width: 4rem;
      }
      span {
        flex: 1;
        text-align: right;
        font-size: 13px;
      }
    }
    .item2 {
      margin-top: 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 13px;
      color: #888;
    }
  }
}
.footer {
  padding: 8px 0;
  background: #f2f2f2;
  font-size: 14px;
  text-align: center;
}
.pic_null {
  width: 150px;
  height: 152px;
  background: url("../../assets/icon/icon-null.png") no-repeat center;
  background-size: 100%;
  margin: 90px auto 30px auto;
}
.tip {
  font-size: 16px;
  color: #353535;
  text-align: center;
}
</style>
