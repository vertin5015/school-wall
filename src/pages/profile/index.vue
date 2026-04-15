<template>
  <view class="profile-page">
    <scroll-view scroll-y class="scroll-area">

      <!-- 头部用户信息卡片 -->
      <view class="profile-header">
        <view class="header-bg"></view>
        <view class="header-content">
          <view class="avatar-wrap" @tap="changeAvatar">
            <view class="user-avatar">{{ userInfo.avatar }}</view>
            <view class="avatar-edit-badge">✏</view>
          </view>
          <view class="user-info">
            <view class="nickname-row">
              <text class="user-nickname">{{ userInfo.nickname }}</text>
              <view class="edit-btn" @tap="editProfile">编辑资料</view>
            </view>
            <text class="user-school">{{ userInfo.school }}</text>
            <text class="user-bio">{{ userInfo.bio || '这个人很懒，什么都没写~' }}</text>
          </view>
        </view>

        <!-- 数据统计 -->
        <view class="stat-bar">
          <view class="stat-item" @tap="goMyPosts">
            <text class="stat-num">{{ userInfo.postCount }}</text>
            <text class="stat-label">帖子</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-num">{{ userInfo.likeCount }}</text>
            <text class="stat-label">获赞</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item" @tap="activeTab = 'collect'">
            <text class="stat-num">{{ userInfo.collectCount }}</text>
            <text class="stat-label">收藏</text>
          </view>
        </view>
      </view>

      <!-- Tab 切换：我的帖子 / 收藏 -->
      <view class="profile-tabs">
        <view
          class="ptab"
          :class="{ active: activeTab === 'posts' }"
          @tap="activeTab = 'posts'"
        >我的帖子</view>
        <view
          class="ptab"
          :class="{ active: activeTab === 'collect' }"
          @tap="activeTab = 'collect'"
        >我的收藏</view>
      </view>

      <!-- 帖子列表 -->
      <view class="post-list-section" v-if="activeTab === 'posts'">
        <view v-if="myPosts.length === 0" class="empty-tip">
          <text class="empty-emoji">📝</text>
          <text class="empty-text">还没有发过帖子</text>
          <view class="empty-btn" @tap="goPublish">去发帖</view>
        </view>
        <PostCard v-for="post in myPosts" :key="post.id" :post="post" />
      </view>

      <view class="post-list-section" v-if="activeTab === 'collect'">
        <view v-if="collectedPosts.length === 0" class="empty-tip">
          <text class="empty-emoji">⭐</text>
          <text class="empty-text">还没有收藏任何帖子</text>
        </view>
        <PostCard v-for="post in collectedPosts" :key="post.id" :post="post" />
      </view>

      <!-- 设置菜单 -->
      <view class="settings-section">
        <text class="settings-title">设置</text>
        <view class="settings-list">
          <view class="settings-item" v-for="item in settingItems" :key="item.label" @tap="item.action">
            <text class="settings-icon">{{ item.icon }}</text>
            <text class="settings-label">{{ item.label }}</text>
            <text class="settings-arrow">›</text>
          </view>
        </view>
      </view>

      <!-- 退出登录 -->
      <view class="logout-wrap">
        <view class="logout-btn" @tap="onLogout">退出登录</view>
      </view>

      <view style="height: 40rpx;"></view>
    </scroll-view>

    <!-- 编辑资料弹窗 -->
    <view v-if="showEditModal" class="modal-mask" @tap.self="showEditModal = false">
      <view class="modal-wrap">
        <view class="modal-header">
          <text class="modal-title">编辑资料</text>
          <view class="modal-close" @tap="showEditModal = false">×</view>
        </view>
        <view class="modal-form">
          <view class="modal-field">
            <text class="field-label">昵称</text>
            <input class="field-input" v-model="editForm.nickname" placeholder="输入昵称" :maxlength="20" />
          </view>
          <view class="modal-field">
            <text class="field-label">学校</text>
            <input class="field-input" v-model="editForm.school" placeholder="输入学校名称" :maxlength="30" />
          </view>
          <view class="modal-field">
            <text class="field-label">简介</text>
            <textarea class="field-textarea" v-model="editForm.bio" placeholder="介绍一下自己..." :maxlength="100" />
          </view>
        </view>
        <view class="modal-footer">
          <view class="modal-cancel" @tap="showEditModal = false">取消</view>
          <view class="modal-confirm" @tap="saveProfile">保存</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { usePostsStore } from '@/stores/posts'
