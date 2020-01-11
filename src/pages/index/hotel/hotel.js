// pages/hotel/hotel.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true, 
    indicatorActiveColor: '#ff8b00',
    autoplay: true,
    circular: true,
    interval: 5000,
    duration: 1000,
    icon: [{ txt: "高端酒店" },
          { txt: "经济连锁" },
          { txt: "情侣酒店" },
          { txt: "钟点房" },
    ],
    topic: ['附近', '星级/价格', '智能排序', '筛选'],
    tabTit: ['全日房','钟点房'],
    tabIndex: 0
  },
  /**
   * 事件处理
   */
  bindTab(e) {
    this.setData({ tabIndex: e.target.dataset.index });
    if (this.data.tabIndex == 0) {
        this.setData({ all: true });
    }else{
      this.setData({ all: false });
    }
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