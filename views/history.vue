<template>
  <div class="history">
    <div>
      <div :style="{paddingTop:statusbarHeight+'px',backgroundColor:'#e5345f'}">
        <wxc-minibar class="history-navbar"
                  background-color="#e5345f">
          <image :src="arrowLeft" slot="left" style="width:60px;height:60px;" />
          <text class="titleColor titleStyle" slot="middle">{{title}}</text>
          <wxc-icon slot="right" name="delete" :icon-style="{fontSize: '40px',color:isDelete?'#aaaaaa':'#ffffff'}" @wxcIconClicked="iconClicked"></wxc-icon>
        </wxc-minibar>
      </div>
    </div>
    <scroller show-scrollbar="false" class="container" :style="{height:Height+'px',paddingBottom:isDelete?'180px':'0'}">
      <div v-if="history.length" class="history-items-box" v-for="(items, index1) in history" :key="'items'+index1">
        <div class="history-date">
          <text class="history-date-time">{{items.date}}</text>
        </div>
        <div class="history-items">
          <div class="history-item" v-for="(item, index2) in items.dateData" :key="'item'+index2" @click="toDetails(item)">
            <div class="history-item-image-box">
              <image class="history-item-image" :src="item.pict_url+'_500x500q80s100.jpg_.webp'" placeholder="" />
              <text class="history-item-coupon">{{item.coupon_info || item.coupon_amount ? (item.coupon_info ? item.coupon_info : item.coupon_amount) : item.discount_money | getCoupon}}元券</text>
            </div>
            <text class="history-item-name">{{item.title}}</text>
            <div class="history-item-data">
              <text class="history-item-price">{{item.zk_final_price}}元</text>
              <text class="history-item-sales">销量：{{item.volume}}</text>
            </div>
          </div>
        </div>
      </div>
    </scroller>
    <div class="bottomPopup" v-if="isDelete">
      <div ref="b1" class="btn" style="background-color:#6A1B9A" @click="collapse">
        <text class="text">取消</text>
      </div>
      <div ref="b2" class="btn" style="background-color:#0277BD" @click="deleteItem">
        <text class="text">确定</text>
      </div>
      <text ref="main_btn" class="main-btn" @click="expand">清空</text>
    </div>
  </div>
</template>
<script>
const utils_m = weex.requireModule('utils')
const storage = weex.requireModule("storage")
import { WxcMinibar, WxcIcon, WxcPopup } from 'weex-ui'
import Util from "common/js/util"
import { getCoupon } from 'common/js/filters'
import { DIRECTION_ARROW } from 'common/js/icon-type'

