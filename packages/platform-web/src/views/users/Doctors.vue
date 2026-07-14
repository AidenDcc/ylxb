<template>
  <div class="page-container">
    <div class="page-header">
      <h2>医生总览</h2>
      <span style="font-size: 13px; color: #909399">共 {{ filteredDoctors.length }} 名医生</span>
    </div>

    <div class="filter-bar">
      <el-input v-model="searchText" placeholder="搜索医生姓名/科室" clearable />
      <span style="flex: 1; min-width: 0"></span>
    </div>

    <div class="table-card">
      <el-table :data="filteredDoctors" border stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="姓名" width="100">
          <template #default="{ row }">
            <div style="display: flex; align-items: center; gap: 8px">
              <span style="font-size: 20px">{{ row.avatar }}</span>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="title" label="职称" width="120" />
        <el-table-column prop="department" label="科室" width="130" />
        <el-table-column prop="hospital" label="所属医院" min-width="160" />
        <el-table-column label="绑定租户" min-width="160">
          <template #default="{ row }">
            <el-tag
              v-for="binding in row.tenantBindings"
              :key="binding.tenantId"
              size="small"
              style="margin-right: 4px; margin-bottom: 2px"
            >
              {{ binding.tenantName }}
            </el-tag>
            <span v-if="!row.tenantBindings?.length" style="color: #909399">未绑定</span>
          </template>
        </el-table-column>
        <el-table-column prop="consultationCount" label="咨询量" width="90" align="center" sortable />
        <el-table-column prop="verificationStatus" label="实名认证" width="100">
          <template #default="{ row }">
            <el-tag :type="verifyTag(row.verificationStatus)" size="small">
              {{ verifyLabel(row.verificationStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="120">
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
import type { Doctor } from '@ylxb/shared'

const doctors = ref<Doctor[]>([])
const loading = ref(false)
const searchText = ref('')

const filteredDoctors = computed(() => {
  if (!searchText.value) return doctors.value
  const keyword = searchText.value.toLowerCase()
  return doctors.value.filter(
    (d) =>
      d.name.includes(keyword) ||
      d.department.includes(keyword) ||
      d.hospital.includes(keyword)
  )
})

function verifyLabel(status: string): string {
  const map: Record<string, string> = { verified: '已认证', pending: '审核中', unverified: '未认证', rejected: '已驳回' }
  return map[status] || status
}

function verifyTag(status: string): 'success' | 'primary' | 'warning' | 'info' | 'danger' {
  const map: Record<string, string> = { verified: 'success', pending: 'warning', unverified: 'info', rejected: 'danger' }
  return (map[status] || 'info') as 'success' | 'primary' | 'warning' | 'info' | 'danger'
}

function formatDate(dateStr: string): string {
  return sharedFormatDate(dateStr, 'YYYY-MM-DD') || dateStr
}

async function fetchDoctors() {
  loading.value = true
  const res = await get<Doctor[]>('/platform/users/doctors')
  loading.value = false
  if (res.code === 0) {
    doctors.value = res.data
  } else {
    ElMessage.error('获取数据失败')
  }
}

onMounted(() => {
  fetchDoctors()
})
</script>

<style scoped>
</style>