import PostCard from '@/components/PostCard.vue'

const userStore = useUserStore()
const postsStore = usePostsStore()

const userInfo = computed(() => userStore.userInfo || {})
const activeTab = ref('posts')
const showEditModal = ref(false)

const editForm = reactive({
  nickname: '',
  school: '',
  bio: '',
})

const myPosts = computed(() =>
  postsStore.postList.filter(p => p.authorId === userInfo.value.id)
)

const collectedPosts = computed(() =>
  postsStore.postList.filter(p => p.collected)
)

const settingItems = [
  { icon: '🔔', label: '消息通知设置', action: () => toast('开发中') },
  { icon: '🔒', label: '隐私设置', action: () => toast('开发中') },
  { icon: '🎨', label: '外观设置', action: () => toast('开发中') },
  { icon: '❓', label: '帮助与反馈', action: () => toast('开发中') },
  { icon: '📋', label: '用户协议', action: () => toast('开发中') },
  { icon: 'ℹ️', label: '关于校园墙', action: () => toast('v1.0.0') },
]

function toast(msg) {
  uni.showToast({ title: msg, icon: 'none' })
}

function goMyPosts() {
  activeTab.value = 'posts'
}

function goPublish() {
  uni.navigateTo({ url: '/pages/publish/index' })
}

function changeAvatar() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: ({ tempFilePaths }) => {
      userStore.updateProfile({ avatar: tempFilePaths[0] })
      uni.showToast({ title: '头像已更新', icon: 'success' })
    }
  })
}

function editProfile() {
  editForm.nickname = userInfo.value.nickname || ''
  editForm.school = userInfo.value.school || ''
  editForm.bio = userInfo.value.bio || ''
  showEditModal.value = true
}

function saveProfile() {
  userStore.updateProfile({ ...editForm })
  showEditModal.value = false
  uni.showToast({ title: '保存成功', icon: 'success' })
}

function onLogout() {
  uni.showModal({
    title: '提示',
    content: '确定退出登录吗？',
    success: ({ confirm }) => {
      if (confirm) {
        userStore.logout()
        uni.reLaunch({ url: '/pages/login/index' })
      }
    }
  })
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--bg);
}

.scroll-area {
  height: 100vh;
}

/* 头部卡片 */
.profile-header {
  background: #ffffff;
  position: relative;
  padding-top: var(--status-bar-height, 44px);
  margin-bottom: 0;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 240rpx;
  background: linear-gradient(160deg, #FF5A35 0%, #FF9060 100%);
}

.header-content {
  position: relative;
  padding: 40rpx 32rpx 20rpx;
  display: flex;
  align-items: flex-end;
  gap: 20rpx;
}

.avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.user-avatar {
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
  background: #fff;
  border: 4rpx solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.12);
}

.avatar-edit-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: var(--primary);
  color: #fff;
  font-size: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #fff;
}

.user-info {
  flex: 1;
  padding-bottom: 4rpx;
}

.nickname-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6rpx;
}

.user-nickname {
  font-size: 36rpx;
  font-weight: 800;
  color: var(--text-main);
}

.edit-btn {
  font-size: 24rpx;
  color: var(--text-sub);
  border: 1rpx solid var(--border);
  border-radius: 100rpx;
  padding: 6rpx 22rpx;
  background: #fff;
}

.user-school {
  font-size: 24rpx;
  color: var(--text-hint);
  display: block;
  margin-bottom: 6rpx;
}

