/**
 * @description jsonwebtoken
 * @author Z
 */
const jwt = require('jsonwebtoken');
const {SECRET} = require('../conf/constant');
// 导出
module.exports = {
    jwtSign(obj){
        return jwt.sign(Object.assign({},obj),SECRET,{expiresIn:'2h'})
    }
}