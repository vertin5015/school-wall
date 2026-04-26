<template>
  <view class="chat-page">
    <!-- 导航栏 -->
    <view class="nav-bar">
      <view class="nav-inner">
        <view class="back-btn" @tap="goBack">
           <text class="back-icon">‹</text>
        </view>
        <view class="nav-center">
          <text class="nav-name">{{ chatName }}</text>
          <text class="nav-status">在线</text>
        </view>
        <view class="nav-more" @tap="showMore">⋯</view>
      </view>
    </view>

    <!-- 消息列表 -->
    <scroll-view
      scroll-y
      class="msg-scroll"
      :scroll-top="scrollTop"
      :scroll-into-view="lastMsgId"
      scroll-with-animation
      :style="{ paddingBottom: keyboardHeight + 'px' }"
    >
      <view class="msg-list">
        <view class="chat-date-tip">{{ today }}</view>

        <view
          v-for="msg in messages"
          :key="msg.id"
          class="msg-row"
          :class="{ 'msg-row-me': msg.fromMe }"
          :id="`msg-${msg.id}`"
        >
          <!-- 对方头像 -->
          <view v-if="!msg.fromMe" class="chat-avatar-wrap">
            <view class="chat-avatar">{{ chatAvatar }}</view>
          </view>

          <!-- 消息主体 -->
          <view class="bubble-wrap">
            <view
              class="bubble"
              :class="msg.fromMe ? 'bubble-me' : 'bubble-other'"
            >
              <text class="bubble-text">{{ msg.content }}</text>
            </view>
            <text class="msg-time">{{ msg.time }}</text>
          </view>

          <!-- 自己头像 -->
          <view v-if="msg.fromMe" class="chat-avatar-wrap">
            <view class="chat-avatar chat-avatar-me">{{ myAvatar }}</view>
          </view>
        </view>

        <view style="height: 40rpx"></view>
      </view>
    </scroll-view>

    <!-- 输入栏 -->
    <view 
      class="input-bar safe-area-bottom"
      :style="{ transform: `translateY(-${keyboardHeight}px)`, transition: 'transform 0.25s ease' }"
    >
      <view class="input-extra-btn" @tap="toggleExtra">
        <text class="icon">＋</text>
      </view>
      <view class="input-wrap">
        <textarea
          class="chat-input"
          v-model="inputText"
          placeholder="发消息..."
          :auto-height="true"
          :fixed="true"
          :cursor-spacing="20"
          :adjust-position="false"
          maxlength="500"
          @focus="onInputFocus"
          @blur="onInputBlur"
          @keyboardheightchange="onKeyboardHeightChange"
        />
      </view>
      <view v-if="inputText.trim()" class="send-btn-active" @tap="sendMsg">
        <text>发送</text>
      </view>
      <view v-else class="input-emoji-btn" @tap="showEmoji">
        <text class="icon">😊</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { onLoad, onUnload } from "@dcloudio/uni-app";
import { mockConversations, mockUser } from "../../mock/data";

const chatName = ref("用户");
const chatAvatar = ref("👤");
const messages = ref([]);
const myAvatar = mockUser.avatar;

const keyboardHeight = ref(0);

function onInputFocus(e) {
  // 部分平台可以通过 focus 事件获取键盘高度
  if (e.detail.height) {
    keyboardHeight.value = e.detail.height;
  }
  scrollToBottom();
}

function onInputBlur() {
  keyboardHeight.value = 0;
}

function onKeyboardHeightChange(e) {
  keyboardHeight.value = e.detail.height;
  if (keyboardHeight.value > 0) {
    scrollToBottom();
  }
}

onLoad((options) => {
  console.log("Chat Page onLoad options:", options);
  const chatId = Number(options.id || 1);
  if (options.name) chatName.value = decodeURIComponent(options.name);
  if (options.avatar) chatAvatar.value = decodeURIComponent(options.avatar);

  // 确保 mockConversations 存在
  if (mockConversations && mockConversations.length > 0) {
    const conv = mockConversations.find((c) => Number(c.id) === chatId);
    if (conv) {
      messages.value = [...conv.messages];
      console.log("Loaded messages:", messages.value.length);
    } else {
      console.warn("Conversation not found for id:", chatId);
      // 兜底加载第一个会话
      messages.value = [...mockConversations[0].messages];
    }
  }
});

onUnload(() => {
  keyboardHeight.value = 0;
});

const inputText = ref("");
const scrollTop = ref(99999);
const lastMsgId = ref("");

const today = new Date().toLocaleDateString("zh-CN", {
  month: "long",
  day: "numeric",
});

onMounted(() => {
  scrollToBottom();
});

function scrollToBottom() {
  nextTick(() => {
    if (messages.value.length > 0) {
      lastMsgId.value = `msg-${messages.value[messages.value.length - 1].id}`;
    }
    scrollTop.value = 999999;
  });
}

