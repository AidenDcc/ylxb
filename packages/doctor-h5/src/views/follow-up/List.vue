<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { get } from '@ylxb/shared'
import type { FollowUpPlan } from '@ylxb/shared'
import { showToast } from 'vant'

const router = useRouter()
const plans = ref<FollowUpPlan[]>([])
const loading = ref(true)

onMounted(async () => {
  const res = await get<FollowUpPlan[]>('/doctor/follow-ups')
  if (res.code === 0) {
    plans.value = (res.data as unknown as FollowUpPlan[]) || []
  }
  loading.value = false
})

function goDetail(id: string) {
  router.push('/follow-up/detail/' + id)
}

function goCreate() {
  router.push('/follow-up/create')
}

const statusLabels: Record<string, string> = {
  active: '进行中',
  paused: '已暂停',
  completed: '已完成',
}

const statusColors: Record<string, string> = {
  active: 'success',
  paused: 'warning',
  completed: 'default',
}

const frequencyLabels: Record<string, string> = {
  daily: '每天',
  weekly: '每周',
  biweekly: '每两周',
  monthly: '每月',
  custom: '自定义',
}
</script>

<template>
  <div class="follow-up-list-page">
    <van-nav-bar title="随访计划" right-text="新建" @click-right="goCreate" />

    <van-list v-model:loading="loading" :finished="true" finished-text="没有更多了">
      <div
        v-for="plan in plans"
        :key="plan.id"
        class="plan-card"
        @click="goDetail(plan.id)"
      >
        <div class="card-header">
          <span class="plan-title">{{ plan.title }}</span>
          <van-tag :type="statusColors[plan.status] as any" size="medium">
            {{ statusLabels[plan.status] || plan.status }}
          </van-tag>
        </div>
        <div class="plan-meta">
          <span>{{ plan.patientName }}</span>
          <span>{{ frequencyLabels[plan.frequency] || plan.frequency }}</span>
          <span>{{ plan.startDate }} ~ {{ plan.endDate }}</span>
        </div>
        <div class="plan-desc" v-if="plan.description">{{ plan.description }}</div>
        <div class="plan-progress">
          <van-progress
            :percentage="plan.totalTasks > 0 ? Math.round((plan.completedTasks / plan.totalTasks) * 100) : 0"
            :color="'#4A90D9'"
            stroke-width="6"
          />
          <span class="progress-text">{{ plan.completedTasks }}/{{ plan.totalTasks }} 已完成</span>
        </div>
      </div>
    </van-list>

    <van-empty v-if="!loading && plans.length === 0" description="暂无随访计划">
      <van-button type="primary" size="small" @click="goCreate">创建随访计划</van-button>
    </van-empty>
  </div>
</template>

<style scoped>
.follow-up-list-page { min-height: 100vh; background: #f5f7fa; }
.plan-card {
  background: #fff;
  margin: 8px 12px;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
}
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.plan-title { font-size: 16px; font-weight: 600; }
.plan-meta { font-size: 12px; color: #999; display: flex; gap: 10px; margin-bottom: 6px; }
.plan-desc { font-size: 13px; color: #666; margin-bottom: 10px; line-height: 1.5; }
.plan-progress { display: flex; align-items: center; gap: 10px; }
.progress-text { font-size: 11px; color: #999; white-space: nowrap; }
</style>
