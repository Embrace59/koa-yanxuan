// 获取基础配置
const configs = require('./config')
//帮助我们做线程池连接
let knex = require('knex')({
    client: 'mysql',
    connection: {
        host: configs.mysql.host,
        port: configs.mysql.port,
        user: configs.mysql.user,
        password: configs.mysql.pass,
        database: configs.mysql.db
    }
})
//???
// 初始化 SDK
//将基础配置和sdk.config合并，导出初始化完成的sdk
module.exports = { mysql: knex }