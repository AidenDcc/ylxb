<template>
  <div class="page-container">
    <div class="page-header">
      <h2>医生管理</h2>
    </div>

    <div class="search-bar">
      <el-input
        v-model="keyword"
        placeholder="搜索医生姓名、科室、手机号"
        clearable
        style="width: 280px"
        @input="handleSearch"
      />
      <el-select v-model="departmentFilter" placeholder="科室筛选" clearable style="width: 180px" @change="handleSearch">
        <el-option label="心血管内科" value="心血管内科" />
        <el-option label="内分泌科" value="内分泌科" />
        <el-option label="神经内科" value="神经内科" />
        <el-option label="呼吸内科" value="呼吸内科" />
      </el-select>
      <el-button type="primary" @click="$router.push('/doctors/invite')">
        <el-icon><Plus /></el-icon>邀请医生
      </el-button>
    </div>

    <el-card>
      <el-table :data="filteredDoctors" stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="姓名" min-width="100" />
        <el-table-column prop="phone" label="手机号" min-width="130" />
        <el-table-column prop="title" label="职称" min-width="120" />
        <el-table-column prop="department" label="科室" min-width="140" />
        <el-table-column prop="hospital" label="所属医院" min-width="160" />
        <el-table-column prop="consultationCount" label="累计咨询" min-width="100" sortable />
        <el-table-column prop="realNameVerified" label="认证状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.realNameVerified ? 'success' : 'warning'" size="small">
              {{ row.realNameVerified ? '已认证' : '未认证' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="$router.push(`/doctors/detail/${row.id}`)">
              详情
            </el-button>
            <el-button type="danger" link size="small" @click="handleRemove(row)">
              移除
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无医生数据" />
        </template>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { get, del } from '@ylxb/shared'
import type { Doctor } from '@ylxb/shared'

const doctors = ref<Doctor[]>([])
const loading = ref(false)
const keyword = ref('')
const departmentFilter = ref('')

const filteredDoctors = computed(() => {
  let list = doctors.value
  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    list = list.filter(
      (d) =>
        d.name.includes(kw) ||
        d.phone.includes(kw) ||
        d.department.includes(kw) ||
        d.hospital.includes(kw)
    )
  }
  if (departmentFilter.value) {
    list = list.filter((d) => d.department === departmentFilter.value)
  }
  return list
})

function handleSearch() {
  // filtering is computed, no extra action needed
}

async function fetchDoctors() {
  loading.value = true
  try {
    const res = await get<Doctor[]>('/management/doctors')
    if (res.code === 0) {
      doctors.value = res.data
    }
  } finally {
    loading.value = false
  }
}

async function handleRemove(row: Doctor) {
  try {
    await ElMessageBox.confirm(`确定要从机构中移除医生「${row.name}」吗？`, '移除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    const res = await del<{ removed: boolean }>(`/management/doctors/${row.id}`)
    if (res.code === 0) {
      ElMessage.success('移除成功')
      doctors.value = doctors.value.filter((d) => d.id !== row.id)
    }
  } catch {
    // cancelled
  }
}

onMounted(() => {
  fetchDoctors()
})
</script>
