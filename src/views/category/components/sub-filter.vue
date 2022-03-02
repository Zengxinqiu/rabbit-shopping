<template>
  <!-- 筛选区 -->
  <div class="sub-filter">
    <div class="item" v-for="item in list" :key="item.id">
      <div class="head">{{ item.name }}：</div>
      <div class="body">
        <a
          href="javascript:;"
          @click="getAttrsFn(item, {})"
          :class="{ active: item.activeName === undefined }"
          >全部</a
        >
        <a
          href="javascript:;"
          v-for="item2 in item.properties"
          :key="item2.id"
          @click="getAttrsFn(item, item2)"
          :class="{ active: item.activeName === item2.name }"
          >{{ item2.name }}</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import { computed, inject, reactive, toRef } from "vue";
export default {
  name: "SubFilter",
  setup() {
    const subCate = inject("subCate");
    const reqParams = inject("reqParams");

    //  问题修复：把品牌也定义成响应式数据，否则视图更新不同步
    const brands = reactive({
      id: null,
      name: "品牌",
      properties: subCate.value.brands,
    });
    // 🔔 筛选区的列表数据其实包含两部分：品牌数据 + 销售规格
    const list = computed(() => {
      return [
        // 品牌数据 - 参考销售规格的格式组装数据
        brands,
        // 销售规格 - 已这个格式为主要
        ...subCate.value.saleProperties,
      ];
    });

    // 当前筛选区需要收集两份数据： 1. 商品属性数组  2. 品牌id
    const attrs = toRef(reqParams, "attrs");
    const brandId = toRef(reqParams, "brandId");
    const getAttrsFn = (item, tiem2) => {
      // 点击的时候获取属性名称，并通过 :class 绑定高亮
      item.activeName = tiem2.name;
      // 🔔 点击品牌的时候，收集的是品牌的id，并且需要存储到一个叫 brandId 的字段中
      if (item.name === "品牌") {
        brandId.value = tiem2.id;
        return;
      }
      // 点击属性的时候有两种情况：
      const index = attrs.value.findIndex(
        (tiem) => item.groupName === tiem.name
      );
      // 情况1 ：当前属性没有被点击过，就添加一份新的属性数据
      if (index === -1) {
        attrs.value.push({
          groupName: item.name,
          propertyName: item.activeName,
        });
      } else {
        // 情况2 已经有属性字段了。就修改值即可
        attrs.value[index].propertyName = item.activeName;
      }
      // 过滤去除一些无效值
      attrs.value = attrs.value.filter((item) => item.propertyName);
    };
    console.log(list);
    return { subCate, list, getAttrsFn };
  },
};
</script>

<style scoped lang="less">
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>