<template>
  <div class="wap">
    <navbar :title="title" :rightUrl="searchIconWhite" @rightClick="openSearchList"></navbar>
    <div class="sort" v-if="recom?false:true">
      <div style="flex:1;flex-direction: row;justify-content: center;" v-for="(e,i) in tabList" :key="i" @click="tabItem(i)">
        <div :class="['block']">
          <text :class="['text',tabIndex==i?'border':'']">{{e.text}}</text>
          <image class="image" v-if="e.url?true:false" :src="e.url" resize="contain" />
        </div>
      </div>
    </div>
    <list 
      class="list" 
      show-scrollbar="true" 
      @loadmore="loadmore" 
      loadmoreoffset="40" 
      ref="scroller" 
      v-if="boxes.length"
    >
      <cell class="cell" v-for="(item,i) in boxes" :key="i" @click="opendetail(item)">
        <div class="A-image-box">
          <image class="A-image" :src="item.pict_url+'_200x200q80s100.jpg_.webp'" resize="contain" />
          <div class="A-tit">
            <div class="title-con">
              <image v-if="item.imgUrl" :src="item.imgUrl" class="mall-icon" resize="contain"></image>
              <text class="intro-txt">&emsp;&emsp;{{item.title}}</text>
            </div>
            <div class="A-parameter">
              <div class="hg-row">
                <text class="A-price">原价 ￥{{item.zk_final_price}}</text>
              </div>
              <div class="hg-row">
                <text class="sell-txxt" style="">{{item.coupon_info | getCoupon}}元券</text>
              </div>
            </div>
            <div class="A-parameter">
              <div class="hg-row">
                <text class="symbol">￥</text>
                <text class="A-vp">{{item.coupon_info,item.zk_final_price | getMoney | keepInteger}}</text>
                <text class="A-vp decimal">{{item.zk_final_price  | keepDecimal}}</text>
              </div>
              <text class="A-sold">售:{{item.volume}}</text>
            </div>
          </div>
        </div>
      </cell>
    </list>
    <div class="no-result" v-if="boxes.length == 0 && !loadShow">
      <text class="gray-big">什么都没有搜到</text>
      <text class="back-btn" @click="back">点此返回</text>
    </div>
    <load :show="loadShow"></load>
  </div>
</template>

<script>
const storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");
import Navbar from "base/navbar";
import Util from "common/js/util";
import Load from 'base/load'
import { mallType, SEARCH_ICON_WHITE, SORT_ARROW } from "common/js/icon-type";
import { toFixed, keepInteger, keepDecimal, getCoupon } from "common/js/filters";

