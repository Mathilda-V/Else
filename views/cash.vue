    <template>
  <div class="cash">
    <navbar :title="title"></navbar>
    <div class="head">
      <text class="head-txt">当前余额</text>
      <text class="head-num">￥40.0</text>
    </div>
    <div class="title">
      <text class="title-txt">提现金额</text>
    </div>
    <div class="box">
      <div :class="['box-item', curIndex==index?'bor':'bg-white']" v-for="(item, index) in moneyList" @click="check(item, index)">
        <text :class="['box-txt', curIndex==index?'color-red':'color-gray' ]">{{item}}</text>
        <text v-if="index==3" :class="['box-txt-spe', curIndex==index?'color-gray':'' ]">余额大于等于1000</text>
      </div>
    </div>
    <div class="box">
      <text class="box-tips">温馨提示：申请提现之后，1到3个工作日到账。</text>
    </div>
    <div class="charge-btm" @click="goCash">
      <text :class="['charge-btn', chargeNum?'bg-red':'bg-gray']">提现{{chargeNum?'￥'+chargeNum:''}}</text>
    </div>
    <!-- 提现弹框 -->
    <dialog 
      :title="dialogTitle"
      :rightTxt="dialogRightTxt" 
      :show="dialogShow"
      @toCancle="toCancle"
      @toConfirm="toConfirm">
    </dialog>      
  </div>
</template>
<script>
const storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");
import navbar from "base/navbar";
import Dialog from "base/dialog";
import util from "common/js/util";
import { CLOSE, PAY,  } from 'common/js/icon-type'

export default {
  mixins: [util],
  components: { navbar, Dialog },
  data() {
    return {
      title: "提现",
      moneyList: [ '10.0', '50.0', '100.0', '全部提现'],
      curIndex: -1,
      chargeNum: '',
      dialogShow: false,
      maskShow: false,
      dialogTitle: "确定要提现吗",
      dialogRightTxt: "确定"
    };
  },
  created() {

  },
  methods: {
    check(item, index) {
      this.curIndex = index;
      this.chargeNum = item=='全部提现'?'全部金额':item
    },
    goCash() {
      if(this.chargeNum){
        this.open('bindAlipay', 'true', () => { 
          storage.setItem('cashMoney', this.chargeNum)
        })
        // this.dialogShow = true;
      }else {
        modal.toast({message: "请选择提现金额!"})
      }
    },
    toCancle() { // 删除弹窗提示
      this.dialogShow = false;
    },
    toConfirm() {
      this.dialogShow = false;
      modal.toast({message: '提交申请成功,1到3个工作日后到账~'})
      this.close('true')
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
.cash {
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
  justify-content: center;
  align-items: center;
}
.box-txt {
  font-size: 30px;
}
.box-tips {
  font-size: 24px;
  color:#e5345f;
}
.box-txt-spe {
  padding-top: 5px;
  font-size: 24px;
  color: #cccccc;
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
  background-color: #ffffff;
  font-size: 30px;
  border-radius: 10px;
}
</style>   