function sendMsg() {
  if (!inputText.value.trim()) return;
  const newMsg = {
    id: Date.now(),
    fromMe: true,
    content: inputText.value.trim(),
    time: new Date().toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
  messages.value.push(newMsg);
  inputText.value = "";
  scrollToBottom();

  // 模拟对方回复
  setTimeout(() => {
    const replies = [
      "好的！",
      "哈哈😄",
      "收到~",
      "明白了",
      "好的好的",
      "谢谢！",
    ];
    messages.value.push({
      id: Date.now() + 1,
      fromMe: false,
      content: replies[Math.floor(Math.random() * replies.length)],
      time: new Date().toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    scrollToBottom();
  }, 1000);
}

function goBack() {
  uni.navigateBack();
}

function showMore() {
  uni.showActionSheet({
    itemList: ["查看对方主页", "投诉/举报", "清空聊天记录"],
    success: ({ tapIndex }) => {
      if (tapIndex === 2) {
        uni.showModal({
          title: "提示",
          content: "确定清空聊天记录吗？",
          success: ({ confirm }) => {
            if (confirm) messages.value = [];
          },
        });
      }
    },
  });
}

function toggleExtra() {
  uni.showToast({ title: "更多功能开发中", icon: "none" });
}

function showEmoji() {
  uni.showToast({ title: "emoji 开发中", icon: "none" });
}
</script>

<style scoped>
.chat-page {
  height: 100vh;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.nav-bar {
  background: #ffffff;
  flex-shrink: 0;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 100;
  padding-top: var(--status-bar-height, 44px);
}

.nav-inner {
  display: flex;
  align-items: center;
  padding: 12rpx 28rpx;
  height: 88rpx;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 60rpx;
  color: var(--text-main);
  line-height: 1;
}

.nav-center {
  flex: 1;
  display: flex;
  /* flex-direction: column; */
  align-items: center;
  /* justify-content: left; */
  gap: 10rpx;
}

.nav-name {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.2;
}

.nav-status {
  font-size: 20rpx;
  margin-top: 4rpx;
}

.nav-more {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
  color: var(--text-sub);
}

/* 消息列表 */
.msg-scroll {
  flex: 1;
  height: 100%; /* 使用 100% 确保占满 flex 容器 */
  overflow: hidden;
}

.msg-list {
  padding: 32rpx 24rpx;
}

.chat-date-tip {
  text-align: center;
  font-size: 22rpx;
  color: var(--text-hint);
  margin: 10rpx auto 40rpx;
  background: rgba(0, 0, 0, 0.05);
  padding: 4rpx 20rpx;
  border-radius: 20rpx;
  width: fit-content;
}

.msg-row {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  margin-bottom: 40rpx;
  width: 100%;
}

.msg-row-me {
  justify-content: flex-end;
}

.chat-avatar-wrap {
  flex-shrink: 0;
}

.chat-avatar {
  width: 84rpx;
  height: 84rpx;
  border-radius: 28rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.chat-avatar-me {
  background: var(--primary);
}

.bubble-wrap {
  max-width: 70%;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.msg-row-me .bubble-wrap {
  align-items: flex-end;
}

.bubble {
  padding: 20rpx 28rpx;
  position: relative;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.02);
}

.bubble-other {
  background: #ffffff;
  border-radius: 4rpx 28rpx 28rpx 28rpx;
  color: var(--text-main);
}

.bubble-me {
  background: var(--primary);
  border-radius: 28rpx 4rpx 28rpx 28rpx;
  color: #ffffff;
}

.bubble-text {
  font-size: 30rpx;
  line-height: 1.6;
  word-break: break-all;
}

.msg-time {
  font-size: 20rpx;
  color: var(--text-hint);
  margin: 0 8rpx;
}

/* 输入栏 */
.input-bar {
  background: #ffffff;
  border-top: 1rpx solid #eeeeee;
  padding: 20rpx 24rpx;
  padding-bottom: 50rpx;
  display: flex;
  align-items: flex-end;
  gap: 20rpx;
  flex-shrink: 0;
}

.input-extra-btn,
.input-emoji-btn {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 50%;
  flex-shrink: 0;
}

.icon {
  font-size: 40rpx;
  color: var(--text-sub);
}

.input-wrap {
  flex: 1;
  background: #f5f5f5;
  border-radius: 20rpx;
  padding: 0 24rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
}

.chat-input {
  width: 100%;
  font-size: 30rpx;
  color: var(--text-main);
  line-height: 40rpx;
}

.send-btn-active {
  background: var(--primary);
  color: #ffffff;
  border-radius: 16rpx;
  padding: 0 28rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 700;
  flex-shrink: 0;
  transition: all 0.2s;
}

.send-btn-active:active {
  opacity: 0.8;
  transform: scale(0.95);
}
</style>
