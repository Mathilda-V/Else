<template>
  <list 
    show-scrollbar="false" 
    loadmoreoffset="500" 
    @loadmore="onloadmore" 
    :style="{height:pageHeight-100+'px'}"
    ref="list"
  >
    <header class="head" >
      <div class="hg-main-con" :style="{paddingTop:statusbarHeight+20+'px'}" @click="empty()">
        <text class="hg-main-con-txt">淘宝/天猫优惠券</text>
        <div class="hg-main-con-top hg-row">
          <text class="hg-main-title">{{randNum}}</text>
          <text class="hg-mini-title">张隐藏优惠券</text>
        </div>
        <div class="hg-main-con-mid">
          <div class="hg-search" @click="sclick()">
            <text class="hg-input">输入/粘贴淘宝商品标题搜索隐藏券</text>
            <text class="hg-input1" @click="sclick()">搜</text>
          </div>
        </div>
      </div>
    </header>
    <cell>
      <div class="rs" @click="empty()">
        <text class="history-item" v-for="(a,index) in hotSearch" v-if="index>=3?false:true" @click="wordToSearch(a)">{{a}}</text>
      </div>
    </cell>
    <cell>
      <image class="img" :src="quanHelp[0]"></image>
      <image class="img" :src="quanHelp[1]"></image>
      <image class="img" :src="quanHelp[2]"></image>
      <image class="img" :src="quanHelp[3]"></image>
      <image class="img" :src="quanHelp[4]"></image>    
    </cell>
  </list>
</template>
<script>
const dom = weex.requireModule("dom");
const storage = weex.requireModule('storage');
import util from 'common/js/util'
import { QUAN_HELP } from 'common/js/icon-type'

export default {
  mixins: [util],
  props: {
    pageHeight: {
      type: Number,
      default: 1534
    }
  },
  data() {
    return {
      quanHelp: QUAN_HELP,
      pageHeight: 1234,
      listStyle: 1234,
      hotSearch: [],
      loadShow: false,
      cidList: [],
      cidWidth: 0,
    }
  },
  created() {
    storage.getItem("viewport",  (e)=> {
      if (e.result == 'success') {
        this.pageHeight = JSON.parse(e.data).deviceHeight;
      }
    });
    this.getData();
    this.getNum(1000000,2000000);    
  },
  methods: {
    getData(){
      this.post('cate','searchIndex',{},res=>{
        this.hotSearch = res.keyWord.kw.split(',')
        // this.cidList = res.cateList
        // this.cidWidth = 150*10
        // res.searchGoodList.forEach(item => {
        //   item.imgUrl = item.user_type == '1' ? mallType[0] : mallType[1]
        // })
        // this.boxes = res.searchGoodList
      })
    },
    sclick() {
      this.open('searchList', 'true', function (){})
    },
    wordToSearch(a){
      storage.setItem("searchkey", JSON.stringify({kw:a}));
      this.open('list', 'true', () => {});
    },
    empty(){},
    getNum(minNum,maxNum){
      var num;
      switch(arguments.length){ 
        case 1: 
          num= parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
          num= parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
        default: 
          num= 0; 
        break; 
      } 
      console.log(num)
      this.randNum = num;
    }
  }
}
</script>
<style scoped>
.hg-row {
  flex-direction: row;
}
.head {
  background-color: white;
}
.taobaoimg {
  width: 730px;
  height: 260px;
  background-color: #999;
  margin-top: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
  border-radius: 4px;
}
.hg-main-con {
  padding-right: 0;
  padding-bottom: 20px;
  padding-left: 0;
  background-color: #e5345f;
  text-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
}
.hg-main-con-txt{
  height: 88px;
  line-height: 88px;
  text-align: center;
  color: white;
  font-size: 34px;
}
.hg-main-con-top{
  height: 80px;
  width: 750px;
  justify-content: center;
  align-items: center;
  /* background-color: #999; */
}
.hg-main-title,
.hg-mini-title {
  text-align: center;
  text-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
  font-weight: 500;
}

.hg-main-title {
  font-size: 40px;
  color: rgb(255, 246, 174);
  margin-right: 10px;
}
.hg-right-title {
  width: 100px;
  text-align: center;
  line-height: 70px;
  font-size: 26px;
  color: rgb(255, 246, 174);
}
.hg-mini-title {
  font-size: 26px;
  color: white;
  margin-top: 8px;
}

