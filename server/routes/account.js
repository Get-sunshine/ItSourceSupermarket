var express = require('express');
var router = express.Router();
const connection = require('./js/conn');
router.get('/',(req,res)=>{
    res.send('这是账号管理路由');
});
module.exports = router;
