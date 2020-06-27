const router = require('koa-router')()
const conn = require('../db/conn');
// 添加账号
router.post('/account/accountadd', async (ctx, next) => {
  let { account, password, userType } = ctx.request.body;
  // SQL语句
  let sqlStr = `insert into account (account,password,user_type) values
                ('${account}','${password}','${userType}');`;
  // 执行SQL语句
  await conn.query(sqlStr).then((res)=> {
    if (res.affectedRows !== 0) { // 成功
      ctx.response.body = {
        code: 0,
        message: '添加成功！'
      };
      return;
    }
    ctx.response.body = {
      code: 1,
      message: '添加失败'
    };
    return;
  })
    .catch(err => {
      console.log(err);
    });
});
// 获取账号列表
router.get('/account/accountlist',async (ctx,nect) => {
  // sql语句
  let sqlStr = `select id,account,password,user_type as userType,create_date as createDate 
  from account order by id desc;`;
  // 执行
  await conn.query(sqlStr).then((res) => {
    ctx.body={
      code:0,
      message:'查询成功',
      res
    };
  })
  .catch((err) => {
    console.log(err);
  });
});
// 单个删除账号
router.get('/account/accountdelete',async (ctx,next) => {
  let {id} = ctx.request.query; // 获取数据
  let sqlStr = `delete from account where id = ${id};`; // SQL语句
  await conn.query(sqlStr).then((res) => {
    if(res.affectedRows!==0){
      ctx.body={
        code:0,
        message:'删除成功'
      }
      return;
    }
    ctx.body={
      code:1,
      message:'删除失败'
    }
    return;
  });

});
module.exports = router;
