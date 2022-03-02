<template>
  <ul class="app-header-nav">
    <li class="home"><RouterLink to="/">首页</RouterLink></li>
    <!-- 鼠标移出事件@mouseleave -->
    <!-- 鼠标移入事件@mousemove -->
    <li
      v-for="item in list"
      :key="item.id"
      @mouseleave="hide(item)"
      @mousemove="show(item)"
    >
      <RouterLink :to="`/category/${item.id}`" @click="hide(item)">{{
        item.name
      }}</RouterLink>
      <div class="layer" :class="{ open: item.open }">
        <ul>
          <li v-for="sub in item.children" :key="sub.id">
            <RouterLink :to="`/category/sub/${sub.id}`" @click="hide(item)">
              <img :src="sub.picture" alt="" />
              <p>{{ sub.name }}</p>
            </RouterLink>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  name: "AppHeaderNav",
  setup() {
    // 这里我们用ref 声明响应式数据，优点：可以把请求回来的数据赋值给 .value

    const store = useStore();
    const list = computed(() => {
      return store.state.category.list;
    });
    //  跳转的时候不会关闭二级类目，通过数据来控制
    // 1.vuex每个分类加上open数据
    // 2.vuex 提供显示和隐藏，修改open数据
    // 3.组件中使用vuex中的函数，使用时间来绑定，提供一个类名显示隐藏的类名
    // 定义两个方法显示和隐藏 分类
    const show = (item) => {
      store.commit("category/show", item);
    };
    const hide = (item) => {
      store.commit("category/hide", item);
    };
    // 提供给模板使用的数据需要在setup 最后返回
    return { list, show, hide };
  },
};
</script>

<style scoped lang="less">
.app-header-nav {
  width: 820px;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  position: relative;
  z-index: 999;
  > li {
    margin-right: 40px;
    width: 38px;
    text-align: center;
    > a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }
    &:hover {
      > a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
      // // 显示二级类目
      // > .layer {
      //   height: 132px;
      //   opacity: 1;
      // }
    }
  }
}
// 二级类名弹层
.layer {
  &.open {
    height: 132px;
    opacity: 1;
  }
  width: 1240px;
  background-color: #fff;
  position: absolute;
  left: -200px;
  top: 56px;
  height: 0;
  overflow: hidden;
  opacity: 0;
  box-shadow: 0 0 5px #ccc;
  transition: all 0.2s 0.1s;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 70px;
    align-items: center;
    height: 132px;
    li {
      width: 110px;
      text-align: center;
      img {
        width: 60px;
        height: 60px;
      }
      p {
        padding-top: 10px;
      }
      &:hover {
        p {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>