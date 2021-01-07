<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="login_head">
        <img src="../assets/images/logo.png" alt />
      </div>
      <!-- 登录表单区 -->
      <el-form
        label-width="0"
        ref="loginFormRef"
        class="login_form"
        :rules="loginRules"
        :model="loginForm"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-yonghuming
" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="loginbtn">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        // 验证用户名是否合法
        username: [
          {
            required: true,
            message: "请输入登录名称",
            trigger: "blur"
          },
          {
            min: 3,
            max: 16,
            message: "用户名长度需为3~16位之间",
            trigger: "blur"
          }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "密码需要在6~16位之间", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    reset() {
      // console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
    loginbtn() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        //post方法返回一个Promise对象 使用async 函数
        //async表示该函数中有异步操作 await表示后面表达式需要等待结果
        //使用对象解构 并起别名，此时获得的data数据干净
        const { data: res } = await this.$http.post("login", this.loginForm);
        //通过res.meta.status状态码判断请求
        if (res.meta.status === 200) {
          return this.$message.success("登陆成功");
        } else {
          return this.$message.error("登陆失败！");
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  position: relative;
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 5px;

  .login_head {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 130px;
    height: 130px;
    padding: 10px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0 0 10px #ddd;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>