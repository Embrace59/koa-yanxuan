// ./controller/home/index.js
const { mysql } = require('../../mysql.js')

module.exports = async (ctx) => {
    console.log('aaa')
    const banner = await mysql('nideshop_ad').where({
        ad_position_id: 1
    }).select()
    console.log('bbb')
    ctx.body = {
        'banner': banner
    }
}