/**
 * @description localStorage的封装
 * @author Z
 */
export default {
    // 保存
    save(key,value){
        window.localStorage.setItem(key,JSON.stringify(value));
        return;
    },
    // 删除
    remove(key){
        window.localStorage.removeItem(key);
        return;
    },
    // 获取
    get(key) {
        return JSON.parse(window.localStorage.getItem(key));
    }
}