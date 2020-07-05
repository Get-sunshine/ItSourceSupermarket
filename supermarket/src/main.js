import Vue from 'vue'
//引入axios
import axios from 'axios';
// 引入封装好的axios 并挂载
import request from './utils/request'
Vue.prototype.$http = request;
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/base.css';
// 引入echarts
import echarts from 'echarts';
// 挂载
Vue.prototype.echarts = echarts;
// localstorage
import localStor from './utils/localStor'
Vue.use(ElementUI);
Vue.config.productionTip = false
//挂载到vue的原型上
// Vue.prototype.$http=axios;
// 导航守卫
router.beforeEach((to, from, next) => {
  // 获取token
  const token = localStor.get('zsy_hy');
  if (token) {
    // 放行
    next();
    return;
  }
  // 访问登录
  if (to.path === '/login') {
    // 放行
    next();
    return;
  } else {
    // 访问其他
    next('/login');
    return;
  }
});
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
