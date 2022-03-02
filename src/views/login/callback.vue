<template>
  <LoginHeader>联合登录</LoginHeader>
  <div class="loading" v-if="isBind"></div>
  <section class="container" v-else>
    <nav class="tab">
      <a
        @click="hasAccount = true"
        :class="{ active: hasAccount }"
        href="javascript:;"
      >
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a
        @click="hasAccount = false"
        :class="{ active: !hasAccount }"
        href="javascript:;"
      >
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind :unionId="unionId" />
    </div>
    <div class="tab-content" v-else>
      <!-- 完善信息(用户注册) -->
      <CallbackPatch :unionId="unionId" />
    </div>
  </section>
  <LoginFooter />
</template>

<script>
import { ref } from "vue";
import LoginHeader from "./components/login-header.vue";
import LoginFooter from "./components/login-footer.vue";
import CallbackBind from "./components/callback-bind.vue";
import CallbackPatch from "./components/callback-patch.vue";
import { Message } from "@/components/library/Message";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { userQQLogin } from "@/api/user";
export default {
  name: "PageCallback",
  components: { LoginHeader, LoginFooter, CallbackBind, CallbackPatch },
  setup() {
    const hasAccount = ref(false);
    const unionId = ref("");
    const store = useStore();
    const router = useRouter();
    if (QC.Login.check()) {
      QC.Login.getMe(async (openId, accessToken) => {
        // console.log({ openId, accessToken })
        unionId.value = openId;
        try {
          // 通过openid登录
          const { result } = await userQQLogin(openId);
          console.log(result);
          store.commit("user/setUser", result);

          // router.currentRoute.value 获取当前路由
          const redirectUrl = store.state.user.redirectUrl;
          router.push(redirectUrl || "/");
          console.log(redirectUrl);
          // 登录成功后合并购物车数据
          store.dispatch("cart/mergeLocalCart");
          Message({ type: "success", message: "QQ登录成功" });
          // 注册成功提示
        } catch (error) {
          // 登录失败显示表单结构
          isBind.value = false;
        }
      });
    }

    // 假设已经绑定， 默认会去做一次登录，如果登录失败证明未绑定
    const isBind = ref(true);
    // 1.获取QQ互联的openid也是就是 后台需要的unionId
    // 2.根据QQ互联的openid 去进行登录，准备一个接口

    return { hasAccount, unionId, isBind };
  },
};
</script>

<style scoped lang='less'>
.loading {
  margin: 25px auto;
  width: 1240px;
  height: 730px;
  background: #fff url(~@/assets/images/load.gif) no-repeat center / 100px 100px;
}
.container {
  padding: 25px 0;
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>