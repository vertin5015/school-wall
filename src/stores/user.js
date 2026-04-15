import { defineStore } from 'pinia'
import { mockUser } from '@/mock/data'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    userInfo: null,
  }),
  actions: {
    wxLogin() {
      // 模拟微信登录，实际项目中调用 uni.login + 后端接口
      return new Promise((resolve) => {
        setTimeout(() => {
          this.isLoggedIn = true
          this.userInfo = { ...mockUser }
          resolve()
        }, 1200)
      })
    },
    logout() {
      this.isLoggedIn = false
      this.userInfo = null
    },
    updateProfile(data) {
      this.userInfo = { ...this.userInfo, ...data }
    }
  },
  persist: true, // 需要 pinia-plugin-persistedstate，小程序端可去掉
})