<template>
  <p class="g-name">{{ goods.name }}</p>
  <p class="g-desc">{{ goods.desc }}</p>
  <p class="g-price">
    <span>{{ goods.price }}</span>
    <span>{{ goods.oldPrice }}</span>
  </p>
  <div class="g-service">
    <dl>
      <dt>促销</dt>
      <dd>12月好物放送，App领券购买直降120元</dd>
    </dl>
    <dl>
      <dt>配送</dt>
      <dd>
        至 <XtxCity :fullLocation="fullLocation" @change="changeCity"></XtxCity>
      </dd>
    </dl>
    <dl>
      <dt>服务</dt>
      <dd>
        <span>无忧退货</span>
        <span>快速退款</span>
        <span>免费包邮</span>
        <a href="javascript:;">了解详情</a>
      </dd>
    </dl>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "GoodName",
  props: {
    goods: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    //  登录状态情况 ，显示某个地址
    // 情况1：未登录情况下，默认显示  "广东省广州市天河区"
    const provinceCode = ref("440000");
    const cityCode = ref("440100");
    const countyCode = ref("440106");
    const fullLocation = ref("广东省广州市天河区");

    // 已登录状态情况 显示用户的默认地址
    if (props.goods.useAddresses) {
      // addr.isDefault === 1 表示获取默认收货地址
      const defaultAddr = props.goods.userAddresses.find(
        (addr) => addr.isDefault === 1
      );
      // 查询到默认收货地址
      if (defaultAddr) {
        provinceCode.value = defaultAddr.provinceCode;
        cityCode.value = defaultAddr.cityCode;
        countyCode.value = defaultAddr.countyCode;
        fullLocation.value = defaultAddr.fullLocation;
      }
    }

    const changeCity = (address) => {
      provinceCode.value = address.provinceCode;
      cityCode.value = address.cityCode;
      countyCode.value = address.countyCode;
      fullLocation.value = address.fullLocation;
    };

    return { fullLocation, changeCity };
  },
};
</script>

<style lang="less" scoped>
.g-name {
  font-size: 22px;
}
.g-desc {
  color: #999;
  margin-top: 10px;
}
.g-price {
  margin-top: 10px;
  span {
    &::before {
      content: "¥";
      font-size: 14px;
    }
    &:first-child {
      color: @priceColor;
      margin-right: 10px;
      font-size: 22px;
    }
    &:last-child {
      color: #999;
      text-decoration: line-through;
      font-size: 16px;
    }
  }
}
.g-service {
  background: #f5f5f5;
  width: 500px;
  padding: 20px 10px 0 10px;
  margin-top: 10px;
  dl {
    padding-bottom: 20px;
    display: flex;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      color: #666;
      &:last-child {
        span {
          margin-right: 10px;
          &::before {
            content: "•";
            color: @xtxColor;
            margin-right: 2px;
          }
        }
        a {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
