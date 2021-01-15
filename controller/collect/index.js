const { mysql } = require('../../mysql.js')

/**
 * 添加收藏
 */
const addCollect = async (ctx) => {
    const {
        openId,
        goodsId
    } = ctx.request.body
    console.log(openId)
    console.log(goodsId)
    //判断是否被收藏过
    const isCollected = await mysql("nideshop_collect").where({
        "user_id": openId,
        "value_id": goodsId
    }).select()

    if (isCollected.length == 0) {//没有被收藏
        await mysql("nideshop_collect").insert({
            "user_id": openId,
            "value_id": goodsId
        })
    }
    else {//被收藏了
        await mysql("nideshop_collect").where({
            "user_id": openId,
            "value_id": goodsId
        }).del()
    }
    ctx.body = {
        data: "success"
    }
}

module.exports = {
    addCollect
}