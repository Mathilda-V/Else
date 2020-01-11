<template>
  <div class="wrapper">
    <scroller show-scrollbar="false" ref="scroller">
      <slider class="wh-750" interval="6000" auto-play="false">
        <div class="wh-750" v-if="goods.small_images" v-for="img in goods.small_images.string">
          <image class="wh-750" resize="cover" :src="img + '_500x500q80s100.jpg_.webp'" />
        </div>
        <indicator class="indicator"></indicator>
      </slider>
      <div class="white-w-nobottom">
        <div class="row btw">
          <div class="rel" style="width: 640px;">
            <text class="normal-red abs" v-if="goods.user_type == '1'">[天猫]</text>
            <text class="normal-orange abs" v-else>[淘宝]</text>
            <text class="middle-black space-b-20">&emsp;&emsp;&ensp;{{goods.title}}</text>
          </div>
          <div class="collect-con" @click="addLike">
            <image :src="collectIcon" ressize="contain" style="width:40px;height:40px;margin-bottom:2px;" />
            <text class="mini-gray">收藏</text>
          </div>
        </div>
        <div class="row">
          <!-- 现价 -->
          <text class="normal-gray text-height">¥</text>
          <text class="normal-gray text-height through" v-if="goods.coupon_info || goods.coupon_amount">{{goods.zk_final_price}}</text>
          <text class="normal-gray text-height through" v-else>{{goods.reserve_price}}</text>
        </div>
        <!-- 券后价 -->
        <div class="row btw">
          <div class="row btw" v-if="goods.coupon_info || goods.coupon_amount">
            <text class="normal-white back-red" style="padding: 5px;">券后价</text>
            <text class="big-red big-weight space-l">¥{{goods.price | toFixed }}</text>
          </div>
          <div class="row btw" v-else>
            <text class="normal-white back-red" style="padding: 5px;">折扣价</text>
            <text class="big-red big-weight space-l">¥{{goods.zk_final_price}}</text>
          </div>
          <text class="normal-gray text-height">月销量:{{goods.volume}}件</text>
        </div>
      </div>

      <div class="white-w space-b">
        <!-- 券信息 -->
        <div class="rel row" @click="buy(true)" v-if="goods.coupon_info || goods.coupon_amount ">
          <image class="img-coupon abs" :src="couponStyle" />
          <div class="left-block center">
            <text class="middle-white" v-if="goods.coupon_info">{{goods.coupon_info}}元优惠券</text>
            <text class="middle-white" v-else-if="goods.coupon_amount">{{goods.coupon_amount}}元优惠券</text>
            <text class="small-gray-light" v-if="goods.coupon_start_time && goods.coupon_start_time != 'undefined'">使用期限</text>
            <text class="small-gray-light" v-if="goods.coupon_start_time && goods.coupon_start_time != 'undefined'">{{goods.coupon_start_time | format}}~{{goods.coupon_end_time | format}}</text>
          </div>
          <div class="right-block center">
            <text class="middle-white">立即领券</text>
          </div>
        </div>
        <!-- 券信息结束 -->
      </div>

      <div class="space-b">
        <div class="white-w row-btw" @click="wrapDetailImg">
          <text class="normal-gray">商品详情</text>
          <div class="row">
            <image class="wrap-icon" :src="arrowRight" ref="wrapArrow"></image>
          </div>
        </div>
        <div class="center" style="padding: 0 10px;" v-if="wrap">
          <image v-for="p in goods.small_images.string" :src="p +'_500x500q80s100.jpg_.webp'" resize="contain" class="wh-750" />
        </div>
      </div>

      <div class="white-w row-cen line-b" v-if="guessLike.length">
        <image :src="line" resize="cover" style="width:100px;height:30px;margin-right:10px;" />
        <text class="normal-black">相关推荐</text>
        <image :src="line" resize="cover" style="width:100px;height:30px;margin-left:10px;" />
      </div>

      <div class="w-none row-btw" v-if="guessLike.length">
        <div class="patch-half" v-for="item in guessLike" @click="likeToDetail(item)">
          <image :src="item.pict_url +'_300x300q80s100.jpg_.webp'" class="patch-img" resize="contain" />
          <div class="white-half">
            <div class="rel">
              <image :src="item.imgUrl" class="mall-icon" resize="contain"></image>
              <text class="normal-black line-2 space-b">&emsp;&emsp;&ensp;{{item.title}}</text>
            </div>
            <div class="row-btw">
              <div class="row">
                <text class="small-red">￥</text>
                <text class="middle-red">{{item.zk_final_price}}</text>
                <text class="mini-gray through">￥{{item.reserve_price}}</text>
              </div>
              <text class="small-gray">售:{{item.volume}}</text>
            </div>
          </div>
        </div>
      </div>
    </scroller>

    <div class="white-w-none row-btw" style="height:100px;" ref="foot">
      <div class="w-none row" v-if="goods.coupon_info || goods.coupon_amount">
        <div class="btn btn-left center" @click="buy(false)">
          <text class="normal-gray big-gray">¥{{goods.zk_final_price | toFixed}}</text>
          <text class="normal-gray">原价购买</text>
        </div>
        <div class="btn btn-right center" @click="buy(true)">
          <text class="normal-white big-white">¥{{goods.price | toFixed}}</text>
          <text class="normal-white">领券购买</text>
        </div>
      </div>
      <text class="btn btn-single middle-white"  @click="buy(false)" v-else>点击购买</text>
    </div>

    <div class="navbar-bg" :style="{paddingTop: statusbarHeight + 'px', height: statusbarHeight + 80 + 'px'}" ref="nav">
      <div class="row-cen">
        <image class="title-img" :src="goods.small_images.string[0]+'_70x70q80s100.jpg_.webp'" />
        <text class="middle-white line-1 space-l" style="width: 290px;">{{goods.title}}</text>
      </div>
    </div>
    <div class="navbar" :style="{paddingTop: statusbarHeight + 'px', height: statusbarHeight + 80 + 'px'}">
      <div class="w-none row-btw">
        <image class="title-icon back-icon" src="file://@all_return" style="margin-left:20px;" ref="back" @click="back"/>
        <image class="title-icon" src="https://img.alicdn.com/imgextra/i4/3159284535/O1CN01UeLdtc1jN4dLVNEDw_!!3159284535.png" style="margin-right:20px;" @click="toShare"/>
      </div>
    </div>
  </div>
