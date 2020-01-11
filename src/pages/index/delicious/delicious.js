// pages/food/food.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg'
    ],
    indicatorDots: [true, true],
    indicatorActiveColor: '#ff5a23',
    autoplay: [true, true],
    circular: [true, true],
    interval: 5000,
    duration: 1000,
    icon: [{ txt: "自助餐" },
            { txt: "小吃快餐" },
            { txt: "生日快餐" },
            { txt: "川菜" },
            { txt: "火锅" },
            { txt: "甜品饮料" },
            { txt: "烧肉烧烤" },
            { txt: "海鲜" }
    ],
    topic:['美食','附近','智能排序','筛选'],
    scroll: true,
    content: {},
    sort: [],
    foodType: [],
    filter: {
      discount: [
        { title: '优惠', code: 'discount-0', value: '买单', checked: false },
        { title: '优惠', code: 'discount-1', value: '团购', checked: true },
        { title: '优惠', code: 'discount-2', value: '立减返券', checked: true },
        { title: '优惠', code: 'discount-3', value: '促销', checked: true }
      ],
      service: [
        { title: '服务', code: 'service-0', value: '预定', checked: false },
        { title: '服务', code: 'service-1', value: '排队', checked: true },
        { title: '服务', code: 'service-2', value: '点餐', checked: true },
        { title: '服务', code: 'service-3', value: '外卖', checked: true }
      ],
      price: [
        { title: '价格', code: 'price-0', value: '50以下', checked: false },
        { title: '价格', code: 'price-1', value: '50-100', checked: true },
        { title: '价格', code: 'price-2', value: '100-300', checked: true },
        { title: '价格', code: 'price-3', value: '300以上', checked: true },
      ],
      more: [
        { title: '更多', code: 'more-0', value: '新店', checked: false },
        { title: '更多', code: 'more-1', value: '营业中', checked: true },
        { title: '更多', code: 'more-2', value: '有Wi-Fi', checked: true },
        { title: '更多', code: 'more-3', value: '可停车', checked: true },
      ]
    },
    nearbyopen: false,
    nearbyshow: false,
    foodopen: false,
    foodshow: false,
    sortopen: false,
    sortshow: false,
    filteropen: false,
    filtershow: false,
    isfull: false,
    nearbyright: {},
    shownavindex: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sort: ['智能排序', '离我最近', '好评优先', '人气最高'],
      foodType: ['全部美食', '外卖', '酒店', '休闲娱乐', '快餐小吃', '火锅', '川湘菜', '小吃甜品', '西餐', '其它美食'],
      nearbyleft: {
        "附近": ["1km", "3km", "5km", "10km", "全城"],
        "推荐商圈": ["商圈一", "商圈二", "商圈三", "商圈四", "商圈五"],
        "蔡甸区": ["商圈一", "商圈二", "商圈三", "商圈四", "商圈五"],
        "东西湖区": ["东西湖区商圈一", "东西湖区商圈二", "东西湖区商圈三", "东西湖区商圈四", "东西湖区商圈五"],
        "汉南区": ["汉南区商圈一", "汉南区商圈二", "汉南区商圈三", "汉南区商圈四", "汉南区商圈五"],
        "汉阳区": ["汉阳区商圈一", "汉阳区商圈二", "汉阳区商圈三", "汉阳区商圈四", "汉阳区商圈五"],
        "洪山区": ["洪山区商圈一", "洪山区商圈二", "洪山区商圈三", "洪山区商圈四", "洪山区商圈五"],
        "黄陂区": ["商圈一", "商圈二", "商圈三", "商圈四", "商圈五"],
        "江岸区": ["商圈一", "商圈二", "商圈三", "商圈四", "商圈五"],
        "江汉区": ["商圈一", "商圈二", "商圈三", "商圈四", "商圈五"],
        "江夏区": ["商圈一", "商圈二", "商圈三", "商圈四", "商圈五"],
        "硚口区": ["商圈一", "商圈二", "商圈三", "商圈四", "商圈五"],
        "青山区": ["商圈一", "商圈二", "商圈三", "商圈四", "商圈五"],
        "武昌区": ["商圈一", "商圈二", "商圈三", "商圈四", "商圈五"],
        "新洲区": ["商圈一", "商圈二", "商圈三", "商圈四", "商圈五"]
      }
    })
  },

  checked: function (e) {
    var id = e.target.id;
    var t = id.slice(0, id.indexOf('-'));
    var idx = parseInt(id.slice(id.indexOf('-') + 1));
    var checked = 'filter.' + t + '[' + idx + '].checked';
    this.setData({
      [checked]: !(this.data.filter[t][idx].checked)
    });
  },
  nearby: function (e) {
    if (this.data.nearbyopen) {
      this.setData({
        nearbyopen: false,
        nearbyshow: false,
        foodopen: false,
        foodshow: true,
        sortopen: false,
        sortshow: true,
        filteropen: false,
        filtershow: true,
        isfull: false,
        shownavindex: 0,
        scroll: true
      })
    } else {
      this.setData({
        nearbyopen: true,
        nearbyshow: false,
        foodopen: false,
        foodshow: true,
        sortopen: false,
        sortshow: true,
        filteropen: false,
        filtershow: true,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav,
        scroll: false
      })
    }
  },
  food: function (e) {
    if (this.data.foodopen) {
      this.setData({
        foodopen: false,
        foodshow: false,
        nearbyopen: false,
        nearbyshow: true,
        sortopen: false,
        sortshow: true,
        filteropen: false,
        filtershow: true,
        isfull: false,
        shownavindex: 0,
        scroll: true
      })
    } else {
      this.setData({
        foodType: this.data.foodType,
        foodopen: true,
        foodshow: false,
        nearbyopen: false,
        nearbyshow: true,
        sortopen: false,
        sortshow: true,
        filteropen: false,
        filtershow: true,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav,
        scroll: false
      })
    }
  },
  sort: function (e) {
    if (this.data.sortopen) {
      this.setData({
        sortopen: false,
        sortshow: false,
        nearbyopen: false,
        nearbyshow: true,
        filteropen: false,
        filtershow: true,
        foodopen: false,
        foodshow: true,
        isfull: false,
        shownavindex: 0,
        scroll: true
      })
    } else {
      this.setData({
        content: this.data.sort,
        sortopen: true,
        sortshow: false,
        nearbyopen: false,
        nearbyshow: true,
        filteropen: false,
        filtershow: true,
        foodopen: false,
        foodshow: true,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav,
        scroll: false
      })
    }
  },
  filter: function (e) {
    if (this.data.filteropen) {
      this.setData({
        filteropen: false,
        filtershow: false,
        nearbyopen: false,
        nearbyshow: true,
        foodopen: false,
        foodshow: true,
        sortopen: false,
        sortshow: true,
        isfull: false,
        shownavindex: 0,
        scroll: true
      })
    } else {
      this.setData({
        content: this.data.filter,
        filteropen: true,
        filtershow: false,
        nearbyopen: false,
        nearbyshow: true,
        foodopen: false,
        foodshow: true,
        sortopen: false,
        sortshow: true,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav,
        scroll: false
      })
    }
  },
  selectleft: function (e) {
    this.setData({
      nearbyright: this.data.nearbyleft[e.currentTarget.dataset.city]
    });
  },
  hidebg: function (e) {
    this.setData({
      nearbyopen: false,
      nearbyshow: true,
      foodopen: false,
      foodshow: true,
      sortopen: false,
      sortshow: true,
      filteropen: false,
      filtershow: true,
      isfull: false,
      shownavindex: 0,
      scroll: true
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