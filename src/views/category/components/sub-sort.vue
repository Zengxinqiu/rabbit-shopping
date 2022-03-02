<template>
  <div class="sub-sort">
    <div class="sort">
      <a
        href="javascript:;"
        @click="changeSort()"
        :class="{ active: reqParams.sortField === undefined }"
        >默认排序</a
      >
      <a
        href="javascript:;"
        @click="changeSort('publishTime')"
        :class="{ active: reqParams.sortField === 'publishTime' }"
        >最新商品</a
      >
      <a
        href="javascript:;"
        @click="changeSort('orderNum')"
        :class="{ active: reqParams.sortField === 'orderNum' }"
        >最高人气</a
      >
      <a
        href="javascript:;"
        @click="changeSort('evaluateNum')"
        :class="{ active: reqParams.sortField === 'evaluateNum' }"
        >评论最多</a
      >
      <a href="javascript:;" @click="changeSort('price')">
        价格排序
        <i
          class="arrow up"
          :class="{ active: reqParams.sortMethod === 'asc' }"
        />
        <i
          class="arrow down"
          :class="{ active: reqParams.sortMethod === 'desc' }"
        />
      </a>
    </div>
    <div class="check">
      <XtxCheckbox v-model="reqParams.inventory">仅显示有货商品</XtxCheckbox>
      <XtxCheckbox v-model="reqParams.onlyDiscount">仅显示特惠商品</XtxCheckbox>
    </div>
  </div>
</template>

<script>
import { inject } from "vue";
export default {
  name: "SubSort",
  setup() {
    // 获取数据，当前组件负责收集请求参数
    const reqParams = inject("reqParams");
    const changeSort = (sortField) => {
      // 1. 先收集排序方式
      reqParams.sortField = sortField;
      if (sortField === "price") {
        // 2. 收集价格排序规则
        reqParams.sortMethod = reqParams.sortMethod === "asc" ? "desc" : "asc";
      } else {
        // 3.不是价格排序，就把价格排序字段清空
        reqParams.sortMethod = undefined;
      }
    };
    return { reqParams, changeSort };
  },
};
</script>

<style scoped lang='less'>
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all 0.3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
          &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>