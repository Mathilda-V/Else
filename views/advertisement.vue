<template>
  <list show-scrollbar="false" :style="{height: contentHeight + 'px'}">
    <cell>    
      <!-- 宣传图 -->
      <div class="info" :style="{paddingTop:statusbarHeight}">
         <image class="info-pic" :src="bg_top" ></image>
      </div>
    </cell>
    <cell>     
    <!-- 收益详情 -->
    <div class="task">
      <div class="my-task box row">
        <div class="box-con" v-for="(item, index) in listTask" :key="index" @click="toNext(item.url)">
          <text class="task-spe">{{item.txt}}</text>
          <text class="box-txt">{{item.con}}</text>
        </div>               
      </div>
    </div>
    </cell>
    <cell>
    <div class="info">
      <image class="point-pic" :src="point_me" ></image>
    </div>
    </cell>
    <cell>
      <!-- 权益说明 -->
      <div class="explain">
        <div class="explain-title">
          <image class="title-img" :src="feedbackIcon"></image>
          <text class="title-txt">玩法说明</text>
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
    </cell>     
  </list>
</template>
<script>
const storage = weex.requireModule('storage')
const modal = weex.requireModule('modal')
const clipboard = weex.requireModule('clipboard')
import util from 'common/js/util'
import { WxcOverlay } from 'weex-ui';
import { TASK , FEEDBACK } from 'common/js/icon-type'

export default {
  mixins: [util],
  components: { WxcOverlay },
  data() {
    return {
      bg_top: TASK.BG_TOP,
      point_me: TASK.POINT_ME,
      feedbackIcon: FEEDBACK,
      contentHeight: 2000,
      listTask: [
        { con: '今日广告', txt: '10', url: 'partner' },
        { con: '已完成', txt: '4', url: 'partner'},
        { con: '未完成', txt: '6', url: 'partner' },
      ],
      rule: [
         '看广告轻松赚票票，收益率高达20%',
         '邀请好友一起看广告收益速度加倍，邀请的越多，收益速度越快',
         '每次只能购买一种产品，完成产品任务后可以在次购买',
      ],
    }
  }
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
.box {
  width: 750px;
  padding-top: 30px;
  padding-bottom: 30px;
  background-color: #ffffff;
}
.box-con {
  flex: 1;
  align-items: center;
  border-right-color: #eee;
  border-right-width: 1px;

}
.box-pic-small {
  width: 30px;
  height: 30px;
}
.box-pic-mid {
  width: 40px;
  height: 40px;
}
.box-pic-big {
  width: 60px;
  height: 60px;
}
.box-txt {
  margin-top: 20px;
  font-size: 22px;
  color: #666666;    
}
.box-txt1 {
  margin-top: 20px;
  font-size: 22px;
  color: #e5345f;    
}
.relative {
  position: relative;
}
.cred{
  color: #e5345f;
}
.cblue{
  color: #f3884d;
}
.corange{
  color:orange;
}
/* 头部 */

/* 宣传图 */
.info {
  width: 750px;
  background-color: #e5345f;
} 
.info-pic {
  width: 750px;
  height: 300px; 
  background-color: #eee;
}
.point-pic{
  width: 750px;
  height: 200px; 
  background-color: #eee;
}
.info-con {
  padding-left: 20px;
  flex-direction: column;
  justify-content: space-between;
}
/* 我的收益 */
.my-task {
  margin-bottom: 10px;
}
.task-spe {
  width: 250px;
  /* height: 40px; */
  text-align: center;
  /* line-height: 40px; */
  font-size: 60px;
}
/* 会员权益 */
.explain {
  padding: 20px;
  margin-top: 10px;
  margin-bottom: 90px;
  background-color: #ffffff;
}
.explain-title {
  width: 750px;
  padding-top: 10px;
  padding-bottom: 30px;
  padding-left: 20px;
  flex-direction: row;
  align-items: center;
}
.into-con {
  padding-left: 20px;
  padding-right: 20px;
}
.con-item {
  width: 710px;
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
.title-txt{
  text-align: center;
  line-height: 30px;
  color: #333;
  font-size: 26px;
  }
.title-img{
  width: 30px;
  height: 30px;
  margin-right: 10px;
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
.charge-btn {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 750px;
  height: 90px;
  text-align: center;
  line-height: 90px;
  background-color: #cccccc;
  font-size: 30px;
}
</style>

