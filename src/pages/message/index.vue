<template>
  <view class="msg-page">
    <view class="nav-bar">
      <view class="nav-inner">
        <text class="nav-title">私信</text>
        <view class="nav-icon-btn" @tap="newChat">✏️</view>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-area">
      <!-- 搜索框 -->
      <view class="search-wrap">
        <view class="search-box">
          <text class="search-icon">🔍</text>
          <text class="search-placeholder">搜索</text>
        </view>
      </view>

      <!-- 会话列表 -->
      <view class="conv-list">
        <view
          v-for="conv in conversations"
          :key="conv.id"
          class="conv-item"
          @tap="goChat(conv)"
        >
          <view class="conv-avatar-wrap">
            <view class="conv-avatar">{{ conv.avatar }}</view>
            <view v-if="conv.unread > 0" class="unread-badge">{{
              conv.unread
            }}</view>
          </view>
          <view class="conv-info">
            <view class="conv-top">
              <text class="conv-name">{{ conv.name }}</text>
              <text class="conv-time">{{ conv.lastTime }}</text>
            </view>
            <text class="conv-last-msg" :class="{ unread: conv.unread > 0 }">{{
              conv.lastMsg
            }}</text>
          </view>
        </view>
      </view>

      <view class="list-tip">
        <text class="list-tip-text">— 只展示最近的私信 —</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { mockConversations } from "@/mock/data";

const conversations = ref([...mockConversations]);

function goChat(conv) {
  // 清除未读
  conv.unread = 0;
  uni.navigateTo({
    url: `/pages/message/chat?id=${conv.id}&name=${conv.name}&avatar=${conv.avatar}`,
  });
}

function newChat() {
  uni.showToast({ title: "请从帖子详情页发起私信", icon: "none" });
}
</script>

<style scoped>
.msg-page {
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.nav-bar {
  background: #ffffff;
  border-bottom: 1rpx solid var(--border);
  padding-top: var(--status-bar-height, 44px);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 32rpx;
}

.nav-title {
  font-size: 36rpx;
  font-weight: 800;
  color: var(--text-main);
}

.nav-icon-btn {
  font-size: 36rpx;
}

.scroll-area {
  flex: 1;
}

/* 搜索框 */
.search-wrap {
  padding: 20rpx 24rpx;
}

.search-box {
  background: var(--bg);
  border-radius: 100rpx;
  padding: 16rpx 28rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.search-icon {
  font-size: 28rpx;
}
.search-placeholder {
  font-size: 28rpx;
  color: var(--text-hint);
}

/* 会话列表 */
.conv-list {
}

.conv-item {
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx;
  gap: 22rpx;
  border-bottom: 1rpx solid var(--border);
  position: relative;
}

.conv-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.conv-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: #f5f5f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
}

.unread-badge {
  position: absolute;
  top: -4rpx;
  right: -4rpx;
  min-width: 36rpx;
  height: 36rpx;
  background: var(--primary);
  border-radius: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  color: #fff;
  font-weight: 600;
  padding: 0 6rpx;
  border: 2rpx solid #fff;
}

.conv-info {
  flex: 1;
  min-width: 0;
}

.conv-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6rpx;
}

.conv-name {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text-main);
}

.conv-time {
  font-size: 22rpx;
  color: var(--text-hint);
}

.conv-last-msg {
  font-size: 26rpx;
  color: var(--text-hint);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.conv-last-msg.unread {
  color: var(--text-sub);
  font-weight: 500;
}

.list-tip {
  text-align: center;
  padding: 40rpx 0;
}
.list-tip-text {
  font-size: 24rpx;
  color: var(--text-hint);
}
</style>
