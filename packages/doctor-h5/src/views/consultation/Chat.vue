<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { get, post } from '@ylxb/shared'
import { showToast, showConfirmDialog } from 'vant'
import { useAuthStore } from '@/stores/auth'
import type { ConsultationMessage, ConsultationSession } from '@ylxb/shared'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const sessionId = route.params.id as string

const session = ref<ConsultationSession | null>(null)
const messages = ref<ConsultationMessage[]>([])
const inputText = ref('')
const loading = ref(true)
const sending = ref(false)
const chatBody = ref<HTMLElement | null>(null)

onMounted(async () => {
  const [sessionRes, msgRes] = await Promise.all([
    get<ConsultationSession>('/consultation/sessions/' + sessionId),
    get<ConsultationMessage[]>('/consultation/messages/' + sessionId),
  ])
  if (sessionRes.code === 0) {
    session.value = sessionRes.data as unknown as ConsultationSession
  }
  if (msgRes.code === 0) {
    messages.value = (msgRes.data as unknown as ConsultationMessage[]) || []
  }
  loading.value = false
  scrollToBottom()
})

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || sending.value) return
  sending.value = true
  const res = await post<ConsultationMessage>('/consultation/messages', {
    sessionId,
    senderId: auth.user?.id || 'd1',
    senderName: auth.user?.name || '医生',
    senderRole: 'doctor',
    content: text,
    type: 'text',
  })
  if (res.code === 0) {
    messages.value.push(res.data as ConsultationMessage)
    inputText.value = ''
    nextTick(() => scrollToBottom())
  } else {
    showToast(res.message)
  }
  sending.value = false
}

async function handleCloseSession() {
  try {
    await showConfirmDialog({
      title: '结束咨询',
      message: '确定要结束本次咨询吗？结束后患者将无法继续发送消息。',
      confirmButtonColor: '#4A90D9',
    })
    const res = await post<{ status: string }>('/consultation/close', { sessionId })
    if (res.code === 0 && session.value) {
      session.value.status = 'closed'
      showToast('咨询已结束')
    }
  } catch {
    // user cancelled
  }
}

function scrollToBottom() {
  if (chatBody.value) {
    chatBody.value.scrollTop = chatBody.value.scrollHeight
  }
}
</script>

<template>
  <div class="chat-page">
    <van-nav-bar :title="session?.patientName || '咨询对话'" left-arrow @click-left="router.back()">
      <template #right>
        <van-button
          v-if="session?.status === 'active'"
          size="small"
          type="danger"
          plain
          @click="handleCloseSession"
        >
          结束咨询
        </van-button>
      </template>
    </van-nav-bar>

    <van-loading v-if="loading" type="spinner" class="loading" />

    <div v-else class="chat-body" ref="chatBody">
      <div v-if="session" class="session-info-bar">
        <span class="info-left">
          {{ session.patientName }} · {{ session.subject }}
        </span>
        <van-tag :type="session.status === 'active' ? 'success' : 'default'" size="medium">
          {{ session.status === 'active' ? '进行中' : '已结束' }}
        </van-tag>
      </div>

      <div
        v-for="msg in messages"
        :key="msg.id"
        class="message-row"
        :class="{ self: msg.senderRole === 'doctor' || msg.senderRole === 'assistant' }"
      >
        <div class="message-bubble" :class="{ self: msg.senderRole === 'doctor' || msg.senderRole === 'assistant' }">
          <div class="msg-sender">{{ msg.senderName }}</div>
          <div class="msg-content">{{ msg.content }}</div>
          <div class="msg-time">{{ msg.createdAt?.slice(11, 16) || '' }}</div>
        </div>
      </div>

      <van-empty v-if="messages.length === 0" description="暂无消息" />
    </div>

    <div class="chat-input" v-if="session?.status === 'active'">
      <van-field
        v-model="inputText"
        placeholder="输入回复内容..."
        :autosize="{ minHeight: 36, maxHeight: 80 }"
        type="textarea"
        rows="1"
        border
        class="input-field"
      />
      <van-button
        type="primary"
        size="small"
        :loading="sending"
        :disabled="!inputText.trim()"
        @click="sendMessage"
      >
        发送
      </van-button>
    </div>

    <div class="chat-closed-hint" v-else-if="!loading">
      <van-notice-bar text="该咨询已结束，无法发送新消息" left-icon="info-o" />
    </div>
  </div>
</template>

<style scoped>
.chat-page { display: flex; flex-direction: column; height: 100vh; background: #f5f7fa; }
.loading { display: flex; justify-content: center; padding: 40px 0; }
.chat-body { flex: 1; overflow-y: auto; padding: 12px; }
.session-info-bar {
  background: #fff;
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #666;
}
.message-row { display: flex; margin-bottom: 12px; }
.message-row.self { justify-content: flex-end; }
.message-bubble {
  max-width: 75%;
  background: #fff;
  border-radius: 12px;
  padding: 10px 14px;
}
.message-bubble.self { background: #e8f4fd; }
.msg-sender { font-size: 11px; color: #4A90D9; margin-bottom: 4px; }
.message-bubble.self .msg-sender { color: #666; }
.msg-content { font-size: 14px; line-height: 1.5; color: #333; }
.msg-time { font-size: 10px; color: #bbb; margin-top: 4px; text-align: right; }
.chat-input {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 8px 12px;
  background: #fff;
  border-top: 1px solid #ebedf0;
}
.input-field { flex: 1; }
.chat-closed-hint { padding: 12px; }
</style>
