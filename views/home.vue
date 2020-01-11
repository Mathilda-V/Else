<template>
  <div class="app">
    <list ref="list" class="home" show-scrollbar="false" :style="{height:pageHeight+'px'}" @loadmore="loadmore" loadmoreoffset="500" offset-accuracy="30">
        <!-- 头部搜索窗底层 -->
      <cell ref="cell">
        <div class="header_bg_wrapper" :style="{height:statusbarHeight+'px'}" ref="header"></div>
      </cell>
        <!-- 轮播图  module1-->
      <cell v-if="bannerList['module1']">
        <slider class="slider" interval="4000" auto-play="true">
          <div class="slide-box" v-for="item in bannerList['module1']['items']" @click="openUrl(ban)">
            <image :src="item.pic_url+'_q80_.webp'" class="imgcollage" resize="cover" />
          </div>
          <indicator class="indicator"></indicator>
        </slider>
      </cell>
      <cell v-if="bannerList['module1']">
        <div class="row">
          <div class="explain row">
            <image class="explain-img" :src="explain" />
            <text class="explain-tit">严选超值好货</text>
          </div>
          <div class="explain row">
            <image class="explain-img" :src="explain" />
            <text class="explain-tit">淘宝隐藏神券</text>
          </div>
          <div class="explain row">
            <image class="explain-img" :src="explain" />
            <text class="explain-tit">购物拿返现</text>
          </div>
        </div>
      </cell>
        <!-- 活动图片1区 -->
      <cell v-if="bannerList['module2']">
        <div class="activity1">
          <image :src="bannerList['module2']['items'][0].pic_url + '_.webp'" class="activity1Img" resize="cover" />
        </div>
      </cell>
        <!-- 功能区 -->
      <cell v-if="bannerList['module3']">
        <scroller show-scrollbar="false" scroll-direction="horizontal" class="menu-list row" ref="scrollView" @scroll="onScroll">
          <div class="menu-sell" @click="openUrl(item)" v-for="item in bannerList['module3']['items']">
            <image class="menu-img" :src="item.pic_url+'_120x120q80_.webp'" />
            <text class="menu-text">{{item.remark[0]}}</text>
          </div>
        </scroller>
        <div class="reveal" v-if="bannerList['module3']['items'].length>5">
          <div class="reveal-slip">
            <div class="reveal-slider" ref="block" :style="{top:'0px',left:offsetWidth+'px',width:sliderWidth+'px'}"></div>
          </div>
        </div>
      </cell>
        <!-- 活动图片2区 -->
      <cell v-if="bannerList['module1']">
        <div class="activity2">
          <image :src="bannerList['module1']['items'][0].pic_url + '_.webp'" class="activity2Img" resize="cover" />
        </div>
      </cell>
        <!-- 淘抢购区 -->
      <cell>
        <div class="firebox" @appear="onappear" @disappear="ondisappear">
          <div class="title white">
            <div class="main-title">
              <image class="txt-bg" :src="timeLimit" resize="cover" style="width:30px;height:30px;margin-right:10px;" />
              <text class="firebox-text">限时购</text>
              <wxc-countdown :timeBoxStyle="{backgroundColor:'#f24561',borderRadius:'4px'}" :timeTextStyle="{fontSize: '20px', color: 'white'}" :dotTextStyle="{color: '#f24561'}" tpl="{h}:{m}:{s}" :time="timer[index]" @wxcOnComplete="onCompleted"></wxc-countdown>
            </div>
            <div class="sub-title" @click="openqg()">
              <text class="sub-txt">全部</text>
              <image class="txt-bg" :src="arrowRight" resize="cover" style="width:30px;height:30px;" />
            </div>
          </div>
          <scroller class="row" show-scrollbar="false" scroll-direction="horizontal" style="height:340px;">
            <div class="firebox-sv row">
              <div class="firebox-patch" v-for="(selection,i) in dataList.LimitList" :key="i" @click="openqg(i)">
                <div class="limit-img">
                  <image class="firebox-img" :src="selection.pic_url+'_180x180q80.jpg_.webp'" resize="cover" />
                </div>
                <div class="firebox-intro">
                  <!-- <text class">{{selection.title}}</text> -->
                  <div class="center">
                    <div class="price">
                      <text class="firebox-symbol">￥</text>
                      <text class="firebox-number">{{selection.zk_final_price | keepInteger}}</text>
                      <text class="firebox-number decimal">{{selection.zk_final_price | keepDecimal}}</text>
                      <text class="hotbox-oldpr">￥{{selection.reserve_price}}</text>
                    </div>
                    <div class="card-progress-bar">
                      <div class="card-progress-to" :style="{width:(selection.sold_num/selection.total_amount)<0.08?(150*(selection.sold_num/selection.total_amount)*2)+'px':'30px'}"></div>
                      <div class="card-progress-end" ></div>
                    </div>
                    <text class="sell-txt">已抢{{selection.sold_num}}件 </text>
                  </div>
                </div>
                <!-- <div class="firebox-price">
                    <text class="firebox-sell-txxt">{{selection.discount_money}}元券</text>
                  </div> -->
              </div>
              <div class="morebox" @click="openqg()">
                <image class="txt-bg" :src="arrowRight" style="width:30px;height:30px;margin-bottom:10px;border-radius:15px;border-style:solid;border-width:1px;border-color:#cccccc;" />
                <text class="sub-txt">更多限时抢</text>
              </div>
            </div>
          </scroller>
        </div>
      </cell>
        <!-- 超级爆款区 -->
      <cell v-if="hotGoodsList.length">
        <div class="hotbox">
          <div class="title white">
            <div class="main-title">
              <image class="txt-bg" :src="superHot" resize="cover" style="width:30px;height:30px;margin-right:10px;" />
              <text class="hotbox-text">超级爆款</text>
            </div>
            <div class="sub-title">
              <text class="sub-txt"></text>
            </div>
          </div>
          <scroller show-scrollbar="false" scroll-direction="horizontal" class="hotbox-sv row">
            <div class="hotbox-patch" v-for="item in hotGoodsList"  @click="toDetails(item)">
              <image class="hotbox-img" :src="item.pict_url+'_220x220q80s100_.webp'" resize="cover" style="width:220px;height:220px" />
              <div class="hotbox-intro">
                <text class="hotbox-intro-txt">{{item.title}}</text>
                <div class="cbse">
                  <div class="cbse-row">
                    <text class="hotbox-symbol">￥</text>
                    <text class="hotbox-number">{{item.zk_final_price | keepInteger}}</text>
                    <text class="hotbox-number decimal">{{item.zk_final_price | keepDecimal}}</text>
                  </div>
                  <text class="hotbox-oldpr">￥{{item.reserve_price}}</text>
                </div>
              </div>
              <div class="hotbox-price">
                <text class="hotbox-sell-txxt">{{item.coupon_info | getCoupon | keepInteger}}元券</text>
              </div>
            </div>
          </scroller>
        </div>
      </cell>
        <!-- 活动功能区 -->
      <cell  v-if="bannerList">
        <div class="con">
          <div class="big-con" v-if="bannerList['module5']">
            <div class="scrbox row">
              <image class="imglt" :src="cabbageSale" />
              <text class="con-text">白菜价</text>
            </div>
            <text class="com-text">特卖好品 件件低价</text>
            <image class="imgl" :src="bannerList['module5']['items'][0].pic_url+'_150x150q80_.webp'" />
            <image class="imgl1" :src="bannerList['module5']['items'][1].pic_url+'_150x150q80_.webp'" />
          </div>
          <div class="big-con" v-if="bannerList['module6']">
            <div class="scrbox row">
              <image class="imglt" :src="hotSale" />
              <text class="con-text">热销排行榜</text>
            </div>
            <text class="com-text">最低0元起</text>
            <image class="imgl" :src="bannerList['module6']['items'][0].pic_url+'_150x150q80_.webp'" />
            <image class="imgl1" :src="bannerList['module6']['items'][1].pic_url+'_150x150q80_.webp'" />
          </div>
          <div class="big-con" v-if="bannerList['module7']">
            <div class="scrbox row">
              <image class="imglt" :src="jimiSale" />
              <text class="con-text">积米零食</text>
            </div>
            <image class="imgl3" :src="bannerList['module7']['items'][0].pic_url+'_q90_.webp'" resize="contain" />
          </div>
          <div class="big-con" v-if="bannerList['module8']">
            <div class="scrbox row">
              <image style="width:100px;height:30px;margin-right: 5px;" :src="fashionSale" />
              <text class="con-text">潮流范</text>
            </div>
            <image class="imgl3" :src="bannerList['module8']['items'][0].pic_url+'_q90_.webp'" resize="contain" />
          </div>
        </div>
      </cell>
        <!-- 精品商品区 -->
      <cell v-if="qualityGoodsList.length">
        <div class="preferential">
          <div class="title white white-spe">
            <div class="main-title-spe">
              <text class="main-txt-spe">精品商品</text>
              <text class="main-txt-spe gray">FINE GOODS</text>
            </div>
            <div class="sub-title">
            </div>
          </div>
        </div>
      </cell>
      <cell class="goods-cell" v-for="(item,index) in qualityGoodsList.length" :key="index" v-if="index % 2 == 0">
        <list-biserial v-if="qualityGoodsList.length" :list="qualityGoodsList" boxRadius=0 :num="index" @select="goods => select(goods)"></list-biserial>
      </cell>
      <cell>
        <div class="baseline center" v-if="endShow">
          <text class="bsaeline-text">我是有底线的</text>
        </div>
      </cell>
    </list>
      <!-- 推荐吸附球 -->
    <div ref="ball" class="ball" v-if="ballShow && (tabIndex == 0)">
      <image v-if="dataList.indexPush.flag == 'active_push'?true:false" @click="activePush(dataList.indexPush)" :src="dataList.indexPush.pic_url+'_120x120_.webp'" style="width:120px;height:140px;" resize="contain" />
    </div>
      <!-- 返回顶端吸附球 -->
    <!-- <div class="back-top share" v-if="(tabIndex == 0)" @click="toShare">
      <image :src="share_home" resize="contain" style="width:40px;height:40px;"/>
      <text class="back-top-text">分享</text>
    </div> -->
      <!-- 返回顶端吸附球 -->
    <div class="back-top sticky" v-if="goTop && (tabIndex == 0)" @click="backTop">
      <image :src="sticky_icon" resize="contain" style="width:40px;height:40px;"/>
      <text class="back-top-text">顶部</text>
    </div>
      <!-- 头部搜索窗变化层 -->
    <div class="head" :style="{height:statusbarHeight + 100 + 'px',paddingTop:statusbarHeight+'px'}" @click="empty()">
      <div class="app_bar_bg" :style="{height:statusbarHeight + 100 + 'px'}" ref="app_bar_bg"></div>
      <div class="hg-main-con row">
        <!-- <div class="sign"></div> -->
        <div class="hg-search row" ref="hg_search" @click="searchClick()">
          <image class="hg-search-img" :src="searchIcon" />
          <text class="hg-input" ref="hg_input">全网优惠券请输入要搜索的商品...</text>
        </div>
      </div>
    </div>
      <!-- 推荐弹窗 -->
    <div class="mask" ref="mask" v-if="popupShow" @click="empty()">
      <div class="auto" ref="maskPopup">
        <div class="mask-cont" @click="contClick" ref="maskcont">
          <image v-if="dataList.indexPush.flag == 'active_push'?true:false" @click="activePush(dataList.indexPush)" :src="dataList.indexPush.pic_url" style="width:500px;height:700px;" resize="contain" />
          <div class="recomDoods" @click="goodPush(dataList.indexPush)" v-else>
            <image :src="dataList.indexPush.pict_url" style="width:400px;height:400px;background-color:#eeeeee;margin-top:50px" resize="contain" />
            <div class="recomText">
              <text class="recomTitle">{{dataList.indexPush.title}}</text>
              <text class="recomPrice">券后价¥{{dataList.indexPush.coupon_info, dataList.indexPush.zk_final_price | getMoney}}</text>
              <text class="recomClick">立即购买</text>
            </div>
          </div>
        </div>
        <div class="mask-bottom">
          <wxc-icon name="close" class="iconStyle" @wxcIconClicked="closePopup(dataList.indexPush)" ref="maskbottom"></wxc-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");
