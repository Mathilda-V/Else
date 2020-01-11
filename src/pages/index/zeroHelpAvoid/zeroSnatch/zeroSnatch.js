const glo = getApp().globalData
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    assis_detail_info: {},
    level_ratio_list: []
  },
  getData(){
    this.getAssisActivityUsers()
    this.getLevelAndPrices()
    this.getActivityRule()
    this.getActivityDetail()
  },
  getAssisActivityUsers() { //获取当前助力活动参与人数列表
    let params = {
      assisActiveId: '201812221904195068',
      pageSize: 10,
      pageIndex: 0,
      // sessionid: glo.sessionId,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    };
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/shop/assis/getAssisActivityUsers', { param: encStr }, 'POST', res => {
      console.log('助力活动参与人数列表',res)
      if (res.data.success) {
        
      }
    })
  },
  getLevelAndPrices() {  //获取当前用户等级对应砍价信息列表
    let params = {
      // assisActiveId: '201812221904195068',
      // sessionid: glo.sessionId,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    };
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/shop/assis/getLevelAndPrices', { param: encStr }, 'POST', res => {
      console.log('用户等级对应砍价信息',res)
      if (res.data.success) {

        // this.setData({ level_ratio_list: res.data.level_ratio_list})
      }
    })
  },
  getActivityRule() { //获取当前助力活动参与规则
    let params = {
      assisActiveId: '201812221904195068'
    };
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/shop/assis/getActivityRule', { param: encStr }, 'POST', res => {
      console.log('助力活动参与规则', res)
      if (res.data.success) {

      }
    })
  },
  getActivityDetail() { //获取当前活动详情
    let params = {
      assisActiveId: '201812221904195068'
    };
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/shop/assis/getActivityDetail', { param: encStr }, 'POST', res => {
      console.log('获取当前活动详情', res)
      if (res.data.success) {
        this.setData({ assis_detail_info: res.data.assis_detail_info})
      }
    })
  },
  countDown(obj,str) {
    str = countDownDate(str)
    this.setData({
      assis_detail_info: str,
      timer: setTimeout(() => {
        this.countDown(this.data.assis_detail_info)
      }, 1000)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
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