<template>
  <!-- 添加对话框 -->
  <el-dialog :title="modalTitle" :visible="showModal" width="40%"> </el-dialog>
</template>

<script>
export default {
  name: 'commonModal',
  prop: {
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
    },
    cancle: {
      type: Function,
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
}
</script>

<style></style>
