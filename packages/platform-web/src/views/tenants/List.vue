<template>
  <div class="page-container">
    <div class="page-header">
      <h2>租户列表</h2>
    </div>

    <div class="filter-bar">
      <el-input v-model="searchText" placeholder="搜索机构名称" clearable @input="filterTenants" />
      <el-select v-model="statusFilter" placeholder="状态筛选" clearable @change="filterTenants">
        <el-option label="全部" value="" />
        <el-option label="启用" value="active" />
        <el-option label="禁用" value="disabled" />
        <el-option label="待审核" value="pending" />
      </el-select>
      <el-select v-model="typeFilter" placeholder="类型筛选" clearable @change="filterTenants">
        <el-option label="全部" value="" />
        <el-option label="医院" value="hospital" />
        <el-option label="药房" value="pharmacy" />
        <el-option label="诊所" value="clinic" />
      </el-select>
    </div>

    <div class="table-card">
      <el-table :data="filteredTenants" border stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="机构名称" min-width="160" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="typeTag(row.type)" size="small">
              {{ typeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="contactPerson" label="联系人" width="100" />
        <el-table-column prop="contactPhone" label="联系电话" width="130" />
        <el-table-column prop="address" label="地址" min-width="180" show-overflow-tooltip />
        <el-table-column prop="doctorCount" label="医生数" width="80" align="center" />
        <el-table-column prop="patientCount" label="患者数" width="80" align="center" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="statusTag(row.status)" size="small">
              {{ statusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="入驻时间" width="120">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="viewDetail(row.id)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { get, formatDate as sharedFormatDate } from '@ylxb/shared'
import { ElMessage } from 'element-plus'
import type { Tenant, TenantType } from '@ylxb/shared'

const router = useRouter()
const tenants = ref<Tenant[]>([])
const loading = ref(false)
const searchText = ref('')
const statusFilter = ref('')
const typeFilter = ref('')

const typeLabels: Record<TenantType, string> = {
  hospital: '医院',
  pharmacy: '药房',
  clinic: '诊所',
}

const typeTags: Record<TenantType, string> = {
  hospital: '',
  pharmacy: 'warning',
  clinic: 'success',
}

function typeLabel(type: TenantType): string {
  return typeLabels[type] || type
}

function typeTag(type: TenantType): string {
  return typeTags[type] || 'info'
}

function statusLabel(status: string): string {
  const map: Record<string, string> = { active: '启用', disabled: '禁用', pending: '待审核' }
  return map[status] || status
}

function statusTag(status: string): string {
  const map: Record<string, string> = { active: 'success', disabled: 'danger', pending: 'warning' }
  return map[status] || 'info'
}

function formatDate(dateStr: string): string {
  return sharedFormatDate(dateStr, 'YYYY-MM-DD') || dateStr
}

const filteredTenants = computed(() => {
  return tenants.value.filter((t) => {
    if (searchText.value && !t.name.includes(searchText.value)) return false
    if (statusFilter.value && t.status !== statusFilter.value) return false
    if (typeFilter.value && t.type !== typeFilter.value) return false
    return true
  })
})

function viewDetail(id: string) {
  router.push(`/tenants/detail/${id}`)
}

async function fetchTenants() {
  loading.value = true
  const res = await get<Tenant[]>('/platform/tenants')
  loading.value = false
  if (res.code === 0) {
    tenants.value = res.data
  } else {
    ElMessage.error('获取数据失败')
  }
}

async function filterTenants() {
  // Client-side filtering is handled by the computed property
}

onMounted(() => {
  fetchTenants()
})
</script>

<style scoped>
</style>
