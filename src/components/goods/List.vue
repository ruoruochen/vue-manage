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
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="editById(scope.row.goods_id)"
            >编辑</el-button>
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

    <!-- 修改对话框 -->
    <el-dialog title="修改商品信息" :visible.sync="editDialogVisible" width="40%">
      <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="120px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </span>
    </el-dialog>
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
      },
      editDialogVisible: false,
      editForm: {
        goods_id: "",
        goods_name: "",
        goods_price: "",
        goods_goods_number: "",
        goods_weight: ""
      },
      editFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ]
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
    },
    async editById(id) {
      // 根据id查询商品
      const { data: res } = await this.$http.get(`goods/${id}`);
      console.log(res);

      if (res.meta.status !== 200)
        return this.$message.error("获取商品信息失败");

      console.log(res.data);
      this.editForm = res.data;
      console.log(this.editForm);

      this.editDialogVisible = true;
    },
    editConfirm() {
      // 预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error("表单验证失败，请重新填写表单");
        const { data: res } = await this.$http.put(
          `goods/${this.editForm.goods_id}`,
          this.editForm
        );
        console.log(res);

        if (res.meta.status !== 200)
          return this.$message.error("商品信息修改失败");
        this.$message.success("商品信息修改成功");
        this.editDialogVisible = false;
        this.getGoodsList();
      });
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