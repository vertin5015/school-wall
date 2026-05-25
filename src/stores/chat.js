import { defineStore } from "pinia";
import { mockConversations, mockUser } from "@/mock/data";

function nowTime() {
  return new Date().toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function imagePreviewText() {
  return "[图片]";
}

function normalizeMessage(raw, conversation) {
  const fromMe =
    typeof raw.fromMe === "boolean"
      ? raw.fromMe
      : Number(raw.senderId) === Number(mockUser.id);

  const type = raw.type || (raw.imageUrl ? "image" : "text");

  return {
    id: raw.id,
    conversationId: raw.conversationId || conversation.id,
    senderId: raw.senderId || (fromMe ? mockUser.id : conversation.userId),
    receiverId: raw.receiverId || (fromMe ? conversation.userId : mockUser.id),
    fromMe,
    type,
    content: raw.content || "",
    imageUrl: raw.imageUrl || "",
    status: raw.status || "sent",
    createdAt: raw.createdAt || raw.time || nowTime(),
    time: raw.time || nowTime(),
  };
}

function normalizeConversation(raw) {
  const messages = (raw.messages || []).map((message) =>
    normalizeMessage(message, raw),
  );

  return {
    ...raw,
    lastMsg: raw.lastMsg || "",
    lastTime: raw.lastTime || "",
    unread: raw.unread || 0,
    messages,
  };
}

function getMessagePreview(message) {
  return message.type === "image" ? imagePreviewText() : message.content;
}

export const useChatStore = defineStore("chat", {
  state: () => ({
    conversations: mockConversations.map((item) => normalizeConversation(item)),
  }),
  getters: {
    conversationList: (state) => state.conversations,
    getConversationById: (state) => (id) =>
      state.conversations.find((item) => Number(item.id) === Number(id)),
    getConversationByUserId: (state) => (userId) =>
      state.conversations.find((item) => Number(item.userId) === Number(userId)),
  },
  actions: {
    markRead(conversationId) {
      const conversation = this.getConversationById(conversationId);
      if (conversation) conversation.unread = 0;
    },
    upsertConversationMeta(conversation, message) {
      conversation.lastMsg = getMessagePreview(message);
      conversation.lastTime = message.time;
    },
    ensureConversation(payload) {
      const existing = this.getConversationByUserId(payload.userId);
      if (existing) return existing;

      const conversation = normalizeConversation({
        id: Date.now(),
        userId: payload.userId,
        name: payload.name,
        avatar: payload.avatar,
        lastMsg: "",
        lastTime: "",
        unread: 0,
        messages: [],
      });

      this.conversations.unshift(conversation);
      return conversation;
    },
    appendMessage(conversationId, messagePayload) {
      const conversation = this.getConversationById(conversationId);
      if (!conversation) return null;

      const message = normalizeMessage(
        {
          id: Date.now() + Math.floor(Math.random() * 1000),
          ...messagePayload,
        },
        conversation,
      );

      conversation.messages.push(message);
      this.upsertConversationMeta(conversation, message);
      return message;
    },
    sendText(conversationId, content) {
      return this.appendMessage(conversationId, {
        fromMe: true,
        type: "text",
        content,
        status: "sent",
        time: nowTime(),
      });
    },
    sendImage(conversationId, imageUrl) {
      return this.appendMessage(conversationId, {
        fromMe: true,
        type: "image",
        imageUrl,
        content: "",
        status: "sent",
        time: nowTime(),
      });
    },
    receiveText(conversationId, content) {
      const message = this.appendMessage(conversationId, {
        fromMe: false,
        type: "text",
        content,
        status: "received",
        time: nowTime(),
      });
      const conversation = this.getConversationById(conversationId);
      if (conversation) conversation.unread += 1;
      return message;
    },
    clearMessages(conversationId) {
      const conversation = this.getConversationById(conversationId);
      if (!conversation) return;
      conversation.messages = [];
      conversation.lastMsg = "";
      conversation.lastTime = "";
    },
  },
});
