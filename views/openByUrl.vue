<template>
  <div>
    <navbar :title="title"></navbar>
    <div :style="{width:'750px',height:webheight}">
      <x5web :src="url" @pagefinish="onPageFinish" ref="webview" show-scrollbar="false" :style="{width:'750px',height: webheight}"></x5web>
    </div>
  </div>
</template>

<script>
const storage = weex.requireModule("storage");
const webview = weex.requireModule('x5webview');
import Navbar from 'base/navbar'
import Util from "common/js/util"
export default {
  mixins: [Util],
  data(){
    return {
      title: '商品详情',
      webheight: '',
      url: ''
    }
  },
  created(){
    storage.getItem("viewport", (e) => {
      if (e.result == 'success') {
        var pageHeight = JSON.parse(e.data).deviceHeight;
        this.webheight = height - this.statusbarHeight - 90 + 'px';
      }
    });
    storage.getItem('url', e => {
      if(e.result == 'success'){
        this.url = e.data
      }
    })
  },
  methods:{
    onPageFinish(){}
  },
  components: {
    Navbar
  }
}
</script>

