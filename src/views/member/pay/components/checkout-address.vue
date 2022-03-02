<template>
  <div class="checkout-address">
    <div class="text">
      <div v-if="!defaultAddress" class="none">
        您需要先添加收货地址才可提交订单。
      </div>
      <ul v-if="defaultAddress">
        <li>
          <span>收<i />货<i />人：</span>{{ defaultAddress.receiver }}
        </li>
        <li><span>联系方式：</span>{{ defaultAddress.contact }}</li>
        <li>
          <span>收货地址：</span
          >{{
            defaultAddress.fullLocation.replace(/ /g, "") +
            defaultAddress.address
          }}
        </li>
      </ul>
      <a
        v-if="defaultAddress"
        href="javascript:;"
        @click="addAddressBtn(defaultAddress)"
        >修改地址</a
      >
    </div>
    <div class="action">
      <XtxButton class="btn" @click="dialogVisible = true">切换地址</XtxButton>
      <XtxButton class="btn" @click="addAddressBtn">添加地址</XtxButton>
    </div>
    <XtxDialog title="切换地址" v-model="dialogVisible">
      <div
        class="text item"
        v-for="item in list"
        :key="item.id"
        :class="{ active: item.id === activeId }"
        @click="changeAddress(item.id)"
      >
        <ul>
          <li>
            <span>收<i />货<i />人：</span>{{ item.receiver }}
          </li>
          <li><span>联系方式：</span>{{ item.contact }}</li>
          <li>
            <span>收货地址：</span
            >{{ item.fullLocation.replace(/ /g, "") + item.address }}
          </li>
        </ul>
      </div>
      <template #footer>
        <XtxButton
          @click="dialogVisible = false"
          type="gray"
          style="margin-right: 20px"
          >取消</XtxButton
        >
        <XtxButton @click="confirmAddress" type="primary">确认</XtxButton>
      </template>
    </XtxDialog>
    <!-- 添加收货按钮 -->
    <AddressEdit ref="addressEditCom" @on-success="getAddress"></AddressEdit>
  </div>
</template>
<script>
import { computed, inject, ref, watch } from "vue";
import AddressEdit from "./address-edit.vue";

export default {
  components: { AddressEdit },
  name: "CheckoutAddress",
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    // 点击显示修改组件或者添加组件
    // 添加收货地址组件
    const addressEditCom = ref(null);
    // 添加收货地址和修改收货地址
    const addAddressBtn = (address) => {
      // 把默认收货地址传递给子组件，用于展示
      addressEditCom.value.open(address);
    };

    // 新的收货地址
    const newAddress = ref(null);
    // 显示到页面中的的收货地址
    const defaultAddress = computed(() => {
      // 如果没有添加或修改新的收货地址
      if (!newAddress.value) {
        // 选择默认地址
        return props.list.find((item) => item.isDefault === 0);
      } else {
        // 有新地址就显示新地址
        return newAddress.value;
      }
    });
    const requestParams = inject("requestParams");
    // id直接从页面显示的收货地址中收取，变化的时候也会自动监听重新获取
    watch(
      defaultAddress,
      (address) => {
        // 收集提交订单接口所需要的收货地址 id
        if (address) requestParams.addressId = address.id;
      },
      { immediate: true }
    );

    // 获取用户添加或者修改的地址
    const getAddress = (theval) => {
      console.log(theval);
      if (theval.receiver) {
        newAddress.value = { ...theval };
      }
    };

    //  切换收货地址
    //  点击地址时触发样式

    const activeId = ref(defaultAddress.value.id);
    const changeAddress = (theId) => {
      activeId.value = theId;
    };
    // 点击确认切换地址
    const confirmAddress = () => {
      newAddress.value = props.list.find((item) => item.id === activeId.value);
      dialogVisible.value = false;
    };
    // 显示隐藏对话框组件
    const dialogVisible = ref(false);
    return {
      dialogVisible,
      addressEditCom,
      addAddressBtn,

      defaultAddress,
      newAddress,
      getAddress,
      activeId,
      changeAddress,
      confirmAddress,
    };
  },
};
</script>
<style scoped lang="less">
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
.xtx-dialog {
  :deep(.wrapper) {
    .body {
      height: 400px;
      overflow: auto;
    }
  }
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,
      &:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor, 50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
</style>