export default {
  components: { Navbar, Load },
  mixins: [Util],
  data() {
    return {
      searchIconWhite: SEARCH_ICON_WHITE,
      title: "搜券",
      tabList: [
        { text: "最新", url: "" },
        {
          text: "价格",
          url: SORT_ARROW[0]
        },
        { text: "销量", url: "" }
      ],
      tabIndex: 0,
      tabFlag: false,
      priceFlag: false,
      flag: true,
      stext: {
        text: ""
      },
      cid: "",
      sort: "",
      pageNo: 1,
      pageSize: 40,
      loadShow: true,
      boxes: [],
      recom: true //判断是否从首页今日推荐过来  临时
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
        console.log(e);
        let data = JSON.parse(e.data);
        if (data.hasOwnProperty("con")) {

          self.title = data.con;
          self.recommend();
          self.recom = true;
          return;
        }
        self.recom = false;
        if (data.hasOwnProperty("cate")) {
          self.cid = data.cate.cid;
          self.title = data.cate.name;
        }
        if(data.kw){
          self.title = data.kw
        }
        Vue.set(self.stext, "text", data.kw);
        self.getData();
      });
    }
  },
  methods: {
    tabItem(i) {
      this.flag = false;
      this.pageNo = 1;
      this.tabIndex = i;
      Vue.set(this, "boxes", []);
      switch (i) {
        case 1:
          if (this.priceFlag) {
            this.sort = "price_asc";
            this.tabList[1].url = SORT_ARROW[2];
          } else {
            this.sort = "price_des";
            this.tabList[1].url =SORT_ARROW[1];
          }
          this.priceFlag = !this.priceFlag;
          break;
        case 2:
          this.sort = "total_sales_des";
          this.tabList[1].url = SORT_ARROW[0];
          this.priceFlag = false;
          break;
        default:
          this.tabList[1].url = SORT_ARROW[0];
          this.sort = "";
          this.priceFlag = false;
      }
      this.getData();
    },
    getData() {
      const vm = this;
      let params = {
        kw: encodeURI(vm.stext.text),
        cid: vm.cid,
        pagesize: vm.pageSize,
        pageno: vm.pageNo,
        deviceType: "UTDID",
        deviceValue: vm.getUniq(),
        sort: vm.sort
      };
      this.post("appapi", "material", params, data => {
        vm.loadShow = false;
        if (data == undefined) {
          vm.recommend()
          return;
        }
        if (Array.isArray(data)) {
          data.forEach(item => {
            item.imgUrl = item.user_type == "1" ? mallType[0] : mallType[1];
          });
        } else {
          data.imgUrl = data.user_type == "1" ? mallType[0] : mallType[1];
          vm.boxes.push(data)
          vm.pageNo++;
          return;
        }
        if (vm.pageNo == 1) {
          Vue.set(vm, "boxes", data);
          if (!vm.flag) {
            // vm.$refs.scroller.resetLoadmore();
          }
        } else {
          vm.boxes = vm.boxes.concat(data);
        }
        vm.pageNo++;
      });
    },
    recommend() {
      const vm = this;
      this.post(
        "appapi",
        "getcouponitemlist",
        {
          kw: encodeURI(vm.stext.text),
          cid: "",
          pagesize: vm.pageSize,
          pageno: vm.pageNo
        },
        function(data) {
          console.log(data);
          vm.loadShow = false;
          if (
            data.err ||
            !data.results ||
            !data.results.tbk_coupon ||
            data.hasOwnProperty("results") == false
          ) {
            return;
          }
          if (Array.isArray(data.results.tbk_coupon)) {
            data.results.tbk_coupon.forEach(item => {
              item.imgUrl = item.user_type == "1" ? mallType[0] : mallType[1];
            });
          } else {
            data.results.tbk_coupon.imgUrl =
              data.results.tbk_coupon.user_type == "1"
                ? mallType[0]
                : mallType[1];
          }
          vm.boxes = vm.boxes.concat(data.results.tbk_coupon);
          vm.pageNo++;
        }
      );
    },
    loadmore(e) {
      if (this.recom) {
        this.recommend();
        return;
      }
      this.getData();
    },
    opendetail(o) {
      var self = this;
      storage.setItem("goodsDetail", JSON.stringify(o), e => {
        self.open("detail", "true", function(event) {});
      });
    },
    back() {
      this.close("true");
    },
    openSearchList() {
      if(this.recom == true){
        this.close("true",e=>{
          this.open("searchList", "true", function(event) {});
        });
      }else{
        this.back();
      }
      
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
.gray-big {
  font-size: 36px;
  font-weight: 300;
  color: #666666;
}
.list {
  width: 750px;
}
.no-result {
  width: 750px;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-bottom: 120px;
}
.back-btn {
  width: 150px;
  height: 70px;
  line-height: 70px;
  text-align: center;
  background-color: #ffffff;
  color: #666666;
  font-size: 24px;
  margin-top: 30px;
}
.cell {
  border-top-style: solid;
  border-top-width: 10px;
  border-top-color: #f1f1f1;
  background-color: white;
}

.A-tit {
  width: 490px;
  margin-left: 10px;
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
  font-size: 22px;
  line-height: 30px;
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
  color: #e5345f;
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
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
}

.A-parameter {
  margin-top: 10px;
}
.A-image {
  width: 200px;
  height: 200px;
  background-color: #eee;
}

.A-vp-box {
  width: 90px;
  height: 40px;
  position: absolute;
  bottom: 0;
  right: 0;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, .02); */
}
.sell-txxt {
  font-size: 22px;
  color: #fff;
  font-weight: 400;
  height: 40px;
  line-height: 40px;
  background-image: linear-gradient(to left, #e5345f, #ff7d49);
  border-radius: 4px;
  padding: 0 20px;
}
.mall-icon {
  height: 30px;
  width: 60px;
  position: absolute;
  top: 7px;
  left: 0;
}
.intro-txt {
  lines: 2;
  font-size: 30px;
  color: #333333;
  font-weight: 400;
  line-height: 45px;
  height: 90px;
  text-overflow: ellipsis;
  margin-bottom: 10px;
}
/*  tab*/
.sort {
  width: 750px;
  height: 80px;
  flex-direction: row;
  background-color: #ffffff;
}
.block {
  width: 150px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.border {
  color: #e5345f;
  font-weight: 400;
}
.text {
  font-size: 28px;
  color: #999;
}
.image {
  width: 40px;
  height: 40px;
  /* background-color: blue; */
}
.decimal {
  margin-top: 5px;
  margin-right: 5px;
  font-size: 24px;
}
.symbol {
  margin-top: 5px;
  font-size: 20px;
  color: #e5345f;
}
</style>
