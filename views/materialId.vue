<template>
  <div>
    <navbar :title="title" :backgroundColor="backgroundColor" :middleUrl="middleUrl" ref="navbar"></navbar>
    <!-- 列表一 -->
    <list @loadmore="loadmore" loadmoreoffset="500" offset-accuracy="10">
      <cell v-if="headImg?true:false">
        <slider class="slider" interval="6000" auto-play="true" style="width:750px;height:280px">
          <div class="slide-box"  >
            <image :src="headImg+'_.webp'" class="imgcollage" resize="cover" style="width:750px;height:280px;background-color:#eee;"/>
          </div>
        </slider>
      </cell>
      <header class="sticky" ref="tab" v-if="headShow">
        <div class="table" >  <!-- 切换框 -->
          <scroller show-scrollbar="false" scroll-direction="horizontal" class="tab flex-row">
            <text
              :ref="'item'+index"
              v-for="(item,index) in tab" :key="item.m_id"
              :class="['tab-item', currentIndex == index ? 'choose': '']"
              @click="tabItem(index, item.m_id)">{{item.title}}
            </text>
          </scroller>
          <image :src="classify" class="showAll" @click="openPopup"></image>
        </div>
      </header>
      <cell class="patch" v-for="(item,i) in list" @click="toDetail(item)">
        <image class="patch-img" :src="item.pict_url+'_300x300q80s100.jpg_.webp'" resize="contain"/>
        <image class="rankingImg" resize="contain" v-if="rankingShow?i>2?false:true:false" :src="rankImgList[i]"/>
        <div class="intro">
          <div class="title-con">
            <image :src="item.mallIcon" class="mall-icon" resize="contain"></image>
            <text class="intro-txt">&emsp;&emsp;&ensp;{{item.title}}</text>
          </div>
          <div class="cbse">
            <div class="flex-row">
              <text class="oldpr">原价 ￥{{(+item.zk_final_price) | toFixed}}</text>
            </div>
            <div class="flex-row">
              <text class="voucher" style="">{{+item.coupon_amount}}元券</text>
            </div>
          </div>
          <div class="cbse">
            <div class="flex-row">
              <text class="symbol">￥</text>
              <text class="number">{{(+item.zk_final_price) - (+item.coupon_amount) | toFixed}}</text>
            </div>
            <text class="sell-txt">售: {{item.volume}}</text>
          </div>
        </div>
      </cell>
    </list>
    <!-- 显示全部分类 -->
    <div class="mask" :style="{height: maskHeight + 'px'}" v-if="maskShow" ref="mask" @click="closeMask"></div>
    <div class="allContent flex-row" :style="{top: headHeight + 'px'}" v-if="show" ref="tabCon">
      <div class=" allItem flex-column" v-for="(item,index) in tab" :key="item.m_id" @click="tabItem(index, item.m_id)">
        <image class="all-img" :src="item.src"></image>
        <text class="tab-txt">{{item.title}}</text>
      </div>
    </div>
    <load :show="loadShow"></load>
  </div>
</template>

