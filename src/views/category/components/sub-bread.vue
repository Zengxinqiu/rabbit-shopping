<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem :to="`/category/${subCate.parentId}`">{{
      subCate.parentName
    }}</XtxBreadItem>
    <transition name="fade-right" mode="out-in">
      <XtxBreadItem :key="subCate.name">{{ subCate.name }}</XtxBreadItem>
    </transition>
  </XtxBread>
</template>

<script>
import { inject } from "vue";
export default {
  name: "SubBread",
  setup() {
    // 后代组件通过 inject 接收到数据
    const subCate = inject("subCate");
    console.log(subCate);

    return { subCate };
  },
};
</script>
