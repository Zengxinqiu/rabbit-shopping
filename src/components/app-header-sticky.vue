<template>
  <!-- <div class="app-header-sticky" :class="{ show: isShow }"> -->
  <!-- 第三包实现 -->
  <div class="app-header-sticky" :class="{ show: y >= 78 }">
    <div class="container" v-show="y >= 78">
      <RouterLink class="logo" to="/" />
      <AppHeaderNav />
      <div class="right">
        <RouterLink to="/">品牌</RouterLink>
        <RouterLink to="/">专题</RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
// import { ref } from "vue";
import AppHeaderNav from "./app-header-nav.vue";
import { useWindowScroll } from "@vueuse/core";
// 使用第三包去实现吸顶导航组件
export default {
  components: { AppHeaderNav },
  name: "AppHeaderSticky",

  setup() {
    // //   组件渲染后，监听滚动距离超过78px隐藏
    // const isShow = ref(false);
    // // 浏览器绑定滚动事件
    // window.onscroll = () => {
    //   // 获取文档滚动出去了多少
    //   const scrollTop = document.documentElement.scrollTop;
    //   console.log(scrollTop);
    //   //   页面滚动到78px以上，显示吸顶组件，否则隐藏
    //   if (scrollTop >= 78) {
    //     isShow.value = true;
    //   } else {
    //     isShow.value = false;
    //   }
    // };
    // return { isShow };
    const { y } = useWindowScroll();
    return { y };
  },
};
</script>

<style scoped lang="less">
.app-header-sticky {
  width: 100%;
  height: 80px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  background-color: #fff;
  border-bottom: 1px solid #e4e4e4;
  //   默认移出顶部且完全透明，定义一个类回到默认吸顶位置完全显示。
  transform: translateY(-100%);
  opacity: 0;
  &.show {
    transition: all 0.3s linear;
    transform: translateY(0);
    opacity: 1;
  }
  .container {
    display: flex;
    align-items: center;
  }
  .logo {
    width: 200px;
    height: 80px;
    background: url(~@/assets/images/logo.png) no-repeat right 2px;
    background-size: 160px auto;
  }
  .right {
    width: 220px;
    display: flex;
    text-align: center;
    padding-left: 40px;
    border-left: 2px solid @xtxColor;
    a {
      width: 38px;
      margin-right: 40px;
      font-size: 16px;
      line-height: 1;
      &:hover {
        color: @xtxColor;
      }
    }
  }
}
</style>