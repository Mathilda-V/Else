<template>
  <div class="addressAdd">
    <navbar :title="title" :showBack="true" @blur="backBlur"></navbar>    
    <div class="row con">
      <text class="normal-gray con-title">收货人</text>
      <input class="normal-black con-input" type="text" v-model="name" return-key-type="next" ref="name" autofocus="true" max-length="20" />             
    </div>
    <div class="row con"> 
      <text class="normal-gray con-title">手机号码</text>
      <input class="normal-black con-input" type="number" v-model="telphone" return-key-type="next" ref="tel" @change="toNum"/>             
    </div>            
    <div :class="['row', 'con', siteFlag ? '' : 'btw']" @click="showCityList">
      <text class="normal-gray con-title">所在地区</text>
      <div class="row" v-if="!siteFlag">
        <image class="pic-ui" :src="arrowRight"></image>                                       
      </div> 
      <div class="row con-input" v-if="siteFlag">
        <text class="normal-black" style="margin-right:10px;" v-for="item in siteSelectTxtEnd">{{item}}</text>
      </div>                                       
    </div>
    <div class="row con-spe">
      <text class="normal-gray con-title">详细地址</text>
      <textarea class="normal-black input-spe" 
                v-model="address" ref="address" 
                rows="4" maxlength="80"
                placeholder="街道、楼牌号等"></textarea>
    </div>
    <div class="btn-ui row center abs" @click="saveAddress">
      <text class="middle-white">保存</text>
    </div>            
    <!-- 所在地区弹框-->
    <wxc-popup popup-color="#ededed"
        :show="isBottomShow"
        @wxcPopupOverlayClicked="popupOverlayBottomClick"
        pos="bottom"
        height="900"
        class="popup">
      <div class="head row-cen rel bottom-line">
        <text class="middle-gray">配送至</text>
        <image class="head-img abs" :src="closeImg" @click="popupOverlayBottomClick"/>
      </div>
      <div class="bottom-line row rel">
        <text :class="['area','normal-black',siteSelectStatus[0]?'active':'']" ref="sheng" @click="headSelected(0,'sheng')">{{siteSelectTxt[0]}}</text>
        <text :class="['area','normal-black',siteSelectStatus[1]?'active':'']" ref="shi" @click="headSelected(1,'shi')">{{siteSelectTxt[1]}}</text>
        <text :class="['area','normal-black',siteSelectStatus[2]?'active':'']" ref="qu" @click="headSelected(2,'qu')">{{siteSelectTxt[2]}}</text>
        <div class="border-line abs" ref="borderLine" :style="{width:borderWidth+'px',left:borderMoveWidth+'px'}"></div>
      </div>
      <scroller class="ul" v-if="siteSelectStatus[0]">
        <text :class="['li', siteSelectId[0]==v.id?'active':'']" 
              v-for="v in provinceList" 
              @click="getProvinceId(v)">{{siteSelectId[0]==v.id?v.name+'&emsp;✓':v.name}}</text>
      </scroller>
      <scroller class="ul" v-if="siteSelectStatus[1]">  
        <text :class="['li', siteSelectId[1]==v.id?'active':'']" 
              v-for="v in cityList" 
              @click="getCityId(v)">{{siteSelectId[1]==v.id?v.name+'&emsp;✓':v.name}}</text>              
      </scroller> 
      <scroller class="ul" v-if="siteSelectStatus[2]">    
        <text :class="['li', siteSelectId[2]==v.id?'active':'']" 
              v-for="v in districtList" 
              @click="getDistrictId(v)">{{siteSelectId[2]==v.id?v.name+'&emsp;✓':v.name}}</text>                   
      </scroller> 
    </wxc-popup>
  </div>
