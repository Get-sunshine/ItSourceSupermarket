<template>
  <div class="left-nav">
    <el-menu router unique-opened :default-active="$route.path" class="el-menu-vertical-demo" background-color="#545c64"  text-color="#fff"  active-text-color="#ffd04b">
      
      <el-submenu v-for="(menu,index) in menus" :index="(index+1)+''" :key="index">
        <template slot="title">
          <i :class="menu.itemClassName"></i>
          <span>{{menu.itemTitle}}</span>
        </template>
        <el-menu-item v-for="(subMenu,index) in  menu.subMenu" :key="index" :index="subMenu.path">{{subMenu.text}}</el-menu-item>
      </el-submenu>

    </el-menu>
  </div>
</template>
<script>
export default {
  data () {
    return {
      //导航菜单数据
      menus:[
        //系统管理
        {
          itemClassName:'el-icon-setting',
          itemTitle:'系统管理',
          subMenu:[
            {path:'/home/systeminfo',text:'系统信息'}
          ]
        },
        {//账号管理
          itemClassName:'el-icon-user',
          itemTitle:'账号管理',
          subMenu:[
            {path:'/home/accountmanage',text:'账号管理'},
            {path:'/home/accountadd',text:'账号添加'},
            {path:'/home/passwordmodify',text:'密码修改'}
          ]
        },
        {//商品管理
          itemClassName:'el-icon-goods',
          itemTitle:'商品管理',
          subMenu:[
            {path:'/home/goodsmanage',text:'商品管理'},
            {path:'/home/goodsadd',text:'商品添加'}
          ]
        },
        {//统计管理
          itemClassName:'el-icon-edit-outline',
          itemTitle:'统计管理',
          subMenu:[
            {path:'/home/salestotal',text:'销售管理'},
            {path:'/home/stocktotal',text:'进货统计'}
          ]
        }
      ]
    }
  }
};
</script>
<style lang="less">
@import './leftnav';
</style>