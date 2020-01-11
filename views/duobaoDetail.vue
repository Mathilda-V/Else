<template>
  <div class="duobaoDetail">
    <navbar title="夺宝详情" showBack="true"></navbar>  
    <scroller class="duobao-main bgcE">
      <slider class="slider" interval="6000" auto-play="auto">
        <div class="slider">
          <image class="slider" resize="cover" :src="dbg.pict_url" />
          <div class="roll-box">
            <div class="roll-content row between" ref="roll_content">
              <div class="row marginL20">
                <image class="roll-content-avatar marginR20" :src="currentRollItem.pic_url" />
                <text>{{ currentRollItem.tbnick }}</text>
              </div>
              <text class="marginR20">{{ currentRollItem.create_time, 0 | date }}</text>
            </div>
          </div>
        </div>
      </slider>
      <div class="row between">
        <div class="good-price bgcRed">
          <div class="row align-end">
            <text class="colorF size48" style="height: 48px;">{{ dbg.need_rice }}</text><text class="colorF size24">积分</text>
          </div>
          <text class="old-price"> ￥{{ dbg.price }}元</text>
        </div>
        <div class="countDown" v-if="dbg.is_open == 0">
          <text class="countDownText color6 size24 textCenter">揭晓倒计时：</text>
          <wxc-countdown
            class="countDownBox"
            :timeBoxStyle="{backgroundColor:'#f24561',width: '40px',height: '40px',borderRadius:'4px'}" 
            :timeTextStyle="{fontSize: '26px', color: '#ffffff'}" 
            :dotTextStyle="{color: '#f24561'}" 
            tpl="{h}:{m}:{s}" 
            :time="dbg.end_time*1000"
            @wxcOnComplete="onCompleted">
          </wxc-countdown>
        </div>
        <div class="endText row" v-else>
          <text class="size30 colorC">已结束</text>
        </div>
      </div>
      <div class="duobao-info bgcF">
        <text class="goods-title color3 size28">{{ dbg.good_name }}</text>
        <div class="progressBar between">
          <div class="row between">
            <text class="color9 size28">活动进度{{ dbg.now_join_num, dbg.total_join_num | toPercent }}</text>
            <text class="color9 size28">仅剩{{ dbg.total_join_num - dbg.now_join_num}}个名额</text>
          </div>
          <progress v-if="isShow" class="progress"
                    :progress-styles="progressStyles"
                    :total="dbg.total_join_num"
                    :current="dbg.now_join_num"></progress>
        </div>
        <text class="duobao-result bgcE" v-if="is_login && !dbg.is_join">您还没参与本期活动哟!</text>
      </div>
      <div class="good-detail bgcF">
        <text class="detail-title color3 size24">商品详情</text>
        <div class="detail-images center" style="padding: 0 10px;">
          <image class="detail-img" resize="contain" :src="dbg.pict_url" />
        </div>
      </div>
    </scroller>
    <div class="footer row">
      <text v-if="isShow" 
            :class="['duobao-state', 'size28', dbg.is_open == 1 ? 'colorC' : is_login&& dbg.is_join ? 'color9' : 'bgcRedColorWhite']" 
            @click="openDuobaoPay">{{ dbg.is_open == 1 ? '已结束' : is_login && dbg.is_join ? '等待开奖' : '立即参加' }}</text>
    </div>
  </div>
</template>
<script>
const storage = weex.requireModule("storage")
const modal = weex.requireModule("modal")
import navbar from "base/navbar"
import progress from "base/progress"
import { WxcMinibar, WxcCountdown } from 'weex-ui'
import Util from "common/js/util"
import { toPercent, date } from 'common/js/filters'

