/*
 * @Author: wuwudi
 * @Date: 2018-08-21 10:48:39
 * @LastEditors: wuwudi
 * @LastEditTime: 2018-08-21 17:38:15
 */
const glo = getApp().globalData
const { countDownDate } = require('../../../utils/dateUtil.js')

Page({
  data: {
    taskMenu: [],
    taskList: [],
    currentIndex: 0,
    currentMenu: '',
    cateId: '',
    timer: 0,
    pageIndex: 0
  },
  onLoad(){
    this.getTaskMenu()
  },
  onUnload() {
    clearTimeout(this.data.timer)
  },
  onPullDownRefresh(){
    this.getTaskList(this.data.cateId)
  },
  onReachBottom(){
    this.getTaskList(this.data.cateId, ++this.data.pageIndex)
  },
  getTaskMenu(){
    let params = {
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    }
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/task/getTaskMenuList', { param: encStr }, 'POST', res => {
      res.data.success && this.setData({taskMenu: res.data.task_cat_list})
      this.data.cateId = this.data.taskMenu[0].id
      // this.data.currentMenu = this.data.taskMenu[0].name
      this.setData({currentMenu: this.data.taskMenu[0].name})
      wx.showLoading({ title: '加载中...' })
      this.getTaskList(this.data.cateId)
    })
  },
  getTaskList(cateId, pageIndex = 0){
    let params = {
      catId: cateId,
      pageIndex: pageIndex,
      pageSize: 10,
      version: glo.ver.versionNo,
      deviceType: glo.deviceType
    }
    let encStr = glo.mm.encrypt(params)
    glo.mm.request('/task/getTaskInfoList', { param: encStr }, 'POST', res => {
      if(pageIndex == 0) {
        console.log('1', res)
        if(res.data.success) {
          this.data.taskList.length && this.data.taskList.splice(0, this.data.taskList.length)
          this.countDown(res.data.task_list)
        }else {
          wx.showToast({
            title: res.data.msg,
          })
        }
      } else {
        this.data.taskList = this.data.taskList.concat(res.data.task_list)
        this.countDown(this.data.taskList)
        console.log('reach', this.data.taskList)
      }
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },
  countDown(arr) {
    arr.forEach(item => {
      item.countDownTime = countDownDate(item.limitTime)
    })
    this.setData({
      taskList: arr,
      timer: setTimeout(() => {
        this.countDown(this.data.taskList)
      }, 1000)
    })
  },
  switchItem(e){
    this.setData({
      currentIndex: e.currentTarget.dataset.index, 
      currentMenu: e.currentTarget.dataset.name, 
      cateId: e.currentTarget.dataset.cateid,
    })
    if(this.data.currentIndex == 2) return
    wx.showLoading({ title: '加载中...' })
    this.getTaskList(this.data.cateId)
  },
  toTaskInfoDetail(e){
    console.log(e)
    wx.navigateTo({
      url: `earnMoneyShare/earnMoneyShare?taskId=${e.currentTarget.dataset.item.id}`
    })
  },
  toDetail(e){
    let data = JSON.stringify(e.currentTarget.dataset.product)
    wx.setStorageSync('product', data)
    wx.navigateTo({
      url: '../detail/detail'
    })
  }
})