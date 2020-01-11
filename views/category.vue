<template>
  <div class="wrapper">
    <div class="search" :style="{paddingTop: statusbarHeight + 'px', height: statusbarHeight + 100 + 'px'}">
      <div class="search-input " @click="goSearch">
        <image class="search-input-img" :src="searchIcon"/>
        <text class="search-input-text">搜索商品名或粘贴淘宝标题</text>
      </div>
    </div>
    <div class="container" :style="{height: contentHeight + 'px'}">
      <scroller show-scrollbar="false">
        <div class="list">
          <div v-for="(tab, index) in menu" class="center" @click="tabSelect(tab.name, index)">
            <text :class="['normal-black', 'tab-item', curIndex == index ? 'tab-active' : '']">{{tab.name}}</text>
          </div>
        </div>
      </scroller>
      <div class="content">
        <scroller show-scrollbar="false">
          <text class="content-title bs">{{curName}}</text>
          <div class="item-cell">
            <div 
              class="item-content" 
              v-for="type in curChild.son"
              @click="typeSelect(type)">
              <image class="img" :src="type.url+'_110x110_.webp'" />
              <text class="info-text small-gray">{{type.name}}</text>
            </div>
          </div>
        </scroller>
      </div>
    </div>
  </div>
</template>

<script>
const storage = weex.requireModule('storage');
import Util from "common/js/util"
import { SEARCH_ICON } from 'common/js/icon-type'

export default {
  mixins: [Util],
  props: {
    pageHeight: {
      type: Number,
      default: 1534
    }
  },
  data(){
    return {
      searchIcon: SEARCH_ICON,
      menu: [],
      curName: '',
      curIndex: 0,
      contentHeight: 0,
      keyword: ''
    }
  },
  created(){
    this.getData()
  },
  mounted(){
    storage.getItem('viewport',(e) => {
      if(e.result == "success"){
        this.pageHeight = JSON.parse(e.data).deviceHeight
        this.calcHeight(this.pageHeight)
      }
    })
  },
  computed: {
    curChild() {
      return this.menu.length && this.menu.find(item => item.name === this.curName)
    }
  },
  methods: {
    calcHeight(deviceHeight){
      this.contentHeight = deviceHeight - this.statusbarHeight - 100 - 100
    },
    getData(){
      this.post('cate', 'getCategoryList', {}, res => {
        if(res && res.success){
          this.menu = res.data
          this.curName = this.menu[0].name
        }
      })
    },
    tabSelect(name, index) {
      this.curIndex = index
      this.curName = name
    },
    typeSelect(item) {
      storage.setItem('searchkey', JSON.stringify({kw: '', cate: item}), e => {
        this.open('list', 'true', () => {});
      })
    },
    goSearch(){
      this.open('searchList', 'true', function (){})
    }
  },
}
</script>

<style scoped>
.search{
  width: 750px;
  background-color: #e5345f;
  justify-content: center;
  align-items: center;
}
.search-input{
  width: 540px;
  height: 60px;
  font-size: 26px;
  line-height: 60px;
  background-color: #FFFFFF;
  flex-direction: row;
  border-radius: 30px;
}
.search-input-text{
  height: 60px;
  font-size: 26px;
  line-height: 60px;
  color: #999;
}
.search-input-img{
  width: 40px;
  height: 40px;
  margin: 10px;
}
.container{
  flex-direction: row;
  background-color: #FFFFFF;
}
.list{
  width: 200px;
  min-height: 1080px;
  padding: 24px 10px 0px 10px;
  align-items: center;
}
.tab-item{
  width: 180px;
  height: 60px;
  line-height: 60px;
  margin-bottom: 36px;
  text-align: center;
}
.tab-active{
  color: #FFFFFF;
  font-size: 28px;
  font-weight: 300;
  background-color: #333;
  border-radius: 100px;
}
.content{
  width: 550px;
  padding-left: 35px;
  position: relative;
  border-left-width: 1px; 
  border-left-style: solid; 
  border-left-color: #EDEDED;
}


.item-cell{
  width: 550px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-bottom: 50px;
}
.item-content{
  width: 150px;
  height: 210px;
  align-items: center;
  margin-right: 15px;
  margin-bottom: 10px;
}
.img{
  width: 110px;
  height: 110px;
  margin: 20px;
  background-color: #eeeeee;
}
.info-text{
  width: 150px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  text-overflow: ellipsis;
  lines: 1;
}
.content-title{
  margin-top: 40px;
  color: #666;
  font-size: 28px;
  font-weight: 500;
}

.normal-black{
  color: #999;
  font-size: 26px;
  font-weight: 300;
}
.small-gray{
  color: #333333;
  font-size: 24px;
  font-weight: 300;
}
.bs{
  margin-bottom: 24px;
}
.center{
  justify-content: center;
  align-items: center;
}
</style>




