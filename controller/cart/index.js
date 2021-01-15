const { mysql } = require('../../mysql.js')
/**
 * 向购物车中增加商品
 * @param {*} ctx 
 */
const addCart = async (ctx) => {
    const {
        openId,
        goodsId,
        goodsCount
    } = ctx.request.body

    //判断购物车是否包含此数据
    const haveGoods = await mysql("nideshop_cart").where({
        "user_id": openId,
        "goods_id": goodsId
    }).select()

    if (haveGoods.length == 0) {//购物车还没有这项数据
        //根据前端的goodsId，在goods表中找出相应的goods
        const goods = await mysql("nideshop_goods").where({
            "id": goodsId
        }).select()
        //提取要放到cart表中的goods字段
        const {
            retail_price,
            name,
            list_pic_url
        } = goods[0]

        await mysql('nideshop_cart').insert({
            "user_id": openId,
            "goods_id": goodsId,
            "goods_name": name,
            retail_price,
            "number": goodsCount,
            list_pic_url,
        })
    }
    else {//存在这项数据
        //把旧数据中的数量number找出
        const oldNumber = await mysql("nideshop_cart").where({
            "user_id": openId,
            "goods_id": goodsId
        }).column('number').select()

        //new number = old number + 新增number，更新数据
        await mysql("nideshop_cart").where({
            "user_id": openId,
            "goods_id": goodsId
        }).update({
            "number": oldNumber[0].number + goodsCount
        })
    }

    ctx.body = {
        data: "success"
    }
}

const cartList = async (ctx) => {

    const {
        openId
    } = ctx.query;

    const cartList = await mysql("nideshop_cart").where({
        "user_id": openId,
    }).select();

    ctx.body = {
        data: cartList
    }
}

const deleteAction = async (ctx) => {
    const id = ctx.query.id;

    const data = await mysql("nideshop_cart").where({
        "id": id,
    }).del();

    if (data) {
        ctx.body = {
            data: true
        }
    } else {
        ctx.body = {
            data: false
        }
    }
}

module.exports = {
    addCart,
    cartList,
    deleteAction
}