<template>
  <div class="conversations-page">
    <h1>Recent Conversations</h1>
    <div v-if="loading" class="loading">Loading conversations...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="conversations-list">
      <router-link
        v-for="conversation in conversations"
        :key="conversation.id"
        :to="{ name: 'conversation-show', params: { id: conversation.id } }"
        class="conversation-item"
      >
        <h3>{{ conversation.subject || "(No subject)" }}</h3>
        <p
          v-if="
            conversation.toRecipients && conversation.toRecipients.length > 0
          "
        >
          To: {{ getRecipientName(conversation.toRecipients[0]) }}
          <span v-if="conversation.toRecipients.length > 1">
            + {{ conversation.toRecipients.length - 1 }} more
          </span>
        </p>
        <p class="preview">
          {{ conversation.bodyPreview || "No preview available" }}
        </p>
        <span class="small">
          {{ formatDate(conversation.receivedDateTime) }}
        </span>
      </router-link>
      <p v-if="conversations.length === 0" class="no-conversations">
        No emails found in your mailbox.
      </p>
    </div>
  </div>
</template>

<script setup>
import { getConversations } from "@/lib/microsoftGraph";
import { useUserStore } from "@/store/user";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const conversations = ref([]);
const loading = ref(true);
const error = ref(null);

const getRecipientName = (recipient) => {
  if (!recipient || !recipient.emailAddress) return "Unknown recipient";
  return (
    recipient.emailAddress.name || recipient.emailAddress.address || "Unknown"
  );
};

const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(async () => {
  if (!userStore.isAuthenticated) {
    router.push("/");
    return;
  }

  try {
    loading.value = true;
    conversations.value = await getConversations();
  } catch (err) {
    error.value =
      "Failed to load conversations: " + (err.message || "Unknown error");
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.conversations-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.conversations-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.conversation-item {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: background-color 0.2s;
  display: block;
  color: inherit;
  text-decoration: none;
}

.conversation-item:hover {
  background-color: #f5f5f5;
  text-decoration: none;
}

.conversation-item h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-item p {
  margin: 0 0 5px 0;
  color: #666;
  font-size: 14px;
}

.conversation-item .preview {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  color: #777;
}

.conversation-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.attachment-icon {
  font-size: 16px;
}

.conversation-item small {
  color: #999;
}

.loading,
.error,
.no-conversations {
  text-align: center;
  padding: 20px;
}

.error {
  color: red;
}
</style>
