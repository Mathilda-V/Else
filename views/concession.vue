<template>
  <div>
    <div :style="{paddingTop:statusbarHeight+'px',backgroundImage:'linear-gradient(to left, #c671ff, #7c31ff)'}">
      <wxc-minibar background-color="">
        <image :src="arrowLeft" slot="left" style="width:60px;height:60px;" />
        <image slot="middle" :src="concession" style="height: 60px;width: 200px;" />
      </wxc-minibar>
    </div>
    <wxc-tab-page ref="wxc-tab-page" :tab-titles="tabTitles" :tab-styles="tabStyles" title-type="text" :tab-page-height="tabPageHeight" @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected">

      <waterfall v-for="(items,index) in tabList" @loadmore="loadmore" loadmoreoffset="10" show-scrollbar="false" column-gap="10" column-count="2" :key="index" class="item-container" need-slider="true" :style="{ height: (tabPageHeight - tabStyles.height) + 'px' }">
        <header class="border-cell">
          <div class="hg-tbox1">
            <text class="hg-tit">每天早10点 - 晚8点上新 </text>
          </div>
        </header>
        <cell v-for="(item,key) in items" class="cell" @click="openDetailByUrl(item.wap_url,item.title)" :key="key">
          <div class="A-image-box">
            <image class="A-image" :src="item.pic_url_for_w_l+'_300x300q80s100.jpg_.webp'" />
            <div class="A-tit">
              <div class="A-titb">
                <text class="A-title" lines="1">{{item.title}}</text>
                <text class="A-title1" lines="1" v-if="item.price_usp_list">{{item.price_usp_list.string}}</text>
              </div>
              <div class="A-parameter hg-row">
                <text class="A-price">￥{{item.act_price}}</text>
                <text class="A-sold">￥{{item.orig_price}}</text>
                <text class="A-sold1">抢购</text>
              </div>
            </div>
          </div>
        </cell>
      </waterfall>
    </wxc-tab-page>
    <load :show="loadShow"></load>
  </div>
</template>

<script>
const modal = weex.requireModule('modal');
const storage = weex.requireModule("storage");
import { DIRECTION_ARROW, CONCESSION } from 'common/js/icon-type.js'
import { WxcMinibar, WxcTabPage, WxcPanItem, Utils, BindEnv } from 'weex-ui';
import Load from 'base/load'
import Util from "common/js/util"
export default {
  components: { WxcMinibar, WxcTabPage, WxcPanItem, Load },
  mixins: [Util],
  data() {
    return {
      arrowLeft: DIRECTION_ARROW[1],
      concession: CONCESSION, 
      tabTitles: [{
        title: '全部',
        pageno: 1,
        key: ''
      }],
      loadShow: true,
      activePage: 0,
      pagesize: 40,
      tabStyles: {
        bgColor: '#FFFFFF',
        titleColor: '#666666',
        activeTitleColor: '#7c31ff',
        activeBgColor: '#FFFFFF',
        isActiveTitleBold: true,
        width: 140,
        height: 70,
        fontSize: 26,
        hasActiveBottom: true,
        activeBottomColor: '#7c31ff',
        activeBottomHeight: 3,
        activeBottomWidth: 120,
        textPaddingLeft: 0,
        textPaddingRight: 0
      },
      tabList: [],
      tabPageHeight: 0
    }
  },
  created() {
    //获取分类信息
    var self = this
    this.post('cate', 'getCategory', {}, function (data) {
      // console.log('聚划算分类',data)
      if (data.success) {
        var cateList = data.data;
        var len = cateList.length;
        for (var i = 0; i < len; i++) {
         if (cateList[i].typ == 2) {
            self.tabTitles.push({
              title: cateList[i].title,
              pageno: 1,
              pagesize: 40,
              key: cateList[i].cid
            });
          }
        }
        self.tabList = new Array(self.tabTitles.length);
        self.getData();
      } else {
        modal.toast({ message: '没有获取到分类信息', duration: 0.8 });
      }
    });
  },
  mounted(){
    storage.getItem('viewport',(e)=>{
      if(e.result == "success"){
        this.calcHeight(JSON.parse(e.data).deviceHeight)
      }
    })
  },
  methods: {
    calcHeight(deviceHeight){
      this.tabPageHeight = deviceHeight - this.statusbarHeight - 90
    },
    getData() {
      var self = this;
      var activePageItem = self.tabTitles[self.activePage];
      let params = {cid: '', kw: activePageItem.key, pageno: activePageItem.pageno, pagesize: self.pagesize}
      this.post('appapi', 'getjulist', params, function (data) {
        console.log('聚划算',params,data)
        self.loadShow = false;
        if(!data){
          setTimeout(() => {
            this.getData()
          }, 20)
        }
        if (data.result.model_list.items) {
          if(data.result.model_list.items.length == undefined){  //防止只有一个商品
            let arr = [];
            arr.push(data.result.model_list.items)
            Vue.set(self.tabList, self.activePage, arr);
          }else{
            if (activePageItem.pageno == 1) {
              Vue.set(self.tabList, self.activePage, data.result.model_list.items);
            } else {
              let arr = self.tabList[self.activePage].concat(data.result.model_list.items);
              Vue.set(self.tabList, self.activePage, arr);
              
            }
          }
          activePageItem.pageno++;
        }
      });
    },
    wxcTabPageCurrentTabSelected(e) {
      const self = this;
      self.activePage = e.page;
      if (self.tabTitles[self.activePage].pageno == 1) {
        self.getData();
      }
    },
    loadmore(e) {
      this.getData();
    }
  }
}
</script>

