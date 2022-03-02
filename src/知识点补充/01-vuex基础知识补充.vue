<template>
  <!-- 根组件保留一个路由坑位 -->
  <!--1 获取仓库的数据 -->
  <h1>{{ $store.state.username }}</h1>
  <h1>{{ username }}</h1>
  <!-- 2.调用commit 立即修改 -->
  <button @click="$store.commit('setUserName', '小马')">
    点击改名（直接）
  </button>
  <button @click="btn">点击改名（直接 组合APi）</button>
  <hr />
  <!-- 3。异步操作获取到仓库数据 -->
  <button @click="$store.dispatch('setUserNameSync')">点击改名（异步）</button>
  <button @click="btn2">点击改名（异步组合APi）</button>
  <RouterView />
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    //    Vuex 也为组合Api提供了一个useStore 函数。用于访问创库的
    const store = useStore();
    console.log(store);
    // 1.获取仓库的数据
    console.log("从仓库中取出来的用户名", store.state.username); // 匿名
    // 注意：主要获取一个值，还是要注意处理响应式对象
    //  方案1.toRef 保留原来的store.state 关联
    // const username = toRef(store.state, "username");
    // 方案2.运用vue3 计算属性
    const username = computed(() => store.state.username);
    //  2.调用commit 立即修改
    const btn = () => {
      store.commit("setUserName", "小小马");
    };

    //  3。调用dispatch 进行异步操作
    const btn2 = () => {
      store.dispatch("setUserNameSync");
    };
    return { btn, btn2, username };
  },
};
</script>
