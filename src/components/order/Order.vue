<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-input placeholder="请输入内容" v-model="queryInfo.query" closeabled @close="searchClose">
            <el-button slot="append" icon="el-icon-search" @click="searchOrder"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 渲染数据的表格 -->
      <el-table :data="orderList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_id" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.order_pay == '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template v-slot="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditBox"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5,10,15,20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="editdialogVisible" width="40%" @close="handleCloseEdit">
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="省市区/县" prop="adress1">
          <el-cascader
            v-model="editForm.adress1"
            :options="cityData"
            :props="cityProps"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="adress2">
          <el-input v-model="editForm.adress2"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示物流进度 -->
    <el-dialog title="物流进度" :visible.sync="progressDialogVisible" width="40%">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in progressList"
          :key="index"
          :timestamp="item.time"
        >{{item.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "../../assets/citydata.js";
import kuaidi from "../../assets/kuaidi.js";

export default {
  name: "Order",
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      orderList: [],
      editdialogVisible: false,
      editForm: {
        adress1: [],
        adress2: ""
      },
      editRules: {
        adress1: [
          { required: true, message: "请选择省市区/县", trigger: "blur" }
        ],
        adress2: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ]
      },
      cityData,
      cityProps: {
        value: "value",
        label: "label",
        children: "children",
        expandTrigger: "hover"
      },
      progressDialogVisible: false,
      progressList: []
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });

      if (res.meta.status !== 200)
        return this.$messgae.error("获取订单列表失败");
      console.log(res.data);
      this.total = res.data.total;
      this.orderList = res.data.goods;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    showEditBox() {
      this.editdialogVisible = true;
    },
    handleChange() {
      console.log(111);
    },
    handleCloseEdit() {
      this.editForm.adress1 = [];
      this.editForm.adress2 = "";
    },
    searchOrder() {
      this.getOrderList();
    },
    searchClose() {
      this.getOrderList();
    },
    async showProgressBox() {
      console.log(111);

      // const { data: res } = await this.$http.get(`/kuaidi/1106975712662`);
      // if (res.meta.status !== 200)
      //   return this.$messgae.error("获取物流数据失败");
      this.progressList = kuaidi.data;
      console.log(this.progressList);
      this.progressDialogVisible = true;
    }
  }
};
</script>

<style less="lang" scoped>
.el-cascader {
  width: 100%;
}
</style>