<template>
    <div>
        <div class="footer">
            <navbar :title="title" @blur="backBlur"></navbar>
            <scroller class="buy" show-scrollbar="false">
                <div class="white-w row " @click="address">
                    <image class="address-img del-img" :src="loaction" style="width:30px;height:30px;"/>
                    <div class="address space-l space-r">
                        <div class="message row-btw" v-if="flag">
                            <text class="name normal-gray-big">收货人:{{addre.name}}</text>
                            <text class="tel normal-gray-big space-r">电话号码:{{addre.telphone}}</text>
                        </div>
                        <text class="addres normal-gray" v-if="flag">收货地址:{{addre.address}}</text>
                        <text class="mess normal-red" v-if="!flag">请添加地址</text>
                    </div>
                    <image class="address-img del-img " :src="aImg.src" resize="cover" :style="{width:aImg.width,height:aImg.height}"/>
                </div>
                <image class="" :src="address_bar" resize="cover" style="width:750px;height:8px;background-color:#FFFFFF;"/>
                <div class="main">
                    <div class="exchange-transaction space-b">
                        <div class="exchange-title row-btw">
                            <!-- <text class="normal-gray-big weight">兑换方式</text> -->
                            <text class="normal-gray-big weight">当前积分：{{info.ricenum}}</text>
                        </div>
                        <div class="exchange-way row-btw">
                            <div class="row">
                                <text class="normal-gray-big">最高可使用 </text>
                                <text class="middle-red">{{order.max_rice}}</text>
                                <text class="normal-gray-big"> 积分兑换</text>
                            </div>
                            <div class="radio">
                                <wxc-stepper
                                    read-only="true"
                                    :step="step" 
                                    :disabled="isStepDisabled"
                                    :default-value="defaultValue" 
                                    min="0" 
                                    :max="step_max" 
                                    @wxcStepperValueChanged="pointsChange">
                                </wxc-stepper>
                            </div>
                        </div>
                        <div class="select-item rel" v-if="selectNow">
                          <wxc-grid-select
                            :single="true"
                            :cols="3"
                            :customStyles="customStyles"
                            :list="tabList"
                            @select="tabSelect">
                          </wxc-grid-select>
                        </div>
                    </div>
                    <div class="white-w flex-row goods">
                        <image class="del-img" :src="order.path" resize="cover" style="width:150px;height:150px;margin-left:20px;" />
                        <div class="goods-del rel">
                            <text class="title line-2 normal-black">{{order.good_name}}</text>
                            <div class="abs row-btw  attr-price">
                                <text class="texture small-gray">{{order.good_c_attr}}</text>
                                <text class="reimburse normal-gray-big">市场参考价: {{order.amount}}元</text>
                            </div>
                        </div>
                    </div>
                    <div class="listBox row-btw">
                        <text class="normal-gray-big">购买数量</text>
                        <div class="num">
                            <wxc-stepper :read-only="true" :default-value="order.buy_count" @wxcStepperValueChanged="stepperValueChange"></wxc-stepper>
                        </div>
                    </div>
                    <div class="listBox row-btw">
                        <text class="normal-gray-big">消耗</text>
                        <text class="normal-red">{{expendMoney}}元+{{expend_rice}}积分</text>
                    </div>
                    <textarea class="liuyan white-w normal-gray" @focus="onFocus" placeholder="给我们留言...." singleline="false" lines="4" v-model="liuyan"></textarea>
                </div>
            </scroller>
            <div class="foot" v-if="!isMaskShow">
                <text class="btn" @click="btn">确认</text>
            </div>
        </div>
            <!-- 选择现金支付方式弹窗 -->
        <wxc-popup popup-color="rgb(255, 255, 255)"
                :show="isBottomShow"
                @wxcPopupOverlayClicked="popupOverlayBottomClick"
                pos="bottom"
                :height="420"
                ref="wxcPopup">
            <div class="pay-type">
                <div class="white-w row-btw border-bottom">
                    <text class="type normal-black">请选择支付方式</text>
                    <image class="close-img del-img" :src="closeIcon" resize="cover" style="width:60px;height:60px" @click="closePopup"/>
                </div>
                <div class="maint flex-row">
                    <div class="pay center" v-for="(v,e) in pay" :key="e" @click="payType(e)">
                        <image class="pay-img del-img" :src="v.img" resize="cover" style="width:120px;height:120px" />
                        <text class="pay-txt normal-black">{{v.name}}</text>
                    </div>
                </div>
            </div>
        </wxc-popup>
        <!-- 确认弹窗 -->
        <dialog
          :title="dialogTitle"
          :rightTxt="dialogRightTxt" 
          :show="isMaskShow"
          @toCancle="toCancle"
          @toConfirm="toConfirm">
        </dialog>             
    </div>
