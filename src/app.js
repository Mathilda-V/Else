const _mm = require('/utils/mm.js')
var amapFile = require('/utils/amap-wx.js');
App({
  globalData: {
    loginState: false,
    userId: '201703201657227057',
    sessionId: '',
    openId: '',
    sessionKey: '',
    deviceType: 0,
    mm: _mm,
    ver: { versionNo: '1.0.0'},
    map: {},
    lat: 0,
    lng: 0,
    PhoneNumber: ''
  },
  onLaunch (){
    this.getDeviceType()
    // this.getVersion()
    this.getRegeo()
    this.getSessionid()
  },
  
  getDeviceType(){ //检测手机系统
    try {
      let res = wx.getSystemInfoSync()
      this.globalData.deviceType = res.system.includes('iOS') ? 1 :  0
    } catch (error) {
      console.log(error)
    }
  },
  getVersion(){  //获取版本
    let params = { deviceType: this.globalData.deviceType };
    let encStr = this.globalData.mm.encrypt(params)
    this.globalData.mm.request('/common/version/getLastVesion', { param: encStr }, 'post', res => {
      if(res.data.success){
        this.globalData.ver = res.data.version
      }
    })
  },
  getRegeo() { //定位
    let myAmapFun = new amapFile.AMapWX({ key: '1bae3c2f4c503dbbe326989a184a2f7d' });
    myAmapFun.getRegeo({
      success: (res)=> {
        this.globalData.map = res[0]
        this.globalData.lat = res[0].latitude
        this.globalData.lng = res[0].longitude
      }
    })
  },
  getSessionid() {  //获取最新sessionid
    let that = this
    wx.getStorage({
      key: 'PhoneNumber',
      success: function(res) {
        that.globalData.PhoneNumber = res.data
      },
    })
    let params = { mobile: this.globalData.PhoneNumber || '15072478951'  };
    console.log(params)
    let encStr = this.globalData.mm.encrypt(params)
    this.globalData.mm.request('/user/getSessionid', { param: encStr }, 'post', res => {
      console.log('获取最新sessionid',res)
      if (res.data.success) {
        this.globalData.sessionId = res.data.user_info.sessionid
        this.globalData.userId = res.data.user_info.id
        this.globalData.openId = res.data.user_info.wxOpenId
        this.globalData.loginState = true
      }else{
        this.globalData.loginState = false
      }
    })
  },
})