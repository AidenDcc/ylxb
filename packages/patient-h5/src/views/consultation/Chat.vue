<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { get, post } from '@ylxb/shared'
import type { ConsultationSession, ConsultationMessage } from '@ylxb/shared'
import { timeAgo } from '@ylxb/shared'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const session = ref<ConsultationSession | null>(null)
const messages = ref<ConsultationMessage[]>([])
const inputText = ref('')
const sending = ref(false)
const chatBody = ref<HTMLElement>()

onMounted(async () => {
  const [sRes, mRes] = await Promise.all([
    get<ConsultationSession>(`/consultation/sessions/${route.params.id}`),
    get<ConsultationMessage[]>(`/consultation/messages/${route.params.id}`),
  ])
  if (sRes.code === 0) session.value = sRes.data as unknown as ConsultationSession
  if (mRes.code === 0) messages.value = mRes.data as unknown as ConsultationMessage[]
  scrollToBottom()
})

function scrollToBottom() {
  nextTick(() => {
    if (chatBody.value) chatBody.value.scrollTop = chatBody.value.scrollHeight
  })
}

async function handleSend() {
  if (!inputText.value.trim() || sending.value) return
  sending.value = true
  const res = await post<ConsultationMessage>('/consultation/messages', {
    sessionId: route.params.id,
    content: inputText.value,
    type: 'text',
    senderId: auth.user?.id,
    senderName: auth.user?.name,
    senderRole: 'patient',
  })
  if (res.code === 0) {
    messages.value.push(res.data as unknown as ConsultationMessage)
    inputText.value = ''
    scrollToBottom()
  }
  sending.value = false
}

async function handleCloseSession() {
  const res = await post('/consultation/close', { sessionId: route.params.id })
  if (res.code === 0) {
    showToast('咨询已结束')
    router.back()
  }
}
</script>

<template>
  <div class="chat-page">
    <van-nav-bar :title="session?.doctorName || '咨询'" left-arrow @click-left="router.back()">
      <template #right>
        <van-icon name="ellipsis" @click="handleCloseSession" />
      </template>
    </van-nav-bar>

    <!-- 消息列表 -->
    <div class="chat-body" ref="chatBody">
      <div v-for="msg in messages" :key="msg.id" class="msg-item" :class="{ mine: msg.senderRole === 'patient' }">
        <div class="msg-bubble">
          <div class="msg-text">{{ msg.content }}</div>
          <div class="msg-time">{{ timeAgo(msg.createdAt) }}</div>
        </div>
      </div>
    </div>

    <!-- 输入区 -->
    <div class="input-bar">
      <van-field v-model="inputText" placeholder="输入咨询内容..." :disabled="session?.status !== 'active'" />
      <van-button type="primary" size="small" :loading="sending" @click="handleSend" :disabled="session?.status !== 'active'">
        发送
      </van-button>
    </div>
    <div v-if="session?.status !== 'active'" class="closed-hint">本咨询已结束</div>
  </div>
</template>

<style scoped>
.chat-page { display: flex; flex-direction: column; height: 100vh; background: #f5f7fa; }
.chat-body { flex: 1; overflow-y: auto; padding: 12px; }
.msg-item { margin-bottom: 12px; display: flex; }
.msg-item.mine { justify-content: flex-end; }
.msg-bubble { max-width: 80%; padding: 10px 14px; border-radius: 12px; background: #fff; }
.msg-item.mine .msg-bubble { background: #4A90D9; color: #fff; }
.msg-text { font-size: 14px; line-height: 1.5; }
.msg-time { font-size: 10px; opacity: 0.5; margin-top: 4px; text-align: right; }
.input-bar { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: #fff; border-top: 1px solid #eee; }
.closed-hint { text-align: center; padding: 6px; font-size: 12px; color: #999; background: #fff; }
</style>
