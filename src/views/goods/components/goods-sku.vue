<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.name">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img
            :class="{ selected: val.selected, disabled: val.disabled }"
            @click="clickSpecs(item, val)"
            v-if="val.picture"
            :src="val.picture"
            :title="val.name"
          />
          <span
            :class="{ selected: val.selected, disabled: val.disabled }"
            @click="clickSpecs(item, val)"
            v-else
            >{{ val.name }}</span
          >
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import bwPowerSet from "@/vender/power-set";
const spliter = "★";
// 根据skus数据得到路径字典对象

const getPathMap = (skus) => {
  const pathMap = {};
  skus.forEach((sku) => {
    // 1. 过滤出有库存有效的sku
    if (sku.inventory) {
      // powerSetRes 算法处理规格所有组合
      const powerSetRes = bwPowerSet(sku.specs.map((item) => item.valueName));
      // console.log(powerSetRes, sku.id);
      // 处理成查询字典
      powerSetRes.forEach((item) => {
        //  字典的key 处理成字符串
        const key = item.join(spliter);
        // console.log(key);
        // 如果没有加入过字典
        if (!pathMap[key]) {
          // 初始化一个数组，并放入第一个skuid
          pathMap[key] = [sku.id];
        } else {
          // 已经存在，追加新的skuid进去即可
          pathMap[key].push(sku.id);
        }
      });
    }
  });
  // 注意：返回处理后的字典
  return pathMap;
};

// 得到当前选中规格集合 -用于模拟用户下一次的动作
const getSelectedArr = (specs) => {
  // console.log(specs);
  const arr = [];
  specs.forEach((spec) => {
    const obj = spec.values.find((item) => item.selected);
    // console.log(obj.name);
    arr.push(obj ? obj.name : undefined);
  });
  return arr;
};

// 更新按钮的禁用状态 - 模拟用户下一次选中
const updateDisabledStatus = (specs, pathMap) => {
  console.log(111, specs, pathMap);
  specs.forEach((spec, index) => {
    // 获取当前选中的规格集合
    const selectedArr = getSelectedArr(specs);
    console.log(selectedArr, spec);
    // 根据当前选中的值
    spec.values.forEach((item) => {
      // 已经选中的按钮不用模拟
      if (selectedArr[index] === item.name) return;
      // 模拟其他未选中的值
      selectedArr[index] = item.name;
      // 过滤掉无效值并处理成字符串，用于查字典
      const key = selectedArr.filter((v) => v).join(spliter);
      console.log("模拟用户的下一次操作", selectedArr);
      // 查找字典中是否存在，不存在就处理成禁用状态
      item.disabled = !pathMap[key];
    });
  });
};

// 初始化选中转态
const initSelectedStatus = (skuId, goods) => {
  // 根据skuid 查询到需要实现选中的规格对象
  const obj = goods.skus.find((item) => item.id === skuId);
  console.log(obj);
  if (obj) {
    // 遍历商品规格数组
    goods.specs.forEach((spec, index) => {
      // 根据下标获取到规格文字
      const value = obj.specs[index].valueName;
      console.log(value);
      // 添加选中转态
      spec.values.forEach((val) => {
        val.selected = val.name === value;
      });
    });
  }
};

export default {
  name: "GoodsSku",
  props: {
    goods: {
      type: Object,
      default: () => ({}),
    },
    // 购物车页面需要根据 skuId 实现默认规格选择
    skuId: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    // 根据 skus 处理成查询字典
    const pathMap = getPathMap(props.goods.skus);
    console.log(pathMap);
    // 组件初始的时候更新禁用状态
    // 组件初始化的时候更新禁用状态
    // updateDisabledStatus(props.goods.specs, pathMap);
    // 根据传入的skuId默认选中规格按钮
    initSelectedStatus(props.skuId, props.goods);

    // 组件初始化的时候更新禁用状态
    updateDisabledStatus(props.goods.specs, pathMap);

    const clickSpecs = (item, val) => {
      // 如果是禁用状态不作为
      if (val.disabled) return;
      //  选中效果
      if (!val.selected) {
        // 排他：先清空，再让当前高亮
        // 2. 排他选中
        item.values.forEach((theItem) => {
          theItem.selected = false;
        });
        val.selected = true;
        // 实现选中的时候获取一下选中的数组
        const res = getSelectedArr(props.goods.specs);
        if (res.includes(undefined)) {
          console.log(1, "规格还没选完整");

          emit("change", {});
        } else {
          console.log(2, "规格选择完整", res);
          // 根据完整规格获取到skuid
          const key = res.join(spliter);
          const [skuId] = pathMap[key];
          console.log(skuId);
          // 根据skuid查找商品信息（价格， 就价格，库存。规格文本）
          const obj = props.goods.skus.find((item) => item.id === skuId);
          // console.log(obj);
          const data = {
            skuId: obj.id,
            inventory: obj.inventory,
            oldPrice: obj.oldPrice,
            price: obj.price,
            attrsText: obj.specs
              .map(({ name, valueName }) => `${name}: ${valueName}`)
              .join(" "),
          };
          emit("change", data);
        }
      } else {
        emit("change", {});
        // 取消选中
        val.selected = false;
      }
      // 还要继续模拟下一次点击

      updateDisabledStatus(props.goods.specs, pathMap);
    };
    return { clickSpecs };
  },
};
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>