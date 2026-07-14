<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { get } from '@ylxb/shared'
import type { ConsultationSession } from '@ylxb/shared'

const router = useRouter()
const sessions = ref<ConsultationSession[]>([])
const loading = ref(true)
const activeTab = ref(0)

onMounted(async () => {
  const res = await get<ConsultationSession[]>('/doctor/consultations')
  if (res.code === 0) {
    sessions.value = (res.data as unknown as ConsultationSession[]) || []
  }
  loading.value = false
})

function goChat(id: string) {
  router.push('/consultation/chat/' + id)
}

const displayedSessions = computed(() => {
  const all = sessions.value
  if (activeTab.value === 0) return all
  if (activeTab.value === 1) return all.filter(s => s.status === 'active')
  return all.filter(s => s.status !== 'active')
})

const statusLabels: Record<string, string> = {
  active: '进行中',
  closed: '已结束',
  rated: '已评价',
}
</script>

<template>
  <div class="consult-list-page">
    <van-nav-bar title="咨询管理" />

    <van-tabs v-model:active="activeTab">
      <van-tab title="全部" />
      <van-tab title="进行中">
        <template #title>
          进行中
          <van-badge :content="sessions.filter(s => s.status === 'active').length" style="margin-left:4px" />
        </template>
      </van-tab>
      <van-tab title="已结束" />
    </van-tabs>

    <van-list v-model:loading="loading" :finished="true" finished-text="没有更多了">
      <div
        v-for="session in displayedSessions"
        :key="session.id"
        class="session-card"
        @click="goChat(session.id)"
      >
        <div class="card-top">
          <span class="patient-avatar">{{ session.patientAvatar || '👤' }}</span>
          <div class="session-info">
            <div class="session-header">
              <span class="patient-name">{{ session.patientName }}</span>
              <van-badge v-if="session.unreadDoctorCount > 0" :content="session.unreadDoctorCount" />
              <van-tag :type="session.status === 'active' ? 'success' : 'default'" size="mini" style="margin-left:6px">
                {{ statusLabels[session.status] || session.status }}
              </van-tag>
            </div>
            <div class="session-subject">{{ session.subject }}</div>
            <div class="session-msg">{{ session.lastMessage || '暂无消息' }}</div>
          </div>
        </div>
        <div class="card-bottom">
          <span class="session-time">{{ session.lastMessageAt?.slice(0, 16) || '' }}</span>
          <van-tag type="primary" size="mini">{{ session.doctorName }}</van-tag>
        </div>
      </div>
    </van-list>

    <van-empty v-if="!loading && sessions.length === 0" description="暂无咨询记录" />
  </div>
</template>

<style scoped>
.consult-list-page { min-height: 100vh; background: #f5f7fa; }
.session-card {
  background: #fff;
  margin: 8px 12px;
  border-radius: 12px;
  padding: 14px;
  cursor: pointer;
}
.card-top { display: flex; gap: 10px; }
.patient-avatar { font-size: 36px; flex-shrink: 0; }
.session-info { flex: 1; min-width: 0; }
.session-header { display: flex; align-items: center; gap: 6px; }
.patient-name { font-size: 16px; font-weight: 500; }
.session-subject { font-size: 13px; color: #4A90D9; margin-top: 4px; }
.session-msg { font-size: 13px; color: #666; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.card-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
.session-time { font-size: 11px; color: #bbb; }
</style>
