import Mock from 'mockjs'
import qs from 'qs'

// mock的配置
Mock.setup({
  // 随机延时500-1000毫秒
  timeout: '500-1000'
})

// 单个数据
Mock.mock('@integer(0,7)')
// 对象数据
Mock.mock({
  id: '@id',
  name: '@ctitle(2,4)'
})

// 模拟：获取收藏接口 -参数字段按接口文档来定义
Mock.mock(/\/member\/collect/, 'get', ({
  url
}) => {
  // get 请求参数从 url 中提取， 请求体中的数据可以在 body 参数中提取
  const querystring = url.split('?')[1]
  //   解构出请求参数
  const {
    page,
    pageSize
  } = qs.parse(querystring)
  //   Mock.mock({}) 内部支持数据模板定义
  return Mock.mock({
    msg: '操作成功',
    result: {
      counts: 35,
      pages: 4, // 总页数
      pageSize: Number(pageSize), // 页容量
      page: Number(page), // 当前页
      // 🔔 数据模板定义高级语法
      ['items|' + pageSize]: [{
        id: '@id()',
        name: '@ctitle(10, 15)',
        description: '@ctitle(20, 25)',
        picture: "@dataImage('200x200')",
        collectType: '@integer(1, 3)',
        price: '@float(1, 500, 2, 2)',
        discount: '@float(0, 1, 1, 1)',
        productionPlace: '@province()',
        detailsUrl: '@url()'
      }]
    }
  })
})


// 模拟：获取足迹接口 -参数字段按接口文档来定义
Mock.mock(/\/member\/browseHistory/, 'get', ({
  url
}) => {
  console.log(url);
  // get 请求参数从 url 中提取， 请求体中的数据可以在 body 参数中提取
  const querystring = url.split('?')[1]
  //   解构出请求参数
  const {
    page,
    pageSize
  } = qs.parse(querystring)
  //   Mock.mock({}) 内部支持数据模板定义
  return Mock.mock({
    msg: '操作成功',
    result: {
      counts: 35,
      pages: 4, // 总页数
      pageSize: Number(pageSize), // 页容量
      page: Number(page), // 当前页
      // 🔔 数据模板定义高级语法
      ['items|' + pageSize]: [{
        id: '@id()',
        name: '@ctitle(10, 15)',
        desc: '@ctitle(20, 25)',
        picture: "@dataImage('200x200')",
        price: '@float(1, 500, 2, 2)',
        discount: '@float(0, 1, 1, 1)',
        productionPlace: '@province()',
        browserTime: '@datetime(yyyy-MM-dd A HH:mm:ss)'
      }]
    }
  })
})
