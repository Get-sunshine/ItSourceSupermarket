<template>
  <div class="home">
    <!-- 容器 -->
    <el-container>
      <!-- 左边 -->
      <el-aside width="200px">
        <LeftNav></LeftNav>
      </el-aside>
      <!-- 右边 -->
      <el-container>
        <el-header>
          <Top ref="Top"></Top>
        </el-header>
        <el-main><router-view @refreshImageUrl='refreshImage'></router-view></el-main>
        <el-footer>
          <Bottom></Bottom>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>
<style lang="less">
@import "./home.less";
</style>
<script>
//引入组件
import LeftNav from '@/components/LeftNav/LeftNav.vue';
import Top from '@/components/Top/Top.vue';
import Bottom from '@/components/Bottom/Bottom.vue';
export default {
  // 组件
  components:{
    LeftNav,
    Top,
    Bottom
  },
  methods:{
    refreshImage(){
      this.$refs.Top.getCurrentAccount();
    }
  }
};
</script>