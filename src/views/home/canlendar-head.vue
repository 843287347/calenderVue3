<template>
  <div class="header-container">
    <colorBar class="bar"></colorBar>
    <el-button type="primary" @click="$emit('handlePrevMonth')">
      上一个月
    </el-button>
    <div class="header-showToday">{{ year }} - {{ month + 1 }}</div>
    <el-button type="primary" @click="$emit('handleNextMonth')"
      >下一个月</el-button
    >
    <el-button class="right" type="success" @click="$emit('handleToday')"
      >今天</el-button
    >
  </div>
</template>

<script lang="ts">
import colorBar from "./colorBar.vue";
export default {
  props: {
    year: String,
    month: String,
  },
  data() {
    return {
      headStyle: "",
    };
  },
  components: {
    colorBar,
  },
  mounted() {
    // this.headStyle = this.headOptions.style;
  },
  emits: ["handleToday", "handleNextMonth", "handlePrevMonth"],
  methods: {},
};
</script>

<style lang="less">
.header-container {
  width: 100%;
  height: 30px;
  line-height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 10px;
  position: relative;
  
  .bar {
    position: absolute;
    left: 0;
  }
  button {
    margin: 0 20px;
  }
  .showToday {
    display: inline-block;
    width: 120px;
    margin: 0 10px;
  }
  .right {
    position: absolute;
    right: 10px;
  }
}
</style>
