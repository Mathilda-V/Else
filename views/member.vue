   <template>
  <div>
    <navbar :title="title"></navbar>
    <scroller class="recharge" show-scrollbar="false" :style="{height: contentHeight + 'px'}">
      <div class="head">
        <image class="head-pic" src="" ressize="contain" ></image>
        <div class="head-con">
          <div class="row">
            <text class="name">chv770</text>
            <image class="title-img" :src="vipIcon[5]"></image>
          </div>
          <div class="row">
            <text class="status">年</text>
            <text class="status-txt">(2018-12-31至2019-12-31)</text>
          </div>
        </div>
      </div>
      <!-- 购买会员 -->
      <div class="title">
        <text class="title-txt">购买会员</text>
      </div>
      <div class="box">
        <div :class="['box-item', chargeNum==item.num?'bor':'bg-white']" v-for="(item, index) in moneyList" @click="check(item, index)">
          <text :class="['box-txt', chargeNum==item.num?'color-red':'color-gray' ]">￥{{item.num}}</text>
          <text :class="['box-txt-spe', chargeNum==item.num?'color-red':'color-gray']">{{item.txt}}</text>
        </div>
      </div>
      <!-- 权益说明 -->
      <div class="explain">
        <div class="explain-title">
          <image class="title-img" :src="vipIcon[5]"></image>
          <text class="title-txt">会员权益说明</text>
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
    <text :class="['charge-btn', chargeNum?'bg-red':'bg-grey']" @click="openPopup">开通权益</text>
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
            <text class="pay-btn type-txt" @click="goCharge()">确认开通</text>
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
import { CLOSE, PAY, VIP } from 'common/js/icon-type'

export default {
  mixins: [util],
  components: { navbar, WxcPopup },
  data() {
    return {
      title: "会员",
      contentHeight: 2000,
      moneyList: [ 
        { num: 15, txt: '普通会员' },
        { num: 150, txt: '年费会员' }
      ],
      pay:[
        { name:'支付宝',img:PAY[0]} ,
        { name:'微信',img:PAY[1] } 
      ],
      rule: [
         '开通会员可以申请合伙人功能，邀请新用户成为下家获得佣金。',
         '开通会员之后享受搜索淘宝商品所有返利。',
         '权益用户享受极速客服服务，系统快速响应，优先处理权益用户相关咨询事项。',
         '针对权益用户的提现审核，如需人工审核的提现，将优先处理审核，大额提现等特殊情况将优先该权益。',
      ],
      chargeNum: '',
      isBottomShow: false,
      currentPay: 0,
      closeIcon: CLOSE,
      vipIcon: VIP,
    };
  },
  created() {
    this.calcHeight();
    this.getUserToken();
  },
  methods: {
    getUserToken() {
      storage.getItem('info', e => {
        if (e.result == 'success') {
          this.userInfo = JSON.parse(e.data);
          console.log('info', this.userInfo);
        }
      });
    },
    calcHeight(){
      storage.getItem('viewport', (e) => {
        if(e.result == "success"){
          this.contentHeight = JSON.parse(e.data).deviceHeight
        }
      })
    },
    check(item) {
      this.chargeNum = item.num;
    },
    goCharge() {
      if(!this.chargeNum) {
        modal.toast({message:'请选择所充值的会员类型!'})
        return;
      }
      const params = {
        access_token: this.access_token,
        user_token: this.userInfo.user_token,
        type: this.chargeNum,
        pay_type: this.currentPay == 0 ? 2 : 1
      };
      this.post('user', 'openVip', params, e => {
        console.log(e)
        this.isBottomShow = false;
        // if(e.success) {
        //   this.isBottomShow = true;
        // }else {
        //   modal.toast({message: e.message})
        // }
      })
    },
    payType(index) {
      this.currentPay = index;
    },
    openPopup () {
      this.isBottomShow = true;
    },
    closePopup () {
      this.isBottomShow = false;
    },
    toPay () {
      // console.log(this.currentPay)
      this.isBottomShow = false;

    },
    toNext(e) {
      this.open(e, 'true', () => { })
    },
  },
};
</script>
<style scoped>
.row{
  flex-direction: row;
}
.bg-white {
  background-color: #ffffff;
}
.bg-red {
  background-color: #e5345f;
  color: white;
}
.bg-grey {
  background-color: #ccc;
  color: #999;
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
/* 用户信息 */
.head {
  flex-direction: row;
  width: 750px;
  padding-top: 30px;
  padding-left: 40px;
  padding-bottom: 30px;
  background-color: #e5345f;
} 
.head-pic {
  width: 100px;
  height: 100px;
  border-radius: 100px;
  background-color: #cccccc;      
}
.head-con {
  padding-left: 20px;
  flex-direction: column;
  justify-content: space-between;
}
.name {
  font-size: 32px;
  line-height: 50px;
  color: #ffffff;
}
.status {
  margin-top: 10px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: #d6ae6e;
  color: #382609;
  font-size: 20px;
  margin-right: 10px;
  border-radius: 4px;
}
.status-txt {
  height: 30px;
  margin-top: 10px;
  font-size: 22px;
  color: #d6ae6e;
}
.title {
  width: 750px;
  padding-top: 50px;
  padding-bottom: 20px;
  padding-left: 20px;
  flex-direction: row;
  align-items: center;
}
.title-img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
.title-txt {
  font-size: 26px;
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
  justify-content: center;
  align-items: center;
}
.box-txt {
  font-size: 30px;
}
.box-txt-spe {
  padding-top: 5px;
  font-size: 26px;
  color: #cccccc;
}
.color-red {
  color: red;
}
/* 会员权益 */
.explain {
  padding: 20px;
  margin-bottom: 200px;
  background-color: #ffffff;
}
.explain-title {
  width: 750px;
  padding-top: 10px;
  padding-bottom: 30px;
  padding-left: 20px;
  flex-direction: row;
  align-items: center;
}
.into-con {
  padding-left: 20px;
  padding-right: 20px;
}
.con-item {
  width: 710px;
  margin-bottom: 40px;
  flex-direction: row;
}
.con-pic {
  position: relative;
  top: 5px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #999;
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
.charge-btn {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 750px;
  height: 90px;
  text-align: center;
  line-height: 90px;
  background-color: #cccccc;
  font-size: 30px;
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