<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { get } from '@ylxb/shared'
import type { VitalSign, MedicationReminder } from '@ylxb/shared'
import { VitalSignLabels, VitalSignUnits } from '@ylxb/shared'

const router = useRouter()
const auth = useAuthStore()
const vitalSigns = ref<VitalSign[]>([])
const reminders = ref<MedicationReminder[]>([])
const loading = ref(true)

onMounted(async () => {
  const [vsRes, rmRes] = await Promise.all([
    get<VitalSign[]>('/health/vital-signs/latest'),
    get<MedicationReminder[]>('/health/reminders'),
  ])
  if (vsRes.code === 0) vitalSigns.value = (vsRes.data as unknown as VitalSign[]).slice(0, 4)
  if (rmRes.code === 0) reminders.value = (rmRes.data as unknown as MedicationReminder[]).filter((r) => r.enabled)
  loading.value = false
})

const quickActions = [
  { label: '健康档案', icon: '📋', path: '/health/records' },
  { label: 'OCR上传', icon: '📸', path: '/health/ocr-upload' },
  { label: '体征数据', icon: '📊', path: '/health/vital-signs' },
  { label: '咨询医生', icon: '💬', path: '/consultation/list' },
]
</script>

<template>
  <div class="home-page">
    <!-- 欢迎栏 -->
    <div class="welcome-bar">
      <div class="user-info">
        <span class="avatar">{{ auth.user?.avatar || '👤' }}</span>
        <div>
          <div class="greeting">你好，{{ auth.user?.name || '用户' }}</div>
          <div class="subtitle">关注健康，从每一天开始</div>
        </div>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="quick-actions">
      <div v-for="a in quickActions" :key="a.path" class="action-item" @click="router.push(a.path)">
        <span class="action-icon">{{ a.icon }}</span>
        <span class="action-label">{{ a.label }}</span>
      </div>
    </div>

    <!-- 体征卡片 -->
    <div class="section">
      <div class="section-header">
        <h3>今日体征</h3>
        <span class="more" @click="router.push('/health/vital-signs')">查看更多 →</span>
      </div>
      <div class="vital-cards">
        <div v-for="vs in vitalSigns" :key="vs.id" class="vital-card" :class="{ abnormal: vs.isAbnormal }">
          <div class="vital-value">{{ vs.value }}</div>
          <div class="vital-unit">{{ vs.unit }}</div>
          <div class="vital-label">{{ VitalSignLabels[vs.type] || vs.type }}</div>
        </div>
        <div v-if="!loading && vitalSigns.length === 0" class="empty-card">暂无体征数据</div>
      </div>
    </div>

    <!-- 用药提醒 -->
    <div class="section">
      <div class="section-header">
        <h3>今日用药</h3>
        <span class="more" @click="router.push('/reminders')">管理 →</span>
      </div>
      <div class="reminder-list">
        <div v-for="r in reminders" :key="r.id" class="reminder-item">
          <span class="reminder-icon">💊</span>
          <div class="reminder-info">
            <div class="reminder-name">{{ r.drugName }}</div>
            <div class="reminder-detail">{{ r.dosage }} · {{ r.time }}</div>
          </div>
          <van-switch :model-value="r.enabled" size="20" active-color="#4A90D9" />
        </div>
        <div v-if="!loading && reminders.length === 0" class="empty-reminder">暂无用药提醒</div>
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

.quick-actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
.action-item { background: #fff; border-radius: 12px; padding: 16px 8px; text-align: center; cursor: pointer; }
.action-icon { font-size: 28px; display: block; margin-bottom: 6px; }
.action-label { font-size: 12px; color: #666; }

.section { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.section-header h3 { font-size: 16px; font-weight: 600; }
.more { font-size: 12px; color: var(--primary); cursor: pointer; }

.vital-cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.vital-card { background: #f5f7fa; border-radius: 8px; padding: 12px; text-align: center; }
.vital-card.abnormal { background: #fff2f0; }
.vital-value { font-size: 24px; font-weight: 700; color: #333; }
.vital-card.abnormal .vital-value { color: var(--danger); }
.vital-unit { font-size: 11px; color: #999; }
.vital-label { font-size: 12px; color: #666; margin-top: 4px; }
.empty-card { grid-column: span 2; text-align: center; padding: 20px; color: #ccc; font-size: 14px; }

.reminder-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f5f5f5; }
.reminder-item:last-child { border-bottom: none; }
.reminder-icon { font-size: 28px; }
.reminder-name { font-size: 14px; font-weight: 500; }
.reminder-detail { font-size: 12px; color: #999; margin-top: 2px; }
.empty-reminder { text-align: center; padding: 20px; color: #ccc; font-size: 14px; }
</style>
