<template>
  <div class="container">
    <topcomp @heroindex="heroindex"></topcomp>
    <bottomcomp :index="index" :obj="arr[index]"></bottomcomp>
  </div>
</template>
<script>
import topcomp from "@/components/top";
import bottomcomp from "@/components/bottom";
export default {
  data() {
    return {
      index: 0,
      arr: [
        {
          desc1: {
            name1: "绝世舞姬",
            name2: "貂蝉",
            type: "法师",
            sc: 80,
            gj: 75,
            jn: 60
          }, 
          desc2: [
            "../assets/jn1.png",
            "@/assets/jn2.png",
            "@/assets/jn3.png",
            "@/assets/jn4.png"
          ],
          desc3: {
            one: [
              "/src/assets/cz1.jpg",
              "/src/assets/cz2.jpg",
              "/src/assets/cz3.jpg",
              "/src/assets/cz4.jpg",
              "/src/assets/cz5.jpg",
              "/src/assets/cz6.jpg"
            ],
            two: [
              "/src/assets/cz1.jpg",
              "/src/assets/cz2.jpg",
              "/src/assets/cz3.jpg",
              "/src/assets/cz4.jpg",
              "/src/assets/cz5.jpg",
              "/src/assets/cz6.jpg"
            ]
          },
          desc4: [
            "一技能：貂蝉每次使用其他技能对敌人造成印记爆炸的时候，爆炸效果会对敌方造成范围伤害并减速，而且该爆炸伤害无视对方护甲防御，是真实伤害。",
            "二技能：一条直线上造成两次伤害，由于有一定的延迟，所以需要预判对手的走位释放。",
            "三技能：貂蝉2技能位移并且对最近的敌人造成3次伤害，如果3次都命中在同一敌人身上，将会直接触发被动减速，该技能也能用于穿墙逃跑，在没有大招的情况下谨慎使用。",
            "大招：大招是貂蝉非常霸道的AOE技能，虽然大招伤害很一般，但能在大范围对敌人触发被动效果，使得貂蝉其他技能造成更多伤害，冷却也更快。"
          ],
          desc5: "视频"
        },
        {
          desc1: {
            name1: "爵士貂蝉2",
            name2: "貂蝉",
            type: "法师",
            sc: 80,
            gj: 75,
            jn: 60
          },
          desc2: [
            "../assets/jn1.png",
            "@/assets/jn2.png",
            "@/assets/jn3.png",
            "@/assets/jn4.png"
          ],
          desc3: {
            one: [
              "/src/assets/cz1.jpg",
              "/src/assets/cz2.jpg",
              "/src/assets/cz3.jpg",
              "/src/assets/cz4.jpg",
              "/src/assets/cz5.jpg",
              "/src/assets/cz6.jpg"
            ],
            two: [
              "/src/assets/cz1.jpg",
              "/src/assets/cz2.jpg",
              "/src/assets/cz3.jpg",
              "/src/assets/cz4.jpg",
              "/src/assets/cz5.jpg",
              "/src/assets/cz6.jpg"
            ]
          },
          desc4: [
            "一技能略一技能略一技能略一技能略一技能略一技能略一技能略一技能略一技能略",
            "一技能略一技能略一技能略",
            "一技一技能略能略一技能略一技能略",
            "一技能略一技能略一技能略"
          ],
          desc5: "视频"
        },
        {
          desc1: {
            name1: "爵士貂蝉3",
            name2: "貂蝉",
            type: "法师",
            sc: 80,
            gj: 75,
            jn: 60
          },
          desc2: [
            "../assets/jn1.png",
            "@/assets/jn2.png",
            "@/assets/jn3.png",
            "@/assets/jn4.png"
          ],
          desc3: {
            one: [
              "/src/assets/cz1.jpg",
              "/src/assets/cz2.jpg",
              "/src/assets/cz3.jpg",
              "/src/assets/cz4.jpg",
              "/src/assets/cz5.jpg",
              "/src/assets/cz6.jpg"
            ],
            two: [
              "/src/assets/cz1.jpg",
              "/src/assets/cz2.jpg",
              "/src/assets/cz3.jpg",
              "/src/assets/cz4.jpg",
              "/src/assets/cz5.jpg",
              "/src/assets/cz6.jpg"
            ]
          },
          desc4: [
            "一技能略一技能略一技能略一技能略一技能略一技能略一技能略一技能略一技能略",
            "一技能略一技能略一技能略",
            "一技一技能略能略一技能略一技能略",
            "一技能略一技能略一技能略"
          ],
          desc5: "视频"
        },
        {
          desc1: {
            name1: "爵士貂蝉4",
            name2: "貂蝉",
            type: "法师",
            sc: 80,
            gj: 75,
            jn: 60
          },
          desc2: [
            "../assets/jn1.png",
            "@/assets/jn2.png",
            "@/assets/jn3.png",
            "@/assets/jn4.png"
          ],
          desc3: {
            one: [
              "/src/assets/cz1.jpg",
              "/src/assets/cz2.jpg",
              "/src/assets/cz3.jpg",
              "/src/assets/cz4.jpg",
              "/src/assets/cz5.jpg",
              "/src/assets/cz6.jpg"
            ],
            two: [
              "/src/assets/cz1.jpg",
              "/src/assets/cz2.jpg",
              "/src/assets/cz3.jpg",
              "/src/assets/cz4.jpg",
              "/src/assets/cz5.jpg",
              "/src/assets/cz6.jpg"
            ]
          },
          desc4: [
            "一技能略一技能略一技能略一技能略一技能略一技能略一技能略一技能略一技能略",
            "一技能略一技能略一技能略",
            "一技一技能略能略一技能略一技能略",
            "一技能略一技能略一技能略"
          ],
          desc5: ""
        }
      ]
    };
  },
  components: {
    topcomp,
    bottomcomp
  },
  methods: {
    heroindex(e) {
      this.index = e;
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  height: 100vh;
}
</style>