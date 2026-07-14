<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { get } from '@ylxb/shared'
import type { ConsultationSession, FollowUpPlan } from '@ylxb/shared'

const router = useRouter()
const auth = useAuthStore()

const pendingConsultations = ref<ConsultationSession[]>([])
const abnormalPatients = ref(0)
const todayFollowUpTasks = ref(0)
const recentConsultations = ref<ConsultationSession[]>([])
const loading = ref(true)

onMounted(async () => {
  const [consultRes, followUpRes, patientRes] = await Promise.all([
    get<ConsultationSession[]>('/doctor/consultations'),
    get<FollowUpPlan[]>('/doctor/follow-ups'),
    get('/doctor/patients'),
  ])

  if (consultRes.code === 0) {
    const sessions = (consultRes.data as unknown as ConsultationSession[]) || []
    pendingConsultations.value = sessions.filter(s => s.status === 'active' && s.unreadDoctorCount > 0)
    recentConsultations.value = sessions.filter(s => s.status === 'active').slice(0, 3)
  }

  if (followUpRes.code === 0) {
    const plans = (followUpRes.data as unknown as FollowUpPlan[]) || []
    todayFollowUpTasks.value = plans.reduce((sum, p) => sum + (p.totalTasks - p.completedTasks), 0)
  }

  if (patientRes.code === 0) {
    const patients = (patientRes.data as unknown as any[]) || []
    abnormalPatients.value = patients.filter((p: any) => p.medicalHistory && p.medicalHistory.length > 0).length
  }

  loading.value = false
})

const quickActions = [
  { label: '患者列表', icon: '👥', path: '/patients/list' },
  { label: '咨询回复', icon: '💬', path: '/consultation/list' },
  { label: '创建随访', icon: '📋', path: '/follow-up/create' },
  { label: '助理管理', icon: '🛠️', path: '/assistants/list' },
]
</script>

<template>
  <div class="home-page">
    <!-- 欢迎栏 -->
    <div class="welcome-bar">
      <div class="user-info">
        <span class="avatar">{{ auth.user?.avatar || '👨‍⚕️' }}</span>
        <div>
          <div class="greeting">{{ auth.user?.name || '医生' }}，你好</div>
          <div class="subtitle">{{ auth.user?.title || '' }} · {{ auth.user?.department || '' }}</div>
        </div>
      </div>
    </div>

    <!-- 数据统计卡片 -->
    <div class="stats-row">
      <div class="stat-card stat-orange" @click="router.push('/consultation/list')">
        <div class="stat-value">{{ pendingConsultations.length }}</div>
        <div class="stat-label">待回复咨询</div>
      </div>
      <div class="stat-card stat-red" @click="router.push('/patients/list')">
        <div class="stat-value">{{ abnormalPatients }}</div>
        <div class="stat-label">异常体征患者</div>
      </div>
      <div class="stat-card stat-blue" @click="router.push('/follow-up/list')">
        <div class="stat-value">{{ todayFollowUpTasks }}</div>
        <div class="stat-label">今日随访任务</div>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="quick-actions">
      <div v-for="a in quickActions" :key="a.path" class="action-item" @click="router.push(a.path)">
        <span class="action-icon">{{ a.icon }}</span>
        <span class="action-label">{{ a.label }}</span>
      </div>
    </div>

    <!-- 最近待回复咨询 -->
    <div class="section">
      <div class="section-header">
        <h3>待回复咨询</h3>
        <span class="more" @click="router.push('/consultation/list')">查看全部 →</span>
      </div>
      <div class="consult-list">
        <div
          v-for="c in recentConsultations"
          :key="c.id"
          class="consult-item"
          @click="router.push('/consultation/chat/' + c.id)"
        >
          <div class="consult-top">
            <span class="patient-name">{{ c.patientName }}</span>
            <van-tag type="primary" size="medium">{{ c.subject }}</van-tag>
            <van-badge v-if="c.unreadDoctorCount > 0" :content="c.unreadDoctorCount" />
          </div>
          <div class="consult-msg">{{ c.lastMessage || '暂无消息' }}</div>
          <div class="consult-time">{{ c.lastMessageAt?.slice(0, 16) || '' }}</div>
        </div>
        <div v-if="!loading && recentConsultations.length === 0" class="empty-consult">
          <van-empty description="暂无待回复咨询" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page { padding: 0 16px 16px; }
.welcome-bar { background: linear-gradient(135deg, #4A90D9, #6BB5FF); color: #fff; border-radius: 12px; padding: 20px; margin: 16px 0; }
.user-info { display: flex; align-items: center; gap: 12px; }
.avatar { font-size: 40px; }
.greeting { font-size: 18px; font-weight: 600; }
.subtitle { font-size: 13px; opacity: 0.85; margin-top: 4px; }

.stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px; }
.stat-card { border-radius: 12px; padding: 14px 8px; text-align: center; cursor: pointer; }
.stat-card.stat-orange { background: #fff7e6; }
.stat-card.stat-red { background: #fff2f0; }
.stat-card.stat-blue { background: #e6f7ff; }
.stat-value { font-size: 28px; font-weight: 700; }
.stat-card.stat-orange .stat-value { color: #fa8c16; }
.stat-card.stat-red .stat-value { color: #f5222d; }
.stat-card.stat-blue .stat-value { color: #1890ff; }
.stat-label { font-size: 11px; color: #666; margin-top: 4px; }

.quick-actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
.action-item { background: #fff; border-radius: 12px; padding: 16px 8px; text-align: center; cursor: pointer; }
.action-icon { font-size: 28px; display: block; margin-bottom: 6px; }
.action-label { font-size: 12px; color: #666; }

.section { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.section-header h3 { font-size: 16px; font-weight: 600; }
.more { font-size: 12px; color: var(--primary); cursor: pointer; }

.consult-item { padding: 12px 0; border-bottom: 1px solid #f5f5f5; cursor: pointer; }
.consult-item:last-child { border-bottom: none; }
.consult-top { display: flex; align-items: center; gap: 8px; }
.patient-name { font-size: 15px; font-weight: 500; }
.consult-msg { font-size: 13px; color: #666; margin-top: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.consult-time { font-size: 11px; color: #bbb; margin-top: 4px; }
.empty-consult { padding: 20px 0; }
</style>
