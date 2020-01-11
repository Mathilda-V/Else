<template>
  <div class="jimi">
    <navbar :title="tilte"></navbar>
    <scroller show-scrollbar="false" class="wrapper" @loadmore="loadmore" loadmoreoffset="500" offset-accuracy="10">
      <div class="main">
        <div class="patch flex-row white-w space-b" v-for="goods in goodsList" :key="goods.id" @click="openDetailX5(goods)">
          <image class="patch-img" :src="goods.pict_url+'_200x200q80s100.jpg_.webp'" resize="cover" style="width:220px;height:220px" />
          <div class="intro space-l rel">
            <div class="title-con">
              <text class="intro-txt line-2 normal-black">{{goods.title}}</text>
            </div>
            <div class="cbse row">
              <div class="block-red center space-r space-b" v-if="goods.is_free_shopping == '1'">
                <text class="small-white">包邮</text>
              </div>
            </div>
            <div class="cbse btw flex-row-end abs abs-bottom">
              <div class="flex-row-end">
                <text class="small-gray">市场参考价:￥</text>
                <div class="flex-row-end rel price">
                  <text class="number big-red rel integer">{{goods.zk_final_price | keepInteger}}</text>
                  <text class="big-red symbol">{{goods.zk_final_price | keepDecimal}}</text>
                </div>
              </div>
              <text class="sell-txt small-gray">兑换: {{goods.volume}}</text>
            </div>
          </div>
        </div>
      </div>
    </scroller>
  </div>
</template>
<script>
const storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");
import Navbar from 'base/navbar'
import Util from "common/js/util"
import { keepInteger, keepDecimal } from 'common/js/filters'

export default {
  components: {Navbar},
  mixins: [Util],
  filters: { keepInteger, keepDecimal },
  data(){
    return {
      tilte: '兑换商品',
      goodsList: [],
      pageIndex: 1,
      pageSize: 30
    }
  },
  created(){
    this.getSelfGoods();
  },
  methods: {
    getSelfGoods(){
      this.post('goods', 'getAllGoods', { page: this.pageIndex, size: this.pageSize }, res => {
        console.log('积米',res)
        if(res && res.success){
          this.goodsList = this.goodsList.concat(res.data)
          this.pageIndex++
        }
      })
    },
    openDetailX5(e) {
      var self = this
      storage.setItem("goodsDel", JSON.stringify({id:e.id}), e => {
        self.open('detailX5', 'true', () => {})
      });
    },
    loadmore(e) {
      this.getSelfGoods()
    }
  },
}
</script>
<style  lang="stylus" scoped>
@import '../common/stylus/layout.styl'
@import '../common/stylus/variable.styl'

.jimi{
  background-color: #f1f1f1;
}
.flex-row {
  flex-direction: row;
}
.flex-row-end {
  flex-direction: row;
  align-items: flex-end;
}
.main {
  background-color: #eeeeee;
}
.patch{
  
}
.intro {
  height: 220px;
}
.intro-txt {
  font-size: 26px;
  color: #333333;
  font-weight: 400;
  max-width: 480px;
  height: 80px;
  margin-bottom: 15px;
}
.cbse{
  width: 480px;
  flex-wrap: wrap;
}
.block-red{
  padding: 2px 10px;
  background-color: #e5345f;
  border-radius: 4px;
}
.abs-bottom{
  left: 0;
  bottom: 10px;  
}
.price{
  top: 4px;
}
.symbol,.number {
}
.symbol{
  font-size: 26px;
}
.integer{
  top: 2px;
}
</style>

