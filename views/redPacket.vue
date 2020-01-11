<template>
  <div>
    <scroller class="red-packet" show-scrollbar="false" :style="{height: contentHeight + 'px'}">
      <div class="packet-bg">
        <image :src="redPacketImg.BG_TOP" class="bg-top-img" resize=""/>
        <!-- 我的战绩 -->
        <div class="top-right-tip" @click="openRecord">
          <text class="tip-text">我的战绩</text>
        </div>
        <image class="arrow-back" :src="arrowLeft" @click="back"></image>
        <!-- 红包列表 -->
        <div class="mid-con">
          <div class="con-bg" v-for="(item,index) in list" @click="openPacket(index,item)" ref="packet">
            <image :src="redPacketImg.RED_BG" class="mid-img" resize=""/> 
            <text class="con-top-txt">拆需{{item.need_integral}}积分</text>
            <image class="con-mid-img" :src="redPacketImg.RED_BAG"></image>
            <text class="con-btm-txt">可得{{item.get_integral.replace(',','-')}}积分</text>
          </div>
        </div>
      </div>
      <!-- 当前积分 -->
      <div class="packet-bg">
        <image :src="redPacketImg.BG_BTM" class="bg-btm-img" resize=""/>
        <text class="btm-points points-txt">当前积分：</text>
        <text class="btm-points points-num">{{userInfo.ricenum}}</text>
        <text :class="['btm-points','points-change',changeRicenum < 0?'green':'red']" ref="changeRice">{{changeRicenum < 0?changeRicenum:'+'+changeRicenum}}</text>     
      </div> 
      <!-- 战绩排名 -->
        <div class="rule-rankinglist rand-box">
          <div class="into-tltle">
            <image class="tltle-pic" :src="redPacketImg.ORNAMENT"></image>
            <text class="tltle-txt">土豪排行榜</text>
            <image class="tltle-pic" :src="redPacketImg.ORNAMENT"></image>      
          </div>
          <div class="into-con">
            <div class="con-rand" v-for="(item, index) in rankList">
              <image class="rand-img" :src="rankImg[index]" v-if="index<3"></image>
              <text class="rand-txt" v-else>{{index+1}}</text>
              <image class="rand-pic" :src="item.pic_url"></image>
              <text class="rand-name">{{item.tbnick}}</text>
              <text class="rand-num">{{item.ricenum}}</text>
            </div>
          </div>
        </div>      
      <!-- 规则介绍 -->
      <div class="rule-intro">
        <div class="into-tltle">
          <image class="tltle-pic" :src="redPacketImg.ORNAMENT"></image>
          <text class="tltle-txt1">拆包拼手气玩法</text>
          <image class="tltle-pic" :src="redPacketImg.ORNAMENT"></image>
        </div>
        <div class="into-con">
          <div class="con-item" v-for="(item, index) in rule">
            <div class="con-pic">
             <text class="pic-txt">{{index+1}}</text>
            </div>
            <text class="con-txt">{{item}}</text>
          </div>
        </div>
      </div>
    </scroller>
    <!-- 弹窗 -->
    <div class="mask" v-if="priceShow||recordShow" ref="mask" @click="mask">
      <!-- 中奖 -->
      <div class="auto" v-if="priceShow" ref="priceAuto">
        <image v-if="openResult.lucky_num" :src="redPacketImg.PRICE_SPE" class="win-img"></image>
        <image v-else :src="redPacketImg.PRICE" class="win-img"></image>
        <text :class="['img-txt',openResult.lucky_num?'txt-abs-spe':'txt-abs']">{{openResult.randIntegral}}</text>
        <text class="spe-txt" v-if="openResult.lucky_num">恭喜您,中特殊号码额外送您{{openResult.add_rice}}积分</text>
        <text class="win-btn" @click="playAgain">再来一次</text>      
      </div>
      <div class="blank" v-if="priceShow"></div>
      <!-- 积分明细 -->
      <div class="record-box" v-if="recordShow" ref="recordAuto">
        <div class="record-title">
          <text class="title-txt-left">拼手气明细</text>
          <text class="title-txt-right">当前积分:{{this.userInfo.ricenum}}</text>
        </div>
        <scroller class="record-list" show-scrollbar="false">
          <div class="record-item" v-for="item in pointRecord">
            <text class="record-txt-left" style="width:300px;">{{item.time}}</text>
            <text :class="['record-txt-right',item.type == 0?'green':'red']">{{item.type == 0?'-'+item.number:'+'+item.number}}</text>    
          </div>
        </scroller>     
      </div>
      <text class="record-close" v-if="recordShow" @click="closeRecord">×</text>
    </div>
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
import { DIRECTION_ARROW, RED_PACKET, RAND } from 'common/js/icon-type'

