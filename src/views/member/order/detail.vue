<template>
  <div class="member-order" v-if="orderList">
    <!-- 操作栏 -->
    <DetailAction :orderList="orderList"></DetailAction>
    <!-- 步骤条 -->
    <DetailSteps :orderList="orderList"></DetailSteps>
    <!-- 查看物流 -->
    <Suspense v-if="[3, 4, 5].includes(orderList.orderState)">
      <!--组件加载完毕  -->
      <template #default>
        <DetailLogistics :orderList="orderList"></DetailLogistics>
      </template>
      <!--  组件加载中显示-->
      <template #fallback>
        <div class="loading">loading</div>
      </template>
    </Suspense>
    <!-- 商品信息 -->
    <OrderInfo :orderList="orderList"></OrderInfo>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRoute } from "vue-router";
import DetailAction from "./components/detail-action.vue";
import { findOrderDetail } from "@/api/order";
import DetailSteps from "./components/detail-steps.vue";
import DetailLogistics from "./components/detail-logistics.vue";
import OrderInfo from "./components/order-info.vue";
export default {
  components: { DetailAction, DetailSteps, DetailLogistics, OrderInfo },
  name: "MemberDetail",
  setup() {
    // 获取路由
    const route = useRoute();
    const orderList = ref(null);
    findOrderDetail(route.params.id).then(({ result }) => {
      orderList.value = result;
      console.log(result);
    });
    return { orderList };
  },
};
</script>

<style scoped lang="less">
.member-order {
  background-color: #fff;
}
</style>