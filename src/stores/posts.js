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
    searchPosts: (state) => (keyword) => {
      const normalizedKeyword = String(keyword || "").trim().toLowerCase();
      if (!normalizedKeyword) return state.posts;

      return state.posts.filter((post) => {
        const haystacks = [
          post.title,
          post.content,
          post.tag,
          post.author,
          ...(post.comments || []).map((comment) => comment.content),
        ];

        return haystacks.some((item) =>
          String(item || "").toLowerCase().includes(normalizedKeyword),
        );
      });
    },
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
