// pages/index/payCheck/payCheck.js
const glo = getApp().globalData
var CryptoJS = require('../../../utils/cryptojs/aes.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabTit: ['会员充值', '视频会员充值', '话费充值'],
    sort: [
      { logo: '', name: '腾讯视频会员', check: true },
      { logo: '', name: '芒果TV会员', check: false },
      { logo: '', name: '搜狐视频会员', check: false },
      { logo: '', name: '爱奇艺视频会员', check: false }
    ],
    money: [
      { time: '1', price: '19.00', check: true },
      { time: '3', price: '19.00', check: false },
      { time: '6', price: '19.00', check: false }
    ],
    tel: [
      { price: '20', count: '19.00', check: true },
      { price: '20', count: '19.00', check: false },
      { price: '20', count: '19.00', check: false },
      { price: '20', count: '19.00', check: false },
      { price: '20', count: '19.00', check: false },
      { price: '20', count: '19.00', check: false },
      { price: '20', count: '19.00', check: false },
      { price: '20', count: '19.00', check: false },
      { price: '20', count: '19.00', check: false }
    ],
    type: ['会员'],
    tabIndex: 0,
    general: true,
    member: false,
    merchant: false,
    delShow: false,
    memberList: [], //充值列表
    price: '', //充值等级

  },
  /**
   * 事件处理
   */
  bindTab(e) {
    this.setData({ tabIndex: e.target.dataset.index });
    switch (this.data.tabIndex) {
      case 0:
        this.setData({ general: true, member: false, merchant: false });
        break;
      case 1:
        this.setData({ general: false, member: true, merchant: false });
        break;
      default:
        this.setData({ general: false, member: false, merchant: true });
    }
  },
  bindKeyInput(e) {
    if (e.detail.value) {
      this.setData({
        delShow: true
      })
    } else {
      this.setData({
        delShow: false
      })
    }
  },
  binddelInput() {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRechargeList();
  },
  // 选择视频分类
  selSort: function (e) {
    var index = e.currentTarget.dataset.index;

  },
  // 选择面额
  selPrice: function (e) {
    var index = e.currentTarget.dataset.index;

  },
  // 选择充值类型
  selType: function (e) {
    var index = e.currentTarget.dataset.index;

  },
  // 获取会员充值列表
  getRechargeList: function () {
    let self = this;
    let params = {
      type: 1,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    }
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/trade/charge/getRechargeList', { param: encStr }, 'POST', res => {
      console.log("会员充值列表", res)
      self.setData({
        memberList: res.data.recharge_list
      })
    })
  },
  // 会员充值
  toGeneralPay: function (e) {
    let self = this;
    var info = e.currentTarget.dataset.info;        
    // 判断充值等级
    let params = {
      level: 1,
      type: 1,
      sessionid:glo.sessionId,
      lat: glo.lat,
      lng: glo.lng,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    }
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/trade/charge/checkUserAndLevel', { param: encStr }, 'POST', res => {
      console.log("判断充值等级", res)
      if (res.data.success) {
        var price = res.data.difference_price
        self.postWxPay(price,info);
      } else {
        wx:wx.showToast({
          title: res.data.msg
        })
      }
    })
  },
  // 判断成功，充值
  postWxPay: function (d,e) {
    let self = this;
    if (d >= 0) {
      var title = self.toUnicode("会员充值");
      var catId = self.toUnicode("会员充值微信支付");
      var products = {
        price: d+"",
        "number": '1',
        name: 'alipay',
        title: title,
        catId: catId
      }
      let params = {
        openid: glo.openId,
        tradeType: 3,
        chargeId: e.id,
        type: 3,
        status: 0,
        products: JSON.stringify(products),
        price: d,
        sessionid: glo.sessionId,
        lat: glo.lat,
        lng: glo.lng,
        version: glo.ver.versionNo,
        deviceType: glo.deviceType
      }
      console.log(params)
      let encStr = glo.mm.encrypt(params)
      glo.mm.request('/trade/postJSAPIPay', { param: encStr }, 'POST', res => {
        if(res.data.success) {
          console.log("会员充值", res)
          var t = res.data.result;
          var info = JSON.parse(self.AESDecrypt(t))
          console.log(info)
          // 微信支付
          wx.requestPayment({
            'timeStamp': info.timeStamp,
            'nonceStr': info.nonce_str,
            'package': info.package,
            'signType': 'MD5',
            'paySign': info.sign,
            'success': function (res) {
              console.log(res)
            },
            'fail': function (res) {
              console.log(res)
            }
          })
        }
      })
    }
  }, 
  // 中文转unicode
  toUnicode: function(s){
    return s.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, function () {
      return "\\u" + RegExp["$1"].charCodeAt(0).toString(16);
    });
  }, 
  // AES解密
  AESDecrypt: function(t){
    var key ="W8p102YW9AZQ117g4t4z241pr6IM9oF49Q3L4pwsuWRE0E7Z04GM1819A217";
    var RdWXBizDataCrypt=require("../../../utils/RdWXBizDataCrypt.js");
    var cptry = new RdWXBizDataCrypt('','');
    var a=  cptry.decryptData256(t,key);
    return a
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})