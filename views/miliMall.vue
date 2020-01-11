<template>
  <div class="miliMall">
    <scroller show-scrollbar="false" :style="{height:pageHeight+'px',paddingBottom: '100px'}" ref="list">
      <!-- 说明 -->
      <div class="bg">
        <image class="bg-img" :src="miliMallImg[0]" resize="cover"></image> 
        <div class="bg-content">
            <text class="bg-num-txt">{{user.ricenum}}</text>
          <text class="bg-txt" @click="toMiliRecord()">{{user.ricenum == '— —'?'请登录':'积分明细'}}</text>
        </div>
      </div>
      <!-- 积分玩法 -->
      <div class="mall-play between">
        <div class="play-item between" @click="toNext('sign')">
          <div class="play-con">
            <text class="play-title">签到领钱花</text>
            <text class="play-explain">100积分等于1元</text>
          </div>
          <image class="play-pic" :src="miliIcon[0]" resize="cover"></image> 
        </div>
        <div class="play-item between" @click="toNext('jimi')">
          <div class="play-con">
            <text class="play-title">积分购物</text>
            <text class="play-explain">积分当钱花</text>
          </div>
          <image class="play-pic" :src="miliIcon[1]" resize="cover"></image> 
        </div>
        <div class="play-item between" @click="toNext('luckyWheel')">
          <div class="play-con">
            <text class="play-title">积分抽奖</text>
            <text class="play-explain">iPhone XS</text>
          </div>
          <image class="play-pic" :src="miliIcon[2]" resize="cover"></image> 
        </div>
        <div class="play-item between" @click="toNext('duobao')">
          <div class="play-con">
            <text class="play-title">积分夺宝</text>
            <text class="play-explain">10积分中大奖</text>
          </div>
          <image class="play-pic" :src="miliIcon[3]" resize="cover"></image> 
        </div>
      </div>
      <!-- 积分抽奖宣传图 -->
      <image class="lucky-draw" :src="miliMallImg[1]" @click="toNext('redPacket')"></image>
      <!-- 规则介绍 -->
      <div class="rule-intro">
        <div class="into-tltle row">
          <image class="tltle-pic" :src="miliMallImg[2]"></image>
          <text class="tltle-txt">积分规则介绍</text>
          <image class="tltle-pic" :src="miliMallImg[2]"></image>      
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
    <!-- 头部变化层 -->
    <div class="head" :style="{height:statusbarHeight+100+'px',paddingTop:statusbarHeight+'px'}" @click="empty()">
      <div class="app_bar_bg" :style="{height:statusbarHeight+100+'px'}" ref="app_bar_bg"></div>
      <div class="hg-main-con row">
        <div class="hg-search row" ref="hg_search">
          <text class="hg-input" ref="hg_input">我的积分：{{user.ricenum}}</text>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const storage = weex.requireModule("storage");
const modal = weex.requireModule('modal')
import Navbar from 'base/navbar'
import { MILIMALL, MiLIICON } from 'common/js/icon-type'
import Binding from 'weex-bindingx';
import util from 'common/js/util'

