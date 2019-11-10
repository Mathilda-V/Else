<template>
  <div class="container1 f-x a-i-c">
    <img src="../assets/logo.png" alt class="logo" />
    <div class="top_right f-x a-i-c">
      <img
        src="../assets/hero1.jpg"
        class="top_heroimg"
        :class="{'active':active==0}"
        @click="heroindex(0)"
      />
      <img
        src="../assets/hero1.jpg"
        class="top_heroimg"
        :class="{'active':active==1}"
        @click="heroindex(1)"
      />
      <img
        src="../assets/hero1.jpg"
        class="top_heroimg"
        :class="{'active':active==2}"
        @click="heroindex(2)"
      />
      <img
        src="../assets/hero1.jpg"
        class="top_heroimg"
        :class="{'active':active==3}"
        @click="heroindex(3)"
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      hero: [
        "../assets/hero1.jpg",
        "../assets/hero1.jpg",
        "../assets/hero1.jpg",
        "../assets/hero1.jpg"
      ],
      active: 0
    };
  },
  methods: {
    heroindex(e) {
      this.active = e;
      this.$emit("heroindex", e);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/style.css";
.container1 {
  height: 20%;
  background-color: #12141b;
}

.logo {
  width: 25%;
}

.top_right {
  height: 100%;
  flex: 1;
}
.top_heroimg {
  height: 90%;
  border: 3px solid transparent;
  margin-right: 20px;
}

.logo:hover,
.top_heroimg:hover {
  cursor: pointer;
}

.active {
  border: 3px solid #ecc662;
}
</style>