<template>
  <div>
    <!-- 面包屑导航 -->
    <crumb v-bind:data="crumbData"></crumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 警告区 -->
      <el-alert show-icon title="警告" type="warning" :closable="false"></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="col_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择框： -->
          <el-cascader
            v-model="selectCateKeys"
            :options="CateList"
            :props="CateProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态属性" name="many">
          <el-button type="primary" size="mini" :disabled="btnStatu" @click="showAddDialog">添加参数</el-button>
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="showEditDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  @click="showDeleteDialog(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="btnStatu" @click="showAddDialog">添加属性</el-button>
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="showEditDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  @click="showDeleteDialog(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数/属性对话框 -->
    <el-dialog
      :title="titleText"
      :visible.sync="addParamDialogVisible"
      width="40%"
      @close="addDialogClose"
    >
      <el-form ref="addFormRef" :rules="addFormRules" :model="addForm" label-width="120px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
      title="修改参数"
      :visible.sync="editParamDialogVisible"
      width="40%"
      @close="editDialogClose"
    >
      <el-form ref="editFormRef" :rules="addFormRules" :model="editForm" label-width="120px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      CateList: [],
      // 级联选择框的配置对象
      CateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover"
      },
      //级联选择框双向绑定的数组
      selectCateKeys: [],
      // 被激活的页签名称
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      addParamDialogVisible: false,
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      addForm: {
        attr_name: ""
      },
      editParamDialogVisible: false,
      editForm: {
        attr_name: "",
        attr_id: ""
      },
      crumbData: ["首页", "商品管理", "参数列表"]
    };
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类数据列表失败");
      console.log(res.data);
      this.CateList = res.data;
    },
    //级联选择项变化
    handleChange() {
      console.log(this.selectCateKeys);
      // 获取分类参数
      if (this.selectCateKeys.length > 0) {
        this.getParams();
      }
    },
    //Tab页签点击事件
    handleTabClick() {
      // 获取分类参数
      if (this.selectCateKeys.length > 0) {
        this.getParams();
      }
    },
    async getParams() {
      const { data: res } = await this.$http.get(
        `categories/${
          this.selectCateKeys[this.selectCateKeys.length - 1]
        }/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      );

      if (res.meta.status !== 200) {
        return this.$message.error("获取分类参数失败");
      }

      //将attr_val从字符串变为数组
      res.data.forEach(item => {
        //控制文本框的显示与隐藏
        item.inputVisible = false;
        item.inputValue = "";
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
      });
      console.log(res.data);
      //动态
      if (this.activeName === "many") {
        this.manyTableData = res.data;
        console.log(this.manyTableData);
      }
      //静态
      else {
        this.onlyTableData = res.data;
        console.log(this.onlyTableData);
      }
    },
    showAddDialog() {
      this.addParamDialogVisible = true;
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    addParamConfirm() {
      //预验证
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error("表单信息错误，请重新填写");
        const { data: res } = await this.$http.post(
          `categories/${
            this.selectCateKeys[this.selectCateKeys.length - 1]
          }/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 201) return this.$message.error("添加参数失败");
        console.log(res.data);
        this.$message.success("添加参数成功");
        this.addParamDialogVisible = false;
        this.getParams();
      });
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    editParamConfirm() {
      // 表单域验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error("表单数据错误，请重新输入");
        const { data: res } = await this.$http.put(
          `categories/${
            this.selectCateKeys[this.selectCateKeys.length - 1]
          }/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 200) return this.$message.error("修改参数失败");
        console.log(res);
        this.$message.success("修改参数成功");
        this.editParamDialogVisible = false;
        this.getParams();
      });
    },
    showEditDialog(p) {
      this.editForm.attr_id = p.attr_id;
      this.editForm.attr_name = p.attr_name;
      this.editParamDialogVisible = true;
    },
    async showDeleteDialog(p) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult === "confirm") {
        const { data: res } = await this.$http.delete(
          `categories/${
            this.selectCateKeys[this.selectCateKeys.length - 1]
          }/attributes/${p.attr_id}`
        );
        if (res.meta.status !== 200) return this.$message.error("参数删除失败");
        this.$message.success("参数删除成功");
        this.getParams();
      }
    },
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      //添加参数
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      this.saveAttrVals(row);
    },
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleClose(i, row) {
      var ar = [1, 2, 3, 4, 5];
      ar.splice(1, 1);
      console.log(ar);
      console.log(row.attr_vals);

      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    },
    async saveAttrVals(row) {
      // 发起请求
      const { data: res } = await this.$http.put(
        `categories/${
          this.selectCateKeys[this.selectCateKeys.length - 1]
        }/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(",")
        }
      );
      if (res.meta.status !== 200) return this.$message.error("修改失败");
      console.log(res);
      this.$message.success("修改成功");
    }
  },
  created() {
    this.getCateList();
  },
  computed: {
    btnStatu() {
      return this.selectCateKeys.length === 0 ? true : false;
    },
    //动态生成对话框标题
    titleText() {
      return this.activeName === "many" ? "添加动态参数" : "添加静态属性";
    }
  }
};
</script>

<style lang="less" scoped>
.col_opt {
  margin: 15px 0;
}

.el-tag {
  margin-right: 20px;
  margin-top: 10px;
}

.button-new-tag {
  margin-top: 15px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  margin-top: 15px;
  width: 120px !important;
}
</style>