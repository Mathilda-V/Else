<template>
  <div>
    <navbar :title="title"></navbar> 
    <scroller show-scrollbar="false" class="wrapper" @loadmore="loadmore" loadmoreoffset="500" offset-accuracy="10" v-if="!loadShow">
      <slider class="wh-750" interval="6000" auto-play="false">
        <div class="wh-750" v-if="goodsInfo.pict_url_list.length" v-for="img in goodsInfo.pict_url_list" :key="img">
          <image class="wh-750" resize="cover" :src="img + '_500x500q80s100.jpg_.webp'" />
        </div>
        <indicator class="indicator"></indicator>
      </slider>
      <div class="white-w space-b-20">
        <text class="title middle-black space-b-20">{{goodsInfo.title}}</text>
        <div class="row" >
          <text class="small-white block-red center space-r space-b " v-if="goodsInfo.is_free_shopping=='1'">包邮</text>
        </div>
        <div class="cbse btw flex-row-end">
          <div class="flex-row-end">
            <text class="small-gray">市场参考价:￥</text>
            <div class="flex-row-end rel price">
              <text class="rel big-red integer">{{goodsInfo.zk_final_price | keepInteger}}</text>
              <text class="big-red symbol">{{goodsInfo.zk_final_price | keepDecimal}}</text>
            </div>
          </div>
          <text class="sell-txt small-gray">兑换: {{goodsInfo.volume}}</text>
        </div>
      </div>
      <div class="space-b">
        <div class="white-w row-btw" @click="wrapDetailImg">
          <text class="normal-gray">商品详情</text>
          <div class="row">
            <image class="wrap-icon" :src="arrowRight" ref="wrapArrow" style="width:30px;height:30px;"></image>
          </div>
        </div>
        <div class="center" style="padding-left:10px;padding-right:10px;" >
          <image v-for="p in goodsInfo.item_url_list" :src="p +'_500x500q80s100.jpg_.webp'" resize="contain" class="wh-750" />
        </div>
      </div>
    </scroller>
    <div class="footer" v-if="!loadShow">
      <div class="share row" @click="shareGoods">
        <image class="share-img space-l" src="https://img.alicdn.com/imgextra/i4/3159284535/O1CN011jN4coA7PUUcNmh_!!3159284535.png" style="width:45px;height:45px;margin-right: 6px;" />
        <text class="share-txt">分享</text>
      </div>
      <div class="thbox" @click="huigou">
        <text class="huigou">立即兑换</text>
      </div>
    </div>

    <!-- 购买规格弹窗 -->
    <wxc-popup 
      :show="isBottomShow" 
      :height="popupHeight" 
      popup-color="#ffffff" 
      pos="bottom" 
      ref="wxcPopup"
      @wxcPopupOverlayClicked="popupOverlayBottomClick" 
      >
      <div class="specification">
        <div class="row-btw white white-w">
          <div class="row-btw">
            <image :src="purchaseGoods.path" resize="cover" style="width:120px;height:120px" />
            <div class="space-l-20">
              <text class="refe-price">参考价￥{{purchaseGoods.amount | toFixed}}</text>
              <text class="repertory">库存{{purchaseGoods.specStore}}件</text>
              <text class="tit">{{specText}}</text>
            </div>
          </div>
          <image class="close-img" :src="closeIcon" resize="cover" style="width:60px;height:60px" @click="closePopup" />
        </div>
        <scroller show-scrollbar="false" :style="{height:specHeight+'px'}" class="scroller">
          <div ref="box">
            <div class="specifica white white-w" v-for="(item,index) in goodsInfo.attr_list">
              <text class="tit spec">{{item.goods_attr}}</text>
              <div class="button">
                <wxc-grid-select 
                  :single="true" 
                  :cols="3" 
                  :list="item.goods_values" 
                  :customStyles="customStyles" 
                  @select="(params) => onSelect(params, index)">
                </wxc-grid-select>
              </div>
            </div>
            <div class="number">
              <text class="tit shuliang">购买数量</text>
              <div class="addnum">
                <wxc-stepper :read-only="true" @wxcStepperValueChanged="stepperValueChange"></wxc-stepper>
              </div>
            </div>
          </div>
        </scroller>
        <div class="foot" @click="openBuy">
          <text class="btn">确认</text>
        </div>
      </div>
    </wxc-popup>
    <!-- 等待loading -->
    <load :show="loadShow"></load>
  </div>

