<script>
import InspireCloud from "@byteinspire/js-sdk";
const serviceId = "qcl7ts";
const inspirecloud = new InspireCloud({ serviceId });

export default {
  name: "Setting",
  setup() {},
  mounted() {
    this.getUserInfo();
  },
  data() {
    return {
      phoneNumber: "",
      code: "",
      username: "",
      newPassword: "",
      confirmPassword: "",
      passwordLoading: false,
    };
  },
  methods: {
    getUserInfo() {
      inspirecloud.run("getUserInfo").then((res) => {
        const user = res.user;
        console.log(user);
        this.username = user.username;
        this.phoneNumber = user.phoneNumber;
      });
    },
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
    bindPhone() {
      const phoneNumber = this.phoneNumber;
      if (phoneNumber.length !== 11) {
        ElMessage({
          message: "手机号格式不对",
          center: true,
          type: "warning",
        });
        return;
      }
      inspirecloud.run("bindPhonenum", { phoneNumber }).then((res) => {
        if (res.success) {
          ElMessage({
            message: "绑定成功",
            center: true,
            type: "success",
          });
        } else {
          ElMessage({
            message: res.message,
            center: true,
            type: "error",
          });
        }
      });
    },
    changePassword() {
      const newPassword = this.newPassword;
      const confirmPassword = this.confirmPassword;
      if (newPassword !== confirmPassword) {
        ElMessage({
          message: "两次密码不相同",
          center: true,
          type: "error",
        });
        this.newPassword = "";
        this.confirmPassword = "";
      }
      this.passwordLoading = true;

      inspirecloud.run("changePassword", { newPassword }).then((res) => {
        this.passwordLoading = false;
        if (res.success) {
          ElMessage({
            message: "密码修改成功",
            center: true,
            type: "success",
          });
          setTimeout(() => {
            handleLogout();
          }, 500);
        } else {
          ElMessage({
            message: res.message,
            center: true,
            type: "error",
          });
        }
      });
    },
    validPhone(phoneNumber) {
      if (phoneNumber.length === 11) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<template>
  <h2>设置中心</h2>
  <el-tabs :tab-position="'left'" style="height: 400px">
    <el-tab-pane label="个人信息">
      <div class="userInfo">
        <el-form :label-position="'top'" label-width="100px">
          <el-form-item label="用户名">
            <el-input v-model="username" disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="phoneNumber" disabled="true"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-tab-pane>
    <el-tab-pane label="修改密码">
      <div class="changePassword">
        <el-form :label-position="'top'" label-width="100px">
          <el-form-item label="新密码">
            <el-input v-model="newPassword" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认新密码">
            <el-input v-model="confirmPassword" show-password></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="changePassword"
              :loading="passwordLoading"
            >
              更改密码
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-tab-pane>
    <el-tab-pane label="绑定手机号">
      <div class="bindPhone">
        <el-form :label-position="'top'" label-width="100px">
          <el-form-item label="手机号">
            <el-input v-model="phoneNumber"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="bindPhone"> 绑定 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="less">
.bindPhone {
  width: 300px;
  margin-left: 20px;
  .seedMessage {
    float: right;
    transform: translateY(-32px);
  }
}

.userInfo {
  width: 300px;
  margin-left: 20px;
  text-align: left;
  .title {
  }
  .infoContent {
  }
}

.changePassword {
  width: 300px;
  margin-left: 20px;
  text-align: left;
}
</style>
