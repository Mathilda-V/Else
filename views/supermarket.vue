<template>
  <div class="wap">
    <navbar title="天猫超市"></navbar>
    <scroller show-scrollbar="false" @loadmore="loadmore" loadmoreoffset="10">
      <div class="main">
        <div class="small-patch" v-for="(item,i) in boxes" :key="i" @click="opendetail(item)">
          <image class="patch-img" :src="item.pict_url+'_300x300q80s100.jpg_.webp'" resize="cover" style="width:220px;height:220px" />
          <div class="intro">
            <text class="intro-txt">{{item.title}}</text>
            <div class="case">
              <div style="flex-direction: row;justify-content: space-between;">
                <div class="sell">
                  <text class="sell-txt" style="text-decoration: line-through;">原价{{item.zk_final_price}}</text>
                </div>
                <div class="sell">
                  <text class="sell-txt">月销{{item.volume}}</text>
                </div>
              </div>
              <div style="flex-direction: row;justify-content: space-between;">
                <div class="price">
                  <text class="symbol">￥</text>
                  <text class="number">{{item.coupon_info,item.zk_final_price | getMoney}}</text>
                </div>
                <div class="quan-sell">
                  <image resize="contain" :src="couponStyle" style="width:28px;height:28px;" />
                  <text class="quan-text">{{item.coupon_info | getCoupon}}</text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
const storage = weex.requireModule("storage");
import Navbar from 'base/navbar'
import Util from "common/js/util"
import { COUPON_STYLE } from 'common/js/icon-type'

export default {
  components: {
    Navbar
  },
  mixins: [Util],
  data() {
    return {
      couponStyle: COUPON_STYLE,
      stext: {
        text: ""
      },
      type: "default",
      need_mask: true,
      pageNo: 1,
      pageSize: 36,
      loadShow: false,
      boxes: []
    };
  },
  created() {
    var self = this;
    if (weex.config.env.platform == "Web") {
      var key = localStorage.getItem("searchkey");
      self.stext.text = key;
      self.getData();
    } else {
      storage.getItem("searchkey", e => {
        // console.log(e);
        Vue.set(self.stext, "text", e.data);
        self.getData();
      });
    }
  },

  methods: {
    getData() {
      const vm = this;
      vm.loadShow = true;
      // console.log(vm.stext.text);
      this.post(
        "appapi",
        "getcouponitemlist", {
          kw: vm.stext.text,
          cid: "",
          pagesize: vm.pageSize,
          pageno: vm.pageNo
        },
        function (data) {
          console.log(data);
          if (data.err) {
            return;
          }
          vm.boxes = vm.boxes.concat(data.results.tbk_coupon);
          vm.pageNo++;
          vm.loadShow = false;
        }
      );
    },
    loadmore(e) {
      this.getData();
    },
    opendetail(o) {
      var self = this
      storage.setItem("goodsDetail", JSON.stringify(o), e => {
        self.open("detail", "true", function (event) { });
      });

    }
  }
};
</script>


<style scoped>
.wap {
  background-color: #f1f1f1;
}

.hg-row {
  flex-direction: row;
}

.list {
  width: 730px;
  margin: 10px;
  border-radius: 8px;
}

.cell {
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
  overflow: hidden;
  border-bottom-style: solid;
  border-bottom-width: 10px;
  border-bottom-color: #f1f1f1;
  background-color: white;
}

.A-tit {
  width: 500px;
}

.A-title {
  height: 90px;
  font-size: 30px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 10px;
  lines: 2;
  text-overflow: ellipsis;
}

.A-sold {
  padding-left: 20px;
}

.A-price,
.A-sold {
  color: #999;
  font-size: 24px;
  line-height: 40px;
}

.A-price {
  text-decoration: line-through;
}

.A-vpbox {
  height: 40px;
  line-height: 40px;
  flex-direction: row;
  justify-content: flex-start;
}

.A-sold {
  line-height: 40px;
}

.A-vp {
  height: 40px;
  line-height: 40px;
  font-size: 34px;
  color: #ff7944;
  font-weight: 500;
}

.A-voucher {
  width: 90px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: white;
  font-size: 28px;
  font-weight: 500;
}

.A-image-box,
.A-parameter {
  flex-direction: row;
  justify-content: space-between;
}

.A-image-box {
  margin-top: 20px;
}

.A-parameter {
  margin-top: 15px;
  width: 490px;
}

.A-image {
  width: 200px;
  height: 200px;
}

.A-vp-box {
  width: 90px;
  height: 40px;
  position: absolute;
  bottom: 0;
  right: 0;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, .02); */
}

.main {
  width: 750px;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: #ffffff;
  margin-bottom: 10px;
}
.main-title {
  flex-direction: row;
}
.main-txt {
  font-size: 30px;
  color: #333333;
  font-weight: 400;
  line-height: 30px;
}
.sub-txt {
  font-size: 24px;
  color: #999999;
  font-weight: 400;
  line-height: 30px;
}
.small-patch {
  width: 250px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #eeeeee;
  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: #eeeeee;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
}
.patch-img {
  border-radius: 4px;
}
.intro {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
}
.intro-txt {
  lines: 2;
  font-size: 24px;
  color: #333333;
  font-weight: 400;
  line-height: 40px;
  height: 80px;
  text-overflow: ellipsis;
  margin-bottom: 20px;
}
.case {
  width: 220px;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 5px;
  margin-left: 10px;
  flex-direction: column;
}
.price {
  flex-direction: row;
}
.symbol {
  font-size: 20px;
  color: #666666;
  font-weight: 400;
  line-height: 30px;
  margin-top: 5px;
}
.number {
  font-size: 30px;
  color: #f24561;
  font-weight: 400;
  line-height: 30px;
}
.quan-sell {
  flex-direction: row;
  height: 28px;
  margin-top: 4px;
}
.quan-text {
  font-size: 20px;
  color: #666666;
  font-weight: 400;
  line-height: 30px;
  margin-left: 5px;
}
.sell-txt {
  font-size: 16px;
  color: #999999;
  font-weight: 400;
  line-height: 30px;
  margin-top: 5px;
}
</style>
