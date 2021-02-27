<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="(item,i) in data" :key="item" :to="getPath(i)">{{item}}</el-breadcrumb-item>
      <!-- <el-breadcrumb-item :to="{ path: '/welcome' }">{{data[0]}}</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>-->
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "crumb",
  props: ["data"],
  methods: {
    getPath(i) {
      if (i === 0) {
        return "{ path: '/welcome' }";
      } else {
        return "#";
      }
    }
  }
};
</script>

<style>
</style>