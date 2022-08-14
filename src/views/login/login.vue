<script>
import InspireCloud from "@byteinspire/js-sdk";
const serviceId = "qcl7ts";
const inspirecloud = new InspireCloud({ serviceId });

export default {
  name: "Login",
  data() {
    return {
      formLabelAlign: {
        username: "",
        password: "",
        phoneNumber: "",
        code: "",
        type: "",
      },
      isLogining: false,
      activeName: "user",
      sendDisabled: false,
      second: 0,
    };
  },
  computed: {
    computedSecond() {
      return this.second > 0 ? this.second : "";
    },
  },
  methods: {
    changeMode(tab, event) {
      console.log(tab);
      this.formLabelAlign = {};
    },
    handleRouter(target) {
      this.$router.push(target);
    },
    stopSecond() {
      this.sendDisabled = true;
      this.second = 60;
      const promise = new Promise((resolve) => {
        const setTimer = setInterval(() => {
          this.second -= 1;
          if (this.second <= 0) {
            resolve(setTimer);
          }
        }, 1000);
      });
      promise.then((setTimer) => {
        clearInterval(setTimer); // disable为false可再次点击
        this.sendDisabled = false;
      });
    },
    sendMessage() {
      this.stopSecond();
      const phoneNumber = this.formLabelAlign.phoneNumber;
      if (phoneNumber.length !== 11) {
        ElMessage({
          message: "手机号格式不对",
          center: true,
          type: "warning",
        });
        return;
      }

      return inspirecloud
        .run("sendMessageAPI", {
          phoneNumber,
        })
        .then((res) => {
          console.log(res);
        });
    },

    usernameLogin() {
      this.isLogining = true;
      const username = this.formLabelAlign.username;
      const password = this.formLabelAlign.password;

      inspirecloud
        .run("loginByUsername", { username, password })
        .then((res) => {
          if (res.success) {
            this.formLabelAlign = {};
            ElMessage({
              message: "登录成功",
              center: true,
              type: "success",
            });
            this.$router.push("/home/calendar");
          } else {
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
      this.isLogining = false;
    },
    phonenumLogin() {
      this.isLogining = true;
      const phoneNumber = this.formLabelAlign.phoneNumber;
      const code = this.formLabelAlign.code;

      inspirecloud
        .run("loginByPhoneNum", {
          phoneNumber,
          code,
        })
        .then((res) => {
          if (res.success) {
            this.formLabelAlign = {};
            ElMessage({
              message: "登录成功",
              center: true,
              type: "success",
            });
            this.isLogining = false;
            this.$router.push("/home/calendar");
          } else {
            ElMessage({
              message: res.message,
              center: true,
              type: "error",
            });
            this.isLogining = false;
          }
        });
    },
  },
};
</script>

<template>
  <div class="loginContainer">
    <h1 class="loginLogo">回归日历</h1>
    <div class="loginForm">
      <el-tabs
        v-model="activeName"
        @tab-click="changeMode"
        v-loading="isLogining"
      >
        <el-tab-pane label="账号密码登录" name="user"
          ><el-form
            :label-position="'top'"
            label-width="100px"
            :model="formLabelAlign"
          >
            <el-form-item label="用户名">
              <el-input v-model="formLabelAlign.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input
                type="password"
                v-model="formLabelAlign.password"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="usernameLogin">
                登录
              </el-button>
              <el-button @click="handleRouter('/register')">
                注册账号
              </el-button>
            </el-form-item>
          </el-form></el-tab-pane
        >

        <el-tab-pane label="手机号登录" name="phone"
          ><el-form
            :label-position="'top'"
            label-width="100px"
            :model="formLabelAlign"
          >
            <el-form-item label="手机号">
              <el-input v-model="formLabelAlign.phoneNumber"></el-input>
              <el-button
                class="seedMessage"
                @click="sendMessage"
                :disabled="sendDisabled"
                >{{ computedSecond }}发送验证码</el-button
              >
            </el-form-item>
            <el-form-item label="验证码">
              <el-input
                type="password"
                v-model="formLabelAlign.code"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="phonenumLogin">
                登录
              </el-button>
              <el-button> 注册账号 </el-button>
            </el-form-item>
          </el-form></el-tab-pane
        >
      </el-tabs>
    </div>
  </div>
</template>

<style scope lang="less">
.loginContainer {
  // background-color: aqua;
  width: 100vw;
  height: 100vh;
  background-image: url('../../../public/login3.jpg') ;
  background-size:cover;
  .loginLogo {
    padding-top: 80px; 
    letter-spacing: 1.5rem;
    font-weight: 800;
    font-size: 2.5rem;
    text-shadow: 2px 2px  turquoise;
    // background-image:-webkit-linear-gradient(bottom,red,#ff5f60,#f0c41b); 
    // -webkit-background-clip:text; 
    // -webkit-text-fill-color:transparent;
    margin: 0 auto;
    color: white;
  }
  
  .loginForm {
    position: absolute;
    background-color: white;
    border-radius: 15px;
    padding: 20px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;

    .seedMessage {
      position: relative;
      top: -32px;
      float: right;
    }
  }
}
</style>
