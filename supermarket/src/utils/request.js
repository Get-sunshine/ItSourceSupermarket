/**
 * @description 这个函数是对于axios的封装
 * @author Z
 */
//引入 axios
import axios from 'axios';
//引入qs
import qs from 'qs';
// localStor
import localStor from '../utils/localStor';
// router
import router from '../router/index';
// 配置axios
axios.defaults.baseURL = 'http://127.0.0.1:3001/';
// axios请求拦截器
axios.interceptors.request.use(config => {
    // 获取token
    const token = localStor.get('zsy_hy');
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});
//导出
export default {
    get(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios.get(url, {
                params
            })
                .then(response => {
                    resolve(response); //成功
                })
                .catch(error => {
                    reject(error); //失败
                })
        })
    },
    post(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios.post(url, qs.stringify(params))
                .then(response => {
                    resolve(response); //成功
                })
                .catch(error => {
                    reject(error); // 失败
                })
        })
    }
}