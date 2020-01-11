<template>
  <div>
    <navbar :title="title"></navbar>
    <scroller class="wrapper" show-scrollbar="false" style="margin-bottom:90px;">
      <!-- <div class="topimg">
        <image src="https://img.alicdn.com/imgextra/i3/3159284535/TB2YiLCqQ7mBKNjSZFyXXbydFXa_!!3159284535.png" resize="cover"  style="width:80px;height:80px;margin-right:20px;"/>
        <text class="topimgt">还剩7天自动确认</text>
      </div> -->
      <div class="main row-btw">
        <image :src="location" resize="cover" style="width:30px;height:30px" />
        <div class="message">
          <div class="row" style="height:40px;">
            <text class="normal-text w">收货人: </text>
            <div class="row-btw" style="width:500px;">
              <text class="normal-text">{{orderInfo.name}}</text>
              <text class="normal-text">{{orderInfo.tel}}</text>
            </div>
          </div>
          <div class="row" style="height:40px;">
            <text class="normal-text w">收货地址: </text>
            <text class="normal-text">{{orderInfo.address}}</text>
          </div>
        </div>
      </div>
      <div class="main row-btw">
        <image :src="orderInfo.buy_goodpic_url+'_160x160.jpg'" resize="cover" style="width:160px;height:160px;" />
        <div class="goods-info">
          <div>
            <text class="normal-black text-height">{{orderInfo.title}}</text>
            <div class="row-btw text-height">
              <text class="normal-gray">{{orderInfo.good_spec}}</text>
              <div class="row">
                <text class="normal-orange">{{currentPayStatus}}</text>
              </div>
            </div>
          </div>
          <div class="row-btw">
            <div class="row">
              <text class="normal-red" v-if="orderInfo.rice_num != 0">{{orderInfo.rice_num}} 积分</text>
              <text class="normal-gray"> + </text>
              <text class="normal-red">￥{{orderInfo.amount}} 元</text>
            </div>
            <div 
              @click="refund(orderInfo)" 
              v-if="(orderInfo.return_status === undefined || orderInfo.return_status === null) && orderInfo.order_status != '3'">
              <text class="refund-btn">退款</text>
            </div>
            <div 
              @click="refund(orderInfo)" 
              v-else-if="(orderInfo.return_status === undefined || orderInfo.return_status === null) && orderInfo.order_status == '3'">
              <text class="refund-btn">申请售后</text>
            </div>
            <div @click="refund(orderInfo)" v-else>
              <text :class="['refund-btn', orderInfo.return_status ? 'refund-active' : '']">{{currentReturnStatus}}</text>
            </div>
          </div>
        </div>
      </div>
      <div class="main">
        <div class="detail-info">
          <text class="normal-text">订单号：</text>
          <text class="normal-text">{{orderInfo.order_num}}</text>
        </div>
        <div class="detail-info">
          <text class="normal-text">交易号：</text>
          <text class="normal-text">{{orderInfo.order_num_ser}}</text>
        </div>
        <div class="detail-info">
          <text class="normal-text">创建时间：</text>
          <text class="normal-text">{{orderInfo.formatTime}}</text>
        </div>
        <div class="detail-info">
          <text class="normal-text">付款时间：</text>
          <text class="normal-text">{{orderInfo.formatUpdateTime}}</text>
        </div>
        <div class="detail-info">
          <text class="normal-text">发货时间：</text>
          <text class="normal-text">{{orderInfo.formatSendTime}}</text>
        </div>
      </div>
      <div class="main" v-if="hasMail">
        <div class="expdet exprow">
          <!-- <image resize="cover" src="" class="expimg"/> -->
          <div>
            <text class="expt1">{{expcompany.fullname}}</text>
            <text class="expt2">官方电话{{expcompany.tel}}</text>
          </div>
        </div>
        <div class="expnum exprow">
          <text class="expt3">运单号码: {{orderInfo.order_num_exp}}</text><text class="expt3" @click="clip(orderInfo.order_num_exp)">复制</text>
        </div>
        <div class="exppro exprow" v-for="(item, t) in expl" :key="t">
          <div class="expl">
            <text class="expt4">{{item.date}}</text>
            <text class="expt5" style="text-align:center;color:#999;">{{item.time}}</text>
          </div>
          <div class="exprow">
            <div style="width:520px;">
              <text class="expt4">{{item.desc}}</text>
            </div>
          </div>
        </div>
      </div>
    </scroller>
    <div class="foot" @click="confirm">
      <text class="btn">返回</text>
    </div>
  </div>
