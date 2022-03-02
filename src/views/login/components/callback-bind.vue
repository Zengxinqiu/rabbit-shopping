<template>
  <Form
    ref="formCom"
    class="xtx-form"
    :validation-schema="schema"
    v-slot="{ errors }"
    autocomplete="off"
  >
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{ nickName }} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
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
        <input
          v-model="form.code"
          :class="{ err: errors.code }"
          type="text"
          name="code"
          class="input"
          placeholder="请输入验证码"
        />
        <span class="code" @click="sendCode">{{
          number === 0 ? "发送验证码" : `${number}秒后发送`
        }}</span>
      </div>
      <div class="error" v-if="errors.code">{{ errors.code }}</div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即绑定</a>
  </Form>
</template>

<script>
import { reactive, ref, watch } from "vue";
import { useIntervalFn } from "@vueuse/shared";
import { Message } from "@/components/library/Message";
import schema from "@/utils/vee-validate-schema";
import { userQQBindCode, userQQBindLogin } from "@/api/user";
import { Form, Field } from "vee-validate";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  name: "CallbackBind",
  components: { Form, Field },
  props: {
    unionId: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    // 1. 准备下信息：unionId(openId) qq头像 昵称
    // 2. 完成表单校验
    // 3. 发送验证吗（校验，定义api，调用，完成倒计时）
    // 4. 进行绑定（绑定成功就是登录成功）
    const nickName = ref("");
    const avatar = ref("");
    // 业务1： 获取qq用户公开信息
    if (QC.Login.check()) {
      QC.api("get_user_info").success(({ data }) => {
        nickName.value = data.nickname;
        avatar.value = data.figureurl_2;
      });
    }
    // 业务2：获取表单数据和表单校验
    const formCom = ref(null);
    const form = reactive({
      unionId: "",
      mobile: "",
      code: "",
    });

    watch(
      () => props.unionId,
      (unionId) => {
        form.unionId = unionId;
      },
      { immediate: true }
    );

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

    // 发送验证码
    const sendCode = async () => {
      // 校验手机号码 form.mobile
      const mobileChecked = schema.mobile(form.mobile);
      if (mobileChecked === true) {
        if (number.value !== 0) return;
        //  发送验证码
        try {
          await userQQBindCode(form.mobile);
          Message({ type: "success", message: "发送成功" });
          // 倒计时重置
          number.value = 60;
          resume();
        } catch (error) {
          Message({
            type: "error",
            message: error.response.data.message || "获取验证码出现错误",
          });
        }
      } else {
        // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
        formCom.value.setFieldError("mobile", mobileChecked);
      }
    };

    // 立即绑定

    const store = useStore();
    const router = useRouter();
    const submit = async () => {
      const valid = await formCom.value.validate();
      if (!valid) return Message({ type: "error", message: "表单校验失败" });
      try {
        const { result } = await userQQBindLogin(form);
        console.log(result);
        // // console.log(result)
        // 1. 存储 token 信息
        store.commit("user/setUser", result);
        // 2. 页面跳转（两种情况：1.回跳到某个页面 2.跳转首页）
        // router.currentRoute.value 获取当前路由
        const redirectUrl = store.state.user.redirectUrl;
        router.push(redirectUrl || "/");
        // 成功提示
        Message({ type: "success", message: "QQ登录成功" });
      } catch (error) {
        Message({ type: "error", message: error.response.data.message });
      }
    };
    return {
      formCom,
      nickName,
      avatar,
      form,
      number,
      sendCode,
      schema,
      submit,
    };
  },
};
</script>

<style scoped lang='less'>
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
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