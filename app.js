// 导入koa，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa')
const Router = require('./routes/index.js')
const config = require('./config')
const KoaBody = require('koa-body')
const cors = require('koa2-cors')

// 创建一个Koa对象表示web app本身:
const app = new Koa();

//使用app.use()注册的函数。每次客户端的请求，koa都会调用。
// 处理跨域
app.use(KoaBody())
app.use(cors({
    origin: function (ctx) {
        if (ctx.url === '/test') {
            return "*"; // 允许来自所有域名请求
        }
        return 'http://localhost:8080';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))
app.use(Router.routes())




app.listen(config.port, () => {
    console.log(`server is started at port ${config.port}`)
})