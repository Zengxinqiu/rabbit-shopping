<template>
  <!-- 防止报错，加载完成goods再显示所有内容 -->
  <div class="xtx-goods-page" v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="'/category/' + goods.categories[1].id">{{
          goods.categories[1].name
        }}</XtxBreadItem>
        <XtxBreadItem :to="'/category/sub/' + goods.categories[0].id">{{
          goods.categories[0].name
        }}</XtxBreadItem>
        <XtxBreadItem>{{ goods.name }}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <!-- 商品信息左边 -->
        <div class="goods-info-left">
          <GoodsImage :image="goods.mainPictures"></GoodsImage>
          <GoodsSales></GoodsSales>
        </div>
        <!-- 商品信息右边 -->
        <div class="goods-info-right">
          <GoodsName :goods="goods"></GoodsName>
          <GoodsSku :goods="goods" @change="changeSku"></GoodsSku>
          <XtxNumbox
            label="数量"
            v-model="count"
            :max="goods.inventory"
          ></XtxNumbox>
          <XtxButton
            type="primary"
            style="margin-top: 20px"
            @click="addToCartBtn"
          >
            加入购物车</XtxButton
          >
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant :goodsId="goods.id" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <div class="goods-tabs">
            <GoodsTabs></GoodsTabs>
          </div>
          <!-- 注意事项 -->
          <div class="goods-warn">
            <GoodsWarn></GoodsWarn>
          </div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot :goodsId="goods.id" :type="1"></GoodsHot>
          <GoodsHot :goodsId="goods.id" :type="2"></GoodsHot>
          <GoodsHot :goodsId="goods.id" :type="3"></GoodsHot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { provide, ref, watch } from "vue";
import GoodsRelevant from "./components/goods-relevant.vue";
import { useRoute } from "vue-router";
import { findGood } from "@/api/good.js";
import GoodsImage from "./components/goods-image.vue";
import GoodsSales from "./components/goods-sales.vue";
import GoodsName from "./components/goods-name.vue";
import GoodsSku from "./components/goods-sku.vue";
import GoodsTabs from "./components/goods-tabs.vue";
import GoodsHot from "./components/goods-hot.vue";
import GoodsWarn from "./components/goods-warn.vue";
import { Message } from "@/components/library/Message";
import store from "@/store";
import { useStore } from "vuex";
export default {
  name: "XtxGoodsPage",
  components: {
    GoodsRelevant,
    GoodsImage,
    GoodsSales,
    GoodsName,
    GoodsSku,
    GoodsTabs,
    GoodsHot,
    GoodsWarn,
  },
  setup() {
    const goods = ref(null);
    const route = useRoute();

    // 注意单页面应用路由变化，需要重新获取商品详情
    watch(
      () => route.params.id,
      async (id) => {
        // 如果不是商品详情页不处理
        if (route.path !== `/product/${id}`) return;
        const { result } = await findGood(id);
        goods.value = result;

        console.log(result);
      },
      { immediate: true }
    );
    const count = ref(1);
    const changeSku = (val) => {
      if (val.skuId) {
        console.log("父组件接收到选中的规格数据", val);
        goods.value.skuId = val.skuId;
        goods.value.inventory = val.inventory;
        goods.value.price = val.price;
        goods.value.oldPrice = val.oldPrice;
        goods.value.attrsText = val.attrsText;
      } else {
        goods.value.skuId = "";
      }
    };
    // 提供数据给后代组件
    provide("goods", goods);
    const store = useStore();
    const addToCartBtn = async () => {
      // 判断是否有选择完整规格（是否skuid）
      if (!goods.value.skuId)
        return Message({ type: "warn", message: "请选择完整规格" });

      // 库存不足
      if (count.value > goods.value.inventory)
        return Message({ type: "warn", message: "库存不足" });

      const goodsItem = {
        id: goods.value.spuCode, // SPUID
        name: goods.value.name, // 商品名称
        price: goods.value.oldPrice, // 加入时价格
        nowPrice: goods.value.price, // 当前的价格
        skuId: goods.value.skuId, // SKUID
        attrsText: goods.value.attrsText, // 属性文字，例如“颜色:瓷白色 尺寸：8寸”
        stock: goods.value.inventory || goods.value.stock, // 库存
        count: count.value, // 🔔数量
        picture: goods.value.mainPictures[0], // 🔔图片
        selected: true, // 是否选中
        isCollect: false,
        isEffective: true,
        discount: 1,
      };
      console.log(goodsItem);
      //  添加到VueX仓库中 ，Vuex数据做了本地存储同步， 所以可以通过本地存储查看数据
      store.dispatch("cart/insertCart", goodsItem).then((msg) => {
        Message({ type: "success", message: "加入购物车成功" });
      });
    };

    return { goods, count, changeSku, addToCartBtn };
  },
};
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .goods-info-left {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .goods-info-right {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}

.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>