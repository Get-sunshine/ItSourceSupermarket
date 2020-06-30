const router = require('koa-router')();
const conn = require('../db/conn');
// 前缀
router.prefix('/account');
// 添加账号
router.post('/accountadd', async (ctx, next) => {
  let { account, password, userType } = ctx.request.body;
  // SQL语句
  let sqlStr = `insert into account (account,password,user_type) values
                ('${account}','${password}','${userType}');`;
  // 执行SQL语句
  await conn.query(sqlStr).then((res) => {
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
router.get('/accountlist', async (ctx, nect) => {
  let { currentPage, pageSize } = ctx.request.query;
  // sql语句
  let sqlStr = `select id,account,password,user_type as userType,create_date as createDate 
  from account order by id desc`;
  // 执行
  await conn.query(sqlStr).then(async (res) => {
    // 总条数
    let userTotal = res.length;
    // 略过条数
    let skipAmount = (currentPage - 1) * pageSize;
    // 重新拼接SQL
    sqlStr += ` limit ${skipAmount},${pageSize};`;
    await conn.query(sqlStr).then((res) => {
      if (res.length !== 0) {
        ctx.body = {
          code: 0,
          message: '查询成功',
          result:{
            data:res,
            userTotal
          }
        };
        return;
      }
      ctx.body = {
        code: 1,
        message: '查询失败',
        result: ''
      }
    }).catch((err) => {
      console.log(err);
    });
  }).catch((err) => {
    console.log(err);
  });
});
// 删除单个账号
router.get('/accountdelete', async (ctx, next) => {
  let { id } = ctx.request.query; // 获取数据
  let sqlStr = `delete from account where id = ${id};`; // SQL语句
  await conn.query(sqlStr).then((res) => {
    if (res.affectedRows !== 0) {
      ctx.body = {
        code: 0,
        message: '删除成功'
      }
      return;
    }
    ctx.body = {
      code: 1,
      message: '删除失败'
    }
    return;
  });

});
// 修改数据-数据回填模态框
router.get('/accountedit', async (ctx, next) => {
  let { id } = ctx.request.query;
  let sqlStr = `select id,account,user_type as userType from account 
                where id=${id};`;
  await conn.query(sqlStr).then((res) => {
    ctx.body = {
      code: 0,
      message: '查询成功',
      res: res[0]
    }
  }).catch((err) => {
    console.log(err);
  });
});
// 修改数据-数据保存到数据库
router.post('/accounteditsave', async (ctx, next) => {
  let { account, id, userType } = ctx.request.body;
  // 构造SQL语句
  let sqlStr = `update account set account='${account}',user_type='${userType}'
  where id='${id}'`;
  await conn.query(sqlStr).then((res) => {
    // 成功
    if (res.affectedRows !== 0) {
      ctx.body = {
        code: 0,
        message: '修改成功',
        res: ''
      }
      return;
    }
    ctx.body = {
      code: 1,
      message: '修改失败',
      res: ''
    }
  });
})
// 批量删除
router.post('/accountmultipledelete', async (ctx, next) => {
  let { idArray } = ctx.request.body;
  // SQL语句
  let sqlStr = `delete from account where id in (${idArray});`;
  // 执行
  await conn.query(sqlStr).then((res) => {
    if (res.affectedRows !== 0) {
      ctx.body = {
        code: 0,
        message: '批量删除成功',
        res: ''
      }
      return;
    }
    ctx.body = {
      code: 1,
      message: '批量删除失败',
      res: ''
    }
  }).catch((err) => {
    console.log(err);
  });
});
module.exports = router;
