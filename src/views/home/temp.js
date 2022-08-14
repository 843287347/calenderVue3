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
