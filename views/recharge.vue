  <template>
  <div class="recharge">
    <navbar :title="title"></navbar>
    <div class="head">
      <text class="head-txt">当前余额</text>
      <text class="head-num">￥40.0</text>
    </div>
    <div class="title">
      <text class="title-txt">充值金额</text>
    </div>
    <div class="box">
      <div :class="['box-item', chargeNum==item?'bor':'bg-white']" v-for="item in moneyList" @click="check(item)">
        <text :class="['box-txt', chargeNum==item?'color-red':'color-gray' ]">￥{{item}}</text>
      </div>
      <div class="box-item">
        <input class="box-input" type="number" placeholder="请输入要充值的金额" value="" v-model="chargeNum"> </input>
      </div>
    </div>
    <div class="charge-btm">
      <text :class="['charge-btn', chargeNum?'bg-red':'bg-gray']" @click="goCharge">充值{{chargeNum?'￥'+chargeNum:''}}</text>
    </div>
    <!-- 选择现金支付方式弹窗 -->
    <wxc-popup popup-color="rgb(255, 255, 255)"
            :show="isBottomShow"
            @wxcPopupOverlayClicked="closePopup"
            pos="bottom"
            :height="380"
            ref="wxcPopup">
        <div class="pay-type">
            <div class="pay-title">
                <text class="title-txt">支付方式</text>
                <image class="close-img" :src="closeIcon" resize="cover" @click="closePopup"/>
            </div>
            <div class="pay-con">
                <div class="pay-item" v-for="(v,e) in pay" :key="e" @click="payType(e)">
                    <div class="circle-big"></div>
                    <div class="circle-small" v-if="currentPay == e"></div>
                    <image class="type-img" :src="v.img" resize="cover"/>
                    <text class="type-txt">{{v.name}}</text>
                </div>
            </div>
            <text class="pay-btn type-txt" @click="toPay()">确认支付</text>
        </div>
    </wxc-popup>
  </div>
</template>
<script>
const storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");
import navbar from "base/navbar";
import util from "common/js/util";
import { WxcPopup } from 'weex-ui';
import { CLOSE, PAY,  } from 'common/js/icon-type'

export default {
  mixins: [util],
  components: { navbar, WxcPopup },
  data() {
    return {
      title: "充值",
      moneyList: [ 100, 200, 500],
      pay:[
        {name:'支付宝',img:PAY[0]},
        {name:'微信',img:PAY[1]}
      ],
      chargeNum: '',
      isBottomShow: false,
      currentPay: 0,
      closeIcon: CLOSE,
    };
  },
  created() {

  },
  methods: {
    check(item) {
      this.chargeNum = item;
    },
    goCharge() {
      if(this.chargeNum){
        this.isBottomShow = true;
      }else {
        modal.toast({message: "请选择充值金额!"})
      }
    },
    payType(index) {
      this.currentPay = index;
    },
    closePopup () {
      this.isBottomShow = false;
    },
    toPay () {
      console.log(this.currentPay)
      this.isBottomShow = false;
    },
  },
};
</script>
<style scoped>
.bg-white {
  background-color: #ffffff;
}
.bg-red {
  background-color: #e5345f;
  color: #ffffff;
}
.bg-gray {
  background-color: #cccccc;
  color: #999999;
}
.bor {
  border-color: #e5345f;
  border-width: 1px;
}
.color-red {
  color: #e5345f;
}
.color-gray {
  color: #999999;
}
.recharge {
  background-color: #f1f1f1;
}
.head {
  width: 750px;
  height: 200px;
  background-color: #ffffff;
  justify-content: center;
  align-items: center;
}
.head-txt {
  font-size: 26px;
  color: #666666;
}
.head-num {
  padding-top: 10px;
  font-size: 46px;
}
.title {
  width: 750px;
  padding-top: 50px;
  padding-bottom: 20px;
  padding-left: 20px;
  flex-direction: row;
  align-items: center;
}
.title-txt {
  padding-left: 10px;
  font-size: 28px;
  color: #666666;
}
.box {
  width: 750px;
  padding: 20px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
.box-item {
  width: 340px;
  height: 140px;
  margin-bottom: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.box-txt {
  font-size: 30px;
}
.box-input {
  width: 300px;
  height: 100px;
  text-align: center;
}
.charge-btm {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 750px;
  text-align: center;
  align-items: center;
  padding: 20px;
}
.charge-btn {
  width: 710px;
  text-align: center;
  line-height: 90px;
  margin-top: 20px;
  background-color: #eeeeee;
  color: #999999;
  font-size: 30px;
  border-radius: 10px;
}
/* 支付方式 */
.pay-title {
  position: relative;
  width: 750px;
  height: 80px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #cccccc;
}
.close-img {
  position: absolute;
  right: 20px;
  top: 20px;
  width: 60px;
  height: 60px;
}
.pay-con {
  padding-top: 50px;
  padding-left: 30px;
}
.pay-item {
  flex-direction: row;
  align-items: center;
  position: relative;
  padding-bottom: 30px;
}
.circle-big {
  width: 40px;
  height: 40px;
  border-radius: 40px;
  border-width: 1px;
  border-style: solid;
  border-color: #cccccc;
}
.circle-small {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 20px;
  height: 20px;
  border-radius: 20px;
  background-color: #cccccc;
}
.type-img {
  width: 40px;
  height: 40px;
  margin-left: 20px;
  margin-right: 20px;
}
.type-txt {
  font-size: 30px;
  color: #666666;
}
.pay-btn {
  width: 710px;
  margin: 20px;
  line-height: 80px;
  text-align: center;
  background-color: #cccccc;
}
</style>   