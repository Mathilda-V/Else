<template>
  <scroller show-scrollbar="false" class="wrapper">
    <div class="head">
      <navbar title="全网搜索优惠券" backgroundColor="#f24561" @blur="backBlur"></navbar>
      <div class="search">
        <input 
          class="search-area" 
          type="text" 
          singleline="true" 
          return-key-type="search"
          v-model="keywords" 
          @focus="onFocus"
          @return="search"
          @input="entryForCompletion"
          placeholder="输入/粘贴淘宝商品标题搜索隐藏券">
        <text class="search-btn middle-white" @click="search">搜</text>
      </div>
    </div>
    <div v-if="entryList.length?false:true">
      <div class="history" v-if="hotSearch.length">
        <div class="white-w-none row-btw strong back-gray">        
          <div class="row">
            <text class="fire">热</text>
            <text class="normal-black space-l">热门搜索</text>
          </div>
        </div>
        <div class="white-w-none row strong">
          <div class="researsh" v-for="(word,i) in hotSearch" @click="wordToSearch(word)">
            <image :src="fireIcon" style="width:26px; height:26px;" v-if="i<=2?true:false"></image>
            <text class="normal-black" :class="[i<=2?'red-color':'']">{{word}}</text>
          </div>
        </div>
      </div>
      <div class="history">
        <div class="white-w-none row-btw strong back-gray">
          <text class="normal-black space-l">历史搜索</text>
          <div class="row">
            <image :src="deleteIcon" style="width:30px; height:30px;margin-right:20px;" @click="clearHistory"></image>
          </div>
        </div>
        <div class="white-w-none row strong" v-if="historyKey.length">
          <text class="history-item normal-gray line-1" v-for="word in historyKey" @click="wordToSearch(word)">{{word}}</text>
        </div>
      </div>
    </div>
    <div class="entry-list" v-if="entryList.length?true:false">
      <div class="row-btw white-w entry" v-for="e in entryList" :key="e" @click="searchEntry(e)">
        <text class="normal-black">{{e}}</text>
        <image :src="entryImg" style="width:40px;height:40px;"/>
      </div>
    </div>
  </scroller>
</template>

<script>
const modal = weex.requireModule('modal') 
const storage = weex.requireModule('storage') 
const stream = weex.requireModule('stream')
import Util from "common/js/util"
import { DIRECTION_ARROW, FIRE, DELETE, SEARCH_ENTRY } from 'common/js/icon-type'
import Navbar from 'base/navbar'
export default {
  components:{Navbar},
  mixins: [Util],
  data(){
    return {
      arrowLeft: DIRECTION_ARROW[1],
      deleteIcon: DELETE,
      fireIcon: FIRE,
      entryImg: SEARCH_ENTRY,
      fouceTarget:null,
      list: [],
      keywords: '',
      historyKey: [],
      hotSearch: [],
      entryList: [] //词条
    }
  },
  created(){
    this.getHotkey() //热门搜索
    this.getHistoryKey() //历史记录
  },
  methods: {
    search(){
      let keyword = this.keywords.trim()
      storage.setItem("searchkey", JSON.stringify({kw: keyword}));
      if(keyword != '' && !this.historyKey.includes(keyword)){
        this.historyKey.unshift(keyword)
      }
      storage.setItem("historyKey", JSON.stringify(this.historyKey));
      this.open('list', 'true', () => {
        this.entryList = []
        this.keywords = ''
      });
    },
    entryForCompletion(e){  //搜索自动补全
      let txt = encodeURI(e.value)
      let options = {
        url: `https://suggest.taobao.com/sug?q=${txt}&code=utf-8&area=c2c`,
        method: 'GET',
        type: 'json'
      }
      stream.fetch(options, res => {
        this.entryList = []
        if (res && res.status == 200 && res.ok) {
          res.data.result.forEach((item)=>{
            this.entryList.push(item[0].replace(/<\/?.+?\/?>/g,''))
          })
          console.log(this.entryList)
        }
      })
    },
    searchEntry(e){  //补全搜索
      this.keywords = e 
      this.search();
    },
    clearHistory(){
      this.historyKey.splice(0, this.historyKey.length)
      storage.removeItem('historyKey', e => {})
    },
    toDetail(movieInfo) {
      storage.setItem("movieInfo", JSON.stringify(movieInfo), e => {
        if (e.result == "success") {
          this.open('detail', 'true', () => {})
        }
      })
    },
    getHotkey(){
      this.post('appapi', 'getKeyWord', {}, res => {
        console.log(res)
        if(res.success){
          this.hotSearch = res.data.kw.split(',')
        }
      })
    },
    getHistoryKey(){
      storage.getItem("historyKey", e => {
        console.log(e);
        if(e.result == 'success'){
          this.historyKey = JSON.parse(e.data)
        }
        // Vue.set(self.stext, "text", e.data);
      });
    },
    wordToSearch(keyword){
      storage.setItem("searchkey", JSON.stringify({kw:keyword}));
      this.open('list', 'true', () => {});
    },
    onFocus(e){
        this.fouceTarget=e.currentTarget;
    },
    backBlur(){
        if(this.fouceTarget != null){
            this.fouceTarget.blur();
        }
    },
  }
}
</script>


<style lang="stylus" scoped>
@import '../common/stylus/layout.styl'
@import '../common/stylus/variable.styl'


.head {
  padding-bottom: 40px;
  background-color : #f24561;
  text-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
  align-items: center;
}
.title-con{
  width: 750px;
  margin-top: 100px;
  margin-bottom: 60px;
  justify-content: center;
}
.title {
  line-height: 60px;
  color: #ffffff; 
  font-size: 38px;
  font-weight: 600;
  text-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
}
.search {
  width: 680px;
  height: 90px;
  background-color: #FFFFFF;
  border-radius: 50px;
  margin-top: 20px;
}
.search-area {
  width: 460px;
  height: 90px;
  margin-left: 30px;
  font-size: 24px;
}
.search-btn {
  width: 80px;
  height: 80px;
  line-height: 80px;
  background-color: #f24561;
  position: absolute;
  right: 5px;
  top: 5px;
  text-align: center;
  border-radius: 50px;
}
.researsh{
  flex-direction: row;
  padding: 10px 20px;
  margin-right: 20px;
  margin-bottom: 20px;
  border-radius: 25px;
  background-color: #f1f1f1;
}
.history-item{
  padding: 10px 20px;
  text-align: center;
  line-height: 30px;
  height: 50px;
  border-radius: 25px;
  margin-right: 20px;
  margin-bottom: 20px;
  background-color: #f1f1f1;
  max-width: 690px;
}
.one{
  width: 526px;
  lines: 1;
  text-overflow: ellipsis;
  white-space: nowrap;  
}
.fire{
  width: 30px;
  height: 30px;
  font-size: 24px;
  text-align: center;
  line-height: 30px;
  border-radius: 2px;
  background-color: #e5345f;
  color: white;
}
.titleColor {
  color: #ffffff;
}
.titleStyle {
  font-weight: 400;
  font-size: 34px;
}
.red-color{
  color: #e5345f;
}
.back-gray{
  background-color: #f8f8f8;    
}
.entry{
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #eeeeee;
}
</style>