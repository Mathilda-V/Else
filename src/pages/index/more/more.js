// pages/index/more/more.js

const glo = getApp().globalData
var amapFile = require('../../../utils/amap-wx.js');

Page({

  /**
   * 页面的初始数据 
   */
  data: {
    addressCity: '武汉',
    menus: [
      { pic: '/static/img/more01.png', txt: '美食', catId: "201607311346168904" },
      { pic: '/static/img/more02.png', txt: '休闲娱乐', catId: "201607311347269895" },
      { pic: '/static/img/more03.png', txt: '足疗按摩', catId: "201607311349205498" },
      { pic: '/static/img/more04.png', txt: '母婴玩具', catId: "201611091059183272" },
      { pic: '/static/img/more05.png', txt: '服饰鞋包', catId: "201704121454118718" },
      { pic: '/static/img/more06.png', txt: '家居生活', catId: "201704121456308237" },
      { pic: '/static/img/more07.png', txt: '数码电子', catId: "201704121456567832" },
      { pic: '/static/img/more08.png', txt: '美妆护肤', catId: "201704121457321375" },
      { pic: '/static/img/more09.png', txt: '女装', catId: "201704121556187206" },
      { pic: '/static/img/more10.png', txt: '百货食品', catId: "201804081756149396" }
    ],
    pageIndex: 0,
    pageSize: 15,
    hasMoreData: true,
    areaId: '',
    isLike: '',
    catId: '',
    sorterMode: "0",
    cityId: '',
    citycode: '',
    productMode: "0",
    pullFlag: false,
    shopList: [],
    total: [],
    content: [
      { id: '0', name: "智能排序" },
      { id: '1', name: "销量排序" },
      { id: '2', name: "距离排序" },
      { id: '3', name: "好评排序" },
      { id: '4', name: "低价优先" },
      { id: '5', name: "高价优先" }
    ],
    nearBy: '',
    totalName: "全部",
    nearbyName: "附近",
    sortName: "智能排序",
    scroll: false,
    totalopen: false,
    totalshow: false,
    nearbyopen: false,
    nearbyshow: false,
    sortopen: false,
    sortshow: false,
    isfull: false,
    shownavindex: '',
    btnShow: true,
    quanShow: false,
    loadingHidden: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList(this.data.areaId, this.data.isLike, this.data.catId, this.data.sorterMode, this.data.productMode)
  },
  // 获取店铺列表封装
  getList: function (areaId, isLike, catId, sorterMode, productMode) {
    let self = this;
    let params = {
      areaId: areaId, 
      isLike: isLike,
      catId: catId,
      sorterMode: sorterMode,
      productMode: productMode,
      pageIndex: self.data.pageIndex,
      pageSize: self.data.pageSize,
      lat: glo.lat,
      lng: glo.lng,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    }
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/shopping/getShopList', { param: encStr }, 'POST', res => {
      self.setData({ loadingHidden: false })
      console.log('所有商家', res)
      if (res.data.success) {
        var shopListTem = self.data.shopList;
        if (self.data.pageIndex == 0) {
          shopListTem = [];
        }
        var shopList = res.data.shop_list;
        if (shopList.length < self.data.pageSize) {
          self.setData({
            shopList: shopListTem.concat(shopList),
            hasMoreData: false,
          })
        } else {
          self.setData({
            shopList: shopListTem.concat(shopList),
            hasMoreData: true,
            pageIndex: self.data.pageIndex + 1
          })
        }
      } else {
        self.setData({
          shopList: [],
          hasMoreData: false
        })
        wx.showToast({
          title: res.data.msg,
        })
      }
      if (self.data.pullFlag) {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.hideLoading();
      }
    })
    console.log(params)
  },
  // 一级分类
  toRushBuy (e) {
    var catId = e.currentTarget.dataset.info.catId;
    this.setData ({
      catId: catId,
      total: '',
      pageIndex: 0,
      totalName: "全部",
    })
    this.getList(this.data.areaId, this.data.isLike, this.data.catId, this.data.sorterMode, this.data.productMode)
  },
  // 获取分类选项-全部
  getFilterShopCats: function () {
    console.log('全部商家')
    let params = {
      isHome: 0,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    }
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/shopping/getFilterShopCats', { param: encStr }, 'POST', res => {
      console.log("全部分类",res)
      if (res.data.success) {
        var info = res.data.cat_list;
        console.log(info)
        for(var i in info) {
          if(info[i].id == this.data.catId){
            this.setData({
              total: info[i].child_cat_list
            })
            // console.log(info[i].id, this.data.catId,i)
            break;
          }
        }
        console.log(this.data.total)
      }
    })
  },
  // 获取分类选项-附近
  getDistrict: function () {
    let params = {
      cityId: glo.map.regeocodeData.addressComponent.citycode,
      citycode: glo.map.regeocodeData.addressComponent.adcode,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    }
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/common/getDistrictByParentId', { param: encStr }, 'POST', res => {
      if (res.data.success) {
        this.setData({
          nearBy: res.data.district_list
        })
      }
    })
  },
  total: function (e) {
    if (this.data.totalopen) {
      this.setData({
        totalopen: false,
        totalshow: false,
        nearbyopen: false,
        nearbyshow: false,
        sortopen: false,
        sortshow: false,
        isfull: false,
        shownavindex: 0,
        scroll: false
      })
    } else {
      this.setData({
        totalopen: true,
        totalshow: true,
        nearbyopen: false,
        nearbyshow: false,
        sortopen: false,
        sortshow: false,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav,
        scroll: true
      })
    }
    if (this.data.total == "") {
      this.getFilterShopCats()
    }
  },
  nearby: function (e) {
    if (this.data.nearbyopen) {
      this.setData({
        totalopen: false,
        totalshow: false,
        nearbyopen: false,
        nearbyshow: false,
        sortopen: false,
        sortshow: false,
        isfull: false,
        shownavindex: 0,
        scroll: false
      })
    } else {
      this.setData({
        totalopen: false,
        totalshow: false,
        nearbyopen: true,
        nearbyshow: true,
        sortopen: false,
        sortshow: false,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav,
        scroll: true
      })
    }
    if (this.data.nearBy == "") {
      this.getDistrict()
    }
  },
  sort: function (e) {
    if (this.data.sortopen) {
      this.setData({
        totalopen: false,
        totalshow: false,
        nearbyopen: false,
        nearbyshow: false,
        sortopen: false,
        sortshow: false,
        isfull: false,
        shownavindex: 0,
        scroll: false
      })
    } else {
      this.setData({
        totalopen: false,
        totalshow: false,
        nearbyopen: false,
        nearbyshow: false,
        sortopen: true,
        sortshow: true,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav,
        scroll: true
      })
    }
  },
  hidebg: function (e) {
    this.setData({
      totalopen: false,
      totalshow: false,
      nearbyopen: false,
      nearbyshow: false,
      sortopen: false,
      sortshow: false,
      isfull: false,
      shownavindex: 0,
      scroll: false
    })
  },
  // 全部选项
  all: function (e) {
    let self = this;
    self.hidebg();
    self.setData({
      shopList: [],
      totalName: '全部',
      pageIndex: 0,
      catId: '',
      loadingHidden: true
    })
    self.getList(self.data.areaId, self.data.isLike, self.data.catId, self.data.sorterMode, self.data.productMode)
  },
  // 附近选项
  near: function (e) {
    let self = this;
    this.hidebg();
    console.log(e)
    self.setData({
      shopList: [],
      nearbyName: '附近',
      pageIndex: 0,
      areaId: '',
      loadingHidden: true
    })
    self.getList(self.data.areaId, self.data.isLike, self.data.catId, self.data.sorterMode, self.data.productMode)
  },
  // 类型分类
  one: function (e) {
    let self = this;
    self.hidebg();
    self.setData({
      shopList: [],
      totalName: e.currentTarget.dataset.info.name,
      pageIndex: 0,
      catId: e.currentTarget.dataset.info.id,
      loadingHidden: true
    })
    self.getList(self.data.areaId, self.data.isLike, self.data.catId, self.data.sorterMode, self.data.productMode)
  },
  // 附近分类
  two: function (e) {
    let self = this;
    this.hidebg();
    console.log(e)
    self.setData({
      shopList: [],
      nearbyName: e.currentTarget.dataset.info.name,
      pageIndex: 0,
      areaId: e.currentTarget.dataset.info.adcode,
      loadingHidden: true
    })
    self.getList(self.data.areaId, self.data.isLike, self.data.catId, self.data.sorterMode, self.data.productMode)
  },
  // 排序分类
  three: function (e) {
    var self = this;
    var id = e.currentTarget.dataset.info.id;
    var isLike = '';
    var sorterMode = '';
    self.hidebg();
    if (id == 0) {
      isLike = 1;
    } else {
      sorterMode = id;
    }
    self.setData({
      shopList: [],
      sortName: e.currentTarget.dataset.info.name,
      pageIndex: 0,
      isLike: isLike,
      sorterMode: sorterMode,
      loadingHidden: true
    })
    self.getList(self.data.areaId, self.data.isLike, self.data.catId, self.data.sorterMode, self.data.productMode)
  },
  goDetail: function (e) {
    var info = e.currentTarget.dataset.info;
    // console.log(info)
    var name = info.name;
    var cat_type = info.cat_type;
    var id = info.id;
    var hotelId = info.hotelId;
    var ktvId = info.ktvId;
    switch (cat_type) {
      case '5':
        wx.navigateTo({
          url: `../../shop/entertainment/entertainment?id=${id}&name=${name}`,
        })
        break;
      case '4':
        wx.navigateTo({
          url: `../../shop/hotel/hotel?id=${hotelId}&name=${name}`,
        })
        break;
      case '9':
        wx.navigateTo({
          url: `../../shop/clothing/clothing?id=${id}&name=${name}`,
        })
        break;
      default:
        wx.navigateTo({
          url: `../../shop/food/food?id=${id}&ktvId=${ktvId}&cat_type=${cat_type}&name=${name}`,
        })
    }
  },
  // 点击全部商家
  leftBtn: function () {
    let self = this;
    self.setData({
      shopList: [],
      btnShow: true,
      productMode: "0",
      pageIndex: 0,
      loadingHidden: true
    })
    self.getList(self.data.areaId, self.data.isLike, self.data.catId, self.data.sorterMode, self.data.productMode)
  },
  // 点击优惠商家 
  rightBtn: function () {
    let self = this;
    self.setData({
      shopList: [],
      btnShow: false,
      productMode: "1",
      pageIndex: 0,
      loadingHidden: true
    })
    self.getList(self.data.areaId, self.data.isLike, self.data.catId, self.data.sorterMode, self.data.productMode)
  },
  toCity() {
    wx.navigateTo({
      url: '../city/city'
    })
  },
  toSearch() {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.data.pageIndex = 0;
    self.getList(self.data.areaId, self.data.isLike, self.data.catId, self.data.sorterMode, self.data.productMode)
    console.log("下拉动作")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showNavigationBarLoading();
    wx.showLoading({ title: '刷新重载中' })
    let self = this;
    self.setData({
      pullFlag: true
    })
    wx.showLoading({
      title: '玩命加载中',
    })
    if (self.data.hasMoreData) {
      self.getList(self.data.areaId, self.data.isLike, self.data.catId, self.data.sorterMode, self.data.productMode)
    } else {
      wx.showToast({
        title: '没有更多数据',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})