<template>
  <div>
    <navbar :title="title"></navbar>
    <tkview :type="type" :value="value" :style="{width:'750px',height:webheight}" ></tkview>
  </div>
</template>

<script>
const storage = weex.requireModule('storage');
const utils = weex.requireModule('utils');
import navbar from "base/navbar";

export default {
  components: { navbar },
  data(){
    return {
      title: '',
      type: '',
      webheight: '',
      statusbarHeight:40,
    }
  },
  created(){
    var self = this;
    utils.getStatusBarHeight(e => {
      var rate = this.$getConfig().env.deviceWidth / 750;
      this.statusbarHeight = parseInt(e.statusbarHeight) / rate;
    })
    storage.getItem('tbInfo', d => {
      if (d.result == 'success') {
        var info = JSON.parse(d.data);
        self.title = info.title;
        self.type = info.type;
        self.value = info.value;
      }      
    })
    storage.getItem('viewport', e => {
      if(e.result == "success"){
        this.calcHeight(JSON.parse(e.data).deviceHeight)
      }
    })
  },
  methods:{
    calcHeight(deviceHeight){
      this.webheight = deviceHeight - this.statusbarHeight - 90 + 'px';
    }
  }
}
</script>

<style scoped>

</style>


