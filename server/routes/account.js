var express = require('express');
var router = express.Router();
const connection = require('./js/conn');
router.post('/accountadd',(req,res)=>{
    res.send('haha');
});
module.exports = router;