export default {
  mixins: [Util],
  data(){
    return{
      arrowLeft: DIRECTION_ARROW[1],
      redPacketImg: RED_PACKET,
      rankImg: RAND,
      contentHeight: 2000, 
      userInfo: [],
      list: [],
      pointRecord: [],
      openResult: {},
      rankList: [],
      rule: [
        '每次拆包需要消耗相应的积分。',
        '抽中积分将直接增加至您的当前积分中。',
        '积米惠购在法律允许的范围内保留对本活动规则的最终解释权。',
      ],
      changeRicenum: 0,
      time: 2,
      maskShow: false,
      priceShow: false,
      recordShow: false,
      playStart: false
    }
  },
  created(){
    this.calcHeight();
    this.getData();
  },
  methods: {
    calcHeight(){
      storage.getItem('viewport', (e) => {
        if(e.result == "success"){
          this.contentHeight = JSON.parse(e.data).deviceHeight
        }
      })
    },
    getData(){
      storage.getItem('info', e => { //获取用户信息
        let data = e.data != 'undefined' && e.data;
        this.userInfo = JSON.parse(data);
      })  
      this.post('openpackage','getPackageList', {}, res => {  //获取红包列表
        if(res && res.success) {
          this.list = res.data;
        }
      })
      this.post('user', 'getIntegralRanking', {}, e => { //获取排名
        if(e && e.success) {
          this.rankList = e.data;
        }
      })
    },
    back(){
      this.close('true')
    },
    openRecord() { //获取记录列表
      this.post('openpackage','getRecordList', {}, e => {
        if(!e && !e.success) return;
        let data = e.data
        let now = new Date(Date.now())
        data.forEach(item => {
          let createTime = new Date(item.create_time * 1000)
          let date = formatDate(createTime).substring(5, 19)
          item.time = createTime.getDate() === now.getDate() ? `今天 ${date.split(' ')[1]}` : date
        })
        this.pointRecord = data;
      })
      this.recordShow = true;
      setTimeout(() => {
        var maskEl = this.$refs.mask; 
        var recordEl = this.$refs.recordAuto;
        this.animation(maskEl, { opacity: 1 }, 300, 0, 'ease', false, ()=>{});
      }, 200);
    },
    closeRecord() {
      this.recordShow = false;
    },
    openPacket(index, item) { //打开红包
      if(this.playStart) {
        modal.toast({message:'慢点!运气跟不上啦!'})
        return;
      }
      this.timer();
      this.post('openpackage','randIntegral', {id:item.id}, res => {
        if(!res.success){
          modal.toast({message:res.message});
          return;
        }
        Vue.set(this, 'openResult', res);
        !res.add_rice && (res.add_rice = 0)
        Vue.set(this, 'changeRicenum', res.add_rice+res.randIntegral-item.need_integral)
        let packetEl = this.$refs.packet[index];
        this.animation(packetEl, {transform: 'rotate(3deg) scale(1.1)'}, 5, 0, '', false, ()=>{
          this.animation(packetEl, {transform: 'rotate(-6deg) scale(1.1)'}, 5, 0, '', false, ()=>{
            this.animation(packetEl, {transform: 'rotate(6deg) scale(1.1)'}, 5, 0, '', false, ()=>{
              this.animation(packetEl, {transform: 'rotate(-3deg) scale(1.1)'}, 5, 0, '', false, ()=>{
                this.animation(packetEl, {transform: 'scale(1)'}, 60, 0, 'ease', false, ()=>{})
                this.tipWin();
              })
            })
          })
        });
      })
    },
    timer() {
      if(this.time > 0){
        this.time--;
        var timer = setTimeout(this.timer, 1000);
        this.playStart = true;
      }else if(this.time == 0){
        clearTimeout(timer);
        this.time =2;
        this.playStart = false;
      }
    },
    tipWin() { //红包结果动画
      this.priceShow = true;
      setTimeout(() => {
        var maskEl = this.$refs.mask; 
        var priceEl = this.$refs.priceAuto;
        this.animation(maskEl, { opacity: 1 }, 300, 0, 'ease', false, ()=>{});
        this.animation(priceEl, { transform: 'scale(0)'}, 0, 0, '', false, ()=>{
          this.animation(priceEl, { opacity: 1, transform: 'scale(1)' }, 300, 0, 'ease-in-out', false, ()=>{})
        });        
      }, 200);
    },
    playAgain(){
      this.priceShow = false;
      var changeEl = this.$refs.changeRice;
      this.animation(changeEl, { opacity: 1}, 0, 0, '', false, ()=>{
        this.animation(changeEl, { opacity: 0, transform: 'translateX(-100px)'}, 1000, 0, 'ease-in-out', false, ()=>{
          Vue.set(this.userInfo, 'ricenum', this.openResult.user_integral)
          storage.setItem('info', JSON.stringify(this.userInfo));
          const allMessage = new BroadcastChannel("allMessage");
          allMessage.postMessage({type: "riceChange", info: this.userInfo})
          this.animation(changeEl, { transform: 'translateX(100px)'}, 0, 0, '', false, ()=>{})
        })
      })
    },
    mask() {},
  },
  components: {
    Mask
  }
}
</script>

