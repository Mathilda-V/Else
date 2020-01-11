const glo = getApp().globalData

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabText: '宝贝',
    tabShow: false,
    keyword: '',
    pageIndex1: 0,
    pageIndex2: 0,
    product_list: [],
    shop_list: []
  },
  bindTab(){
    this.setData({ tabShow:!this.data.tabShow})
  },
  bindbaobei() { 
    this.setData({ tabShow: false, tabText: '宝贝'})
  },
  binddianpu() {
    this.setData({ tabShow: false, tabText: '店铺' })
  },
  bindKeyInput(e){
    this.setData({keyword: e.detail.value})
  },
  bindSearch(){
    if (this.data.tabText == '宝贝'){
      this.getProductList(0, true)
    }else{
      this.getShopList(0, true)
    }
  },
  getProductList(pageIndex,flag) { //搜索宝贝
    let params = {
      keyword: this.data.keyword,
      pageSize: 20,
      pageIndex: pageIndex,
      lat: glo.lat,
      lng: glo.lng,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    }
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/shopping/getProductList', { param: encStr }, 'POST', res => {
      // console.log(res)
      if(res.data.success){
        if(flag){
          this.setData({ product_list: res.data.product_list })
        }else{
          this.setData({ product_list: this.data.product_list.concat(res.data.product_list) })
        }
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }else{
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.showToast({ title: res.data.msg, duration: 2000 })
      }
    })
  },
  getShopList(pageIndex, flag) { //搜索店铺
    let params = {
      keyword: this.data.keyword,
      pageSize: 20,
      pageIndex: pageIndex,
      productMode: 0,
      lat: glo.lat,
      lng: glo.lng,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    }
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/shopping/getShopList', { param: encStr }, 'POST', res => {
      // console.log(res)
      if (res.data.success) {
        if(flag){
          this.setData({ shop_list: res.data.shop_list })
        }else{
          this.setData({ shop_list: this.data.shop_list.concat(res.data.shop_list) })
        }
        this.data.shop_list.forEach((e,i)=>{
          if(e.logo == 0){
            e.shopLogo = '/static/img/rx.png'
          }else{
            e.shopLogo =  e.logo
          }
        })
        this.setData({ shop_list: this.data.shop_list})
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      } else {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.showToast({ title: res.data.msg, duration: 2000 })
      }
    })
  },
  toDetail(e) { 
    console.log(e)
    wx.navigateTo({
      url: `../detail/detail?id=${e.currentTarget.dataset.item.id}&panicId=`
    })
  },
  toGoodsShop() { 
    wx.navigateTo({
      // url: `../detail/detail?id=${e.currentTarget.dataset.product.product_id}&panicId=${e.currentTarget.dataset.product.id}`
    })
  },
  toShop(){
    wx.navigateTo({
      // url: `../detail/detail?id=${e.currentTarget.dataset.product.product_id}&panicId=${e.currentTarget.dataset.product.id}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    wx.showLoading({ title: '刷新重载中' })
    if (this.data.tabText == '宝贝') {
      this.getProductList(0, true)
      this.setData({ pageIndex1: 0, product_list: [] })
    } else {
      this.getShopList(0, true)
      this.setData({ pageIndex2: 0, shop_list: [] })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({ title: '加载中...' });
    if (this.data.tabText == '宝贝') {
      this.setData({ pageIndex1: this.data.pageIndex1+1 })
      this.getProductList(this.data.pageIndex1, false)
      
    } else {
      this.setData({ pageIndex2: this.data.pageIndex2+1 })
      this.getShopList(this.data.pageIndex2, false)
      
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})