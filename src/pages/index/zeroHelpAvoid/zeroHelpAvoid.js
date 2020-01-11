const glo = getApp().globalData
const { countDownDate } = require('../../../utils/dateUtil.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 0,
    activity_list: [],
    timer: 0
  },
  getData(pageIndex,flag) {
    let params = {
      pageIndex: pageIndex,
      pageSize: 20,
      sessionid: glo.sessionId,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    };
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/shop/assis/activityList', { param: encStr }, 'POST', res => {
      console.log(res)
      if (res.data.success) {
        console.log(res)
        if (flag){
          this.setData({ activity_list: res.data.activity_list})
          this.countDown(this.data.activity_list)
        }else{
          this.setData({ activity_list: this.data.activity_list.concat(res.data.activity_list) })
          this.countDown(this.data.activity_list)
        }
        
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }else{
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.showToast({
          title: res.data.msg,
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      }
    })
  },
  countDown(arr) {
    arr.forEach(item => {
      item.countDownTime = countDownDate(item.end_time).replace(/天/g, '天 ')
      item.statusText = this._filter(item.status)
    })
    this.setData({
      activity_list: arr,
      timer: setTimeout(() => {
        this.countDown(this.data.activity_list)
      }, 1000)
    })
  },
  _filter(status){
    let text = '',flag = ''
    switch (status){
      case '1':
        text = '0元抢'
        flag = ''
        break;
      case '2':
        text = '已参与'
        flag = 'active'
        break;
      default:
        text = '已结束'
        flag = 'end'
    }
    return text
  },
  toDetail(){
    wx.navigateTo({
      url: 'zeroSnatch/zeroSnatch'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(this.data.pageIndex,true)
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
    this.countDown(this.data.activity_list)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearTimeout(this.data.timer)
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
    this.setData({ pageIndex: 0, activity_list:[] })
    this.getData(this.data.pageIndex, true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({title:'加载中...'});
    this.setData({ pageIndex: this.data.pageIndex+1})
    this.getData(this.data.pageIndex,false)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})