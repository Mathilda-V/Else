<template>
  <div>
    <scroller class="lucky-wrapper" show-scrollbar="false" :style="{height: contentHeight + 'px'}">
      <div class="lucky-bg" :style="{height: contentHeight + 'px'}">
        <image :src="picUrl.MAIN" class="lucky-bg-img" resize="cover"/>
      </div>
      <image class="arrow-back" :src="arrowLeft" @click="back"></image>
      <slider class="scroll-line row" auto-play="true" interval="4000" scrollable="false" infinite="false">
        <div class="info-line row" v-for="(item, index) in prizeAll" :ref="'item'+index">
          <div class="row">
            <image class="item-icon" :src="item.pic_url"></image>
            <text class="normal-white" style="margin-left: 8px;">{{item.tbnick}}</text>
          </div>
          <text class="normal-white">{{item.time}}</text>
          <text class="normal-white">{{item.name}}</text>
        </div>
      </slider>
      <div class="wheel-main">
        <!-- 转盘 -->
        <div class="wheel-bg" ref="wheel">
          <image class="bg-img" :src="picUrl.WHEEL_BG"></image>
          <div class="prize-wheel">
            <div :class="['prize-item', 'child-'+(index+1)]" v-for="(item, index) in prizelist">
              <text class="prize-type normal-red">{{item.name}}</text>
              <image class="prize-img" :src="item.url + '_70x70q100_.webp'"></image>
            </div>
          </div>
        </div>
        <!-- 指针 -->
        <div class="pointer" @click="rotating">
          <image class="pointer-img" :src="picUrl.POINTER"></image>
        </div>
      </div>
      <text class="normal-white" style="margin-top: 68px;">当前积分: {{userInfo.ricenum || 0}}</text>
      <div class="handle-block row">
        <div class="btn-blue" @click="openAll">
          <image class="btn-blue" :src="userPrize"/>
        </div>
        <div class="btn-red" @click="rotating">
          <image class="btn-red" :src="play"/>
        </div>
        <div class="btn-blue" @click="openMy">
          <image class="btn-blue" :src="myPrize"/>
        </div>
      </div>

      <div class="prize-block">
        <div class="item-block">
          <text class="middle-white bs">抽奖规则：</text>
          <text class="normal-pink text-height">1.每次抽奖需消耗50积分，消耗的积分将不予退还；</text>
          <text class="normal-pink text-height">2.抽中的积分将直接增加至您的当前积分中；</text>
          <text class="normal-pink text-height">3.抽中的奖品将过3个工作日，邮寄到您所填写的地址；</text>
          <text class="normal-pink text-height">4.积米惠购在法律允许的范围内保留对本活动规则的最终解释权。</text>
        </div>
      </div>
    </scroller>

    <mask 
      :height="700"
      :width="550"
      :bg-color="'#ff715b'"
      :show-mask="show"
      @closeMask="wxcMaskSetHidden"
    >
      <div class="record-title row" v-if="myPrizeClick">
        <text class="middle-white">我的奖品</text>
        <text class="middle-white">消费记录</text>
      </div>
      <div class="record-title row" v-else>
        <text class="middle-white">中奖名单</text>
      </div>
      <scroller class="record-list" show-scrollbar="false">
        <div class="record-item row-btw" v-for="item in prizeRecord">
          <div class="row" v-if="userPrizeClick">
            <image class="item-icon" :src="item.pic_url"></image>
            <text class="normal-white" style="width:120px;margin-left:8px;">{{item.tbnick}}</text>
          </div>
          <text class="normal-white" style="width:150px;">{{item.time}}</text>
          <text class="normal-white" style="width:130px;text-align:right;">{{item.name}}</text>
        </div>
      </scroller>
    </mask>

    <mask 
      :width="480" 
      :height="620" 
      mask-bg-color="transparent"
      :show-mask="showResult" 
      @closeMask="closeResult">
      <div class="prize-result">
        <image class="result-bg" :src="hasPrize ? picUrl.HAS_PRIZE : picUrl.SORRY"></image>
        <image class="prize-pic" :src="resultItem.url"></image>
        <text class="prize-text">{{hasPrize ? '恭喜!' : '好可惜'}}</text>
        <text class="prize-text">{{hasPrize ? '你抽中了 ' + resultItem.name : '差点就中了!'}}</text>
        <text class="prize-btn normal-white" @click="gameAgain">再抽一次</text>
      </div>
    </mask>
  </div>
</template>

<script>
const weexUtil = weex.requireModule('utils')
const storage = weex.requireModule('storage')
const animation = weex.requireModule('animation')
const modal = weex.requireModule('modal')
import Mask from 'base/mask'
import Util from "common/js/util"
import { formatDate } from 'common/js/common'
import { DIRECTION_ARROW, LUCKY_WHEEL } from 'common/js/icon-type'