</template>
<script>
  const storage = weex.requireModule('storage')
  const modal = weex.requireModule('modal');
  const dom = weex.requireModule('dom')
  import navbar from "base/navbar";
  import { WxcPopup } from 'weex-ui';
  import util from "common/js/util";
  import { DIRECTION_ARROW, CLOSE } from 'common/js/icon-type'
  export default {
    components: { navbar,  WxcPopup },
    mixins:[util], 
    data() {
      return {
        arrowRight: DIRECTION_ARROW[0],
        closeImg: CLOSE,
        title: '',
        isBottomShow: false,
        siteFlag: false,
        differBorder: true,
        borderWidth: 103,
        borderMoveWidth: 45,
        id: "",
        is_default: "0",
        name: "",
        telphone: "",
        address: "",
        siteSelectTxt: ['请选择省', '', ''], // 当前选择
        siteSelectTxtEnd: [], // 最后选择
        siteSelectStatus: [true, false, false], // 选择状态
        siteSelectId: [], // 选择id
        provinceList: [],// 省级列表信息
        cityList: [], // 市级列表信息
        districtList: [], // 区级列表信息
      }
    },
    created () {
      storage.getItem('adinfo', d => {
        if((d.result == "success" && d.data == "") || (d.result == "failed" && d.data == "undefined")) {
          this.title = "新建收货地址";
          return;
        }
        this.title = "编辑收货地址";
        this.siteFlag = true;
        this.differBorder = false; // 选择城市下划线位置
        var info = JSON.parse(d.data);
        this.name = info.name;
        this.telphone = info.telphone;
        this.id = info.id;
        this.is_default = info.is_default;
        this.address = info.address.split(' ')[1]
        this.siteSelectStatus = [false, false, true]
        this.siteSelectTxtEnd = info.region_address.split(',');
        this.siteSelectId = info.region_id.split(',');
      })
        this.post('user', 'getAddressList', {}, res => { // 判断是否已存在默认地址
        if(res.message == '没有查询到数据') this.is_default = 1;                                        
      })
    },
    methods: {
      getList(upid, callback){ // 获取列表请求
        this.post('user','getArea',{upid: upid}, d => {
          if(d.success) callback(d.data);                
        }) 
      },   
      getBoxInfo(boxRef){ 
        dom.getComponentRect(this.$refs[boxRef], option => {
          this.borderWidth = option.size.width;
          this.borderMoveWidth = option.size.left;
        })           
      },   
      toNum() { // 判断购买input框
        this.telphone = this.telphone.replace(/[^\d]/g,'')
      },            
      saveAddress () {
        if(this.name != "" && this.telphone != "" && this.address != "" && this.siteFlag){
          var data = {
            region_id: this.siteSelectId.join(),
            region_address: this.siteSelectTxtEnd.join(),
            address: this.address.replace(/\r|\n/g,''),
            telphone: this.telphone,
            name: this.name,
            id: this.id,
            is_default: this.is_default
          }; 
          this.post('user','addOrUpdateUserAddressInfo', data, res => {
            if(res.success){
              this.close('true',()=>{
                const allMessage = new BroadcastChannel("allMessage"); // 发送信息，address界面刷新
                allMessage.postMessage({type:"addressAdd"})
                if(this.is_default){
                  const allMessage = new BroadcastChannel("allMessage"); // 发送信息，buy界面刷新
                  allMessage.postMessage({type:"addressChange"})
                }
              });
            }else{
              modal.toast({message: res.message});
            }
          })
        }else{
          modal.toast({message: '请填写完整'});
        }                  
      },
      showCityList(){ // 打开地址选择框
        this.backBlur();
        if(!this.differBorder){
          this.differBorder = true;
          this.siteSelectTxt = this.siteSelectTxtEnd;
          this.getList(this.siteSelectId[0], d => { this.cityList = d; }) // 获取市
          this.getList(this.siteSelectId[1], d => { this.districtList = d; }) // 获取区
          setTimeout(()=>{
            this.getBoxInfo("qu")
          },50)         
        }
        this.getList('', d => { this.provinceList = d; })
        this.isBottomShow = true; // 打开弹窗
      },      
      popupOverlayBottomClick () { // 非状态组件，需要在这里关闭
        var flag = true;
        this.siteSelectTxt.forEach(item=>{
          if(item.indexOf("请选择")>=0){
            flag = false;
            return;
          }
        })
        flag && (this.siteSelectTxtEnd = this.siteSelectTxt.join().split(','))
        this.isBottomShow = false;
      },
      headSelected(index, clickName) {
        this.siteSelectStatus.forEach((item,i)=>{
          if(i==index) {
            this.siteSelectStatus[i] = true;
          }else{
            this.siteSelectStatus[i] = false;
          }
        })
        this.getBoxInfo(clickName)
      },     
      getProvinceId(e) { // 选择省份
        this.siteSelectId[0] = e.id;
        this.siteSelectStatus = [false, true, false];
        Vue.set(this, 'siteSelectTxt', [e.name, '请选择市', ''])
        this.getList(this.siteSelectId[0], d => { this.cityList = d; })
        setTimeout(()=>{
          this.getBoxInfo("shi")
        },50)
      },
      getCityId(e) { // 选择市
        this.siteSelectId[1] = e.id;               
        this.siteSelectStatus = [false, false, true];
        this.siteSelectTxt.splice(1, 2, e.name, '请选择区');
        this.getList(this.siteSelectId[1], d => { this.districtList = d; }) 
        setTimeout(()=>{
          this.getBoxInfo("qu")
        },50)
      },
      getDistrictId(e) { // 选择区
        this.siteSelectId[2] = e.id;  
        Vue.set(this, 'siteSelectStatus', [false, false, true])
        this.siteSelectTxt.splice(2, 1, e.name) 
        this.siteFlag = true;
        setTimeout(()=>{
          this.getBoxInfo("qu")
          this.popupOverlayBottomClick();
        },100)        
      },  
      backBlur(){
        this.$refs['name'].blur();
        this.$refs['tel'].blur();
        this.$refs['address'].blur();
      },          
    },
  };
