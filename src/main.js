// createApp 用于创建 vue 应用实例
import {
  createApp
} from 'vue'
// 导入自己封装的组件库
import XtxUI from '@/components/library/index.js'
// 导入根组件
import App from './App.vue'
// 导入VueRouter 路由实例
import router from './router'
// 导入vuex 仓库实例
import store from './store'
// 导入模拟数据
import './mock'
// 导入重置样式的包
import 'normalize.css'
// 导入项目公用样式
import '@/assets/styles/common.less'
createApp(App).use(store).use(router).use(XtxUI).mount('#app')
