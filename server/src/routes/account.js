const router = require('koa-router')();
const conn = require('../db/conn');
// koa-multer
const upload = require('../utils/upload');
// jwt
const { jwtSign } = require('../utils/jwt');
// 前缀
router.prefix('/account');
// 登录
router.post('/login', async (ctx, next) => {
  // 获取参数
  let { account, password } = ctx.request.body;
  // sql语句
  let sqlStr = `select * from account where account='${account}' and password='${password}';`;
  // 执行查询
  await conn.query(sqlStr).then((res) => {
    if (res.length !== 0) {
      // 生成token
      const token = jwtSign(res[0]);
      ctx.body = {
        code: 0,
        message: '登录成功',
        token
      }
      return;
    }
    ctx.body = {
      code: 1,
      message: '登录失败，请检查用户名或密码'
    }
  }).catch((err) => {
    console.log(err);
  });
});
// 添加账号
router.post('/accountadd', async (ctx, next) => {
  let { account, password, userType } = ctx.request.body;
  // SQL语句
  let sqlStr = `insert into account (account,password,user_type,image_url) values
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
          result: {
            data: res,
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
// 获取当前用户
router.get('/currentaccount', async (ctx, next) => {
  let { id } = ctx.state.user;
  let sqlStr = `select account,image_url as imageUrl from account where id='${id}'`;
  await conn.query(sqlStr).then((res) => {
    if(res.length!==0){
      ctx.body={
        code:0,
        message:'查询成功',
        result:{
          account:res[0]
        }
      }
      return;
    }
    ctx.body={
      code:1,
      message:'查询失败',
      result:{

      }
    }
    return;
  }).catch((err) => {
    console.log(err);
  });
});
// 确认密码
router.post('/validatepassword',async (ctx,next) => {
  let {password} = ctx.request.body;
  let userPassword= ctx.state.user.password;
  if(password === userPassword){
    ctx.body={
      code:0,
      message:'原密码输入正确'
    }
    return;
  }
  ctx.body={
    code:1,
    message:'原密码输入不正确'
  }
});
// 密码修改
router.post('/passwordmodify',async (ctx,next) => {
  let {oldPassword,newPassword} = ctx.request.body;
  let {account} = ctx.state.user;
  let sqlStr = `update account set password ='${newPassword}' where account='${account}' and password = '${oldPassword}';`;
  await conn.query(sqlStr).then((res) => {
    if(res.affectedRows!==0){
      ctx.body={
        code:0,
        message:'修改成功！请重新登录！'
      }
      return;
    }
    ctx.body={
      code:1,
      message:'修改失败！'
    }
  });
});
// 个人中心——获得信息
router.get('/getaccountinfo',async (ctx,next) => {
  let {id}=ctx.state.user;
  let sqlStr = `select id ,account,create_date as createDate from account where id ='${id}'`;
  await conn.query(sqlStr).then((res) => {
    if(res.length===0){
      ctx.body={
        code:1,
        message:'出现错误',
        result:{

        }
      }
      return;
    }
    ctx.body={
      code:0,
      message:'查询成功',
      result:{
        accountInfo:res
      }
    }
    return;
  }).catch((err) => {
    console.log(err);
  });
});
// 头像上传             single中的字符串 是input的name
router.post('/upload',upload.single('file'),async (ctx,next) => {
  let id=ctx.state.user.id;
  let path = ctx.req.file.filename;
  path=`/uploads/${path}`;
  let sqlStr = `update account set image_url='${path}' where id='${id}'`;
  await conn.query(sqlStr).then((res) => {
    if(res.affectedRows===1){
      ctx.body={
        code:0,
        message:'头像上传成功',
        result:{
          imgUrl:path
        }
      }
      return;
    }
    ctx.body={
      code:1,
      message:'头像上传失败'
    }
    return;
  }).catch((err) => {
    console.log(err);
  });
});
module.exports = router;
