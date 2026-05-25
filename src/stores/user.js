import { defineStore } from "pinia";
import { mockUser, mockUsers } from "../mock/data";

export const useUserStore = defineStore("user", {
  state: () => ({
    isLoggedIn: true,
    userInfo: { ...mockUser },
    users: [...mockUsers],
  }),
  getters: {
    getUserById: (state) => (id) =>
      [state.userInfo, ...state.users].find((user) => Number(user?.id) === Number(id)),
    getUserByName: (state) => (name) =>
      [state.userInfo, ...state.users].find(
        (user) => user?.nickname === name || user?.name === name,
      ),
  },
  actions: {
    wxLogin() {
      // 模拟微信登录，实际项目中调用 uni.login + 后端接口
      return new Promise((resolve) => {
        setTimeout(() => {
          this.isLoggedIn = true;
          this.userInfo = { ...mockUser };
          resolve();
        }, 1200);
      });
    },
    logout() {
      this.isLoggedIn = false;
      this.userInfo = null;
    },
    updateProfile(data) {
      this.userInfo = { ...this.userInfo, ...data };
    },
  },
  persist: true, // 需要 pinia-plugin-persistedstate，小程序端可去掉
});
