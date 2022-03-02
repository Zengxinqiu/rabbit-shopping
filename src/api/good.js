import request from "@/utils/request";

/**
 * 获取商品详情
 * @param {String} id - 商品ID
 */
export const findGood = id => {
  return request('/goods', 'get', {
    id
  })
}



/**
 * 获取商品同类推荐-未传入ID为猜喜欢
 * @param {String} id - 商品ID
 * @param {Number} limit - 获取条数
 */
export const findRelGoods = (id, limit = 16) => {
  return request('/goods/relevant', 'get', {
    id,
    limit
  })
}


/**
 * 获取热榜商品
 * @param {Number} type - 1代表24小时热销榜 2代表周热销榜 3代表总热销榜
 * @param {Number} limit - 获取个数
 */
export const findGoodsHot = ({
  id,
  type,
  limit = 3
}) => {
  return request('/goods/hot', 'get', {
    id,
    type,
    limit
  })
}


/**
 * 查询商品评价信息
 * @param {String} id - 商品ID
 * @returns
 */
export const findGoodsCommentInfo = (id) => {
  // return request(`/goods/${id}/evaluate`, 'get')
  // axios 遇见 http https 开头的地址，不会加上基准地址
  // 🔔 这里使用的是模拟的数据（主要是项目没有上线，没有真正的评论数据）
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'get')
}


/**
 * 查询商品评价列表
 * @param {String} id - 商品ID
 * @param {Object} params - 商品ID
 * @returns
 */
export const findGoodsCommentList = (id, params) => {
  // 后台地址
  // return request(`/goods/${id}/evaluate/page`, 'get')
  // 模拟地址
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`, 'get', params)
}


/**
 * 获取商品的specs和skus
 * @param {String} skuId - 商品SKUID
 * @returns Promise
 */
export const getSpecsAndSkus = (skuId) => {
  return request(`/goods/sku/${skuId}`, 'get')
}
