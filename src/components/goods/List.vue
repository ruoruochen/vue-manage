<template>
  <div>
    <!-- 面包屑导航 -->
    <crumb v-bind:data="crumbData"></crumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="ClearSearch"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="SearchGoods"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <CommonTable
        :tableData="goodsList"
        :tableTitle="tableTitle"
        :tableCol="tableCol"
        :pageConfig="queryInfo"
        :operator="operator"
        :total="total"
        @sizeChange="handleSizeChange"
        @pageChange="handleCurrentChange"
      ></CommonTable>
    </el-card>

    <!-- 修改对话框 -->
    <el-dialog
      title="修改商品信息"
      :visible.sync="editDialogVisible"
      width="40%"
    >
      <el-form
        ref="editFormRef"
        :rules="editFormRules"
        :model="editForm"
        label-width="120px"
      >
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
import CommonTable from '../commons/CommonTable.vue'
export default {
  name: 'List',
  components: {
    CommonTable,
  },
  data() {
    return {
      goodsList: [],
      total: 0,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      editDialogVisible: false,
      editForm: {
        goods_id: '',
        goods_name: '',
        goods_price: '',
        goods_goods_number: '',
        goods_weight: '',
      },
      editFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
      },
      crumbData: ['首页', '商品管理', '商品列表'],
      tableTitle: {
        stripe: true,
        border: true,
      },
      tableCol: [
        { prop: 'goods_name', label: '商品名称', width: '430' },
        { prop: 'goods_price', label: '商品价格（元）', width: '110' },
        { prop: 'goods_weight', label: '商品重量', width: '100' },
        {
          prop: 'add_time',
          label: '创建时间',
          width: '200',
          formatter: 'dateFormat',
        },
      ],
      operator: [
        {
          type: 'primary',
          icon: 'el-icon-edit',
          text: '编辑',
          click: (row) => {
            this.editById(row.goods_id)
          },
        },
        {
          type: 'danger',
          icon: 'el-icon-delete',
          text: '删除',
          click: (row) => {
            this.removeById(row.goods_id)
          },
        },
      ],
    }
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取商品列表失败')
      console.log(res.data)
      this.goodsList = res.data.goods
      this.total = res.data.total
      console.log(this.goodsList)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    SearchGoods() {
      this.getGoodsList()
    },
    ClearSearch() {
      this.getGoodsList()
    },
    async removeById(id) {
      const result = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      if (result === 'confirm') {
        const { data: res } = await this.$http.delete(`goods/${id}`)
        if (res.meta.status !== 200) return this.$message.error('商品删除失败')
        this.$message.success('商品删除成功')
        this.getGoodsList()
        return
      }
      this.$message('已取消删除商品')
    },
    addGoods() {
      this.$router.push('/goods/add')
    },
    async editById(id) {
      // 根据id查询商品
      const { data: res } = await this.$http.get(`goods/${id}`)
      console.log(res)

      if (res.meta.status !== 200)
        return this.$message.error('获取商品信息失败')

      console.log(res.data)
      this.editForm = res.data
      console.log(this.editForm)

      this.editDialogVisible = true
    },
    editConfirm() {
      // 预验证
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('表单验证失败，请重新填写表单')
        const { data: res } = await this.$http.put(
          `goods/${this.editForm.goods_id}`,
          this.editForm
        )
        console.log(res)

        if (res.meta.status !== 200)
          return this.$message.error('商品信息修改失败')
        this.$message.success('商品信息修改成功')
        this.editDialogVisible = false
        this.getGoodsList()
      })
    },
    change(originVal) {
      const dt = new Date(originVal)

      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + '').padStart(2, '0')
      const d = (dt.getDate() + '').padStart(2, '0')

      const hh = (dt.getHours() + '').padStart(2, '0')
      const mm = (dt.getMinutes() + '').padStart(2, '0')
      const ss = (dt.getSeconds() + '').padStart(2, '0')
      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    },
  },
  computed: {},
  created() {
    this.getGoodsList()
  },
}
</script>

<style lang="less" scoped>
.el-input {
  width: 350px !important;
}
</style>
