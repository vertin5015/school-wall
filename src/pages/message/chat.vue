<template>
  <view class="chat-page">
    <!-- 导航栏 -->
    <view class="nav-bar">
      <view class="nav-inner">
        <view class="back-btn" @tap="goBack">‹ 返回</view>
        <view class="nav-center">
          <text class="nav-name">{{ chatName }}</text>
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
      id="msgList"
    >
      <view class="msg-list" id="msgListInner">
        <view class="chat-date-tip">{{ today }}</view>

        <view
          v-for="msg in messages"
          :key="msg.id"
          class="msg-row"
          :class="{ 'msg-row-me': msg.fromMe }"
          :id="`msg-${msg.id}`"
        >
          <!-- 对方头像 -->
          <view v-if="!msg.fromMe" class="chat-avatar">{{ chatAvatar }}</view>

          <view class="bubble-wrap">
            <view class="bubble" :class="msg.fromMe ? 'bubble-me' : 'bubble-other'">
              <text class="bubble-text">{{ msg.content }}</text>
            </view>
            <text class="msg-time">{{ msg.time }}</text>
          </view>

          <!-- 自己头像 -->
          <view v-if="msg.fromMe" class="chat-avatar chat-avatar-me">{{ myAvatar }}</view>
        </view>

        <view style="height: 20rpx;" id="listBottom"></view>
      </view>
    </scroll-view>

    <!-- 输入栏 -->
    <view class="input-bar safe-area-bottom">
      <view class="input-extra-btn" @tap="toggleExtra">＋</view>
      <view class="input-wrap">
        <input
          class="chat-input"
          v-model="inputText"
          placeholder="发消息..."
          :adjust-position="true"
          @confirm="sendMsg"
          confirm-type="send"
        />
      </view>
      <view v-if="inputText.trim()" class="send-btn" @tap="sendMsg">发送</view>
      <view v-else class="input-emoji-btn" @tap="showEmoji">😊</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { mockConversations, mockUser } from '@/mock/data'

const pages = getCurrentPages()
const currentPage = pages[pages.length - 1]
const chatId = Number(currentPage?.options?.id || 1)
const chatName = decodeURIComponent(currentPage?.options?.name || '用户')
const chatAvatar = decodeURIComponent(currentPage?.options?.avatar || '👤')

const myAvatar = mockUser.avatar

const conv = mockConversations.find(c => c.id === chatId)
const messages = ref(conv ? [...conv.messages] : [])

const inputText = ref('')
const scrollTop = ref(99999)
const lastMsgId = ref('')

const today = new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })

onMounted(() => {
  scrollToBottom()
})

function scrollToBottom() {
  nextTick(() => {
    if (messages.value.length > 0) {
      lastMsgId.value = `msg-${messages.value[messages.value.length - 1].id}`
    }
    scrollTop.value = 999999
  })
}

function sendMsg() {
  if (!inputText.value.trim()) return
  const newMsg = {
    id: Date.now(),
    fromMe: true,
    content: inputText.value.trim(),
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
  }
  messages.value.push(newMsg)
  inputText.value = ''
  scrollToBottom()

  // 模拟对方回复
  setTimeout(() => {
    const replies = ['好的！', '哈哈😄', '收到~', '明白了', '好的好的', '谢谢！']
    messages.value.push({
      id: Date.now() + 1,
      fromMe: false,
      content: replies[Math.floor(Math.random() * replies.length)],
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    })
    scrollToBottom()
  }, 1000)
}

function goBack() {
  uni.navigateBack()
}

function showMore() {
  uni.showActionSheet({
    itemList: ['查看对方主页', '投诉/举报', '清空聊天记录'],
    success: ({ tapIndex }) => {
      if (tapIndex === 2) {
        uni.showModal({
          title: '提示',
          content: '确定清空聊天记录吗？',
          success: ({ confirm }) => {
            if (confirm) messages.value = []
          }
        })
      }
    }
  })
}

function toggleExtra() {
  uni.showToast({ title: '更多功能开发中', icon: 'none' })
}

function showEmoji() {
  uni.showToast({ title: 'emoji 开发中', icon: 'none' })
}
</script>

<style scoped>
.chat-page {
  min-height: 100vh;
  background: #F5F5F0;
  display: flex;
  flex-direction: column;
}

.nav-bar {
  background: #ffffff;
  border-bottom: 1rpx solid var(--border);
  padding-top: var(--status-bar-height, 44px);
  flex-shrink: 0;
}

.nav-inner {
  display: flex;
  align-items: center;
  padding: 16rpx 28rpx;
}

.back-btn {
  font-size: 30rpx;
  color: var(--text-main);
  min-width: 80rpx;
}

.nav-center {
  flex: 1;
  text-align: center;
}

.nav-name {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text-main);
}

.nav-more {
  font-size: 40rpx;
  color: var(--text-sub);
  min-width: 80rpx;
  text-align: right;
}

/* 消息列表 */
.msg-scroll {
  flex: 1;
  height: calc(100vh - 110rpx - 110rpx - var(--status-bar-height, 44px));
}

.msg-list {
  padding: 20rpx 24rpx;
}

.chat-date-tip {
  text-align: center;
  font-size: 22rpx;
  color: var(--text-hint);
  background: rgba(0,0,0,0.06);
  border-radius: 100rpx;
  padding: 6rpx 24rpx;
  display: inline-block;
  margin: 0 auto 24rpx;
  width: fit-content;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

.msg-row {
  display: flex;
  align-items: flex-end;
  gap: 14rpx;
  margin-bottom: 24rpx;
}

.msg-row-me {
  flex-direction: row-reverse;
}

.chat-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38rpx;
  flex-shrink: 0;
  border: 1rpx solid var(--border);
}

.bubble-wrap {
  max-width: 66%;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.msg-row-me .bubble-wrap {
  align-items: flex-end;
}

.bubble {
  padding: 20rpx 26rpx;
  border-radius: 24rpx;
}

.bubble-other {
  background: #ffffff;
  border-radius: 4rpx 24rpx 24rpx 24rpx;
}

.bubble-me {
  background: var(--primary);
  border-radius: 24rpx 4rpx 24rpx 24rpx;
}

.bubble-text {
  font-size: 30rpx;
  line-height: 1.7;
  display: block;
}

.bubble-other .bubble-text { color: var(--text-main); }
.bubble-me .bubble-text { color: #ffffff; }

.msg-time {
  font-size: 20rpx;
  color: var(--text-hint);
}

/* 输入栏 */
.input-bar {
  background: #ffffff;
  border-top: 1rpx solid var(--border);
  padding: 16rpx 20rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex-shrink: 0;
}

.input-extra-btn {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  color: var(--text-sub);
  flex-shrink: 0;
}

.input-wrap {
  flex: 1;
  background: var(--bg);
  border-radius: 100rpx;
  padding: 0 24rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
}

.chat-input {
  width: 100%;
  font-size: 30rpx;
  color: var(--text-main);
  height: 72rpx;
  line-height: 72rpx;
}

.send-btn {
  background: var(--primary);
  color: #ffffff;
  border-radius: 100rpx;
  padding: 16rpx 30rpx;
  font-size: 28rpx;
  font-weight: 600;
  flex-shrink: 0;
}

.input-emoji-btn {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  flex-shrink: 0;
}
</style>