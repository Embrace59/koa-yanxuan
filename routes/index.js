// ./routes/index.js
const router = require('koa-router')({
    prefix: '/lm'     //prefix是路由前缀
})
const controllers = require('../controller/index')

/**
 * 首页
 */
//ctx：上下文，核心对象
//next：将处理的控制权转交给下一个中间件
router.get('/index/index', controllers.home.index)

/**
 * 搜索
 */
//关键词联想
router.get('/search/helperaction', controllers.search.index.helperAction)
//搜索的关键词添加到数据库
router.post('/search/addhistoryaction', controllers.search.index.addHistoryAction)
//关键词和搜索历史接口
router.get('/search/indexaction', controllers.search.index.indexAction)
//清楚搜索历史记录
router.post('/search/clearhistoryAction', controllers.search.index.clearhistoryAction)

/**
 * 商品
 */
//商品详情
router.get("/goods/detailaction", controllers.goods.index.detailAction)

/**
 * 收藏
 */
//添加收藏
router.post('/collect/addcollect', controllers.collect.index.addCollect)

/**
 * 购物车
 */
//增加购物车
router.post('/cart/addCart', controllers.cart.index.addCart)
//购物车列表
router.get('/cart/cartList', controllers.cart.index.cartList)
//删除购物车商品
router.get('/cart/deleteAction', controllers.cart.index.deleteAction)

/**
 * 订单
 */
router.post('/order/submitAction', controllers.order.index.submitAction)
//获取订单详情页所需的数据
router.get('/order/detailAction', controllers.order.index.detailAction)
//删除商品
router.get('/cart/deleteAction', controllers.cart.index.deleteAction)

/**
 * 收货地址
 */
//1.保存和跟新收货地址
router.post('/address/saveAction', controllers.address.index.saveAction)
//2.获取收货地址列表
router.get('/address/getListAction', controllers.address.index.getListAction)
//3.获取收货地址详情
router.get('/address/detailAction', controllers.address.index.detailAction)
//4.删除收货地址
router.get('/address/deleteAction', controllers.address.index.deleteAction)

module.exports = router