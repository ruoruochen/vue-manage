<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 添加角色按钮区 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolesList" border style="width: 100%">
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbottom',i1 === 0? 'bdtop':'','vcenter']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级、三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  :class="[i2===0?'':'bdtop','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <el-col :span="18">
                    <el-col>
                      <el-tag
                        :class="['thirdtag']"
                        v-for="(item3) in item2.children"
                        :key="item3.id"
                        type="warning"
                        closable
                        @close="removeById(scope.row,item3.id)"
                      >{{item3.authName}}</el-tag>
                    </el-col>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="300"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              icon="el-icon-edit"
              size="small"
              type="primary"
              @click="editRoles(scope.row.id)"
            >编辑</el-button>
            <el-button
              icon="el-icon-delete"
              size="small"
              type="danger"
              @click="deleteRole(scope.row.id)"
            >删除</el-button>
            <el-button
              icon="el-icon-setting"
              size="small"
              type="warning"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="newRoleDialogVisible" width="50%" @close="closeAdd">
      <!-- 内容主体 -->
      <el-form ref="addRoleRef" :model="newRole" :rules="newRule" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="newRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="newRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleCancel">取 消</el-button>
        <el-button type="primary" @click="addRoleConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="50%" @close="closeEdit">
      <!-- 内容主体 -->
      <el-form ref="editRoleRef" :model="editRole" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="editRole.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleCancel">取 消</el-button>
        <el-button type="primary" @click="editRoleConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="40%">
      <!-- 内容主体 -->
      <!-- 树形控件 -->
      <el-tree
        ref="treeRef"
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      rolesList: [],
      editRoleDialogVisible: false,
      editRole: {},
      newRoleDialogVisible: false,
      newRule: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ]
      },
      newRole: {
        roleId: "",
        roleName: "",
        roleDesc: ""
      },
      setRightDialogVisible: false,
      rightsList: [],
      //树形控件的绑定对象
      treeProps: { label: "authName", children: "children" },
      //默认选中节点id值数组
      defKeys: [],
      roleId: ""
    };
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get(`roles`);
      console.log(res);
      this.rolesList = res.data;
    },
    async editRoles(id) {
      this.editRoleDialogVisible = true;
      // 发出请求
      const { data: res } = await this.$http.get(`roles/${id}`);
      console.log(res);
      this.editRole = res.data;
    },
    editRoleCancel() {
      this.editRoleDialogVisible = false;
      this.$message("已取消角色信息修改");
    },
    editRoleConfirm() {
      // 表单预验证
      this.$refs.editRoleRef.validate(async valid => {
        if (!valid) {
          return this.$message({
            message: "表单信息错误，请重新填写",
            type: "error"
          });
        }

        //预验证通过发起请求
        const { data: res } = await this.$http.put(
          `roles/${this.editRole.roleId}`,
          this.editRole
        );
        console.log(res);
        if (res.meta.status !== 200)
          return this.$message.error("角色信息修改失败");
        this.getRolesList();
        this.editRoleDialogVisible = false;
        this.$message.success("角色信息修改成功");
      });
    },
    deleteRole(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${id}`);
          console.log(res);
          if (res.meta.status !== 200)
            return this.$message.error("角色删除失败");
          this.getRolesList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addRole() {
      this.newRoleDialogVisible = true;
    },
    closeEdit() {
      this.$refs.editRoleRef.resetFields();
    },
    addRoleCancel() {
      this.newRoleDialogVisible = false;
      this.$message("已取消添加角色");
    },
    addRoleConfirm() {
      //表单预验证
      this.$refs.addRoleRef.validate(async valid => {
        if (!valid) return this.$message.error("表单有误，请重新填写");
        const { data: res } = await this.$http.post("roles", {
          roleName: this.newRole.roleName,
          roleDesc: this.newRole.roleDesc
        });
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error("添加角色失败");

        this.newRoleDialogVisible = false;
        this.$message.success("已成功添加角色");
        this.getRolesList();
      });
    },
    closeAdd() {
      this.$refs.addRoleRef.resetFields();
    },
    async removeById(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message({
          type: "info",
          message: "已取消删除"
        });
      }

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`,
        {
          roleId: role.id,
          rightId: rightId
        }
      );
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("删除权限失败");
      role.children = res.data;
      this.$message({
        type: "success",
        message: "删除成功!"
      });
    },
    async showSetRightDialog(role) {
      // 获取所有权限数据并渲染
      const { data: res } = await this.$http.get(`rights/tree`);
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败");
      }
      this.rightsList = res.data;
      console.log(this.rightsList);
      this.roleId = role.id;
      // 获取三级结点id
      this.defKeys = [];
      this.getLeafKeys(role, this.defKeys);
      this.setRightDialogVisible = true;
    },
    //通过递归的形式，获取角色所有三级权限的id
    //递归函数功能：获取所有三级权限id
    //递归出口：当前节点(数组)没有children属性,arr.push。
    //等价表达式:getLeafKeys = node.children.forEach(item => {
    //   this.getLeafKeys(item, arr);
    // });
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach(item => {
        this.getLeafKeys(item, arr);
      });
    },
    //点击为角色分配函数
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      console.log(keys);
      console.log(this.roleId);

      const idStr = keys.join(",");
      console.log(idStr);

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr
        }
      );
      console.log(res);
      if (res.meta.status != 200) return this.$message.error("权限更新失败");
      this.$message.success("权限更新成功。");
      this.getRolesList();
      this.setRightDialogVisible = false;
    }
  },
  created() {
    this.getRolesList();
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 12px 0px;
  margin-right: 5px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}

.thirdtag {
  margin-right: 15px;
}
</style>