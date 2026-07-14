<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { get } from '@ylxb/shared'
import type { FollowUpPlan, FollowUpTask } from '@ylxb/shared'

const route = useRoute()
const router = useRouter()
const planId = route.params.id as string

const plan = ref<FollowUpPlan | null>(null)
const tasks = ref<FollowUpTask[]>([])
const loading = ref(true)

onMounted(async () => {
  const [planRes, taskRes] = await Promise.all([
    get<FollowUpPlan>('/doctor/follow-ups/' + planId),
    get<FollowUpTask[]>('/doctor/follow-up-tasks/' + planId),
  ])
  if (planRes.code === 0) {
    plan.value = planRes.data as unknown as FollowUpPlan
  }
  if (taskRes.code === 0) {
    tasks.value = (taskRes.data as unknown as FollowUpTask[]) || []
  }
  loading.value = false
})

const statusLabels: Record<string, string> = {
  pending: '待完成',
  completed: '已完成',
  missed: '已错过',
}

const typeLabels: Record<string, string> = {
  vital_sign: '体征测量',
  medication: '用药确认',
  feeling: '体感记录',
  questionnaire: '问卷填写',
  custom: '自定义',
}
</script>

<template>
  <div class="follow-up-detail-page">
    <van-nav-bar title="随访详情" left-arrow @click-left="router.back()" />

    <van-loading v-if="loading" type="spinner" class="loading" />

    <template v-if="plan && !loading">
      <!-- 计划信息 -->
      <div class="plan-info-card">
        <div class="plan-title">{{ plan.title }}</div>
        <div class="plan-desc" v-if="plan.description">{{ plan.description }}</div>
        <div class="plan-meta-row">
          <span>患者：{{ plan.patientName }}</span>
          <span>{{ plan.startDate }} ~ {{ plan.endDate }}</span>
        </div>
        <div class="plan-meta-row">
          <van-progress
            :percentage="plan.totalTasks > 0 ? Math.round((plan.completedTasks / plan.totalTasks) * 100) : 0"
            :color="'#4A90D9'"
            stroke-width="8"
          />
        </div>
        <div class="plan-stats">
          <span>完成 {{ plan.completedTasks }}/{{ plan.totalTasks }} 次任务</span>
        </div>
      </div>

      <!-- 任务列表 -->
      <div class="task-section">
        <h3 class="section-title">随访任务</h3>
        <div v-for="task in tasks" :key="task.id" class="task-card">
          <div class="task-header">
            <span class="task-title">{{ task.title }}</span>
            <van-tag
              :type="(task.status === 'completed' ? 'success' : task.status === 'missed' ? 'danger' : 'warning') as any"
              size="medium"
            >
              {{ statusLabels[task.status] || task.status }}
            </van-tag>
          </div>
          <div class="task-desc" v-if="task.description">{{ task.description }}</div>
          <div class="task-meta">
            <van-tag type="primary" size="medium">{{ typeLabels[task.type] || task.type }}</van-tag>
            <span class="task-time">安排于 {{ task.scheduledAt?.slice(0, 16) || '' }}</span>
          </div>
          <div v-if="task.status === 'completed' && task.completedAt" class="task-completed">
            完成于 {{ task.completedAt.slice(0, 16) }}
          </div>
          <div v-if="task.result" class="task-result">
            <div v-if="task.result.vitalSigns" class="result-vitals">
              <span v-for="(val, key) in task.result.vitalSigns" :key="key" class="vital-item">
                {{ key }}: {{ val }}
              </span>
            </div>
            <div v-if="task.result.feeling" class="result-feeling">体感：{{ task.result.feeling }}</div>
            <div v-if="task.result.symptoms && task.result.symptoms.length" class="result-symptoms">
              症状：{{ task.result.symptoms.join('、') }}
            </div>
            <div v-if="task.result.note" class="result-note">备注：{{ task.result.note }}</div>
          </div>
        </div>
        <van-empty v-if="tasks.length === 0" description="暂无任务记录" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.follow-up-detail-page { min-height: 100vh; background: #f5f7fa; padding-bottom: 20px; }
.loading { display: flex; justify-content: center; padding: 40px 0; }
.plan-info-card { background: linear-gradient(135deg, #4A90D9, #6BB5FF); color: #fff; margin: 12px; border-radius: 12px; padding: 20px; }
.plan-title { font-size: 18px; font-weight: 600; }
.plan-desc { font-size: 13px; opacity: 0.9; margin-top: 8px; line-height: 1.5; }
.plan-meta-row { font-size: 13px; margin-top: 10px; display: flex; gap: 16px; opacity: 0.9; }
.plan-stats { font-size: 13px; margin-top: 8px; opacity: 0.9; }
.task-section { padding: 0 12px; }
.section-title { font-size: 16px; font-weight: 600; margin-bottom: 10px; }
.task-card { background: #fff; border-radius: 10px; padding: 14px; margin-bottom: 10px; }
.task-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.task-title { font-size: 15px; font-weight: 500; }
.task-desc { font-size: 13px; color: #666; margin-bottom: 8px; line-height: 1.5; }
.task-meta { display: flex; align-items: center; gap: 8px; }
.task-time { font-size: 11px; color: #bbb; }
.task-completed { font-size: 12px; color: #52C41A; margin-top: 6px; }
.task-result { background: #f5f7fa; border-radius: 8px; padding: 10px; margin-top: 8px; font-size: 12px; color: #666; }
.result-vitals { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 4px; }
.vital-item { background: #fff; padding: 2px 8px; border-radius: 4px; }
.result-feeling, .result-symptoms, .result-note { margin-top: 4px; line-height: 1.4; }
</style>
