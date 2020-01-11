<template>
  <div>
    <navbar :title="title" :showBack="true"></navbar>    
    <scroller class="personal">
        <div class="per"> 
            <text class="per-left">积米头像</text>
            <div class="per-right">
                <image style="width:100px;height:100px;" :src="user.pic_url" resize="cover"></image>
            </div>
        </div>
        <div class="per">
            <text class="per-left">用户名</text>
            <text class="per-ui">{{user.nick}}</text>
        </div>
        <div class="per" @click="phone">
            <text class="per-left">绑定手机号</text>
            <div class="per-right">
              <text class="per-ui">{{user.telphone=='0'?'未绑定':user.telphone}}</text>
              <image v-if="phoneFlag" style="width:40px;height:40px;margin-left:10px;" :src="arrowRight"></image>            
            </div>               
        </div>            
        <div class="per" @click="address">
            <text class="per-left">收货地址</text>
            <image style="width:40px;height:40px;" :src="arrowRight"></image>                 
        </div> 
        <div class="per" @click="clear">
          <text class="per-left">清除缓存</text>
          <div class="per-right">
            <text class="per-ui">{{cacheNum}} M</text>
            <image style="width:40px;height:40px;" :src="arrowRight"></image>
          </div>               
        </div>  
    </scroller>
    <text class="ui-sigin" @click="logOut">退出登录</text>
    <!-- 确认弹窗 -->
    <dialog
      :title="dialogTitle"
      :rightTxt="dialogRightTxt" 
      :show="show"
      @toCancle="toCancle"
      @toConfirm="toConfirm">
    </dialog>    
  </div>
</template>
<script>
const storage = weex.requireModule('storage')
const modal = weex.requireModule('modal')
import Navbar from 'base/navbar'
import Dialog from "base/dialog";
import util from "common/js/util"
import { DIRECTION_ARROW } from 'common/js/icon-type'

export default {
  mixins:[util],
  components: { Navbar, Dialog },
  data() {
    return {
      arrowRight: DIRECTION_ARROW[0],
      title: '个人资料',
      user: {},
      phoneFlag: false,  
      cacheNum: '0',
      show: false,
      dialogCategory: "",
      dialogTitle: "",
      dialogRightTxt: "",         
    }
  },
  created() {
    var self = this;           
    storage.getItem('info', d => {
      if (d.result == 'success') {
        Vue.set(self, 'user', JSON.parse(d.data))
        if(self.user.openid==undefined||self.user.openid==''||self.user.openid=='undefined'){
          return;
        }
        let num = (Math.random() + 1) * 100000;
        Vue.set(self.user, 'pic_url', `${self.user.pic_url}&${num}`);
        if(self.user.telphone == '0'){
          self.phoneFlag = true;
        }
      }
    }) 
    self.cacheSize(d=>{
      self.cacheNum = d.size.toFixed(2)
    }) 
    // 手机号信息接收
    const rphone = new BroadcastChannel('phoneLogin');
    rphone.onmessage = function(e){
      if(e.data != ''){
        self.user.telphone = e.data.telphone; 
        self.phoneFlag = false;             
      }
    }       
  },
  methods: {
    address(){
        this.open('address','true',()=>{})
    },
    phone () {
      if(this.user.telphone == "0"){
        this.open('phoneLogin','true',()=>{})
      }
    },
    clear () {
      if(this.cacheNum == '0.00'){
        return;
      }
      this.dialogTitle = "确定要清除缓存吗";
      this.dialogRightTxt = "清除";
      this.dialogCategory = "clear"
      this.show = true;
    },
    logOut () {
      this.dialogTitle = "确定退出登录吗";
      this.dialogRightTxt = "退出";
      this.dialogCategory = "logOut";
      this.show = true;                  
    },
    // 弹窗提示
    toCancle() {
      this.show = false;
    },
    toConfirm() {
      this.show = false;
      if(this.dialogCategory == "clear"){
        this.clearCache(d=>{
          this.cacheSize(d=>{
            Vue.set(this, 'cacheNum', d.size.toFixed(2))
          }) 
          if(d.success){
            modal.toast({message: '清除成功！'})
          }
        })
      }else if(this.dialogCategory == "logOut"){
        this.logout(e => {
          if(!e.success) return;                     
          this.post('user', 'loginOut', {}, d => {
            if(d.success && d!= undefined){
              // 淘宝退出登录信息
              this.close('true',()=>{
                const allMessage = new BroadcastChannel("allMessage");
                allMessage.postMessage({type:"outLogin"})
              });
            }
          })
        }) 
      }
    },                   
  },
}
</script>
<style lang="stylus" scoped>
.personal {
  background-color: #ededed;
}
.per {
  padding: 20px;
  margin-top: 20px;
  margin-right: 20px;
  margin-bottom: 0;
  margin-left: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;   
  border-radius: 8px;
  align-items: center; 
}
.per-left {
  font-size: 26px;
  color: #999;
  line-height: 50px;
  height: 50px;
}
.per-right {
  flex-direction: row;
  align-items: center;        
}
.per-ui{
  font-size: 24px;
  color: #666666;
}          
.ui-sigin {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 750px;
  line-height:100px;
  height:100px;
  text-align:center;
  color:#FFFFFF;
  background-color :#f56a33;
  font-size:30px;
}     
.ui-sigin:active{
  background-color :#e5345f;
}   

</style>