import Util from "common/js/util"
import Binding from 'weex-bindingx';
import { WxcCountdown, WxcIcon } from 'weex-ui';
import ListBiserial from 'base/list-biserial'
import { toFixed, keepInteger, keepDecimal, getCoupon, getMoney } from 'common/js/filters'
import * as icons from 'common/js/icon-type'
import { HG_SHARE,ERR_OK } from 'common/js/config'
import TbGoods from 'common/js/tbGoods'

export default {
  mixins: [Util],
  components: { WxcCountdown, WxcIcon, ListBiserial },
  filters: { toFixed, keepInteger, keepDecimal, getCoupon, getMoney },
  props: {
    tabIndex: {
      type: Number,
      required: true
    },
    pageHeight: {
      type: Number,
      default: 1534
    }
  },
  data() {
    return {
      timeLimit: icons.TIME_LIMIT,
      arrowRight: icons.DIRECTION_ARROW[0],
      superHot: icons.SUPER_HOT,
      cabbageSale: icons.CABBAGE_SALE,
      hotSale: icons.HOT_SALE,
      jimiSale: icons.JIMI_SALE,
      fashionSale: icons.FASHION_SALE,
      searchIcon: icons.SEARCH_ICON,
      share_home: icons.SHARE_HOME,
      sticky_icon: icons.STICKY,
      explain: icons.EXPLAIN,
      Height: '',
      pageHeight: 1600,
      refreshing: false,
      popupShow: false,
      ballShow: false,
      // dataList: {},
      // bannerList: [],
      // activityList: [],
      // funList: [],
      // actionList: [[], []],
      pageIndex: 2,
      pageSize: 30,
      timer: [],
      index: 0,
      goTop: false,
      cidWidth: 0,
      offsetWidth: 0,
      searchBindx: {},
      sliderBindx: {},
      sliderWidth: 40,
      endShow: false,
      loadShow: false,
      shareDel: HG_SHARE,
      bannerList: [],
      timeLimitList: [],
      hotGoodsList: [],
      qualityGoodsList: []
    }
  },
  mounted() {
    
  },
  created() {
    var self = this;
    storage.getItem("viewport", function (e) {
      if (e.result == 'success') {
        if(WXEnvironment.platform === 'iOS') {
          self.pageHeight = JSON.parse(e.data).deviceHeight -100;
          return;
        }
        self.pageHeight = JSON.parse(e.data).deviceHeight;
      }
    });
    this.createTime();
    this.getData();
  },
  methods: {
    // 数据获取处理区
    getData() {
      this.post('Top','hsIndex',{access_token:this.access_token}, res => {
        console.log('首页',res)
        if (res.code === ERR_OK) {
          this.$set(this, 'bannerList', this._normalizeBannerList(res.data.bannerList))
          this.$set(this, 'timeLimitList', this._normalizeGoodsList(res.data.timeLimitList.start.results.concat(res.data.timeLimitList.noStart.results)))
          this.$set(this, 'hotGoodsList', this._normalizeQualityGoods(res.data.bigDiscountList.uatm_tbk_item))
          this.$set(this, 'qualityGoodsList', this._normalizeQualityGoods(res.data.goodList.uatm_tbk_item))
          // console.log(this.timeLimitList)
        }

        setTimeout(()=>{
            this.bindingx();
            this.animationRecom();
          },20)
      })
    },
    getBoutique() {
      let params = {
        favoritesId: '18618471',
        pageno: this.pageIndex,
        pagesize: this.pageSize
      }
      this.post('appapi', 'selectLibraryInfo', params, res => {
        // console.log('Boutique',res)
        this.loadShow = false
        if (!res || !res.results || !res.results.uatm_tbk_item) {
          this.endShow = true
          console.log('请求错误')
          return
        }
        const uatm_tbk_item = res.results.uatm_tbk_item
        uatm_tbk_item.forEach(item => {
          item.mallIcon = item.user_type == '1' ? icons.mallType[0] : icons.mallType[1]
        })
        if (uatm_tbk_item.length < 30 && uatm_tbk_item.length % 2 == 1) uatm_tbk_item.pop()
        this.dataList.goodList = this.dataList.goodList.concat(uatm_tbk_item)
        this.pageIndex++
        this.$refs['list'].resetLoadmore()
      })
    },

    // 动画函数区
    getEl(e) {
      return this['$refs'][e].ref;
    },
    bindingx() {
      // let self=this;
      this.searchBindx= Binding.bind({
        eventType: 'scroll',
        anchor: this.getEl('list'),
        props: [
          {
            element: this.getEl('app_bar_bg'),
            // element: this.$refs.app_bar_bg.ref,
            property: 'opacity',
            expression: {
              origin: 'min(500,y)/500'
            }
          },
          {
            element: this.getEl('hg_search'),
            // element: this.$refs.hg_search.ref,
            property: 'background-color',
            expression: {
              origin: "rgba(255,255,255,min(500,y+250)/500)"
            }
          }
        ]
      });
      // self.sliderBindx = Binding.bind({
      //   eventType: 'scroll',
      //   anchor: self.getEl(self.$refs.scrollView),
      //   props: [
      //     {
      //       element: self.getEl(self.$refs.block),
      //       property: 'transform.translateX',
      //       expression: {
      //         origin: 'min(100,x)'
      //       }
      //     },
      //   ]
      // });
    },
    animationRecom() {
      if (this.dataList.hasOwnProperty('indexPush')) {
        const date = new Date();
        let lastdate = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
        storage.getItem("recomKey", (e) => {
          if (lastdate != e.data) {
            storage.setItem("recomKey", lastdate, () => { })
            Vue.set(this,'popupShow',true)
            setTimeout(() => {
              this.animation(this.$refs.maskbottom, { transform: 'scale(0)' }, 0, 0, '', false, () => { })
              this.animation(this.$refs.maskcont, { transform: 'scale(0)' }, 0, 0, '', false, () => {
                this.animation(this.$refs.maskcont, { opacity: 1, transform: 'scale(1)' }, 600, 0, '', false, () => {
                  this.animation(this.$refs.maskbottom, { opacity: 1, transform: 'scale(1.4)' }, 300, 0, '', false, () => {
                    this.animation(this.$refs.maskbottom, { transform: 'scale(0.8)' }, 150, 0, '', false, () => {
                      this.animation(this.$refs.maskbottom, { transform: 'scale(1.2)' }, 100, 0, '', false, () => {
                        this.animation(this.$refs.maskbottom, { transform: 'scale(1)' }, 60, 0, '', false, () => { })
                      })
                    })
                  })
                })
              });
            }, 20)
          } else {
            if (this.dataList.indexPush.flag == 'active_push') {
              this.ballShow = true;
              setTimeout(() => {
                this.animation(this.$refs.ball, { transform: 'scale(0)' }, 0, 0, '', false, () => {
                  this.animation(this.$refs.ball, { opacity: 1, transform: 'scale(1)' }, 400, 0, '', false, () => { })
                })
              }, 10)
            }
          }
        })
      }
    },
    
    // 页面跳转区
    toDetails(o) {
      var self = this
      storage.setItem("goodsDetail", JSON.stringify(o), e => {
        self.open("detail", "true", function (event) { });
      });
    },
    openqg(i = 10) {
      var el = 1;
      if (i <= 3) {
        el = 0
      }
      let params = { index: el }
      storage.setItem("fpr", JSON.stringify(params), (e) => {
        this.open('fpr', 'true', function (event) { });
      })
    },
    openActivityTwo() {
      this.open('activityTwo', 'true', function (event) { });
    },
    searchClick() {
      this.open('searchList', 'true', function () { })
    },
    openUrl(item) {
      switch (item.open_cate) {
        case '1':
          storage.setItem("url", item.open_content, () => {
            this.open('openByUrl', 'true', () => { })
          })
          break
        case '2':
          this.openDetail(item.open_content)
          break
        case '3':
          this.openDetailByUrl(item.open_content, item.remark)
          break
        case '4':
          this.openShop(item.open_content)
          break
        case '5':
          if (item.open_content == 'recommend') {
            storage.setItem("searchkey", JSON.stringify({ con: '今日推荐' }), (e) => {
              this.open('list', 'true', function (event) { });
            });
          } else {
            this.open(item.open_content, 'true', function (event) { });
          }
          break
        case '10':
          let params = { type: item.open_content, remark: item.remark }
          storage.setItem("materialId", JSON.stringify(params), (e) => {
            this.open('materialId', 'true', function (event) { });
          });
          break
      }
    },

    // 置顶返回区
    backTop() {
      weex.requireModule("dom").scrollToElement(this.$refs.cell, {offset:0, animated:true})
    },
    onappear(e) {
      this.goTop = false
    },
    ondisappear(e) {
      this.goTop = true
    },
    toShare(){
      this.share(this.shareDel.mainTitle, this.shareDel.subTitle, this.shareDel.picUrl, this.shareDel.url, e => {
      })
    },
    // 上拉刷新
    loadmore() {
      this.loadShow = true
      this.getBoutique()
    },

    // 获取限时抢未开抢的场次倒计时
    createTime() {
      const self = this;
      const nowGMTTime = new Date();//当前日期
      var hourParts = [0, 8, 10, 11, 12, 13, 14, 15, 17, 19, 21, 22, 23, 24, 32, 34, 35, 36, 37, 38, 39, 41, 43, 45, 47, 48];//抽象抢购场次列表

      const nowTime = Math.ceil(nowGMTTime.getTime() / 1000) + (8 * 3600);//当前时间戳
      const remainTime = nowTime % (3600 * 24);//今天的时间
      const todayTime = nowTime - remainTime;//今天的凌晨的时间戳
      const todayTimeTemp = todayTime - 8 * 3600//子午线时间 用于控件显示
      var nowPartPoint = 0;//当前场次处于时间段
      let hour = Math.floor(remainTime / 3600);
      let len = hourParts.length
      for (var i = 0; i < len; i++) {
        if (hour < hourParts[i]) {
          nowPartPoint = (i - 1);//当前所在时间节点
          break;
        }
      }
      //设置待开枪场次参数
      for (var i = nowPartPoint + 1; i < len - 1; i++) {
        self.timer.push((todayTimeTemp + hourParts[i] * 3600) * 1000);
      }
    },

    // 限时抢场次倒计时重置
    onCompleted() {
      this.index++
    },

    // 功能区de滚动条
    onScroll(e) {
      let scrollWidth = e.contentSize.width;
      let x = e.contentOffset.x;
      this.sliderWidth = 40;
      this.offsetWidth = -x * (80 - this.sliderWidth) / (scrollWidth - 750);
    },

    // 弹窗组件函数处理区
    contClick(e) { // 推荐弹窗组件阻止冒泡
      e.stopPropagation()
    },
    activePush(e) {
      this.popupShow = false
      this.openUrl(e)
    },
    goodPush(e) {
      this.popupShow = false
      if (e.flag == 'self_good_push') {
        storage.setItem("goodsId", JSON.stringify(e.id), e => {
          this.open('detailX5', 'true', () => { })
        });
      } else {
        this.toDetails(e)
      }
    },
    closePopup(e) {
      this.animation(this.$refs.maskPopup, { transform: 'scale(0)' }, 500, 0, '', false, () => {
        this.popupShow = false
      })
      if (e.flag == 'active_push') {
        this.ballShow = true;
        setTimeout(() => {
          this.animation(this.$refs.ball, { transform: 'scale(0)' }, 0, 0, '', false, () => {
            this.animation(this.$refs.ball, { opacity: 1, transform: 'scale(1)' }, 200, 190, '', false, () => { })
          })
        }, 10)
      }
    },
    _normalizeBannerList(list) {
      let map = {}
      list.forEach((item) => {
        item.module = 'module'+item.module
        const key = item.module
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(item)
      })
      for (let k in map) {
        map[k]['items'].forEach((item) => {
          item.remark = item.remark.split(',');
        })
      }
      
      return map
    },
    _normalizeQualityGoods(list) { 
      let ret = []
      list.forEach((item) => {
        if (item.small_images) {
          if (this._isString(item.small_images.string)) {
            item.small_images.string = [item.small_images.string]
          }
        }else {
          item.small_images = {
            string: [item.pict_url]
          }
        }

        ret.push(new TbGoods({
          id: item.num_iid,
          title: item.title,
          user_type: item.user_type,
          pict_url: item.pict_url,
          reserve_price: item.reserve_price,
          zk_final_price: item.zk_final_price,
          coupon_info: item.coupon_info,
          volume: item.volume,
          small_images: item.small_images,
          coupon_start_time: item.coupon_start_time,
          coupon_end_time: item.coupon_end_time,
          item_url: item.item_url,
          // coupon_click_url: item.coupon_click_url || item.coupon_share_url.replace('//', 'https://') || '',
          rate: Number(item.tk_rate)/100 || Number(item.commission_rate)/10000
        }))
      })
      return ret
    },
    _normalizeGoodsList(list) {
      // console.log(list)
      let ret = []
      list.forEach((item) => {
        if (item.small_images) {
          if (this._isString(item.small_images.string)) {
            item.small_images.string = [item.small_images.string]
          }
        } else {
          item.white_image = {
            string: [item.white_image]
          }
        }
        
        ret.push(new TbGoods({
          id: item.item_id,
          title: item.title,
          user_type: item.user_type,
          pict_url: item.pict_url.replace('//', 'https://') ,
          zk_final_price: item.zk_final_price,
          coupon_info: item.coupon_amount,
          volume: item.volume,
          small_images: item.small_images || item.white_image ,
          item_url: item.click_url.replace('//', 'https://') ,
          coupon_click_url: item.coupon_click_url.replace('//', 'https://') ,
          rate: Number(item.commission_rate)/100
        }))
      })
      return ret
    },
    _isString(str) { 
      return  (typeof str=='string')&&str.constructor==String;  
    },
    empty() {}
  },

}
</script>
<style scoped>
.app {
  justify-content: center;
  align-items: stretch;
  position: relative;
}
.row {
  flex-direction: row;
  align-items: center;
}
.between {
  justify-content: space-between;
}
.center {
  justify-content: center;
  align-items: center;
}
.home {
  width: 750px;
  padding-bottom: 100px;
}
.header_bg_wrapper {
  width: 750px;
  background-color: rgba(0, 0, 0, 0.5);
}

