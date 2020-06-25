/**
 * @description 这个函数是对于axios的封装
 * @author Z
 */
//引入 axios
import axios from 'axios';
//引入qs
import qs from 'qs';
import { resolve, reject } from 'core-js/fn/promise';

//导出
export default {
    get(url,params={}){
        return new Promise((resolve,reject)=>{
            axios.get(url,{
                params
            })
            .then(response=>{
                resolve(response); //成功
            })
            .catch(error=>{
                reject(error); //失败
            })
        })
    },
    post(url,params={}){
        return new Promise((resolve,reject)=>{
            axios.post(url,qs.stringify(params))
            .then(response=>{
                resolve(response); //成功
            })
            .catch(error=>{
                reject(error); // 失败
            })
        })
    }
}