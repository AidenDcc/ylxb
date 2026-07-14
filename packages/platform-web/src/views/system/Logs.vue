<template>
  <div class="page-container">
    <div class="page-header">
      <h2>操作日志</h2>
    </div>

    <div class="filter-bar">
      <el-input v-model="searchText" placeholder="搜索操作人/操作内容" clearable />
      <span style="flex: 1; min-width: 0"></span>
    </div>

    <div class="table-card">
      <el-table :data="filteredLogs" border stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="userName" label="操作人" width="140" />
        <el-table-column prop="userId" label="用户ID" width="140" show-overflow-tooltip />
        <el-table-column prop="action" label="操作内容" min-width="200" />
        <el-table-column prop="target" label="操作对象" min-width="180" />
        <el-table-column label="所属租户" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.tenantId" size="small" type="info">
              {{ row.tenantId }}
            </el-tag>
            <span v-else style="color: #909399">平台</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="操作时间" width="180">
          <template #default="{ row }">
            {{ row.createdAt }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="!loading" style="margin-top: 16px; color: #909399; font-size: 13px">
      共 {{ filteredLogs.length }} 条操作记录
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { get } from '@ylxb/shared'
import { ElMessage } from 'element-plus'

interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  target: string
  tenantId?: string
  createdAt: string
}

const logs = ref<AuditLog[]>([])
const loading = ref(false)
const searchText = ref('')

const filteredLogs = computed(() => {
  if (!searchText.value) return logs.value
  const kw = searchText.value.toLowerCase()
  return logs.value.filter(
    (l) =>
      l.userName.toLowerCase().includes(kw) ||
      l.action.toLowerCase().includes(kw) ||
      l.target.toLowerCase().includes(kw)
  )
})

async function fetchLogs() {
  loading.value = true
  const res = await get<AuditLog[]>('/platform/audit-logs')
  loading.value = false
  if (res.code === 0) {
    logs.value = res.data
  } else {
    ElMessage.error('获取日志失败')
  }
}

onMounted(() => {
  fetchLogs()
})
</script>

<style scoped>
</style>
