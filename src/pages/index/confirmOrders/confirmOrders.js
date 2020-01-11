// pages/index/confirmOrders/confirmOrders.js
const glo = getApp().globalData
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shType: ['物流发货', '线下取货'],
    TabIndex: 0,
    addr_list: [],
    addrIndex: 0,
    bussnessId: '',
    attrIds: '',
    bussnessCat: '',
    productType: 1,
    descri: '',
    list: [],
    totalAmount: ''
  },
  bindTab(e) {
    this.setData({ TabIndex: e.currentTarget.dataset.index })
  },
  getReceAddrList() { //获取默认地址
    let params = {
      sessionid: glo.sessionId,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    };
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/trade/getReceAddrList', { param: encStr }, 'POST', res => {
      if (res.data.success) {
        this.setData({ addr_list: res.data.addr_list })
        res.data.addr_list.forEach((e, i) => {
          if (e.receDefault == 1) {
            this.setData({ addrIndex: i })
          }
        })

      }
    })
  },
  toAddmanage() {  //更换地址
    wx.navigateTo({
      url: `../../center/addmanage/addmanage?flag=true`
    })
  },
  bindAdd() {
    if (this.data.number == 1) {
      this.setData({ number: 1 })
    } else {
      this.setData({ number: this.data.number - 1 })
    }
  },
  bindReduct() {
    this.setData({ number: this.data.number + 1 })
  },
  bindTextAreaBlur(e) {
    this.setData({ descri: e.detail.value })
  },
  postOrder() { //提交订单
    let a = this.data
    let params = {
      lat: glo.lat,
      lng: glo.lng,
      sessionid: glo.sessionId,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    };
    console.log('a', a)
    // params.orders = JSON.stringify([  {
    //   descri: '', "productType": "1", receName: "ce", userId: "201703201657227057", price: "239", taskId: "", accountType: "1", orderDetails: [{ number: "1", productType: "1", bussnessCat: "201704121556187206", shopId: "201705211819307703", bussnessId: "201707080931502958", price: "239", attrIds: "201711041127157106:201711041127153888;201711041127146996:201711041127145746" }], eventMode: "10", receAddr: "湖北省", receMobile: "13260547620" }]);  
    params.orders = JSON.stringify([{ descri: a.descri, productType: a.productType.toString(), receName: 'a', userId: glo.userId, price: a.price, taskId: '', accountType: (a.TabIndex + 1).toString(), orderDetails: [{ number: a.number.toString(), productType: a.productType.toString(), bussnessCat: a.bussnessCat, shopId: a.shopId, bussnessId: a.bussnessId, price: a.price, attrIds: a.attrIds }], eventMode: '10', receAddr: '湖北省湖北省湖北省', receMobile: a.addr_list[a.addrIndex].receMobile }])
    console.log('params.orders', params.orders)

    let encStr = glo.mm.encrypt(params);
    console.log(encStr)
    // let ss = glo.mm.uncrypt(encStr)
    // console.log(ss)
    glo.mm.request('/trade/order/postOrder', { param: encStr }, 'POST', res => {
      console.log(res)
      if (res.data.success) {
        
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.getReceAddrList()
    var e = JSON.parse(options.info).info
    console.log(e)
    this.setData ({
      list: e,
      totalAmount: options.price
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