<template>
  <div>
    <!-- 面包屑导航 -->
    <crumb v-bind:data="crumbData"></crumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="clearSearch"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 通用表格组件 -->
      <CommonTable
        :tableTitle="tableTitle"
        :tableCol="tableCol"
        :tableData="userList"
        :operator="operator"
        :total="total"
        :pageConfig="queryInfo"
        @sizeChange="handleSizeChange"
        @pageChange="handleCurrentChange"
      />
    </el-card>

    <!-- 添加用户的对话框 -->
    <CommonModal
      modalTitle="添加用户"
      :showModal="addDialogVisible"
      :dataRules="addRules"
      :submit="addUser"
      :cancel="cancelModal"
      :formConfig="formConfig"
    />

    <!-- 修改用户的对话框 -->
    <CommonModal
      modalTitle="添加用户"
      :showModal="addDialogVisible"
      :dataRules="addRules"
      :submit="addUser"
      :cancel="cancelModal"
      :formConfig="formConfig"
    />

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="40%"
      @close="editDialogClosed"
    >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>分配新角色</p>
        <el-select v-model="selectRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CommonTable from '../commons/CommonTable.vue'
import CommonModal from '../commons/CommonModal.vue'
export default {
  name: 'User',
  components: {
    CommonTable,
    CommonModal,
  },
  data() {
    var validatorPhone = (rule, value, callback) => {
      //手机号验证规则
      var reg = /^1[3|4|5|7|8][0-9]{9}$/
      if (!reg.test(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    var validatorEmail = (rule, value, callback) => {
      var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (!reg.test(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }
    return {
      queryInfo: {
        query: '',
        //当前页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 2,
      },
      userList: [],
      total: 0,
      //控制添加用户对话框的显示和隐藏
      addDialogVisible: false,
      // 控制修改用户对话框的显示和隐藏
      editDialogVisible: false,
      addRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            min: 3,
            max: 16,
            message: '用户名长度需在3~16位之间',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '密码长度需在6~16位之间',
            trigger: 'blur',
          },
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            validator: validatorPhone,
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: validatorEmail, trigger: 'blur' },
        ],
      },
      editRules: {
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: validatorEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
        ],
      },
      editUser: {},
      setRoleDialogVisible: false,
      userInfo: [],
      rolesList: [],
      selectRoleId: '',
      crumbData: ['首页', '用户管理', '用户列表'],
      tableTitle: { stripe: true, border: true },
      tableCol: [
        { prop: 'username', label: '用户名' },
        { prop: 'mobile', label: '手机号' },
        { prop: 'email', label: '邮箱', width: '220' },
        {
          prop: 'mg_state',
          label: '状态',
          width: '160',
          render: 'switch',
          activeColor: '#13ce66',
          event: (row) => {
            return this.userStateChange(row)
          },
        },
      ],
      operator: [
        {
          text: '修改',
          type: 'primary',
          icon: 'el-icon-edit',
          click: (row) => {
            return this.showEditDialog(row.id)
          },
        },
        {
          text: '删除',
          type: 'danger',
          icon: 'el-icon-delete',
          click: (row) => {
            return this.deleteUser(row.id)
          },
        },
        {
          text: '权限设置',
          type: 'danger',
          icon: 'el-icon-setting',
          click: (row) => {
            return this.showSetRoleDialog(row)
          },
        },
      ],
      formConfig: [
        { prop: 'username', label: '用户名' },
        { prop: 'password', label: '密码', type: 'password' },
        { prop: 'mobile', label: '手机号' },
        { prop: 'email', label: '邮箱' },
      ],
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取用户列表失败')
      this.userList = res.data.users
      this.total = res.data.total
      console.log(this.userList)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    async userStateChange(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新用户列表失败')
        this.userinfo.mg_state = !this.userinfo.mg_state
      }
      this.$message.success('更新用户状态成功')
    },
    clearSearch() {
      this.queryInfo.query = ''
      this.getUserList()
    },
    async showEditDialog(id) {
      console.log(id)
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200)
        return this.$message.error('获取用户信息失败')
      this.editUser = res.data
      console.log(res.data)
    },
    CloseEdit() {
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('表单内容错误，请重新输入！')

        // 发送网络请求，修改
        const { data: res } = await this.$http.put(
          `users/${this.editUser.id}`,
          this.editUser
        )
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('用户信息更新失败')
        }
        this.$message.success('用户信息更新成功')
        this.editDialogVisible = false
        this.getUserList()
      })
    },
    async deleteUser(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除',
        })
      }
      const { data: res } = await this.$http.delete(`users/${id}`)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message({
        type: 'success',
        message: '删除用户成功!',
      })
      this.getUserList()
    },
    async showSetRoleDialog(userinfo) {
      // 在展示对话框之前获取角色列表
      const { data: res } = await this.$http.get('roles')
      console.log(res)
      if (res.meta.status !== 200)
        return this.$message.error('获取用户列表失败')
      this.rolesList = res.data
      this.userInfo = userinfo
      this.setRoleDialogVisible = true
    },
    async saveRoleInfo() {
      //判断用户是否选择角色
      if (!this.selectRoleId) {
        return this.$message.error('请选择要分配的角色')
      }
      // 分配用户角色
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectRoleId,
        }
      )
      console.log(res)
      if (res.meta.status !== 200) return this.$message.erro('分配角色失败')
      this.$message.success('分配角色成功')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    editDialogClosed() {
      this.selectRoleId = ''
      this.userInfo = []
    },
    async addUser(data) {
      this.addDialogVisible = false
      const { data: res } = await this.$http.post('users', data)

      if (res.meta.status !== 201) return this.$message.error('添加用户失败')
      this.$message.success('添加用户成功')
      this.getUserList()
    },
    cancelModal() {
      this.addDialogVisible = false
    },
  },
}
</script>

<style lang="less" scoped>
.text {
  font-size: 14px;
}
.item {
  padding: 18px 0;
}
.box-card {
  width: 480px;
}
</style>
