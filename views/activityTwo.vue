<template>
  <div>
    <navbar :title="title"></navbar>
    <!-- 列表一 -->
    <list class="list" show-scrollbar="false" @loadmore="loadmore" ref="scroller">
      <cell>
        <slider class="slider" interval="6000" auto-play="true" style="width:750px;height:300px">
          <div class="slide-box"  >
            <image :src="headImg" resize="cover" style="width:750px;height:300px;background-color:#eee;"/>
          </div>
        </slider>
      </cell>  
      
      <cell class="cell flex-row"  style="background-color:#F82D2D;">
        <div :class="['A-image-box',(i+1)%3==0?'':'paddingRight']" v-for="(item,i) in list" :key="i" @click="toDetail(item)">
          <image class="A-image" :src="item.pict_url+'_200x200q80s100.jpg_.webp'" resize="contain"/>
          <div class="coupon">
            <text class="coupon-text">优惠券</text>
            <text class="coupon-num">{{item.coupon_info | getCoupon}}</text>
          </div>
          <div class="flex-row space" >
            <text class="A-text">到手价</text>
            <div style="flex-direction:row;">
              <text class="symbol">￥</text>
              <text class="A-price">{{item.coupon_info,item.zk_final_price | getMoney}}</text>
            </div>
          </div> 
        </div>
      </cell>
    </list>
    <load :show="loadShow"></load>
  </div>
</template>

<script>
const storage = weex.requireModule("storage");
import Util from "common/js/util"
import Navbar from 'base/navbar'
import Load from 'base/load'
import { NEW_PEOPLE } from 'common/js/icon-type'
import { toFixed,getMoney,getCoupon } from 'common/js/filters'

export default {
  components: { Navbar, Load },
  mixins: [Util],
  filters: { toFixed,getMoney,getCoupon },
  data() {
    return {
      title: '新人见面礼',
      headImg: NEW_PEOPLE,
      loadShow: true,
      list: [],
      pageNo: 1,
      pageSize: 30
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData(){
      let params = {
        endPrice : '100',
        startPrice: '1',
        pageno: this.pageNo,
        pagesize: this.pageSize
      }
      this.post('appapi', 'material', params, res => {
        // console.log('新人',res)
        this.loadShow = false
        if(!res){
          console.log('请求错误')
          return
        }
        if (this.pageNo == 1) {
          Vue.set(this, 'list', res)
        } else {
          this.$refs.scroller.resetLoadmore();
          this.list = this.list.concat(res);
        }
        this.pageNo++;
      })
    },
    toDetail(goods){
      storage.setItem("goodsDetail", JSON.stringify(goods), e => {
        this.open("detail", "true", () => {});
      });
    },
    loadmore(){
      console.log('111')
      this.list.length && this.getData()
    }
  }
}        
</script>
<style scoped>
.flex-row {
  flex-direction: row;
  align-items: center;
}
.flex-column {
  flex-direction: column;
  align-items: center;
}
.space{
  justify-content: space-between;
  width: 200px;
  margin-top: 10px;
}
/* 列表 */
.cell {
    width: 750px;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
    flex-wrap: wrap;
  }
  .A-text{
    width: 80px;
    height: 30px;
    border-radius: 8px;
    background-color: #ec2453;
    font-size: 22px;
    line-height: 30px;
    color: #ffffff;
    text-align: center;
  }
  .A-price {
    color: #333333;
    font-size: 28px;
    line-height: 30px;
  }
  .symbol{
    position: relative;
    top: 5px;
    color: #333333;
    font-size: 20px;
  }
  .A-image-box {
    width: 230px;
    padding: 15px;
    background-color: #eee;
    margin-bottom: 10px;
    justify-content: center;
    align-items: center;
    position: relative;
    border-radius: 4px;
  }
  .paddingRight{
    margin-right: 10px;
  }
  .coupon{
    position: absolute;
    top: 0;
    right: 0;
    width: 80px;
    height: 90px;
    background-color: #ec2453;
    text-align: center;
    border-bottom-left-radius: 40px;
    border-bottom-right-radius: 40px;
    align-items: center;
  }
  .coupon-num{
    font-size: 30px;
    color: #ffffff;
    line-height: 50px;
    height: 50px;
  }
  .coupon-text{
    font-size: 20px;
    color: #fff;
    line-height: 39px;
    height: 39px;
    border-bottom-style: dashed;
    border-bottom-width: 1px;
    border-bottom-color: yellow;
  }
  .A-image {
    width: 200px;
    height: 200px;
    background-color: #eee;
  }
   
</style>

