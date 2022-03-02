<template>
  <div class="top-category" v-if="cate">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <transition name="fade-right" mode="out-in">
          <!-- 注意添加key值 -->
          <XtxBreadItem :key="cate.name">{{ cate.name }}</XtxBreadItem>
        </transition>
      </XtxBread>
      <!-- 轮播图 -->
      <XtxCarousel :sliders="sliders" style="height: 500px" auto-play />
      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="item in cate.children" :key="item.id">
            <RouterLink :to="`/category/sub/${item.id}`">
              <img :src="item.picture" alt="" />
              <p>{{ item.name }}</p>
            </RouterLink>
          </li>
        </ul>
      </div>
      <!-- 不同分类商品 -->
      <div class="ref-goods" v-for="item in cate.children" :key="item.id">
        <div class="head">
          <h3>- {{ item.name }}-</h3>
          <p class="tag">{{ item.desc }}</p>
          <XtxMore></XtxMore>
        </div>
        <div class="body">
          <GoodsLtem
            v-for="item2 in item.goods"
            :key="item2.id"
            :goods="item2"
          ></GoodsLtem>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { findBanner } from "@/api/home";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { findTopCategory } from "@/api/category";
import GoodsLtem from "./components/goods-item.vue";
export default {
  components: { GoodsLtem },
  name: "TopCategory",
  setup() {
    // 轮播图
    const sliders = ref([]);
    findBanner(2).then((data) => {
      sliders.value = data.result;
    });
    // 导入路由获取分类 id，根据分类id获取分类数据进行渲染。
    // 获取一级分类数据

    const route = useRoute();
    const cate = ref(null);

    // 监听路由 id 参数的变化，id 发生变化重新发送请求获取新的分类数据
    watch(
      () => route.params.id,
      (id) => {
        // 检查当前路由的路径是否为一级分类的路径，如果不是就直接退出
        // 自行测试：从一级分类跳转到首页和一级分类跳转到二级分类
        if (route.path !== `/category/${id}`) return;
        // 一级请求
        // 一级分类请求
        findTopCategory(id).then(({ result }) => {
          console.log("分类数据", result);
          cate.value = result;
        });
      },
      { immediate: true }
    );

    return { sliders, cate };
  },
};
</script>
<style scoped lang="less">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
  }
  .head {
    .xtx-more {
      position: absolute;
      top: 20px;
      right: 20px;
    }
    .tag {
      text-align: center;
      color: #999;
      font-size: 20px;
      position: relative;
      top: -20px;
    }
  }
  .body {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 65px 30px;
  }
}
</style>