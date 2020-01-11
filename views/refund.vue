<template>
  <div>
    <navbar :title="title"></navbar>
    <scroller class="refund" show-scrollbar="false">
      <div class="item">
        <div class="item-con">
          <div class="con-pic">
            <image style="width:150px;height:150px;" :src="orderInfo.buy_goodpic_url" resize="contain"></image>
          </div>
          <div class="con-detail">
            <text class="title-ui">{{orderInfo.title}}</text>
            <text class="select-ui">{{orderInfo.good_spec}}</text>
          </div>
        </div>
        <div v-for="(item,index) in refundStep">
          <div class="item-white-between space-b" @click="stepClick(item, index)" v-if="item.stepShow">
            <text class="normal-black">{{item.title}}</text>
            <text class="normal-gray">{{item.selected}}</text>
          </div>
        </div>
        <div class="ope column">
          <div class="judge">
            <text class="ope-ui">退款金额</text>
            <text class="ope-ui ui-spe">最多¥{{orderInfo.amount}}元</text>
          </div>                        
          <input class="input-ui" type="number" v-model="refundPrice" v-if="orderInfo.amount" :maxlength="orderInfo.amount.length" placeholder="请输入退款金额"/>
        </div>                                                          
        <div class="ope column">
          <text class="ope-ui">退款/退货说明</text>
          <textarea class="input-ui input-spe" maxlength="60" cols="30" rows="3" v-model="reasonPart" placeholder="选填"></textarea>
        </div>
        <div class="ope column">
          <text class="ope-ui">上传凭证(最多5张)</text>
          <div class="upload-con">
            <div class="dot" @click="uploadPic">
              <image style="width:110px;height:110px;" :src="picCDN.add"></image>
            </div>
            <div class="dot" v-for="(pic,index) in picOrigin" v-if="picOrigin.length">
              <image style="width:148px;height:148px;" :src="pic" resize="cover"></image>
              <image class="delete-icon" :src="picCDN.del" @click="deletePic(index)"></image>
            </div>
          </div>
        </div>
        <text class="normal-white btn-con" @click="confirm">确认</text>
        <popup
          :isBottomShow="isBottomShow"
          :list="currentList"
          :title="name"
          :currentIndex="currentIndex"
          :height="heightNum"
          @overlayClick="overlayClick"
          @tagSelect="tagSelect"
          @closePop="closePop"
        ></popup>
      </div>                                              
    </scroller>
  </div>
</template>

<script>
const storage = weex.requireModule('storage')
const modal = weex.requireModule('modal')
import Navbar from 'base/navbar'
import Popup from 'base/popup'
import Util from "common/js/util"
import { showSize } from 'common/js/common'
import { ADD, CLOSE } from 'common/js/icon-type'  

