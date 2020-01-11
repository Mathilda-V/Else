<template>
    <div>
        <navbar :title="title" ></navbar>
        <scroller class="pay">
            <div class="detail">
                <div class="pay-type">
                    <image  :src="payImg[2]" resize="cover" style="width:60px;height:60px" />
                    <text class="pay-txt">支付成功</text>
                </div>
                <div class="pay-number">
                    <text class="pay-num">实付￥{{amount}}</text>
                </div>
            </div>
            <div class="back white" @click="index">
                <text class="txt">返回首页</text>
            </div>
            <div class="examine white" @click="myOrder">
                <text class="txt">查看订单</text>
            </div>
        </scroller>
    </div>
</template>
<script>
    const storage = weex.requireModule("storage");
    const modal=weex.requireModule("modal");
    import Navbar from 'base/navbar'
    import Util from "common/js/util"
    import { PAY } from 'common/js/icon-type'    
    
    export default {
        mixins:[Util],
        data(){
            return{
                payImg: PAY,
                title: '支付详情',
                amount:'222'
            }
        },
        created(){
            // storage.getItem('totalAmount',e=>{
            //     this.amount = JSON.parse(e.data).amount
            // })
        },
        methods: {
            index(){
                this.close('true',()=>{})
                const Steve = new BroadcastChannel('pay')
                Steve.postMessage('success')
            },
            myOrder(){
                this.open('myOrder','true',()=>{})
                this.close('true',()=>{})
                const Steve = new BroadcastChannel('pay')
                Steve.postMessage('success')
            }
        },
        components: {
            Navbar
        }
    }
</script>
<style scoped>
    .pay{
        width: 750px;
        background-color: #ededed;
    }
    .detail{
        padding:150px;
    }
    .pay-type,.pay-number{
        flex-direction: row;
        justify-content: center;
    }
    .pay-txt{
        line-height: 60px;
        font-size: 45px;
        color: #333333;
        margin-left: 30px;
    }
    .pay-number{
        margin-top: 50px;
    }
    .pay-num{
        line-height: 60px;
        font-size: 32px;
        color: #666666;
    }
    .white{
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .txt{
        width: 710px;
        font-size: 30px;
        color: #FFFFFF;
        font-weight: 400;
        line-height: 90px;
        text-align: center;
        border-radius: 10px;
        background-color: #f56a33;
    }
</style>