export default {
  mixins: [util],
  components: { Navbar },
  data() {
    return {
      title: '积分商城',
      pageHeight: 1340,
      showBack: false,
      rule: [
        '问：什么是积分？ 答：积分是商城里使用的一种虚拟币，且积分只能在商城使用。',
        '问：积分有什么用？ 答：积分可以当钱花，100积分等于1块钱。还可以在商城兑换商品和参加各种活动。',
        '问：积分能用于购买淘宝商品吗？ 答：不能，如果您要购买淘宝商品，请先提现。',
        '问：在哪里提现？ 答：去个人中心点击我的积分，进入提现页面。',
        '问：提现里没看到提现金额？ 答：积分可以直接转化为金额提现。比例是 100：1',
      ],
      user: {
        ricenum: '— —',
      },
      miliMallImg: MILIMALL,
      miliIcon: MiLIICON,
    };
  },
  created() {
    var self = this;
    storage.getItem("viewport", (e) => {
      if (e.result == 'success') {
        self.pageHeight = JSON.parse(e.data).deviceHeight;
      }
    });
    const allMessage = new BroadcastChannel("allMessage");
    allMessage.onmessage = function(e){
      switch(e.data.type){
        case "riceChange":
        case "login":
          Vue.set(self, 'user', e.data.info);
          break;
        case "outLogin": 
          Vue.set(self.user, 'ricenum', '— —')
          break;
      }
    }
    // 获取米粒信息
    self.getData();
  },
  mounted() {
    setTimeout(()=>{
      this.bindingx();
    },20)
  },  
  methods: {
    toMiliRecord () {
      if(this.user.ricenum == '— —') {
        this.tbLogin();
      }else{
        this.open('miliRecord', 'true', () => { })
      }
    },
    toNext (page) {
      if (page == 'sign' && this.user.ricenum == '— —') {
        this.tbLogin()
        return
      }
      this.open(page, 'true', () => { })
    },
    // 获取数据
    getData() {
      storage.getItem('info', d => {
        if (d.result == 'success') {
          Vue.set(this, 'user', JSON.parse(d.data))
        }
      })
    },
    // 淘宝登录
    tbLogin() {
      var self = this;
      self.taoBaoLogin(d => {
        if (d.success) {
          if (d.data.openId == undefined || d.data.openId == 'undefined') {
            modal.toast({message:"授权登录失败"});
            return;
          }
          var user = {
            nick: d.data.nick, 
            openid: d.data.openId, 
            topaccesstoken: d.data.topAccessToken,
            pic_url: d.data.avatarUrl,
          }
          self.post('user', 'getUser', user, e => {
            if (e.success && e != undefined) {
              // 判断是否绑定手机号
              if (e.data.telphone == '0') {
                self.open('phoneLogin', 'true', () => { });
              }
              Vue.set(self,'user',Object.assign(user,e.data));
              let num = (Math.random() + 1) * 100000;
              Vue.set(self.user, 'pic_url', `${user.pic_url}&${num}`);              
              modal.toast({ message: '登录成功' });
              storage.setItem('info', JSON.stringify(self.user));
              const allMessage = new BroadcastChannel("allMessage");
              allMessage.postMessage({type:"login", info:self.user})              
            }else {
              modal.toast({ message: '登录失败,请重新登录！' })
            }
          })
        }
      })
    },
    // 动画函数区
    getEl(e) {
      return this['$refs'][e].ref;
    },
    bindingx() {
      this.searchBind= Binding.bind({
        eventType: 'scroll',
        anchor: this.getEl('list'),
        props: [
          {
            element: this.getEl('app_bar_bg'),
            property: 'opacity',
            expression: {
              origin: 'min(100,y)/100'
            }
          },
          {
            element: this.getEl('hg_input'),
            property: 'opacity',
            expression: {
              origin: 'min(100,y)/100'
            }
          },
        ]
      });
    },    
  },
};
</script>
<style scoped>
.miliMall {
  position: relative;
  background-color: #f1f1f1;
}
.row {
  flex-direction: row;
  align-items: center;
}
.between {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
 /* 说明 */
.bg {
  width: 750px;
  height: 280px;
  background-color: #ffffff;
  position: relative;
}
.bg-img {
  width: 750px;
  height: 280px; 
  background-image: linear-gradient(to bottom, #e5345f, #ef678e); 
}
.bg-content {
  position: absolute;
  bottom: 40px;
  left: 0;
  width: 750px;
  align-items: center;
}
.bg-num-txt {
  padding-bottom: 20px;
  font-size: 60px;
  color: #ffffff;
}
.bg-txt {
  padding: 5px 20px;
  border-width: 1px;
  border-color: #ffffff;
  border-style: solid;
  border-radius: 30px;
  color: #ffffff;
  font-size: 24px;
}

/* 积分玩法 */
.mall-play {
  width: 750px;
  padding-right: 20px;
  padding-left: 20px;
  padding-top: 20px;
  flex-wrap: wrap;
}
.play-item {
  width: 346px;
  height: 160px;
  margin-bottom: 20px;
  border-radius: 5px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}
.play-con {
  padding-left: 25px;
  justify-content: center;
}
.play-title {
  font-size: 30px;
  padding-bottom: 5px;
}
.play-explain {
  font-size: 18px;
  color: #969696;
}
.play-pic {
  width: 110px;
  height: 110px;
  margin-right: 25px;
  background-color: #cccccc;
}
/* 积分抽奖宣传图 */
.lucky-draw {
  width: 750px;
  height: 325px;
  background-color: #ccc;
  margin-bottom: 18px;
}
/* 积分规则 */
.rule-intro {
  background-color: #ffffff;
}
.into-tltle {
  width: 750px;
  height: 80px;
  justify-content: center;
  border-width: 1px;
  border-color: #f1f1f1;
  border-style: solid;
}
.tltle-pic {
  width: 60px;
  height: 30px;
  background-color: #cccccc;
}
.tltle-txt {
  padding-left: 50px;
  padding-right: 50px;
  font-size: 30px;
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
  background-color: #e5345f;
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
  color: #6e6e6e;
}
/* 积分兑换 */
.mall-change {
  width: 750px;
}
.change-title {
  width: 750px;
  height: 50px;
  padding-left: 20px;  
  line-height: 50px;
  font-size: 24px;
  color: #666666;
  background-color: #ffffff;
}
.change-item {
  width: 750px;
  padding-right: 30px;
  padding-left: 20px;  
  padding-bottom: 10px;
  padding-top: 10px;
  margin-bottom: 1px;
  background-color: #ffffff;
}
.change-img {
  width: 160px;
  height: 160px;
  background-color: #cccccc;
}
.change-con {
  width: 540px;
  height: 160px;
  padding-left: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  justify-content: space-between;
}
.change-txt {
  lines: 1;
  max-width: 500px;
  text-overflow: ellipsis;  
  font-size: 24px;
  color: #333333;
}
.change-mili {
  font-size: 28px;
  color: #FC3C2B;
}
.change-num {
  font-size: 20px;
  color: #999999;
}

/* 头部 */
.head {
  width: 750px;
  position: absolute;
  top: 0;
}
.app_bar_bg {
  width: 750px;
  height: 100px;
  background-color: #e5345f;
  position: absolute;
  top: 0;
  opacity: 0;
}
.hg-main-con {
  width: 750px;
  padding-top: 20px;
  padding-bottom: 20px;
  justify-content: center;
}
.hg-search {
  width: 730px;
  height: 60px;
}
.hg-search-img {
  width: 40px;
  height: 40px;
  margin: 10px;
}
.hg-input {
  width: 400px;
  height: 60px;
  padding-left: 20px;
  line-height: 60px;
  font-size: 34px;
  opacity: 0;
  color: #ffffff;
}

</style>





