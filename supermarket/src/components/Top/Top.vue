<template>
  <div class="top">
    <el-row :gutter="20">
      <el-col :span="20">
        <div class="grid-content bg-purple">
          <h3 class="title">
            <i class="el-icon-s-home"></i>超市管理系统
          </h3>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <el-row>
            <el-col :span="8">
              <div class="avatar">
                <img src="./avatar.jpg" alt />
              </div>
            </el-col>
            <el-col :span="16">
              <el-dropdown>
                <span class="el-dropdown-link">
                  admin
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a">个人中心</el-dropdown-item>
                  <el-dropdown-item command="b">退出系统</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {};
</script>

<style lang="less">
@import "./top.less";
</style>