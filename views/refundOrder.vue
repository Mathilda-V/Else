<template>
  <div>
    <navbar :title="title" :showBack="true"></navbar>
    <scroller class="item-container">
      <div class="item">
        <div v-for="item in refundAll" @click="refundToDetail(item)">
          <div class="item-con">
            <div class="con-pic">
              <image style="width:150px;height:150px;" :src="item.buy_goodpic_url"></image>
            </div>
            <div class="con-detail">
              <text class="de-title title-ui">{{item.title}}</text>
              <text class="select-ui">{{item.good_spec}}</text>
              <div class="de-num">
                <text class="price-ui">￥{{parseFloat(item.amount / item.buy_count).toFixed(2)}}</text>
                <text class="per-ui">x1</text>
              </div>
            </div>
          </div>
          <div class="item-else">
            <text class="status-ui" v-if="item.status == -1">取消退货</text>
            <text class="status-ui" v-else-if="item.status == 0">待审核</text>
            <text class="status-ui" v-else-if="item.status == 1">审核通过</text>
            <text class="status-ui" v-else-if="item.status == 2">审核不通过</text>
            <text class="status-ui" v-else-if="item.status == 3">已退款</text>
            <text class="num-ui">退款金额：¥ {{item.return_amount}}</text>
          </div>
        </div>
      </div>
      <div class="no-container" v-if="!refundAll.length">
        <image :src="noOrder" class="no-item"></image>
      </div>
    </scroller>
  </div>
</template>
<script>
  const storage = weex.requireModule('storage')
  const modal = weex.requireModule('modal')
  import Navbar from 'base/navbar'
  import Util from "common/js/util"
  import { NO_ORDER } from 'common/js/icon-type'
  export default {
    mixins: [Util],
    data() {
      return {
        noOrder: NO_ORDER,
        title: '退货订单',
        refundAll: [],
        orderInfo: {}
      }
    },
    created() {
      this.getAllRefund()
    },
    methods: {
      getAllRefund() {
        this.post('order', 'getAllReturnOrders', {}, res => {
          console.log(res)
          if (res.success) {
            this.refundAll = res.data
            console.log(this.refundAll)
          }
        })
      },
      refundToDetail(item){
        storage.setItem('orderInfo', JSON.stringify(item), e => {
          if(e.result === 'success'){
            this.open('orderDetail', 'true', () => {})
          }
        })
      }
    },
    components: {
      Navbar,
    }
  }
</script>
<style scoped>
  .item-container {
    width: 750px;
    background-color: #f4f4f4;
  }

  .item {
    padding: 20px 20px 0 20px;
    align-items: center;
  }

  .item-con {
    padding: 20px;
    background-color: #ffffff;
    flex-direction: row;
  }

  .no-container {
    width: 750px;
    height: 1200px;
    align-items: center;
    justify-content: center;
    background-color: #f4f4f4;
  }

  .no-item{
    width: 300px;
    height: 300px;
  }

  .con-pic {
    width: 150px;
    height: 150px;
    background-color: #eeeeee;
  }

  .con-detail {
    width: 520px;
    padding-left: 20px;
  }

  .de-title {
    height: 80px;
    margin-bottom: 5px;
  }

  .title-ui {
    font-size: 28px;
  }

  .select-ui {
    font-size: 26px;
    color: #999999;
  }

  .de-num {
    flex-direction: row;
    justify-content: space-between;
    padding-top: 5px;
  }

  .num-price {
    flex-direction: row;
    align-items: center;
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
    font-size: 26px;
  }

  .item-else {
    width: 710px;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 20px 20px 20px;
    background-color: #ffffff;
    margin-bottom: 12px;
  }

  .status-ui {
    color: #f56a33;
    font-size: 26px;
  }

  .num-ui {
    flex-direction: row;
    font-size: 26px;
  }
</style>