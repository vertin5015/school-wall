import { defineStore } from "pinia";
import { request, setToken, upload, getToken, getFileUrl } from "@/utils/http";

const USER_KEY = "school_wall_user";
const DEV_USERNAME = "chengzi";
const DEV_PASSWORD = "123456";

function readStoredUser() {
  return uni.getStorageSync(USER_KEY) || null;
}

function persistUser(user) {
  if (user) {
    uni.setStorageSync(USER_KEY, user);
    return;
  }
  uni.removeStorageSync(USER_KEY);
}

function normalizeUser(user) {
  if (!user) {
    return null;
  }
  return {
    ...user,
    avatar: getFileUrl(user.avatar) || "👤",
  };
}

export const useUserStore = defineStore("user", {
  state: () => ({
    token: getToken(),
    userInfo: normalizeUser(readStoredUser()),
    users: [],
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.token && state.userInfo?.id),
    getUserById: (state) => (id) =>
      [state.userInfo, ...state.users]
        .filter(Boolean)
        .find((user) => Number(user?.id) === Number(id)),
    getUserByName: (state) => (name) =>
      [state.userInfo, ...state.users]
        .filter(Boolean)
        .find((user) => user?.nickname === name || user?.username === name),
  },
  actions: {
    setSession(payload) {
      this.token = payload?.token || "";
      this.userInfo = normalizeUser(payload?.user || null);
      setToken(this.token);
      persistUser(this.userInfo);
      if (this.userInfo) {
        this.upsertUsers([this.userInfo]);
      }
    },
    upsertUsers(users = []) {
      const map = new Map(
        this.users.map((user) => [Number(user.id), normalizeUser(user)]),
      );
      users.filter(Boolean).forEach((user) => {
        map.set(Number(user.id), normalizeUser(user));
      });
      if (this.userInfo?.id) {
        map.delete(Number(this.userInfo.id));
      }
      this.users = Array.from(map.values());
    },
    async loginWithDemo() {
      const data = await request({
        url: "/api/user/login",
        method: "POST",
        data: {
          username: DEV_USERNAME,
          password: DEV_PASSWORD,
        },
        header: {
          "Content-Type": "application/json",
        },
        useAuth: false,
      });
      this.setSession(data);
      return data;
    },
    async bootstrapDevSession() {
      if (this.isLoggedIn) {
        try {
          await this.fetchCurrentUser();
          return this.userInfo;
        } catch (error) {
          this.logout();
        }
      }
      const data = await this.loginWithDemo();
      return data?.user || null;
    },
    async fetchCurrentUser() {
      if (!this.token) {
        return null;
      }
      const user = await request({
        url: "/api/user/info",
      });
      this.userInfo = normalizeUser(user);
      persistUser(this.userInfo);
      this.upsertUsers([this.userInfo]);
      return this.userInfo;
    },
    async fetchUserById(userId) {
      const user = await request({
        url: `/api/user/${userId}`,
      });
      const normalized = normalizeUser(user);
      this.upsertUsers([normalized]);
      return normalized;
    },
    async updateProfile(data) {
      const user = await request({
        url: "/api/user/info",
        method: "PUT",
        data,
        header: {
          "Content-Type": "application/json",
        },
      });
      this.userInfo = normalizeUser(user);
      persistUser(this.userInfo);
      this.upsertUsers([this.userInfo]);
      return this.userInfo;
    },
    async uploadAvatar(filePath) {
      const data = await upload({
        url: "/api/user/avatar",
        filePath,
      });
      const avatar = getFileUrl(data?.url);
      return this.updateProfile({ avatar });
    },
    logout() {
      this.token = "";
      this.userInfo = null;
      setToken("");
      persistUser(null);
    },
  },
});
