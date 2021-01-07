<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header class="header">
      Header
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主题区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">Aside</el-aside>
      <!-- 主题内容 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {};
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}

.el-header {
  background-color: #363d40;
}

.el-aside {
  background-color: #313743;
}

.el-main {
  background-color: #eaedf1;
}
</style>