.user-bio {
  font-size: 26rpx;
  color: var(--text-sub);
  display: block;
}

/* 统计条 */
.stat-bar {
  display: flex;
  align-items: center;
  padding: 24rpx 40rpx;
  margin-top: 8rpx;
  border-top: 1rpx solid var(--border);
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}

.stat-num {
  font-size: 36rpx;
  font-weight: 800;
  color: var(--text-main);
}

.stat-label {
  font-size: 22rpx;
  color: var(--text-hint);
}

.stat-divider {
  width: 1rpx;
  height: 48rpx;
  background: var(--border);
}

/* 内容 Tab */
.profile-tabs {
  display: flex;
  background: #ffffff;
  border-bottom: 1rpx solid var(--border);
  margin-top: 12rpx;
}

.ptab {
  flex: 1;
  padding: 22rpx 0;
  text-align: center;
  font-size: 28rpx;
  color: var(--text-hint);
  border-bottom: 4rpx solid transparent;
  margin-bottom: -1rpx;
}

.ptab.active {
  color: var(--primary);
  font-weight: 600;
  border-bottom-color: var(--primary);
}

/* 帖子区 */
.post-list-section {
  padding-top: 8rpx;
}

.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0;
  gap: 16rpx;
}

.empty-emoji { font-size: 64rpx; }
.empty-text { font-size: 28rpx; color: var(--text-hint); }
.empty-btn {
  margin-top: 8rpx;
  background: var(--primary);
  color: #fff;
  border-radius: 100rpx;
  padding: 14rpx 48rpx;
  font-size: 28rpx;
}

/* 设置区 */
.settings-section {
  background: #ffffff;
  margin-top: 16rpx;
  padding: 24rpx 32rpx 8rpx;
}

.settings-title {
  font-size: 26rpx;
  color: var(--text-hint);
  margin-bottom: 8rpx;
  display: block;
}

.settings-list { }

.settings-item {
  display: flex;
  align-items: center;
  padding: 26rpx 0;
  border-bottom: 1rpx solid var(--border);
  gap: 20rpx;
}

.settings-item:last-child { border-bottom: none; }

.settings-icon { font-size: 32rpx; width: 40rpx; text-align: center; }
.settings-label { flex: 1; font-size: 30rpx; color: var(--text-main); }
.settings-arrow { font-size: 32rpx; color: var(--text-hint); }

/* 退出登录 */
.logout-wrap {
  padding: 32rpx 32rpx 16rpx;
}

.logout-btn {
  width: 100%;
  height: 88rpx;
  background: #ffffff;
  border-radius: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  color: #FF3B30;
  border: 1rpx solid #FFCDD0;
}

/* 编辑弹窗 */
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 300;
  display: flex;
  align-items: flex-end;
}

.modal-wrap {
  background: #ffffff;
  border-radius: 28rpx 28rpx 0 0;
  width: 100%;
  padding: 28rpx 32rpx 60rpx;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28rpx;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--text-main);
}

.modal-close {
  font-size: 40rpx;
  color: var(--text-hint);
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 28rpx;
}

.modal-field {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.field-label {
  font-size: 24rpx;
  color: var(--text-hint);
}

.field-input {
  border-bottom: 1rpx solid var(--border);
  padding: 12rpx 0;
  font-size: 30rpx;
  color: var(--text-main);
}

.field-textarea {
  border: 1rpx solid var(--border);
  border-radius: 12rpx;
  padding: 16rpx;
  font-size: 28rpx;
  color: var(--text-sub);
  min-height: 120rpx;
  line-height: 1.7;
}

.modal-footer {
  display: flex;
  gap: 16rpx;
}

.modal-cancel {
  flex: 1;
  height: 88rpx;
  border-radius: 200rpx;
  border: 1rpx solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  color: var(--text-sub);
}

.modal-confirm {
  flex: 2;
  height: 88rpx;
  border-radius: 200rpx;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  color: #ffffff;
  font-weight: 600;
}
</style>