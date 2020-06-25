/**
 * @description 账号的api
 * @author Z
 */
//引入request.js
import request from '../utils/request'
/**
 * 添加账户
 * @param {String} url  地址
 * @param {Object} params  提交的数据
 */
export function addAccount (url,params){
    return new Promise((resolve,reject)=>{
        request.post(url,params)
        .then(res=>{
            resolve(res); //成功
        })
        .catch(err=>{
            reject(err); //失败
        });
    });
}

 
