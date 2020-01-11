<template>
  <scroller show-scrollbar="false" :style="{height: contentHeight + 'px'}">
    <div class="bar" :style="{paddingTop:statusbarHeight}">
      <text class="bar-set" @click="toNext('userSettings')">设置</text>
    </div>
    <div>
      <!-- 用户信息 -->
      <div class="info row" @click="tbLogin">
        <image class="info-pic" :src="user.pic_url" ressize="contain" ></image>
        <div class="info-con">
          <div class="row">
            <text class="name">{{user.nick}}</text>
            <image class="more-img" :src="vipIcon[1]"></image>
          </div>
          <text class="status" @click="copyCode">点击复制邀请码：DADFEC</text>
        </div>
        <div class="more" @click="toNext('member')">
          <div class="more-box between">
            <div class="row">
              <image class="more-img" :src="vipIcon[0]"></image>
              <text class="more-left">开通高级权限</text>
            </div>
            <text class="more-right">查看详情 ></text>
          </div>
        </div>
      </div>
      <!-- 我的资产 -->
      <div class="my-money box row">
        <div class="box-con" v-for="(item, index) in listMoney" :key="index" @click="toNext(item.url)">
          <text class="money-spe" v-if="index==0">{{item.txt}}元</text>
          <image class="box-pic-big" v-else :src="item.img"></image>
          <text class="box-txt">{{item.con}}</text>
        </div>               
      </div>
      <!-- 收益详情 -->
      <!-- <div class="order">
        <div class="div-order-head between">
          <text class="txt-order-title">广告收益</text>
          <div class="row">
            <text class="txt-order-time" >2019-02-01</text>
          </div>
        </div>
        <div class="my-money box row">
          <div class="box-con" v-for="(item, index) in listProfit" :key="index" @click="toNext(item.url)">
            <text :class="['profit-spe', index==0?'':(index==1?'cred':(index==2?'corange':''))]">{{item.txt}}{{item.txt1}}</text>
            <text class="box-txt">{{item.con}}</text>
          </div>
        </div>
      </div> -->
      <!-- 积米订单 -->
      <!-- <div class="order">
        <div class="div-order-head between">
          <text class="txt-order-title">积分商城订单</text>
          <div class="row">
            <text class="txt-order-num" v-if="user.openid != undefined">共{{dot[0]}}单</text>
          </div>
        </div>
        <div class="box row">
          <div class="box-con relative" v-for="(item,index) in orderJm" :key="index" @click="toOrder(index)">
            <image class="box-pic-big" :src="item.img" />
            <text class="box-txt">{{item.con}}</text>
            <div class="dot" v-if="dot[index] >0&&dot[index]">
              <text class="dot-num">{{dot[index]}}</text>
            </div>
          </div>
        </div>
      </div> -->
      <!-- 淘宝订单 -->
      <div class="list">
        <div class="list-item between" v-for="(item, index) in orderTb" :key="index" @click="toOrderTb(index)">
          <div class="row">
            <image class="box-pic-mid" :src="item.img"></image>
            <text class="list-item-title">{{item.con}}</text>
          </div>
          <image class="box-pic-small" :src="arrowRight"></image>
        </div>            
      </div>
      <!-- 其他 -->
      <div class="list">
        <div class="list-item between" @click="toNext('help')">
          <div class="row">
            <image class="box-pic-mid" :src="guideIcon"></image>
            <text class="list-item-title">领券指南</text>
          </div>
          <image class="box-pic-small" :src="arrowRight"></image>
        </div> 
      </div>
      <div class="list">
        <div class="list-item between" @click="toNext('feedback')">
          <div class="row">
            <image class="box-pic-mid" :src="feedbackIcon"></image>
            <text class="list-item-title">意见反馈</text>
          </div>
          <image class="box-pic-small" :src="arrowRight"></image>
        </div>            
      </div>      
      <div class="list">
        <div class="bsaeline">
          <text class="bsaeline-text">我是有底线的</text>
        </div>
      </div>
    </div>
  </scroller>
</template>
<script>
const storage = weex.requireModule('storage')
const modal = weex.requireModule('modal')
const clipboard = weex.requireModule('clipboard')
import util from 'common/js/util'
import { WxcOverlay } from 'weex-ui';
import * as icons from 'common/js/icon-type'

