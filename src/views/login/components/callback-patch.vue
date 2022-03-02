<template>
  <Form
    ref="formCom"
    class="xtx-form"
    :validation-schema="schema"
    v-slot="{ errors }"
    autocomplete="off"
  >
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field
          v-model="form.account"
          :class="{ err: errors.account }"
          type="text"
          placeholder="请输入用户名"
          name="account"
          class="input"
        />
      </div>
      <div class="error" v-if="errors.account">{{ errors.account }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field
          v-model="form.mobile"
          :class="{ err: errors.mobile }"
          type="text"
          name="mobile"
          class="input"
          placeholder="请输入手机号码"
        />
      </div>
      <div class="error" v-if="errors.mobile">{{ errors.mobile }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field
          v-model="form.code"
          :class="{ err: errors.code }"
          type="text"
          name="code"
          class="input"
          placeholder="请输入验证码"
        />
        <span class="code" @click="send">
          {{ number === 0 ? "发送验证码" : `${number}秒后发送` }}</span
        >
      </div>
      <div class="error" v-if="errors.code">{{ errors.code }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          v-model="form.password"
          :class="{ err: errors.password }"
          name="password"
          class="input"
          type="password"
          placeholder="请输入密码"
        />
      </div>
      <div class="error" v-if="errors.password">{{ errors.password }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          v-model="form.rePassword"
          :class="{ err: errors.rePassword }"
          name="rePassword"
          class="input"
          type="password"
          placeholder="请确认密码"
        />
      </div>
      <div class="error" v-if="errors.rePassword">{{ errors.rePassword }}</div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即提交</a>
  </Form>
</template>

<script>
import { Form, Field } from "vee-validate";
import { reactive, ref, watch } from "vue";
import schema from "@/utils/vee-validate-schema";
import { useIntervalFn } from "@vueuse/shared";
import { userQQPatchLogin, userQQPatchCode } from "@/api/user";
import { Message } from "@/components/library/Message";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  name: "CallbackPatch",
  components: { Form, Field },
  props: {
    unionId: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    // 表单数据对象
    const form = reactive({
      account: "",
      mobile: "",
      code: "",
      password: "",
      unionId: "",
    });
    // 发送验证码倒数60秒
    const number = ref(0);
    const { resume, pause } = useIntervalFn(
      () => {
        number.value--;
        if (number.value <= 0) {
          pause();
        }
      },
      1000,
      { immediate: false }
    );
    const formCom = ref(null);
    // 1. 发送验证码
    // 1.1 绑定发送验证码按钮点击事件
    // 1.2 校验手机号，如果成功才去发送短信（定义API），请求成功开启60s的倒计时，不能再次点击，倒计时结束恢复
    // 1.3 如果失败，失败的校验样式显示出来

    const send = async () => {
      const valid = schema.mobile(form.mobile);
      if (valid === true) {
        if (number.value === 0) {
          // 没有倒计时才可以发送
          await userQQPatchCode(form.mobile);
          Message({ type: "success", message: "发送成功" });
          number.value = 60;
          resume();
        }
      } else {
        // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
        formCom.value.setFieldError("mobile", valid);
      }
    };
    // 💥由于父组件获取 unionId 是异步的，可通过监听变化获取最新值
    watch(
      () => props.unionId,
      (unionId) => {
        form.unionId = unionId;
      }
    );

    // 提交注册
    const store = useStore();
    const router = useRouter();
    const submit = async () => {
      // 主动获取表单校验结果
      const valid = await formCom.value.validate();
      // if (!valid) return alert("表单校验失败");
      // console.log('表单校验是否通过', valid)
      // 测试账号：sujiehao   密码：123456
      try {
        const { result } = await userQQPatchLogin(form);
        console.log(result);
        // // console.log(result)
        // 1. 存储 token 信息
        store.commit("user/setUser", result);
        // 2. 页面跳转（两种情况：1.回跳到某个页面 2.跳转首页）
        //store.state.user.redirectUrl 获取当前路由
        const redirectUrl = store.state.user.redirectUrl;
        router.push(redirectUrl || "/");
        // 成功提示
        Message({ type: "success", message: "登录成功" });
      } catch (err) {
        // alert(err.response.data.message)
        // 失败提示
        Message({ type: "error", message: err.response.data.message });
      }
    };

    return { form, formCom, schema, number, send, submit };
  },
};
</script>

<style scoped lang='less'>
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
