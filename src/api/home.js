// 获取品牌数据
import request from "@/utils/request";



export const findBrand = (limit) => {
  return request('/home/brand', 'get', {
    limit: limit
  })
}





/**
 * 首页-广告区域(pc-小程序)
 * @param {*} distributionSite 广告区域展示位置（投放位置 投放位置，1为首页，2为分类商品页） 默认是1
返回数据
 * @returns 
 */
export const findBanner = (distributionSite = 1) => {
  return request('/home/banner', 'get', {
    distributionSite: distributionSite
  })
}

/**
 * 首页-新鲜好物
 * @param {*} limit 广告区域展示位置（投放位置 投放位置，1为首页，2为分类商品页） 默认是1
返回数据
 * @returns 
 */
export const findNew = (limit = 4) => {
  return request('/home/new', 'get', {
    limit: limit
  })
}


/**
 * 首页-人气推荐
 * @param {*} 
 * @returns 
 */
export const findHot = () => {
  return request('/home/hot', 'get')
}


/**
 * 首页-产品区块
 * @param {*} 
 * @returns 
 */
export const findGoods = () => {
  return request('/home/goods', 'get')
}



/**
 * 首页-最新专题
 * @param {*} limit
 * @returns 
 */
export const findSpecial = (limit) => {
  return request('/home/special', 'get', {
    limit
  })
}