.hg-main-con-mid{
  height: 100px;
  width: 750px;
  justify-content: center;
  align-items: center;
  /* background-color: #999; */
}
.hg-search {
  width: 670px;
  height: 80px;
  background-color: white;
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hg-input {
  width: 480px;
  height: 80px;
  line-height: 80px;
  margin-left: 30px;
  font-size: 24px;
  color: #999;
}

.hg-input1 {
  width: 70px;
  height: 70px;
  line-height: 70px;
  font-size: 26px;
  background-color: #e5345f;
  position: absolute;
  right: 5px;
  top: 5px;
  text-align: center;
  color: white;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
}

.hg-input1:active {
  background-color: #ff7d49;
}
.rs{
  flex-direction: row;
  align-items: center;
  width: 750px;
  padding: 20px;
  background-color: white;
  border-bottom-width: 1px;
  border-bottom-color: #f1f1f1;
}
.history-item{
  padding: 10px 20px;
  text-align: center;
  line-height: 30px;
  border-radius: 10px;
  margin-right: 20px;
  /* margin-bottom: 20px; */
  background-color: #f8e8e8;
  font-size: 24px;
  color: #333;
}
.con {
  padding: 20px 40px 10px 50px;
  flex-direction: row;
  justify-content: space-between;
  background-color: white;
  font-size: 24px;
  color: #e5345f;
}

.small-con-left,
.small-con-right {
  width: 345px;
  height: 80px;
  /* background-color: #ff7d49; */
  border-radius: 4px;
  /* align-items:center; */
}

.imgl {
  width: 135px;
  height: 40px;
}

.imgl1 {
  width: 135px;
  height: 80px;
  position: absolute;
  right: 50px;
  bottom: 0;
}

.com-text {
  font-size: 20px;
  color: #ccc;
  margin-top: 10px;
}

.main {
  /* margin-left: 20px; */
  /* margin-right: 20px; */
  width: 750px;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: #ffffff;
}
.small-patch {
  width: 750px;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: #ffffff;
}
.left {
  width: 375px;
  padding-left: 10px;
  padding-right: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: #eeeeee;
}
.right {
  width: 375px;
  padding-left: 5px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: #eeeeee;
}
.patch-img {
  background-color: #eeeeee;
  border-radius: 4px;
}
.intro {
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 10px;
}
.title-con {
  position: relative;
  flex-direction: row;
  align-items: center;
}
.mall-icon {
  height: 30px;
  width: 60px;
  position: absolute;
  top: 4px;
}
.intro-txt {
  lines: 2;
  font-size: 26px;
  color: #333333;
  font-weight: 400;
  line-height: 40px;
  max-width: 325px;
  height: 80px;
  text-overflow: ellipsis;
  margin-bottom: 10px;
}
.case {
  flex-direction: row;
  margin-bottom: 5px;
}
.cbse {
  margin-top: 5px;
  flex-direction: row;
  justify-content: space-between;
}
.price {
  flex-direction: row;
}
.oldpr {
  font-size: 20px;
  color: #999999;
  font-weight: 400;
  line-height: 30px;
  text-decoration: line-through;
  margin-top: 3px;
}
.symbol {
  font-size: 20px;
  color: #f24561;
  font-weight: 400;
  line-height: 30px;
  margin-top: 5px;
}
.number {
  font-size: 30px;
  color: #f24561;
  font-weight: 400;
  line-height: 30px;
  margin-right: 5px;
}
.sell-txt {
  font-size: 20px;
  color: #999999;
  font-weight: 400;
  line-height: 30px;
  margin-top: 3px;
}
.sell-txxt {
  font-size: 22px;
  color: #fff;
  font-weight: 400;
  height: 30px;
  line-height: 30px;
  background-image: linear-gradient(to left, #e5345f, #ff7d49);
  border-radius: 4px;
  padding: 0 10px;
}
.main-title {
  flex-direction: row;
}
.main-txt {
  font-size: 30px;
  color: #333333;
  font-weight: 400;
  line-height: 30px;
}
.sub-txt {
  font-size: 24px;
  color: #999999;
  font-weight: 400;
  line-height: 30px;
}
.white {
  flex-direction: row;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 15px;
  padding-bottom: 15px;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: #eeeeee;
}
.title {
  width: 750px;
  background-color: #ffffff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.center{
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 10px;
}
.climg{
  width: 30px;
  height: 30px;
  /* background-color: #cccccc; */
}
.cltext{
  font-size: 30px;
  color: #e5345f;
  margin-left: 20px;
  margin-right: 20px;
}
.fl-row{
  flex-direction: row;
  align-items: center;
}
.fltext{
  margin-left: 10px;
  font-size: 26px;
  color: #666;
}
.wrap{
  flex-direction: row;
  /* flex-wrap: wrap; */
  background-color: #ffffff;
  width: 750px;
  height: 150px;
}
.space{
  flex-direction: row;
}
.block{
  width: 150px;
  height: 150px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
}
.blimg{
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: #ffffff;
  margin-bottom: 10px;
}
.bltext{
  font-size: 24px;
  color: #333333;
  max-width: 130px;
  height: 30px;
  lines: 1;
  text-overflow:ellipsis;
}
.reveal{
  background-color: #ffffff;
  width: 750px;
  height: 30px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.slip{
  width: 80px;
  height: 5px;
  background-color: #ededed;
  border-top-left-radius: 2.5px;
  border-bottom-left-radius: 2.5px;
  border-top-right-radius: 2.5px;
  border-bottom-right-radius: 2.5px;
  position: relative;
}
.slider{
  position: absolute;
  background-color: #ff7d49;
  height: 5px;
  border-top-left-radius: 2.5px;
  border-bottom-left-radius: 2.5px;
  border-top-right-radius: 2.5px;
  border-bottom-right-radius: 2.5px;
}
.decimal  {
  margin-top: 5px;
  margin-right: 5px;
  font-size: 20px;
}
.img{
  width: 750px;
  height: 750px;
}
</style>