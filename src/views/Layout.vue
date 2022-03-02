<template>
  <!--1. 引入头部组件 -->
  <AppTopnav></AppTopnav>
  <!-- 2. 导入公共头部组件 -->
  <!-- <header>公共头部</header> -->
  <AppHeader></AppHeader>
  <!-- 2.2 固定头部布局 -->
  <AppHeaderSticky></AppHeaderSticky>
  <main>
    <!-- 二级路由 -->
    <RouterView></RouterView>
  </main>
  <!-- 3.导入公共尾部 -->
  <AppFooter></AppFooter>
  <!-- <footer>公共底部</footer> -->
</template>

<script>
import AppTopnav from "@/components/app-topnav.vue";
import AppHeader from "@/components/app-header.vue";
import AppFooter from "@/components/app-footer.vue";
import { useStore } from "vuex";
import AppHeaderSticky from "@/components/app-header-sticky.vue";

export default {
  components: { AppTopnav, AppHeader, AppFooter, AppHeaderSticky },
  name: "xtx-layout",
  setup() {
    const store = useStore();
    store.dispatch("category/getList");
  },
};
</script>

<style scoped lang="less">
</style>