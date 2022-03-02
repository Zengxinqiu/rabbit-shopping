<template>
  <div class="goods-comment" v-if="comments">
    <div class="head">
      <div class="data">
        <p>
          <span>{{ comments.salesCount }}</span
          ><span>人购买</span>
        </p>
        <p>
          <span>{{ comments.praisePercent }}</span
          ><span>好评率</span>
        </p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a
            href="javascript:;"
            :class="{ active: activeTitle === item.title }"
            v-for="item in comments.tags"
            :key="item.title"
            @click="changeFilter(item.title)"
            >{{ item.title }}({{ item.tagCount }})</a
          >
        </div>
      </div>
    </div>
    <div class="sort">
      <span>排序：</span>
      <a
        href="javascript:;"
        @click="date.sortField = null"
        :class="{ active: date.sortField === null }"
        >默认</a
      >
      <a
        @click="date.sortField = 'createTime'"
        :class="{ active: date.sortField === 'createTime' }"
        href="javascript:;"
      >
        最新
      </a>
      <a
        href="javascript:;"
        @click="date.sortField = 'praiseCount'"
        :class="{ active: date.sortField === 'praiseCount' }"
        >最热</a
      >
    </div>
    <!-- 列表 -->
    <div class="list">
      <div class="item" v-for="(item, index) in commentList" :key="index">
        <div class="user">
          <img :src="item.member.avatar" alt="" />
          <span>{{ nickNameHide(item.member.nickname) }}</span>
        </div>
        <div class="body">
          <div class="score">
            <i v-for="i in item.score" :key="i" class="iconfont icon-wjx01"></i>
            <i
              v-for="i in 5 - item.score"
              :key="i"
              class="iconfont icon-wjx02"
            ></i>
            <span class="attr">
              {{ specsText(item.orderInfo.specs) }}
            </span>
          </div>
          <div class="text">
            {{ item.content }}
          </div>
          <!-- 图片预览组件 -->
          <GoodsCommentImage
            :pictures="item.pictures"
            v-if="item.pictures.length"
          ></GoodsCommentImage>
          <div class="time">
            <span>{{ item.createTime }}</span>
            <span class="zan">
              <i class="iconfont icon-dianzan"></i>{{ item.praiseCount }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <XtxPagination
      v-if="total"
      :total="total"
      :current-page="currentPage"
      :page-size="date.pageSize"
      @current-change="getCurrentPage"
    ></XtxPagination>
  </div>
</template>

<script>
import { inject, reactive, ref, watch } from "vue";
import { findGoodsCommentInfo, findGoodsCommentList } from "@/api/good";
import GoodsCommentImage from "./goods-comment-image.vue";
// 数据过滤器
const nickNameHide = (nickName) => {
  return nickName.slice(0, 1) + "****" + nickName.slice(-1);
};
const specsText = (specs) => {
  return specs.map((item) => `${item.name}: ${item.nameValue}`).join(" ");
};
export default {
  components: { GoodsCommentImage },
  name: "GoodsComment",
  setup() {
    const goods = inject("goods");
    const activeTitle = ref("全部评价");
    // 头部评论
    const comments = ref(null);
    findGoodsCommentInfo(goods.value.id).then(({ result }) => {
      //  处理tags数组 方便模板 v-for 遍历
      result.tags = [
        { title: "全部评论", tagCount: result.evaluateCount },
        { title: "有图", tagCount: result.hasPictureCount },
        ...result.tags,
      ];
      comments.value = result;
      console.log(result);
    });

    // 获取评价分页数据
    const id = goods.value.id;
    const commentList = ref([]);
    const total = ref(0);
    const currentPage = ref(1);

    const date = reactive({
      // page: 1, // 是 1 页码
      pageSize: 10, // 是 10 页尺寸
      hasPicture: null, // 否 true 是否有图
      tag: null, // 否 质量好 标签
      sortField: null, // 否 praiseCount 排序字段，可选值范围[praiseCount,createTime]
      // sortMethod: '' // 否 desc 排序方法，可选值范围[asc,desc],默认为desc
    });

    const getCommentList = () => {
      findGoodsCommentList(id, { ...date, page: currentPage.value }).then(
        ({ result }) => {
          console.log(result);
          commentList.value = result.items;
          console.log(result);
          total.value = result.counts;
          console.log(total);
        }
      );
    };

    // 点击改变筛选
    const changeFilter = (tag) => {
      // 高亮效果
      activeTitle.value = tag;
      // 请求参数
      if (tag === "有图") {
        date.hasPicture = true;
        date.tag = null;
        console.log("切换到有图评论");
      } else if (tag === "全部评价") {
        date.hasPicture = null;
        date.tag = null;
        console.log("全部评价");
      } else {
        date.hasPicture = null;
        date.tag = tag;
        console.log(tag, "切换到其他评论");
      }
      date.sortField = null;
    };
    watch(
      date,
      () => {
        // 页码重置
        currentPage.value = 1;
        // 获取评价分页数据
        getCommentList();
      },
      { immediate: true }
    );
    //  筛选条件数据准备

    const getCurrentPage = (val) => {
      currentPage.value = val;
      getCommentList();
    };

    return {
      comments,
      activeTitle,
      commentList,
      nickNameHide,
      specsText,
      date,
      getCurrentPage,
      currentPage,
      total,
      changeFilter,
    };
  },
};
</script>

<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }
}
</style>