<template>
  <view class="splash-screen">
    <text>正在加载应用环境...</text>
  </view>
</template>

<script setup>
import { onMounted } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

onMounted(() => {
  // 假设你的 userStore 中有 token 字段或 isLoggedIn 状态来判断是否登录
  // 这里需要根据你实际的 store 数据结构来写
  uni.switchTab({ url: "/pages/home/index" });
});
</script>

<style scoped>
.splash-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 14px;
  color: #999;
}
</style>
