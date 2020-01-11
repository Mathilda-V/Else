<template>
  <div class="duobao-record">
    <navbar title="中奖信息" showBack="true"></navbar> 
    <wxc-tab-page ref="wxc-tab-page"
                  :tab-titles="tabTitles"
                  :tab-styles="tabStyles"
                  class="tab-bar"
                  title-type="text"
                  duration="500"
                  timing-function="cubic-bezier(.17,.87,.05,.87)"
                  :title-use-slot="usesolt"
                  :tab-page-height="tabPageHeight"
                  @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected">
      <div v-for="(item,i) in tabTitles" class="tab-item" :key="i" :slot="'tab-title-'+i">
        <text :class="[(i==0)?'tab-title-first':'tab-title']">{{item.title}}</text>
        <text class="tab-text">{{item.text}}</text>
      </div>
      <list class="duobao-list bgcE">
        <cell class="bgcF" :class="[idx < duobaoList.length-1 ? 'borderB10' : '']" v-if="isNull1" v-for="(items,idx) in duobaoList" :key="items.termNum">
          <div class="duobao-date row between">
            <div class="row">
              <image :src="time" style="width: 30px;height: 30px;background-color: #efefef;" />
              <text class="color9 size24"> {{ items.termNum }}</text>
            </div>
            <text class="fontNormal">开奖日期：{{ items.data[0].create_time, 0 | date}}</text>
          </div>
          <div class="duobao-item row between" v-for="(item, index) in items.data" :key="index">
            <image :src="item.pict_url + '_140x140q80s100.jpg_.webp'" style="width: 140px;height: 140px;background-color: #efefef;" />
            <!-- <image :src="item.pict_url" style="width: 140px;height: 140px;background-color: #efefef;" /> -->
            <div class="duobao-info between">
              <text class="color3 size28">{{ item.good_name }}</text>
              <div class="row between">
                <div class="row textBox">
                  <text class="text textLeft colorF size24">参考价</text>
                  <text class="text colorRed size24">{{ item.price }}</text>
                </div>
                <text class="duobao-state size24" :class="[item.is_open == 0 ? 'bgcBlueColorWhite' : 'colorC']">{{ item.is_open == 0 ? '等待开奖' : '已开奖' }}</text>
              </div>
            </div>
          </div>
        </cell>
        <cell class="nullData row" v-if="!isNull1">
          <text class="nullDataText">没有中奖纪录</text>
        </cell>
      </list>
      <list class="duobao-list bgcE">
        <cell class="bgcF" :class="[idx < totalDuobaoList.length-1 ? 'borderB10' : '']" v-if="isNull2" v-for="(items2,idx) in totalDuobaoList" :key="items2.termNum">
          <div class="duobao-date row between">
            <div class="row">
              <image :src="time" style="width: 30px;height: 30px;background-color: #efefef;" />
              <text class="color9 size24"> {{ items2.termNum }}</text>
            </div>
            <text class="fontNormal">开奖日期：{{ items2.data[0].create_time, 0 | date}}</text>
          </div>
          <div class="duobao-item row between" v-for="(item2, index2) in items2.data" :key="index2">
            <!-- <image :src="item2.pict_url + '_140x140q80s100.jpg_.webp'" style="width: 140px;height: 140px;background-color: #efefef;" /> -->
            <image :src="item2.pict_url" style="width: 140px;height: 140px;background-color: #efefef;" />
            <div class="duobao-info between">
              <text class="color3 size28">{{ item2.good_name }}</text>
              <div class="row between">
                <div class="row textBox">
                  <text class="text textLeft bgcBlueColorWhite size24">获奖者</text>
                  <text class="text colorRed size24">{{ item2.name | privacy }}</text>
                </div>
                <div class="row textBox">
                  <text class="text textLeft colorF size24">参考价</text>
                  <text class="text colorRed size24">{{ item2.price }}</text>
                </div>
              </div>
            </div>
          </div>
        </cell>
        <cell class="nullData row" v-if="!isNull2">
          <text class="nullDataText">没有开奖纪录</text>
        </cell>
      </list>
    </wxc-tab-page>
  </div>
</template>
<script>
const dom = weex.requireModule('dom')
const storage = weex.requireModule("storage")
import navbar from "base/navbar"
import { WxcMinibar, WxcTabPage, Utils, BindEnv } from 'weex-ui'
import Util from "common/js/util"
import { date, privacy } from 'common/js/filters'
import { TIME } from 'common/js/icon-type'

export default {
  components: { navbar, WxcMinibar, WxcTabPage },
  filters: { date, privacy },
  mixins: [Util],
  data() {
    return {
      statusbarHeight: 40,
      tabTitles: [
        { title: '我的记录'},
        { title: '全部开奖记录'}
      ],
      tabStyles: {
        bgColor: '#ffffff',
        titleColor: '#999999',
        activeTitleColor: '#fe4353',
        activeBgColor: '#ffffff',
        isActiveTitleBold: true,
        width: 375,
        height: 80,
        fontSize: 24,
        hasActiveBottom: true,
        activeBottomColor: '#fe4353',
        activeBottomHeight: 3,
        activeBottomWidth: 120,
      },
      tabList: [],
      tabPageHeight: 1334,
      duobaoList: [],
      totalDuobaoList: [],
      time: TIME,
      isNull1: true,
      isNull2: true
    }
  },
  created () {
    this.getData()
    this.tabPageHeight = Utils.env.getPageHeight()
  },
  methods: {
    getData () {
      this.post('prize', 'getOwnFeedBackGoodRecord', {}, res => {
        if (res.message == 'ok') {
          const d = res.data
          for (let key in res.data) this.duobaoList.unshift({ termNum: key, data: d[key] })
          this.isNull1 = d.length == 0 ? false : true
        }
      })
      this.post('prize', 'getFeedBackGoodPrizeList', {}, res => {
        if (res.message == 'ok') {
          const d = res.data
          for (let key in res.data) this.totalDuobaoList.unshift({ termNum: key, data: d[key] })
          this.isNull2 = d.length == 0 ? false : true
        }
      })
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
.flex-end {
  justify-content: flex-end;
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
.colorRed {
  color: #fe4353;
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
.bgcBlueColorWhite {
  background-color: #359DF3;
  color: #ffffff;
}

.textBox {
  height: 32px;
  border-radius: 16px;
  box-shadow: 0 0 5px -3px #333333;
}
.text {
  padding-left: 15px;
  padding-right: 15px;
  height: 32px;
  line-height: 32px;
}
.textLeft {
  background-color: #fe4353;
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
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
.totalProgress {
  margin-right: 8px;
  width: 260px;
  height: 10px;
  border-radius: 5px;
  background-color: #eeeeee;
}
.currentProgress {
  height: 10px;
  border-radius: 5px;
  background-color: #fe4353;
}
.duobao-state {
  width: 150px;
  padding-left: 8px;
  padding-right: 8px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #eeeeee;
  border-radius: 5px;
}
.nullData {
  width: 750px;
  height: 1000px;
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


