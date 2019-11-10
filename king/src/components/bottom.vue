<template>
  <div class="bottom_container f-x">
    <div class="bottom_left f-y a-i-c">
      <div
        v-for="(item,index) in presen"
        :key="index"
        :class="{'persenitem':menuIndex==index}"
        @click="changeMenu(index)"
        class="f-x a-i-c"
      >
        <img
          src="../assets/jt.png"
          style="width:30px;opacity: 0;"
          alt
          :class="{'jt':index==menuIndex}"
        />
        {{item}}
      </div>
    </div>
    <div class="bottom_right">
      <div v-show="menuIndex==0" class="f-x j-c-e a-i-c bottom_right0">
        <div style="width:45%;height:80%;border-radius:10px" class="f-y">
          <div class="pd-20 f-y a-i-c">
            <p style="font-size:25px;color:#eed68a" class="pd-10">{{obj.desc1.name1}}</p>
            <p style="font-size:45px">{{obj.desc1.name2}}</p>
          </div>
          <div class="f-y" style="padding: 0 40px;">
            <p style="font-size:25px;padding: 20px 0">英雄定位:{{obj.desc1.type}}</p>
            <p style="font-size:25px">生存能力：{{obj.desc1.sc}}</p>
            <p style="font-size:25px">攻击伤害：{{obj.desc1.gj}}</p>
            <p style="font-size:25px">技能伤害：{{obj.desc1.jn}}</p>
          </div>
        </div>
      </div>
      <div v-show="menuIndex==1" class="f-y bottom_right1">
        <div style="width:100%;height:200px" class="f-x a-i-c j-c-a">
          <img
            v-for="(item,index) in obj.desc2"
            src="@/assets/jn2.png"
            :key="index"
            alt
            style="width:100px;height:100px;border: 3px solid transparent;"
            :class="{'jnActive':index == jnms}"
            @click="jnClick(index)"
          />
        </div>
        <div class="f-y">
          <p style="font-size:24px;padding:0 0 30px 70px;">{{jnms[0]}}</p>
          <p style="font-size:22px;padding-left:30px;line-height: 40px;">{{jnms[1]}}</p>
        </div>
      </div>
      <div v-show="menuIndex==2" class="bottom_right2 f-y">
        <div class="type3">
          <p style="font-size: 24px;color: #ffffff;padding: 0 0 20px 30px;">出装推荐一</p>
          <div style="width:100%;height:100px;" class="f-x j-c-a">
            <img
              src="@/assets/cz1.jpg"
              v-for="item in obj.desc3.one"
              :key="item"
              alt
              style="width:100px;height:100px;border-radius: 50%;border: 3px solid #ffffff;"
            />
          </div>
        </div>
        <div class="type3">
          <p style="font-size: 24px;color: #ffffff;padding: 0 0 20px 30px;">出装推荐二</p>
          <div style="width:100%;height:100px" class="f-x j-c-a">
            <img
              src="@/assets/cz1.jpg"
              v-for="item in obj.desc3.two"
              :key="item"
              style="width:100px;height:100px;border-radius: 50%;border: 3px solid #ffffff;"
            />
          </div>
        </div>
      </div>
      <div v-show="menuIndex==3" class="bottom_right3 f-y" style="padding: 40px 30px;">
        <p v-for="item in obj.desc4" :key="item" style="padding: 10px;">{{item}}</p>
      </div>
      <div v-show="menuIndex==4">
        <video
          src="http://vd4.bdstatic.com/mda-jjqpzjt0x9cvnp09/sc/mda-jjqpzjt0x9cvnp09.mp4"
          controls
          width="100%"
          height="100%"
        >你的浏览器不支持</video>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      default: 0,
      type: Number
    },
    obj: {
      type: Object
    }
  },
  data() {
    return {
      menuIndex: 0,
      presen: ["英雄介绍", "技能介绍", "出装介绍", "对线介绍", "实战视频"],
      imgarr: ["../assets/bg1.jpg", "../assets/bg1.jpg", "../assets/bg1.jpg"],
      jnms: [
          "语 ● 花印   冷却值：0   消耗：0",
          "貂蝉瞬间消失并立即出现在指定位置，同时会散发3枚花球攻击附近的敌人，每枚造成140/155/170/185/200/215(+24%法术加成)点法术伤害，如果花球命中敌人，还会减少4秒缘●心结的冷却时间。"
        ]
    };
  },
  methods: {
    changeMenu(e) {
      this.menuIndex = e;
    },
    jnClick(e) {
      if (!e) {
        this.jnms = [
          "语 ● 花印   冷却值：0   消耗：0",
          "貂蝉瞬间消失并立即出现在指定位置，同时会散发3枚花球攻击附近的敌人，每枚造成140/155/170/185/200/215(+24%法术加成)点法术伤害，如果花球命中敌人，还会减少4秒缘●心结的冷却时间。"
        ];
      } else {
        this.jnms = [`技能${e}`, `技能描述`];
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/style.css";
.bottom_right2,
.bottom_right1,
.bottom_right3,
.bottom_right0 > div {
  background-color: rgba(0, 0, 0, 0.7);
  // box-sizing: border-box;
  // overflow: hidden;
}
.bottom_right0 p,
.bottom_right1 p,
.bottom_right2 > p,
.bottom_right3 > p {
  color: #ffffff;
}
.bottom_right0 {
  border-left: 2px solid rgba(255, 255, 255, 0.4);
}
.bottom_container {
  height: 80%;
  background: url("../assets/bg1.jpg");
  background-repeat: no-repeat;
  background-size: 100%;
}
.jnActive {
  border: 3px solid #eed68a !important;
  border-radius: 50%;
}
.jt {
  opacity: 1 !important;
}
.bottom_left {
  height: 100%;
  width: 20%;
}
.bottom_right {
  height: 100%;
  flex: 1;
}
.bottom_right > div {
  width: 100%;
  height: 100%;
}
.bottom_left > div {
  font-size: 20px;
  margin-top: 50px;
  color: #ffffff;
}
.bottom_left > div:hover {
  cursor: pointer;
}
.persenitem {
  color: #eed68a !important;
}
.pd-10 {
  padding: 10px;
}
.pd-20 {
  padding: 20px;
}
.pd-40 {
  padding: 40px;
}
.type3 {
  padding: 30px 30px;
}
</style>