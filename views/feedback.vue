<template>
  <div class="wrapper">
    <navbar title="意见反馈" backgroundColor="#e5345f" @blur="backBlur"></navbar>
    <div class="feedback">
      <textarea 
        class="textarea" 
        rows="10" 
        placeholder="请在此输入您要反馈的问题..." 
        @focus="onFocus"
        v-model="feedbackInfo"></textarea>
      <progress 
        class="totalProgress"
        :progress-styles="progressStyles"
        :total="125"
        :current="feedbackInfo.length"
        :is-horizontal="false"></progress>
      <div class="infoCount"><text :style="{color: feedbackInfo.length > 124 ? '#f03132' : '#999999'}">{{feedbackInfo.length}}</text><text> / 125</text></div>
    </div>
    <div class="circle-btn-container">
      <div class="circle-btn-bg" ref="circle_btn_bg" :style="{backgroundColor: feedbackInfo.length ? 'rgba(255, 0, 0, 1)' : '#cfcfcf'}"></div>
      <text class="circle-btn" :style="{backgroundColor: feedbackInfo.length ? '#ff0000' : '#cfcfcf'}" @click="save">提交</text>
    </div>
  </div>
</template>
<script>
const navigator = weex.requireModule('navigator')
const modal = weex.requireModule('modal')
import Navbar from 'base/navbar'
import progress from "base/progress"
import util from 'common/js/util'

export default {
  components: { Navbar, progress },
  mixins: [util],
  data () {
    return {
      progressStyles: {
        width: 10,
        height: 320,
        fouceTarget:null,
        frontColor: '#fe4353',
        bgColor: 'rgba(0, 0, 0, .3)'
      },
      feedbackInfo: () => { return null }
    }
  },
  methods: {
    save () {
      if (this.feedbackInfo.length) {
        this.submit()
      }
      let pattern = /%|'|>|<|=/
      let boolean = pattern.test(this.feedbackInfo)
      if (boolean) {
        modal.toast({
          message: '提交失败，提交内容不能包含特殊字符',
          duration: 1
        })
      } else {
        if (this.feedbackInfo.length > 125 || this.feedbackInfo.length == 0) {
          modal.toast({
            message: '提交失败，反馈信息长度不能为空且限制为125字',
            duration: 1
          })
        } else {
          this.post("opinion","addOpinion", {content: this.feedbackInfo}, e=>{
            if (e.message == "ok") {
              modal.toast({
                message: '提交成功，感谢您的反馈',
                duration: 1
              })
              this.close('true', e => {})
            }
          })
        }
      }
    },
    submit () {
      let circle_btn_bg = this.$refs.circle_btn_bg
      this.animation(circle_btn_bg, { backgroundColor: 'rgba(255, 0, 0, 0)', transform: 'scale(1)' }, 800, 0, 'linear', false, ()=>{
        this.animation(circle_btn_bg, { backgroundColor: 'rgba(255, 0, 0, 1)', transform: 'scale(.7)' }, 0, 0, 'linear', false, ()=>{})
      })
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
<style scoped>
.wrapper {
  background-color: #efefef;
}
.feedback {
  position: relative;
}
.textarea {
  width: 710px;
  height: 400px;
  margin-top: 20px;
  margin-left: 20px;
  padding-top: 20px;
  padding-right: 50px;
  padding-bottom: 20px;
  padding-left: 20px;
  line-height: 60px;
  text-indent: 60px;
  font-size: 28px;
  color: #666666;
  border-radius: 10px;
  background-color: #ffffff;
}
.totalProgress {
  position: absolute;
  right: 40px;
  top: 40px;
  margin-right: 8px;
  box-shadow: inset 3px 3px 10px #333;
}
.infoCount {
  position: absolute;
  flex-direction: row;
  bottom: 20px;
  right: 40px;
  color: #666666;
}

.circle-btn-container {
  position: absolute;
  bottom: 0;
  left: 275px;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  border-radius: 100px;
}
.circle-btn-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 200px;
  border-radius: 100px;
  transform: scale(.7);
}
.circle-btn {
  width: 140px;
  height: 140px;
  text-align: center;
  line-height: 140px;
  font-size: 30px;
  color: #ffffff;
  border-radius: 70px;
}
</style>


