<template>
  <div class="xtx-checkbox" @click="changeChecked()">
    <i
      class="iconfont"
      :class="modelValue ? 'icon-checked' : 'icon-unchecked'"
    ></i>
    <!-- <i class="iconfont icon-unchecked"></i> -->
    <span v-if="$slots.default"> <slot></slot> </span>
  </div>
</template>

<script>
export default {
  name: "XtxCheckbox",
  // 🔔 Vue3 的 v-model 是  :modelValue 和 @update:modelValue 组成的语法糖。
  props: {
    //   子组件接收布尔值
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const changeChecked = () => {
      // 点击后把取反后的布尔值传递给父组件
      const temp = !props.modelValue;
      emit("update:modelValue", temp);
      emit("change", temp);
    };
    return { changeChecked };
  },
};
</script>

<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  cursor: pointer;
  user-select: none;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>