<template>
  <div class="page-container">
    <div class="page-header">
      <h2>随访数据概览</h2>
    </div>

    <!-- Stat cards -->
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-label">随访计划总数</div>
        <div class="stat-value">{{ plans.length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">进行中</div>
        <div class="stat-value">{{ activeCount }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">已完成任务</div>
        <div class="stat-value">{{ completedTaskCount }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">总任务数</div>
        <div class="stat-value">{{ totalTaskCount }}</div>
      </div>
    </div>

    <el-card>
      <el-table :data="plans" stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="title" label="随访计划" min-width="200" show-overflow-tooltip />
        <el-table-column prop="patientName" label="患者" min-width="100" />
        <el-table-column prop="doctorId" label="负责医生" min-width="120">
          <template #default="{ row }">
            {{ row.doctorId === 'd1' ? '陈主任' : row.doctorId === 'd2' ? '刘医生' : row.doctorId }}
          </template>
        </el-table-column>
        <el-table-column prop="frequency" label="频率" min-width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ frequencyLabel(row.frequency) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : row.status === 'paused' ? 'warning' : 'info'" size="small">
              {{ row.status === 'active' ? '进行中' : row.status === 'paused' ? '已暂停' : '已完成' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="进度" min-width="160">
          <template #default="{ row }">
            <div class="progress-cell">
              <el-progress
                :percentage="row.totalTasks > 0 ? Math.round((row.completedTasks / row.totalTasks) * 100) : 0"
                :stroke-width="8"
              />
              <span class="progress-text">{{ row.completedTasks }}/{{ row.totalTasks }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="开始日期" min-width="120" />
        <el-table-column prop="endDate" label="结束日期" min-width="120" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { get } from '@ylxb/shared'
import type { FollowUpPlan } from '@ylxb/shared'

const plans = ref<FollowUpPlan[]>([])
const loading = ref(false)

const activeCount = computed(() => plans.value.filter((p) => p.status === 'active').length)
const totalTaskCount = computed(() => plans.value.reduce((sum, p) => sum + p.totalTasks, 0))
const completedTaskCount = computed(() => plans.value.reduce((sum, p) => sum + p.completedTasks, 0))

function frequencyLabel(freq: string): string {
  const map: Record<string, string> = {
    daily: '每日',
    weekly: '每周',
    biweekly: '每两周',
    monthly: '每月',
    custom: '自定义',
  }
  return map[freq] || freq
}

async function fetchPlans() {
  loading.value = true
  try {
    const res = await get<FollowUpPlan[]>('/doctor/follow-ups')
    if (res.code === 0) {
      plans.value = res.data
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPlans()
})
</script>

<style scoped>
.progress-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-cell .el-progress {
  flex: 1;
}

.progress-text {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
}
</style>
