<template>
  <view class="post-card card" @tap="goDetail">
    <!-- 头部：头像 + 作者 + 标签 -->
    <view class="post-header">
      <view class="post-avatar">{{ post.authorAvatar }}</view>
      <view class="post-meta">
        <view class="post-author-row">
          <text class="post-author">{{ post.isAnon ? '匿名用户' : post.author }}</text>
          <text v-if="post.isAnon" class="tag tag-anon">匿名</text>
          <text class="tag" :class="`tag-${post.tagColor}`">{{ post.tag }}</text>
        </view>
        <text class="post-time">{{ post.time }}</text>
      </view>
    </view>

    <!-- 标题 -->
    <text class="post-title">{{ post.title }}</text>

    <!-- 正文摘要 -->
    <text class="post-excerpt">{{ post.content }}</text>

    <!-- 图片预览（最多3张） -->
    <view v-if="post.images && post.images.length" class="post-img-row">
      <image
        v-for="(img, i) in post.images.slice(0, 3)"
        :key="i"
        :src="img"
        class="post-img"
        mode="aspectFill"
      />
    </view>

    <!-- 底部操作栏 -->
    <view class="post-footer">
      <view class="post-action" :class="{ liked: post.liked }" @tap.stop="onLike">
        <text class="action-icon">{{ post.liked ? '❤️' : '🤍' }}</text>
        <text class="action-num">{{ post.likes }}</text>
      </view>
      <view class="post-action">
        <text class="action-icon">💬</text>
        <text class="action-num">{{ post.commentCount }}</text>
      </view>
      <view class="post-action" :class="{ collected: post.collected }" @tap.stop="onCollect">
        <text class="action-icon">{{ post.collected ? '⭐' : '☆' }}</text>
        <text class="action-num">收藏</text>
      </view>
      <view class="post-action post-share" @tap.stop="onShare">
        <text class="action-icon">↗</text>
        <text class="action-num">分享</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { usePostsStore } from '@/stores/posts'

const props = defineProps({
  post: { type: Object, required: true }
})

const postsStore = usePostsStore()

function goDetail() {
  uni.navigateTo({ url: `/pages/post-detail/index?id=${props.post.id}` })
}

function onLike() {
  postsStore.toggleLike(props.post.id)
}

function onCollect() {
  postsStore.toggleCollect(props.post.id)
}

function onShare() {
  uni.showToast({ title: '分享功能开发中', icon: 'none' })
}
</script>

<style scoped>
.post-card {
  margin: 12rpx 24rpx;
  padding: 26rpx 28rpx;
  transition: transform 0.15s;
}

.post-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.post-avatar {
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
  background: #f5f5f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  flex-shrink: 0;
}

.post-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.post-author-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex-wrap: wrap;
}

.post-author {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--text-main);
}

.post-time {
  font-size: 22rpx;
  color: var(--text-hint);
}

.post-title {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.45;
  margin-bottom: 10rpx;
  display: block;
}

.post-excerpt {
  font-size: 26rpx;
  color: var(--text-sub);
  line-height: 1.7;
  margin-bottom: 16rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  display: block;
  /* 两行截断 fallback */
  max-height: 3.4em;
}

.post-img-row {
  display: flex;
  gap: 10rpx;
  margin-bottom: 16rpx;
}

.post-img {
  width: 144rpx;
  height: 144rpx;
  border-radius: 12rpx;
  object-fit: cover;
  background: #f0ede8;
}

.post-footer {
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding-top: 12rpx;
  border-top: 1rpx solid var(--border);
}

.post-action {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.post-action.liked .action-num { color: var(--primary); }
.post-action.collected .action-num { color: #FFAA00; }

.action-icon { font-size: 28rpx; }
.action-num { font-size: 24rpx; color: var(--text-hint); }

.post-share { margin-left: auto; }
</style>