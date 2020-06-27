import Vue from 'vue'
//引入axios
import axios from 'axios';
// 引入封装好的axios 并挂载
import request from './utils/request'
Vue.prototype.$http=request;
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/base.css';
Vue.use(ElementUI);
Vue.config.productionTip = false
//挂载到vue的原型上
// Vue.prototype.$http=axios;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
