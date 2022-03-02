<template>
  <div class="detail-steps" style="padding: 20px" v-if="orderList">
    <XtxSteps :active="orderList.orderState === 6 ? 1 : orderList.orderState">
      <XtxStepsItem
        title="提交订单"
        :desc="orderList.createTime"
      ></XtxStepsItem>
      <XtxStepsItem title="付款成功" :desc="orderList.payTime"></XtxStepsItem>
      <XtxStepsItem
        title="商品发货"
        :desc="orderList.consignTime"
      ></XtxStepsItem>
      <XtxStepsItem
        title="确认收货"
        :desc="orderList.evaluationTime"
      ></XtxStepsItem>
      <XtxStepsItem title="订单完成" :desc="orderList.endTime"></XtxStepsItem>
    </XtxSteps>
  </div>
</template>

<script>
export default {
  name: "DetailSteps",
  props: {
    orderList: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style>
</style>