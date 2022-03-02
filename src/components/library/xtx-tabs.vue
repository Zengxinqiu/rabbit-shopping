

<script>
import { computed, provide } from "vue";
export default {
  name: "XtxTabs",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const activeName = computed(() => props.modelValue);
    // 给xtx-tabs-panel传值
    provide("activeName", activeName);
    // 点击选项可对应的处理函数
    const tabClick = (name, index) => {
      // 双向绑定更新 v-model 的值
      emit("update:modelValue", name);
      // 触发一个点击自定义事件
      emit("tabClick", { name, index });
    };
    return { activeName, tabClick };
  },
  render() {
    //   jsx语法 他能够让我们创建节点和写HTML一样
    // 1. 动态插值表达式{} 2. 尽量三元表示式做判断，使用map来遍历 3.事件使用原始方式绑定
    // 默认插槽节点
    const panels = this.$slots.default();
    const dynamicPanls = [];
    panels.forEach((item) => {
      if (item.type.name === "XtxTabsPanel") {
        dynamicPanls.push(item);
      } else {
        item.children.forEach((com) => {
          dynamicPanls.push(com);
        });
      }
    });
    const nav = (
      <nav>
        {dynamicPanls.map((item, index) => {
          return (
            <a
              href="javascript:;"
              class={{ active: item.props.name === this.modelValue }}
              onClick={() => {
                this.tabClick(item.props.name, index);
              }}
            >
              {item.props.label}
            </a>
          );
        })}
      </nav>
    );
    return <div class="xtx-tabs">{[nav, panels]}</div>;
  },
};
</script>

<style lang="less">
.xtx-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>