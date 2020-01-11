const glo = getApp().globalData
const { timeStamp } = require('../../../utils/dateUtil.js')
const sessionId = '9469Ee7d972b128c956152EbB87e2bC49d2cA3524a9eDcDe50Ac3e3004131121'
Page({
  data: {
    tabList: ['图文介绍','规格参数','相关推荐'],
    tabIndex: 0,
    collect: '收藏',
    productDetail: {},
    remainTime: '',
    timer: 0,
    popoutHidden: true,
    couponHidden: true, 
    selectHidden: true,
    couponHeight: '',
    selectHeight: '',
    attrSelect: [],
    attrIds: '',
    number: 1,
    RecommendProducts: [],
    loadingHidden: true,
    shopId: '',
  },
  onLoad: function(options) {
    this.getDetail(options.id, options.panicId)
    
  },
  onUnload() {
    clearTimeout(this.data.timer)
  },
  onReady(){
    this.getRect('.coupon', 'couponHeight')
    this.getRect('.type-select', 'selectHeight')
  },
  getDetail(id, panicId) {
    let params = {
      id: id,
      panicId: '',
      sessionid: glo.sessionId,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    }
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/shopping/getProduct', { param: encStr }, 'POST', res => {
      if (res.data.success) {
        this.setData({ 
          loadingHidden: false,
          productDetail: res.data, 
          attrSelect: res.data.product.attr_list,
          shopId: res.data.product.shop_id
        })
        if (this.data.productDetail.product.hasOwnProperty('isCollected')) {
          if (this.data.productDetail.product.isCollected == 1) {
            this.setData({ collect: '已收藏'})
          } else {
            this.setData({ collect: '收藏' })
          }
        } else {
          this.setData({ collect: '收藏', ['productDetail.product.isCollected']: 0 })
        }
        if (this.data.productDetail.product.panic){
          this.countDown(this.data.productDetail.product.finalTime)
        }
        console.log('detail', this.data.productDetail) 
        this.RecommendProducts()
      }
    })
  },
  selectorClicked(e) {  //属性选择
    console.log(e)
    let parentIndex = e.currentTarget.dataset.parentindex
    let index = e.currentTarget.dataset.index
    this.data.attrSelect[parentIndex].currentIndex = index
    this.setData({ attrSelect: this.data.attrSelect })
  },
  numberReduce(){
    if(this.data.number ==1){
      this.setData({ number: this.data.number})
    }else{
      this.setData({ number: this.data.number - 1 })
    }
  },
  numberAdd(){
    this.setData({ number: this.data.number + 1 })
  },
  countDown(period){
    let result = timeStamp(parseInt(period))
    this.setData({
      remainTime: result,
      timer: setTimeout(() => {
        this.countDown(period-1)
      }, 1000)
    })
  },
  getRect(el, heightEl){
    wx.createSelectorQuery().select(el).boundingClientRect(rect => {
      this.setData({
        [heightEl]: `-${rect.height}px`
      })
    }).exec()
  },
  closePopout() {
    this.setData({ popoutHidden: true, couponHidden: true, selectHidden: true })
  },
  showCoupon() {
    this.setData({ popoutHidden: false, couponHidden: false })
  },
  showSelect() {
    this.setData({ popoutHidden: false, selectHidden: false })
  },
  closeCoupon() {
    this.setData({ popoutHidden: true, couponHidden: true })
  },
  closeSelect() {
    this.setData({ popoutHidden: true, selectHidden: true })
  },
  bindTab(e){
    this.setData({tabIndex:e.currentTarget.dataset.index})
  },
  //全部宝贝、进店逛逛、店铺
  tobindshop(){ 
    var shopId = this.data.shopId;
    wx.navigateTo({
      url: `../../shop/shopDetail/shopDetail?shopId=${shopId}`
    })
  },
  Collected(){ //收藏 
    if (this.data.productDetail.product.hasOwnProperty('isCollected')) {
      if (this.data.productDetail.product.isCollected == 1){
        this.cancelProductCollect()
      }else{
        this.addProductCollect()
      }
    }else{
      this.addProductCollect()
    }
    
  },
  cancelProductCollect(){ //取消收藏
    let params = {
      bussnessId: this.data.productDetail.product.id,
      lat: glo.lat,
      lng: glo.lng,
      sessionid: glo.sessionId,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    }
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/shopping/cancelProductCollect', { param: encStr }, 'POST', res => {
      console.log('取消收藏',res)
      wx.showToast({ title: res.data.msg, duration: 2000 })
      if (res.data.success) {
        this.setData({ collect: '收藏', ['productDetail.product.isCollected']: 0 })
      }
    })
  },
  addProductCollect() {  //点击收藏
    let params = {
      bussnessId: this.data.productDetail.product.id,
      type: 2,
      sessionid: glo.sessionId,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    }
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/shopping/addProductCollect', { param: encStr }, 'POST', res => {
      console.log('加入收藏',res)
      wx.showToast({ title: res.data.msg, duration: 2000 })
      if (res.data.success) {
        this.setData({ collect: '已收藏', ['productDetail.product.isCollected']: 1 })
      }
    })
  },
  postCart(e){  //加入购物车
    let flag = true,ind = 0;
    this.data.attrSelect.forEach((v, i) => {
      if (!v.hasOwnProperty('currentIndex')) {
        flag = false
        ind = i
      }
    })
    let params = {
      productId: this.data.productDetail.product.id,
      shopId: this.data.productDetail.product.shop_id,
      number: this.data.number,
      mode: 0,
      lat: glo.lat,
      lng: glo.lng,
      panicId: this.data.productDetail.product.panicId || '',
      price: this.data.productDetail.product.discountPrice,
      sessionid: glo.sessionId,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    };
    if (flag) {
      let a = '',b = ''
      this.data.attrSelect.forEach((v,i)=>{
        if (i == this.data.attrSelect.length - 1) {
          a = `${v.id}:${v.attr_value_list[v.currentIndex].id}`
        } else {
          a = `${v.id}:${v.attr_value_list[v.currentIndex].id};`
        }
        b += a
      })
      params.attrIds = b
      if (this.data.productDetail.product.panic){
        params.productType = 8
      }else{
        params.productType = 1
      }
      console.log(params)
      let encStr = glo.mm.encrypt(params)
      glo.mm.request('/trade/postCart', { param: encStr }, 'POST', res => {
        console.log(res)
        if(res.data.success){
          wx.showToast({ title: res.data.msg, duration: 2000 })
        }
      })
    }else{
      wx.showToast({ title: `请选择${this.data.attrSelect[ind].attrName}`, duration: 2000 })
    }
    
  },
  confirmOrder(){  // 确认订单
    let flag = true, ind = 0;
    this.data.attrSelect.forEach((v, i) => {
      if (!v.hasOwnProperty('currentIndex')) {
        flag = false
        ind = i
      }
    })
    let data = {
      catId: this.data.productDetail.product.shop.catId || '',
      title: this.data.productDetail.product.title,
      productId: this.data.productDetail.product.id,
      shopId: this.data.productDetail.product.shop_id,
      shopName: this.data.productDetail.product.shop.name,
      number: this.data.number,
      price: this.data.productDetail.product.salePrice,
      image: this.data.productDetail.product.images[0].url
    };
    if (flag) {
      let a = '', b = '',c='',d=''
      this.data.attrSelect.forEach((v, i) => {
        if (i == this.data.attrSelect.length - 1) {
          a = `${v.id}:${v.attr_value_list[v.currentIndex].id}`
          c = `${v.attrName}:${v.attr_value_list[v.currentIndex].valueName}`
        } else {
          a = `${v.id}:${v.attr_value_list[v.currentIndex].id};`
          c = `${v.attrName}:${v.attr_value_list[v.currentIndex].valueName};`
        }
        b += a
        d += c
      })
      data.attrIds = b
      data.attrValues = d
      if (this.data.productDetail.product.panic) {
        data.productType = 8
      } else {
        data.productType = 1
      }
      console.log(data)
      wx.setStorage({key: 'detConfirm',data: data})
      wx.navigateTo({
        url: `../confirmOrder/confirmOrder?id=detail`
      })
    }else{
      wx.showToast({ title: `请选择${this.data.attrSelect[ind].attrName}`, duration: 2000 })
    }
  },
  PanicBuyTip() {  //点击提醒
    let panicId = this.data.productDetail.product.panicId
    if (this.data.productDetail.product.setTip) {
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
          this.getDetail(this.data.productDetail.product.id, this.data.productDetail.product.panicId)
          wx.showToast({ title: res.data.msg, duration: 1000 })
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
          this.getDetail(this.data.productDetail.product.id, this.data.productDetail.product.panicId)
          wx.showToast({ title: res.data.msg, duration: 1000 })
        } else {
          wx.showToast({ title: res.data.msg, duration: 1000 })
        }
      })
    }
  },
  RecommendProducts(){ //相关推荐
    let params = {
      lat: glo.lat,
      lng: glo.lng,
      pageIndex: 0,
      pageSize: 10,
      shopId: this.data.productDetail.product.shop_id,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    }
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/shopping/queryShopRecommendProducts', { param: encStr }, 'POST', res => {
      console.log('RecommendProducts', res)
      if(res.data.success){
        this.setData({ RecommendProducts: res.data.product_list})
      }
    })
  },
})