<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { get } from '@ylxb/shared'
import type { VitalSign, MedicationReminder, ConsultationSession } from '@ylxb/shared'
import { VitalSignLabels } from '@ylxb/shared'
import { timeAgo } from '@ylxb/shared'
import * as Icons from '@images'

const router = useRouter()
const auth = useAuthStore()
const vitalSigns = ref<VitalSign[]>([])
const reminders = ref<MedicationReminder[]>([])
const sessions = ref<ConsultationSession[]>([])
const loading = ref(true)

// 今日日期和星期
const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
const today = new Date()
const todayStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
const weekDayStr = weekDays[today.getDay()]

// 欢迎语（根据时段）
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了，注意休息'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

// 关键监测指标（收缩压、舒张压、血糖、心率）
const keyIndicators = computed(() => {
  const types = ['blood_pressure_systolic', 'blood_pressure_diastolic', 'blood_sugar', 'heart_rate']
  return types.map(type => vitalSigns.value.find(v => v.type === type)).filter(Boolean) as VitalSign[]
})

// 咨询动态：有未读消息的活跃会话
const consultationUpdates = computed(() => {
  return sessions.value
    .filter(s => s.status === 'active' && s.unreadPatientCount > 0)
    .slice(0, 3)
})

// 已启用的用药提醒
const activeReminders = computed(() => {
  return reminders.value.filter(r => r.enabled).slice(0, 3)
})

// 快捷入口
const quickActions = [
  { label: '健康档案', icon: Icons.健康档案1, path: '/health/records' },
  { label: '健康指标', icon: Icons.体征心率, path: '/health/vital-signs' },
  { label: '咨询医生', icon: Icons.药师咨询, path: '/consultation/doctors' },
  { label: '症状登记', icon: Icons.身体症状, path: '/health/records' },
]

onMounted(async () => {
  const [vsRes, rmRes, csRes] = await Promise.all([
    get<VitalSign[]>('/health/vital-signs/latest'),
    get<MedicationReminder[]>('/health/reminders'),
    get<ConsultationSession[]>('/consultation/sessions'),
  ])
  if (vsRes.code === 0) vitalSigns.value = (vsRes.data as unknown as VitalSign[]).slice(0, 6)
  if (rmRes.code === 0) reminders.value = rmRes.data as unknown as MedicationReminder[]
  if (csRes.code === 0) sessions.value = csRes.data as unknown as ConsultationSession[]
  loading.value = false
})
</script>

