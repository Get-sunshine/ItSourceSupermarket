/**
 * @description 工具函数
 * @author Z
 */
export default {
    // 密码匹配正则
    passwordReg(val){
        const reg=new RegExp(/^(?![^a-zA-z]+$)(?!\D+$)/);
        return  reg.test(val);
    }
}