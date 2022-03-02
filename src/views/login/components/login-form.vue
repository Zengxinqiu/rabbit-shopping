<template>
  <div class="account-box">
    <div class="toggle">
      <a
        href="javascript:;"
        v-if="activeForm === 'accounForm'"
        @click="activeForm = 'messageForm'"
      >
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
      <a
        href="javascript:;"
        v-if="activeForm === 'messageForm'"
        @click="activeForm = 'accounForm'"
      >
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
    </div>
    <Form
      class="form"
      :validation-schema="schema"
      v-slot="{ errors }"
      ref="formCom"
    >
      <!-- 打印错误对象：{{ errors }} -->
      <template v-if="activeForm === 'accounForm'">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <!-- 如果校验错误对象中有信息，就变成红色 -->
            <Field
              v-model="from.account"
              name="account"
              :class="{ error: errors.account }"
              type="text"
              placeholder="请输入用户名或手机号"
            />
          </div>
          <div class="error" v-if="errors.account">
            <i class="iconfont icon-warning" />{{ errors.account }}
          </div>
        </div>
        <!-- 密码框 -->
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field
              type="password"
              placeholder="请输入密码"
              :class="{ error: errors.password }"
              name="password"
              v-model="from.password"
            />
          </div>
          <div class="error" v-if="errors.password">
            <i class="iconfont icon-warning" />{{ errors.password }}
          </div>
        </div>
      </template>
      <!--  短信登录表单  -->
      <template v-if="activeForm === 'messageForm'">
        <!-- 输入手机号码框 -->
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
              v-model="from.mobile"
              name="mobile"
              :class="{ error: errors.mobile }"
              type="text"
              placeholder="请输入手机号"
            />
          </div>
          <div class="error" v-if="errors.mobile">
            <i class="iconfont icon-warning" />{{ errors.mobile }}
          </div>
        </div>
        <!-- 
          输入验证码
         -->
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field
              v-model="from.code"
              name="code"
              :class="{ error: errors.code }"
              type="text"
              placeholder="请输入验证码"
            />
            <button class="code" @click="sendCode">
              {{ number === 0 ? "发送验证码" : `${number}秒后发送` }}
            </button>
          </div>
          <div class="error" v-if="errors.code">
            <i class="iconfont icon-warning" />{{ errors.code }}
          </div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <!-- Field 的 as 属性可以指定为可指定为组件，as属性默认值为 input。 -->
          <Field as="XtxCheckbox" name="isAgree" v-model="from.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
      </div>
      <a href="javascript:;" class="btn" @click="login()">登录</a>
    </Form>
    <div class="action">
      <a
        href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback"
      >
        <img
          src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png"
          alt=""
        />
      </a>
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
// 导入登录接口
import {
  userAccountLogin,
  userMobileLogin,
  userMobileLoginMsg,
} from "@/api/user";
import { reactive, ref, watch } from "vue";
// 引入检验组件
import { Form, Field } from "vee-validate";
// 导入校验方案
import schema from "@/utils/vee-validate-schema";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Message } from "@/components/library/Message";
import { useIntervalFn } from "@vueuse/shared";
// // 设计校验条件
// const schema = {
//   account(value) {
//     if (!value) return "用户名不能为空";
//     return true;
//   }
// };
export default {
  name: "LoginForm",
  components: {
    Form,
    Field,
  },

  setup() {
    const activeForm = ref("accounForm");
    // 表单对象数据
    const from = reactive({
      isAgree: true,
      account: null,
      password: null,
      mobile: null,
      code: null,
    });

    // 切换表单元素， 还原数据和清除校验效果
    const formCom = ref(null);
    watch(activeForm, () => {
      // 还原数据
      from.isAgree = true;
      from.account = null;
      from.password = null;
      from.mobile = null;
      from.code = null;
      // 补充校验效果清除，From组件提供人resetForm()
      formCom.value.resetForm();
    });

    const store = useStore();
    const router = useRouter();

    const login = async () => {
      // Form组件提供了一个 validate 函数作为整体表单校验，当是返回的是一个promise
      const valid = await formCom.value.validate();
      console.log(valid);
      if (!valid) return alert("表单验证失败");

      try {
        let res;
        if (activeForm.value === "accounForm") {
          // 情况一通过账号登录
          res = await userAccountLogin(from);
        } else {
          // 情况2：手机号码+验证码登录
          res = await userMobileLogin(from);
        }

        // console.log(result);
        // 1.存储token信息
        store.commit("user/setUser", res.result);
        //  合并购物车操作

        // 2. 页面跳转（两种情况：1.回跳到某个页面 2.跳转首页）

        // router.currentRoute.value 获取当前路由

        const redirectUrl = router.currentRoute.value.query.redirectUrl;
        router.push(redirectUrl || "/");
        Message({ type: "success", message: "登录成功" });
        store.dispatch("cart/mergeLocalCart");
      } catch (err) {
        console.log(err.response);
        Message({ type: "error", message: err.response.data.message });
      }
    };

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
    // 点击发送验证码
    const sendCode = async () => {
      // 验证手机号码

      const mobileCheck = schema.mobile(from.mobile);
      if (mobileCheck === true) {
        // 上一个倒计时没有结束 直接退出
        if (number.value !== 0) return;
        try {
          await userMobileLoginMsg(from.mobile);
          Message({ type: "success", message: "验证码发送成功" });
          // 倒计时重置
          number.value = 60;
          // 调用倒计时
          resume();
        } catch (error) {
          console.log(error.response);
          Message({ type: "error", message: "验证码已发送， 稍后再试" });
        }
      } else {
        formCom.value.setFieldError("mobile", mobileCheck);
      }
    };

    return { activeForm, schema, from, formCom, login, sendCode, number };
  },
};
</script>

<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
          border: none;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>