</script>
<style lang="stylus" scoped>
@import '../common/stylus/variable.styl'
@import '../common/stylus/layout.styl'
.addressAdd {
  background-color: #ededed;
}
.bottom-line {
  background-color: #ffffff;
  margin-bottom: 1px; 
}
.address {
  width: 750px;
  padding: 20px;
}
.con {
  height: 100px;
  padding-left: 20px;
  margin-bottom: 1px;
  background-color: #ffffff;
}
.con-spe {
  align-items: flex-start;
  height: 160px;
  padding-top: 20px;
  padding-left: 20px;
  background-color: #ffffff;
}
.con-title {
  width: 130px;
}
.pic-ui {
  width: 40px;
  height: 40px;
  margin-right: 20px;
}
.con-input {
  width: 500px;
  height: 100px;
  line-height: 100px;
  padding-left: 20px;
}
.input-spe {
  width: 550px;
  line-height: 40px;
  padding-left: 20px;
}
.head {
  width: 750px;
  padding: 30px;
}
.head-img {
  top: 15px;
  right: 0;
  width: 60px;
  height: 60px;
}
.area {
  height: 90px;
  line-height: 90px;
  margin-left: 45px;
}
.border-line {
  bottom: 1px;
  height: 3px;
  background-color: #ff7d49;
  transition-property: left;
  transition-duration: 0.2s;
  transition-timing-function: line;
}
.ul{
  width: 750px;
  height: 700px;
  background-color: #ffffff;
}
.li{
  padding-left: 40px;
  font-size: 26px;
  line-height: 80px;
  color: #666666;
}
.active{
  color: #f56a33;
}
.popup {
  border-top-left-radius: 50%;
  border-top-right-radius: 50%;
}
.btn-ui {
  left: 125px;
  bottom: 30px;
  width: 500px;
  height: 80px;
  border-radius: 50px;
  background-image: linear-gradient(to right, #f82833, #fd6925); 
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
}
.btn-ui:active {
  background-image: linear-gradient(to right, #f00f1b, #f85311); 
}
</style>



