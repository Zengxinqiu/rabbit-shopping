<template>
  <div class="detail-action">
    <div class="state">
      <span
        class="iconfont"
        :class="[`icon-order-${orderStatus[orderList.orderState].name}`]"
      ></span>
      <p>{{ orderStatus[orderList.orderState].label }}</p>
    </div>
    <div class="info">
      <p>订单编号：{{ orderList.id }}</p>
      <p>下单时间：{{ orderList.createTime }}</p>
    </div>
    <div class="btn">
      <!-- 待付款 -->
      <template v-if="orderList.orderState === 1">
        <XtxButton
          type="primay"
          size="small"
          @click="$router.push('/member/pay?id=' + orderList.id)"
          >立即付款</XtxButton
        >
        <XtxButton type="gray" size="small">取消订单</XtxButton>
      </template>
      <!-- 待发货 -->
      <template v-if="orderList.orderState === 2">
        <XtxButtonorder
          type="primay"
          size="small"
          @click="$router.push(`/member/checkout?orderId=${orderList.id}`)"
          >再次购买</XtxButtonorder
        >
      </template>
      <!-- 待收货 -->
      <template v-if="orderList.orderState === 3">
        <XtxButton type="p0rimay" size="small">确认收货</XtxButton>
        <XtxButton
          type="primay"
          size="small"
          @click="$router.push(`/member/checkout?orderId=${orderList.id}`)"
          >再次购买</XtxButton
        >
      </template>
      <!-- 待评价 -->
      <template v-if="orderList.orderState === 4">
        <XtxButton
          type="primay"
          size="small"
          @click="$router.push(`/member/checkout?orderId=${orderList.id}`)"
          >再次够买</XtxButton
        >
        <XtxButton type="primay" size="small">评价商品</XtxButton>
        <XtxButton type="primay" size="small">申请售后</XtxButton>
      </template>
      <!-- 以完成 -->
      <template v-if="orderList.orderState === 5">
        <XtxButton
          type="primay"
          size="small"
          @click="$router.push(`/member/checkout?orderId=${orderList.id}`)"
          >再次够买</XtxButton
        >
        <XtxButton type="primay" size="small">查看评价</XtxButton>
        <XtxButton type="primay" size="small">申请售后</XtxButton>
      </template>
    </div>
  </div>
</template>
<script>
import { orderStatus } from "@/api/constant";
export default {
  name: "OrderDetailAction",
  props: {
    orderList: {
      type: Object,
      default: () => {},
    },
  },
  setup() {
    return { orderStatus };
  },
};
</script>
<style scoped lang="less">
.detail-action {
  height: 180px;
  width: 100%;
  display: flex;
  align-items: center;
  .state {
    width: 220px;
    text-align: center;
    .iconfont {
      font-size: 40px;
      color: @xtxColor;
    }
    p {
      font-size: 16px;
      color: #666;
      margin-bottom: 10px;
    }
  }
  .info {
    width: 240px;
    line-height: 30px;
    p {
      color: #999;
    }
  }
  .btn {
    flex: 1;
    text-align: right;
    margin-right: 100px;
    .xtx-button {
      margin-left: 20px;
    }
  }
}
</style>