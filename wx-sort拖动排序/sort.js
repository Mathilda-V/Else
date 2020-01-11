var app = getApp();
var x, y, x1, y1, x2, y2;
Page({
  data: {
    all_list: [{ id: 1, text: '推荐' }, { id: 2, text: 'logo设计' }, { id: 3, text: 'ui设计' }, { id: 4, text: 'css设计' }, { id: 5, text: 'js设计' }, { id: 6, text: '装修设计' }, { id: 7, text: '圣诞树1' }, { id: 8, text: '圣诞树2' }, { id: 9, text: '圣诞树3' }, { id: 10, text: '圣诞树4' }, { id: 11, text: '圣诞树5' }, { id: 12, text: '圣诞树6' }, { id: 13, text: '圣诞树7' }, { id: 14, text: '圣诞树8' }, { id: 15, text: '圣诞树9' }, { id: 16, text: '圣诞树10' }, { id: 17, text: '圣诞树11' }, { id: 18, text: '圣诞树12' }, { id: 19, text: '圣诞树13' }, { id: 20, text: '圣诞树14' }, { id: 21, text: '圣诞树15' }, { id: 22, text: '圣诞树16' }, { id: 23, text: '圣诞树17' }, { id: 24, text: '圣诞树18' }, { id: 25, text: '圣诞树19' }, { id: 26, text: '家装修' }],//已经增加的列表
    current:-1,
    s_v:10,
    s_h:10,
    u_w:90,
    u_h:30,
    all_width:'',//总的宽度
    move_x:'',move_y:''
  },
  onLoad: function () {
    var self=this;
    wx.getSystemInfo({
      success: function (res) {
        var width = self.data.all_width=res.windowWidth,_w=0,row=0,column=0;
        var arr=[].concat(self.data.all_list)
        arr.forEach(function(n,i){
          n.left = (self.data.u_w + self.data.s_h) * row + self.data.s_h;
          n.top = (self.data.u_h + self.data.s_v) * column + self.data.s_v;
          n._left = n.left;
          n._top = n.top;
          _w += self.data.u_w+self.data.s_h;
          if (_w+self.data.u_w+self.data.s_h > width){
            _w=0;
            row=0;
            column++;
          }else{
            row++;
          }
          
        });
        console.log(arr);
        self.setData({
          all_list: arr
        })
      }
    });
  },
  movestart: function (e) {
    // console.log('start');
    // currindex = e.target.dataset.index;
    // this.data.current = e.target.dataset.index;
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
    x1 = e.currentTarget.offsetLeft;
    y1 = e.currentTarget.offsetTop;
    // var arr = [].concat(this.data.all_list);
    // arr.forEach(function(n,i){
    //   n._class='move';
    //   n._style='';
    // });
    this.setData({
      current: e.target.dataset.index,
      move_x:x1,
      move_y:y1
    });
  },
  move: function (e) {
    var self=this;
    // // console.log('move',e.target.dataset.current);
    x2 = e.touches[0].clientX - x + x1;
    y2 = e.touches[0].clientY - y + y1;
    // // this.setData({
    // //   current: currindex,
    // //   start: { x: x2, y: y2 }
    // // })
    var underIndex = this.getCurrnetUnderIndex();
   
    // var now_current=this.data.current;
    if (underIndex != null && underIndex != this.data.current) {
      var arr = [].concat(this.data.all_list);
      this.changeArrayData(arr, underIndex, this.data.current);
      // console.log(underIndex);
      // now_current = underIndex;
      this.setData({
        all_list: arr,
        current: underIndex
      })
    }
    // console.log(self.data.current,arr);

    
    this.setData({
      move_x: x2,
      move_y:y2
    });
  },
  moveend: function (e) {
    
    
    
    
    this.setData({
      current: -1,
    })
  },
  changeArrayData:function(arr,i1,i2){
    var temp=arr[i1];
    arr[i1] = arr[i2];
    arr[i2]=temp;

    var _left=arr[i1]._left,_top=arr[i1]._top;
    arr[i1]._left=arr[i2]._left;
    arr[i1]._top = arr[i2]._top;
    arr[i2]._left = _left;
    arr[i2]._top = _top;

    var left = arr[i1].left, top = arr[i1].top;
    arr[i1].left = arr[i2].left;
    arr[i1].top = arr[i2].top;
    arr[i2].left = left;
    arr[i2].top = top;

  },
  getCurrnetUnderIndex:function(endx,endy){//获取当前移动下方index
    var endx = x2 + this.data.u_w / 2,
      endy = y2 + this.data.u_h / 2;
    var v_judge=false,h_judge=false,column_num=(this.data.all_width-this.data.s_h)/(this.data.s_h+this.data.u_w)>>0;
    // console.log(endx,endy);
    var _column = (endy - this.data.s_v) / (this.data.u_h + this.data.s_v) >> 0;
    var min_top = this.data.s_v + (_column) * (this.data.u_h + this.data.s_v),
      max_top = min_top + this.data.u_h;
    // console.log('v', _column, endy, min_top, max_top);
    if (endy > min_top && endy < max_top) {
      v_judge=true;
    } 
    var _row = (endx - this.data.s_h) / (this.data.u_w + this.data.s_h) >> 0;
    var min_left = this.data.s_h + (_row) * (this.data.u_w + this.data.s_h),
      max_left = min_left + this.data.u_w;
    // console.log('x', _row, endx, min_left, max_left);
    if (endx > min_left && endx < max_left) {
      h_judge=true;
    } 
    if(v_judge&&h_judge){
      var index = _column * column_num + _row;
      if(index>this.data.all_list.length-1){//超过了
        return null;
      }else{
        return index;
      }
    }else{
      return null;
    }
  }
})