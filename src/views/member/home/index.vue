<template>
  <div class="member-home">
    <!-- 概览 -->
    <HomeOverview></HomeOverview>
    <!-- 收藏 -->
    <HomePanel title="我的收藏">
      <GoodsItem
        v-for="item in collectList"
        :key="item.id"
        :goods="item"
      ></GoodsItem>
    </HomePanel>
    <!-- 足迹 -->
    <HomePanel title="我的足迹">
      <GoodsItem
        v-for="item in browserslists"
        :key="item.id"
        :goods="item"
      ></GoodsItem>
    </HomePanel>
    <!-- 猜你喜欢 -->
    <GoodsRelevant></GoodsRelevant>
  </div>
</template>
<script>
import GoodsRelevant from "@/views/goods/components/goods-relevant.vue";
import HomeOverview from "./components/home-overview.vue";
import HomePanel from "./components/home-panel.vue";
import GoodsItem from "@/views/category/components/goods-item.vue";
import { browserslist, findCollect } from "@/api/member.js";
import { ref } from "vue";
export default {
  components: { HomeOverview, HomePanel, GoodsRelevant, GoodsItem },
  name: "MemberHome",
  setup() {
    // 接收虚拟接口数据
    const collectList = ref([]);
    findCollect({ page: 1, pageSize: 4 }).then(({ result }) => {
      console.log(result);
      collectList.value = result.items;
    });

    // 接收足迹虚拟接口数据
    const browserslists = ref([]);
    browserslist({ page: 1, pageSize: 4 }).then(({ result }) => {
      console.log("足迹", result);
      browserslists.value = result.items;
    });

    return { collectList, browserslists };
  },
};
</script>
<style scoped lang="less">
:deep(.xtx-carousel) .carousel-btn.prev {
  left: 5px;
}
:deep(.xtx-carousel) .carousel-btn.next {
  right: 5px;
}
</style>