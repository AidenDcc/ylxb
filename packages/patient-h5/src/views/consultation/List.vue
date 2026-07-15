<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { get } from '@ylxb/shared'
import type { ConsultationSession } from '@ylxb/shared'
import { timeAgo } from '@ylxb/shared'

const router = useRouter()
const sessions = ref<ConsultationSession[]>([])
const loading = ref(true)
const activeTab = ref(0)

const filteredSessions = computed(() => {
  const active = activeTab.value === 0
  return sessions.value.filter(s => active ? s.status === 'active' : s.status !== 'active')
})

onMounted(async () => {
  const res = await get<ConsultationSession[]>('/consultation/sessions')
  if (res.code === 0) sessions.value = res.data as unknown as ConsultationSession[]
  loading.value = false
})
</script>

<template>
  <div class="consultation-page">
    <van-nav-bar title="我的咨询" />
    <van-tabs v-model:active="activeTab">
      <van-tab title="进行中" />
      <van-tab title="已结束" />
    </van-tabs>
    <van-pull-refresh v-model="loading" @refresh="onMounted">
      <div class="session-list" v-if="sessions.length">
        <div v-for="s in filteredSessions" :key="s.id" class="session-card" @click="router.push(`/consultation/chat/${s.id}`)">
          <div class="s-header">
            <span class="doctor-avatar">{{ s.doctorAvatar }}</span>
            <div class="doctor-info">
              <div class="doctor-name">{{ s.doctorName }} <van-tag size="medium" type="primary">{{ s.doctorTitle }}</van-tag></div>
              <div class="doctor-dept">{{ s.doctorDepartment }} · {{ s.tenantName }}</div>
            </div>
            <van-badge v-if="s.unreadPatientCount" :content="s.unreadPatientCount" />
          </div>
          <div class="s-subject">{{ s.subject }}</div>
          <div class="s-footer">
            <span class="last-msg">{{ s.lastMessage?.slice(0, 40) || '' }}</span>
            <span class="time">{{ s.lastMessageAt ? timeAgo(s.lastMessageAt) : '' }}</span>
          </div>
        </div>
      </div>
      <van-empty v-else description="暂无咨询记录">
        <van-button type="primary" size="small" @click="router.push('/consultation/doctors')">去咨询医生</van-button>
      </van-empty>
    </van-pull-refresh>
  </div>
</template>


<style scoped>
.consultation-page { min-height: 100vh; background: #f5f7fa; }
.session-list { padding: 12px 16px; }
.session-card { background: #fff; border-radius: 12px; padding: 14px; margin-bottom: 10px; cursor: pointer; }
.s-header { display: flex; align-items: center; gap: 10px; }
.doctor-avatar { font-size: 36px; }
.doctor-info { flex: 1; }
.doctor-name { font-size: 15px; font-weight: 500; }
.doctor-dept { font-size: 14px; color: #999; margin-top: 2px; }
.s-subject { font-size: 14px; color: #666; margin: 8px 0; padding: 6px 10px; background: #f5f7fa; border-radius: 6px; }
.s-footer { display: flex; justify-content: space-between; font-size: 14px; color: #ccc; }
</style>
