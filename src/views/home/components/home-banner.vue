<template>
  <div class="home-banner">
    <XtxCarousel :sliders="list" auto-play />
  </div>
</template>

<script>
import { ref } from "vue";
import { findBanner } from "@/api/home";

export default {
  name: "HomeBanner",
  setup() {
    const list = ref([]);
    findBanner().then(({ result }) => {
      list.value = result;
      console.log(result);
    });
    return { list };
  },
};
</script>

<style scoped lang="less">
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;
}
// 覆盖轮播图组件样式
.xtx-carousel {
  :deep(.carousel-btn.prev) {
    left: 270px !important;
  }
  :deep(.carousel-indicator) {
    padding-left: 250px;
  }
}
</style>