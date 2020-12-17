// routes/index.js
const router = require('koa-router')({
    prefix: '/lm'     //prefix是路由前缀
})
const controllers = require('../controller/index')

//ctx：上下文，核心对象
//next：将处理的控制权转交给下一个中间件
router.get('/index/index', controllers.home.index)

module.exports = router