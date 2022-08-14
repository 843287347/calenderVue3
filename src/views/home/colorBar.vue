<script lang="ts">
export default {
  name: "colorBar",
  props: {},
  data() {
    return {
      colorList: ["#F56C6C", "pink", "orange", "#409EFF", "#67C23A", "#909399"],
      colorDes: ["学习", "运动", "工作", "社交", "娱乐", "其他"],
    };
  },
};
</script>

<template>
  <div class="colorDes">
    <div
      class="colorBox"
      v-for="(color, cindex) in colorList"
      :key="cindex"
      :style="{ background: color }"
    >
      <span>{{ colorDes[cindex] }}</span>
    </div>
  </div>
</template>

<style lang="less">
.colorDes {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 480px;

  .colorBox {
    height: 30px;
    width: 80px;
    margin: 0 5px;

    span {
      font-size: 12px;
      line-height: 30px;
      text-align: center;
      overflow: hidden;
    }
  }
}
</style>
