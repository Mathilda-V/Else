<template>
  <div>
    <navbar :title="title"></navbar>
    <div class="progress" v-if="progressShow">
      <div class="progress-line" :style="{width: progressWidth + 'px'}"></div>
    </div>
    <tkview 
      type="url" 
      @pagefinish="pagefinished" 
      @success="onSuccess" 
      @failed="onFailed" 
      :value="goodsUrl" 
      :style="{width:'750px',height: webHeight}" 
    ></tkview>
  </div>
</template>

<script>
const storage = weex.requireModule('storage');
const modal = weex.requireModule('modal');
const utils = weex.requireModule('utils');
import Navbar from 'base/navbar'

export default {
  components: {Navbar},
  data(){
    return {
      title: '商品详情',
      goodsUrl: '',
      webHeight: '',
      progressShow: true,
      progressWidth: 50
    }
  },
  created(){
    utils.getStatusBarHeight(e => {
      var rate = this.$getConfig().env.deviceWidth / 750;
      this.statusbarHeight = parseInt(e.statusbarHeight) / rate;
    })
    storage.getItem('goodsTkview', e => {
      if(e.result === 'success'){
        let data = JSON.parse(e.data)
        data.url = data.url.startsWith('//') 
        ? data.url.replace('//', 'https://') 
        : data.url
        this.goodsUrl = data.url
        this.title = data.title
      }
    })
    let progress = setInterval(() => {
      this.progressWidth < 650 ? this.progressWidth += 200 : clearInterval(progress)
    }, 400)
  },
  mounted(){
    storage.getItem('viewport', e => {
      if(e.result == "success"){
        this.calcHeight(JSON.parse(e.data).deviceHeight)
      }
    })
  },
  methods: {
    calcHeight(deviceHeight){
      this.webHeight = deviceHeight - this.statusbarHeight - 90 + 'px';
    },
    pagefinished(e){
      setTimeout(() => {
        this.progressWidth = 750
        setTimeout(() => { this.progressShow = false }, 400)
      }, 400)
    },
    onSuccess(e){
      console.log(e)
    },
    onFailed(e){
      this.progressShow = false
      console.log(e)
    }
  }
}
</script>

<style scoped>
.progress{
  width: 750px;
  height: 6px;
  position: relative;
}
.progress-line{
  height: 6px;
  background-color: lightsalmon;
}
</style>


