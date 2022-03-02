// 实现使用函数调用xtx-message组件的逻辑
import {
  createVNode,
  render
} from 'vue'
import XtxMessage from './xtx-message.vue'

// 准备dom容器
// 创建虚拟DOM，createVNode('标签名/组件', { 属性 })
const divVNode = createVNode('div', {
  class: 'xtx-message-container'
})
// 把虚拟 DOM 渲染到 body 中
render(divVNode, document.body)
// 虚拟 DOM 渲染成功后，可以通过 el 属性获取到真实的 DOM 节点
const div = divVNode.el


// 定时器标识
let timer = null

export const Message = ({
  type,
  message
}) => {
  // 实现：根据xtx-message.vue渲染消息提示
  // 1. 导入组件
  // 2. 根据组件创建虚拟节点
  const vnode = createVNode(XtxMessage, {
    type,
    message
  })
  // 3. 准备一个DOM容器
  // 4. 把虚拟节点渲染DOM容器中
  render(vnode, div)
  // 5. 开启定时，移出DOM容器内容
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 3000)
}
