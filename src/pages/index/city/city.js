// pages/index/city/city.js

const glo = getApp().globalData
const amapFile = require('../../../utils/amap-wx.js')
const convertPY = require('../../../utils/convertPY.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    map: {},
    addressCity: '武汉',
    toView: '',
    hotCity: [553, 480, 568, 681, 737, 559, 683, 555, 481, 735, 596, 790],
    allCity: [],
    cityList: []
  },

  getRegeo() {
    let myAmapFun = new amapFile.AMapWX({
      key: '1bae3c2f4c503dbbe326989a184a2f7d'
    });
    myAmapFun.getRegeo({
      success: (res) => {
        this.setData({
          map: res[0],
          addressCity: res[0].regeocodeData.addressComponent.city
        })
      }
    })
  },

  anchorNav: function(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      toView: id
    })
  },

  getCityList: function() {
    let params = {
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    }
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/common/getCitys', {
      param: encStr
    }, 'POST', res => {
      if (res.data.success) {
        // 获取城市列表排序
        let cityList = res.data.city_list
        cityList.sort(function(a, b) {
          let aPY = convertPY.convertToPinyinLower(a.name)
          let bPY = convertPY.convertToPinyinLower(b.name)
          if (aPY.slice(0, 1)[0] > bPY.slice(0, 1)[0]) {
            return 1
          } else if (aPY.slice(0, 1)[0] == bPY.slice(0, 1)[0]) {
            if (aPY.slice(1, 1)[0] > bPY.slice(1, 1)[0]) {
              return 1
            } else if (aPY.slice(1, 1)[0] == bPY.slice(1, 1)[0]) {
              if (aPY.slice(2, 1)[0] > bPY.slice(2, 1)[0]) {
                return 1
              } else if (aPY.slice(2, 1)[0] > bPY.slice(2, 1)[0]) {
                return 0
              } else {
                return -1
              }
            } else {
              return -1
            }
          } else  {
            return -1
          }
        })

        let hotArr = []
        this.data.hotCity.filter(v1 => {
          cityList.filter(v2 => {
            if (v1 == v2.id) hotArr.push(v2)
          })
        })
        this.setData({
          hotCity: hotArr
        })

        this.setData({
          allCity: [{
              order: 'A',
              citys: cityList.slice(0, 11)
            },
            {
              order: 'B',
              citys: cityList.slice(11, 34)
            },
            {
              order: 'C',
              citys: cityList.slice(34, 56)
            },
            {
              order: 'D',
              citys: cityList.slice(56, 76)
            },
            {
              order: 'E',
              citys: cityList.slice(76, 79)
            },
            {
              order: 'F',
              citys: cityList.slice(79, 87)
            },
            {
              order: 'G',
              citys: cityList.slice(87, 99)
            },
            {
              order: 'H',
              citys: cityList.slice(99, 137)
            },
            {
              order: 'J',
              citys: cityList.slice(137, 161)
            },
            {
              order: 'K',
              citys: cityList.slice(161, 168)
            },
            {
              order: 'L',
              citys: cityList.slice(168, 201)
            },

            {
              order: 'M',
              citys: cityList.slice(201, 207)
            },
            {
              order: 'N',
              citys: cityList.slice(207, 220)
            },
            {
              order: 'P',
              citys: cityList.slice(220, 228)
            },
            {
              order: 'Q',
              citys: cityList.slice(228, 245)
            },
            {
              order: 'R',
              citys: cityList.slice(245, 247)
            },
            {
              order: 'S',
              citys: cityList.slice(247, 283)
            },
            {
              order: 'T',
              citys: cityList.slice(283, 304)
            },
            {
              order: 'W',
              citys: cityList.slice(304, 324)
            },
            {
              order: 'X',
              citys: cityList.slice(324, 346)
            },
            {
              order: 'Y',
              citys: cityList.slice(346, 373)
            },
            {
              order: 'Z',
              citys: cityList.slice(373)
            }
          ]
        })
      }
    })
  },

  toIndex: function(e) {
    console.log(e)
    let pages = getCurrentPages()
    let currPage = pages[pages.length - 1]
    let prevPage = pages[pages.length - 2]
    prevPage.setData({
      addressCity: e.target.dataset.city.name
    })
    glo.lat = e.target.dataset.city.lat
    glo.lng = e.target.dataset.city.lng
    wx.navigateBack()
    this.getHomeShopList(prevPage)
  },

  getHomeShopList(prevPage) {
    let params = {
      lat: glo.lat,
      lng: glo.lng,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    }
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/shopping/getHomeShopList', {
      param: encStr
    }, 'POST', res => {
      if (res.data.success) {
        prevPage.setData({
          hot_shop_list: res.data.hot_shop_list,
          shop_list: prevPage.SplitArray(8, res.data.shop_list)
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getRegeo()
    this.getCityList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})