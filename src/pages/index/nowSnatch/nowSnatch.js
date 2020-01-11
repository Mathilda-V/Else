/*
 * @Author: wuwudi
 * @Date: 2018-08-21 16:31:10
 * @LastEditors: wuwudi
 * @LastEditTime: 2018-08-21 16:31:10
 */
const glo = getApp().globalData
const { countDownDate } = require('../../../utils/dateUtil.js')
Page({
  data: {
    ad_list: [],
    periodList: [],
    productList: [],
    remainTime: '',
    pageIndex: 0,
    currentIndex: 0,
    currentPeriod: '' || '10:00',
    timer: 0,
    
  },
  onLoad() {
    this.getPanicCommon();
    this.getAdList();
  },
  onUnload(){
    clearTimeout(this.data.timer)
  },
  onPullDownRefresh(){
    this.getPanicProduct(this.data.periodList[this.data.currentIndex].period)
  },
  onReachBottom(){
    this.getPanicProduct(this.data.periodList[this.data.currentIndex].period, ++this.data.pageIndex, '1')
  },
  getPanicCommon(){
    let params = {
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    }
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/panic/buy/getPanicBuyCommonList', { param: encStr }, 'POST', res => {
      if(res.statusCode == 200) {
        this.setData({ periodList: res.data.period_list })
        // console.log('periodList',this.data.periodList)
        let date = new Date()
        let currentTime = `${date.getHours()}:${date.getMinutes()}`
        for(let i = this.data.periodList.length - 1; i > 0 ; i--){
          if(this.compareHours(currentTime, this.data.periodList[i].period)) {
            this.setData({
              currentIndex: i,
              currentPeriod: this.data.periodList[i].period
            })
            break
          }
        }
        wx.showLoading({ title: '加载中...' })
        this.getPanicProduct(this.data.currentPeriod)
      }
    })
  },
  getPanicProduct(period, pageIndex = 0, sign = '0'){
    this.countDown(period)
    let params = {
      period: period,
      pageIndex: pageIndex,
      pageSize: 10,
      sessionid: glo.sessionId,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    }
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/panic/buy/getPanicBuyProductList', { param: encStr }, 'POST', res => {
      // console.log(res)
      if(res.statusCode == 200){
        if(sign == '0'){
          this.data.productList.length && this.data.productList.splice(0, this.data.productList.length)
          this.setData({productList: res.data.panic_buy_product_list})
          this.BuyingRate(this.data.productList)
        } else {
          this.data.productList.push(...res.data.panic_buy_product_list)
          this.setData({productList: this.data.productList})
          this.BuyingRate(this.data.productList)
        }
        console.log('productList', this.data.productList)
        wx.stopPullDownRefresh()
        wx.hideLoading()
      }
    })
  },
  BuyingRate(Arr){
    Arr.forEach((d)=>{
      d.panic_product_list.forEach((e) => {
        e.BuyingRate = Math.round(e.sellNumber / (e.number + e.sellNumber) * 100)
      })
    })
    this.setData({ productList: Arr})
  },
  changePeriod(e){
    clearTimeout(this.data.timer)
    wx.showLoading({ title: '加载中...' })
    this.setData({currentIndex: e.currentTarget.dataset.index})
    this.getPanicProduct(this.data.periodList[this.data.currentIndex].period)
  },
  countDown(period){
    let result = countDownDate(false, period)
    this.setData({
      remainTime: result,
      timer: setTimeout(() => {
        this.countDown(period)
      }, 1000)
    })
  },
  compareHours(t1,t2){
    var date = new Date();
    var a = t1.split(":");
    var b = t2.split(":");
    return date.setHours(a[0],a[1]) > date.setHours(b[0],b[1]);
  },
  toProductDetail(e){
    wx.navigateTo({
      url: `../detail/detail?id=${e.currentTarget.dataset.product.product_id}&panicId=${e.currentTarget.dataset.product.id}`
    })
  },
  getAdList() {
    let params = {
      position: 'app-buyiing',
      catId: '',
      pageSize: 5,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    }
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/common/getAdList', { param: encStr }, 'POST', res => {
      // console.log('ad',res)
      if (res.data.success) {
        this.setData({ ad_list: res.data.ad_list})
      }
    })
  },
  bindweb(e) {  //广告点击链接
    let data = e.currentTarget.dataset.item.webUrl
    wx.setStorageSync('webUrl', data)
    wx.navigateTo({
      url: `../../WebView/WebView`
    })
  },
  PanicBuyTip(ev) {  //点击提醒
    let  panicId = ev.currentTarget.dataset.item.id
    if(parseInt(ev.currentTarget.dataset.item.isPanic) == 1) {
      let params = {
        panicId: panicId,
        sessionid: glo.sessionId,
        version: glo.ver.versionNo,
        deviceType: glo.deviceType
      }
      let encStr = glo.mm.encrypt(params)
      glo.mm.request('/panic/buy/cancelPanicBuyTip', { param: encStr }, 'POST', res => {
        // console.log('can', res)
        if (res.data.success) {
          wx.showLoading({ title: '加载中...' })
          this.getPanicProduct(this.data.periodList[this.data.currentIndex].period)
        } else {
          wx.showToast({ title: res.data.msg, duration: 1000 })
        }
      })
    } else {
      let params = {
        panicId: panicId,
        sessionid: glo.sessionId,
        version: glo.ver.versionNo,
        deviceType: glo.deviceType
      }
      let encStr = glo.mm.encrypt(params)
      glo.mm.request('/panic/buy/setPanicBuyTip', { param: encStr }, 'POST', res => {
        // console.log('set', res)
        if (res.data.success) {
          wx.showLoading({ title: '加载中...' })
          this.getPanicProduct(this.data.periodList[this.data.currentIndex].period)
        } else {
          wx.showToast({ title: res.data.msg, duration: 1000 })
        }
      })
    }
  },
})