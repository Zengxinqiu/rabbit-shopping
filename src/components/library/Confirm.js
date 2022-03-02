import {
  createVNode,
  render
} from 'vue';
import XtxConfirm from './xtx-confirm.vue';


// 准备div
const divVNode = createVNode('div', {
  class: 'xtx-confirm-container'
});
render(divVNode, document.body);

// 获取Dom节点
const div = divVNode.el


// 导出函数可通过调用Confirm() 函数动态创建 XtxConfirm 组件
// 函数的返回值是 Promise 对象
export default ({
  title,
  text
}) => {
  return new Promise((resolve, reject) => {
    // 2.点击确认按钮，触发resolve 同时销毁组件
    const confirmCallback = () => {
      render(null, div)
      resolve()
    }
    // 3.点击取消按钮触发reject同时销毁组件
    const cancelCallback = () => {
      render(null, div)
      reject(new Error('点击取消'))
    }
    // 动态创建组件
    const vNode = createVNode(XtxConfirm, {
      title,
      text,
      confirmCallback,
      cancelCallback
    })
    render(vNode, div)
  })
}
