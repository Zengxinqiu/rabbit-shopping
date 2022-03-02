<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
        <template v-if="token">
          <li>
            <RouterLink to="/member"
              ><i class="iconfont icon-user"></i
              >{{ nickname || account }}</RouterLink
            >
          </li>
          <li><a href="javascript:;" @click="loginOut()">退出登录</a></li>
        </template>

        <template v-else>
          <li>
            <RouterLink href="javascript:;" to="/login">请先登录</RouterLink>
          </li>
          <li><a href="javascript:;">免费注册</a></li>
        </template>
        <li><a href="javascript:;">我的订单</a></li>
        <li><a href="javascript:;">会员中心</a></li>
        <li><a href="javascript:;">帮助中心</a></li>
        <li><a href="javascript:;">关于我们</a></li>
        <li>
          <a href="javascript:;"><i class="iconfont icon-phone"></i>手机版</a>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
import router from "@/router";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { toRefs } from "vue";

export default {
  name: "AppTopnav",
  setup() {
    const store = useStore();
    const router = useRouter();
    const loginOut = () => {
      // 1.清空用户信息
      store.commit("user/setUser", {});
      // 清空购物车
      store.commit("cart/setCartList", []);
      // 2.跳转到登录页
      router.push("/login");
    };
    return { loginOut, ...toRefs(store.state.user.profile) };
  },
};
</script>
<style scoped lang="less">
.app-topnav {
  background: #333;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
        &:hover {
          color: @xtxColor;
        }
      }
      ~ li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>