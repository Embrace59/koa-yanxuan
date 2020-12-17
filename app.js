// 导入koa，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa')
const Router = require('./routes/index.js')
const config = require('./config')

// 创建一个Koa对象表示web app本身:
const app = new Koa();

//使用app.use()注册的函数。每次客户端的请求，koa都会调用。
app.use(Router.routes())

app.listen(config.port, () => {
    console.log(`server is started at port ${config.port}`)
})