</template>

<script>
const storage = weex.requireModule("storage");
import Util from "common/js/util"
import BX from 'weex-bindingx';
import * as icons from 'common/js/icon-type'
import { formatDate, toFixed } from 'common/js/filters.js'

export default {
  mixins: [Util],
  filters: {
    format(time) {
      let reg = RegExp(/-/);
      if (reg.test(time)) {
        return time
      }
      var date = new Date(time * 1000);
      return formatDate(date, 'yyyy-MM-dd');
    },
    toFixed: toFixed
  },
  data() {
    return {
      goods: {
        pict_url: icons.JIMI_LOGO,
        small_images: {string: []}
      },
      wrap: false,
      collectIdList: [],
      guessLike: [],
      pageNo: 1,
      pageSize: 30,
      line: icons.LINE,
      couponStyle: icons.COUPON_STYLE,
      arrowRight: icons.DIRECTION_ARROW[0],
      shareIcon: icons.SHARE,
    }
  },
  created() {
    this.getData()
    this.getCollectId()
  },
  mounted() {
    setTimeout(() => {
      this.headAnimate()
    }, 20);
  },
  computed: {
    collectIcon() {
      return this.collectIdList.some(item => item.num_iid == this.goods.num_iid) ? icons.COLLECTED : icons.NO_COLLECT
    }
  },
  methods: {
    headAnimate() {
      this.result = BX.bind({
        eventType: 'scroll',
        anchor: this.$refs.scroller.ref,
        props: [
          {
            element: this.$refs.nav.ref,
            property: 'opacity',
            expression: 'min(600, y)/600'
          },
          {
            element: this.$refs.back.ref,
            property: 'background-color',
            expression: 'rgba(51, 51, 51, max(0, 240-y)/600)'
          }
        ]
      })
    },
    getData(){
      storage.getItem("goodsDetail", e => {
        this.goods = JSON.parse(e.data)
        this.goods.coupon_click_url === 'undefined' && delete this.goods.coupon_click_url
        this.goods.coupon_info === '0' && delete this.goods.coupon_info
        if(this.goods.coupon_info) {
          let arr = this.goods.coupon_info.match(/\d+\.?\d*/g)
          this.goods.coupon_info = arr.length > 1 ? arr[1] : arr[0]
          this.goods.price = this.goods.zk_final_price - this.goods.coupon_info
        }
        if(this.goods.coupon_amount) {
          this.goods.price = this.goods.zk_final_price - this.goods.coupon_amount
        }
        if (!this.goods.small_images) {
          this.goods["small_images"] = {};
          if (!this.goods.small_images.string) {
            this.goods.small_images.string = [];
          }
        }
        if (typeof this.goods.small_images == 'string') {
          this.goods.item_url = this.goods.detail_url
          this.goods.small_images = {string: this.goods.small_images.split(',').slice(0, 4)}
        }
        if(typeof this.goods.small_images.string == 'string'){
          this.goods.small_images = {string: [this.goods.small_images.string]}
        }
        console.log('goods', this.goods);
        this.relatedToRecommend()
        this.saveHistory(e);
      });
    },
    relatedToRecommend(){
      if(this.goods.hasOwnProperty('category_id')){
        this.post('appapi', 'material', { pageNo:this.pageNo,pageSize:this.pageSize, cid: this.goods.category_id }, res => {
          res.forEach(item => {
            item.imgUrl = item.user_type == '1' ? icons.mallType[0] : icons.mallType[1]
          })
          this.guessLike = res
          this.pageNo ++
        })
      }else{
        this.post('appapi', 'guessLike', { nid: this.goods.num_iid }, res => {
          if (res && res.results) {
            res.results.n_tbk_item.forEach(item => {
              item.imgUrl = item.user_type == '1' ? icons.mallType[0] : icons.mallType[1]
            })
            this.guessLike = res.results.n_tbk_item
          } else {
            this.wrap = true
            return
          }
        })
      }
    },
    getCollectId(){
      storage.getItem('info', e => {
        if(e.data != 'undefined') {
          storage.getItem('collectId', e => {
            if(e.data != 'undefined'){
              this.collectIdList = JSON.parse(e.data)
            }
          })
        }
      })
    },
    buy(hasCoupon) {
      if(hasCoupon) {
        this.goods.coupon_click_url && this.openDetailByUrl(this.goods.coupon_click_url, this.goods.title);
        this.goods.coupon_share_url && this.openDetailByUrl(this.goods.coupon_share_url.replace('//', 'https://'),this.goods.title);
        return
      }
      this.openDetailByUrl(this.goods.item_url,this.goods.title)
    },
    likeToDetail(goods) {
      // console.log('like', goods)
      storage.setItem("goodsDetail", JSON.stringify(goods), e => {
        this.open("detail", "true", function () {});
      });
    },
    back() {
      this.close('false')
    },
    toShare() {
      let coupon = this.goods.coupon_info || this.goods.coupon_amount || undefined
      let price = coupon ? (this.goods.zk_final_price - coupon) : this.goods.zk_final_price
      let url = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.icebox.amoymarket&pid='
      this.share(this.goods.title, `在【积米惠购】中购买仅需${price}元`, this.goods.pict_url, url, e => {})
    },
    wrapDetailImg(){
      this.animation = weex.requireModule('animation')
      this.animation.transition(this.$refs.wrapArrow, {
        styles: {
          transform: this.wrap ? 'rotate(0deg)' : 'rotate(90deg)'
        },
        duration: 300,
        timingFunction: 'ease-out'
      })
      this.wrap = !this.wrap
    },
    addLike() {
      let params = {
        title            : this.goods.title,
        pict_url         : this.goods.pict_url,
        volume           : this.goods.volume,
        reserve_price    : this.goods.reserve_price,
        zk_final_price   : this.goods.zk_final_price,
        num_iid          : this.goods.num_iid,
        user_type        : this.goods.user_type,
        small_images     : this.goods.small_images.string.join(','),
        coupon_info      : this.goods.coupon_info || this.goods.coupon_amount || undefined,
        coupon_click_url : this.goods.coupon_click_url || this.goods.coupon_share_url || this.goods.click_url || undefined,
        item_url         : this.goods.item_url || undefined,
        coupon_start_time: this.goods.coupon_start_time || undefined,
        coupon_end_time  : this.goods.coupon_end_time || undefined
      }
      if(!this.goods.reserve_price) {
        params.reserve_price = this.goods.zk_final_price
      }
      console.log('collect', params)
      this.post('collection', 'collectionAdd', params, res => {
        if(!res.success && this.collectIcon == 'file://@detail_collection_a'){
          //收藏图标亮起才能删除
          this.post('collection', 'collectionDel', {num_iid: this.goods.num_iid}, res => {})
        }
        this.post('collection', 'getGoodNumiid', {}, response => {
          response.success 
          ? storage.setItem('collectId', JSON.stringify(response.data))
          : storage.setItem('collectId', JSON.stringify([]))
          this.getCollectId()
        })
      })
    },
    /**
    * 存储浏览记录
    */
    saveHistory(e) {
      let self = this
      let d = new Date()
      let date = (d.getMonth() + 1) + '月' + d.getDate() + '日'
      let goodsInfo = JSON.parse(e.data)
      storage.getItem("historyRecord",e => {
        if (e.data == 'undefined') {
          let hR = []
          let dateData = []
          dateData.unshift(goodsInfo)
          hR.unshift({date: date, dateData: dateData})
          storage.setItem("historyRecord", JSON.stringify(hR), e => {})
        } else {
          let hR = JSON.parse(e.data)
          if (hR.length > 6) {
            hR.pop()
          } 
          let dateIdx = ''
          if (hR[0].date == date) {
            let goodsIdx = ''
            let goodsRes = hR[0].dateData.filter((v, index) => {
              if (v.num_iid == goodsInfo.num_iid) goodsIdx = index
              return v.num_iid == goodsInfo.num_iid
            })
            if (goodsRes.length !== 0) hR[0].dateData.splice(goodsIdx, 1)
            hR[0].dateData.unshift(goodsInfo)
            storage.setItem("historyRecord", JSON.stringify(hR), e => {})
          } else {
            let dateData = []
            dateData.unshift(goodsInfo)
            hR.unshift({date: date, dateData: dateData})
            storage.setItem("historyRecord", JSON.stringify(hR), e => {})
          }
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../common/stylus/layout.styl'
@import '../common/stylus/variable.styl'
  
.navbar {
  width: 750px;
  height: 80px;
  padding-top: 80px;
  position: absolute;
  top: 0;
}
.navbar-bg {
  width: 750px;
  height: 80px;
  position: absolute;
  top: 0;
  opacity: 0;
  background-color: #d02557;
}
.title-icon {
  width: 70px;
  height: 70px;
}
.title-img {
  width: 70px;
  height: 70px;
  border-radius: 3px;
}
.back-icon {
  background-color: rgba(51, 51, 51, 0.4);
  border-radius: 35px;
}


.wrapper {
  background-color: #ededed;
}
.wh-750 {
  width: 750px;
  height: 750px;
  background-color: #eeeeee;
}
.indicator {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60px;
  background-color: rgba(0, 0, 0, 0);

  itemcolor: #eeeeee;
  itemselectedcolor: #f56a33;
}
.collect-con{
  width: 60px;
  align-self: flex-start;
  align-items: center;
}
.left-block {
  width: 500px;
  height: 150px;
}
.right-block {
  width: 210px;
  height: 150px;
}
.img-coupon {
  width: 710px;
  height: 150px;
  background-color: #eeeeee;
}
.wrap-icon{
  width: 28px;
  height: 28px;
}
.mall-icon {
  position: absolute;
  height: 30px;
  width: 60px;
  top: 4px;
}


.patch-half {
  width: 370px;
  background-color: #ffffff;
  padding-bottom: 20px;
  margin-bottom: 10px;
}
.patch-img {
  background-color: #eeeeee;
  border-radius: 2px;
  width: 370px;
  height: 370px;
}

.btn {
  flex: 1;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.btn-left {
  background-color: #f4f4f4;
}
.btn-right {
  background-color: #d02557;
}
.btn-single {
  background-image: linear-gradient(to right, #ffc700, #ff4800);
}

</style>

