// ./controller/home/index.js
const { mysql } = require('../../mysql.js')

module.exports = async (ctx) => {
    //banner轮播数据
    const banner = await mysql('nideshop_ad').where({
        ad_position_id: 1
    }).select()

    //channel类型
    const channel = await mysql('nideshop_channel').select()

    /**
     * 品牌列表
     */
    const brandList = await mysql('nideshop_brand').where({
        is_new: 1
    }).orderBy('new_sort_order', 'asc').limit(4).select();

    /**
     * 新品
     */
    const newGoods = await mysql('nideshop_goods').whereIn('id', [1181000, 1135002, 1134030, 1134032]).andWhere("is_new", 1).select();

    /**
     * 人气推荐
     */
    const hotGoodsList = await mysql('nideshop_goods').where('is_hot', 1).limit(5).select()
    /**
     * 专题精选
     */
    const specialList = await mysql('nideshop_topic').limit(5).select()
    /**
     * 分类别商品
     */
    const categoryList = []
    //查询出所有parent_id: 0（即最上级类别)的category
    const category = await mysql('nideshop_category').where({
        parent_id: 0
    }).select()
    // 循环类别
    for (let item of category) {
        //查询出所有最上级category的子category
        let childCategoryIds = await mysql('nideshop_category').where({
            parent_id: item.id
        }).column('id').select();
        //需要变成数组形式childCategoryIds [1020000,1036002]
        childCategoryIds = childCategoryIds.map((item) => {
            return item.id;
        })
        //根据子类别category，查询出子类别下相应的7条goods的('id', 'name', 'list_pic_url', 'retail_price')
        const categoryGoods = await mysql('nideshop_goods').column('id', 'name', 'list_pic_url', 'retail_price').whereIn('category_id', childCategoryIds).limit(7).select();
        //封装成前台需要的对象型式
        categoryList.push({
            'id': item.id, //最上级category的主键
            'name': item.name, //最上级category的name
            'goodsList': categoryGoods//最上级category的子类别下，相应的goods的('id', 'name', 'list_pic_url', 'retail_price')
        })
    }

    ctx.body = {
        'banner': banner,
        'channel': channel,
        'brandList': brandList,
        "newGoods": newGoods,
        "hotGoodsList": hotGoodsList,
        "specialList": specialList,
        "categoryList": categoryList
    }
}