</template>
<script>
const storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");
import { WxcPopup, WxcStepper, WxcGridSelect } from 'weex-ui';
import { toFixed,keepInteger, keepDecimal } from 'common/js/filters'
import Navbar from 'base/navbar.vue'
import Load from 'base/load'
import Util from "common/js/util"
import { CLOSE, JIMI_LOGO,DIRECTION_ARROW } from 'common/js/icon-type'

export default {
  components: { Navbar, WxcPopup, WxcStepper, WxcGridSelect, Load },
  mixins: [Util],
  filters: { toFixed,keepInteger, keepDecimal },
  data() {
    return {
      closeIcon: CLOSE,  //关闭图标
      arrowRight: DIRECTION_ARROW[0], //右尖头图标
      title: '商品详情',
      popupHeight: '850',  //购买规格弹窗高度
      isBottomShow: false,  //购买规格弹窗开关
      customStyles: {   //购买规格选择样式
        lineSpacing: '20px',
        width: '220px',
        height: '60px',
        color: '#bbb',
        checkedColor: '#FFFFFF',
        borderColor: '#bbb',
        checkedBorderColor: '#f24561',
        backgroundColor: '#FFFFFF',
        checkedBackgroundColor: '#f24561',
        icon: ''
      },
      goodsInfo: {
        pict_url: JIMI_LOGO,
        item_url_list: [],
      },
      specHeight: '550',  // 控制购买规格滚动高度
      specSelect: [],  //已选择的属性
      specText: '请选择', //商品属性
      specError: false,
      purchaseGoods: {buy_count:1,specStore:0},  //需 图片地址 path 商品单价 amount 购买商品数量 buy_count  商品名字 good_name 商品属性ID gid 商品属性值 good_c_attr
      specImg: '', //图片地址
      user: '',
      loadShow: true, //等待开关
      labelType: []
    }
  },
  created() {
    this.getData();

    const Steve = new BroadcastChannel('pay')
    Steve.onmessage =  (e)=> {
      if (e.data == 'success') {
        this.close('false', () => {})
      }
    }
  },
  methods: {
    getData() {
      storage.getItem("goodsDel", e => {
        if (e.result == "success") {
          this.post('goods', 'getGoodAttr', { id: JSON.parse(e.data).id }, res => {
            this.loadShow = false
            if (res && res.success) {
              this.goodsInfo = res.data
              console.log('detail-X5',this.goodsInfo)
              this.title = this.goodsInfo.title
              this.saveHistory(res)
              this.purchaseGoods.path = this.goodsInfo.small_images_list[0]
              this.goodsInfo.attr_list.forEach((item, index) => {
                let arr = []
                item.goods_values.split(',').forEach((value,i) => {
                  if(i==0){
                    this.specSelect.push(value)
                    arr.push({title: value, checked: true})
                  }else{
                    arr.push({title: value, checked: false})
                  }
                })
                item.goods_values = arr
              })
              this.specText = this.specSelect.includes(undefined) ? '请选择' : `已选择: ${this.specSelect.join('/')}`
            }
          })
        }
      })
    },
    saveHistory(e) {
      let self = this
      let d = new Date()
      let date = (d.getMonth() + 1) + '月' + d.getDate() + '日'
      let goodsInfo = e.data
      storage.getItem("historyRecord",e => {
        if (e.data == 'undefined') {
          let hR = []
          let dateData = []
          dateData.unshift(goodsInfo)
          hR.unshift({date: date, dateData: dateData})
          storage.setItem("historyRecord", JSON.stringify(hR), e => {})
        } else {
          let hR = JSON.parse(e.data)
          if (hR.length > 6) {
            hR.pop()
          } 
          let dateIdx = ''
          if (hR[0].date == date) {
            let goodsIdx = ''
            let goodsRes = hR[0].dateData.filter((v, index) => {
              if (v.num_iid == goodsInfo.num_iid) goodsIdx = index
              return v.num_iid == goodsInfo.num_iid
            })
            if (goodsRes.length !== 0) hR[0].dateData.splice(goodsIdx, 1)
            hR[0].dateData.unshift(goodsInfo)
            storage.setItem("historyRecord", JSON.stringify(hR), e => {})
          } else {
            let dateData = []
            dateData.unshift(goodsInfo)
            hR.unshift({date: date, dateData: dateData})
            storage.setItem("historyRecord", JSON.stringify(hR), e => {})
          }
        }
      })
    },
    //非状态组件，需要在这里关闭
    popupOverlayBottomClick() {
      this.isBottomShow = false;
    },
    shareGoods() {
      let price = +this.goodsInfo.zk_final_price - +this.goodsInfo.discount_money | this.toFixed
      let url = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.icebox.amoymarket&pid='
      this.share(this.goodsInfo.title, '在【积米惠购】中购买仅需' + price + '元', this.goodsInfo.pict_url, url, e => {
        if(e.success) {
          this.post('user', 'shareForRice', {}, res => {
            console.log(res)
            if(!res.success) {
              modal.toast({message: res.message})
              return
            }
            var obj = function(){
              return storage.getItem('info',(e)=>{
                modal.toast({message:`${res.message}, 获得 ${res.add_rice} 积分`})
                let info = JSON.parse(e.data)
                info.ricenum = parseInt(info.ricenum) + parseInt(res.add_rice)
                storage.setItem('info', JSON.stringify(info),()=>{
                  const allMessage = new BroadcastChannel("allMessage");
                  allMessage.postMessage({type: "riceChange", info:info,})  
                })
              })
            } 
            res.add_rice ? obj() : modal.toast({message:`${res.message}`})
          })
        }
      })
    },
    huigou() {
      if(this.specSelect.length == this.goodsInfo.attr_list.length){
        this.getPropeties()
      }
    },
    closePopup() {
      this.$refs.wxcPopup.hide()
    },
    getPropeties(){  //根据规格属性 获取价格，，库存，，
      let params = {
        gid: this.goodsInfo.attr_list[0].gid,
        specs: this.specSelect.join('')
      }
      this.post('goods', 'getPriceByGid', params, res => { 
        if(res.success) {
          if(!res.data){
            modal.toast({message: '商品规格有误！！'})
            return
          }
          this.isBottomShow = true
          this.purchaseGoods.amount = res.data.good_price
          this.purchaseGoods.max_rice = res.data.max_rice
          this.purchaseGoods.specStore = res.data.stock
          this.specError = false
        } else {
          this.specError = true
          modal.toast({message: res.message})
        }
      })
    },
    onSelect({ selectIndex, checked, checkedList }, index) {
      this.specSelect[index] = checked ? checkedList[0].title : undefined
      this.specText = this.specSelect.every((e)=>{return e == undefined}) ? '请选择' : `已选择: ${this.specSelect.filter((e)=>{return e != undefined}).join('/')}`
      if(this.goodsInfo.attr_list[index].goods_attr == '颜色'){
        this.purchaseGoods.path = this.goodsInfo.small_images_list[selectIndex]
      }
      if(!this.specSelect.includes(undefined)){
        this.getPropeties()
      }
    },
    openBuy() {
      var vm = this
      if(vm.purchaseGoods.specStore == 0){
        modal.toast({message: '商品库存不足'})
        return
      }
      if (!vm.specSelect.includes(undefined) && !this.specError) {
        vm.post('user', 'getDefaultAddress', {}, res => {  //判断登录，获取收取地址
          // console.log(res)
          if (res.success) {
            vm.purchaseGoods.good_name = vm.goodsInfo.title;
            vm.purchaseGoods.gid = vm.goodsInfo.attr_list[0].gid;
            vm.purchaseGoods.good_c_attr = vm.specSelect.join('/');
            if (res.data) {
              let str = res.data.region_address.replace(/\s/g, '')
              let sstr = str.replace(/,/g, ' ')
              var address = sstr + ' ' + res.data.address
              var name = res.data.name
              var telphone = res.data.telphone
              var param = {
                purchaseGoods: vm.purchaseGoods,
                receivingInformation:{
                  address: address,
                  name: name,
                  telphone: telphone
                }
              }
            } else {
              var param = {
                purchaseGoods: vm.purchaseGoods
              }
            }
            storage.setItem("order", JSON.stringify(param), e => {
              if (e.result == "success") {
                vm.open('buy', 'true', () => {})
                vm.isBottomShow = false;
              }
            })
          } else {
            vm.panLogin()
          }
        })
      } else {
        modal.toast({ message: '请选择商品属性' })
      }
    },
    stepperValueChange(e) {
      this.purchaseGoods.buy_count = e.value
    },
    panLogin() {
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
              allMessage.postMessage({type:"login", info: self.user});
            }else {
              modal.toast({ message: '登录失败,请重新登录！' })
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '../common/stylus/layout.styl'
@import '../common/stylus/variable.styl'
  
.wrapper {
  background-color: #ededed;
  margin-bottom: 100px;
}
.wh-750 {
  width: 750px;
  height: 750px;
  background-color: #eeeeee;
}
.indicator {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60px;
  background-color: rgba(0, 0, 0, 0);

  itemcolor: #eeeeee;
  itemselectedcolor: #f56a33;
}
.block-red{
  padding: 2px 10px;
  background-color: #e5345f;
  border-radius: 4px;
}
.flex-row-end {
  flex-direction: row;
  align-items: flex-end;
}
.price{
  top: 4px;
}
.symbol{
  font-size: 26px;
}
.integer{
  top: 2px;
}

.patch-half {
  width: 370px;
  background-color: #ffffff;
  padding-bottom: 20px;
  margin-bottom: 10px;
}
.patch-img {
  background-color: #eeeeee;
  border-radius: 2px;
  width: 370px;
  height: 370px;
}
.btn-buy {
  background-image: linear-gradient(to right, #ffc700, #ff4800);
  border-radius: 50px;
  width: 460px;
  height: 70px;
  line-height: 70px;
  text-align: center;
}


.footer {
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: #ededed;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 750px;
  background-color: #ffffff;
  flex-direction: row;
  justify-content: space-between;
}
.share {
  width: 223px;
}
.share-txt {
  font-size: 30px;
  color: #666;
  font-weight: 400;
  line-height: 79px;
}
.thbox {
  flex-direction: row;
  background-image: linear-gradient(to right, #ffc700, #ff4800);
  border-radius: 50px;
  height: 79px;
  align-items: center;
}
.line {
  height: 40px;
  width: 1px;
  border-right-style: solid;
  border-right-color: #ffc700;
  border-right-width: 1px;
}
.huigou {
  width: 500px;
  font-size: 28px;
  color: #ffffff;
  font-weight: 400;
  line-height: 70px;
  text-align: center;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
}
.white {
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: #eeeeee;
}
.refe-price {
  font-size: 32px;
  color: #f24561;
  font-weight: 400;
  line-height: 44px;
}
.repertory {
  font-size: 22px;
  color: #999999;
  font-weight: 400;
  line-height: 40px;
}
.tit {
  font-size: 24px;
  color: #666666;
  font-weight: 400;
  line-height: 36px;
  word-break: break-all;
  max-width: 520px;
}
.spec {
  margin-bottom: 20px;
}
.aaa {
  width: 200px;
  height: 50px;
  margin-bottom: 10px;
  background-color: #eeeeee;
}
.number {
  flex-direction: row;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.shuliang {
  margin-top: 10px;
}
.addnum {
  flex-direction: row;
}

.foot {
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
}
.btn {
  width: 710px;
  height: 90px;
  background-color: #f24561;
  font-size: 32px;
  color: #ffffff;
  line-height: 90px;
  text-align: center;
  border-radius: 10px;
}
.quan {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  width: 750px;
  height: 800px;
  background-color: #ffffff;
  padding: 20px;
  position: relative;
  height: 800px;
  width: 750px;
}
.quan-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 40px;
  line-height: 60px;
  color: #333333;
}
.goods-title {
  flex-direction: row;
  margin-bottom: 20px;
}
.describe {
  font-size: 30px;
  color: #333333;
}
.prize {
  font-size: 30px;
  color: #f56a33;
}
.titl {
  font-size: 30px;
  color: #999999;
  margin-bottom: 20px;
}
.quan-shu {
  flex-direction: row;
  margin-bottom: 10px;
  border-radius: 10px;
  background-color: #fff2e6;
}
.quan-left {
  flex-direction: row;
  width: 470px;
}
.text {
  font-size: 35px;
  line-height: 150px;
  color: #f56a33;
  text-align: center;
}
.num {
  font-size: 50px;
  line-height: 150px;
  color: #ff5a0e;
}
.quan-right {
  position: relative;
  width: 240px;
  border-left-width: 1px;
  border-left-style: dashed;
  border-left-color: #f56a33;
  text-align: center;
  font-size: 40px;
  line-height: 150px;
  color: #f56a33;
}
.lq-img {
  position: absolute;
  right: 0;
  bottom: 0;
}
.quan-hou {
  flex-direction: row;
  height: 36px;
  border-radius: 18px;
  width: 710px;
  background-color: #ededed;
}
.hou-img {
  margin: 5px;
}
.e {
  font-size: 26px;
  line-height: 36px;
  color: #666666;
}
.qua-txt {
  font-size: 26px;
  line-height: 36px;
  color: #f56a33;
}
.finish {
  position: absolute;
  left: 20px;
  bottom: 20px;
}
.state {
  width: 710px;
  text-align: center;
  font-size: 22px;
  color: #999999;
  margin-bottom: 15px;
}
</style>

