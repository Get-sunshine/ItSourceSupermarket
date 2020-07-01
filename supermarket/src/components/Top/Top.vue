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
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  {{account}}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="userCenter">个人中心</el-dropdown-item>
                  <el-dropdown-item command="logout">退出系统</el-dropdown-item>
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
import localStor from '@/utils/localStor.js';
export default {
  // 数据
  data (){
    return{
      account:'',
    }
  },
  methods:{
    // 获取当前用户
    getCurrentAccount(){
      this.$http.get('account/currentaccount').then((res) => {
        let {code,messsage,result} = res.data;
        if(code===0){
          this.account=result.account;
          return;
        }
        this.$message.error('遇到错误，请重新登录');
        this.$router.push('/login');
        return;
      })
    },
    //退出系统
    logout(){
      localStor.remove('zsy_hy');
      this.$message({
        type:'info',
        message:'退出成功'
      });
      setTimeout(() => {
        this.$router.push('/login');
      }, 1000);
    },
    // 个人中心、退出系统
    handleCommand(command){
      if(command==='userCenter'){
        alert('还未开发');
        return;
      }
      this.logout();
      return;
    }
  },
  // 生命周期函数
  created (){
    this.getCurrentAccount();
  }
};
</script>

<style lang="less">
@import "./top.less";
</style>