/* 搜索 */
.head {
  width: 750px;
  position: absolute;
  top: 0;
}
.app_bar_bg {
  width: 750px;
  height: 100px;
  /* background-image: linear-gradient(to left, #e5345f, #ff7d49); */
  background-color: #e5345f;
  position: absolute;
  top: 0;
  opacity: 0;
}
.hg-main-con {
  width: 750px;
  padding-top: 20px;
  padding-bottom: 20px;
  justify-content: center;
  /* background-image: linear-gradient(to left, #e5345f, #ff7d49); */
}
.hg-search {
  width: 540px;
  height: 60px;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
  background-color: rgba(255, 255, 255, 0.5);
}
.hg-search-img {
  width: 40px;
  height: 40px;
  margin: 10px;
}
.hg-input {
  width: 500px;
  height: 60px;
  line-height: 60px;
  font-size: 24px;
  color: #999999;
}
.sign {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  /* background-color: transparent; */
}
/* 轮播图 */
.slider {
  width: 750px;
  height: 270px;
  background-color: #ffffff;
}
.slide-box {
  width: 750px;
  height: 270px;
  /* padding: 10px 20px; */
  background-color: #ffffff;
  text-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
}
.imgcollage {
  width: 750px;
  height: 270px;
  /* border-radius: 14px; */
}
.indicator {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60px;
  item-size:12px;
  item-color: #ffffff;
  item-selected-color: rgb(255, 115, 0);
}
/*说明*/
.explain{
  height: 70px;
  flex: 1;
  justify-content: center;
  /* align-items: center; */
  border-bottom-width: 1px;
  border-bottom-color: #eee;
  background-color: white;
}
.explain-img{
  width: 30px;
  height: 30px;
  margin-right: 10px;
  /* background-color: #eee; */
}
.explain-tit{
  font-size: 24px;
  color: #666;
}
/* 活动图片区 */
.activity1 {
  width: 750px;
  height: 200px;
  background-color: #ffffff;
}
.activity1Img {
  width: 750px;
  height: 200px;
}
.activity2 {
  width: 750px;
  padding-bottom: 20px;
  margin-bottom: 12px;
  padding-left: 20px;
  padding-right: 20px;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
}
.activity2Img {
  width: 710px;
  height: 350px;
  border-radius: 14px;
}
/* 功能区 */
.menu-list {
  height: 160px;
  padding: 0 20px;
  background-color: #ffffff;
}
.menu-sell {
  width: 142px;
  padding-top: 30px;
  padding-bottom: 20px;
  align-items: center;
}
.menu-img {
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}
.menu-text {
  font-size: 24px;
  color: #666666;
}
.reveal {
  background-color: #ffffff;
  width: 750px;
  height: 30px;
  /* margin-bottom: 1px; */
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.reveal-slip {
  width: 80px;
  height: 5px;
  background-color: #ededed;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  position: relative;
}
.reveal-slider {
  position: absolute;
  background-color: #ff7d49;
  height: 5px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
/* 横向滚动区 */
.hotbox {
  position: relative;
  background-color: #ffffff;
  margin-bottom: 10px;
  font-size: 30px;
  color: #333333;
  font-weight: 400;
  line-height: 30px;
}
.hotbox-text {
  font-size: 28px;
  color: #333333;
  font-weight: 400;
  line-height: 30px;
}
.hotbox-sv {
  width: 750px;
  padding-top: 10px;
  padding-bottom: 10px;
  height: 340px;
}
.hotbox-patch {
  width: 250px;
  justify-content: center;
  align-items: center;
}
.hotbox-img {
  background-color: #eeeeee;
  border-radius: 4px;
}
.hotbox-intro {
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 10px;
}
.hotbox-intro-txt {
  lines: 1;
  font-size: 24px;
  color: #333333;
  font-weight: 400;
  line-height: 35px;
  max-width: 220px;
  height: 35px;
  text-overflow: ellipsis;
  margin-bottom: 5px;
}
.cbse {
  width: 230px;
  margin-top: 5px;
  flex-direction: row;
  align-items: center;
}
.cbse-row {
  flex-direction: row;
  align-items: center;
}
.hotbox-symbol,
.firebox-symbol {
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
  margin-top: 5px;
  color: #f24561;
}
.hotbox-number,
.firebox-number {
  font-size: 30px;
  font-weight: 400;
  line-height: 30px;
  color: #f24561;
}
.hotbox-oldpr {
  font-size: 18px;
  color: #999999;
  font-weight: 400;
  line-height: 30px;
  text-decoration: line-through;
  margin-top: 5px;
  margin-left: 5px;
}
.hotbox-price {
  position: absolute;
  left: 65px;
  top: 175px;
  width: 120px;
  height: 40px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 20px;
  background-image: linear-gradient(to left, #e5345f, #ff7d49);
}
.hotbox-sell-txxt {
  text-align: center;
  font-size: 22px;
  color: #fff;
  font-weight: 400;
  line-height: 40px;
  lines: 1;
  max-width: 120px;
  text-overflow: ellipsis;
}
.firebox {
  background-color: #ffffff;
  margin-bottom: 10px;
  font-size: 30px;
  color: #333333;
  font-weight: 400;
  line-height: 30px;
}
.firebox-text {
  font-size: 28px;
  color: #333333;
  font-weight: 400;
  line-height: 30px;
}

.firebox-sv {
  padding-top: 10px;
  align-items: center;
  height: 340px;
}
.firebox-patch {
  position: relative;
  width: 220px;
  margin-left: 10px;
  padding-bottom: 10px;
  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: #eeeeee;
}
.morebox {
  position: relative;
  width: 180px;
  /* height: 300px; */
  margin-left: 10px;
  padding-bottom: 10px;
  align-items: center;
  justify-content: center;
}
.limit-img {
  width: 220px;
  height: 200px;
}
.firebox-img {
  background-color: #eeeeee;
  border-radius: 4px;
  width: 180px;
  height: 180px;
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
}
.firebox-intro {
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 10px;
}
.card-progress-bar {
  width: 120px;
  height: 10px;
  border-radius: 4px;
  position: relative;
  background-color: #ededed;
  flex-direction: row;
  align-items: center;
  /* border-width:1px; 
  border-style:solid; 
  border-color:#ffcccc;  */
}
.card-progress-to {
  height: 10px;
  background-color: #de1168;
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
}
.card-progress-end {
  height: 10px;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
}
.firebox-sell-txt {
  font-size: 20px;
  color: #999999;
  font-weight: 400;
  line-height: 30px;
  margin-top: 2px;
  margin-left: 5px;
  text-decoration: line-through;
}
.firebox-price {
  position: absolute;
  left: 0;
  top: 190px;
  width: 100px;
  height: 40px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 20px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}
.firebox-sell-txxt {
  text-align: center;
  font-size: 22px;
  color: #ffffff;
  font-weight: 400;
  line-height: 40px;
  background-image: linear-gradient(to left, #e5345f, #ff7d49);
}

.show {
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
}
.small-show {
  width: 345px;
  height: 150px;
  background-color: #ffffff;
  border-radius: 4px;
}
.white {
  flex-direction: row;
  padding: 20px;
  justify-content: space-between;
  /* border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: #eeeeee; */
}
.title {
  width: 750px;
  background-color: #ffffff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.white-spe {
  padding-top: 20px;
  padding-bottom: 10px;
}
.main {
  width: 750px;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: #ffffff;
  margin-bottom: 10px;
}
.main-title,
.sub-title {
  flex-direction: row;
  align-items: center;
}
.main-txt {
  font-size: 28px;
  color: #333333;
  font-weight: 400;
  line-height: 30px;
}
.main-title-spe {
  width: 710px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.main-txt-spe {
  font-size: 30px;
  color: #333333;
  font-weight: 400;
  line-height: 30px;
}
.gray {
  font-size: 20px;
  color: #cccccc;
  /* padding-top: 10px; */
  font-weight: normal;
}
.sub-txt {
  font-size: 20px;
  color: #999999;
  font-weight: 400;
  line-height: 30px;
}
.goods-cell {
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #eeeeee;
}
.small-patch {
  width: 750px;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: #ffffff;
}
.left {
  width: 375px;
  padding-left: 10px;
  padding-right: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: #eeeeee;
}
.right {
  width: 375px;
  padding-left: 5px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: #eeeeee;
}
.patch-img {
  background-color: #eeeeee;
  border-radius: 4px;
}
.intro {
  padding-left: 1px;
  padding-right: 1px;
  padding-top: 10px;
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
  max-width: 350px;
  height: 80px;
  text-overflow: ellipsis;
}
.case {
  margin-top: 10px;
  flex-direction: row;
  justify-content: space-between;
}
.price {
  margin-top: 10px;
  flex-direction: row;
  align-items: center;
}
.symbol {
  font-size: 20px;
  color: #f24561;
  font-weight: 400;
  line-height: 30px;
  margin-top: 5px;
}
.number {
  font-size: 30px;
  color: #f24561;
  font-weight: 400;
  line-height: 30px;
}
.quan-sell {
  flex-direction: row;
  height: 28px;
  margin-top: 4px;
}
.quan-text {
  font-size: 20px;
  color: #666666;
  font-weight: 400;
  line-height: 30px;
  margin-left: 5px;
}
.sell-txxt {
  width: 100px;
  height: 30px;
  border-radius: 4px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  font-weight: 400;
  line-height: 30px;
  background-image: linear-gradient(to left, #e5345f, #ff7d49);
}

.sell-txt {
  font-size: 20px;
  color: #999999;
  font-weight: 400;
  line-height: 30px;
  margin-top: 3px;
}

.con {
  width: 750px;
  /* margin-top: 10px; */
  margin-bottom: 10px;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: white;
  /* border-radius: 10px; */
}

.big-con {
  width: 375px;
  padding: 20px 30px;
  height: 220px;
  /* background-color: #ff7d49; */
  /* border-radius: 10px; */
  /* align-items:center; */
  border-right-color: #eee;
  border-right-style: solid;
  border-right-width: 1px;
  border-bottom-color: #eee;
  border-bottom-style: solid;
  border-bottom-width: 1px;
}
.scrbox {
  height: 30px;
}
.imglt {
  width: 30px;
  height: 30px;
  margin-right: 5px;
}
.imgl {
  width: 100px;
  height: 100px;
  margin-left: 10px;
}

.imgl1 {
  width: 160px;
  height: 160px;
  position: absolute;
  right: 20px;
  bottom: 30px;
}
.imgl2 {
  width: 50px;
  height: 50px;
  position: absolute;
  right: 30px;
  top: 20px;
}
.imgl3box {
  margin-top: 10px;
}
.imgl3 {
  width: 320px;
  height: 130px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  margin-top: 10px;
}

.con-text {
  font-size: 26px;
  color: #333;
  font-weight: 400;
  height: 30px;
  line-height: 30px;
}

.com-text {
  font-size: 20px;
  color: #999;
  margin-top: 10px;
}
.wbox {
  background-color: #eee;
  width: 750px;
  height: 240px;
  margin-bottom: 10px;
}
.wboximg {
  width: 750px;
  height: 240px;
}
.back-top {
  width: 80px;
  height: 80px;
  align-items: center;
  justify-content: center;
  border-radius: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  
  /* border-width: 1px;
  border-style: solid;
  border-color: #ececec; */
}
.share{
  position: fixed;
  right: 25px;
  bottom:260px;
}
.sticky{
  position: fixed;
  right: 25px;
  bottom: 150px;
}
.back-top-text{
  font-size: 18px;
  font-weight: 500;
  color: #fff;
}
.decimal {
  margin-top: 5px;
  margin-right: 5px;
  font-size: 20px;
}
.error {
  width: 750px;
  height: 800px;
  align-items: center;
  justify-content: center;
}
.errorText {
  font-size: 20px;
  color: #666666;
}
/* 自动签到弹窗 */
.mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 750px;
  z-index: 999999;
  background-color: rgba(0, 0, 0, 0.6);
}
.auto {
  position: fixed;
  top: 280px;
  left: 125px;
  width: 500px;
  height: 800px;
}
.mask-cont {
  border-radius: 20px;
  width: 500px;
  height: 700px;
  opacity: 0;
}
.recomDoods {
  width: 500px;
  height: 700px;
  background-color: #ffffff;
  align-items: center;
  /* justify-content: center; */
}
.recomText {
  align-items: center;
  justify-content: center;
  width: 360px;
}
.recomTitle {
  lines: 1;
  font-size: 28px;
  color: #333333;
  font-weight: 400;
  line-height: 50px;
  max-width: 360px;
  text-overflow: ellipsis;
  margin-top: 10px;
  margin-bottom: 20px;
}
.recomPrice {
  color: #de1168;
  lines: 1;
  font-size: 30px;
  font-weight: 400;
  line-height: 40px;
  max-width: 360px;
  text-overflow: ellipsis;
  margin-bottom: 30px;
}
.recomClick {
  width: 180px;
  height: 60px;
  background-color: #de1168;
  font-size: 24px;
  font-weight: 400;
  line-height: 60px;
  height: 60px;
  text-align: center;
  color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}
.mask-bottom {
  width: 500px;
  height: 100px;
  background-color: transparent;
  justify-content: center;
  align-items: center;
}
.iconStyle {
  opacity: 0;
  width: 64px;
  height: 64px;
  background-color: transparent;
  border-radius: 32px;
  border-style: solid;
  border-width: 2px;
  border-color: #ffffff;
  color: #ffffff;
  font-size: 40px;
  text-align: center;
  line-height: 64px;
}
.ball {
  width: 120px;
  height: 140px;
  position: fixed;
  bottom: 280px;
  right: 0;
  margin-right: 30px;
  opacity: 1;
}
.baseline{
  height: 80px;
}
.bsaeline-text{
  font-size: 20px;
  color: #999;
}
</style>
