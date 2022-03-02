// 定义首页需要的接口函数
import request from '@/utils/request'


/**
 *
 * 获取首页头部分类数据
 */
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}



/**
 *  一级类目-PC
 * @param {*} id 一级类目ID
 * @returns 
 */
export const findTopCategory = (id) => {
  return request('/category', 'get', {
    id: id
  })
}


/**
 *二级类目-筛选条件-PC
 * @param {*} id 二级分类ID
 * @returns
 */
export const findSubCategory = (id) => {
  return request('/category/sub/filter', 'get', {
    id: id
  })
}


/**
 * 商品列表--分页查询
 * @param {  }
 * @returns Promise
 */
export const findCategoryGoods = (data) => {
  return request('/category/goods', 'post', data)
}

/**
 * 商品列表--分页查询-临时
 * @param {*} data 筛选排序分页
 * @returns
 */
export const findCategoryGoodsTemp = (data) => {
  return request('/category/goods/temporary', 'post', data)
}
