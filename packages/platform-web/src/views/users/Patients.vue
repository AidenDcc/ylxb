<template>
  <div class="page-container">
    <div class="page-header">
      <h2>患者总览</h2>
      <span style="font-size: 13px; color: #909399">共 {{ filteredPatients.length }} 名患者</span>
    </div>

    <div class="filter-bar">
      <el-input v-model="searchText" placeholder="搜索患者姓名" clearable />
      <span style="flex: 1; min-width: 0"></span>
    </div>

    <div class="table-card">
      <el-table :data="filteredPatients" border stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="姓名" width="100">
          <template #default="{ row }">
            <div style="display: flex; align-items: center; gap: 8px">
              <span style="font-size: 20px">{{ row.avatar }}</span>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="gender" label="性别" width="70">
          <template #default="{ row }">
            {{ row.gender === 'male' ? '男' : row.gender === 'female' ? '女' : '未知' }}
          </template>
        </el-table-column>
        <el-table-column prop="birthDate" label="出生日期" width="120">
          <template #default="{ row }">
            {{ row.birthDate || '-' }}
          </template>
        </el-table-column>
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
        <el-table-column label="健康史" min-width="180">
          <template #default="{ row }">
            <el-tag
              v-for="item in (row as any).medicalHistory"
              :key="item"
              size="small"
              type="warning"
              style="margin-right: 4px; margin-bottom: 2px"
            >
              {{ item }}
            </el-tag>
            <span v-if="!(row as any).medicalHistory?.length" style="color: #909399">-</span>
          </template>
        </el-table-column>
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
import type { Patient } from '@ylxb/shared'

const patients = ref<Patient[]>([])
const loading = ref(false)
const searchText = ref('')

const filteredPatients = computed(() => {
  if (!searchText.value) return patients.value
  const keyword = searchText.value.toLowerCase()
  return patients.value.filter((p) => p.name.includes(keyword))
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

async function fetchPatients() {
  loading.value = true
  const res = await get<Patient[]>('/platform/users/patients')
  loading.value = false
  if (res.code === 0) {
    patients.value = res.data
  } else {
    ElMessage.error('获取数据失败')
  }
}

onMounted(() => {
  fetchPatients()
})
</script>

<style scoped>
</style>
