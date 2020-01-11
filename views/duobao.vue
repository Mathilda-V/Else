<template>
  <div class="duobao">
    <navbar title="积分夺宝" showBack="true" rightTxt="中奖信息" @rightClick="openDuobaoRecord(duobaoList)"></navbar>  
    <list class="duobao-list bgcE">
      <cell>
        <image class="bgcF" :src="headImg[0]" style="width: 750px;height: 400px;" />
      </cell>
      <cell class="bgcF" :class="[idx < duobaoList.length-1 ? 'borderB10' : '']" v-if="isNull" v-for="(items,idx) in duobaoList" :key="items.termNum">
        <div class="duobao-date row between">
          <div class="row">
            <image :src="time" style="width: 30px;height: 30px;background-color: #efefef;" />
            <text class="color9 size24"> {{ items.termNum }}</text>
          </div>
          <text class="fontNormal">开奖日期：{{ items.data[0].end_time, 0 | date}}</text>
        </div>
        <div class="duobao-item row between" v-for="(item, index) in items.data" @click="openDuobaoDetail(item)" :key="index">
          <image :src="item.pict_url + '_140x140q80s100.jpg_.webp'" style="width: 140px;height: 140px;background-color: #efefef;" />
          <!-- <image :src="item.pict_url" style="width: 140px;height: 140px;background-color: #efefef;" /> -->
          <div class="duobao-info between">
            <text class="color3 size28">{{ item.good_name }}</text>
            <div class="row between">
              <div class="progressBar row">
                <progress class="progress"
                          :progress-styles="progressStyles"
                          :total="item.total_join_num"
                          :current="item.now_join_num"></progress>
                <text class="fontNormal">剩{{ item.total_join_num - item.now_join_num }}个名额</text>
              </div>
              <text :class="['duobao-state', 'size24', item.is_open == 1 ? 'colorC' : is_login && item.is_join ? 'bgcBlueColorWhite' : 'bgcRedColorWhite']">{{ item.is_open == 1 ? '已开奖' : is_login && item.is_join ? '等待开奖' : '立即参加' }}</text>
            </div>
          </div>
        </div>
      </cell>
      <cell class="nullData row" v-if="!isNull">
        <text class="nullDataText">近期没有夺宝项目</text>
      </cell>
    </list>
  </div>
</template>
<script>
const storage = weex.requireModule("storage")
import navbar from "base/navbar"
import progress from "base/progress"
import { WxcMinibar } from 'weex-ui'
import Util from "common/js/util"
import { toPercent, date } from 'common/js/filters'
import { DUOBAO, TIME } from 'common/js/icon-type'

export default {
  components: { navbar, progress, WxcMinibar },
  filters: { toPercent, date },
  mixins: [Util],
  data () {
    return {
      statusbarHeight: 40,
      progressStyles: {
        width: 220,
        height: 10,
        frontColor: '#fe4353',
        bgColor: '#eeeeee'
      },
      headImg: DUOBAO,
      time: TIME,
      duobaoList: [],
      isNull: true
    }
  },
  created () {
    this.getData()
    this.currentTimestamp = new Date().getTime()
    storage.getItem('info', e => { 
      if (e.data != 'undefined') {
        this.is_login = true
        this.userInfo = JSON.parse(e.data)
      } else {
        this.is_login = false
      }
    })
    setTimeout(() => {
      const joinInfo = new BroadcastChannel("duobaoDetail")
      joinInfo.onmessage = (e) => { if (e.data.success) this.getData() }
    }, 500)
  },
  methods: {
    // 获取夺宝商品
    getData () {
      this.post('prize', 'returnFeedBackGoodList', {}, res => {
        this.duobaoList = []
        if (res.message == 'ok') {
          console.log('ssss', res)
          const d = res.data
          for (let key in res.data) this.duobaoList.unshift({ termNum: key, data: d[key] })
          this.isNull = d.length == 0 ? false : true
        }
      })
    },
    // 打开夺宝详情
    openDuobaoDetail (o) {
      storage.setItem('duobaoGoods', JSON.stringify(o), e => { this.open('duobaoDetail', 'true', function (event) { }) })
    },
    // 打开夺宝参与记录
    openDuobaoRecord (l) {
      this.open('duobaoRecord', 'true', function (event) { })
    }
  }
}
</script>
<style scoped>
.row {
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.between {
  justify-content: space-between;
}
.fontNormal {
  color: #666666;
  font-size: 24px;
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
.bgcF {
  background-color: #ffffff;
}
.bgcE {
  background-color: #eeeeee;
}
.bgcRed {
  background-color: #fe4353;
}
.bgcRedColorWhite {
  background-color: #fe4353;
  color: #ffffff;
}
.bgcBlueColorWhite {
  background-color: #359DF3;
  color: #ffffff;
}
.duobao-list {
  width: 750px;
}
.borderB10 {
  border-bottom-width: 10;
  border-bottom-color: #efefef;
}
.duobao-date {
  padding-left: 20px;
  padding-right: 20px;
  width: 750px;
  height: 60px;
}
.duobao-item {
  padding: 20px;
  width: 750px;
  height: 180px;
  border-top-width: 1;
  border-color: #efefef;
}
.duobao-info {
  width: 550px;
  height: 140px;
}
.duobao-state {
  width: 120px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #eeeeee;
  border-radius: 5px;
}
.progress {
  margin-right: 8px;
}
.nullData {
  width: 750px;
  height: 500px;
}
.nullDataText {
  width: 300px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border-width: 1;
  border-color: #999;
  border-radius: 5px;
}
</style>