export default {
  components: { WxcMinibar, WxcIcon, WxcPopup },
  filters: { getCoupon },
  mixins: [Util],
  data () {
    return {
      arrowLeft: DIRECTION_ARROW[1],
      title: "我的足迹",
      statusbarHeight: 40,
      isDelete: false,
      history: []
    };
  },
  created () {
    var self = this;
    utils_m.getStatusBarHeight(e=>{
      var rate = this.$getConfig().env.deviceWidth / 750
      self.statusbarHeight = parseInt(e.statusbarHeight) / rate
      self.Height = this.$getConfig().env.deviceHeight / rate - 88 - self.statusbarHeight
    })
    this.getData()
  },
  methods: {
    getData () {
      storage.getItem("historyRecord", e => {
        if (e.data !== 'undefined') {
          Vue.set(this, 'history', JSON.parse(e.data))
        }
      })
    },
    deleteItem () {
      this.collapse();
      this.history = []
      storage.removeItem("historyRecord")
    },
    iconClicked () { 
      this.isDelete = !this.isDelete ? true : false
    },
    wxcCheckBoxItemChecked () {
      this.history.pop()
    },
    toDetails (o) {
      var self = this
      if (o.id) {
        storage.setItem("goodsId", JSON.stringify(o.id), e => {
          self.open('detailX5', 'true', () => {})
        })
      } else {
        storage.setItem("goodsDetail", JSON.stringify(o), e => {
          self.open("detail", "true", function (event) {})
        })
      }
    },
    collapse () {
      let main_btn = this.$refs.main_btn
      let b1 = this.$refs.b1
      let b2 = this.$refs.b2
      this.animation(main_btn, { transform: 'scale(1)' }, 400, 0, 'linear', false, ()=>{
        this.animation(main_btn, { transform: 'translateY(0)' }, 400, 0, 'linear', false, ()=>{})
      })
      this.animation(b1, { transform: 'translateX(-150)' }, 400, 0, 'cubic-bezier(.17,.87,.05,.87)', false, ()=>{
        this.animation(b1, { transform: 'translateX(0)' }, 400, 0, 'cubic-bezier(.17,.87,.05,.87)', false, ()=>{})
      })
      this.animation(b2, { transform: 'translateX(150)' }, 400, 0, 'cubic-bezier(.17,.87,.05,.87)', false, ()=>{
        this.animation(b2, { transform: 'translateX(0)' }, 400, 0, 'cubic-bezier(.17,.87,.05,.87)', false, ()=>{
          this.isDelete = false
        })
      })
    },
    expand () {
      let main_btn = this.$refs.main_btn
      let b1 = this.$refs.b1
      let b2 = this.$refs.b2
      this.animation(main_btn, { transform: 'scale(0)' }, 400, 0, 'linear', false, ()=>{
        this.animation(main_btn, { transform: 'translateY(160)' }, 400, 0, 'linear', false, ()=>{})
      })
      this.animation(b1, { transform: 'translateX(-150px)' }, 400, 0, 'cubic-bezier(.43,1.62,.68,.79)', false, ()=>{
        this.animation(b1, { transform: 'translateX(-80px)' }, 400, 0, 'cubic-bezier(.43,1.62,.68,.79)', false, ()=>{})
      })
      this.animation(b2, { transform: 'translateX(150px)' }, 400, 0, 'cubic-bezier(.43,1.62,.68,.79)', false, ()=>{
        this.animation(b2, { transform: 'translateX(80px)' }, 400, 0, 'cubic-bezier(.43,1.62,.68,.79)', false, ()=>{})
      })
    }
  }
};
</script>
<style scoped>
.history-navbar {
  height: 88px;
}
.titleColor {
  color: #ffffff;
}
.titleStyle {
  font-weight: 400;
  font-size: 34px;
}
.container {
  width: 750px;
}
.history-items-box {
  border-bottom-width: 1;
  border-color: #eeeeee;
}
.history-date {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 15px;
  width: 750px;
  height: 60px;
  background-color: #f1f1f1;
  color: #999999;
  font-size: 22px;
  font-weight: 300;
}
.history-date-time{
  font-size: 26px;
  color: #333;
}
.history-items {
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  padding-top: 20px;
  padding-left: 20px;
  width: 750px;
  background-color: #ffffff;
}
.history-item {
  justify-content: space-between;
  align-items: center;
  margin-right: 23px;
  margin-bottom: 20px;
  width: 220px;
  height: 300px;
}
.history-item-image-box {
  position: relative;
  width: 220px;
  height: 220px;
  background-color: #eeeeee;
}
.history-item-image {
  width: 220px;
  height: 220px;
  border-width: 1;
  border-color: #efefef;
}
.history-item-coupon {
  position: absolute;
  left: 5px;
  bottom: 5px;
  padding-left: 15px;
  padding-right: 15px;
  height: 30px;
  line-height: 30px;
  font-size: 20px;
  background-image: linear-gradient(to left, #e5345f, #ff7d49);
  border-radius: 15px;
  color: #ffffff;
}
.history-item-name {
  width: 220px;
  font-size: 24px;
  lines: 1;
  text-overflow: ellipsis;
  color: #333;
}
.history-item-data {
  width: 220px;
  flex-direction: row;
  justify-content: space-between;
}
.history-item-price, .history-item-sales {
  font-size: 20px;
}
.history-item-price{
 color:#e5345f;
}
.history-item-sales {
color:#999999;
}

.bottomPopup {
  position: absolute;
  bottom: 0;
  width: 750px;
  height: 180px;
  border-bottom-width: 1;
  border-color: #999999;
}
.main-btn {
  position: absolute;
  bottom: 20px;
  left: 305px;
  width: 140px;
  height: 140px;
  text-align: center;
  line-height: 140px;
  font-size: 30px;
  color: #ffffff;
  border-radius: 70px;
  background-color: #ff0000;
}
.image {
  width: 60px;
  height: 60px;
}

.text {
  color: #ffffff;
  font-size: 30px;
}

.btn {
  width: 100px;
  height: 100px;
  align-items: center;
  justify-content: center;
  position: absolute;
  border-radius: 50px;
  bottom: 50px;
  left: 325px;
}
</style>


