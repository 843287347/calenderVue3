<script>
import InspireCloud from "@byteinspire/js-sdk";
const serviceId = "qcl7ts";
const inspirecloud = new InspireCloud({ serviceId });

export default {
  setup() {},
  methods: {
    handleRouter(target) {
      this.$router.push(target);
    },
    handleLogout() {
      inspirecloud
        .run("logout")
        .then((res) => {
          this.handleRouter("/");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<template>
  <el-menu
    :default-active="'1'"
    mode="horizontal"
    class="el-menu-demo"
    @select="handleSelect"
  >
    <img class="logo" src="../../../public/logo2.png" alt="" />
    
    <el-menu-item index="1" @click="handleRouter('/home/calendar')"
      >日历</el-menu-item
    >
    <el-sub-menu index="2">
      <template #title>用户中心</template>
      <el-menu-item index="2-1" @click="handleRouter('/home/setting')">
        设置中心
      </el-menu-item>
      <el-menu-item index="2-2" @click="handleLogout"> 退出登录 </el-menu-item>
      <!-- <el-menu-item index="2-3">item three</el-menu-item> -->
    </el-sub-menu>
  </el-menu>
  <router-view></router-view>
</template>

<style lang="less">
.logo {
  display: block;
  margin: auto 15px;
  width: 40px;
  height: 40px;
}
</style>