export default {
  components: { navbar, progress, WxcMinibar, WxcCountdown },
  filters: { toPercent, date },
  mixins: [Util],
  data() {
    return {
      statusbarHeight: 40,
      isShow: false,
      progressStyles: {
        width: 710,
        height: 30,
        frontColor: '#fe4353',
        bgColor: '#eeeeee'
      },
      dbg: {
        end_time: '',
        good_name: '',
        is_open: '0',
        need_rice: 1,
        pict_url: '',
        is_join: false,
        price: '0',
        total_join_num: '0',
        now_join_num: '0'
      },
      rollData: [],
      currentRollItem: {}
    }
  },
  created() {
    storage.getItem('info', e => { 
      if (e.data != 'undefined') {
        this.is_login = true
        this.userInfo = JSON.parse(e.data)
      } else {
        this.is_login = false
      }
    })
    storage.getItem('duobaoGoods', e => {
      this.dbg = JSON.parse(e.data)
      this.isShow = !this.isShow
      this.post('prize', 'getRecentJoinActiveRecord', { id: this.dbg.id }, res => {
        if (res.success && res.message == 'ok') {
          this.rollData = res.data
          setTimeout(() => { this.roll() }, 2000)
        }
      })
    })
  },
  methods: {
    // 打开夺宝支付结果
    openDuobaoPay () {
      if (this.dbg.is_open == 0) {
        this.userInfo.ricenum -= this.dbg.need_rice
        console.log(this.dbg.id)
        const params = {
          id: this.dbg.id,
          issue: this.dbg.issue
        }
        this.post('prize', 'joinActive', params, res => {
          if (!res.success) {
            console.log('ssss', res)
            switch (res.message) {
              case '未登录,请先登陆':
                modal.toast({message: '未登录，请先登录'})
                break
              case '该夺宝活动已过期':
                modal.toast({message: '该夺宝活动已过期'})
                break
              case '你的米粒数量不够':
                modal.toast({message: '你的米粒数量不够'})
                break
              case '你已参加过此活动': 
                modal.toast({message: '你已参加过此活动'})
                break
              case '该夺宝活动已满': 
                modal.toast({message: '该夺宝活动已满'})
                break
              case '该夺宝商品不存在': 
                modal.toast({message: '该夺宝商品不存在'})
                break
              default:
                modal.toast({message: '参与失败'})
                break
            }
          } else {
            storage.setItem('info', JSON.stringify(this.userInfo));
            const allMessage = new BroadcastChannel("allMessage");
            allMessage.postMessage({type: "riceChange", info:this.userInfo})  
            const joinInfo = new BroadcastChannel("duobaoDetail")
            joinInfo.postMessage({success: true})
            this.close()
            this.open('duobaoPay', 'true', e => {})
          }
        })
      } else {
        modal.toast({ message: '活动已结束'})
      }
    },
    onCompleted () {
      Vue.set(this.dbg, 'is_open', '1')
    },
    roll () {
      let roll_content = this.$refs.roll_content
      let idx = 0
      let timer = setInterval(() => {
        if (idx < this.rollData.length) {
          Vue.set(this, 'currentRollItem', this.rollData[idx])
          idx = idx == this.rollData.length - 1 ? 0 : idx + 1
          this.animation(roll_content, { transform: 'translateY(-80px)' }, 500, 0, 'linear', false, ()=>{
            this.animation(roll_content, { opacity: 0 }, 500, 5000, 'linear', false, ()=>{
              this.animation(roll_content, { transform: 'translateY(0px)', opacity: 1 }, 0, 0, 'linear', false, ()=>{})
            })
          })
        } else {
          clearInterval(timer)
        }
      }, 6500)
    }
  }
}
</script>
<style scoped>
.row {
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.flex-start {
  justify-content: flex-start;
}
.between {
  justify-content: space-between;
}
.align-end {
  align-items: flex-end;
}
.fontNormal {
  color: #666666;
  font-size: 24px;
}
.colorRed {
  color: #fe4353;
}
.colorBlue {
  color: #6C9FFF;
}
.colorF {
  color: #ffffff;
}
.colorC {
  color: #cccccc;
}
.color9 {
  color: #999999;
}
.color6 {
  color: #666666;
}
.color3 {
  color: #333333;
}
.size24 {
  font-size: 24px;
}
.size28 {
  font-size: 28px;
}
.size30 {
  font-size: 30px;
}
.size48 {
  font-size: 48px;
}
.textCenter {
  text-align: center;
}
.bgcF {
  background-color: #ffffff;
}
.bgcE {
  background-color: #eeeeee;
}
.bgcRed {
  background-color: #fe4353;
}
.bgcRedColorWhite {
  background-color: #fe4353;
  color: #ffffff;
}
.marginL20 {
  margin-left: 20px;
}
.marginR20 {
  margin-right: 20px;
}

.duobao-main {
  width: 750px;
}
.slider {
  position: relative;
  width: 750px;
  height: 750px;
}
.roll-box {
  position: absolute;
  bottom: 30px;
  left: 30px;
  width: 500px;
  height: 80px;
}
.roll-content {
  position: absolute;
  bottom: -80px;
  width: 500px;
  height: 80px;
  border-radius: 40px;
  border-width: 1;
  border-color: #cfcfcf;
  background-color: rgba(255, 255, 255, .8);
}
.roll-content-avatar {
  width: 50px;
  height: 50px;
  border-radius: 25px;
}
.duobao-info {
  padding: 20px;
}
.progress-state {
  position: absolute;
  top: 0;
  left: 0;
  padding-left: 20px;
  padding-right: 20px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 20px;
}
.goods-title {
  width: 710px;
  line-height: 40px;
}
.good-price {
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
  padding-left: 20px;
  padding-bottom: 30px;
  width: 530px;
  height: 100px;
}
.old-price {
  margin-left: 20px;
  color: #ffffff;
  font-size: 24px;
  text-decoration: line-through;
}
.countDown {
  position: relative;
  justify-content: center;
  width: 220px;
  height: 100px;
  background-color: #f4f37c;
}
.countDownText {
  position: absolute;
  top: 0;
  left: 0;
  width: 220px;
  height: 40px;
  line-height: 40px;
}
.countDownBox {
  position: absolute;
  bottom: 10px;
  left: 0;
  padding-left: 15px;
  width: 200px;
  height: 50px;
}
.endText {
  width: 220px;
  height: 100px;
  background-color: #eeeeee;
}
.progressBar {
  margin-top: 20px;
  width: 710px;
  height: 80px;
}
.progress {
  margin-bottom: 3px;
}
.duobao-result {
  margin-top: 20px;
  width: 710px;
  height: 80px;
  line-height: 80px;
  color: #666666;
  font-size: 30px;
  text-align: center;
}
.good-detail {
  margin-top: 10px;
  margin-bottom: 10px;
}
.detail-title {
  padding-left: 20px;
  padding-right: 20px;
  width: 750px;
  height: 60px;
  line-height: 60px;
}
.wrap-icon{
  width: 24px;
  height: 24px;
}
.detail-images {
  width: 750px;
  border-top-width: 1;
  border-color: #efefef;
}
.detail-img {
  width: 750px;
  height: 750px;
}
.footer {
  width: 750px;
  height: 100px;
}
.duobao-state {
  width: 710px;
  height: 70px;
  line-height: 70px;
  text-align: center;
  color: #000000;
  background-color: #eeeeee;
  border-radius: 35px;
}
</style>


