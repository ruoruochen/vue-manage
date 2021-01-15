<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="ClearSearch">
            <el-button slot="append" icon="el-icon-search" @click="SearchGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 显示数据表格 -->
      <el-table :data="goodsList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="430"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="110"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100"></el-table-column>
        <el-table-column label="创建时间" width="200">
          <template v-slot="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="removeById(scope.row.goods_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15,20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "List",
  data() {
    return {
      goodsList: [],
      total: 0,
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      }
    };
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败");
      console.log(res.data);
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      console.log(this.goodsList);
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    SearchGoods() {
      this.getGoodsList();
    },
    ClearSearch() {
      this.getGoodsList();
    },
    async removeById(id) {
      const result = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (result === "confirm") {
        const { data: res } = await this.$http.delete(`goods/${id}`);
        if (res.meta.status !== 200) return this.$message.error("商品删除失败");
        this.$message.success("商品删除成功");
        this.getGoodsList();
        return;
      }
      this.$message("已取消删除商品");
    },
    addGoods() {
      this.$router.push("/goods/add");
    }
  },
  computed: {},
  created() {
    this.getGoodsList();
  }
};
</script>

<style lang="less" scoped>
.el-input {
  width: 350px !important;
}
</style>