<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header class="header">
      <div class="left_header">
        <img src="@assets/images/touxiang.jpg" alt />
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主题区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px': '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu
          unique-opened
          background-color="#313743"
          text-color="#fff"
          active-text-color="#409eff"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="$route.path"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="'/'+item.path" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="iconfont" :class="iconList[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/'+item2.path" v-for="item2 in item.children" :key="item2.id">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{item2.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主题内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      menuList: [],
      iconList: {
        "125": "icon-ziyuan",
        "103": "icon-suo",
        "101": "icon-shangpinchuangjian",
        "102": "icon-danju",
        "145": "icon-baobiao"
      },
      isCollapse: false
    };
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMunuList() {
      //发送请求
      const { data: res } = await this.$http.get("menus");
      console.log(res);
      if (res.meta.status !== 200) return this.$messgae.error(res.meta.msg);
      this.menuList = res.data;
    },
    //点击按钮，切换菜单的展开和折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    }
  },
  created() {
    this.getMunuList();
  }
};
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}

.el-header {
  background-color: #363d40;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left_header {
    display: flex;
    align-items: center;
    img {
      width: 60px;
      border-radius: 50%;
    }
    span {
      color: white;
      font-size: 18px;
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #313743;
  .iconfont {
    margin-right: 10px;
  }
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.toggle-button {
  color: white;
  font-size: 12px;
  padding: 3px 0;
  letter-spacing: 0.2em;
  background-color: #495065;
  text-align: center;
  cursor: pointer;
}
.toggle-button :hover {
  color: #409eff;
}
</style>