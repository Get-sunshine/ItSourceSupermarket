/**
 * @description 文件上传
 * @author Z
 */
const koaMulter = require('koa-multer');
const path = require('path');
//文件上传
//配置
var storage = koaMulter.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, path.resolve('./uploads'))
    },
    //修改文件名称
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
//加载配置
var upload = koaMulter({ storage: storage });
module.exports=upload;

