<template>
  <div>
    <!-- 面包屑导航 -->
    <crumb v-bind:data="crumbData"></crumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 提示区 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closeabled="false"></el-alert>
      <!-- 步骤条区 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品照片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域 -->
      <el-form ref="addFormRef" :rules="addFormRules" label-position="top" :model="addForm">
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item prop="goods_name" label="商品名称">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item prop="goods_price" label="商品价格">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item prop="goods_weight" label="商品重量">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item prop="goods_number" label="商品数量">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in paramList" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="checkList">
                <el-checkbox v-for="(item2,i2) in item.attr_vals" :key="i2" :label="item2" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="(item,i) in onlyparamList" :key="i" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品照片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadurl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor ref="myQuillEditor" v-model="addForm.goods_introduce" />
            <el-button class="add_goods" type="primary" @click="add">添加商品</el-button>
          </el-tab-pane>
          <el-tab-pane label="完成" name="5">Done</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%">
      <img :src="previewPath" class="previewimg" alt />
      <!-- <el-image src="previ"></el-image> -->
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "Add",
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      cateList: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover"
      },
      paramList: [],
      checkList: [],
      onlyparamList: [],
      fileList: [],
      uploadurl: "http://118.31.171.210:8801/api/private/v1/upload",
      headerObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      previewPath: "",
      previewDialogVisible: false,
      crumbData: ["首页", "商品管理", "添加商品"]
    };
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类数据失败");
      this.cateList = res.data;
      console.log(this.cateList);
    },
    handleChange() {
      console.log(123);
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length === 0) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    tabClick() {
      console.log(this.activeIndex);
      if (this.activeIndex == "1") {
        this.getParamList();
      } else if (this.activeIndex == "2") {
        this.getOnlyParamList();
      }
    },
    async getParamList() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: "many"
          }
        }
      );
      if (res.meta.status !== 200)
        return this.$message.error("参数列表获取失败");
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
      });
      this.paramList = res.data;
      console.log(this.paramList);
    },

    async getOnlyParamList() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: "only"
          }
        }
      );
      if (res.meta.status !== 200)
        return this.$message.error("参数列表获取失败");
      this.onlyparamList = res.data;
      console.log(this.onlyparamList);
    },
    //处理图片预览效果
    handlePreview(file) {
      this.previewDialogVisible = true;
      // 1.获取图片的Url地址
      this.previewPath = file.response.data.url;
    },
    //处理移除图片的操作
    handleRemove(file) {
      // 获取想要删除的临时路径
      // 获取在pics中的索引值
      // 移除
      const path = file.response.data.tmp_path;
      const index = this.addForm.pics.findIndex(x => x.pic === path);
      this.addForm.pics.splice(index, 1);
      console.log(this.addForm.pics);
    },
    handleSuccess(response) {
      console.log(response);
      // 拼接图片信息对象，push至数组
      const picInfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picInfo);
      console.log(this.addForm);
    },
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error("请填写表单必填项！");
        //其他业务逻辑
        // 数组转字符串,对addForm进行深拷贝
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");
        console.log(form);
        // 循环动态参数和静态属性 存入attrs中
        this.paramList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(",")
          };
          this.addForm.attrs.push(newInfo);
        });

        this.onlyparamList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          };
          this.addForm.attrs.push(newInfo);
        });

        form.attrs = this.addForm.attrs;
        console.log(form);

        // 发起请求 添加商品 商品名称是唯一的
        const { data: res } = await this.$http.post("goods", form);
        console.log(res);

        if (res.meta.status !== 201) return this.$message.error("添加商品失败");
        this.$message.success("添加商品成功");
        this.$router.push("/goods");
      });
    }
  },
  created() {
    this.getCateList();
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length !== 0) {
        return this.addForm.goods_cat[this.addForm.goods_cat.length - 1];
      }
    }
  }
};
</script>

<style lang="less" scoped>
.el-cascader-panel {
  height: 200px !important;
}

.el-checkbox {
  margin-left: 10px !important;
}

.previewimg {
  width: 100%;
}

.add_goods {
  margin-top: 20px;
}
</style>