export default {
  mixins: [util],
  components: { WxcOverlay },
  data() {
    return {
      arrowRight: icons.DIRECTION_ARROW[0],
      signIcon: icons.SIGN,
      guideIcon: icons.GUIDE,
      feedbackIcon: icons.FEEDBACK,
      vipIcon: icons.VIP,
      contentHeight: 2000,
      listMoney: [
        { con: '我的资产', txt: '120.0', url: 'myMoney' },
        { con: '收益报表', img: icons.PARTNER.RECORD, url: 'incomeList'},
        { con: '我的合伙人', img: icons.PARTNER.PARTNER, url: 'partner' },
        { con: '邀请码', img: icons.PARTNER.INVITATION, url: 'userCode' },
      ],
      // listProfit: [
      //   { con: '已完成', txt: '10.8',txt1: '元',  },
      //   { con: '昨日收益', txt: '0.4',txt1: '元', },
      //   { con: '助力', txt: '0',txt1: '人',  },
      // ],
      orderTb: [
        { con: '商品收藏', img: icons.COLLECTION },
        { con: '淘宝订单', img: icons.TB_ORDER },
        { con: '淘宝购物车', img: icons.TB_CART },
        { con: '我的足迹', img: icons.HISTORY },
      ],
      // orderJm: [
      //   { con: '全部订单', img: icons.ALL_ORDER }, 
      //   { con: '待发货', img: icons.WAIT_SEND }, 
      //   { con: '待收货', img: icons.WAIT_RECEIVE }, 
      //   { con: '退款', img: icons.REFOUND }
      // ],
      user:{ 
        nick: '未登录',
        pic_url: icons.DEFAULT_IMG,
        contisign: '0',
        is_login: '0'
      },
      dot: [0, 0, 0, 0]
    }
  },
  created() {
    this.calcHeight();
    var self = this
    storage.getItem('info', d => { // 淘宝已登录未退出
      if (d.result == 'success') {
        var user = JSON.parse(d.data);
        if (!user.openid || user.openid == '' || user.openid == 'undefined') {
          return;
        }
        this.login(user,false);
      }
    })
    const allMessage = new BroadcastChannel("allMessage");
    allMessage.onmessage = function(e){
      switch(e.data.type){
        case "login":
          Vue.set(self, 'user', e.data.info)
          self.getCollectId();
          break;          
        case "outLogin": 
          self.user = { nick: '未登录',
                        pic_url: icons.DEFAULT_IMG,
                        contisign: '0',
                        is_login: '0'
                      },
          self.dot = [0, 0, 0, 0]
          storage.removeItem('info', d => {})            
      }
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
    tbLogin() {
      if (this.user.nick != '未登录'&&this.user.openid!=undefined) return;
      this.taoBaoLogin(d => {
        if (d.success) {
          var user = {
            nick: d.data.nick, 
            openid: d.data.openId, 
            topaccesstoken: d.data.topAccessToken,
            pic_url: d.data.avatarUrl,
          }
          this.login(user,true);
        }else{
          modal.toast({message:"授权登录失败"});
        }
      })
    },
    login(user,islogin){
      var self = this;
      this.post('user', 'getUser', user, e => {
        if (e.success && e != undefined) {          
          Vue.set(this,'user',Object.assign(user,e.data));
          let num = (Math.random() + 1) * 100000;
          Vue.set(this.user, 'pic_url', `${user.pic_url}&${num}`);
          if(islogin){
            modal.toast({ message: '登录成功' });
            const allMessage = new BroadcastChannel("allMessage");
            allMessage.postMessage({type: "login", info:self.user})
            if (e.data.telphone == '0') {//未绑定手机号，打开绑定界面
              self.open('phoneLogin', 'true', () => { });
            }
          }
          storage.setItem('info', JSON.stringify(self.user));
          this.getCollectId()
        }else {
          modal.toast({ message: '登录失败,请重新登录！' })
          storage.removeItem('info', d => {});
        }
      });
    },
    toOrderTb(i) { // 打开淘宝订单
      if (i == 3) {
        this.open('history', 'true', () => {}) 
        return
      }
      if (this.user.openid == undefined) {
        this.tbLogin()
        return
      }
      switch(i){
        case 0:
          this.open('goodsCollection', 'true', () => {})
          break;
        case 1: 
          storage.setItem('tbInfo', JSON.stringify({title: '淘宝订单', type: 'order', value: '0'}));
          this.open('tbRelative', 'true', () => {})
          break;
        case 2: 
          storage.setItem('tbInfo', JSON.stringify({title: '淘宝购物车', type: 'cart', value: ''}));
          this.open('tbRelative', 'true', () => {})
          break;
        default:
          break;
      }
    },
    getCollectId(){
      this.post('collection', 'getGoodNumiid', {}, res => {
        if(res.success) {
          storage.setItem('collectId', JSON.stringify(res.data))
        }
      });
      this.post('order', 'getOrders', {}, res => { //相关订单数量
        if (res.success && res != undefined) {
          var orderAll = res.data;
          var sendNum = 0; var receiveNum = 0
          orderAll.forEach(v=>{
            if(v.order_status == '0') {
              sendNum++
            }else if(v.order_status == '2') {
              receiveNum++
            }
          })
          this.dot = [orderAll.length, sendNum, receiveNum, 0]
        }
      })
    },
    toOrder(i) {// 打开积米订单
      if (this.user.openid == undefined) {
        this.tbLogin()        
        return 
      }
      if (i === 3) {
        this.open('refundOrder', 'true', () => { })
      } else {
        storage.setItem('index', JSON.stringify(i), d => {
          if (d.result === 'success') {
            this.open('myOrder', 'true', () => { })
          }
        })
      }
    },
    copyCode() { 
      var copyCon = ``;
      clipboard.setString(copyCon);
      modal.toast({message:"复制成功！"})
    },
    toNext (e){
      if(e != "help" && this.user.openid == undefined ){
        this.tbLogin()
        return        
      }
      this.open(e, 'true', () => { })
    },
  }
}
</script>
<style scoped>
.row {
  flex-direction: row;
  align-items: center;
}
.between {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.box {
  width: 750px;
  padding-top: 30px;
  padding-bottom: 30px;
  background-color: #ffffff;
}
.box-con {
  flex: 1;
  align-items: center;
  border-right-color: #eee;
  border-right-width: 1px;

}
.box-pic-small {
  width: 30px;
  height: 30px;
}
.box-pic-mid {
  width: 40px;
  height: 40px;
}
.box-pic-big {
  width: 60px;
  height: 60px;
}
.box-txt {
  margin-top: 20px;
  font-size: 22px;
  color: #666666;    
}
.box-txt1 {
  margin-top: 20px;
  font-size: 22px;
  color: #e5345f;    
}
.relative {
  position: relative;
}
.cred{
  color: #e5345f;
}
.corange{
  color:orange;
}
/* 头部 */
.bar {
  width: 750px;
  flex-direction: row-reverse;
  background-color: #e5345f;
}
.bar-set {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 20px;
  padding-left: 20px;
  color: #ffffff;
  font-size: 30px;
}
/* 用户信息 */
.info {
  position: relative;
  width: 750px;
  padding-right: 20px;
  padding-bottom: 110px;
  padding-left: 20px;
  background-color: #e5345f;
} 
.info-pic {
  width: 100px;
  height: 100px;
  border-radius: 100px;      
}
.info-con {
  padding-left: 20px;
  flex-direction: column;
  justify-content: space-between;
}
.name {
  font-size: 32px;
  line-height: 50px;
  color: #ffffff;
  margin-right: 20px;
}
.status {
  height: 30px;
  margin-top: 10px;
  font-size: 22px;
  color: #ffffff;
}
.more {
  position: absolute;
  bottom: 0;
  left: 20px;
  width: 710px; 
  height: 80px;
  padding-top: 10px;
  background-color: #111111;
  /* background-image: linear-gradient(to left,#111,#333); */
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}
.more-box{
  width: 688px; 
  height: 70px;
  padding-left: 20px;
  padding-right: 20px;
  border-top-color: #6f614a;
  border-top-width: 1px;
  border-left-color: #6f614a;
  border-left-width: 1px;
  border-right-color: #6f614a;
  border-right-width: 1px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  margin-left: 10px;
}
.more-img {
  width: 40px;
  height: 40px;
  /* background-color: #cccccc; */
}
.more-left {
  padding-left: 10px;
  font-size: 24px;
  color: white;
}
.more-right {
  padding: 5px 30px;
  background-color: #d6ae6e;
  color: #382609;
  font-size: 20px;
  border-radius: 20px;
}
/* 我的财产 */
.my-money {
  margin-bottom: 10px;
}
.money-spe {
  width: 250px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 30px;
  color: #e5345f;
}
/* 我的收益 */
.profit-spe {
  width: 250px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 30px;
}
/* 积米订单 */
.order {
  width: 750px;
  margin-bottom: 10px; 
  background-color: #ffffff;
}
.div-order-head {
  width: 750px;
  height: 60px;
  padding-right: 20px;
  padding-left: 20px;
  border-bottom-width : 1px;
  border-bottom-style: solid;
  border-bottom-color: #f1f1f1;
}
.txt-order-title {
  font-size: 24px;
  color: #333333;
}
.txt-order-num {
  font-size: 20px;
  color: #999999;
  padding-right: 5px;
}
.txt-order-time {
  font-size: 20px;
  color: white;
  padding-right: 5px;
  background-color: #f3884d;
  border-radius:15px;
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
  padding-right: 10px;
}
.dot {
  width: 26px;
  height: 26px;
  border-width: 2px;
  border-style: solid;
  border-color: #f3884d;
  border-radius: 13px;
  position: absolute;
  top: 0px;
  left: 130px;  
} 
.dot-num {
  color: #f3884d;
  line-height: 24px;
  text-align: center;       
  font-size: 18px;
}     
/* 其他    */
.list {
  margin-bottom: 10px;
}
.list-item {
  width: 750px;
  padding-top: 20px;
  padding-right: 20px; 
  padding-bottom: 20px;
  padding-left: 20px; 
  margin-bottom: 1px;
  background-color: #ffffff;       
}
.list-item-title {
  font-size: 24px;
  color: #333333;
  padding-left: 10px;
}
.list-item-else {
  font-size: 24px;
  color: #999999;
  padding-right: 5px;
}
.bsaeline {
  width: 750px;
  justify-content: center;
  align-items: center;     
}
.bsaeline-text{
  height: 80px;
  line-height: 80px;
  font-size: 20px;
  color: #999;
}
</style>

