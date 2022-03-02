import { findAllCategory } from "@/api/category";
import { topCategory } from "@/api/constants";




// 分类模块
export default {
    namespaced: true,
    state: () => {
        return {
            // 如果默认是[]数组，看不见默认的9个分类，等你数据加载完毕才会看到。
            // 所以：根据常量数据来生成一个默认的顶级分类数据，不会出现空白（没数据的情况）
            list: topCategory.map(item => ({ name: item }))
        }
    },
    // 加载数据成功后需要修改list 所以需要mutations函数
    mutations: {
        setList(state, payload) {
            state.list = payload
        },
        show(state, theItem) {
            // 根据theItem 的 id 查找到对应一级分类，改变 open字段
            const object = state.list.find(item => item.id === theItem.id)
            object.open = true
        },
        hide(state, theItem) {
            // 根据theItem 的 id 查找到对应一级分类，改变 open字段
            const object = state.list.find(item => item.id === theItem.id)
            object.open = false
        }

    },
    // 需要向后台加载数据，所以需要actions函数获取数据
    actions: {
        async getList({ commit }) {
            // 发送请求
            const { result } = await findAllCategory()
            console.log(result);
            // 给每一个一级分类定义控制显示隐藏的数据，open
            result.forEach(item => {
                item.open = false;
            });
            // 获取数据成功，提交mutations进行数据修改

            commit('setList', result)
        }
    }
}