</template>
<script>
const storage = weex.requireModule('storage')
const stream = weex.requireModule('stream')
const clipboard = weex.requireModule('clipboard')
const modal = weex.requireModule('modal')
import Navbar from 'base/navbar'
import Util from 'common/js/util'
import { formatDate } from 'common/js/common'
import { LOCATION } from 'common/js/icon-type'
const orderUrl = "https://sp0.baidu.com/9_Q4sjW91Qh3otqbppnN2DJv/pae/channel/data/asyncqury?appid=4001&nu={code}";

export default {
  components: { Navbar },
  mixins: [Util],
  data() {
    return {
      location: LOCATION,
      title: '订单详情',
      orderInfo: {},
      pay: [{ name: '支付宝' }, { name: '微信' }],
      hasMail: false,
      expcompany: { fullname: "", tel: "" },
      expl: [],
      payStatus: [
        {num: '0', status: '待付款'},
        {num: '1', status: '已付款'},
        {num: '2', status: '支付失败'},
        {num: '3', status: '已退款'},
      ],
      returnStatus: [
        {num: '-1', status: '卖家拒绝'},
        {num: '0', status: '等待退货'},
        {num: '1', status: '退货成功，买家已退款'}
      ]
    }
  },
  created() {
    storage.getItem('orderInfo', e => {
      if (e.result == 'success') {
        this.orderInfo = JSON.parse(e.data)
        this.orderInfo.formatTime = formatDate(+this.orderInfo.create_time * 1000)
        this.orderInfo.formatUpdateTime = formatDate(+this.orderInfo.update_time * 1000)
        this.orderInfo.send_time && (this.orderInfo.formatSendTime = formatDate(+this.orderInfo.send_time * 1000))
        // console.log('detail', this.orderInfo);
        if (this.orderInfo.order_num_exp != "null" && this.orderInfo.order_num_exp != "" && this.orderInfo.order_num_exp != null) {
          this.getExpOrder(this.orderInfo.order_num_exp);
        }
      }
    })
  },
  computed: {
    currentPayStatus() {
      return this.orderInfo.pay_status && this.payStatus.filter(item => item.num == this.orderInfo.pay_status)[0].status
    },
    currentReturnStatus() {
      return this.orderInfo.return_status && this.returnStatus.filter(item => item.num == this.orderInfo.return_status)[0].status
    }
  },
  methods: {
    refund(item) {
      if (WXEnvironment.platform === 'iOS') {
        if (item.return_status !== null) return
      } else if (item.return_status !== undefined) return
      storage.setItem('orderInfo', JSON.stringify(item), e => {
        if (e.result === 'success') {
          this.open('refund', 'true', () => { })
        }
      })
    },
    confirm() {
      this.close('true', () => { })
    },
    clip(t) {
      clipboard.setString(t);
      modal.toast({
        message: '复制成功',
        duration: 0.1
      });
      modal.toast({ message: "运单号复制成功" })
    },
    getExpOrder(expnum) {
      let options = {
        url: orderUrl.replace('{code}', expnum),
        method: 'GET',
        headers: {          'Content-Type': 'application/x-www-form-urlencoded',
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36",
          "Cookie": "BIDUPSID=1FD80CD3B718FA98BCDDECEE6FE71A48; PSTM=1523496337; __cfduid=d06cc72c4b1d444da72f19065048005291525660850; BAIDUID=29F26A7F5859D6112ACD9F693AD23DE9:FG=1;BDORZ=B490B5EBF6F3CD402E515D22BCDA1598; locale=zh;  BCLID=10975110735240247429; BDSFRCVID=GvCsJeC62ml1RWQ7fxDRUxAXnmKabe6TH6aokJEPPgotk5GHvPwREG0PjU8g0Kub5MgwogKKLgOTHUQP; H_BDCLCKID_SF=tJAqVID2tD-3fP36q6_WK-FSqxby26nxbe7eaJ5nJDoVDKj-3pLbbRkv0RoO3lvXam3K3JKKQpP-HJ7cyxom0--e5M4t0MvqLTvNKl0MLnclbb0xynoDjfus5UnMBMnr52OnaU5lLIcjqR8Zj6K5D63P; PSINO=2; H_PS_PSSID=1447_26911_21083_26350_26925_22072",
          "Host": "sp0.baidu.com"        },
        type: 'json'
      };
      //console.log(options);
      const vm = this;
      stream.fetch(options, function (d) {
        if (d.status == 200 && d.data.status == "0") {
          vm.hasMail = true;
          vm.expcompany = d.data.data.company;

          if (d.data.data.info.context) {
            var expList = d.data.data.info.context;
            for (var i = 0, len = expList.length; i < len; i++) {
              var obj = expList[i];
              var date = new Date();
              date.setTime(obj.time * 1000);
              obj.date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
              obj.time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
              vm.expl.push(obj);
            }
            //console.log(vm.expl);
          }
        } else {
          modal.toast({ message: "运单信息获取失败" });
        }
      }, function (d) {
        // console.log('aaaa');
        console.log(d);
      });
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '../common/stylus/variable.styl'

.wrapper {
  width: 750px;
  background-color: #EDEDED;
}
.topimg{
  width:750px;
  height:120px;
  padding:0 60px;
  flex-direction:row;
  background-color: #ff7d49;
  align-items:center;
}
.topimgt{
  font-size:24px;
  color:white;
}
.main {
  width: 710px;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 20px;
  padding: 20px;
  border-radius: 10px;
  background-color: #FFFFFF;
}
.message {
  width: 630px;
}
.goods-info {
  margin-left: 10px;
  width: 500px;
  height: 160px;
  justify-content: space-between;
}

.refund-btn {
  padding: 4px 24px;
  font-size: 25px;
  text-align: center;
  color: #f24561;
  border-width: 2px;
  border-style: solid;
  border-color: #f24561;
  border-radius: 6px;
}
.refund-active{
  border-width: 2px;
  border-style: solid;
  color: #666666;
  border-color: #666666;
}
.detail-info{
  flex-direction: row;
  align-items: center;
  padding: 5px 0;
}
.btn {
  width: 750px;
  font-size: 30px;
  color: #FFFFFF;
  font-weight: 400;
  line-height: 90px;
  text-align: center;
  background-color: #f24561;
}
.foot {
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: #EDEDED;
}

.exprow {
  flex-direction: row;
}
.expdet{
  margin-bottom:20px;
}
.expimg{
  width:80px;
  height:80px;
  background-color:#eee;
  margin-right: 20px;
  border-radius: 40px;
}
.expnum{
  width:670px;
  background-color: #eee;
  justify-content: space-between;
  margin-bottom: 20px;
}
.expt1{
  color:#333;
  line-height:50px;
  font-size:26px;
}

.expt2{
  line-height:30px;
}

.expt3{
  margin-top:5px;
  line-height:50px;
  padding-left:20px;
  padding-right:20px;
}
.expt4{
  line-height:40px;
  font-size: 22px;
  color:#666
}
.expt5{
  line-height:30px;
  font-size:18px;
  lines:2;
  text-overflow:ellipsis;
  color:#999
}

.expt2,.expt3{
  font-size:20px;
}
.exppro{
  padding-left:10px;
  padding-right:10px;
  padding-bottom:20px;
}
.expl{
  width:140px;
}
.expimg1{
  width:40px;
  height:40px;
  background-color:#eee;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 40px;
}


.row {
  flex-direction: row;
  align-items: center;
}
.row-btw {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;  
}
.space-l {
  margin-left: 10px;  
}
.normal-text{
  font-size: 26px;
  color: #666666;
}
.w {
  width: 125px;
}

</style>