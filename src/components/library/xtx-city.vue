<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggle()">
      <span class="value" v-if="fullLocation">{{ fullLocation }}</span>
      <span class="placeholder" v-else>请选择配送地址</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="isShow">
      <div class="loading" v-if="!currList.length"></div>
      <span
        class="ellipsis"
        v-for="item in currList"
        :key="item.code"
        @click="changeItme(item)"
        >{{ item.name }}</span
      >
    </div>
  </div>
</template>

<script>
import { onClickOutside } from "@vueuse/core";
import { computed, reactive, ref } from "vue";
import axios from "axios";

// 获取城市数据
const getCityList = async () => {
  // 如果内存有城市数据，直接返回
  if (window.cityList) {
    return window.cityList;
  } else {
    //   内存中没有城市数据，发送请求， 获取城市数据
    const { data } = await axios.get(
      "https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json"
    );
    // 把数组存储到window 对象中缓存起来
    window.cityList = data;
    return data;
  }
};
export default {
  name: "XtxCity",
  props: {
    fullLocation: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const target = ref(null);
    const isShow = ref(false);
    const cityList = ref([]);

    const show = async () => {
      isShow.value = true;
      // 盒子显示的时候获取城市信息，展示到页面中
      const data = await getCityList();
      cityList.value = data;
      // 每次打开的时候都重新收集数据
      for (const key in address) {
        address[key] = "";
      }
    };

    const hide = async () => {
      isShow.value = false;
    };

    const toggle = async () => {
      isShow.value ? hide() : show();
    };
    // 定义计算属性，计算出当前所需要展示的列表
    const currList = computed(() => {
      let List = cityList.value;
      // TODO 根据点击的省份城市获取对应的列表
      // 如果用户已选定了省份编码，计算出需要展示的城市列表
      if (address.provinceCode) {
        List = cityList.value.find(
          (item) => item.code === address.provinceCode
        ).areaList;
      }
      // 如果用户选定了城市编码，计算出区（县）的列表
      if (address.cityCode) {
        List = List.find((item) => item.code === address.cityCode).areaList;
      }
      return List;
    });

    // 点击目标元素之外  onClickOutside(目标元素,事件处理函数)
    onClickOutside(target, () => {
      console.log("点击元素外");
      hide();
    });

    const address = reactive({
      provinceCode: "", // 省编码
      provinceName: "", //  省名称
      cityCode: "",
      cityName: "",
      countyCode: "",
      countyName: "",
      fullLocation: "",
    });
    // 点击城市列表的时候， 根据不同的level 收集不同的地址信息
    const changeItme = (theItem) => {
      console.log(theItem);
      if (theItem.level === 0) {
        // 收集省数据
        address.provinceCode = theItem.code;
        address.provinceName = theItem.name;
      } else if (theItem.level === 1) {
        // 收集市数据
        address.cityCode = theItem.code;
        address.cityName = theItem.name;
      } else if (theItem.level === 2) {
        //  // 收集区（县）数据
        address.countyCode = theItem.code;
        address.countyName = theItem.name;

        // 收集完区（县）的数据后，面板就可以隐藏起来
        hide();
        // 拼接地址信息
        address.fullLocation = `${address.provinceName} ${address.cityName} ${address.countyName}`;
        // 父组件可以通过自定义事件获取到地址信息
        emit("change", address);
      }
    };

    return { isShow, target, toggle, cityList, currList, changeItme, address };
  },
};
</script>

<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    .loading {
      height: 290px;
      width: 100%;
      background: url(~@/assets/images/loading.gif) no-repeat center;
    }
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>