<script>
const animation = weex.requireModule('animation')
const modal = weex.requireModule('modal')
const storage = weex.requireModule("storage");
const dom = weex.requireModule("dom");
import Navbar from 'base/navbar'
import Load from 'base/load'
import Util from "common/js/util"
import { mallType,CLASSIFY,RAND,brandType,rankingType,goodGoodsType,trendType,preferentialType } from 'common/js/icon-type'
import { toFixed } from 'common/js/filters'
export default {
  components: { Navbar, Load },
  mixins: [Util],
  data() {
    return {
      classify: CLASSIFY,
      title: '',
      backgroundColor: '',
      middleUrl: '',
      headImg: '',
      currentIndex: 0,
      maskHeight: 0,
      headHeight: 0,
      headShow: false,
      maskShow: false,
      show: false,
      rankingShow: false,
      rankImgList: [RAND[0],RAND[1],RAND[2]],
      loadShow: true,
      tab: [],
      list: [],
      pageIndex: 1,
      pageSize: 20
    }
  },
  filters: { toFixed },
  created() {
    storage.getItem('viewport',(e)=>{
      if(e.result == "success"){
        this.calcHeight(JSON.parse(e.data).deviceHeight)
      }
    })
    
    this.judge();
  },
  methods: {
    calcHeight(deviceHeight){
      var navheight = this.statusbarHeight + 90
      this.headHeight = navheight + 80 ;
      this.maskHeight = deviceHeight - navheight - 100 ;
    },
    judge(){
      storage.getItem("materialId", e => {
        let data = JSON.parse(e.data)
        if(typeof data.remark == 'string'){
          data.remark = data.remark.split(',');
        }
        switch (data.type) {  //判断查询类型
          case 'brand':
            this.headShow = true
            this.tab = brandType
            break;
          case 'ranking':
            this.headShow = true
            this.tab = rankingType
            this.rankingShow = true;
            break;
          case 'goodGoods':
            this.tab = goodGoodsType
            break;
          case 'trend':
            this.tab = trendType
            break;
          case 'preferential':
            this.tab = preferentialType
            break;
          default:
            break;
        }
        this.title = data.remark[0]
        if(data.remark[1] == 'null'){
          this.middleUrl = null
        }else{
          this.middleUrl = data.remark[1]
        }
        if(data.remark[2] == 'null'){
          this.backgroundColor = null
        }else{
          this.backgroundColor = data.remark[2]
        }
        if(data.remark[3] == 'null'){
          this.headImg = null
        }else{
          this.headImg = data.remark[3]
        }
        this.currentId = this.tab[0].m_id
        this.loadShow = true
        this.getData()
      })
    },
    tabItem(index, id) {
      this.show = false
      this.maskShow = false
      this.currentIndex = index
      this.currentId = id
      this.pageIndex = 1
      this.loadShow = true
      this.list.splice(0, this.list.length);
      this.getData();
      this.goMiddle(index)
    },
    goMiddle(index){
      index = index - 2 < 0 ? 2 : index
      const el = this.$refs[`item${index - 2}`][0]
      dom.scrollToElement(el, {})
    },
    getData(){
      let params = {
        materialId: this.currentId,
        pageno: this.pageIndex,
        pagesize: this.pageSize
      }
      this.post('appapi', 'dgMaterial', params, res => {
        // console.log('品牌券',res)
        this.loadShow = false
        if(!res || !res.result_list || !res.result_list.map_data){
          this.loadShow = false
          console.log('请求错误')
          return
        }
        res.result_list.map_data.forEach(item => {
          item.mallIcon = item.user_type == '1' ? mallType[0] : mallType[1]
        })
        this.list = this.list.concat(res.result_list.map_data)
        this.pageIndex++
        // console.log('brand', this.list)
      })
    },
    toDetail(goods){
      this.getInfo(goods, data => {
        // console.log('data', data)
        storage.setItem("goodsDetail", JSON.stringify(data), e => {
          this.open("detail", "true", () => {});
        });
      })
    },
    getInfo(goods, success){
      this.post('appapi', 'getiteminfo', {itemid: goods.item_id}, res => {
        if(!res || !res.results || !res.results.n_tbk_item){
          console.log('请求错误')
          return
        } else{
          let data = res.results.n_tbk_item
          data.coupon_amount = goods.coupon_amount
          data.coupon_click_url = goods.coupon_click_url.replace('//', 'https://')
          success(data)
        }
      })
    },
    loadmore(){
      this.list.length && this.getData()
    },
    openPopup() {
      this.scrollTab();
      this.show = !this.show;
      this.maskShow = !this.maskShow;
      setTimeout(() => {
        var tabCons = this.$refs.tabCon;
        var mask = this.$refs.mask;
        animation.transition(tabCons, {
          styles: {
            opacity: 1,
          },
          duration: 100, //ms
          timingFunction: 'ease',
          delay: 0 //ms
        })
        animation.transition(mask, {
          styles: {
            opacity: 1,
          },
          duration: 100, //ms
          timingFunction: 'ease',
          delay: 0 //ms
        })
      }, 50)
    },
    closeMask() {
      this.scrollTab();
      this.show = false;
      this.maskShow = false;
    },
    scrollTab(){
      const el = this.$refs.tab;
      dom.scrollToElement(el, {});
    },
  }
}        
</script>
<style scoped>
.flex-row {
  flex-direction: row;
  align-items: center;
}
.flex-column {
  flex-direction: column;
  align-items: center;
}
/* 切换框 */
.sticky{
  position: sticky;
  background-color: #ffffff;
}
.table {
  width: 750px;
  height: 80px;
  box-sizing: border-box;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #f1f1f1;
}
.tab {
  padding-right: 80px;
  padding-left: 10px;
  height: 80px;
  width: 750px;
}
.tab-item {
  height: 80px;
  box-sizing: border-box;
  min-width: 100px;
  padding: 20px;
  border-bottom-width: 5px;
  border-bottom-style: solid;
  border-bottom-color: #ffffff;
  margin-right: 20px;
  font-size: 28px;
  color: #666;
}
.tab-txt{
  color: #999;
  font-size: 24px;
}
.choose {
  font-weight: 400;
  border-bottom-width: 5px;
  border-bottom-style: solid;
  border-bottom-color: #f24561;
  color: #f24561;
  font-weight: 400;
}
/* 显示全部 */
.showAll {
  position: absolute;
  top: 0;
  right: 0;
  width: 80px;
  height: 80px;
  background-color: white;
  border-left-color: #f1f1f1;
  border-left-style: solid;
  border-left-width: 1px;
}
.mask {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 750px;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.3);
}
.allContent {
  position: absolute;
  left: 0;
  box-sizing: border-box;
  width: 750px;
  padding: 20px 0;
  background-color: #ffffff;
  flex-wrap: wrap;
  opacity: 0;
}
.allItem {
  width: 150px;
  height: 150px;
  justify-content: space-around;
}
.all-img {
  width: 80px;
  height: 80px;
}
/* 列表 */
.fall-list {
  width: 750px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  background-color: #f2f3f4;
}
.patch {
  width: 750px;
  height: 220px;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  flex-direction: row;
  /* align-items: center; */
  background-color: #fff;
  position: relative;
}
.patch-img {
  background-color: #cccccc;
  width: 200px;
  height: 200px;
  flex-shrink: 0;
}
.rankingImg{
  position: absolute;
  top: 20px;
  left: 20px;
  width:60px;
  height:60px;
  background-color:#fff;
}
.intro {
  padding-top: 10px;
  padding-left: 10px;
  padding-bottom: 10px;
  width: 510px;
  height: 200px;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #eeeeee;
  /* background-color: #f0f; */
}
.title-con {
  position: relative;
  flex-direction: row;
  align-items: center;
}
.mall-icon {
  position: absolute;
  height: 30px;
  width: 60px;
  top: 4px;
}
.intro-txt {
  lines: 2;
  font-size: 26px;
  color: #333333;
  font-weight: 400;
  line-height: 40px;
  max-width: 500px;
  height: 80px;
  text-overflow: ellipsis;
  margin-bottom: 15px;
}
.cbse {
  width: 500px;
  margin-top: 10px;
  flex-direction: row;
  justify-content: space-between;
}
.oldpr {
  font-size: 20px;
  color: #999999;
  font-weight: 400;
  line-height: 30px;
  text-decoration: line-through;
  margin-top: 3px;
}
.symbol {
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
  margin-top: 5px;
  color: #f24561;
}
.number {
  font-size: 30px;
  font-weight: 400;
  line-height: 30px;
  margin-right: 5px;
  color: #f24561;
}
.sell-txt {
  font-size: 20px;
  color: #999999;
  font-weight: 400;
  line-height: 30px;
  margin-top: 3px;
}
.voucher {
  font-size: 22px;
  color: #fff;
  font-weight: 400;
  height: 30px;
  line-height: 30px;
  background-image: linear-gradient(to left, #e5345f, #ff7d49);
  border-radius: 4px;
  padding: 0 10px;
}
</style>

