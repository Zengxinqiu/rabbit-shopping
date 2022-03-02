<template>
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证" ref="target">
    <template #right>
      <a
        href="javascript:;"
        @click="moveX = 0"
        :class="{ disabled: moveX === 0 }"
        class="iconfont icon-angle-left prev"
      ></a>
      <a
        href="javascript:;"
        @click="moveX = '-50%'"
        :class="{ disabled: moveX === '-50%' }"
        class="iconfont icon-angle-right next"
      ></a>
    </template>
    <div class="box" ref="box">
      <transition name="fade">
        <ul
          class="list"
          :style="`transform:translateX(${moveX})`"
          v-if="List.length"
        >
          <li v-for="item in List" :key="item.id">
            <RouterLink to="/">
              <img v-lazy="item.picture" alt="" />
            </RouterLink>
          </li>
        </ul>
        <div class="skeleton" v-else>
          <XtxSkeleton
            class="item"
            v-for="i in 5"
            :key="i"
            width="240px"
            height="305px"
            bg="#e4e4e4"
          ></XtxSkeleton>
        </div>
      </transition>
    </div>
  </HomePanel>
</template>

<script>
import { findBrand } from "@/api/home";
import HomePanel from "./home-panel.vue";
import { useLazYData } from "@/hooks/index";
import { ref } from "vue";
export default {
  name: "HomeBrand",
  components: { HomePanel },
  setup() {
    // 利用懒加载请求数据
    const { target, List } = useLazYData(() => findBrand(10));
    console.log("获取到数据了", { target, List });
    // 切换效果
    const moveX = ref(0);
    return { target, List, moveX };
  },
};
</script>

<style scoped lang="less">
.home-panel {
  background: #f5f5f5;
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px;
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
  .skeleton {
    width: 100%;
    display: flex;
    .item {
      margin-right: 10px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
