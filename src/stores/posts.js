import { defineStore } from "pinia";
import { mockPosts } from "@/mock/data";

export const usePostsStore = defineStore("posts", {
  state: () => ({
    posts: [...mockPosts],
    activeTab: "latest", // latest | hot | hole | love
  }),
  getters: {
    postList: (state) => state.posts,
    getPostById: (state) => (id) => state.posts.find((p) => p.id === id),
  },
  actions: {
    toggleLike(postId) {
      const post = this.posts.find((p) => p.id === postId);
      if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
      }
    },
    toggleCollect(postId) {
      const post = this.posts.find((p) => p.id === postId);
      if (post) {
        post.collected = !post.collected;
      }
    },
    addComment(postId, comment) {
      const post = this.posts.find((p) => p.id === postId);
      if (post) {
        post.comments.push({
          id: Date.now(),
          ...comment,
          time: new Date().toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          likes: 0,
          isAuthor: false,
        });
        post.commentCount++;
      }
    },
    addPost(post) {
      this.posts.unshift({
        id: Date.now(),
        likes: 0,
        liked: false,
        collected: false,
        commentCount: 0,
        comments: [],
        time: "刚刚",
        fullTime: new Date().toLocaleString("zh-CN"),
        ...post,
      });
    },
  },
});
