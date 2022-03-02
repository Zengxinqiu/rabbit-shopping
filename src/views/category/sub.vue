<template>
  <transition name="fade">
    <div class="sub-category" v-if="subCate">
      <div class="container">
        <!-- 面包屑 -->
        <SubBread></SubBread>
        <!-- 筛选区 -->
        <SubFilter></SubFilter>
        <!-- 结果区域 -->
        <div class="goods-list">
          <!-- 排序 -->
          <SubSort></SubSort>
          <!-- 商品列表 -->
          <ul class="list">
            <li v-for="item in list" :key="item.id">
              <GoodsItem :goods="item"></GoodsItem>
            </li>
          </ul>
          <XtxInfiniteLoading
            :finished="finished"
            :loading="loading"
            @load="getList"
          ></XtxInfiniteLoading>
        </div>
      </div>
    </div>
    <SubSkeleton v-else></SubSkeleton>
  </transition>
</template>

<script>
import { findCategoryGoodsTemp, findSubCategory } from "@/api/category";
import SubBread from "./components/sub-bread.vue";
import { useRoute } from "vue-router";
import { provide, reactive, ref, watch } from "vue";
import SubFilter from "./components/sub-filter.vue";
import SubSkeleton from "./components/sub-skeleton.vue";
import SubSort from "./components/sub-sort.vue";
import GoodsItem from "./components/goods-item.vue";

export default {
  components: { SubBread, SubFilter, SubSkeleton, SubSort, GoodsItem },
  name: "SubCategory",
  setup() {
    const route = useRoute();
    const subCate = ref(null);
    const page = ref(1);
    // 定义一个普通对象， 记录默认参数， 用于重置请求参数的
    const defaultParamsFn = () => {
      // 这种写法能确保默认参数不会被修改，因为每次调用函数的都是返回新的对象
      return {
        // categoryId 分类ID - 必传项
        categoryId: route.params.id,
        // sortField 排序字段： 默认排序null
        sortField: undefined,
        // sortMethod《价格》排序规则： asc为正序 desc为倒序 。默认为desc
        sortMethod: undefined,
        // inventory 是否只显示有库存
        inventory: false,
        // onlyDiscount 是否只显示特惠
        onlyDiscount: false,
        // attrs 属性条件数组 [{ groupName: xx, propertyName: xx },{ groupName: xx, propertyName: xx }]
        attrs: [],
        // brandId 品牌ID
        brandId: null,
        // page 当前页
        page: 1,
        // pageSize 页容量
        pageSize: 20,
      };
    };

    // 🔔 watch 监听 id 发生变化，需要重新发送请求
    watch(
      () => route.params.id,
      async (id) => {
        // 🔔如果当前不是二级分类页，直接退出，不发送二级分类请求
        if (route.path !== `/category/sub/${id}`) return;
        subCate.value = null;

        const { result } = await findSubCategory(id);
        console.log(result);
        subCate.value = result;
        // 重置接口查询参数， 重新获取默认参数对象
        const obj = defaultParamsFn();
        for (const key in obj) {
          reqParams[key] = obj[key];
        }
      },
      { immediate: true }
    );
    // 用于商品列表--分页查询接口的请求参数
    const reqParams = reactive(defaultParamsFn());
    // 父组件提供的是响应式对象，子组件内部可以直接修改
    provide("reqParams", reqParams);
    // 提供数据：provide('key', value);
    // 获取数据： const value = inject('key')
    provide("subCate", subCate);

    // 根据请求参数获取商品列表数据
    const list = ref([]);
    const loading = ref(false);
    const finished = ref(false);
    const getList = async () => {
      // 发送请求前， 显示加载中
      loading.value = true;
      // 📦商品列表--分页查询-临时 - 数据量大(但是数据是假的，主要用于实现分页)
      const { result } = await findCategoryGoodsTemp({
        ...reqParams,
        page: page.value,
      });
      console.log(result);
      // 数据加载完成后，就隐藏加载动画
      loading.value = false;
      //  加载分页数据， 是数组追加操作
      list.value.push(...result.items);
      page.value++;

      //  如果请求回来的数据已经小于页容量就显示加载完毕
      if (result.items.length < reqParams.pageSize) {
        finished.value = true;
      }
    };
    // 监听请求参数变化， 如果请求参数变化， 就要重新发送请求
    watch(reqParams, () => {
      page.value = 1;
      list.value = [];
      finished.value = false;
      getList();
    });

    // 返回给模板绑定的数据-注意书写位置
    return { subCate, getList, list, loading, finished, page };
  },
};
</script>

<style scoped lang="less">
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>