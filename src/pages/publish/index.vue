<template>
  <view class="publish-page">
    <view class="nav-bar">
      <view class="nav-inner">
        <view class="cancel-btn" @tap="onCancel">取消</view>
        <text class="nav-title">发帖</text>
        <view
          class="publish-btn"
          :class="{ active: canPublish }"
          @tap="onPublish"
        >发布</view>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-area">
      <view class="form-wrap">

        <!-- 标题输入 -->
        <view class="form-item">
          <input
            class="title-input"
            v-model="title"
            placeholder="输入一个吸引人的标题..."
            :maxlength="50"
          />
          <text class="word-count">{{ title.length }}/50</text>
        </view>

        <view class="form-divider"></view>

        <!-- 正文输入 -->
        <view class="form-item">
          <textarea
            class="content-input"
            v-model="content"
            placeholder="分享你的故事、问题或想法...&#10;&#10;（支持 @ 同学，# 话题标签）"
            :maxlength="2000"
            auto-height
          />
          <text class="word-count">{{ content.length }}/2000</text>
        </view>

        <!-- 图片上传 -->
        <view class="img-section">
          <view class="img-list">
            <view
              v-for="(img, i) in selectedImages"
              :key="i"
              class="img-item"
            >
              <image :src="img" class="preview-img" mode="aspectFill" />
              <view class="img-del" @tap="removeImg(i)">×</view>
            </view>
            <view
              v-if="selectedImages.length < 9"
              class="img-add-btn"
              @tap="chooseImg"
            >
              <text class="img-add-icon">＋</text>
              <text class="img-add-tip">{{ selectedImages.length }}/9</text>
            </view>
          </view>
        </view>

        <view class="form-divider"></view>

        <!-- 标签选择 -->
        <view class="form-item">
          <text class="form-label">选择话题</text>
          <view class="tag-list">
            <view
              v-for="tag in availableTags"
              :key="tag.value"
              class="tag-option"
              :class="{ selected: selectedTag === tag.value }"
              @tap="selectTag(tag.value)"
            >
              <text>{{ tag.label }}</text>
            </view>
          </view>
        </view>

        <view class="form-divider"></view>

        <!-- 匿名开关 -->
        <view class="form-item switch-row">
          <view class="switch-info">
            <text class="switch-label">匿名发布</text>
            <text class="switch-desc">开启后其他用户看不到你的昵称</text>
          </view>
          <switch
            :checked="isAnon"
            color="#FF5A35"
            @change="isAnon = $event.detail.value"
          />
        </view>

        <view class="form-divider"></view>

        <!-- 仅自己可见 -->
        <view class="form-item switch-row">
          <view class="switch-info">
            <text class="switch-label">仅自己可见</text>
            <text class="switch-desc">发布后只有自己能看到</text>
          </view>
          <switch
            :checked="onlyMe"
            color="#FF5A35"
            @change="onlyMe = $event.detail.value"
          />
        </view>

      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { useUserStore } from '@/stores/user'

const postsStore = usePostsStore()
const userStore = useUserStore()

const title = ref('')
const content = ref('')
const selectedImages = ref([])
const selectedTag = ref('')
const isAnon = ref(false)
const onlyMe = ref(false)

const availableTags = [
  { value: 'orange', label: '🍜 美食' },
  { value: 'blue', label: '📚 学习' },
  { value: 'pink', label: '💕 表白' },
  { value: 'green', label: '🌱 资源' },
  { value: 'gray', label: '😤 吐槽' },
  { value: 'orange', label: '🎮 娱乐' },
  { value: 'blue', label: '🏃 运动' },
  { value: 'gray', label: '🏠 校园生活' },
]

const tagLabelMap = {
  '🍜 美食': '美食',
  '📚 学习': '学习',
  '💕 表白': '表白',
  '🌱 资源': '资源',
  '😤 吐槽': '吐槽',
  '🎮 娱乐': '娱乐',
  '🏃 运动': '运动',
  '🏠 校园生活': '校园生活',
}

const canPublish = computed(() => title.value.trim().length > 0 && content.value.trim().length > 0)

function chooseImg() {
  uni.chooseImage({
    count: 9 - selectedImages.value.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: ({ tempFilePaths }) => {
      selectedImages.value.push(...tempFilePaths)
    }
  })
}

