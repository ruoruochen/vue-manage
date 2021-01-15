<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 2.为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
//1.导入
var echarts = require("echarts");
import _ from "lodash";

export default {
  name: "Report",
  data() {
    return {
      option: {
        title: {
          text: "ECharts 入门示例"
        },
        tooltip: {},
        legend: {
          data: ["销量"]
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      }
    };
  },
  //此时dom元素渲染完毕
  async mounted() {
    // 3.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));
    // 4.指定图表的配置项和数据
    const { data: res } = await this.$http.get(`reports/type/1`);
    if (res.meta.status !== 200) return this.$message.error("获取数据失败");

    const result = _.merge(res.data, this.option);
    // 5.使用刚指定的配置项和数据显示图表。
    myChart.setOption(result);
  }
};
</script>

<style lang="less" scoped>
</style>