<template>
  <div class="home-page">
    <!-- 用户头部 -->
    <div class="user-header">
      <div class="header-top">
        <span class="avatar-circle"><van-icon name="contact-o" size="24" color="#fff" /></span>
        <div class="header-info">
          <div class="nickname">{{ auth.user?.name || '用户1234' }}</div>
          <div class="greeting-msg">{{ greeting }}</div>
        </div>
        <div class="header-date">
          <span class="date-text">{{ todayStr }}</span>
          <span class="weekday-text">{{ weekDayStr }}</span>
        </div>
      </div>
    </div>

    <!-- 监测指标 -->
    <div class="section">
      <div class="section-header">
        <h3>监测指标</h3>
        <span class="more" @click="router.push('/health/vital-signs')">全部 →</span>
      </div>
      <div class="indicator-grid">
        <div v-for="vs in keyIndicators" :key="vs.id" class="indicator-card" :class="{ abnormal: vs.isAbnormal }">
          <div class="indicator-value">
            <span class="value-num">{{ vs.value }}</span>
            <span class="value-unit">{{ vs.unit }}</span>
          </div>
          <div class="indicator-label">{{ VitalSignLabels[vs.type] || vs.type }}</div>
          <div v-if="vs.isAbnormal" class="abnormal-tag">异常</div>
        </div>
        <div v-if="!loading && keyIndicators.length === 0" class="empty-indicator">暂无监测数据</div>
      </div>
    </div>

    <!-- 咨询动态 -->
    <div class="section">
      <div class="section-header">
        <h3>咨询动态</h3>
        <span class="more" @click="router.push('/consultation/list')">全部 →</span>
      </div>
      <div v-if="consultationUpdates.length > 0" class="consultation-list">
        <div v-for="s in consultationUpdates" :key="s.id" class="consultation-item" @click="router.push(`/consultation/chat/${s.id}`)">
          <span class="doctor-avatar">{{ s.doctorAvatar }}</span>
          <div class="consultation-info">
            <div class="consultation-top">
              <span class="doctor-name">{{ s.doctorName }}</span>
              <span class="doctor-title">{{ s.doctorTitle }}</span>
              <span class="unread-badge" v-if="s.unreadPatientCount">{{ s.unreadPatientCount }}条新回复</span>
            </div>
            <div class="consultation-preview">{{ s.lastMessage }}</div>
            <div class="consultation-time">{{ timeAgo(s.lastMessageAt!) }}</div>
          </div>
        </div>
      </div>
      <div v-else class="empty-block">暂无新的咨询动态</div>
    </div>

    <!-- 用药提醒 -->
    <div class="section">
      <div class="section-header">
        <h3>用药提醒</h3>
        <span class="more" @click="router.push('/reminders')">管理 →</span>
      </div>
      <div v-if="activeReminders.length > 0" class="reminder-list">
        <div v-for="r in activeReminders" :key="r.id" class="reminder-item">
          <span class="reminder-icon"><van-icon name="orders-o" size="20" color="var(--primary-green)" /></span>
          <div class="reminder-info">
            <div class="reminder-name">{{ r.drugName }}</div>
            <div class="reminder-detail">{{ r.dosage }} · {{ r.time }}</div>
          </div>
          <van-tag type="success" size="medium" round>提醒中</van-tag>
        </div>
      </div>
      <div v-else class="empty-block">暂无用药提醒</div>
    </div>

    <!-- 快捷入口 -->
    <div class="section">
      <div class="section-header">
        <h3>快捷入口</h3>
      </div>
      <div class="quick-actions">
        <div v-for="a in quickActions" :key="a.path" class="action-item" @click="router.push(a.path)">
          <img :src="a.icon" :alt="a.label" class="action-icon" />
          <span class="action-label">{{ a.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page { padding: 0 16px 16px; }

/* 用户头部 */
.user-header {
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-blue-light));
  color: #fff;
  border-radius: var(--radius-lg);
  padding: 20px;
  margin: 16px 0;
  box-shadow: var(--shadow-md);
}
.header-top { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.avatar-circle {
  width: 44px; height: 44px; border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.header-info { flex: 1; }
.nickname { font-size: 20px; font-weight: 700; }
.greeting-msg { font-size: 14px; opacity: 0.85; margin-top: 4px; }
.header-date { display: flex; align-items: baseline; gap: 8px; padding-top: 0px; }
.date-text { font-size: 15px; opacity: 0.9; }
.weekday-text { font-size: 14px; opacity: 0.7; }

/* 通用 section */
.section { background: #fff; border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px; box-shadow: var(--shadow-sm); }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.section-header h3 { font-size: 16px; font-weight: 600; color: var(--text-primary); }
.more { font-size: 14px; color: var(--primary-blue); cursor: pointer; }

/* 监测指标 */
.indicator-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.indicator-card {
  background: var(--bg); border-radius: var(--radius-sm); padding: 12px; text-align: center;
  position: relative; box-shadow: var(--shadow-xs);
}
.indicator-card.abnormal { background: #fff2f0; }
.indicator-value { margin-bottom: 4px; }
.value-num { font-size: 24px; font-weight: 700; color: var(--text-primary); }
.indicator-card.abnormal .value-num { color: var(--danger); }
.value-unit { font-size: 14px; color: var(--text-tertiary); margin-left: 2px; }
.indicator-label { font-size: 14px; color: var(--text-secondary); }
.abnormal-tag {
  position: absolute; top: 6px; right: 6px;
  font-size: 12px; color: #fff; background: var(--danger);
  padding: 1px 6px; border-radius: var(--radius-sm);
}
.empty-indicator { grid-column: span 2; text-align: center; padding: 20px; color: var(--text-tertiary); font-size: 14px; }

/* 咨询动态 */
.consultation-list { display: flex; flex-direction: column; }
.consultation-item {
  display: flex; align-items: flex-start; gap: 12px; padding: 12px 0;
  border-bottom: 1px solid var(--border-light); cursor: pointer;
}
.consultation-item:last-child { border-bottom: none; }
.doctor-avatar { font-size: 36px; flex-shrink: 0; }
.consultation-info { flex: 1; min-width: 0; }
.consultation-top { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; flex-wrap: wrap; }
.doctor-name { font-size: 14px; font-weight: 600; color: var(--text-primary); }
.doctor-title { font-size: 14px; color: var(--text-secondary); }
.unread-badge { font-size: 14px; color: var(--danger); background: #fff2f0; padding: 1px 8px; border-radius: 10px; }
.consultation-preview { font-size: 14px; color: var(--text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 2px; }
.consultation-time { font-size: 14px; color: var(--text-tertiary); }
.empty-block { text-align: center; padding: 20px; color: var(--text-tertiary); font-size: 14px; }

/* 用药提醒 */
.reminder-list { display: flex; flex-direction: column; }
.reminder-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border-light); }
.reminder-item:last-child { border-bottom: none; }
.reminder-icon {
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(16, 185, 129, 0.12);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.reminder-info { flex: 1; }
.reminder-name { font-size: 14px; font-weight: 500; color: var(--text-primary); }
.reminder-detail { font-size: 14px; color: var(--text-secondary); margin-top: 2px; }

/* 快捷入口 */
.quick-actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.action-item { text-align: center; cursor: pointer; padding: 8px 0; }
.action-icon { width: 32px; height: 32px; display: block; margin: 0 auto 6px; }
.action-label { font-size: 14px; color: var(--text-secondary); }
</style>
