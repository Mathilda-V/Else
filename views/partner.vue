 <template>
  <div>
    <navbar :title="title"></navbar>
    <scroller class="partner" show-scrollbar="false" :style="{height: contentHeight + 'px'}">
      <image class="bg" :src="partnerBg"></image>
      <div class="invite">
        <image class="invite-img" :src="partnerInvite"></image>
        <text class="invite-explain">邀请新用户注册成为你的下家,下家在积米惠购每下一笔订单你都可以获得100%佣金,永久有效.</text>
        <text class="invite-btn">立即分享</text>
        <!-- <text class="invite-explain">被邀请合伙人可得50元新人红包</text> -->
        <text class="invite-my" @click="copyCode">我的邀请码NYD7S</text>
      </div>
      <!-- 邀请记录 -->
      <div class="record">
        <div class="invite record-con">
          <div class="record-tab">
            <text :class="['tab-txt', curIndex == index?'tab-red':'tab-white']" v-for="(item, index) in tabTitles" @click="tabSelected(index)">{{item}}</text>
          </div>
          <div class="tab-box" ref="inviteShow">
            <div class="tab-con">
              <div class="tab-head">
                <text class="w-150 gray-normal">排名</text>
                <text class="w-200 gray-normal">用户名</text>
                <text class="w-150 gray-normal">人数</text>
                <text class="w-200 gray-normal">获得奖励(元)</text>
              </div>
              <div class="tab-rank" v-for="(item, index) in superList">
                <text :class="['w-150', index==0?'red-big':(index==1?'gray-big':(index==2?'orange-big':'gray-normal'))]">{{index+1}}</text>
                <text class="w-200 gray-normal">{{item.name}}</text>
                <text class="w-150 gray-normal">{{item.num}}</text>
                <text class="w-200 red-normal">{{item.money}}</text>              
              </div>
            </div>
            <div class="tab-con">
              <div class="tab-head">
                <text class="w-355 gray-normal">用户名</text>
                <text class="w-355 gray-normal">获得奖励(元)</text>
              </div>
              <div class="tab-rank rank-else" v-for="(item, index) in myList">
                <text class="w-355 gray-normal">{{item.name}}</text>
                <text class="w-355 red-normal">{{item.money}}</text>              
              </div>
            </div>
          </div>
        </div>
        <text class="record-title">邀请记录</text>
      </div>
      <!-- 常见问题解答 -->
      <div class="ask">
        <text class="ask-title">常见问题解答</text>
        <div class="ask-con" v-for="(item, index) in askList" @click="openQuestion(index)">
          <div class="ask-item">
            <text class="item-left">{{index+1+'.'+item.ask}}</text>
            <image class="item-right" :src="arrowRight" ref="wrapArrow"></image>
          </div>
          <text class="item-bottom" v-if="item.state">答：{{item.question}}</text>       
        </div>
      </div>
    </scroller>
  </div>
</template>
<script>
const storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");
const animation = weex.requireModule('animation')
const clipboard = weex.requireModule('clipboard')
import navbar from "base/navbar";
import util from "common/js/util";
import { DIRECTION_ARROW , PARTNER } from 'common/js/icon-type';
import { WxcTabPage } from 'weex-ui';

