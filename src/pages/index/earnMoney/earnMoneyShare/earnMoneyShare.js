const glo = getApp().globalData

Page({
  /**
   * 页面的初始数据
   */
  data: {
    task_info: {},
    price: '',
  },
  getTaskInfoDetail(taskId) {
    let params = {
      taskId: taskId,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    }
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/task/getTaskInfoDetail', { param: encStr }, 'POST', res => {
      console.log(res)
      if(res.data.success){
        let price = res.data.task_info.content.match(/券后【(\S*)元】包邮/)[1];
        this.setData({ task_info: res.data.task_info, price: price})
        
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTaskInfoDetail(options.taskId)
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