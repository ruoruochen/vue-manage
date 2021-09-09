<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :stripe="tableTitle.stripe"
      :border="tableTitle.border"
    >
      <!--表格第一列-->
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <!--表格其它列-->
      <el-table-column
        v-for="(value, index) in tableCol"
        :key="index"
        :prop="value.prop"
        :label="value.label"
        :width="value.width || 180"
      >
        <template slot-scope="scope">
          <template v-if="!value.render">
            <template v-if="value.formatter === 'dateFormat'">
              {{ scope.row[value.prop] | dateFormat }}
            </template>
            <template v-else>
              {{ scope.row[value.prop] }}
            </template>
          </template>
          <!--扩展dom 渲染特殊显示-->
          <template v-else-if="value.render === 'switch'" slot-scope="scope">
            <el-switch
              v-model="scope.row[value.prop]"
              :active-color="value.activeColor"
              @change="value.event(scope.row)"
            ></el-switch>
          </template>
        </template>
      </el-table-column>
      <!--基础操作-->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-for="(value, index) in operator"
            :type="value.type"
            :icon="value.icon"
            :size="value.size || 'small'"
            @click="value.click(scope.row, value)"
            :key="`${value}-${index}`"
          >
            {{ value.text }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页插件-->
    <el-pagination
      v-show="total > 0"
      :total="total"
      :page-size="pageConfig.pagesize"
      :current-page="pageConfig.pagenum"
      :page-sizes="[1, 2, 4, 6]"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'commontable',
  props: {
    tableTitle: {
      type: Object,
      default: {
        stripe: false,
        border: false,
      },
    },
    tableCol: {
      type: Array,
      default: [],
    },
    tableData: {
      type: Array,
      default: [],
    },
    operator: {
      type: Array,
      default: [],
    },
    total: {
      type: Number,
      default: 0,
    },
    pageConfig: {
      type: Object,
      default: {},
    },
  },

  methods: {
    // 监听每页多少条数据（limit）
    handleSizeChange(limit) {
      this.$emit('sizeChange', limit)
    },
    // 监听当前是第几页（page）
    handleCurrentChange(page) {
      this.$emit('pageChange', page)
    },
  },
}
</script>

<style></style>
