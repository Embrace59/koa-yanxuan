const { mysql } = require('../../mysql.js')

/**
 * 商品详情页数据
 */
const detailAction = async (ctx) => {
    const { goodsId, openId } = ctx.request.query

    //轮播图
    const banner = await mysql('nideshop_goods_gallery').where({
        'goods_id': goodsId
    }).select()

    //商品信息
    const info = await mysql('nideshop_goods').where({
        'id': goodsId
    }).select()

    //品牌
    let brand = []
    if (info[0].brand_id) {
        brand = await mysql('nideshop_brand').where({
            id: info[0].brand_id
        }).select()
    }

    //商品参数 属性
    //关联查询两个表  leftJoin
    const attribute = await mysql('nideshop_goods_attribute')
        .column("nideshop_goods_attribute.value", "nideshop_attribute.name")
        .leftJoin('nideshop_attribute', 'nideshop_goods_attribute.attribute_id', 'nideshop_attribute.id')
        .where({
            'nideshop_goods_attribute.goods_id': goodsId
        }).select()

    //knex.select('*').from('users').rightJoin('accounts', 'users.id', 'accounts.user_id')
    //select * from `users` right join `accounts` on `users`.`id` = `accounts`.`user_id`

    //常见问题
    const issue = await mysql('nideshop_goods_issue').select()

    //大家都在看
    //返回和此详情页商品的同类商品
    const productList = await mysql('nideshop_goods').where({
        'category_id': info[0].category_id
    }).select();

    ctx.body = {
        'banner': banner,
        "info": info[0] || [],
        "brand": brand[0] || [],
        "attribute": attribute,
        "issue": issue,
        "productList": productList,
    }
}

module.exports = {
    detailAction
}