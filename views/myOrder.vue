<template>
  <div>
    <navbar :title="title" :showBack="true"></navbar>
    <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
    <scroller :class="['scroller', currentOrderInfo.length ? '' : 'orderlist']" show-scrollbar="false" >
    <!-- <scroller class="scroller" show-scrollbar="false"> -->
      <image :src="noOrder" class="no-item" v-if="!currentOrderInfo.length"></image>
      <div class="item" v-for="item in currentOrderInfo" v-else>
        <div class="item-con" @click="openDetail(item)">
          <div class="con-pic">
            <image style="width:150px;height:150px;" :src="item.buy_goodpic_url" resize="contain"></image>
          </div>
          <div class="con-detail">
            <text class="title-ui de-title">{{item.title}}</text>
            <text class="select-ui">{{item.good_spec}}</text>
            <div class="de-num">
              <div class="num-price">
                <text class="price-ui">¥ {{parseFloat(item.amount / item.buy_count)}}元</text>
              </div>
              <!-- <text class="per-ui">x{{item.buy_count}}</text> -->
              <text class="status-ui" v-if="item.pay_status === '0'">待付款</text>
              <text class="status-ui" v-else-if="item.pay_status === '1'">已付款</text>
              <text class="status-ui" v-else-if="item.pay_status === '2'">支付失败</text>
              <text class="status-ui" v-else-if="item.pay_status === '3'">已退款</text>
            </div>
          </div>
        </div>
        <div class="item-else">
          <text class="status-ui" v-if="item.order_status === '0'">待发货</text>
          <text class="status-ui" v-else-if="item.order_status === '1'">已发货</text>
          <text class="status-ui" v-else-if="item.order_status === '2'">待签收</text>
          <text class="status-ui" v-else-if="item.order_status === '3'">已签收</text>
          <div class="row">
            <text class="status1-ui">共 {{item.buy_count}} 件商品 合计：¥ {{item.amount}}</text>
            <text v-if="item.pay_status === '1'" :class="[item.order_status == '3' ? 'confirmed': 'confirm-ship']" @click="confirmShip(item)">{{item.order_status == '3' ? '交易完成' : '确认收货'}}</text>
          </div>
        </div>
      </div>
      <dialog
        :show="dialogShow"
        :title="dialogTitle"
        :content="content" 
        @toCancle="dialogClose"
        @toConfirm="dialogConfirm">
      </dialog>
    </scroller>
  </div>
</template>
<script>
  const storage = weex.requireModule('storage')
  const modal = weex.requireModule('modal')
  import Navbar from 'base/navbar'
  import Switches from 'base/switches'
  import Dialog from 'base/dialog'
  import Util from "common/js/util"
  import { NO_ORDER } from 'common/js/icon-type'

  export default {
    mixins: [Util],
    data() {
      return {
        noOrder: NO_ORDER,
        title: '我的订单',
        switches: [{ name: '全部订单' }, { name: '待发货' }, { name: '待签收' }],
        orderAll: [],
        currentIndex: 0,
        currentOrderInfo: [],
        currentId: '',
        dialogShow: false,
        dialogTitle:'确认收货？',
        content: ''
      }
    },
    created() {
      storage.getItem('index', e => {
        if (e.result === 'success') {
          this.currentIndex = JSON.parse(e.data)
          this.getOrder(this.currentIndex)
        }
      })
    },
    methods: {
      getOrder(i) {
        this.post('order', 'getOrders', {}, res => {
          if (res.success) {
            this.orderAll = res.data
            this.switchItem(i)
            // console.log(this.orderAll);
          }
        })
      },
      switchItem(index) {
        this.currentIndex = index
        if (index === 1) {
          this.currentOrderInfo = this.getData('0')
        } else if (index === 2) {
          this.currentOrderInfo = this.getData('2')
        } else {
          this.currentOrderInfo = this.orderAll
        }
      },
      loadmor(){
        getOrder(this.currentIndex);
      },
      getData(status){
        let arr = []
        this.orderAll.forEach(item => {
          if (item.order_status === status) {
            arr.push(item)
          }
        })
        return arr
      },
      openDetail(item) {
        if(item.pay_status == '2') return
        storage.setItem('orderInfo', JSON.stringify(item), e => {
          if (e.result === 'success') {
            this.open('orderDetail', 'true', () => {})
          }
        })
      },
      confirmShip(item) {
        const { id, title, order_status } = item
        if (order_status == '3') return
        this.currentId = id
        this.content = title
        this.dialogShow = true
      },
      dialogClose() {
        this.dialogShow = false
      },
      dialogConfirm() {
        this.post('order', 'signIn', { id: this.currentId }, res => {
          if (res.success) {
            modal.toast({
              message: '您已确认收货！',
              duration: 0.3
            })
            this.getOrder(this.currentIndex)
          } else {
            modal.toast({
              message: '确认收货失败',
              duration: 0.3
            })
          }
        })
        this.dialogShow = false
      }
    },
    components: {
      Navbar,
      Switches,
      Dialog
    }
  }
</script>
<style scoped>
  .scroller {
    background-color: #f4f4f4;
    width: 750px;
  }

  .orderlist {
    justify-content: center;
    align-items: center;
  }

  .item {
    padding: 20px 20px 0 20px;
    margin-bottom: 20px;
    background-color: #ffffff;
  }

  .item-con {
    padding: 20px 10px;
    flex-direction: row;
  }

  .no-item {
    width: 300px;
    height: 300px;
  }

  .con-pic {
    width: 151px;
    height: 151px;
    background-color: #eeeeee;
    margin-right: 20px;
  }

  .con-detail {
    width: 520px;
    padding-left: 20px;
  }

  .de-title {
    height: 80px;
    color: #333333;
  }

  .title-ui {
    font-size: 26px;
  }

  .select-ui {
    font-size: 26px;
    color: #999999;
  }

  .de-num {
    flex-direction: row;
    justify-content: space-between;
    padding-top: 10px;
  }

  .num-price {
    flex-direction: row;
  }

  .price-ui {
    font-size: 24px;
    color: #969696;
  }

  .price-ui1 {
    padding-left: 10px;
    font-size: 22px;
    color: #969696;
    text-decoration: line-through;
  }

  .per-ui {
    color: #969696;
  }

  .item-else {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    border-top-width: 1px;
    border-top-style: dashed;
    border-top-color: #eeeeee;
  }

  .status-ui {
    color: #f56a33;
    font-size: 24px;
  }

  .status1-ui {
    color: #666;
    font-size: 24px;
  }

  .row {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .confirm-ship {
    font-size: 24px;
    padding: 0 10px;
    line-height: 50px;
    height: 50px;
    margin-left: 20px;
    border-width: 1px;
    border-style: solid;
    border-color: #f24561;
    color: #f24561;
    border-radius: 8px;
  }
  .confirmed{
    font-size: 24px;
    padding: 0 10px;
    line-height: 50px;
    height: 50px;
    margin-left: 20px;
    border-width: 1px;
    border-style: solid;
    border-color: #969696;
    color: #969696;
    border-radius: 8px;
  }
  .confirm-ship:active {
    background-color: #f24561;
    color: white;
  }
</style>