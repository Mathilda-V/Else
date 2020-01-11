<template>
  <div>
    <navbar :title="title"></navbar>
    <div show-scrollbar="false" >
      <text class="ui-box">为了您的安全起见，请绑定手机号</text>
      <div class="ui-box1">
        <input class="ui-input" type="number" autofocus="" placeholder="请输入手机号" v-model="del"></input>
      </div>
      <div class="ui-box1 ui-row">
        <input class="ui-input1" type="number" autofocus="" placeholder="请输入验证码"  v-model="verifyNum"></input>
        <text  :class="[disabled ? 'actbutton' : 'button']"  @click="sendSmsCode">{{btnContent}}</text>
      </div>
      <div class="ui-box2">
        <text class="ui-sigin" @click="verificationCode">绑定</text>
      </div>
    </div>
  </div>
</template>

<script>
  var storage = weex.requireModule('storage')
  var modal = weex.requireModule('modal')
  import navbar from "base/navbar";
  import {WxcMinibar} from 'weex-ui';
  import util from "common/js/util"  
  
  export default {
    mixins:[util], 
    data() {
      return {
        title: '绑定',
        btnContent: '获取验证码', //获取验证码按钮内文字
        del: '',
        verifyNum: '', //验证码
        phoneNum:"", //手机号
        time:0, //发送验证码间隔时间
        disabled:false, //按钮状态
      }
    },
    methods: {
      // 获取验证码
      sendSmsCode(){
        if(!this.disabled){
          var reg = 11&& /(^(13|14|15|17|18)[0-9]\d{8})$/;//手机号正则验证
          this.phoneNum = this.del;
          var phoneNum = this.phoneNum;
          if(!phoneNum){//未输入手机号
            modal.toast({"message":"请输入手机号码"});
            return;
          }else if(!reg.test(phoneNum)){//手机号不合法
            modal.toast({"message":"您输入的手机号码不合法，请重新输入"});
            this.del = ''
          }else{
            this.time = 60;
            // 获取验证码请求
            this.post('user','sendMessage',{phone:phoneNum}, res=>{
              if(!res.success){
                modal.toast({message:res.message});
              }else{
                this.timer();
              }
            });
          }
        }
      },
      timer(){
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
      // 验证验证码
      verificationCode(){
        var self = this;
        self.phoneNum = self.del
        var phoneNum = self.phoneNum;//手机号
        var verifyNum = self.verifyNum;//验证码
        self.post('user','checkCode',{code:verifyNum},res=>{
          modal.toast({message: res.message});
          if(res.success){
            storage.getItem('info', d => {
              if (d.result == 'success') {
                var user = JSON.parse(d.data);
                user.telphone = phoneNum;
                storage.setItem('info', JSON.stringify(user));
              }
            })
            //发送信息--手机号改变
            self.close( 'true', () => {
              const rphone = new BroadcastChannel('phoneLogin')
              rphone.postMessage({telphone: phoneNum})
            });
          }
        });
      }
    },
    components: { navbar, }
  }
</script>

<style scoped>
.titleColor{
  color:#FFFFFF;
}
.titleStyle{
  font-weight:bold;
  font-size:35px;
}
.tabStyle{
  padding-top:40px;
  height:130px;
}
.ui-row{
  flex-direction:row;
  justify-content:space-between;
}
.ui-box{
  justify-content:center;
  padding-top:100px;
  padding-bottom:20px;
  font-size:36px;
}
.ui-img{
  width:200px;
  height:200px;
  background-color:#eeeeee;
  border-radius:15px;
}
.ui-box,.ui-box1,.ui-box2{
  padding-left:80px;
  padding-right:80px;
  margin-bottom:40px;
}
.ui-box1{
  margin-bottom:40px;
}
.ui-box2{
  margin-top:40px;
  margin-bottom:80px;
}
.ui-input,.ui-input1{
  border-style:solid;
  border-width:1px;
  border-color:#cccccc;
  padding:30px;
  border-radius:10px;
}
.ui-input1{
  width:320px;
}
.ui-input:active{
  border-style:solid;
  border-width:1px;
  border-color:#ff3c30;
}
.ui-sigin{
  line-height:100px;
  height:100px;
  border-radius:10px;
  text-align:center;
  background-color:#ff3c30;
  color:#ffffff;
  font-size:32px;
}
.ui-sigin:active{
  background-color:#d4332a;
}
.ui-text{
  text-align:center;
  font-size:24px;
  color:#999999;
  margin-bottom:20px;
}
.ui-text1{
  text-align:center;
  font-size:30px;
  line-height:100px;
  background-color:#eeeeee;
  padding-left:40px;
  padding-right:40px;
  border-radius:10px;
}
.ui-text1:active{
  background-color:#cccccc;
}
.ui-img1{
  width:100px;
  height:100px;
  background-color:#eeeeee;
}
.button{
  width:200px;
  height:100px;
  line-height:100px;
  font-size:25px;
  text-align:center;
  border-radius:10px;
  border-style:solid;
  border-width:2px;
  border-color:#F02D44;
  color:#F02D44;
}
.actbutton{
  width:200px;
  height:100px;
  line-height:100px;
  font-size:25px;
  text-align:center;
  border-radius:10px;
  border-style:solid;
  border-width:2px;
  border-color:#999999;
  background-color:#eeeeee;
  color:#333333;
}    
</style>
