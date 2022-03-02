// createStore 用于创建仓库实例函数

import { createStore } from 'vuex'
import createPersistedstate from 'vuex-persistedstate'

import cart from './modules/cart'
import category from './modules/category'
import user from './modules/user'

// 创建仓库实例
export default createStore({

  // 模板
  modules: {
    cart,
    category,
    user
  },
  plugins: [
    createPersistedstate({
      key: 'erabbit-client-pc-store-64',
      paths: ['user', 'cart']
    })
  ]
})
