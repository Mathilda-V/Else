<template>
    <div class="help">
        <navbar title="领券指南"></navbar>
        <scroller :style="{height:Height}">
          <!-- <video class="video" :src="src" :auto-play="autoplay" controls
            @start="onstart" @pause="onpause" @finish="onfinish" @fail="onfail">
          </video> -->
          <image class="img" :src="quanHelp[0]"></image>
          <image class="img" :src="quanHelp[1]"></image>
          <image class="img" :src="quanHelp[2]"></image>
          <image class="img" :src="quanHelp[3]"></image>
          <image class="img" :src="quanHelp[4]"></image>
        </scroller>
    </div>
</template>
<script>
const storage = weex.requireModule("storage");
import Navbar from 'base/navbar'
import { QUAN_HELP } from 'common/js/icon-type'
export default {
    components: {Navbar},
    data(){
        return {
            Height: '1580',
            src: 'http://flv2.bn.netease.com/videolib3/1611/01/XGqSL5981/SD/XGqSL5981-mobile.mp4',
            autoplay: true,
            quanHelp: QUAN_HELP
        }
    },
    created() {
      storage.getItem('viewport',(e)=>{
        if(e.result == "success"){
          this.calcHeight(JSON.parse(e.data).deviceHeight)
        }
      })
    },
    methods:{
      calcHeight(deviceHeight){
        this.Height = deviceHeight - this.statusbarHeight - 90 + 'px'
      },
      onstart (event) {
        this.state = 'onstart'
      },
      onpause (event) {
        this.state = 'onpause'
      },
      onfinish (event) {
        this.state = 'onfinish'
      },
      onfail (event) {
        this.state = 'onfinish'
      }
    },
}
</script>
<style scoped>
  .video {
    width: 750px;
    height: 750px;
  }
  .img{
    width: 750px;
    height: 750px;
  }
</style>