function removeImg(index) {
  selectedImages.value.splice(index, 1)
}

function selectTag(value) {
  // 找到对应的 label
  const tag = availableTags.find(t => t.value === value)
  if (tag) {
    selectedTag.value = selectedTag.value === tag.label ? '' : tag.label
  }
}

function onCancel() {
  if (title.value || content.value) {
    uni.showModal({
      title: '提示',
      content: '确定放弃编辑吗？',
      success: ({ confirm }) => {
        if (confirm) uni.navigateBack()
      }
    })
  } else {
    uni.navigateBack()
  }
}

function onPublish() {
  if (!canPublish.value) return
  const tagEntry = availableTags.find(t => t.label === selectedTag.value) || { value: 'gray', label: '校园生活' }
  postsStore.addPost({
    title: title.value.trim(),
    content: content.value.trim(),
    images: selectedImages.value,
    tag: selectedTag.value ? selectedTag.value.replace(/^.+?\s/, '') : '校园生活',
    tagColor: tagEntry.value,
    isAnon: isAnon.value,
    author: userStore.userInfo?.nickname || '匿名用户',
    authorAvatar: userStore.userInfo?.avatar || '🍊',
    authorId: userStore.userInfo?.id || 999,
    emoji: '',
  })
  uni.showToast({ title: '发布成功！', icon: 'success' })
  setTimeout(() => {
    uni.switchTab({ url: '/pages/home/index' })
  }, 800)
}
</script>

<style scoped>
.publish-page {
  min-height: 100vh;
  background: #ffffff;
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
  justify-content: space-between;
  padding: 16rpx 32rpx;
}

.cancel-btn {
  font-size: 30rpx;
  color: var(--text-sub);
  min-width: 80rpx;
}

.nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text-main);
}

.publish-btn {
  font-size: 30rpx;
  color: var(--text-hint);
  background: var(--bg);
  border-radius: 100rpx;
  padding: 10rpx 28rpx;
  min-width: 80rpx;
  text-align: center;
}

.publish-btn.active {
  background: var(--primary);
  color: #ffffff;
  font-weight: 600;
}

.scroll-area {
  flex: 1;
}

.form-wrap {
  padding: 0;
}

.form-item {
  padding: 24rpx 32rpx;
  position: relative;
}

.form-divider {
  height: 12rpx;
  background: var(--bg);
}

/* 标题输入 */
.title-input {
  width: 100%;
  font-size: 36rpx;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.5;
  height: 80rpx;
}

/* 正文输入 */
.content-input {
  width: 100%;
  font-size: 30rpx;
  color: var(--text-sub);
  line-height: 1.8;
  min-height: 280rpx;
}

.word-count {
  font-size: 22rpx;
  color: var(--text-hint);
  position: absolute;
  bottom: 20rpx;
  right: 32rpx;
}

/* 图片上传 */
.img-section {
  padding: 16rpx 32rpx 24rpx;
  border-bottom: 1rpx solid var(--border);
}

.img-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.img-item {
  position: relative;
  width: 186rpx;
  height: 186rpx;
}

.preview-img {
  width: 186rpx;
  height: 186rpx;
  border-radius: 16rpx;
  object-fit: cover;
}

.img-del {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  line-height: 1;
}

.img-add-btn {
  width: 186rpx;
  height: 186rpx;
  border-radius: 16rpx;
  border: 2rpx dashed var(--border);
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.img-add-icon {
  font-size: 48rpx;
  color: var(--text-hint);
  font-weight: 300;
}

.img-add-tip {
  font-size: 22rpx;
  color: var(--text-hint);
}

/* 标签选择 */
.form-label {
  font-size: 28rpx;
  color: var(--text-sub);
  font-weight: 500;
  margin-bottom: 18rpx;
  display: block;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 16rpx;
}

.tag-option {
  border: 1rpx solid var(--border);
  border-radius: 100rpx;
  padding: 12rpx 28rpx;
  font-size: 26rpx;
  color: var(--text-sub);
  background: var(--bg);
  transition: all 0.15s;
}

.tag-option.selected {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-light);
}

/* 开关行 */
.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.switch-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.switch-label {
  font-size: 30rpx;
  color: var(--text-main);
  font-weight: 500;
}

.switch-desc {
  font-size: 24rpx;
  color: var(--text-hint);
}
</style>