  <template>
  <div class="incomeList">
    <navbar :title="title"></navbar>
    <!-- 本月收益报表 -->
    <div class="p-30 row">
      <text class="title mr-20">本月收益报表</text>
      <text class="now-time">截至2019-01-02</text>
    </div>
    <div class="now-con center">
      <div class="row pt-40" @click="openMask('help')">
        <text class="gray-normal">预估收益</text>
        <text class="help-txt">?</text>
      </div>
      <div class="row">
        <text class="red-big mr-20">0</text>
        <text class="gray-normal">元</text>
      </div>
    </div>
    <div class="row br">
      <div class="center now-list" v-for="(item, index) in incomeNum">
        <div class="row pt-20" @click="openMask(index)">
          <text class="gray-normal">{{item.txt}}</text>
          <text class="help-txt" v-if="index==2">?</text>
        </div>
        <div class="row">
          <text class="red-normal">{{item.num}}</text>
          <text class="gray-normal">元</text>
        </div>
      </div>
    </div>
    <!-- 上月预估报表 -->
    <div class="btw br p-30">
      <text class="title">上月预估收益</text>
      <text class="red-normal">0元</text>
    </div>
    <!-- 累计到账收益 -->
    <div class="btw amount-con">
      <div>
        <text class="title pt-40">累计到账收益</text>
        <div class="row">
          <text class="red-big mr-20">0</text>
          <text class="gray-normal">元</text>
        </div>
      </div>
      <div class="circle-con">
        <div class="rotate" :style="{'transform':'rotate('+360*0.1+'deg)'}"></div>
        <div class="left" :style="{'backgroundColor':(0.1<0.5?'#fcc550':'rgba(0,0,0,0)')}"></div>
        <div class="right" :style="{'backgroundColor':(0.1>0.5?'#ff89a1':'rgba(0,0,0,0)')}"></div>
        <div class="circle-center"></div>
      </div>
    </div> 
    <div class="row p-20">
      <div class="bg-yellow mr-20"></div>
      <text class="gray-normal">直接下家奖励0元</text>
    </div>
    <div class="row p-20">
      <div class="bg-pink mr-20"></div>
      <text class="gray-normal">其他下家奖励0元</text>
    </div>
    <!-- 弹窗 -->
    <div class="mask" v-if="helpShow || moneyShow" ref="mask" @click="closeMask">
      <div class="auto" v-if="helpShow">
        <div class="mask-item" v-for="item in helpList">
          <text class="gray-small">{{item.title}}: {{item.txt}}</text>
        </div>
      </div>
      <div class="auto" v-if="moneyShow">
        <div class="mask-item" v-for="item in moneyList">
          <text class="gray-small">{{item.title}}: {{item.txt}}</text>
        </div>
      </div>
      <text class="record-close" @click="closeMask">×</text>
    </div>
  </div>
</template>
<script>
const storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");
import navbar from "base/navbar";
import util from "common/js/util";

export default {
  mixins: [util],
  components: { navbar,  },
  data() {
    return {
      title: "提现",
      incomeNum: [
        { txt: '今日预估收益', num: '0' },
        { txt: '昨日预估收益', num: '0' },
        { txt: '已到账收益', num: '0' },
      ],
      helpList: [
        { title: '预估收益', txt: '指你所有的订单包括正在进行中的订单,总的预估能够得到的收益;'},
        { title: '已到账收益', txt: '指你已完成的订单,正在进行中的订单不包括;'},
        { title: '累计收益', txt: '本活动所有已到账收益总和'},
      ],
      moneyList: [
        { title: '预估收益', txt: '指你所有的订单包括正在进行中的订单,总的预估能够得到的收益;'},
        { title: '已到账收益', txt: '指你已完成的订单,正在进行中的订单不包括;'},
        { title: '累计收益', txt: '本活动所有已到账收益总和'},
      ],
      helpShow: false,
      moneyShow: false
    };
  },
  created() {

  },
  methods: {
    openMask(e) {
      if(e == "help") {
        this.helpShow = true;
      }else if(e == 2){
        this.moneyShow = true;
      }
    },
    closeMask() {
      this.helpShow = false;
      this.moneyShow = false;
    },
  },
};
</script>
<style scoped>
.row {
  flex-direction: row;
  align-items: center;
}
.center {
  justify-content: center;
  align-items: center;
}
.btw {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;  
}
.bg-yellow {
  width: 30px;
  height: 30px;
  background-color: #fcc550;
}
.bg-pink {
  width: 30px;
  height: 30px;
  background-color: #ff89a1;
}
.red-big {
  color: #ff0000;
  font-size: 70px;
  position: relative;
  top: -10px;
}
.red-normal {
  color: #ff0000;
  font-size: 30px;
}
.gray-normal {
  color: #999999;
  font-size: 30px;
}
.gray-small {
  width: 520px;
  color: #999999;
  font-size: 26px;
  line-height: 40px;
}
.p-20 {
  padding: 20px;
}
.p-30 {
  padding: 30px;
}
.mr-20 {
  margin-right: 20px;
}
.pt-20 {
  padding-bottom: 20px;
}
.pt-40 {
  padding-bottom: 40px;
}
.title {
  font-size: 36px;
  font-weight: bold;
}
.br {
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: #f1f1f1;
}
/* 本月收益报表 */
.now-time {
  padding: 10px;
  border-radius: 20px;
  background-color: #fef5ec;
  font-size: 24px;
  color: #999999;
}
.now-con {
  width: 750px;
  height: 250px;
}
.help-txt {
  width: 30px;
  line-height: 30px;  
  border-radius: 30px;
  background-color: #666666;
  color: #ffffff;
  font-size: 24px;
  text-align: center;
  margin-left: 10px;
}
.help-img {
  width: 30px;
  height: 30px;
  background-color: #cccccc;
}
.now-list {
  width: 250px;
  padding-bottom: 50px;
}
.amount-con {
  padding-left: 30px;
  padding-right: 50px;
}
/* 圆饼图 */
.circle-con {
  position: relative;
  width: 240px;
  height: 240px;
  border-radius: 120px;
  background-color: #fcc550;
  margin-top: 70px;
}
.rotate {
  position: absolute;
  left: 0;
  width: 120px;
  height: 240px;
  border-bottom-left-radius: 120px;
  border-bottom-right-radius: 0;
  border-top-left-radius: 120px;
  border-top-right-radius: 0;
  background-color: #ff89a1;
  transform-origin:right 120px;
}
.left {
  position: absolute;
  left: 0;
  width: 120px;
  height: 240px;
  border-bottom-left-radius: 120px;
  border-bottom-right-radius: 0;
  border-top-left-radius: 120px;
  border-top-right-radius: 0;
}
.right {
  position: absolute;
  right: 0;
  width: 120px;
  height: 240px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 120px;
  border-top-left-radius: 0;
  border-top-right-radius: 120px;
}
.circle-center {
  position: absolute;
  top: 60px;
  left: 60px;
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: #ffffff;
}
/* 蒙层 */
.mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 750px;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
}
.auto {
  width: 600px;
  height: 350px;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 20px;
}
.mask-item {
  margin-bottom: 10px;
}
.record-close {
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.1);
  margin-top: 20px;
  border-radius: 40px;
  color: white;
  font-size: 40px;
}
</style>   