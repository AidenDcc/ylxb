<template>
  <div class="page-container">
    <div class="page-header">
      <h2>咨询记录审核</h2>
    </div>

    <div class="filter-bar">
      <el-select v-model="statusFilter" placeholder="状态筛选" clearable>
        <el-option label="全部" value="" />
        <el-option label="进行中" value="active" />
        <el-option label="已结束" value="closed" />
        <el-option label="已评价" value="rated" />
      </el-select>
      <el-input v-model="searchText" placeholder="搜索患者/医生名称" clearable />
    </div>

    <div class="table-card">
      <el-table :data="filteredSessions" border stripe v-loading="loading" style="width: 100%">
        <el-table-column label="患者" width="120">
          <template #default="{ row }">
            <div style="display: flex; align-items: center; gap: 6px">
              <span>{{ row.patientAvatar }}</span>
              <span>{{ row.patientName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="医生" width="120">
          <template #default="{ row }">
            <div style="display: flex; align-items: center; gap: 6px">
              <span>{{ row.doctorAvatar }}</span>
              <span>{{ row.doctorName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="doctorTitle" label="职称" width="100" />
        <el-table-column prop="doctorDepartment" label="科室" width="120" />
        <el-table-column prop="subject" label="咨询主题" min-width="160" show-overflow-tooltip />
        <el-table-column prop="tenantName" label="所属租户" width="120" />
        <el-table-column prop="lastMessage" label="最后消息" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="statusTag(row.status)" size="small">
              {{ statusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="rating" label="评分" width="70" align="center">
          <template #default="{ row }">
            <span v-if="row.rating">
              <span style="color: #FA8C16">{{ '★'.repeat(row.rating) }}</span>
              {{ '☆'.repeat(5 - row.rating) }}
            </span>
            <span v-else style="color: #909399">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="170">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { get, formatDate as sharedFormatDate } from '@ylxb/shared'
import { ElMessage } from 'element-plus'
import type { ConsultationSession } from '@ylxb/shared'

const sessions = ref<ConsultationSession[]>([])
const loading = ref(false)
const searchText = ref('')
const statusFilter = ref('')

const filteredSessions = computed(() => {
  return sessions.value.filter((s) => {
    if (searchText.value) {
      const kw = searchText.value.toLowerCase()
      if (!s.patientName.includes(kw) && !s.doctorName.includes(kw) && !s.subject.includes(kw))
        return false
    }
    if (statusFilter.value && s.status !== statusFilter.value) return false
    return true
  })
})

function statusLabel(status: string): string {
  const map: Record<string, string> = { active: '进行中', closed: '已结束', rated: '已评价' }
  return map[status] || status
}

function statusTag(status: string): 'success' | 'primary' | 'warning' | 'info' | 'danger' {
  const map: Record<string, string> = { active: 'success', closed: 'info', rated: 'warning' }
  return (map[status] || 'info') as 'success' | 'primary' | 'warning' | 'info' | 'danger'
}

function formatDate(dateStr: string): string {
  return sharedFormatDate(dateStr, 'YYYY-MM-DD HH:mm') || dateStr
}

async function fetchSessions() {
  loading.value = true
  const res = await get<ConsultationSession[]>('/consultation/sessions')
  loading.value = false
  if (res.code === 0) {
    sessions.value = res.data
  } else {
    ElMessage.error('获取数据失败')
  }
}

onMounted(() => {
  fetchSessions()
})
</script>

<style scoped>
</style>
