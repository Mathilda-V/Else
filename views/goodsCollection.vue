<template>
  <div class="goods-collection">
    <navbar :title="title"></navbar>
    <scroller show-scrollbar="false" class="wrapper">
      <div>
        <scroller show-scrollbar="false" scroll-direction="horizontal" v-for="(item, index) in collectList"  :key="item.num_iid" class="goods-wrapper">
          <div class="goods-item">
            <div 
              class="small-goods row" 
              @click="goDetail(item)" 
              :ref="'item'+index"
            >
              <image class="goods-img" resize="contain" :src="item.pict_url + '_100x100q80s100.jpg_.webp'"></image>
              <div class="intro">
                <div class="title-con">
                  <image class="mall-icon" resize="contain" :src="item.imgUrl"></image>
                  <text class="intro-txt">&emsp;&emsp;&ensp;{{item.title}}</text>
                </div>
                <div>
                  <div class="between">
                    <text class="coupon" v-if="item.coupon_info != '0'">{{item.coupon_info}}元券</text>
                    <text v-else></text>
                    <text class="sell-txt">已售: {{item.volume}}</text>
                  </div>
                  <div class="row cbse" v-if="item.coupon_info != '0'">
                    <div class="row">
                      <text class="symbol">￥</text>
                      <text class="number">{{item.zk_final_price - item.coupon_info | toFixed}}</text>
                    </div>
                    <text class="oldpr">{{item.zk_final_price}}</text>
                  </div>
                  <div class="row cbse" v-else>
                    <div class="row">
                      <text class="symbol">￥</text>
                      <text class="number">{{item.zk_final_price}}</text>
                    </div>
                    <text class="oldpr">{{item.reserve_price}}</text>
                  </div>
                </div>
              </div>
            </div>
            <text class="delete-item" @click="deleteItem(item.num_iid, index)">删除</text>
          </div>
        </scroller>
      </div>
      <div class="no-item" v-if="!collectList.length">
        <text class="gray-big">我的收藏，空空如也</text>
      </div>
      <!-- <div class="recommend">
        <text class="recommend-title">超值宝贝推荐</text>
        <div class="recommend-con row">
          <div class="small-patch left">
            <image class="patch-img" src="" resize="contain" style="width:360px;height:360px" />
            <div class="patch-intro">
              <div class="intro-con">
                <image src="" class="mall-icon" resize="contain"></image>
                <text class="intro-txt con-txt">&emsp;&emsp;&ensp;好利来冰山熔岩巧克力纯可可脂甜品糕点点心</text>
              </div>
              <div class="between">
                <text class="sell-txxt">10元券</text>
                <text class="sell-txt">999已买</text>
              </div>
              <div class="row cbse">
                <text class="symbol">￥</text>
                <text class="number">33.00</text>
                <text class="oldpr">33.00</text>
              </div>
            </div>
          </div>
          <div class="small-patch right">
            <image class="patch-img" src="" resize="contain" style="width:360px;height:360px" />
            <div class="patch-intro">
              <div class="intro-con">
                <image src="" class="mall-icon" resize="contain"></image>
                <text class="intro-txt con-txt">&emsp;&emsp;&ensp;好利来冰山熔岩巧克力纯可可脂甜品糕点点心</text>
              </div>
              <div class="between">
                <text class="sell-txxt">10元券</text>
                <text class="sell-txt">999已买</text>
              </div>
              <div class="row cbse">
                <text class="symbol">￥</text>
                <text class="number">33.00</text>
                <text class="oldpr">33.00</text>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </scroller>
  </div>
