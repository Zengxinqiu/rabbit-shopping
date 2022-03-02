<template>
  <HomePanel title="人气推荐" sub-title="人气爆款 不容错过" ref="target">
    <transition name="fade">
      <ul ref="pannel" class="goods-list" v-if="List.length">
        <li v-for="item in List" :key="item.id">
          <RouterLink to="/">
            <img v-lazy="item.picture" alt="" />
            <p class="name">{{ item.title }}</p>
            <p class="desc">{{ item.alt }}</p>
          </RouterLink>
        </li>
      </ul>
      <!-- 骨架效果 -->
      <HomeSkeleton v-else></HomeSkeleton>
    </transition>
  </HomePanel>
</template>

<script>
import { findHot } from "@/api/home";
import HomePanel from "./home-panel.vue";

import HomeSkeleton from "./home-skeleton.vue";
// 导入组件懒加载
import { useLazYData } from "@/hooks/index";
export default {
  name: "HomeNew",
  components: {
    HomePanel,
    HomeSkeleton,
  },
  setup() {
    // 接收人气推荐数据
    const { target, List } = useLazYData(findHot);
    return { target, List };
  },
};
</script>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>