export default {
  mixins: [Util],
  data() {
    return {
      title: '选择服务类型',
      isBottomShow: false,
      currentIndex: 0,
      currentList: {},
      orderInfo: {},
      heightNum: '',
      selectedIndex: -1,
      refundPrice: 0,
      reasonPart: '',
      picCDN: {
        add: ADD,
        del: CLOSE
      },
      picOrigin: [],
      picUrl: [],
      refundStep: [
        {
          stepShow: true,
          step: 1,
          title: '退款类型',
          selected: '请选择',
          choose: ['仅退款', '退货退款'] 
        },
        {
          stepShow: false,
          step: 2,
          title: '货物状态',
          selected: '请选择',
          choose: ['未收到货', '已收到货']
        },
        {
          stepShow: false,
          step: 3,
          title: '退款原因',
          selected: '请选择',
          choose: ['多拍/拍错/不想要', '快递一直未送到', '未按约定时间发货', '其他']
        },
        {
          stepShow: false,
          step: 4,
          title: '退款原因',
          selected: '请选择',
          choose: ['退运费', '不喜欢', '质量问题', '外观/型号/参数与描述不符', '卖家发错货', '其他']
        }
      ]
    }
  },
  created() {
    storage.getItem('orderInfo', e => {
      if (e.result == 'success') {
        this.orderInfo = JSON.parse(e.data)
        this.refundPrice = this.orderInfo.amount
      }
    })
  },
  methods: {
    stepClick(item, i){
      this.currentList = item
      this.selectedIndex = i
      this.heightNum = item.choose.length * 80 + 166
      this.isBottomShow = true
    },
    tagSelect(name, index, step){
      let currentStep = this.refundStep[this.selectedIndex].step
      if(this.refundStep[this.selectedIndex].choose[index] == name && currentStep === step){
        this.refundStep[this.selectedIndex].selected = name
      }
      if(this.selectedIndex == 0 && index == 0){
        this.refundStep[1].stepShow = true
        this.refundStep[2].stepShow = this.refundStep[3].stepShow = false
      } else if (this.selectedIndex == 0 && index == 1){
        this.refundStep[1].stepShow = this.refundStep[2].stepShow = false
        this.refundStep[3].stepShow = true
      }
      if(this.refundStep[1].stepShow === true){
        if(this.selectedIndex == 1 && index == 0){
          this.refundStep[2].stepShow = true
          this.refundStep[3].stepShow = false
        } else if(this.selectedIndex == 1 && index == 1){
          this.refundStep[2].stepShow = false
          this.refundStep[3].stepShow = true
        }
      }
      this.isBottomShow = false
    },
    overlayClick() {
      this.isBottomShow = false
    },
    closePop(){
      this.isBottomShow = false
    },
    uploadPic(){
      this.photoLib(e => {
        let pic = e.data
        if(e.success){
          if(showSize(pic) > 2100000){
            modal.toast({
              message: '上传失败，请上传小于2M的图片',
              duration: 0.3
            })
            return
          }
          if(this.picOrigin.length < 5 || this.picUrl.length < 5){
            this.picOrigin.push(`${pic}`)
            // console.log(this.picOrigin[0])
            this.picUrl.push(`data:image/jpeg;base64,${pic.replace(/\+/g, "#")}`)
          }else{
            modal.toast({
              message: '最多只能上传5张',
              duration: 0.3
            })
            return
          }
        }
      })
    },
    deletePic(index){
      this.picOrigin.splice(index, 1)
      this.picUrl.splice(index, 1)
    },
    confirm(){
      console.log()
      if(parseFloat(this.refundPrice) > parseFloat(this.orderInfo.amount)){
        modal.toast({
          message: '请输入有效的退货价格',
          duration: 0.3
        })
        return
      }
      if(this.refundStep[2].selected === '请选择' && this.refundStep[3].selected === '请选择'){
        modal.toast({
          message: '请选择退款原因',
          duration: 0.3
        })
        return
      }
      let refundInfo = {
        order_id: this.orderInfo.id,
        type: this.refundStep[0].selected || '',
        status: this.refundStep[1].selected || '',
        reason: this.refundStep[2].selected === '请选择' ?  this.refundStep[3].selected : this.refundStep[2].selected,
        return_amount: this.refundPrice || this.orderInfo.amount,
        return_pic: this.picUrl.join('|'),
        return_reason: this.reasonPart
      }
      // console.log(refundInfo.return_pic)
      this.post('order', 'applyRefund', refundInfo, res => {
        console.log(res)
        if(res.success){
          this.open('refundOrder', 'true', () => {})
        }
      })
    }
  },
  components: {
    Navbar,
    Popup
  }
}
</script>
<style lang="stylus" scoped>
@import '../common/stylus/variable.styl'

.refund {
  background-color: #ededed;
}
.item {
  padding: 20px;
}
.item-con {
  padding: 20px;
  margin-bottom: 12px;
  background-color: #ffffff;
  flex-direction: row;
}
.item-white-between{
  width: 710px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 24px 20px;
  background-color: #FFFFFF;
}
.space-b{
  margin-bottom: 10px;
}
.con-pic {
  width: 150px;
  height: 150px;
  background-color: #eeeeee;
}
.con-detail {
  width: 520px;
  height: 150px;
  padding: 10px 0 10px 20px;
  justify-content: space-between;
}
.select-ui {
  font-size: 26px;
  color: #999999;
}
.ope {
  padding: 24px 20px;
  background-color: #fff;
  margin-bottom: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
}
.column {
  flex-direction: column;
}
.ope-ui {
  font-size: 26px;
}
.ui-spe {
  color: #969696;
  margin-left: 20px;
}
.judge {
  flex-direction: row;
}
.input-ui {
  width: 500px;
  height: 80px;
  padding-left: 20px;
  font-size: 26px;
}
.input-spe {
  height: 100px;
  padding: 15px;
}
.photo {
  padding-top: 20px;
}
.upload-con{
  padding: 20px 12px 12px 15px;
  flex-direction: row;
  flex-wrap: wrap;
}
.dot {
  width: 150px;
  height: 150px;
  border-width: 1px;
  border-style: dashed;
  border-color: #969696;
  margin-bottom: 10px;
  margin-right: 10px;
  align-items: center;
  justify-content: center;
  position: relative;
}
.delete-icon{
  width: 38px;
  height: 38px;
  background-color: #eeeeee;
  border-radius: 19px;
  position: absolute;
  right: 4px;
  top: 4px;
}
.pop-title {
  height: 86px;
  padding: 30px;
  align-items: center;
  background-color: #ffffff;
  font-size: 30px;
  text-align: center;
}
.title-ui {
  font-size: 26px;
}
.pop-sel {
  height: 84px;
  padding: 30px;
  margin-top: 1px;
  background-color: #ffffff;
}
.active {
  background-color: #eeeeee;
}
.pop-sel:focus {
  background-color: #eeeeee;
}
.sel-ui {
  font-size: 24px;
}
.pop-close {
  width: 750px;
  height: 80px;
  align-items: center;
  background-color: #f56a33;
}
.close-ui {
  font-size: 32px;
  color: #ffffff;
  line-height: 80px;
}
.btn-con{
  width: 710px;
  padding: 24px 0;
  text-align: center;
  border-radius: 10px;
  background-color: #f24561; 
}
</style>