export default {
  mixins: [Util],
  data(){
    return{
      startAngle: 0,
      arrowLeft: DIRECTION_ARROW[1],
      picUrl: LUCKY_WHEEL,
      userInfo: {},
      prizelist: [],
      prizeAll: [],
      prizeRecord: [],
      resultItem: {},
      canClick: true,
      userPrizeClick: false,
      myPrizeClick: false,
      show: false,
      showResult: false,
      hasPrize: false
    }
  },
  created(){
    this.calcHeight()
    this.initData()
    this.getUserInfo()
  },
  computed: {
    play(){
      return this.canClick ? this.picUrl.START : this.picUrl.START_PRESS
    },
    userPrize(){
      return this.userPrizeClick ? this.picUrl.ALL_PRIZE_PRESS : this.picUrl.ALL_PRIZE
    },
    myPrize(){
      return this.myPrizeClick ? this.picUrl.MY_PRIZE_PRESS : this.picUrl.MY_PRIZE
    }
  },
  methods: {
    calcHeight(){
      storage.getItem('viewport', (e) => {
        if(e.result == "success"){
          this.contentHeight = JSON.parse(e.data).deviceHeight
        }
      })
    },
    initData(){
      this.post('prize', 'returnTurntableGoodList', {}, res => {
        if(res && res.success){
          this.prizelist = res.data
          // console.log(this.prizelist)
        }
      }),
      this.post('prize', 'getTurntablePrizeList', {}, res => {
        if(res && res.success){
          let arr = []
          res.data.forEach(item => {
            item.time = formatDate(new Date(item.create_time * 1000)).substring(2, 10)
            item.tbnick = item.tbnick.substring(0,2).padEnd(4, '*')
            if(item.name != "谢谢参与" && item.name != "5积分") {
              arr.push(item)
            }
          })
          this.prizeAll = arr
        }
      })
    },
    getUserInfo(){
      storage.getItem('info', e => {
        let data = e.data != 'undefined' && e.data
        this.userInfo = JSON.parse(data)
      })
      this.post('user', 'isPhoneOrAddress', {}, res => {
        this.hasAddress = res.stcode == 0 && res.success
      })
    },
    rotating(){
      if(!this.userInfo) {
        modal.toast({message: '未登录, 请先登录'})
        return
      }
      if(!this.hasAddress) {
        modal.toast({message: '请至少添加一个收货地址'})
        return
      }
      if(+this.userInfo.ricenum < 50) {
        modal.toast({message: '积分不足'})
        return
      }
      if(!this.canClick) return
      let duringTime = 5
      let resultAngle = [337.5, 292.5, 247.5, 202.5, 157.5, 112.5, 67.5, 22.5]
      let randCircle = 4
      this.canClick = false
      this.post('prize', 'startRun', {}, res => {
        if(res && res.success){
          let prizeIndex = this.prizelist.findIndex(item => item.id == res.data.id)
          let resultIndex = prizeIndex > -1 ? prizeIndex : 0
          let rotateAngle = this.startAngle + randCircle * 360 + resultAngle[resultIndex] - this.startAngle % 360
          this.startAngle = rotateAngle
          animation.transition(this.$refs.wheel, {
            styles: {
              transform: `rotate(${rotateAngle}deg)`
            },
            duration: 5000,
            timingFunction: 'ease-in-out'
          })
          setTimeout(() => {
            this.canClick = true
            this.userInfo.ricenum = res.data.ricenum
            this.gameOver(resultIndex)
          }, duringTime * 1000 + 100)
        } else {
          modal.toast({message: res.message})
        }
      })
    },
    openAll(){
      this.userPrizeClick = true
      this.prizeRecord = this.prizeAll
      this.show = true
    },
    openMy(){
      this.myPrizeClick = true
      this.post('prize', 'getOwnTurntablePrizeList', {}, res => {
        if(res && res.success) {
          let data = res.data
          let now = new Date(Date.now())
          data.forEach(item => {
            let createTime = new Date(item.create_time * 1000)
            let date = formatDate(createTime).substring(5, 16)
            item.time = createTime.getDate() === now.getDate() ? `今天 ${date.split(' ')[1]}` : date
          })
          this.prizeRecord = data
          this.show = true
        }
      })
    },
    wxcMaskSetHidden(){
      this.show = false;
      this.myPrizeClick = false
      this.userPrizeClick = false
    },
    closeResult(){
      this.showResult = false
    },
    gameOver(index){
      this.resultItem = this.prizelist[index]
      this.hasPrize = this.resultItem.name != '谢谢参与'
      this.showResult = true
      storage.setItem('info', JSON.stringify(this.userInfo));
      const allMessage = new BroadcastChannel("allMessage");
      allMessage.postMessage({type: "riceChange", info:this.userInfo})  
    },
    gameAgain(){
      this.showResult = false
      this.rotating()
    },
    back(){
      this.close('true')
    }
  },
  components: {
    Mask
  }
}
</script>

