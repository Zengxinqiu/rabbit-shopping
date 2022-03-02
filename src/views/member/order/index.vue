<template>
  <div class="member-order-page">
    <XtxTabs v-model="activeName" @tab-click="tabClick">
      <XtxTabsPanel
        :name="item.name"
        :label="item.label"
        v-for="item in orderStatus"
        :key="item.name"
      >
        <div class="order-list">
          <div v-if="loading" class="loading"></div>
          <div class="none" v-if="!loading && orderList.length === 0">
            怎无数据
          </div>
          <OrderItem
            v-for="item in orderList"
            :key="item.id"
            :order="item"
            @on-cancel="onCancelOrder(item)"
            @delete-order="deleteOrder(item)"
            @on-firm-order="onConfirmOrder(item)"
            @on-logisitcs-Order="onlogisitcsOrder(item)"
          ></OrderItem>
          <XtxPagination
            v-if="total > requestParams.pageSize"
            @current-change="requestParams.page = $event"
            :total="total"
            :pageSize="requestParams.pageSize"
            :current-page="requestParams.page"
          >
          </XtxPagination>
        </div>
      </XtxTabsPanel>
    </XtxTabs>
  </div>
  <!-- 取消订单 -->
  <Teleport to="#dailog">
    <OrderCancel ref="orderCancelCom"></OrderCancel>
  </Teleport>
  <!-- 查看物流信息 -->
  <Teleport to="#dailog">
    <OrderLogistics ref="logisitcsOrder"></OrderLogistics>
  </Teleport>
</template>

<script>
import { reactive, ref, watch } from "vue";
import { orderStatus } from "@/api/constant";
import { ConfirmOrder, delteOrder, findOrderList } from "@/api/order";
import OrderItem from "./components/order-item.vue";
import OrderCancel from "./components/order-cancel.vue";
import Confirm from "@/components/library/Confirm";
import { Message } from "@/components/library/Message";
import OrderLogistics from "./components/order-logistics.vue";
// 封装逻辑-取消订单
export const useCancelOrder = () => {
  const orderCancelCom = ref(null);
  const onCancelOrder = (item) => {
    // item 就是要取消的订单
    console.log(item);
    orderCancelCom.value.open(item);
  };
  return { orderCancelCom, onCancelOrder };
};
//封装逻辑-确认收货
export const useConifrmOrder = () => {
  const onConfirmOrder = (item) => {
    Confirm({ text: "你确定收到货吗？ 确认后货款将会打给卖家" }).then(() => {
      ConfirmOrder(item.id).then(() => {
        Message({ type: "success", message: "确认收货成功" });
        //  收货后状态变成待评价
        item.orderState = 4;
      });
    });
  };
  return { onConfirmOrder };
};

// 封装逻辑-查看物流
export const useLogisitcsOrder = () => {
  const logisitcsOrder = ref(null);
  const onlogisitcsOrder = (item) => {
    logisitcsOrder.value.open(item);
  };
  return { logisitcsOrder, onlogisitcsOrder };
};
export default {
  components: { OrderItem, OrderCancel, OrderLogistics },
  name: "MemberOrder",
  setup() {
    const activeName = ref("all");
    // const clickTab = (name) => {
    //   console.log(name);
    // };
    //  查询订单参数
    const requestParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0,
    });
    //  获取订单列表
    const orderList = ref([]);
    //加载状态 暂无数据
    const loading = ref(true);
    // 分页实现
    const total = ref(0);
    const findOrderListFn = () => {
      loading.value = true;
      findOrderList(requestParams).then(({ result }) => {
        orderList.value = result.items;
        total.value = result.counts;
        loading.value = false;
      });
    };
    watch(
      requestParams,
      () => {
        findOrderListFn();
      },
      { immediate: true }
    );
    // 删除订单
    const deleteOrder = (item) => {
      Confirm({ text: "你确定删除该条订单吗" })
        .then(() => {
          delteOrder([item.id]).then(() => {
            Message({ type: "success", message: "删除订单成功" });
            findOrderListFn();
          });
        })
        .catch((e) => {});
    };
    // 切换到tab栏事件
    const tabClick = (tab) => {
      requestParams.orderState = tab.index;
      requestParams.page = 1;
    };

    return {
      activeName,
      orderStatus,
      orderList,
      tabClick,
      loading,
      total,
      requestParams,
      ...useCancelOrder(),
      deleteOrder,
      ...useConifrmOrder(),
      ...useLogisitcsOrder(),
    };
  },
};
</script>

<style scoped lang="less">
.order-list {
  background: #fff;
  padding: 20px;
}
.order-item {
  margin-bottom: 20px;
  border: 1px solid #f5f5f5;
  .head {
    height: 50px;
    line-height: 50px;
    background: #f5f5f5;
    padding: 0 20px;
    overflow: hidden;
    span {
      margin-right: 20px;
      &.down-time {
        margin-right: 0;
        float: right;
        i {
          vertical-align: middle;
          margin-right: 3px;
        }
        b {
          vertical-align: middle;
          font-weight: normal;
        }
      }
    }
    .del {
      margin-right: 0;
      float: right;
      color: #999;
    }
  }
  .body {
    display: flex;
    align-items: stretch;
    .column {
      border-left: 1px solid #f5f5f5;
      text-align: center;
      padding: 20px;
      > p {
        padding-top: 10px;
      }
      &:first-child {
        border-left: none;
      }
      &.goods {
        flex: 1;
        padding: 0;
        align-self: center;
        ul {
          li {
            border-bottom: 1px solid #f5f5f5;
            padding: 10px;
            display: flex;
            &:last-child {
              border-bottom: none;
            }
            .image {
              width: 70px;
              height: 70px;
              border: 1px solid #f5f5f5;
            }
            .info {
              width: 220px;
              text-align: left;
              padding: 0 10px;
              p {
                margin-bottom: 5px;
                &.name {
                  height: 38px;
                }
                &.attr {
                  color: #999;
                  font-size: 12px;
                  span {
                    margin-right: 5px;
                  }
                }
              }
            }
            .price {
              width: 100px;
            }
            .count {
              width: 80px;
            }
          }
        }
      }
      &.state {
        width: 120px;
        .green {
          color: @xtxColor;
        }
      }
      &.amount {
        width: 200px;
        .red {
          color: @priceColor;
        }
      }
      &.action {
        width: 140px;
        a {
          display: block;
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
}
.order-list {
  padding: 20px;
  position: relative;
  min-height: 400px;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(~@/assets/images/loading.gif)
    no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>