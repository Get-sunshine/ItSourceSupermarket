import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {//登录
    path: '/login',
    component: () => import('../views/Login/Login.vue')
  },
  {//主界面
    path: '/home',
    redirect: '/home/systeminfo',
    component: () => import('../views/Home/Home.vue'),
    children: [
      {//系统信息
        path: '/home/systeminfo',
        component: () => import('../views/SystemInfo/SystemInfo.vue')
      },
      {//账号添加
        path: '/home/accountadd',
        component: () => import('../views/AccountAdd/AccountAdd.vue')
      },
      {//账号管理
        path: '/home/accountmanage',
        component: () => import('../views/AccountManage/AccountManage.vue')
      },
      {//密码修改
        path: '/home/passwordmodify',
        component: () => import('../views/PasswordModify/PasswordModify.vue')
      },
      {//商品添加
        path: '/home/goodsadd',
        component: () => import('../views/GoodsAdd/GoodsAdd.vue')
      },
      {//商品管理
        path: '/home/goodsmanage',
        component: () => import('../views/GoodsManage/GoodsManage.vue')
      },
      {//销售统计
        path: '/home/salestotal',
        component: () => import('../views/SalesTotal/SalesTotal.vue')
      },
      {//进货统计
        path: '/home/stocktotal',
        component: () => import('../views/StockTotal/StockTotal.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
