<script>
import InspireCloud from "@byteinspire/js-sdk";
export default {
  name: "Register",
  data() {
    return {
      formLabelAlign: {
        username: "",
        password: "",
        confirmPassword: "",
      },
      isCreating: false,
    };
  },
  methods: {
    handlecreateUser() {
      this.isCreating = true;
      if (
        this.formLabelAlign.password !== this.formLabelAlign.confirmPassword
      ) {
        ElMessage({
          message: "密码不一致，请重新输入",
          type: "warning",
          center: true,
          grouping: true,
        });
        this.isCreating = false;
        return;
      }
      const username = this.formLabelAlign.username;
      const password = this.formLabelAlign.password;
      const serviceId = "qcl7ts";
      const inspirecloud = new InspireCloud({ serviceId });

      // 调用名为 createUser 的云函数
      inspirecloud
        .run("createUser", {
          username,
          password,
        })
        .then((res) => {
          if (res.success) {
            this.formLabelAlign = {};
            this.isCreating = false;

            ElMessage({
              message: "账号注册成功",
              center: true,
              type: "success",
            });
            this.$router.push("/");
          } else{
            ElMessage({
              message: res.message,
              center: true,
              type: "error",
            });
            this.isLogining = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      this.isCreating = false;
    },
  },
};
</script>

<template>
  <h1>Register</h1>
  <router-link to="/"> go to login</router-link>
  <div class="registerContainer" v-loading="isCreating">
    <el-form :label-position="'top'" :model="formLabelAlign">
      <el-form-item label="用户名">
        <el-input v-model="formLabelAlign.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="formLabelAlign.password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input
          type="password"
          v-model="formLabelAlign.confirmPassword"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handlecreateUser"> 创建账号</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="less">
.registerContainer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
}
</style>
