<template>
  <div class="page-container">
    <div class="page-header">
      <h2>患者管理</h2>
    </div>

    <div class="search-bar">
      <el-input
        v-model="keyword"
        placeholder="搜索患者姓名、手机号"
        clearable
        style="width: 280px"
        @input="handleSearch"
      />
      <el-button type="primary" @click="$router.push('/patients/invite')">
        <el-icon><Plus /></el-icon>邀请患者
      </el-button>
      <el-button @click="$router.push('/patients/blacklist')">
        <el-icon><WarningFilled /></el-icon>黑名单
      </el-button>
    </div>

    <el-card>
      <el-table :data="filteredPatients" stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="姓名" min-width="100" />
        <el-table-column prop="phone" label="手机号" min-width="130" />
        <el-table-column prop="gender" label="性别" min-width="80">
          <template #default="{ row }">
            {{ row.gender === 'male' ? '男' : row.gender === 'female' ? '女' : '未知' }}
          </template>
        </el-table-column>
        <el-table-column prop="birthDate" label="出生日期" min-width="120">
          <template #default="{ row }">
            {{ row.birthDate || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="realNameVerified" label="认证状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.realNameVerified ? 'success' : 'warning'" size="small">
              {{ row.realNameVerified ? '已认证' : '未认证' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="慢病标签" min-width="180">
          <template #default="{ row }">
            <el-tag
              v-for="tag in (row.medicalHistory || [])"
              :key="tag"
              size="small"
              type="info"
              style="margin-right: 6px"
            >
              {{ tag }}
            </el-tag>
            <span v-if="!row.medicalHistory?.length">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="添加时间" min-width="120">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="140" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small">详情</el-button>
            <el-button type="danger" link size="small" @click="handleBlacklist(row)">
              拉黑
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无患者数据" />
        </template>
      </el-table>

      <el-pagination
        v-model:current-page="page"
        :page-size="pageSize"
        :total="filteredPatients.length"
        layout="total, prev, pager, next"
        background
        small
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, WarningFilled } from '@element-plus/icons-vue'
import { get, post } from '@ylxb/shared'
import { formatDate } from '@ylxb/shared'
import type { Patient } from '@ylxb/shared'

const patients = ref<Patient[]>([])
const loading = ref(false)
const keyword = ref('')
const page = ref(1)
const pageSize = ref(20)

const filteredPatients = computed(() => {
  if (!keyword.value) return patients.value
  const kw = keyword.value.toLowerCase()
  return patients.value.filter(
    (p) => p.name.includes(kw) || p.phone.includes(kw)
  )
})

function handleSearch() {
  page.value = 1
}

function formatTime(str?: string): string {
  if (!str) return '-'
  return formatDate(str, 'YYYY-MM-DD')
}

async function fetchPatients() {
  loading.value = true
  try {
    const res = await get<Patient[]>('/management/patients')
    if (res.code === 0) {
      patients.value = res.data
    }
  } finally {
    loading.value = false
  }
}

async function handleBlacklist(row: Patient) {
  try {
    await ElMessageBox.confirm(`确定要将患者「${row.name}」加入黑名单吗？加入后该患者将无法使用当前机构服务。`, '拉黑确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    const res = await post<{ blacklisted: boolean }>(`/management/patients/${row.id}/blacklist`)
    if (res.code === 0) {
      ElMessage.success('已加入黑名单')
      patients.value = patients.value.filter((p) => p.id !== row.id)
    }
  } catch {
    // cancelled
  }
}

onMounted(() => {
  fetchPatients()
})
</script>
