<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="330"></el-table-column>
        <el-table-column prop="path" label="路径" width="330"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data() {
    return {
      rightsList: []
    };
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get(`rights/list`);
      console.log(res);
      this.rightsList = res.data;
    }
  },
  created() {
    this.getRightsList();
  }
};
</script>

<style lang="less" scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}
</style>