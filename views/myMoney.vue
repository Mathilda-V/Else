 <template>
  <div class="myMoney">
    <navbar :title="title" :rightTxt="rightTxt" @rightClick="rightClick"></navbar>
    <div class="box">
      <div class="box-b">
        <div class="box-spe">
          <text class="box-num">40.0</text>
          <text class="f24 greytc">可用余额</text>
        </div>
        <div class="box-spe">
          <text class="box-num">4000</text>
          <text class="f24 greytc">可用积分</text>
        </div>
      </div>
      <div class="box-b">
        <text class="f26 redc box-bg" @click="toNext('recharge')">充值</text>
        <text class="f26 greybc box-bg" @click="toNext('cash')">申请提现</text>
      </div>
    </div>
		<!-- 规则介绍 -->
		<div class="rule-intro">
			<div class="into-tltle">
				<text class="tltle-txt greytc">注意事项</text>
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
  </div>
</template>
<script>
const storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");
import navbar from "base/navbar";
import util from "common/js/util";
import { MILIMALL,  } from 'common/js/icon-type'

export default {
  mixins: [util],
  components: {  navbar,  },
  data() {
    return {
      title: "我的资产",
      rightTxt: "资产明细",
      rule: [
        '充值的金额等同于积分数值。充值比例1：100 (100积分等于1块钱)。',
        '最低提现额度为10.0元，积分为1000。',
      ],
			miliMallImg: MILIMALL,
    };
  },
  created() {
  },
  methods: {
    rightClick() {
      this.open('myMoneyRecord', 'true', () => {})
    },
    toNext (e){
      this.open(e, 'true', () => { })
    },
  },
};
</script>
<style scoped>
.f24{
	font-size: 24px;
  }
.f26{
  font-size: 26px;
}
.redc{
  background-color: #e5345f;
  color: white;  
}
.greybc{
  background-color: #999;
  color: white;  
}
.greytc{
  color: #999;  
}
.myMoney {
  background-color: #f1f1f1;
}
.box {
	width: 750px;
	background-color: #ffffff;
	margin-bottom: 20px;
}
.box-b {
	width: 750px;
	padding: 30px;
	background-color: #ffffff;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
  border-color: #eee;
  border-width: 1px;
}
.box-spe {
	width: 325px;
	justify-content: space-around;
	align-items: center; 
}
.box-num {
	font-size: 36px;
  margin-bottom: 10px;
}
.box-bg {
	width: 330px;
	height: 80px;
	text-align: center;
	line-height: 80px;
  border-radius: 10px;
}
/* 积分规则 */
.rule-intro {
  background-color: #ffffff;
}
.into-tltle {
  width: 750px;
  height: 80px;
	flex-direction: row;
	align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #f1f1f1;
  border-style: solid;
}
.tltle-pic {
  width: 60px;
  height: 30px;
  background-color: #cccccc;
}
.tltle-txt {
  padding-left: 50px;
  padding-right: 50px;
  font-size: 30px;
}
.into-con {
  padding-top: 30px;
  padding-left: 30px;
  padding-right: 30px;
}
.con-item {
  width: 690px;
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
  color: #333;
}

</style>