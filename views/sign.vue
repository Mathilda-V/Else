<template>
  <div class="sign">
    <div :style="{paddingTop:statusbarHeight+'px',backgroundImage:'linear-gradient(to right, #6ca9ff, #6c9dff)'}" >
      <wxc-minibar background-color="">
        <image :src="arrowLeft" slot="left"  style="width:60px;height:60px;"/>
        <text slot="middle" class="middle-txt">签到</text>
      </wxc-minibar>
    </div>    
    <!-- 说明 -->
    <div class="bg">
      <image class="bg-img" :src="signImg[0]" resize="cover"></image> 
      <text class="bg-txt">签到赢好礼</text>
      <div class="bg-num">
        <text class="bg-num-txt">积分:{{user.ricenum}}</text>
      </div>
    </div>

    <!-- 内容 -->
    <div class="sign-con">
      <text class="sign-head">已连续签到{{user.contisign}}天</text>
      <div class="sign-day row">
        <div v-for="(item, index) in signDay" :key="index">
          <!-- 签到成功 -->
          <div class="day-item circle-red" v-if="item.status=='before'">
            <text class="day-item-date color-white">{{item.date}}</text>
            <text class="day-item-week color-white">✓</text>
          </div>
          <!-- 今天签到 -->
          <div class="day-item circle-yellow" v-else-if="item.status=='today'">
            <text class="day-item-date color-red">{{item.date}}</text>
            <text class="day-item-week color-red">{{item.week}}</text>
          </div>  
          <!-- 未签到 -->
          <div class="day-item circle-yellow" v-else-if="item.status=='after'">
            <text class="day-item-date color-gray">{{item.date}}</text>
            <text class="day-item-week color-gray">{{item.week}}</text>
          </div>                   
        </div>                             
      </div>
      <text class="sign-rate">明天签到将获得</text>
      <div class="sign-add row">
        <image class="sign-add-img" :src="signImg[1]" resize="cover"></image>
        <text class="sign-add-txt">+{{nextAddRice}}</text>
      </div>
      <text class="sign-btn" :class="[user.is_login=='0'?'bg-blue':'bg-red']" @click="toSign()">{{user.is_login=='0'?'签到':'已签到'}}</text>
      <!-- 签到特效 -->
      <text class="jump" :style="{left: jumpIndex*100+50+'px'}" ref="jump">+{{addRice}}</text> 
    </div>
    <!-- 自动签到弹窗 -->
    <div class="mask" v-if="show" ref="mask">
      <div class="auto" ref="auto">
        <image class="auto-img" :src="signImg[2]" resize="cover"></image>
        <div class="auto-con">
          <text class="auto-day">您已经连续签到{{parseInt(user.contisign)+1}}天</text>
          <image class="auto-gold" :src="signImg[3]" resize="cover"></image>
          <text class="auto-rice">积分</text>
          <text class="auto-btn bg-blue" @click="toClose()">我知道了</text>
          <text class="auto-ricenum">+{{addRice}}</text>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const modal = weex.requireModule('modal') 
const animation = weex.requireModule('animation')
const storage = weex.requireModule('storage')
import { WxcMinibar } from 'weex-ui';
import { DIRECTION_ARROW, TO_SIGN } from 'common/js/icon-type'
import util from 'common/js/util'

