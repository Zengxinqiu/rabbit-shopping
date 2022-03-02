// hooks(钩子)封装逻辑，提供响应式数据
import {
  ref,
  onUnmounted
} from "vue";
// 导入懒加载
import {
  useIntersectionObserver,
  useIntervalFn
} from "@vueuse/core";
import dayjs from 'dayjs'

// 数据懒加载函数
export const useLazYData = (apiFn) => {
  // 同于存放后台数据的变量
  const List = ref([]);
  //   被观察的对象
  const target = ref(null);

  // stop             用于停止检测函数
  // target           被检测的元素
  // isIntersecting   布尔值，元素是否可见 true/false
  const {
    stop
  } = useIntersectionObserver(target, ([{
    isIntersecting
  }]) => {
    // 如果元素可以，发送请求获取数据，并停止检测避免重复发送请求
    if (isIntersecting) {
      apiFn().then(({
        result
      }) => {
        console.log(result);
        List.value = result;
      });
      stop();
    }
  });
  // 钩子函数返回---> 响应式数据（目标元素, 后台数据）
  return {
    List,
    target
  };

}


// 倒计时钩子函数封装
// 支付倒计时
export const usePayTime = () => {
  // 倒计时逻辑
  const time = ref(0)
  const timeText = ref('')
  const {
    pause,
    resume
  } = useIntervalFn(() => {
    time.value--;
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    if (time.value <= 0) {
      pause()
    }
  }, 1000, {
    immediate: false
  })
  // 开始定时器 countdown 倒计时时间
  const start = (countdown) => {
    time.value = countdown
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }
  return {
    start,
    timeText
  }
}