</template>
<script>
const storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");
const animation = weex.requireModule('animation')
import navbar from 'base/navbar'
import Util from "common/js/util"
import { mallType } from 'common/js/icon-type'
export default {
  mixins: [Util],
  data() {
    return {
      title: '我的收藏',
      collectList: [],
      pageIndex: 1,
      pageSize: 20
    }
  },
  filters: {
    toFixed(num) {
      return parseFloat(num).toFixed(2);
    }
  },
  created() {
    this.getCollectList()
  },
  methods: {
    getCollectList(){
      this.post('collection', 'collectionSel', {page: this.pageIndex, size: this.pageSize}, res => {
        if(res.success){
          this.collectList = res.data
          this.collectList.forEach(item => {
            item.small_images = {string: item.small_images.split(',')}
            item.imgUrl = item.user_type == '1' ? mallType[0] : mallType[1]
          })
          console.log(this.collectList)
        }
      })
    },
    goDetail(goods){
      storage.setItem('goodsDetail', JSON.stringify(goods), e => {
        this.open('detail', 'true', () => {})
      })
    },
    deleteItem(id, index){
      this.post('collection', 'collectionDel', {num_iid: id}, res => {
        // console.log(res)
        if(res.success){
          this.collectList.splice(index, 1)
          this.post('collection', 'getGoodNumiid', {}, response => {
            // console.log(response)
            response.success 
            ? storage.setItem('collectId', JSON.stringify(response.data))
            : storage.setItem('collectId', JSON.stringify([]))
          })
        }
        modal.toast({message: res.message})
      })
    }
  },
  components: { navbar }
}
</script>
<style scoped>
.row {
  flex-direction: row;
}
.between {
  flex-direction: row;
  justify-content: space-between;
}
.gray-big{
  font-size: 36px;
  font-weight: 300;
  color: #666666;
}

.goods-collection {
  background-color: #f1f1f1;
}
/* 商品收藏 */
.no-item{
  width: 750px;
  height: 1200px;
  align-items: center;
  justify-content: center;
}
.goods-wrapper{
  height: 240px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #eeeeee;
}
.goods-item{
  width: 910px;
  flex-direction: row;
}
.small-goods {
  padding: 20px;
  background-color: #ffffff;
}
.delete-item{
  width: 160px;
  height: 240px;
  line-height: 240px;
  font-size: 28px;
  color: #ffffff;
  background-color: #f24561;
  text-align: center;
} 
.goods-img {
  width: 200px;
  height: 200px;
  background-color: #eee;
}
.intro {
  flex-direction: column;
  justify-content: space-between;
  width: 510px;
  height: 200px;
  padding-left: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.title-con {
  position: relative;
  flex-direction: row;
  align-items: center;
}
.mall-icon {
  height: 24px;
  width: 50px;
  position: absolute;
  top: 0;
}
.intro-txt {
  lines: 2;
  font-size: 24px;
  color: #333333;
  font-weight: 400;
  line-height: 30px;
  max-width: 490px;
  height: 60px;
  text-overflow: ellipsis;
}
.oldpr {
  font-size: 20px;
  color: #999999;
  font-weight: 400;
  line-height: 30px;
  text-decoration: line-through;
  margin-top: 3px;
}
.sell-txt {
  font-size: 20px;
  color: #999999;
  font-weight: 400;
  line-height: 30px;
  margin-top: 3px;
}
.cbse {
  margin-top: 10px;
}
.coupon {
  width: 107px;
  height: 30px;
  text-align: center;
  font-size: 22px;
  color: #fff;
  font-weight: 400;
  line-height: 30px;
  background-image: linear-gradient(
    to left,
    rgba(252, 52, 52, 1),
    rgba(252, 52, 156, 1)
  );
  border-radius: 15px;
  margin-right: 15px;
}
.symbol {
  font-size: 20px;
  color: #f24561;
  font-weight: 400;
  line-height: 30px;
  margin-top: 5px;
}
.number {
  font-size: 30px;
  color: #f24561;
  font-weight: 400;
  line-height: 30px;
  margin-right: 5px;
}
/* 超值宝贝推荐 */
.recommend {
  flex-direction: column;
  width: 750px;
}
.recommend-title {
  padding: 20px;
  text-align: center;
  color: #333333;
  font-size: 28px;
}
.recommend-con {
  flex-wrap: wrap;
}
.small-patch {
  width: 375px;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: #eeeeee;
}
.left {
  padding-left: 10px;
  padding-right: 5px;
  padding-bottom: 10px;
}
.right {
  padding-left: 5px;
  padding-right: 10px;
  padding-bottom: 10px;
}
.patch-img {
  background-color: #eeeeee;
  border-radius: 4px;
}
.patch-intro {
  padding-left: 10px;
  padding-right: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: #ffffff;
}
.intro-con {
  position: relative;
  flex-direction: row;
  align-items: center;
}
.con-txt {
  max-width: 325px;
  margin-bottom: 10px;
}
.sell-txxt {
  font-size: 22px;
  color: #fff;
  font-weight: 400;
  line-height: 30px;
  background-color: #e5345f;
  border-radius: 2px;
  padding: 0 5px;
}
</style>