export default {
  mixins: [util],
  components: { WxcMinibar },
  data() {
    return {
      arrowLeft: DIRECTION_ARROW[1],
      signImg: TO_SIGN,
      signDay: [],
      user:{
        ricenum: '0',
        contisign: '0',
        is_login: '0'
      },
      endRice: "10",
      addRice: "10",
      today:"",
      jumpIndex: "",//特效
      week:['周日','周一','周二','周三','周四','周五','周六'],
      show: true
    };
  },
  created() {
    this.showTime(this.user.contisign)
    this.getData(); // 获取米粒信息
  },
  
  methods: {
    rightClick() {
      this.open('signHelp', 'true', () => { })
    },  
    getData() { // 获取数据
      this.post('user','getUserInfoBySessionID', {}, res=>{
        if(!res.success) this.show = false;
        this.user = res.data;
        this.showTime(res.data.contisign);
        if(res.data.is_login == "0"){
          this.toSign()
        }
      })
    },
    // 显示时间
    /**
     * @contisign 已经签到的天数··
     */
    showTime(e) {
      this.signDay = [];
      var today = new Date();
      var contisign = e > 6 ? 6 : e;
      if(this.user.is_login == "1") {
        contisign = e > 6 ? 6 : e-1;
      }
      var firstDay= today-(contisign * 24 * 60 * 60 * 1000);
      for(var i = 0; i <= 6; i++) {
        var ms, nextDay, m, d, day, week, status
        ms = firstDay + i * 24 * 60 * 60 * 1000;
        nextDay = new Date(ms);
        m = nextDay.getMonth() + 1;
        d = nextDay.getDate();
        m < 10 && (m = `0${m}`)
        d < 10 && (d = `0${d}`)
        day =  `${m}.${d} `
        week = this.week[nextDay.getDay()];
        if( i < contisign) { // 已签到
          status = "before"
        }else if(i == contisign) { // 今天
          day = "今天"
          status = this.user.is_login == "0"?"today":"before" 
          this.today = i      
        }else { // 未签到
          status = "after"           
        } 
        this.signDay.push({date: day, week: week, status: status})
      }
      if(this.user.signRiceNum == undefined) return; 
      var a = parseInt(contisign) + 1; // 增加米粒key
      this.nextAddRice = this.user.signRiceNum[a+1]
      this.addRice = this.user.signRiceNum[a]
      this.jumpIndex = parseInt(contisign);
    },
    toSign() { // 签到
      if(this.user.is_login == "1") return; 
      this.post('user','singForRice', {}, e=>{
        if(!e.success){
          modal.toast({"message": e.message});
          return;
        }
        this.endRice = e.rice;
        var maskEl = this.$refs.mask; // 自动签到弹窗动画
        var autoEl = this.$refs.auto;
        this.animation(maskEl, { opacity: 1 }, 300, 0, 'ease', false, ()=>{})
        this.animation(autoEl, { transform: 'scale(0)'}, 0, 0, '', false, ()=>{
          this.animation(autoEl, { opacity: 1, transform: 'scale(1)' }, 300, 0, 'ease-in-out', false, ()=>{})
        })               
      })      
    },
    toClose() {
      this.show = false;
      setTimeout(() =>{
        var jumpEl = this.$refs.jump;
        this.animation(jumpEl, {opacity: 1, transform: 'translateY(-35px) scale(1.5)' }, 1000, 0, 'ease-out', false, ()=>{})
        this.animation(jumpEl, {opacity: 0, transform: 'translateY(-35px) scale(1.5)' }, 500, 1000, 'linear', false, ()=>{})              
        this.user.contisign++;
        this.user.nick = this.user.tbnick;
        this.user.ricenum = this.endRice;
        this.user.is_login = "1";
        var today = this.today
        this.signDay[today].status = "before"
        storage.setItem('info', JSON.stringify(this.user));
        const allMessage = new BroadcastChannel("allMessage");
        allMessage.postMessage({type: "riceChange", info: this.user})
      }, 500)
    }
  },
};
</script>
<style scoped>
.sign {
  background-color: #f1f1f1;
}
.row {
  flex-direction: row;
}
.circle-red {
  border-color: #ff4153;
  background-color: #ff4153;
}
.circle-yellow {
  border-color: #ffec6f;
  background-color: #ffffff;
}
.bg-red {
  background-color: #ff4153;  
}
.bg-blue {
  background-color: #6c9dff;
}
.circle-img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
}
.color-white {
  font-size: 20px;
  color: #ffffff;
}
.color-red {
  font-size: 20px;
  color: #ff4153;
}
.color-gray {
  font-size: 20px;
  color: #999999;
}
.middle-txt {
  font-weight: 400;
  font-size: 34px;
  color: #ffffff;
}
.right-txt{
  font-size: 24px;
  color: #ffffff;
}
 /* 说明 */
.bg {
  width: 750px;
  height: 400px;
  background-color: #ffffff;
  position: relative;
}
.bg-img {
  width: 750px;
  height: 400px; 
  background-image: linear-gradient(to right, #6ca9ff, #6c9dff); 
}
.bg-txt {
  position: absolute;
  top: 150px;
  left: 0;
  width: 750px;
  text-align: center;
  color: #ffffff;
  font-size: 40px;
}
.bg-num {
  position: absolute;
  bottom: 100px;
  left: 0;
  width: 750px;
  align-items: center;
  justify-content: center;
}
.bg-num-txt {
  width: 236px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  font-size: 28px;
  font-weight: bold;
  color: #ffffff;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 25px;
}
/* 内容 */
.sign-con {
  position: relative;
  width: 750px;
  padding-top: 30px;
  padding-bottom: 30px;
  background-color: #ffffff;
  align-items: center;
}
.sign-head {
  text-align: center;
  font-size: 28px;
  color: #fe4353;
  height: 68px;
}
.sign-day {
  justify-content: space-between;
  width: 750px;
  padding-left: 25px;
  padding-right: 25px;
}
.day-item {
  width: 90px;
  height: 90px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border-width: 2px;
  border-style: solid;
  border-color: #ff4153;
}
.sign-rate {
  width: 750px;
  padding-top: 30px;
  padding-bottom: 20px;
  text-align: center;
  font-size: 28px;
}
.sign-add {
  width: 750px;
  padding-bottom: 30px;
  justify-content: center;
  align-items: center;
}
.sign-add-img {
  width: 40px;
  height: 40px;
  background-color: #ffffff;
}
.sign-add-txt {
  padding-left: 5px;
  font-size: 28px;
}
.sign-btn {
  width: 346px;
  height: 70px;
  line-height: 70px;
  text-align: center;
  font-size: 30px;
  color: #ffffff;
  border-radius: 35px;
}
/* 签到特效 */
.jump {
  position: absolute;
  top: 95px;
  opacity: 0;
  width: 50px;
  color: #ff3c30;
  font-size: 22px;
  text-align: center;
}
/* 自动签到弹窗 */
.mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 750px;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
}
.auto {
  width: 480px;
  border-radius: 20px;
  opacity: 0;
}
.auto-img {
  width: 480px;
  height: 136px;
}
.auto-con {
  position: relative;
  width: 480px;
  padding-top: 10px;
  padding-bottom: 40px;
  align-items: center;
  background-color: #ffffff;
}
.auto-day {
  color: #999999;
  font-size: 26px;
}
.auto-gold {
  width: 120px;
  height: 120px;
  margin-top: 30px;
  margin-bottom: 30px;
}
.auto-rice {
  font-size: 26px;
  padding-bottom: 50px;
}
.auto-btn {
  width: 400px;
  height: 70px;
  line-height: 70px;
  text-align: center;
  font-size: 30px;
  color: #ffffff;
  border-radius: 10px;
}
.auto-ricenum {
  position: absolute;
  top: 115px;
  width: 480px;
  text-align: center;
  color: #ffffff;
  font-size: 28px;
}
</style>





