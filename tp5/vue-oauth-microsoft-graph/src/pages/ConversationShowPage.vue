<template>
  <div class="conversation-page">
    <div v-if="loading" class="loading">Loading conversation...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="conversation-details">
      <div class="conversation-header">
        <router-link to="/conversations" class="back-link"
          >&larr; Back to conversations</router-link
        >
        <h1>{{ conversation?.subject || "(No subject)" }}</h1>

        <div class="conversation-info-bar">
          <div class="conversation-status">
            <span v-if="!conversation?.isRead" class="status-badge"
              >Unread</span
            >
            <span
              v-if="conversation?.importance === 'high'"
              class="importance-badge"
              >Important</span
            >
            <span v-if="conversation?.hasAttachments" class="attachment-badge"
              >📎 Attachments</span
            >
          </div>
          <div class="conversation-date">
            {{ formatDate(conversation?.receivedDateTime) }}
          </div>
        </div>

        <div class="meta">
          <div class="recipients-row">
            <strong>To:</strong>
            <span>{{ formatRecipients(conversation?.toRecipients) }}</span>
          </div>

          <div
            v-if="
              conversation?.ccRecipients && conversation.ccRecipients.length > 0
            "
            class="recipients-row"
          >
            <strong>CC:</strong>
            <span>{{ formatRecipients(conversation.ccRecipients) }}</span>
          </div>

          <div
            v-if="
              conversation?.bccRecipients &&
              conversation.bccRecipients.length > 0
            "
            class="recipients-row"
          >
            <strong>BCC:</strong>
            <span>{{ formatRecipients(conversation.bccRecipients) }}</span>
          </div>
        </div>
      </div>
      <div
        class="conversation-body"
        v-html="conversation?.body?.content || ''"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { getConversation } from "@/lib/microsoftGraph";
import { useUserStore } from "@/store/user";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const conversation = ref(null);
const loading = ref(true);
const error = ref(null);

const formatRecipients = (recipients) => {
  if (!recipients || recipients.length === 0) return "No recipients";

  return recipients
    .map((recipient) => {
      if (!recipient.emailAddress) return "Unknown";
      return (
        recipient.emailAddress.name ||
        recipient.emailAddress.address ||
        "Unknown"
      );
    })
    .join(", ");
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

  const id = route.params.id;
  try {
    loading.value = true;
    conversation.value = await getConversation(id);
  } catch (err) {
    error.value =
      "Failed to load conversation: " + (err.message || "Unknown error");
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.conversation-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.conversation-header {
  margin-bottom: 30px;
}

.back-link {
  display: inline-block;
  margin-bottom: 20px;
  color: #666;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.conversation-info-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.status-badge,
.importance-badge {
  background-color: #e74c3c;
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-right: 10px;
}

.importance-badge {
  background-color: #e67e22;
}

.attachment-badge {
  margin-left: 5px;
}

.meta {
  margin: 20px 0;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 5px;
  border-left: 4px solid #ddd;
}

.recipients-row {
  margin: 8px 0;
  display: flex;
}

.recipients-row strong {
  min-width: 50px;
  margin-right: 10px;
}

.conversation-body {
  line-height: 1.6;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 5px;
  background-color: white;
  word-break: break-word;
  overflow-wrap: break-word;
}

.loading,
.error {
  text-align: center;
  padding: 20px;
}

.error {
  color: red;
}
</style>
