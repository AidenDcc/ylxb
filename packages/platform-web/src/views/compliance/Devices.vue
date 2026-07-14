<template>
  <div class="page-container">
    <div class="page-header">
      <h2>设备白名单</h2>
      <span style="font-size: 13px; color: #909399">已批准的医疗设备列表</span>
    </div>

    <div class="table-card">
      <el-table :data="devices" border stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="设备名称" min-width="220" />
        <el-table-column prop="manufacturer" label="生产厂家" width="140" />
        <el-table-column prop="type" label="设备类型" width="100" />
        <el-table-column prop="certificationNo" label="注册证编号" width="200">
          <template #default="{ row }">
            <el-tag type="success" size="small">{{ row.certificationNo }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag type="success" size="small">
              {{ row.status === 'approved' ? '已批准' : row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="!loading" style="margin-top: 16px; color: #909399; font-size: 13px">
      共 {{ devices.length }} 条设备白名单记录
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { get } from '@ylxb/shared'
import { ElMessage } from 'element-plus'

interface ComplianceDevice {
  id: string
  name: string
  manufacturer: string
  type: string
  certificationNo: string
  status: string
}

const devices = ref<ComplianceDevice[]>([])
const loading = ref(false)

async function fetchDevices() {
  loading.value = true
  const res = await get<ComplianceDevice[]>('/platform/compliance/devices')
  loading.value = false
  if (res.code === 0) {
    devices.value = res.data
  } else {
    ElMessage.error('获取数据失败')
  }
}

onMounted(() => {
  fetchDevices()
})
</script>

<style scoped>
</style>
