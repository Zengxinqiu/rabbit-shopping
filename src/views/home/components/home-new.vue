<template>
  <div class="home-new">
    <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱" ref="target">
      <template #right><XtxMore path="/" /></template>
      <!-- 制作动画效果 -->
      <transition name="fade">
        <!-- 面板内容 -->
        <ul class="goods-list" v-if="List.length">
          <li v-for="item in List" :key="item.id">
            <RouterLink :to="`/product/${item.id}`">
              <img v-lazy="item.picture" alt="" />
              <p class="name ellipsis">{{ item.name }}</p>
              <p class="price">&yen;{{ item.price }}</p>
            </RouterLink>
          </li>
        </ul>
        <!-- 骨架效果 -->
        <HomeSkeleton v-else></HomeSkeleton>
      </transition>
    </HomePanel>
  </div>
</template>
<script>
import { findNew } from "@/api/home";
import HomePanel from "./home-panel.vue";
import HomeSkeleton from "./home-skeleton.vue";
import { useLazYData } from "@/hooks/index.js";
export default {
  components: { HomePanel, HomeSkeleton },
  name: "HomeNew",
  setup() {
    const { target, List } = useLazYData(findNew);
    return { target, List };
  },
};
</script>
<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>