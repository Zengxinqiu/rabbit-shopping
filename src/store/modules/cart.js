import {
  findCart,
  getNewCartGoods,
  mergeCart,
  insertCart,
  deleteCart,
  updateCart,
  checkAllCart
} from "@/api/cart"

// 购物车状态
export default {
  namespaced: true,
  state: () => {
    return {
      list: []
    }
  },
  mutations: {
    // 设置购物车列表
    setCartList(state, list) {
      state.list = list;
      console.log(list);
    },
    // 删除购物车商品
    deleteCart(state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId);
      state.list.splice(index, 1);
    },
    // 修改购物车商品
    updatedCart(state, goods) {
      // goods中字段有可能不完整，goods有的信息才去修改
      // 1.goods中必需有skuid，才能找到对应的商品信息
      const updatedGoods = state.list.find((item) => item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== null && goods[key] !== undefined && goods[key] !== '') {
          updatedGoods[key] = goods[key]
        }
      }
    },
    //   加入购物车
    insertCart(state, payload) {
      // 考虑两种情况
      // 情况1 ： 已经添加过的商品（skuid已经存在），是数量的累加
      // 情况2：没有添加过的就添加到列表前
      const index = state.list.findIndex(item => item.skuId === payload.skuId)
      if (index >= 0) {
        state.list[index].count += payload.count
      } else {
        state.list.unshift(payload)
      }
    }
  },
  actions: {

    // 合并本地购物车
    async mergeLocalCart(store) {
      // 合并购物车
      const data = store.state.list.map(({
        skuId,
        selected,
        count
      }) => ({
        skuId,
        selected,
        count
      }))
      console.log(data);
      //  引入接口
      await mergeCart(data)
      // 获取购物车列表
      const {
        result
      } = await findCart()
      console.log(1111, result);
      store.commit('setCartList', result)
    },
    // 修改Sku规格函数
    updateCartSku(store, {
      oldSkuId,
      newSkuId
    }) {
      return new Promise((resolve, reject) => {
        if (store.rootState.user.profile.token) {
          // 1.获取原先商品的数量
          const oldGoods = store.state.list.find(item => item.skuId === oldSkuId)
          // 2.删除原先商品
          deleteCart([oldSkuId]).then(() => {
            return insertCart({
              skuId: newSkuId.skuId,
              count: oldGoods.count
            })
          }).then(() => {
            // 3.获取修改的skuId 和原先商品数量 做一个加入购物车操作
            return findCart()

          }).then(({
            result
          }) => {
            // 4.更新列表
            store.commit('setCartList', result)
            resolve()
          })


        } else {
          // 本地
          // 1.获取旧的商品
          const oldGoods = store.state.list.find(item => item.skuId === oldSkuId)
          // 2.删除旧的商品
          store.commit('deleteCart', oldSkuId)
          // 3.合并一条1新的商品信息
          const {
            skuId,
            price: nowPrice,
            inventory: stock,
            attrsText
          } = newSkuId
          const newGoods = {
            ...oldGoods,
            skuId,
            nowPrice,
            stock,
            attrsText
          }
          // 4. 去插入即可
          store.commit('insertCart', newGoods)
        }

      })
    },
    // 批量删除商品
    batchDeleteCart(store, isInvalid) {
      return new Promise((resolve, reject) => {
        if (store.rootState.user.profile.token) {
          // 得到需要删除的商品列表（失效， 选中）的skuId 集合
          const ids = store.getters[isInvalid ? 'invalidList' : 'selectedList'].map(item => item.skuId)
          deleteCart(ids).then(() => {
            return findCart()
          }).then((data) => {
            store.commit('setCartList', data.result)
            resolve()
          })
          console.log(' // 已登录 TODO ');
        } else {
          // 本地
          // 1. 获取有效的商品列表，遍历的去调用修改mutations即可
          store.getters[isInvalid ? 'invalidList' : 'selectedList'].forEach(item => {
            store.commit('deleteCart', item.skuId)
          });

          resolve()
        }
      })
    },
    // 做有效商品的全选&反选
    checkAllCart(store, selected) {
      return new Promise((resolve, reject) => {
        if (store.rootState.user.profile.token) {
          const ids = store.getters.validList.map(item => item.skuId)

          checkAllCart({
            selected,
            ids
          }).then(() => {
            return findCart()
          }).then(({
            result
          }) => {
            store.commit('setCartList', result)
            resolve()
          })
          console.log(' // 已登录 TODO ');
        } else {
          // 本地
          // 1. 获取有效的商品列表，遍历的去调用修改mutations即可
          store.getters.validList.forEach(item => {
            store.commit('updatedCart', {
              skuId: item.skuId,
              selected: selected
            })
          });

          resolve()
        }
      })
    },
    // 修改购物车商品
    updatedCart(store, goods) {
      return new Promise((resolve, reject) => {
        if (store.rootState.user.profile.token) {
          updateCart(goods).then(() => {
            return findCart()
          }).then(({
            result
          }) => {
            store.commit('setCartList', result);
          })
          console.log(' // 已登录 TODO ');
        } else {
          // 本地
          store.commit('updatedCart', goods)
          resolve()
        }
      })
    },
    // 删除购物车商品
    deleteCart(store, skuId) {
      return new Promise((resolve) => {
        if (store.rootState.user.profile.token) {
          deleteCart([skuId]).then(() => {
            store.dispatch('findCartList')
          })
          console.log(' // 已登录 TODO ');
        } else {
          // 本地
          store.commit('deleteCart', skuId)
          resolve()
        }
      })
    },
    // 获取购物车列表
    findCartList(store) {
      return new Promise((resolve, reject) => {
        if (store.rootState.user.profile.token) {
          // 登录
          findCart().then(data => {
            store.commit('setCartList', data.result);
            console.log(data);
            resolve()
          })
        } else {
          // 本地
          // 情况2：未登录- 未登录也要同步最新商品信息（价格。库存。。。）
          store.state.list.forEach(async item => {
            console.log(item.skuId);
            const {
              result
            } = await getNewCartGoods(item.skuId)
            console.log(result);
            store.commit('updatedCart', {
              ...result,
              skuId: item.skuId
            })

          })
          resolve('购物车信息同步成功-本地')
        }
      })
    },
    // 加入购物车
    insertCart(store, goods) {
      return new Promise((resolve, reject) => {
        if (store.rootState.user.profile.token) {
          // 情况1：已登录，调用接口

          insertCart(goods).then(async () => {
            // 加入购物车后，直接获取并更新最新列表
            const {
              result
            } = await findCart()
            store.commit('setCartList', result)
            resolve('加入购物车成功-接口调用')
          })
          console.log(' // 已登录 TODO ');
        } else {
          // 未登录
          store.commit('insertCart', goods)
          resolve()
        }
      })
    }
  },
  getters: {
    // 有效的商品
    validList(state) {
      return state.list.filter(item => item.stock > 0 && item.isEffective)
    },
    // 有效商品件数
    validTotal(state, getters) {
      return getters.validList.reduce((total, item) => total + item.count, 0)
    },
    // 有效商品总金额
    validAmount(state, getters) {
      return getters.validList.reduce((total, item) => total + item.nowPrice * 100 * item.count, 0) / 100
    },
    invalidList(state) {
      return state.list.filter(item => !(item.stock > 0 && item.isEffective))
    },
    // 选中商品列表
    selectedList(state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 选中商品件数
    selectedTotal(state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 选中商品总金额
    selectedAmount(state, getters) {
      return getters.selectedList.reduce((p, c) => p + (c.nowPrice * c.count), 0).toFixed(2)
    },
    // 是否全选
    isCheckAll(state, getters) {
      return getters.validList.length === getters.selectedList.length && getters.selectedList.length !== 0
    }
  }


}