<style scoped>
.green {
  color: #20C35D;  
}
.red {
  color: rgb(255, 0, 0);  
}
.red-packet {
  position: relative;
  width: 750px;
  align-items: center;
  background-color: #25163a;
}
.packet-bg {
  position: relative;
}
.arrow-back {
  position: absolute;
  top: 60px;
  left: 4px;
  width: 74px;
  height: 74px;
}
.bg-top-img {
  width: 750px;
  height: 1060px;
}
.top-right-tip {
  position: absolute;
  bottom: 930px;
  right: 0;
  width: 130px;
  height: 50px;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
}
.tip-text {
  font-size: 22px;
  color: #ffffff;
}
.bg-mid-img {
  width: 750px;
  height: 610px;
}
.mid-con {
  position: absolute;
  left: 0;
  top: 410px;
  padding-top: 40px;
  padding-right: 50px;
  padding-left: 50px;
  width: 750px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
.mid-img {
  width: 200px;
  height: 260px;
  margin-bottom: 50px;
}
.con-top-txt {
  position: absolute;
  top: 20px;
  left: 0;
  width: 200px;
  text-align: center;
  color: red;
  font-size: 22px;
}
.con-mid-img {
  position: absolute;
  top: 60px;
  left: 0;
  width: 200px;
  height: 150px;
}
.con-btm-txt {
  position: absolute;
  bottom: 70px;
  left: 0;
  width: 200px;
  text-align: center;
  color: #ffffff;
  font-size: 20px;
}
.bg-btm-img {
  width: 750px;
  height: 60px;
}
.btm-points {
  position: absolute;
  top: 0;
  font-size: 30px;
  line-height: 60px;
  font-weight: bolder;
  color: #ffffff;
}
.points-txt {
  right: 375px;
}
.points-num {
  left: 385px;
}
.points-change {
  left: 500px;
  opacity: 0;
}
/* 战绩排名 */
.rand-box {
  margin-top: 50px;
  padding-bottom: 50px;
}
.con-rand {
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding-bottom: 10px;
}
.rand-img {
  width: 60px;
  height: 60px;
}
.rand-txt {
  width: 60px;
  font-size: 26px;
  color: #ffffff;
  text-align: center;
}
.rand-pic {
  width: 60px;
  height: 60px;
}
.rand-name {
  width: 200px;
  font-size: 26px;
  color: #ffffff;
  lines: 1;
  text-overflow: ellipsis;
}
.rand-num {
  width: 200px;
  font-size: 26px;
  color: #ffffff;
  lines: 1;
  text-overflow: ellipsis;
}
/* 积分规则 */
.rule-intro,.rule-rankinglist {
  width: 710px;
  margin-top: 50px;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 50px;
  border-radius: 30px;
}
.rule-rankinglist{
  background-color: #9060d1;
}
.rule-intro{
  background-color: #ffffff;
}
.into-tltle {
  height: 80px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #25163a;
  border-bottom-style: solid;
}
.tltle-pic {
  width: 60px;
  height: 30px;
  /* background-color: #cccccc; */
}
.tltle-txt,.tltle-txt1 {
  padding-left: 50px;
  padding-right: 50px;
  font-size: 30px;
  color: #ffffff;
}
.tltle-txt {
  color: #ffffff;
}
.tltle-txt1 {
  color: #333;
}
.into-con {
  padding-top: 30px;
  padding-left: 30px;
  padding-right: 30px;
}
.con-item {
  width: 690px;
  margin-bottom: 40px;
  flex-direction: row;
}
.con-pic {
  position: relative;
  top: 5px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #25163a;
}
.pic-txt {
  text-align: center;
  line-height: 30px;
  color: #ffffff;
  font-size: 20px;
}
.con-txt {
  width: 650px;
  padding-left: 20px;
  font-size: 24px;
  line-height: 36px;
  color: #333;
}
/* 中奖 */
.mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 750px;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
}
.auto {
  position: relative;
  width: 750px;
  justify-content: center;
  align-items: center;
  opacity: 0;
}
.win-img {
  width: 750px;
  height: 750px;
  margin-bottom: 30px;
}
.img-txt {
  position: absolute;
  left: 0;
  width: 750px;
  text-align: center;
  font-size: 60px;
  color: red;
}
.txt-abs {
  top: 450px;
}
.txt-abs-spe {
  top: 600px;
}
.spe-txt {
  padding-bottom: 20px;
  color: #ffffff;
  font-size: 24px;
}
.win-btn {
  width: 300px;
  height: 80px;
  border-radius: 20px;
  background-color: #b052e9;
  color: #ffffff;
  font-size: 30px;
  text-align: center;
  line-height: 80px;
  margin-top: 40px;
  margin-bottom: 60px;
  box-shadow: 0 5px 10px rgba(255, 255, 255, 0.1);
}
.blank {
  width: 750px;
  height: 300px;
}
/* 积分明细 */
.record-box {
  width: 550px;
  height: 700px;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  border-radius: 20px;
}
.record-title {
  width: 550px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;  
  height: 80px;
  padding: 0 20px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #cccccc;
}
.title-txt-left {
  font-size: 28px;
}
.title-txt-right {
  font-size: 24px;
  color: #666666;
}
.record-list {
  width: 550px;
  padding: 24px 30px; 
}
.record-item {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 50px;
}
.record-txt-left {
  font-size: 26px;
  color: #666666;  
}
.record-txt-right {
  font-size: 26px;
  color: red;
}
.record-close {
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.1);
  margin-top: 20px;
  border-radius: 40px;
  color: white;
  font-size: 40px;
}
</style>

