<template>
  <div>
    <!-- 添加对话框 -->
    <el-dialog
      :title="modalTitle"
      :visible="showModal"
      width="40%"
      @close="cancel"
    >
      <!-- 内容主体区 -->
      <el-form
        ref="commonModalRef"
        label-width="100px"
        :model="modalData"
        :rules="dataRules"
        class="demo-ruleForm"
      >
        <el-form-item
          v-for="config in formConfig"
          :key="config.prop"
          :label="config.label"
          :prop="config.prop"
        >
          <template v-if="config.render"></template>
          <template v-else>
            <el-input
              v-model="modalData[config.prop]"
              :type="config.type"
            ></el-input>
          </template>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'commonModal',
  props: {
    modalTitle: {
      type: String,
    },
    showModal: {
      type: Boolean,
    },
    sureText: {
      type: String,
      default: '确定',
    },
    cancleText: {
      type: String,
      default: '取消',
    },
    dataRules: {
      type: Object,
      default: {},
    },
    submit: {
      type: Function,
      default: function() {},
    },
    cancel: {
      type: Function,
      default: function() {},
    },
    modalData: {
      type: Object,
      default: {},
    },
    formConfig: {
      type: Object,
      default: {},
    },
  },
  methods: {
    async confirm() {
      // 预验证
      this.$refs.commonModalRef.validate(async (valid) => {
        if (!valid) return this.$message.error('表单验证错误，请重新填写表单')
        //发请求提交
        this.submit(this.modalData)
      })
    },
  },
}
</script>

<style></style>
