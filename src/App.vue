<script>
export default {
  name: "app",
  data() {
    // activeIndex: "1";
  },
  methods: {
    handleSelect(e) {
      console.log(e);
    },
  },
};
</script>

<template>
  <!-- <el-menu
    :default-active="'1'"
    mode="horizontal"
    class="el-menu-demo"
    @select="handleSelect"
  >
    <el-menu-item index="1"><router-link to="/"> Login</router-link></el-menu-item>
    <el-menu-item index="2"><router-link to="/home"> 日历</router-link></el-menu-item>
  </el-menu> -->
  <router-view></router-view>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}

</style>
