// 扩展Vue原有的功能:全局组件.自定义指令,挂载原型方法,注意点:VUE3没有全局过滤器

import defaultImg from '@/assets/images/200.png'
import {
  useIntersectionObserver
} from '@vueuse/core'

import {
  Message
} from './Message'

import Confirm from './Confirm'

// 导入library文件夹下的所有组件
// 批量导入需要使用一个函数 require.context(dir,deep,matching)
// 参数：1.目录 2.是否加载子目录 3.加载的正则匹配
const importFn = require.context('./', false, /\.vue$/)

// 图片的懒加载
// 指令
// 指令
const defineDirective = (app) => {
  app.directive('lazy', {
    // 标签或组件挂载到页面中（就是 Vue2 insert 插入节点）
    mounted(target, {
      value
    }) {
      // stop 是一个函数，用于停止检测元素可见性
      const {
        stop
      } = useIntersectionObserver(
        target,
        // isIntersecting 布尔值，元素可见为 true，元素不可见为 false
        ([{
          isIntersecting
        }]) => {
          // 图片标签是否可见
          if (isIntersecting) {
            // 如果目标可见，替换图片地址，自动加载图片
            target.src = value
            // 如果图片地址是错误的，无法加载图片，显示占位图
            target.onerror = () => {
              target.src = defaultImg
            }
            // 主动停止检测元素可见性
            stop()
          }
        }, {
          // 🔔优化： 0 元素刚进入可视区触发，1 表示元素完整进入可视区才触发
          threshold: [0]
        }
      )
    }
  })
}

// 使用原生 WebAPI 的 IntersectionObserver 写法参考
// const defineDirective = (app) => {
//   //  指令
//   app.directive('lazy', {
//     mounted(el, binding) {
//       const observer = new IntersectionObserver(([{
//         isIntersecting
//       }]) => {
//         if (isIntersecting) {
//           observer.unobserve(el)
//           el.onerror = () => {
//             el.src = defaultImg
//           }
//           el.src = binding.value
//         }
//       }, {
//         threshold: [1]
//       })
//       observer.observe(el)
//     },
//   })
// }

// Vue2 全局注册组件
// Vue.component('组件名', 组件)

// Vue3 全局注册组件
// app.component('组件名', 组件)


export default {
  // install 这种写法以后是提供给 app,use() 安装组件库用的
  install(app) {
    // vue3  全局注册组件
    // app.component('XtxSkeleton', XtxSkeleton)
    // app.component(XtxCarousel.name, XtxCarousel)
    // app.component(XtxMore.name, XtxMore)
    // app.component(XtxBread.name, XtxBread)
    // app.component(XtxBreadItem.name, XtxBreadItem)
    // 批量注册全局组件
    importFn.keys().forEach(key => {
      // 导入组件
      const component = importFn(key).default
      // 注册组件
      app.component(component.name, component)
    })
    defineDirective(app)
    // 如果你想挂载全局的属性，能够通过选项式API的组件实例调用的属性   this.$message
    app.config.globalProperties.$message = Message // 原型函数
    app.config.globalProperties.$confirm = Confirm // 原型函数
  }
}
