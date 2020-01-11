<template>
  <div class="consumeRecord">
    <navbar title="消费记录" showBack="true"></navbar> 
    <wxc-tab-page 
        :tab-titles="tabTitles"
        :tab-styles="tabStyles"
        title-type="text"
        :tab-page-height="tabPageHeight"
        @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected">
      <list v-for="items in info"
            class="item-container"
            ref="list"
            :style="{ height: (tabPageHeight - tabStyles.height) + 'px' }" loadmoreoffset="80" @loadmore="loadmore" @scroll="scrollHandler">
        <cell class="record" v-for="item in items">
          <div class="record-time between bg-gray" ref="timeHead">
            <div class="row">
              <image class="time-img" :src="timeImg" resize="cover"></image>
              <text class="time-txt">{{item.create_time.split(" ")[0]}}</text>
            </div>
            <text class="time-txt">{{type == 0?'总支出: '+item.total:'总收入: '+item.total}}</text>
          </div>
          <div class="record-content row bg-white" v-for="d in item.data" v-key="">
            <image class="content-img" :src="d.img" resize="cover"></image>
            <div class="content-item between">
              <div class="content-info">
                <text class="info-txt">{{d.remark}}</text>
                <text class="info-time">{{d.create_time.split(" ")[1]}}</text>
              </div>
              <text :class="['record-num',type == 0?'green':'red']">{{type == 0?'-'+d.number:'+'+d.number}}</text>
            </div>
          </div> 
        </cell> 
        <cell class="nullData row" v-if="info[tabIndex].length==0&&!loadShow">
          <text class="nullDataText">没有积分纪录哦~</text>
        </cell>       
      </list>
    </wxc-tab-page>
    <load :show="loadShow" :loading-text="loadingText"></load>    
  </div>
</template>
<script>
const storage = weex.requireModule('storage');
import Navbar from 'base/navbar'
import Load from 'base/load'
import { WxcTabPage, WxcPanItem, Utils, BindEnv } from 'weex-ui';
import Util from "common/js/util"
import { TIME, MiLIICON } from 'common/js/icon-type'
import { formatDate } from 'common/js/common'

export default {
  components: { Navbar, WxcTabPage, Load },
  mixins: [Util],
  data() {
    return {
      tabTitles: [
        { title: '积分获取'},
        { title: '积分支出'}
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
      info: [[],[]],
      tabPageHeight: 1585,
      timeImg: TIME,
      tabIndex:0,
      page: [1,1],
      size: 50,
      type: 1,
      loadShow: true,
      loadingText: '正在加载..'
    }
  },
  created() {
    this.getData(1);
  },
  mounted(){
    storage.getItem('viewport',(e) => {
      if(e.result == "success"){
        this.pageHeight = JSON.parse(e.data).deviceHeight
        this.calcHeight(this.pageHeight)
      }
    })
  },
  methods: {
    calcHeight(deviceHeight){
      this.tabPageHeight = deviceHeight - this.statusbarHeight - 90
    },
    wxcTabPageCurrentTabSelected (e) {
      this.type = e.page==1?0:1;
      this.tabIndex=e.page;
      if(this.info[this.tabIndex].length==0){ 
        this.loadShow = true;     
        this.getData(this.type)
      }
    },     
    getData(type) {
      this.post('user', 'getIntegralDetail', { type: type, page: this.page[this.tabIndex], size: this.size }, res => { 
        this.loadShow = false;
        if(!res || !res.data){
          console.log('tag', res);
          return;
        }
        var info = res.data;
        info.forEach( e => {
          e.create_time = formatDate(new Date(parseInt(e.create_time * 1000)));
          var img;
          switch(e.remark){
            case '签到涨米粒':
              img = MiLIICON[0]; break;
            case '积分兑换商品':
            case '积分+RMB购买商品':
              img = MiLIICON[1]; break;  
            case '积分夺宝':
              img = MiLIICON[3]; break;            
            case '大转盘':
            case '转盘抽奖积分':
              img = MiLIICON[4]; break;
            case '分享涨米粒':
              img = MiLIICON[5]; break;
            case '拆福袋加积分':
            case '拆福袋耗积分':
              img = MiLIICON[6]; break;               
            default:
              img = ''; break;
          }
          e.img = img;
        });
        if(this.info[this.tabIndex].length!=0){
          info = this.info[this.tabIndex].concat(info)
        }
        this.mapRecord(info,type)
        this.page[this.tabIndex]++;
        this.$refs.list[this.tabIndex].resetLoadmore()
      })
    },
    mapRecord(arr, type) { //格式化数据
      let newArr = [];
      arr.forEach((item, i) => {
        let index = -1;
        let alreadyExists = newArr.some((newItem, j) => {
          if(item.create_time.split(" ")[0] === newItem.create_time.split(" ")[0]) {
            index = j;
            return true;
          }
        })
        if(alreadyExists) {
          newArr[index].total = parseInt(newArr[index].total) + parseInt(item.number)+"";
          newArr[index].data.push(item);
          return;
        }
        if(!alreadyExists && item.data == undefined) {
          newArr.push({
            create_time: item.create_time,
            total: item.number,
            data: [item]
          })
        } else {
          newArr.push(item)
        }
      })
      Vue.set(this.info,this.tabIndex,newArr);
    },
    scrollHandler(e) {
      // console.log(e)
    },
    loadmore() {
      this.loadShow = true;
      this.getData(this.type)
    }
  }
}
</script>
<style scoped>
.consumeRecord {
  background-color: #f1f1f1;
}
.row {
  flex-direction: row;
  align-items: center;
}
.between {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.bg-white {
  background-color: #ffffff;
}
.bg-gray {
  background-color: #f1f1f1;
}

.sticky{
  position: sticky;
}
.item-container {
  width: 750px;
  background-color: #f2f3f4;
}

.record {
  position: relative;
  padding-top: 60px;
  background-color: #fff;
}
.record-time {
  position: absolute;
  top: 0;
  left: 0;
  width: 750px;
  height: 60px;
  padding-right: 20px;
  padding-left: 20px;  
}
.time-img {
  width: 30px;
  height: 30px;
}
.time-txt {
  padding-left: 10px;
  font-size: 24px;
  color: #999999;
}
.record-content {
  width: 750px;
  padding-left: 20px;
}
.content-img {
  width: 80px;
  height: 80px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.content-item {
  width: 620px;
  padding-top: 20px;
  padding-bottom: 20px;
  margin-left: 20px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #f1f1f1;
}
.content-info {
  flex-direction: column;
  justify-content: space-between;
  height: 80px;
  padding-top: 5px;
  padding-bottom: 5px;
}
.info-txt {
  lines: 1;
  max-width: 450px;
  text-overflow: ellipsis;
  font-size: 28px;
  color: #333333;
}
.info-time {
  font-size: 22px;
  color: #999999;
}
.record-num {
  padding-right: 20px;
  font-size: 28px;
}
.green {
  color: #20C35D;  
}
.red {
  color: rgb(255, 0, 0);  
}
.baseline{
  justify-content: center;
  align-items: center;
  height: 80px;
}
.bsaeline-text{
  font-size: 20px;
  color: #999;
}
.nullData {
  width: 750px;
  height: 500px;
  justify-content: center;
}
.nullDataText {
  width: 300px;
  height: 60px;
  text-align: center;
  color: #666666;
  font-size: 30px;
}
</style>


