// ./controller/search/index.js
const { mysql } = require('../../mysql.js')

//把用户输入的keyword 加入到search_history
const addHistoryAction = async (ctx) => {
    const { openId, keyword } = ctx.request.body
    //根据用户输入的关键字，去search_history中查询，是否已经有这条历史记录了
    const oldData = await mysql('nideshop_search_history').where({
        "user_id": openId,
        "keyword": keyword
    })

    if (oldData.length == 0) {//没有这条记录，那么就在search_history中插入这个数据
        const data = await mysql('nideshop_search_history').insert({
            "user_id": openId,
            "keyword": keyword,
            "add_time": parseInt(new Date().getTime() / 1000)
        })

        if (data) {
            ctx.body = {
                data: "success"
            }
        }
        else {
            ctx.body = {
                data: "fail"
            }
        }
    }
    else {//已经有记录了
        ctx.body = {
            data: "已经有记录了"
        }
    }
}

//获取用户输入的keyword的search_history  和db中默认存在的keyword
const indexAction = async (ctx) => {
    const openId = ctx.query.openId
    // 默认_keywords
    const defaultKeyword = await mysql('nideshop_keywords').where({
        is_default: 1
    }).limit(1).select();
    // 取出hot keywords
    //distinct一般是用来去除查询结果中的重复记录的
    const hotKeywordList = await mysql('nideshop_keywords').distinct('keyword')
        .column('keyword', 'is_hot').limit(10).select()

    const historyData = await mysql('nideshop_search_history').where({
        user_id: openId
    }).limit(10).select()

    ctx.body = {
        "defaultKeyword": defaultKeyword[0],
        "hotKeywordList": hotKeywordList,
        "historyData": historyData
    }
}

//根据用和输入的keyword，在goods中进行模糊查询，返回goods中的某些字段
const helperAction = async (ctx) => {
    const keyword = ctx.query.keyword
    let order = ctx.query.order;
    if (!order) {//没有指定排序方式，默认根据id排序
        order = ''
        orderBy = "id"
    }
    else {
        orderBy = 'retail_price'
    }
    //knex('users').orderBy('name', 'desc')
    //select * from `users` order by `name` desc
    const goodsList = await mysql("nideshop_goods").orderBy(orderBy, order)
        .column('id', 'name', 'list_pic_url', 'retail_price')
        .where("name", 'like', '%' + keyword + '%')
        .limit(10).select()

    ctx.body = {
        goodsList
    }
}

//清楚相应的openid的search history
const clearhistoryAction = async (ctx) => {
    const openId = ctx.request.body.openId;

    const data = await mysql('nideshop_search_history').where({
        "user_id": openId
    }).del()

    if (data) {
        ctx.body = {
            "data": "清楚搜索历史成功"
        }
    }
    else {
        ctx.body = {
            "data": null
        }
    }
}
module.exports = {
    indexAction,
    helperAction,
    addHistoryAction,
    clearhistoryAction
}
