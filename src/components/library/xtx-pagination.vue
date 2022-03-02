<template>
  <div class="xtx-pagination">
    <a v-if="myCurrentPage <= 1" href="javascript:;" class="disabled">上一页</a>
    <a @click="changePage(myCurrentPage - 1)" v-else href="javascript:;"
      >上一页</a
    >

    <span v-if="pager.start > 1">...</span>
    <a
      @click="changePage(i)"
      href="javascript:;"
      :class="{ active: i === myCurrentPage }"
      v-for="i in pager.btnArr"
      :key="i"
      >{{ i }}</a
    >
    <span v-if="pager.end < pager.pageCount">...</span>
    <a
      v-if="myCurrentPage >= pager.pageCount"
      href="javascript:;"
      class="disabled"
      >下一页</a
    >
    <a @click="changePage(myCurrentPage + 1)" v-else href="javascript:;"
      >下一页</a
    >
  </div>
</template>
<script>
import { computed, ref, watch } from "vue";
export default {
  name: "XtxPagination",
  // 接收外部数据，提供分页事件。
  props: {
    total: {
      type: Number,
      default: 100,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
  },

  setup(props, { emit }) {
    // 总条数，测试数据：101  9
    const myTotal = ref(101);
    // 每页条数
    const myPageSize = ref(10);
    // 当前第几页，测试数据： 1 5 11
    const myCurrentPage = ref(1);
    // 按钮个数
    const btnCount = ref(5);

    // 💥重点：根据上述数据得到（总页数，起始页码，结束页码，按钮数组）
    const pager = computed(() => {
      // 计算总页数
      const pageCount = Math.ceil(myTotal.value / myPageSize.value);
      // 计算起始页码和结束页码
      // 1. 理想情况根据当前页码，和按钮个数可得到
      let start = myCurrentPage.value - Math.floor(btnCount.value / 2);
      // 2.1 如果起始页码小于1了，需要重新计算
      if (start < 1) start = 1;

      let end = start + btnCount.value - 1;
      // 2.2 如果结束页码大于总页数，需要重新计算
      if (end > pageCount) {
        end = pageCount;
        start = end - btnCount.value + 1;
        if (start < 1) start = 1;
      }
      // 处理完毕start和end得到按钮数组
      const btnArr = [];
      for (let i = start; i <= end; i++) {
        btnArr.push(i);
      }
      return { pageCount, start, end, btnArr };
    });
    // 监听传人的值改变
    watch(
      props,
      () => {
        myTotal.value = props.total;
        myPageSize.value = props.pageSize;
        myCurrentPage.value = props.currentPage;
      },
      { immediate: true }
    );
    // 改变页码
    const changePage = (newPage) => {
      // 页码相同不作为
      if (myCurrentPage.value !== newPage) {
        myCurrentPage.value = newPage;
        // 通知父组件最新页码
        emit("current-change", newPage);
        // v-model:current-page 当前页码，支持双向绑定更新
        emit("update:current-page", newPage);
      }
    };

    return { pager, myCurrentPage, changePage };
  },
};
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>