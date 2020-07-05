/**
 * @description goods路由
 * @author Z
 */
const router = require('koa-router')();
const conn = require('../db/conn');
router.prefix('/goods');
router.post('/goodsadd', async (ctx, next) => {
    let { name, price, number, description } = ctx.request.body;
    let sqlStr = `insert into goods (name,price,number,description) values 
    ('${name}','${price}','${number}','${description}');`;
    await conn.query(sqlStr).then((res) => {
        if (res.affectedRows !== 0) {
            ctx.body = {
                code: 0,
                message: '增加成功'
            }
            return;
        }
        ctx.body = {
            code: 1,
            message: '增加失败'
        }
    }).catch((err) => {
        console.log(err);
    });
});
// 获取商品列表
router.get('/goodslist', async (ctx, next) => {
    let { pageSize, currentPage,name } = ctx.request.query;
    let n = (currentPage - 1) * pageSize;
    let sqlStr = `select * from goods where 1=1`;
    if(name){
        sqlStr += ` and name like '%${name}%'`;
    }
    await conn.query(sqlStr).then(async (res) => {
        let total = res.length;
        if(total===0){
            ctx.body={
                code:1,
                message:'暂时没有数据'
            }
            return;
        }
        sqlStr+=` limit ${n},${pageSize}`;
        await conn.query(sqlStr).then(async (res) => {
            if(res.length===0){
                ctx.body={
                    code:1,
                    message:'出现错误'
                }
                return;
            }
            ctx.body={
                code:0,
                message:'查询成功',
                result:{
                    total,
                    res
                }
            };
            return;
        }).catch((err) => {
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
    });
});
// 删除单个商品
router.post('/goodsdelete',async (ctx,next) => {
    let {id} = ctx.request.body;
    let sqlStr =  `delete from goods where id='${id}'`;
    await conn.query(sqlStr).then((res) => {
        if(res.affectedRows===1){
            ctx.body={
                code:0,
                message:'删除成功！'
            }
            return;
        }
        ctx.body={
            code:1,
            message:'删除失败！'
        }
        return;
    }).catch((err) => {
        console.log(err);
    });
});
// 删除多个
router.post('/goodsmultipledelete',async (ctx,next) => {
    let {idArray}=ctx.request.body;
    let sqlStr=`delete from goods where id in (${idArray});`;
    await conn.query(sqlStr).then((res) => {
        if(res.affectedRows!==0){
            ctx.body={
                code:0,
                message:'删除成功！'
            }
            return;
        }
        ctx.body={
            code:1,
            message:'删除失败！'
        }
        return;
    })
})
// 修改
router.post('/goodsupdate',async (ctx,next) => {
    let {name,price,number,description,id}=ctx.request.body;
    let sqlStr=`update goods set name='${name}',price='${price}',number='${number}',
    description='${description}' where id='${id}';
    `;
    await conn.query(sqlStr).then((res) => {
        if(res.affectedRows===1){
            ctx.body={
                code:0,
                message:'修改成功！'
            }
            return;
        }
        ctx.body={
            code:1,
            message:'修改失败！'
        }
        return;
    })
})
module.exports = router;