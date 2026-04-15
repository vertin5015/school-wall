<template>
  <view class="home-page">
    <!-- 自定义导航栏 -->
    <view class="nav-bar">
      <view class="nav-inner">
        <text class="nav-title">校园墙</text>
        <view class="nav-right">
          <view class="nav-icon-btn" @tap="goSearch">🔍</view>
          <view class="nav-icon-btn" @tap="goNotice">🔔</view>
        </view>
      </view>
    </view>

    <scroll-view
      scroll-y
      class="scroll-area"
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
    >
      <!-- Banner -->
      <view class="banner" @tap="onBanner">
        <view class="banner-text">
          <text class="banner-title">🎉 期末加油！</text>
          <text class="banner-sub">距期末考试还有 21 天，冲！</text>
        </view>
        <text class="banner-emoji">📚</text>
      </view>

      <!-- 分类 Tab -->
      <view class="section-tabs">
        <view
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-item"
          :class="{ active: activeTab === tab.key }"
          @tap="switchTab(tab.key)"
        >
          <text>{{ tab.label }}</text>
        </view>
      </view>

      <!-- 帖子列表 -->
      <view class="post-list">
        <PostCard
          v-for="post in filteredPosts"
          :key="post.id"
          :post="post"
        />
      </view>

      <!-- 加载更多 -->
      <view class="load-more">
        <text v-if="loadingMore" class="load-more-text">加载中...</text>
        <text v-else class="load-more-text">— 已经到底了 —</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePostsStore } from '@/stores/posts'
import PostCard from '@/components/PostCard.vue'

const postsStore = usePostsStore()
const activeTab = ref('latest')
const refreshing = ref(false)
const loadingMore = ref(false)

const tabs = [
  { key: 'latest', label: '最新' },
  { key: 'hot', label: '热门' },
  { key: 'hole', label: '树洞' },
  { key: 'love', label: '表白墙' },
]

const filteredPosts = computed(() => {
  const all = postsStore.postList
  if (activeTab.value === 'hot') return [...all].sort((a, b) => b.likes - a.likes)
  if (activeTab.value === 'hole') return all.filter(p => p.isAnon)
  if (activeTab.value === 'love') return all.filter(p => p.tag === '表白')
  return all
})

function switchTab(key) {
  activeTab.value = key
}

async function onRefresh() {
  refreshing.value = true
  // 模拟刷新延迟
  setTimeout(() => { refreshing.value = false }, 800)
}

function loadMore() {
  // 实际项目中分页加载
}

function goSearch() {
  uni.showToast({ title: '搜索功能开发中', icon: 'none' })
}

function goNotice() {
  uni.showToast({ title: '暂无新通知', icon: 'none' })
}

function onBanner() {
  uni.showToast({ title: '活动详情开发中', icon: 'none' })
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  flex-direction: column;
}

/* 导航栏 */
.nav-bar {
  background: #ffffff;
  border-bottom: 1rpx solid var(--border);
  padding-top: var(--status-bar-height, 44px);
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 32rpx 16rpx;
}

.nav-title {
  font-size: 36rpx;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: 2rpx;
}

.nav-right {
  display: flex;
  gap: 8rpx;
}

.nav-icon-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
}

/* 滚动区域 */
.scroll-area {
  flex: 1;
  height: calc(100vh - 100rpx - var(--status-bar-height, 44px));
}

/* Banner */
.banner {
  margin: 20rpx 24rpx 12rpx;
  border-radius: 24rpx;
  background: linear-gradient(120deg, #FF5A35, #FF9035);
  padding: 28rpx 32rpx;
  display: flex;
  align-items: center;
}

.banner-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.banner-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #ffffff;
}

.banner-sub {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.85);
}

.banner-emoji {
  font-size: 72rpx;
  margin-left: 16rpx;
}

/* 分类 Tab */
.section-tabs {
  display: flex;
  background: #ffffff;
  border-bottom: 1rpx solid var(--border);
  padding: 0 24rpx;
  overflow-x: auto;
  white-space: nowrap;
}

.section-tabs::-webkit-scrollbar { display: none; }

.tab-item {
  padding: 20rpx 24rpx;
  font-size: 28rpx;
  color: var(--text-sub);
  border-bottom: 4rpx solid transparent;
  margin-bottom: -1rpx;
  transition: all 0.2s;
  flex-shrink: 0;
}

.tab-item.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
  font-weight: 600;
}

/* 帖子列表 */
.post-list {
  padding-top: 8rpx;
  padding-bottom: 12rpx;
}

.load-more {
  text-align: center;
  padding: 32rpx 0 48rpx;
}

.load-more-text {
  font-size: 24rpx;
  color: var(--text-hint);
}
</style>