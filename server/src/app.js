const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors');
// path
const path = require('path');
// koa-jwt
const jwt = require('koa-jwt');

// secret
const { SECRET } = require('./conf/constant')
// routes
const account = require('./routes/account');
const goods = require('./routes/goods');

// error handler
onerror(app)

// middlewares
app.use(cors()); // 解决跨域
// koa-jwt
// 定义错误
app.use(function (ctx, next) {
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = {
        error: err.originalError ? err.originalError.message : err.message
      };
    } else {
      throw err;
    }
  });
});
app.use(jwt({ secret: SECRET }).unless({ path: ['/account/login', /^\/uploads/] }));
app.use(json())
app.use(logger())
// 在静态资源的处理之前，重写url,改变用户url的请求
app.use(async (ctx,next) => {
  if(ctx.url.startsWith('/uploads') ) { 
    // /public/js/index.js
    // 改写请求url
    ctx.url = ctx.url.replace('/uploads','');    
  }
  // 放行，交给static来处理（不管如何都放行）
  await next();
  console.log('ahahah');
});
app.use(require('koa-static')(__dirname + '/public'));
app.use(require('koa-static')(path.join(__dirname, '../uploads')));
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))



// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(account.routes(), account.allowedMethods());
app.use(goods.routes(), goods.allowedMethods());
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
