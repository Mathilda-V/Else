<template>
  <div>
      <navbar :title="title" ></navbar>
        <div class="cont">
          <div class="cont-img-box">
            <image class="cont-img" :src="code"/>
          </div>
          <input class="cont-code" type="text" placeholder="请输入他人给您的邀请码">
          <text class="cont-confirm">马上提交</text>
        </div>
        <!-- 规则介绍 -->
        <div class="rule-intro">
          <div class="into-tltle">
            <text class="tltle-txt">温馨提示</text>
          </div>
          <div class="into-con">
            <div class="con-item" v-for="(item, index) in rule">
              <div class="con-pic">
                <text class="pic-txt">{{index+1}}</text>
              </div>
              <text class="con-txt">{{item}}</text>
            </div>
          </div>
        </div>
  </div>
</template>
<script>
const storage = weex.requireModule("storage");
const modal=weex.requireModule("modal");
import Navbar from 'base/navbar'
import Util from "common/js/util"
import { PARTNER } from 'common/js/icon-type'
export default {
  components:{Navbar},
  mixins:[Util],
  data(){
      return{
        code: PARTNER.CODE,
        title: '邀请码',
        rule: [
          '下载软件后充值会员后才会看见邀请码入口',
          '一个手机只能输入一次邀请码。已经输入邀请码的手机，是无法看见邀请码入口',
          '使用App分身软件、高危手机号等非正常用户不能输入邀请码，且会被系统记录',
        ],
      }
  },
  methods: {
  },
}
</script>
<style scoped>
.row {
  flex-direction: row;
  align-items: center;
}
.between {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
/* 主体 */
.cont{
 width: 710px;
 margin-left: 20px;
 margin-right: 20px;
}
.cont-img-box{
  width: 710px;
  height: 400px;
  justify-content: center;
  align-items: center;
}
.cont-img{
  width: 280px;
  height: 280px;
  /* background-color: #eee; */
}
.cont-code{
  height:98px;
  line-height: 98px;
  border-color: #ccc;
  border-width: 1px;
  border-radius: 50px;
  background-color: #fff;
  text-align: center;
  margin-bottom: 40px;
}
.cont-confirm{
  height:100px;
  line-height: 100px;
  text-align: center;
  font-size: 30px;
  background-color: #e5345f;
  border-radius: 50px;
  margin-bottom: 60px;
  color: white;
}
/* 积分规则 */
.rule-intro {
  background-color: #ffffff;
}
.into-tltle {
  width: 750px;
  height: 30px;
  line-height: 30px;
}
.tltle-pic {
  width: 60px;
  height: 30px;
  background-color: #cccccc;
}
.tltle-txt {
  padding-left: 20px;
  font-size: 28px;
}
.into-con {
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
}
.con-item {
  width: 690px;
  margin-bottom: 20px;
  flex-direction: row;
}
.con-pic {
  position: relative;
  top: 5px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #999;
}
.pic-txt {
  text-align: center;
  line-height: 30px;
  color: #ffffff;
  font-size: 20px;
}
.con-txt {
  width: 650px;
  padding-left: 20px;
  font-size: 24px;
  line-height: 36px;
  color: #6e6e6e;
}
</style>

