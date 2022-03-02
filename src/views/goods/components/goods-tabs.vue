<template>
  <div class="goods-tabs">
    <nav>
      <a
        :class="{ active: activeCom === 'GoodsDetail' }"
        href="javascript:;"
        @click="activeCom = 'GoodsDetail'"
        >商品详情</a
      >
      <a
        :class="{ active: activeCom === 'GoodsComment' }"
        href="javascript:;"
        @click="activeCom = 'GoodsComment'"
        >商品评价<span>(500+)</span></a
      >
    </nav>
    <!-- 切换内容的地方 -->
    <keep-alive>
      <component :is="activeCom"></component>
    </keep-alive>
  </div>
</template>

<script>
import { ref } from "vue";
import GoodsComment from "./goods-comment.vue";
import GoodsDetail from "./goods-detail.vue";
export default {
  components: { GoodsComment, GoodsDetail },
  name: "GoodsTabs",
  setup() {
    const activeCom = ref("GoodsDetail");
    return { activeCom };
  },
};
</script>

<style lang="less" scoped>
.goods-tabs {
  min-height: 600px;
  background: #fff;
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>