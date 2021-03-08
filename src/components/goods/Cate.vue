<template>
  <div>
    <!-- 面包屑导航 -->
    <crumb v-bind:data="crumbData"></crumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 添加按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <tree-table
        :data="CateList"
        :show-index="true"
        index-text="#"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        border
        :show-row-hover="false"
      >
        <!-- 作用域插槽 -->
        <!-- 定义模板:是否有效 -->
        <template v-slot:isok="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen;"
          ></i>
          <i class="el-icon-error" v-else style="color:red;"></i>
        </template>

        <!-- 排序 -->
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>

        <!-- 操作 -->
        <!--  -->
        <template v-slot:operate="scope">
          <el-button icon="el-icon-edit" type="primary" size="small" @click="editCate(scope.row)">编辑</el-button>
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="small"
            @click="deleteCate(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatedialogVisible"
      width="40%"
      @close="addCateDialogClose"
    >
      <el-form ref="cateFormRef" :rules="addCateRules" :model="addCateForm" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectKeys"
            :options="ParantCateList"
            :props="CascaderProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类对话框 -->

    <el-dialog title="修改分类" :visible.sync="editCateDialogVisible" width="40%">
      <el-form
        ref="editcateFormRef"
        :rules="editCateRules"
        :model="editCateForm"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="editCateName">
          <el-input v-model="editCateForm.editCateName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      CateList: [],
      //查询条件
      queryInfo: {
        type: 3,
        pagenum: 3,
        pagesize: 5
      },
      total: 0,
      crumbData: ["首页", "商品管理", "商品分类"],
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          // 将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用的模板名称 （具名）
          template: "isok"
        },
        {
          label: "排序",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "operate"
        }
      ],
      addCatedialogVisible: false,
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      addCateRules: {
        cat_name: [
          { required: true, message: "分类名称不能为空", trigger: "blur" }
        ]
      },
      ParantCateList: [],
      //指定级联选择器的配置选项
      CascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: "true"
      },
      //选中的父级分类id数组
      selectKeys: [],
      editCateDialogVisible: false,
      editCateForm: {
        editCateName: "",
        editCateId: ""
      },
      editCateRules: {
        editCateName: [
          { required: true, message: "分类名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$messgae.error("获取商品分类数据失败");
      }
      console.log(res.data);

      this.CateList = res.data.result;
      this.total = res.data.total;
      // console.log(this.CateList);
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    showAddCateDialog() {
      this.addCatedialogVisible = true;
      this.getParantCateList();
    },
    //获取父级分类的数据列表
    async getParantCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: {
          type: 2
        }
      });

      if (res.meta.status !== 200)
        return this.$message.erroe("获取父级分类数据失败");
      console.log(res.data);

      this.ParantCateList = res.data;
    },
    //选择项发生变化触发这个函数
    parentCateChange() {
      console.log(this.selectKeys);
      if (this.selectKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1];
        // 等级赋值
        this.addCateForm.cat_level = this.selectKeys.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        // 等级赋值
        this.addCateForm.cat_level = 0;
      }
    },
    addCate() {
      console.log(this.addCateForm);
      //表单域验证
      this.$refs.cateFormRef.validate(async valid => {
        if (!valid) return this.$message.error("表单数据错误，请重新填写");
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error("添加分类失败");
        this.$message.success("添加分类成功");
        this.getCateList();
        this.addCatedialogVisible = false;
      });
    },
    //重置表单数据
    addCateDialogClose() {
      this.$refs.cateFormRef.resetFields();
      this.selectKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
    editCate(cate) {
      this.editCateDialogVisible = true;
      console.log(cate);
      this.editCateForm.editCateName = cate.cat_name;
      this.editCateForm.editCateId = cate.cat_id;
    },
    editConfirm() {
      //表单域验证
      this.$refs.editcateFormRef.validate(async valid => {
        if (!valid) return this.$message.error("表单内容错误，请重新输入");
        const { data: res } = await this.$http.put(
          `categories/${this.editCateForm.editCateId}`,
          {
            cat_name: this.editCateForm.editCateName
          }
        );
        console.log(res);

        if (res.meta.status !== 200)
          return this.$message.error("商品分类信息更新失败");
        console.log(res.data);
        this.editCateDialogVisible = false;
      });
    },
    async deleteCate(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      // console.log(confirmResult);
      if (confirmResult === "confirm") {
        const { data: res } = await this.$http.delete(`categories/${id}`);
        if (res.meta.status !== 200) return this.$message.error("删除分类失败");
        // console.log(res);
        this.$message.success("删除分类成功");
        this.getCateList();
      }
    }
  },
  created() {
    this.getCateList();
  }
};
</script>

<style  lang="less" scope>
.el-cascader-panel {
  height: 200px;
  width: 100%;
}
</style>