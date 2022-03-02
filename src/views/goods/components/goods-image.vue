<template>
  <div class="goods-image">
    <!-- 放大图 -->
    <div class="large" v-show="!isOutside">
      <img
        :src="image[activeIndex]"
        alt=""
        :style="{ left: largePos.x, top: largePos.y }"
      />
    </div>
    <!-- 主图 -->
    <div class="middle" ref="target">
      <img :src="image[activeIndex]" alt="" />
      <!-- 主图上方的遮罩盒子 -->
      <div
        class="layer"
        v-show="!isOutside"
        :style="{ left: layerPos.x, top: layerPos.y }"
      ></div>
    </div>
    <!-- 图片列表 -->
    <ul class="small">
      <li
        v-for="(item, index) in image"
        :key="index"
        @mouseenter="activeIndex = index"
      >
        <img :src="item" alt="" />
      </li>
    </ul>
  </div>
</template>

<script>
import { reactive, ref, watch } from "vue";
import { useMouseInElement } from "@vueuse/core";
export default {
  name: "GoodsImage",
  props: {
    image: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const activeIndex = ref(0);
    const target = ref(null);
    // elementX/elementY    鼠标在盒子内的坐标
    // isOutside            表示目标元素外面/里面
    const { elementX, elementY, isOutside } = useMouseInElement(target);

    // 定义响应式数据，更新数据的时候更新视图
    const layerPos = reactive({ x: 0, y: 0 });
    const largePos = reactive({ x: 0, y: 0 });

    // 监听鼠标的两个坐标值
    watch([elementX, elementY], () => {
      // -100 鼠标和盒子中心对齐
      let x = elementX.value - 100;
      let y = elementY.value - 100;

      // 上右下左边界判断
      if (y < 0) y = 0;
      if (x < 0) x = 0;
      if (y > 200) y = 200;
      if (x > 200) x = 200;

      // 遮罩盒子坐标，注意 px 单位
      layerPos.x = x + "px";
      layerPos.y = y + "px";

      // 大图坐标， -1 反方向移动，2 是两倍比例移动
      largePos.x = -1 * 2 * x + "px";
      largePos.y = -1 * 2 * y + "px";
    });

    return { activeIndex, target, isOutside, layerPos, largePos };
  },
};
</script>

<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  // 大图预览
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
    overflow: hidden;
    z-index: 401;
    img {
      max-width: 800px;
      max-height: 800px;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0, 0, 0, 0.2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,
      &.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
