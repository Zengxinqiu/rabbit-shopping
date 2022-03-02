<template>
  <div class="detail-logistics">
    <p>
      <span>{{ logistics.list[0].time }}</span>
      <span>{{ logistics.list[0].text }} </span>
    </p>
    <a href="javascript:;" @click="onlogisitcsOrder(logistics)">查看物流</a>
  </div>
  <!-- 查看物流组件 -->
  <Teleport to="#dailog">
    <OrderLogistics ref="logisitcsOrder"></OrderLogistics>
  </Teleport>
</template>
<script>
import { ref } from "vue";
import { logisticsOrder } from "@/api/order";
import { useLogisitcsOrder } from "../index.vue";
import OrderLogistics from "./order-logistics.vue";
export default {
  components: { OrderLogistics },
  name: "DetailLogistics",
  props: {
    orderList: {
      type: Object,
      default: () => ({}),
    },
  },
  async setup(props) {
    const logistics = ref(null);
    // 模拟加载时间
    const $sleep = () =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    await $sleep();
    const { result } = await logisticsOrder(props.orderList.id);
    logistics.value = result;
    return { logistics, ...useLogisitcsOrder() };
  },
};
</script>
<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>