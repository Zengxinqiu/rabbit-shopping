<template>
  <div class="cart-sku" ref="target">
    <div class="attrs" @click="toggle">
      <span class="ellipsis">{{ attrsText }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="layer" v-if="isShow">
      <template v-if="goods">
        <GoodsSku :skuId="skuId" :goods="goods" @change="changeSku"></GoodsSku>
        <XtxButton
          @click="submit"
          type="primary"
          size="mini"
          style="margin-left: 60px"
          >确认</XtxButton
        >
        <XtxButton
          @click="hide"
          type="primary"
          size="mini"
          style="margin-left: 20px"
          >取消</XtxButton
        >
      </template>
      <div v-else class="loading"></div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import GoodsSku from "@/views/goods/components/goods-sku.vue";
import { getSpecsAndSkus } from "@/api/good";
import { Message } from "@/components/library/Message";
export default {
  components: { GoodsSku },
  name: "CartSku",
  props: {
    attrsText: {
      type: String,
      default: "",
    },
    skuId: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const goods = ref(null);
    const isShow = ref(false);
    // 选择sku时候触发
    const currSku = ref(null);
    const changeSku = (sku) => {
      currSku.value = sku;
      console.log(currSku.value);
    };
    // 点击确认的时候，提交sku 信息给购物车组件
    const submit = () => {
      // 给购物车组件数据的前提：有sku信息，sku信息完整。sku中的skuId不能现有props.skuId一样
      //   if (
      //     currSku.value &&
      //     currSku.value.skuId &&
      //     currSku.value.skuId != props.skuId
      //   ) {
      //     emit("change", currSku.value);
      //     hide();
      //     Message({ type: "success", message: "更改成功" });
      //     console.log(currSku.value);
      //   }
      // 如果没有选择新的规格，直接隐藏
      if (!currSku.value) return hide();
      // 如果有空对象， 但是没有 skuid 。
      if (!currSku.value.skuId)
        return Message({ type: "warn", message: "请选择完整规格" });
      if (currSku.value.skuId === props.skuId) return hide();
      // 选择了新的规格，通知父组件
      if (currSku.value.skuId) {
        emit("change", currSku.value);
        Message({ type: "success", message: "更改成功" });
        hide();
      }
    };
    const show = async () => {
      isShow.value = true;
      //   获取当前spec 和 sku数据
      const { result } = await getSpecsAndSkus(props.skuId);
      console.log(result);
      goods.value = result;
    };
    const hide = () => {
      isShow.value = false;
      goods.value = null;
    };
    const toggle = () => {
      isShow.value ? hide() : show();
    };
    const target = ref(null);
    onClickOutside(target, () => {
      hide();
    });
    return { isShow, toggle, target, goods, changeSku, submit, hide };
  },
};
</script>

<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display: inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor, 50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(0.8, 1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(~@/assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>