export default {
  mixins: [util],
  components: { navbar, WxcTabPage },
  data() {
    return {
      title: "合伙人",
      arrowRight: DIRECTION_ARROW[0],
      partnerBg: PARTNER.PARTNER_BG,
      partnerInvite: PARTNER.PARTNER_INVITE,
      contentHeight: '2000',
      tabTitles: ['邀请达人', '我邀请的'],
      curIndex: 0,
      superList: [
        {name: '该美嘉拉', num: '3666', money: '546345435'},
        {name: '该美嘉拉', num: '3666', money: '546345435'},
        {name: '该美嘉拉', num: '3666', money: '546345435'},
        {name: '该美嘉拉', num: '3666', money: '546345435'},
        {name: '该美嘉拉', num: '3666', money: '546345435'},
        {name: '该美嘉拉', num: '3666', money: '546345435'},
        {name: '该美嘉拉', num: '3666', money: '546345435'},
        {name: '该美嘉拉', num: '3666', money: '546345435'},
        {name: '该美嘉拉', num: '3666', money: '546345435'},
        {name: '该美嘉拉', num: '3666', money: '546345435'},
      ],
      myList: [
        {name: '该美嘉拉', num: '3666', money: '546345435'},
        {name: '该美嘉拉', num: '3666', money: '546345435'},
        {name: '该美嘉拉', num: '3666', money: '546345435'},
        {name: '该美嘉拉', num: '3666', money: '546345435'},
        {name: '该美嘉拉', num: '3666', money: '546345435'},
        {name: '该美嘉拉', num: '3666', money: '546345435'},
      ],
      askList: [
        {state: false, ask: "怎样才算邀请成功?", question: '点击“立即分享”，伙伴安装积米惠购APP，在“我的”页面找到“填写邀请码/福利吗”填写【你的邀请码是NG5YS】'},
        {state: false, ask: "成为最活跃的用户条件?", question: '用户需要在15天内正常使用APP，以一定频率进行一些用户常见操作：搜索、逛商品、分享、下单、设置、启动APP、邀请好友、查看订单、意见反馈。新用户未满15天的用户默认为活跃用户。'},
        {state: false, ask: "好友已下单，为什么我没有收益?", question: '好友下单后需要进入“我的订单”页面查看订单，确认收货后，奖励金额才能到您的账上。'},
        {state: false, ask: "预估收益如何体现?", question: '确认收货之后预估收益会变成“可提现收益”。如果该订单发生退货维权，该订单对应的首页将被扣除。'},
        {state: false, ask: "提现什么时候到账?", question: '申请提现之后，1到3个工作日到账。'},
        {state: false, ask: "赚钱收益是真实的吗?将会一直都有吗？积米惠购不赔钱吗？", question: '只要您邀请的好友真实有效，不能自己邀请自己不能作弊，则收益真实有效，您可以亲测一下是否可以提现到账在选择全身心投入到该项目。合伙人项目长期有效。奖金一部分来自商家佣金，一部分来自积米惠购平台为打开市场而投资亏钱，再次重申请勿作弊。'},
        {state: false, ask: "好友购买哪些商品有奖励?", question: '好友购买积米惠购任何商品您都能拿到奖励。'},
        {state: false, ask: "怎样算作弊?", question: '自己推荐自己注册；以骗取奖励为目的在订单确认收货后又申请退货维权。发现违规情况，将取消其奖励、清空账户余额、取消相关权限、冻结账户及其好友账户、必要时将追究其法律责任。'},
      ],
    }
  },
  created() {
    this.calcHeight();
  },
  methods: {
    calcHeight() {
      storage.getItem('viewport', (e) => {
        if(e.result == "success"){
          this.contentHeight = JSON.parse(e.data).deviceHeight;
        }
      })
    },
    tabSelected(e) {
      this.curIndex = e;
      let inviteEL = this.$refs.inviteShow;
      let angle = e == 0?355:-355
      this.animation(inviteEL, {transform: `translateX(${angle}px)`}, 200, 0, 'ease', false, ()=>{})
    }, 
    openQuestion(index){
      this.animation(this.$refs.wrapArrow[index], {transform: this.askList[index].state?'rotate(0deg)':'rotate(90deg)'}, 100, 0, 'ease-out', false, ()=>{})
      this.askList[index].state = !this.askList[index].state;
    },
    copyCode() { 
      var copyCon = ``;
      clipboard.setString(copyCon);
      modal.toast({message:"复制成功！"})
    }
  },
};
</script>
<style scoped>
.partner {
  background-color: #f85820;
}
.bg {
  width: 750px;
  height: 350px;
  background-color: #cccccc;
}
.red-big {
  font-size: 30px;
  color: #ff0000;  
}
.gray-big {
  font-size: 30px;
  color: #a2a0a1;  
}
.orange-big {
  font-size: 30px;
  color: #f9a021;  
}
.red-normal {
  font-size: 24px;
  color: #ff0000;
}
.gray-normal {
  font-size: 24px;
  color: #999999;
}
.invite {
  width: 710px;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 30px;
  padding: 50px;
  border-radius: 50px;
  background-color: #ffffff;
  justify-content: center;
  align-items: center;
}
.invite-img {
  width: 710px;
  height: 300px;
  background-color: #cccccc;
  margin-bottom: 40px;
}
.invite-explain {
  margin-bottom: 40px;
  font-size: 24px;
  line-height: 40px;
  color: #999;
}
.invite-btn {
  width: 520px;
  text-align: center;
  line-height: 80px;
  margin-bottom: 40px;
  border-radius: 50px;
  font-size: 30px;
  color: #e5345f;
  background-color: #ffe818;
}
.invite-my {
  width: 350px;
  text-align: center;
  line-height: 60px;
  border-width: 1px;
  border-style: solid;
  border-color: #e5345f;
  border-radius: 30px;
  font-size: 24px;
  color: #e5345f
}
/* 邀请记录 */
.record {
  position: relative;
  padding-top: 40px;
}
.record-title {
  position: absolute;
  top: 0;
  left: 220px;
  width: 300px;
  line-height: 80px;
  text-align: center;
  background-color: #fe7e25;
  color: #ffffff;
  font-size: 30px;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
}
.record-con {
  padding-top: 80px;
}
.record-tab {
  width: 710px;
  flex-direction: row;
}
.tab-txt {
  width: 195px;
  line-height: 80px;
  margin-left: 80px;
  margin-right: 80px;
  text-align: center;
  font-size: 24px;
  background-color: #ffffff;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  margin-bottom: 3px;
}
.tab-white {
  color: #999999;
  border-bottom-color: #ffffff;
}
.tab-red {
  color: #fe4353;
  border-bottom-color: #fe4353;
}
.tab-box {
  flex-direction: row;
  transform: translateX(355px);
}
.tab-con {
  width: 710px;
  padding-top: 10px;
  padding-bottom: 30px;
}
.tab-head {
  height: 100px;
  flex-direction: row;
  align-items: center;
  background-color: #f8f8f8;
}
.tab-rank {
  height: 100px;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #cccccc;  
}
.rank-else {

}
.w-150 {
  width: 150px;
  text-align: center;
}
.w-200 {
  width: 200px;
  text-align: center;
}
.w-210 {
  width: 210px;
  text-align: center;
}
.w-355 {
  width: 355px;
  text-align: center;
}
/* 常见问题解答 */
.ask {
  width: 750px;
  justify-content: center;
  align-items: center;
  margin-bottom: 200px;
}
.ask-title {
  color: #ffffff;
  font-size: 34px;
  padding-bottom: 20px;
}
.ask-con {
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #cccccc;
}
.ask-item {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.item-left {
  flex-direction: row;
  width: 650px;
  color: #ffffff;
  font-size: 28px;
  line-height: 60px;
  font-weight: bold;
}
.item-right {
  width: 50px;
  height: 50px;
}
.item-bottom {
  width: 700px;
  padding-top: 10px;
  padding-bottom: 10px;
  color: #ffffff;
  font-size: 24px;
  line-height: 40px;
}
</style>