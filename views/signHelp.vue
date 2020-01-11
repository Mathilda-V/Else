<template>
  <div>
    <navbar :title="title"></navbar>    
    <text>
      每日签到即可获得米粒。米粒可以兑换相应宝贝，该功能后期将会开放。
      签到第一天可领取10米粒，累计签到时间越长，每天获取米粒越多，即：
          第一天：10米粒
          第二天：20米粒
          第三天：30米粒
          第四天：40米粒
          第五天：50米粒
          第六天：60米粒
          第七天：70米粒
          第八天：70米粒
    注：签到过程中，如果中断签到，累计天数归0。
    </text>
  </div>    
</template>
<script>
  import navbar from "base/navbar";
  export default {
    data () {
      return {
        title: '规则说明',
        src:''
      }
    },
    methods:{

    },
    components: { navbar }
  }
</script>
<style scoped>

</style>