</template>
<script>
const utils = weex.requireModule('utils')
const storage = weex.requireModule("storage");
const modal=weex.requireModule("modal");
const navigator = weex.requireModule('navigator')
const globalEvent = weex.requireModule('globalEvent');
import Navbar from 'base/navbar'
import Dialog from "base/dialog";
import Util from "common/js/util"
import {toFixed} from 'common/js/filters'
import { WxcPopup,WxcStepper,WxcGridSelect  } from 'weex-ui';
import { LOCATION,CLOSE,PAY,DIRECTION_ARROW,DAWK_LOGO } from 'common/js/icon-type'
import { INTEGRAL_RATIO } from 'common/js/config'
export default {
  components: {Navbar,WxcPopup,WxcStepper,WxcGridSelect,Dialog },
  mixins:[Util],
  data(){
    return{
      closeIcon: CLOSE,
      loaction: LOCATION,
      address_bar: DAWK_LOGO,
      title: '订单详情',
      addre:{},
      order:{},
      info: {},
      value:0,
      totalMoney:0,
      flag: true,
      firstOrder: false,
      yhq: false,
      buy_count: 0,
      liuyan: '',
      code: 0,
      aImg:{
        src: DIRECTION_ARROW[0],
        width: '16px', 
        height: '29px'
      },
      expend_rice: 0,
      expendMoney: 0,
      isMaskShow: false,
      isBottomShow: false,
      fouceTarget:null,
      pay:[{name:'支付宝',img:PAY[0]},{name:'微信',img:PAY[1]}],
      order_num:'', //订单号
      selectNow: true, //点击蒙层
      step: 100, //步幅
      defaultValue: 0, //初始值
      isStepDisabled: false,
      step_max: 0,
      customStyles: {
        lineSpacing: '14px',
        width: '200px',
        height: '50px',
        icon: '',
        color: '#666666',
        checkedColor: '#ffffff',
        disabledColor: '#eeeeee',
        backgroundColor: '#eeeeee',
        checkedBorderColor: '#F02D44',
        checkedBackgroundColor: '#F02D44',
        disabledColor: '#cccccc'
      },
      tabList: [
        { 'title': 200 },
        { 'title': 500 },
        { 'title': 1000 },
        { 'title': 2000 },
        { 'title': 5000 },
        { 'title': 10000 },
      ],
      dialogTitle: "确定要兑换该商品吗?",
      dialogRightTxt: "兑换", 
    }
  },
  filters: { toFixed },
  created() {
    var vm = this
    this.getData();
    const address = new BroadcastChannel('allMessage')  //没有地址添加地址
    address.onmessage = function (e) {
      if(e.data.type == "addressChange"){
        vm.setData()
        // address.postMessage("received");
      }
    }
    const Steve = new BroadcastChannel('pay')
    Steve.onmessage = function (e) {
      if(e.data == 'success'){
        navigator.pop({ animated: 'false' }, e => {})
      }
    }
    globalEvent.addEventListener("wxpay", function (e) {
      if(e.success){
        modal.toast({message:"支付成功"});
        setTimeout(function(){
          navigator.pop({ animated: 'true' },()=>{});  
        },500);
      }else{
        modal.toast({message:"支付失败"});
      }
    });
      
    globalEvent.addEventListener("alpay", function (e) {
      if(e.success){
        modal.toast({message:"支付成功"});
        setTimeout(function(){
          navigator.pop({ animated: 'true' },()=>{});  
        },500);
      }else{
        modal.toast({message:"支付失败"});
      }
    });
  },
  methods:{
    setData(){
      this.post('user','getDefaultAddress',{},res=>{
        // console.log(res)
        if(res.success){
          this.flag = true
          this.aImg = {
            src: DIRECTION_ARROW[0],
            width: '16px', 
            height: '29px'
          }
          let str = res.data.region_address.replace(/\s/g,'')
          let sstr = str.replace(/,/g,' ')
          var address = sstr + ' ' + res.data.address
          this.addre = {
            name:res.data.name,
            telphone:res.data.telphone,
            address:address
          }
        }
      })
    },
    getData(){
      storage.getItem('info', e =>{
        this.info = JSON.parse(e.data) 
        storage.getItem("order", e => {
          let data = JSON.parse(e.data)
          if(!data.hasOwnProperty('receivingInformation')){
            this.flag = false
            this.aImg = {
              src: 'https://img.alicdn.com/imgextra/i4/3159284535/TB2N.1rXO6guuRkSnb4XXbu4XXa_!!3159284535.png',
              width: '30px', 
              height: '30px'
            }
          }else{
            this.addre = data.receivingInformation
          } 
          this.order = data.purchaseGoods
          this.buy_count = this.order.buy_count
          this.totalMoney = this.order.amount*this.buy_count
          this.step_max = parseInt(this.info.ricenum)>=this.order.max_rice?parseInt(this.order.max_rice):parseInt(this.info.ricenum)
          this._totalMoney();
          this.openSelect();
        })
      })
    },
    pointsChange(e){
      this.defaultValue = e.value;
      this.expend_rice = e.value;
      this._totalMoney();
    },
    openSelect(){
      this.tabList.forEach((item)=>{
        if(item.title > this.step_max){
          Vue.set(item, 'disabled',true)
        }
      })
    },
    tabSelect(e){
      if(e.checked == false) return;
      let title = parseInt(e.checkedList[0].title);
      this.defaultValue = title;
      this.expend_rice = title;
      this._totalMoney();
    },
    //非状态组件，需要在这里关闭
    popupOverlayBottomClick () {
      this.isBottomShow = false;
    },
    btn(){
      if(this.expendMoney == 0){
        this.isMaskShow = true
      }else{
        this.purchase();
      }
    },
    purchase(){
      var vm = this
      var param = {
        gid:this.order.gid,
        buy_count:this.buy_count,
        good_c_attr:this.order.good_c_attr.replace('/',''),
        good_name:this.order.good_name,
        path: this.order.path,
        buyer_message: this.liuyan,
        rice_num: this.expend_rice
      }
      if(this.flag){
        this.post('order','order',param,(res)=>{
          if(res.success){
            vm.order_num = res.data.order_num
            if(vm.expendMoney != 0){
              vm.isBottomShow = true
            }else{
              vm.isMaskShow = false
              this.consumptionIntegral(vm.order_num)
            }
          }else{
            modal.toast({message:res.message})
            if(res.message == '没有绑定手机号'){
              vm.open('phoneLogin','true',()=>{})
            }
          }
        })
      }else{
        modal.toast({message:'请添加收货地址'})
      }
    },
    closePopup(){
      this.$refs.wxcPopup.hide()
    },
    payType(e){
      var vm = this
      if(e==0){
        this.post('alipay','aliPay',{order_num:this.order_num,good_name:this.order.good_name},res=>{
          if(res.success){
            this.alpay(res.data,e => {
              if(e.success){
                modal.toast({message:"支付成功"});
                this._expendRice();
              }else{
                modal.toast({message:"支付失败"});
              }
            })
          }
        })
      }else{
        this.post('wxapp','unifiedOrder',{order_num:this.order_num,good_name:this.order.good_name},res=>{
          if(res.success){
            this.wxpay(res.data.sign,res.data.prepayid,res.data.noncestr,res.data.timestamp,e => {
              if(e.success){
                modal.toast({message:"支付成功"});
                this._expendRice();
              }else{
                modal.toast({message:"支付失败"});
              }
            })
          }
        })
      }
    },
    stepperValueChange(e){
      this.totalMoney = e.value*(this['order']['amount'])
      this._totalMoney();
    },
    address(){
      storage.setItem('Site', JSON.stringify({stat:1}),()=>{
        if(JSON.stringify(this.addre) == "{}"){
          this.open('addressAdd','true',()=>{})
        }else{
          this.open('address','true',()=>{})
        }
      })
    },
    toCancle(){
      this.isMaskShow = false
    },
    toConfirm(){
      this.purchase();
    },
    consumptionIntegral(e){
      this.post('integralPay','integralPay',{order_num:e},res=>{
          if(res.success){
            if(res.message === "支付成功"){
              modal.toast({message:"支付成功"});
              this._expendRice();
            }else{
              modal.toast({message:res.message});
            }
          }
      })
    },
    _expendRice(){
      this.info.ricenum  = parseInt(this.info.ricenum) - parseInt(this.expend_rice)
      storage.setItem('info', JSON.stringify(this.info),()=>{
        setTimeout(()=>{
          this.close('false',()=>{
            const allMessage = new BroadcastChannel("allMessage");
            allMessage.postMessage({type:"riceChange", info:this.info})
          })
        }, 500)
      })
    },
    _totalMoney(){
      this.expendMoney = this.totalMoney - (this.expend_rice/INTEGRAL_RATIO)
    },
    onFocus(e){
      this.fouceTarget = e.currentTarget;
    },
    backBlur(){
      if(this.fouceTarget != null){
        this.fouceTarget.blur();
      }
    },
  },
  watch: {
    totalMoney(){
      this._totalMoney();
    }
  }
}
</script>
<style lang="stylus" scoped>
    @import '../common/stylus/layout.styl'
    @import '../common/stylus/variable.styl'

    .flex-row{
        flex-direction: row;
    }
    .buy{
        width: 750px;
        background-color: #f1f1f1;
    }
    .address{
        flex:1;
    }
    .normal-gray-big{
        font-size: 26px;
        color: #666666;
    }
    .weight{
        font-weight: 500;
    }
    .name,.tel{
        font-weight: 400;
        line-height: 50px;
    }
    .addres{
        font-weight: 400;
        line-height: 32px;
    }
    .exchange-transaction{
        width: 750px;
    }
    .exchange-title{
        width: 750px;
        height: 90px;
        padding-top: 20px;
        padding-left: 35px;
        padding-right: 20px;
        padding-bottom: 20px;
    }
    .exchange-way{
        width: 750px;
        padding-left: 20px;
        background-color: #ffffff;
        height: 99px;
        padding-top: 20px;
        padding-left: 42px;
        padding-right: 30px;
        padding-bottom: 20px;
        margin-bottom: 1px;
    }
    .radio{

    }
    .select-btn{
      width: 85px;
      height: 56px;
      left: 57px;
      top: 0;
    }
    .select-item {
      width: 750px;
      padding-left: 20px;
      padding-right: 20px;
      padding-top: 20px;
      padding-bottom: 20px;
      background-color: #ffffff;
    }
    .select-input{
      width: 200px;
      height: 50px;
      bottom: 20px;
      right: 20px;
      border-width: 1px;
      border-style: solid;
      border-color: #cccccc;
      background-color: #ffffff;
      border-radius: 5px;
      text-align: center;
      font-size: 24px;
      font-weight: 200;
      color: #333333;    
    }
    .red{
      color: #ff0000;
    }
    .gray{
      color: #999999;
    }
    .dots{
        width:150px;
        height:60px;
        line-height: 60px;
        text-align: center; 
    }
    .goods{
        margin-bottom: 2px;  
    }
    .goods-del{
        width: 500px;
        height: 150px;
        margin-left: 20px;    
    }
    .attr-price{
        width: 500px;
        left: 0;
        bottom: 10px;    
    }
    .listBox{
        height: 90px;
        padding-left: 42px;
        padding-right: 30px;
        background-color: #FFFFFF;
        margin-bottom: 1px;     
    }
    .liuyan{
        width: 710px;
        margin-top: 20px;
        font-weight: 400;
        line-height: 90px;
        border-radius: 10px;
    }
    .footer{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 750px;
        justify-content: flex-end;
    }
    .foot{
        width: 750px;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 20px;
        padding-right: 20px;
        background-color: #f1f1f1;
    }
    .btn{
        width: 710px;
        font-size: 30px;
        color: #FFFFFF;
        font-weight: 400;
        line-height: 90px;
        text-align: center;
        border-radius: 10px;
        background-color: #f24561;
    }
    .pay{
        width:375px;
    }
    .pay-img{
        border-radius: 100px;
        margin-bottom: 30px;
        margin-top: 80px;
    }
    .pay-txt{
        width:375px;
        font-weight: 400;
        line-height: 30px;
        text-align: center;
    }
    .border-bottom{
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #EEEEEE;
    }

    /* 删除弹框 */
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
}
.dialog {
  width: 490px;
  border-radius: 25px;
  background-color: #ffffff;
}
.dialog-content {
  width: 490px;
  height: 140px;
  line-height: 140px;
  text-align: center;
  font-size: 30px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #cccccc;
}
.dialog-btn {
  width: 490px;
  flex-direction: row;
}
.dialog-btn-ui {
  font-size: 32px;
  line-height: 80px;
  flex: 1;
  height: 80px;
  text-align: center;
}
.color-confirm {
  color: #ff341c;
}
</style>
