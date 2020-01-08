const Koa = require('koa')
const app = new Koa()
const hbs = require('koa-hbs')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')
const chat = require('./routes/chat')

// error handler
onerror(app)
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(hbs.middleware({
  viewPath: __dirname + '/views', 
  defaultLayout: 'layout',
  partialsPath: __dirname + '/views/partials', 
  contentHelperName: 'extend',//别命，为了contentAs去兼容extend
  disableCache: true//缓存选项
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(chat.routes(), chat.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
