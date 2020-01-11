const glo = getApp().globalData
var amapFile = require('../../utils/amap-wx.js');
Page({

  data: {
    map: {},
    addressCity: '武汉',
    ad_list: [],
    ads_list: [],
    hot_shop_list: [],
    shop_list: [],
    indicatorDots: [true, true],
    indicatorActiveColor: ['#ff8b00', '#ff8b00'],
    autoplay: [true, true],
    circular: [true, true],
    interval: [5320, 9230],
    duration: 1000,
    productList: [],
    currentPeriod: ''
  },

  onLoad: function() {
    this.getRegeo()
    this.getPanicProduct()
    this.getAdList()
    this.getAdsList()
  },
  getRegeo() {
    let myAmapFun = new amapFile.AMapWX({
      key: '1bae3c2f4c503dbbe326989a184a2f7d'
    });
    myAmapFun.getRegeo({
      success: (res) => {
        // console.log(res)
        this.setData({
          map: res[0],
          addressCity: res[0].regeocodeData.addressComponent.city
        })
        this.getHomeShopList()
      }
    })
  },
  getAdList() { // 广告大图
    let params = {
      position: 'app-home',
      catId: '',
      pageSize: 5,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    }
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/common/getAdList', {
      param: encStr
    }, 'POST', res => {
      if (res.data.success) {
        // console.log(res.data)
        this.setData({
          ad_list: res.data.ad_list
        })
      }
    })
  },
  getAdsList() { // 活动大图
    let params = {
      position: 'app-home-exemption',
      catId: '',
      pageSize: 5,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    }
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/common/getAdList', {param: encStr}, 'POST', res => {
      if (res.data.success) {
        // console.log(res.data)
        this.setData({
          ads_list: res.data.ad_list
        })
      }
    })
  },
  getPanicProduct() {
    let params = {
      pageIndex: 0,
      pageSize: 15,
      lat: glo.lat,
      lng: glo.lng,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    }
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/shopping/getBrowseProductList', {
      param: encStr
    }, 'POST', res => {
      // console.log('product', res)
      if (res.statusCode == 200) {
        this.setData({
          productList: res.data.product_list
        })
      }
    })
  },
  getHomeShopList() {
    let params = {
      lat: this.data.map.latitude,
      lng: this.data.map.longitude,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    }
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/shopping/getHomeShopList', {
      param: encStr
    }, 'POST', res => {
      // console.log('ShopList', res)
      if (res.data.success) {
        this.setData({
          hot_shop_list: res.data.hot_shop_list,
          shop_list: this.SplitArray(8, res.data.shop_list)
        })
        // console.log(this.data.shop_list)
      }
    })
  },
  SplitArray(N, Q) {
    var R = [],
      F;
    for (F = 0;
      (F + N) < Q.length;) {
      R.push(Q.slice(F, F += N))
    }
    return R
  },
  toCity() {
    wx.navigateTo({
      url: 'city/city'
    })
  },
  toSearch() {
    wx.navigateTo({
      url: 'search/search'
    })
  },
  toRushBuy() {
    wx.navigateTo({
      url: 'nowSnatch/nowSnatch'
    })
  },
  toEarnMoney() {
    wx.navigateTo({
      url: 'earnMoney/earnMoney'
    })
  },
  toZeroBuy() {
    wx.navigateTo({
      url: 'zeroHelpAvoid/zeroHelpAvoid'
    })
  },
  toProductDetail(e) {
    wx.navigateTo({
      url: `detail/detail?id=${e.currentTarget.dataset.product.id}&panicId=`
    })
  },
  bindweb(e) { //广告点击链接
    let data = e.currentTarget.dataset.item.webUrl
    wx.setStorageSync('webUrl', data)
    wx.navigateTo({
      url: `../WebView/WebView`
    })
  },
  // 进入充值中心
  toPay() {
    wx.navigateTo({
      url: 'payCheck/payCheck',
    })
  },
  // 进入更多
  toMore() {
    wx.navigateTo({
      url: 'more/more',
    })
  },
  // 进入商家详情
  toBigshop(e) {
    var info = e.currentTarget.dataset.info;
    var name = info.name;
    var cat_type = info.catType;
    var id = info.id;
    // var hotelId = info.hotelId  || '';
    var ktvId = info.ktvId || '';
    if (cat_type == null) {
      wx.navigateTo({
        url: `../shop/hotel/hotel?id=${id}&name=${name}`,
      })
    } else {
      switch (cat_type) {
        case '3':
          wx.navigateTo({
            url: `../shop/entertainment/entertainment?id=${id}&name=${name}`,
          })
          break;
        case '4':
          wx.navigateTo({
            url: `../shop/hotel/hotel?id=${id}&name=${name}`,
          })
          break;
        case '9':
          wx.navigateTo({
            url: `../shop/clothing/clothing?id=${id}&name=${name}`,
          })
          break;
        default:
          wx.navigateTo({
            url: `../shop/food/food?id=${id}&ktvId=${ktvId}&cat_type=${cat_type}&name=${name}`,
          })
      }
    }
  },
  toSmallshop(e) {
    // console.log(e)
    var info = e.currentTarget.dataset.info;
    var name = info.name;
    var cat_type = info.catType;
    var id = info.id;
    // var hotelId = info.hotelId || '';
    var ktvId = info.ktvId || '';
    if (cat_type == null) {
      wx.navigateTo({
        url: `../shop/hotel/hotel?id=${id}&name=${name}`,
      })
    } else {
      switch (cat_type) {
        case '3':
          wx.navigateTo({
            url: `../shop/entertainment/entertainment?id=${id}&name=${name}`,
          })
          break;
        case '4':
          wx.navigateTo({
            url: `../shop/hotel/hotel?id=${id}&name=${name}`,
          })
          break;
        case '9':
          wx.navigateTo({
            url: `../shop/clothing/clothing?id=${id}&name=${name}`,
          })
          break;
        default:
          wx.navigateTo({
            url: `../shop/food/food?id=${id}&ktvId=${ktvId}&cat_type=${cat_type}&name=${name}`,
          })
      }
    }
  },
})