<style lang="stylus" scoped>
@import '../common/stylus/variable.styl'

.lucky-wrapper{
  position: relative;
  width: 750px;
  align-items: center;
  background-color: #e57627;
}
.lucky-bg{
  width: 750px;
  position: absolute;
  top: 0;
  left: 0;
}
.arrow-back{
  position: absolute;
  top: 60px;
  left: 4px;
  width: 74px;
  height: 74px;
}
.lucky-bg-img{
  width: 750px;
  height: 1941px;
}
.scroll-line{
  margin-top: 293px;
  width: 375px;
  height: 30px;
}
.info-line{
  width: 375px;
  height: 30px;
  justify-content: space-between;
}
.wheel-main{
  position: relative;
  width: 750px;
  height: 560px;
  align-items: center;
  justify-content: center;
  margin-top: 67px;
}
.wheel-bg{
  position: relative;
  width: 560px;
  height: 560px;
  justify-content: center;
  align-content: center;
}
.bg-img{
  position: absolute;
  width: 560px;
  height: 560px;
  left: 0;
  top: 0;
}
.pointer{
  position: absolute;
  top: 205px;
  left: 315px;
  width: 120px;
  height: 120px;
}
.pointer-img{
  width: 120px;
  height: 120px;
}
.prize-wheel{
  position: relative;
  width: 560px;
  height: 560px;
}
.prize-item{
  position: absolute;
  padding-top: 50px;
  height: 275px;
  width: 140px;
  top: 2px;
  left: 210px;
  align-items: center;
  transform-origin: center bottom;
}
.prize-type{
  width: 130px;
  text-align: center;
  lines: 1;
  margin-bottom: 25px;
}
.prize-img{
  width: 70px;
  height: 70px;
}
.handle-block{
  margin-top: 42px;
  width: 750px;
  padding: 0 52px 0 56px;
  justify-content: space-between;  
}
.prize-block{
  padding: 25px;
  position: relative;
}
.item-block{
  margin-top: 25px;
  width: 730px;
  padding: 25px;
  border-radius: 10px;
  background-color: #c31b41;
}
.item-name{
  position: absolute;
  left: 375px;
  top: 29px;
  width: 180px;
  height: 42px;
  margin-left: -90px;
  border-radius: 22px;
  background-color: #ffffff;
}
.item-icon{
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: #eeeeee;
}
.btn-blue{
  width: 120px;
  height: 80px;
  // border-width: 1px;
  // border-style: solid;
  // border-color: #fff;
}
.btn-red{
  width: 300px;
  height: 109px;
}

.prize-result{
  width: 480px;
  height: 620px;
  padding-top: 160px;
  padding-bottom: 40px;
  align-items: center;
  position: relative;
}
.result-bg{
  position: absolute;
  top: 0;
  left: 0;
  width: 480px;
  height: 620px;
  background-color: #ffffff;
}
.prize-pic{
  width: 200px;
  height: 200px;
  margin-bottom: 30px;
}
.prize-text{
  font-size: 28px;
  color: #333333;
}
.prize-btn {
  width: 300px;
  height: 80px;
  line-height: 80px;
  border-radius: 40px;
  background-color: #e96d37;
  text-align: center;
  box-shadow: 0 5px 10px rgba(0,0,0,.3);
  margin-top: 50px;
}
.child-1{
  transform: rotate(23deg);
}
.child-2{
  transform: rotate(68deg);
}
.child-3{
  transform: rotate(113deg);
}
.child-4{
  transform: rotate(158deg);
}
.child-5{
  transform: rotate(-158deg);
}
.child-6{
  transform: rotate(-113deg);
}
.child-7{
  transform: rotate(-68deg);
}
.child-8{
  transform: rotate(-23deg);
}



.row{
  flex-direction: row;
  align-items: center;
}
.row-center{
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.row-btw{
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.ls{
  margin-left: 12px;  
}
.bs{
  margin-bottom: 12px;  
}
.normal-pink {
  color: #ffffff;
  font-size: 26px;
}

.record-con{
  width:550px;
  height:700px;
}
.record-title{
  padding: 14px 0;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ffffff;
  justify-content: space-around;  
}
.record-list{
  padding: 24px 50px; 
}
.record-item{
  height: 40px;
}

</style>

