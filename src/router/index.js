// createRouter 用于创建路由的函数
// createWebHashHistory 用于创建哈希路由的函数
import {
  createRouter,
  createWebHashHistory,

} from 'vue-router'
import TopCategory from '@/views/category/index.vue'
import SubCategory from '@/views/category/sub.vue'
import Goods from '@/views/goods/index.vue'
import Cart from '@/views/cart/index.vue'
import Layout from '@/views/Layout.vue'
import Home from '@/views/home/index.vue'
import Login from '@/views/login/index.vue'
import LoginCallback from '@/views/login/callback.vue'
import PayCheckout from '@/views/member/pay/checkout.vue'
import Pay from '@/views/member/pay/index.vue'
import PayCheckoutCallback from '@/views/member/pay/callback'
import MemberLayout from '@/views/member/Layout.vue'
import MemberHome from '@/views/member/home/index.vue'
import MemberOrder from '@/views/member/order/index.vue'
import MemberOrderDetail from '@/views/member/order/detail.vue'
import store from '@/store'
import {
  h
} from 'vue'
// 配置路由 ， 路径和组件的映射关系
const routes = [{
  path: '/',
  component: Layout,
  children: [{
      path: '/',
      component: Home
    },
    {
      path: '/category/:id',
      component: TopCategory
    },
    {
      path: '/category/sub/:id',
      component: SubCategory
    },
    {
      path: '/product/:id',
      component: Goods
    },
    {
      path: '/cart',
      component: Cart
    },
    {
      path: '/member/checkout',
      component: PayCheckout
    },
    {
      path: '/member/pay',
      component: Pay
    },
    {
      path: '/member/pay/callback',
      component: PayCheckoutCallback
    },
    {
      path: '/member',
      component: MemberLayout,
      children: [{
          path: '/member',
          component: MemberHome
        },
        {
          path: '/member/order',
          // vue3 需要嵌套关系才能模糊匹配
          component: {
            render: () => h( < RouterView / > )
          },
          children: [{
              path: '',
              component: MemberOrder
            },
            {
              path: ':id',
              component: MemberOrderDetail
            }
          ]
        }
      ]
    },



  ]
}, {
  path: '/login',
  component: Login
}, {
  path: '/login/callback',
  component: LoginCallback
}]

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 使用前端路由，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，就像重新加载页面那样
  // 每次切换路由的时候滚动到顶部
  scrollBehavior() {
    return {
      left: 0,
      top: 0
    }
  }
})


// 路由前置导航守卫
// router.beforeEach((to, from, next) => {
//   // 跳转去member开头的地址，却没有登录
//   if (to.path.startsWith('/member') && !store.state.user.profile.token) {
//     // 跳转到登录页，并传递
//     // return '/login?redirectUrl=' + to.fullPath
//     return {
//       path: '/login',
//       query: {
//         redirectUrl: to.fullPath
//       }
//     }
//   }
// })
//路由前置导航守卫
router.beforeEach((to, from) => {
  // 用户信息
  const {
    token
  } = store.state.user.profile
  // 跳转去member开头的地址却没有登录
  if (to.path.startsWith('/member') && !token) return {
    path: '/login',
    query: {
      redirectUrl: to.fullPath
    }
  }

})
// 导出路由实例
export default router
