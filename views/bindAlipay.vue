<template>
  <div class="bindAlipay">
    <navbar :title="title"></navbar>
    <div class="head row btw">
      <image class="head-img" src=""></image>
      <image class="head-img" src=""></image>
      <image class="head-img" src=""></image>
    </div>
    <div class="box">
      <div class="box-item row">
        <text class="item-txt">支付宝</text>
        <input class="item-txt-spe" type="text" placeholder="请前往设置中心绑定" placeholder-color="#e5345f" return-key-type="next" value=""> </input>
      </div>
      <div class="box-item row">
        <text class="item-txt">提现金额</text>
        <input class="item-input" v-model="cashMoney" type="text" return-key-type="next" value=""> </input>
      </div>
      <div class="box-item row btw">
        <input class="item-input" type="number" placeholder="请输入验证码" return-key-type="next" value=""> </input>
        <text :class="['item-btn', disabled?'bg-gray':'bg-red']" @click="sendSmsCode">{{btnContent}}</text>
      </div>
    </div>
    <div class="cash-btm" @click="goCash">
      <text :class="['cash-btn', cashNum?'bg-red':'bg-gray']">提现{{cashNum?'￥'+cashNum:''}}</text>
    </div>
  </div>
</template>
<script>
const storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");
import navbar from "base/navbar";
import util from "common/js/util";

export default {
  mixins: [util],
  components: { navbar,  },
  data() {
    return {
      title: "提现",
      btnContent: '获取验证码',
      cashMoney: 0,
      time: 0,  
      disabled: false, 
    };
  },
  created() {
    storage.getItem('cashMoney', e => {
      if(e.result == 'success'){
        this.cashMoney = e.data
      }
    })
  },
  methods: {
    sendSmsCode() { // 获取验证码
      // if(!this.disabled){
      //   var reg = 11&& /(^(13|14|15|17|18)[0-9]\d{8})$/;
      //   if(!phoneNum){
      //     modal.toast({"message":"请输入手机号码"});
      //     return;
      //   }else if(!reg.test(phoneNum)){
      //     modal.toast({"message":"您输入的手机号码不合法，请重新输入"});
      //   }else{
          this.time = 60;
          this.timer();
          // this.post('user','sendMessage',{phone:phoneNum}, res=>{
          //   if(!res.success){
          //     modal.toast({message:res.message});
          //   }else{
          //     this.timer();
          //   }
          // });
        // }
      // }
    },
    timer() {
      if(this.time>0){
        this.time--;
        this.btnContent = this.time+"s后重新获取";
        this.disabled = true;
        var timer = setTimeout(this.timer,1000);
      }else if(this.time == 0){
        this.btnContent = "获取验证码";
        clearTimeout(timer);
        this.disabled = false;
      }
    },
  },
};
</script>
<style scoped>
.row {
  flex-direction: row;
  align-items: center;
}
.btw {
  justify-content: space-between;
}
.bg-red {
  background-color: #e5345f;
  color: #ffffff;
}
.bg-gray {
  background-color: #cccccc;
  color: #999999;
}
.color-red {
  color: #e5345f;
}
.bindAlipay {
  background-color: #f1f1f1;
}
.head {
  width: 750px;
  height: 300px;
  padding-left: 150px;
  padding-right: 150px;
  margin-bottom: 20px;
  background-color: #ffffff;
}
.head-img {
  width: 100px;
  height: 100px;
  background-color: #cccccc;
}
.box {
  width: 750px;
  padding-right: 20px;
  padding-left: 20px;
  background-color: #ffffff;
}
.box-item {
  padding: 20px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #f1f1f1;
}
.item-txt {
  width: 200px;
  line-height: 80px;
  font-size: 32px;
  color: #666666;
}
.item-txt-spe {
  width: 400px;
  line-height: 80px;
  font-size: 32px;  
}
.item-input {
  width: 400px;
  line-height: 80px;
}
.item-btn {
  width: 250px;
  line-height: 80px;
  border-radius: 30px;
  text-align: center;
  font-size: 26px;
  color: #ffffff;
  background-color: #e5345f;
}
.cash-btm {
  width: 750px;
  text-align: center;
  align-items: center;
  padding: 100px;
}
.cash-btn {
  width: 550px;
  text-align: center;
  line-height: 90px;
  margin-top: 20px;
  border-radius: 60px;
  background-color: #ffffff;
  font-size: 30px;
}
</style>   