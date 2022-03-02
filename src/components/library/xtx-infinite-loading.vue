<template>
  <div class="xtx-infinite-loading" ref="target">
    <div class="loading" v-show="loading">
      <span class="img"></span>
      <span class="text">正在加载...</span>
    </div>
    <div class="none" v-if="finished">
      <span class="img"></span>
      <span class="text">亲，没有更多了</span>
    </div>
  </div>
</template>

<script>
import { useIntersectionObserver } from "@vueuse/core";
import { ref } from "vue";
export default {
  name: "XtxInfiniteLoading",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    finished: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const target = ref(null);
    // stop             用于停止检测函数
    // target           被检测的元素
    // isIntersecting   布尔值，元素是否可见 true/false
    useIntersectionObserver(target, ([{ isIntersecting }]) => {
      // 如果元素可以，发送请求获取数据，并停止检测避免重复发送请求
      if (isIntersecting) {
        // 如果显示了加载动画 或者 已完成盒子显示，都不触发加载
        if (props.loading === false && props.finished === false) {
          // console.log('isIntersecting元素可见性，发送请求获取数据', isIntersecting)
          emit("load");
        }
      }
    });
    return { target };
  },
};
</script>
<style scoped lang='less'>
.xtx-infinite-loading {
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    .img {
      width: 50px;
      height: 50px;
      background: url(~@/assets/images/load.gif) no-repeat center / contain;
    }
    .text {
      color: #999;
      font-size: 16px;
    }
  }
  .none {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    .img {
      width: 200px;
      height: 134px;
      background: url(~@/assets/images/none.png) no-repeat center / contain;
    }
    .text {
      color: #999;
      font-size: 16px;
    }
  }
}
</style>