<style scoped>
.list {
  width: 750px;
  max-width: 750px;
  min-width: 750px;
}
.item-container {
  width: 730px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: #f2f3f4;
}

.border-cell {
  background-color: #f2f3f4;
  width: 750px;
  height: 51px;
  align-items: center;
  justify-content: center;
}
.hg-tit {
  font-size: 26px;
  line-height: 30px;
  margin-top: 10px;
  margin-bottom: 10px;
  align-items: center;
  justify-content: center;
  color: #666;
}
.cell {
  /* width: 370px; */
  background: #e0e0e0;
}

.content {
  width: 750px;
  height: 300px;
  border-bottom-width: 1px;
  align-items: center;
  justify-content: center;
}
.hg-tbox1 {
  background-color: #f2f3f4;
}
.hg-row {
  flex-direction: row;
}

.A-tit {
  /* width:365px; */
}
.A-titb {
  padding: 0 10px;
  /* margin-bottom: 10px; */
}
.A-title,
.A-title1 {
  padding: 5px;
  text-overflow: ellipsis;
}
.A-title {
  height: 50px;
  line-height: 50px;
  font-size: 26px;
  lines: 1;
}
.A-title1 {
  font-size: 20px;
  color: #e82c65;
  /* border-style: solid;
    border-width: 1px;
    border-color: #e82c65;
    border-radius: 4px; */
}
.A-sold1 {
  padding: 0 15px;
  text-align: center;
  font-size: 26px;
  background-color: #999;
  position: absolute;
  right: 0;
  background-image: linear-gradient(to top, #e3ac35, #ffeb46);
  color: #e82c65;
}
.A-price,
.A-sold,
.A-sold1 {
  height: 60px;
  line-height: 60px;
}
.A-price {
  font-size: 34px;
  color: white;
}
.A-sold {
  margin-left: 10px;
  font-size: 20px;
  text-decoration: line-through;
  color: white;
}
.A-image-box {
  width: 365px;
  background-color: white;
  border-radius: 4px;
  margin-bottom: 10px;
}
.A-parameter {
  margin-top: 15px;
  background-color: #e82c65;
  width: 365px;
  height: 60px;
  padding-left: 10px;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
}
.A-image {
  width: 365px;
  height: 365px;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  background-color: #eee;
}
</style>


