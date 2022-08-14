<script>
export default {
  name: "About",
};
</script>

<template>
  <h1>about</h1>
  <el-form :label-position="'top'" label-width="100px" :model="formLabelAlign">
    <el-form-item label="Name">
      <el-input v-model="formLabelAlign.name"></el-input>
    </el-form-item>
    <el-form-item label="Activity zone">
      <el-input v-model="formLabelAlign.region"></el-input>
    </el-form-item>
    <el-form-item label="Activity form">
      <el-input v-model="formLabelAlign.type"></el-input>
    </el-form-item>
  </el-form>
</template>

<style scope></style>
