
// 引入axios 包
import axios from 'axios'
// 引入仓库实例 用于获取token
import store from '@/store'
// 引入路由实例 用于跳转页面
import router from '@/router'

// 导出基准地址 做了一个export导出， 引入 request.js 的时候可以通过解构获取到请求基地址
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net'

// 创建axios实例
const instance = axios.create({

    baseURL, // baseURL：baseURL 配置请求基地址
    timeout: 5000  // 请求超时
})


// 请求拦截器
instance.interceptors.request.use(config => {
    // 获取仓库中的用户数据
    const { profile } = store.state.user
    // 如果有token
    if (profile.token) {
        //  把token 信息添加到请求中
        config.headers.Authorization = `Bearer ${profile.token}`
    }
    // 返回加工后的配置，用于发送请求
    return config
}, err => {
    return Promise.reject(err)
})

// 响应拦截器
instance.interceptors.response.use(
    //    请求成功后， 返回 res.data
    res => res.data,
    // 处理错误
    err => {
        // 后端转态码 401 表示用户信息无效（token无效）
        if (err.response && err.response.status === 401) {
            // 清空无效用户信息
            store.commit('user/setUser', {})
            // router.currentRoute 获取当前路由实例（ref 响应式对象，所以获取数据的时候要多个.value）
            // fullPath 路由的完整路径
            // encodeURIComponent（） 特殊符号转码，路由兼容性更好
            const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
            // 跳转到登录页并携带回调地址
            router.push('/login?redirectUrl=' + fullPath)
        }
        // 用于 catch 捕获错误信息
        return Promise.reject(err)
    })


export default (url, method, submitData) => {

    return instance({
        url,
        method,
        //  键名称[] ，表示允许键名称js运算
        //  判断请求参数是否为get， 如果是就是用params 作为键名称，其他情况都用 data作为键名称
        [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
    })
}
