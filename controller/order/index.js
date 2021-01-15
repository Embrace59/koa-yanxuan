const { mysql } = require('../../mysql.js')

/**
 * 提交订单数据
 * @param {*} ctx 
 */
const submitAction = async (ctx) => {
    const {
        goodsId,
        openId,
        allPrice
    } = ctx.request.body

    //此用户是否已存在订单
    const oldOrder = await mysql('nideshop_order').where({
        user_id: openId
    }).select()

    if (oldOrder.length > 0) {//若存在
        //现在的goodsId加上以前的
        // goodsId = oldOrder[0].goods_id + ',' + goodsId;
        // allPrise = oldOrder[0].allPrice + allPrice
        const updateData = await mysql('nideshop_order').where({
            user_id: openId
        }).update({
            goods_id: oldOrder[0].goods_id + ',' + goodsId,
            allprice: (parseInt(oldOrder[0].allprice) + parseInt(allPrice)).toString()
        })

        if (updateData) {
            ctx.body = {
                data: true
            }
        }
        else {
            ctx.body = {
                data: false
            }
        }
    }
    else {//不存在
        const insertData = await mysql('nideshop_order').insert({
            user_id: openId,
            goods_id: goodsId,
            allprice: allPrice
        })

        if (insertData) {
            ctx.body = {
                data: true
            }
        }
        else {
            ctx.body = {
                data: false
            }
        }
    }
}

//获取订单详情页所需的数据
const detailAction = async (ctx) => {
    const openId = ctx.query.openId;
    const addressId = ctx.query.addressId || '';

    const orderDetail = await mysql('nideshop_order').where({
        user_id: openId,
    }).select();

    let goodsIds = orderDetail[0].goods_id.split(",");
    console.log(goodsIds);

    //订单商品列表
    const goodsList = await mysql('nideshop_cart').andWhere({
        user_id: openId
    }).whereIn('goods_id', goodsIds).select();

    //收货地址
    let addressList;
    if (addressId) {
        addressList = await mysql("nideshop_address")
            .where({
                user_id: openId,
                id: addressId
            }).orderBy('is_default', 'desc')
            .select();
    }
    else {
        addressList = await mysql("nideshop_address")
            .where({
                user_id: openId,
            }).orderBy('is_default', 'desc')
            .select();
    }

    ctx.body = {
        allPrice: orderDetail[0].allprice,
        goodsList: goodsList,
        address: addressList[0] || {}
    }
}

module.exports = {
    submitAction,
    detailAction
}