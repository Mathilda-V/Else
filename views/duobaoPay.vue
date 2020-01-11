<template>
  <div class="duobaoPay">
    <navbar title="支付结果" showBack="true"></navbar> 
    <div class="pay-main align-center">
      <image class="marginT150" :src="joinSuccess" style="width: 300px;height: 300px" />
      <text class="marginT50 colorBlue size48">恭喜您，参与成功</text>
      <text class="marginT20 colorRed size24" v-if="endDate">开奖日期：{{ endDate, 1 | date }}</text>
      <text class="color9 size24">温馨提示：记得来查看中奖公告哦~~</text>
      <text class="marginT150 findOther size30" @click="openDuobao">继续逛逛</text>
    </div>
  </div>
</template>
<script>
const storage = weex.requireModule("storage")
import navbar from "base/navbar"
import { WxcMinibar } from 'weex-ui'
import Util from "common/js/util"
import { date } from 'common/js/filters'
import { JOINSUCCESS } from 'common/js/icon-type'

export default {
  components: { navbar, WxcMinibar },
  filters: { date },
  mixins: [Util],
  data () {
    return {
      statusbarHeight: 40,
      endDate: '',
      joinSuccess: JOINSUCCESS
    }
  },
  created () {
    storage.getItem('duobaoGoods', e => { this.endDate = JSON.parse(e.data).end_time })
  },
  methods: {
    // 打开积分夺宝
    openDuobao () {
      this.close()
    },
  }
}
</script>
<style scoped>
.row {
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.flex-start {
  justify-content: flex-start;
}
.between {
  justify-content: space-between;
}
.align-center {
  align-items: center;
}
.align-end {
  align-items: flex-end;
}
.fontNormal {
  color: #666666;
  font-size: 24px;
}
.colorRed {
  color: #fe4353;
}
.colorBlue {
  color: #6C9FFF;
}
.colorF {
  color: #ffffff;
}
.colorC {
  color: #cccccc;
}
.color9 {
  color: #999999;
}
.color6 {
  color: #666666;
}
.color3 {
  color: #333333;
}
.size24 {
  font-size: 24px;
}
.size28 {
  font-size: 28px;
}
.size30 {
  font-size: 30px;
}
.size48 {
  font-size: 48px;
}
.bgcF {
  background-color: #ffffff;
}
.bgcE {
  background-color: #eeeeee;
}
.bgcRed {
  background-color: #fe4353;
}
.marginT20 {
  margin-top: 20px;
}
.marginT50 {
  margin-top: 50px;
}
.marginT150 {
  margin-top: 150px;
}

.pay-main {
  width: 750px;
  height: 1200px;
}
.findOther {
  width: 300px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #ffffff;
  background-color: #fe4353;
  border-radius: 30px;
}
</style>


