<template>
  <div class="wap">
    <navbar :title="title"></navbar>
    <scroller class="wap" show-scrollbar="false" @loadmore="loadmore" loadmoreoffset="20">
      <div class="main">
        <div ref="mainImg" @appear="onappear" @disappear="ondisappear">
          <image class="imgcollage" :src="headImg" resize="cover" />
        </div>
        <div class="small-patch hg-row" v-for="(item,i) in boxes" :key="i" @click="openDetailByUrl('https:'+item.click_url,item.title)">
          <image class="patch-img" :src="item.pict_url+'_300x300q80s100.jpg_.webp'" resize="cover" />
          <div class="intro">
            <text class="intro-txt">{{item.title}}</text>
            <div class="price" style="margin-bottom: 30px;">
              <text class="sell-txt">单买价{{item.orig_price}}</text>
              <text class="sold-num">售{{item.sell_num}}</text>
            </div>
            <div class="price">
              <text class="sell-num">{{item.jdd_num}}人拼团价</text>
            </div>
            <div class="case">
              <div class="price">
                <!-- <text class="symbol">￥</text> -->
                <text class="number">{{item.jdd_price}}</text>
              </div>
              <text class="quan-text">去拼团&gt;</text>
            </div>
          </div>
        </div>
      </div>
      <text class="back-top" v-if="goTop && tabIndex == 2" @click="backTop">&uarr;</text>
    </scroller>
  </div>
</template>

<script>
const storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");
import Navbar from 'base/navbar.vue'
import Util from "common/js/util"
import { COLLAGE, spellGroupType } from 'common/js/icon-type'

export default {
  components: { Navbar },
  mixins: [Util],
  data() {
    return {
      title:'拼团',
      headImg: COLLAGE,
      type: "default",
      need_mask: true,
      pageNo: 1,
      pageSize: 30,
      loadShow: false,
      boxes: [],
      goTop: false,
      m_id: ''
    };
  },
  created(){
    // this.headImg = headImg.collageImg
    this.m_id = spellGroupType[0].m_id
    this.getData(this.m_id);
  },
  methods: {
    getData(materialId) {
      this.loadShow = false;
      let params = {
        materialId: materialId,
        pageno: this.pageNo,
        pagesize: this.pageSize
      }
      this.post('appapi', 'dgMaterial', params, res => {
        console.log('e',res)
        if(res || res.result_list || res.result_list.map_data){
          this.boxes = this.boxes.concat(res.result_list.map_data);
          this.pageNo ++
        }else {
          if (this.pageNo == 1) {
            modal.toast({ message: "拼团活动暂时未开始" });
          } else {
            modal.toast({ message: "没有数据了" });
          }
        }
        this.loadShow = false;
      });
    },
    backTop(){
      this.dom = weex.requireModule('dom')
      this.dom.scrollToElement(this.$refs.mainImg, {})
      this.goTop = false
    },
    onappear(e){
      this.goTop = false
    },
    ondisappear(e){
      this.goTop = true
    },
    loadmore(e) {
      this.getData(this.m_id);
    }
  }
};
</script>


<style scoped>
.wap {
  background-color: #d61e33;
}

.hg-row {
  flex-direction: row;
}

.imgcollage {
  width: 750px;
  height: 400px;
  background-color: #eee;
  margin-bottom: 20px;
}
.main {
  width: 750px;
  flex-direction: column;
  flex-wrap: wrap;
  /* background-color: #FFFFFF; */
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
  width: 710px;
  background-color: #ffffff;
  padding-top: 20px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 20px;
  margin-left: 20px;
  margin-bottom: 20px;
  border-radius: 20px;
}
.patch-img {
  width: 220px;
  height: 220px;
  margin-right: 20px;
  background-color: #eee;
}
.intro {
  width: 400px;
}
.intro-txt {
  lines: 1;
  font-size: 28px;
  color: #333333;
  font-weight: 400;
  line-height: 40px;
  height: 40px;
  text-overflow: ellipsis;
  margin-bottom: 5px;
}
.case {
  flex-direction: row;
  justify-content: space-between;
  height: 50px;
}
.price {
  flex-direction: row;
  height: 40px;
}
.symbol {
  font-size: 18px;
  color: #f24561;
  font-weight: 400;
  line-height: 30px;
  margin-top: 5px;
}
.number {
  font-size: 34px;
  color: #f24561;
  font-weight: 400;
  line-height: 50px;
  height: 50px;
}
.quan-text {
  font-size: 24px;
  color: #ffffff;
  font-weight: 400;
  line-height: 50px;
  height: 50px;
  background-color: #f24561;
  width: 140px;
  text-align: center;
  border-radius: 50px;
}
.sell-txt {
  font-size: 22px;
  color: #999999;
  font-weight: 400;
  line-height: 40px;
}
.sell-num {
  font-size: 22px;
  color: #f24561;
  font-weight: 400;
  line-height: 40px;
}
.sold-num {
  margin-left: 10px;
  font-size: 22px;
  color: #ff7d49;
  font-weight: 400;
  line-height: 40px;
}
.back-top{
  width: 76px;
  height: 76px;
  line-height: 76px;
  text-align: center;
  border-radius: 38px;
  background-color: rgba(255, 255, 255, 0.9);
  position: fixed;
  right: 25px;
  bottom: 130px;
  font-size: 28px;
  color: #f24561;
  border-width: 1px;
  border-style: solid;
  border-color: #777777;
}
</style>
