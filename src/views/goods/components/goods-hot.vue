<template>
  <div class="goods-hot" ref="target">
    <h3 v-if="type === 1">24小时热销榜</h3>
    <h3 v-else-if="type === 2">热销周榜</h3>
    <h3 v-else>热销总榜</h3>
    <GoodsItem v-for="item in List" :key="item" :goods="item"></GoodsItem>
  </div>
</template>

<script>
import GoodsItem from "@/views/category/components/goods-item.vue";
import { findGoodsHot } from "@/api/good";
import { useLazYData } from "@/hooks/index.js";
export default {
  components: { GoodsItem },
  name: "GoodsHot",
  props: {
    type: {
      type: Number,
      default: 1,
    },
    goodsId: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    // const list = ref([]);
    // findHotGoods({ id: props.goodsId, type: props.type }).then(({ result }) => {
    //   list.value = result;
    //   console.log(result);
    // });
    // 数据懒加载
    // 🔔优化：请求按需加载 - 数据懒加载
    const { List, target } = useLazYData(() =>
      findGoodsHot({ id: props.goodsId, type: props.type })
    );
    return { List, target };
  },
};
</script>

<style scoped lang="less">
.goods-hot {
  h3 {
    height: 70px;
    background: @helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }
  :deep(.goods-item) {
    background: #fff;
    width: 100%;
    margin-bottom: 10px;
    img {
      width: 200px;
      height: 200px;
    }
    p {
      margin: 0 10px;
    }
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>