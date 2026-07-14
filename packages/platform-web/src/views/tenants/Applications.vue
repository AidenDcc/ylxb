<template>
  <div class="page-container">
    <div class="page-header">
      <h2>入驻审核</h2>
    </div>

    <div class="table-card">
      <el-table :data="applications" border stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="tenantName" label="机构名称" min-width="160" />
        <el-table-column prop="tenantType" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="typeTag(row.tenantType)" size="small">
              {{ typeLabel(row.tenantType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="applicantName" label="申请人" width="100" />
        <el-table-column prop="applicantPhone" label="联系电话" width="130" />
        <el-table-column prop="address" label="地址" min-width="180" show-overflow-tooltip />
        <el-table-column prop="description" label="简介" min-width="180" show-overflow-tooltip />
        <el-table-column prop="businessLicense" label="营业执照" width="140" show-overflow-tooltip />
        <el-table-column label="资质证书" width="160">
          <template #default="{ row }">
            <el-tag
              v-for="cert in row.certifications"
              :key="cert"
              size="small"
              style="margin-right: 4px; margin-bottom: 2px"
            >
              {{ cert }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTag(row.status)" size="small">
              {{ statusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="申请时间" width="170">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <template v-if="row.status === 'pending'">
              <el-button type="success" size="small" @click="openApprove(row)">
                通过
              </el-button>
              <el-button type="danger" size="small" @click="openReject(row)">
                驳回
              </el-button>
            </template>
            <span v-else style="color: #909399">
              {{ row.reviewedBy ? '已处理' : '-' }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 通过确认 -->
    <el-dialog
      v-model="approveVisible"
      title="确认通过入驻申请"
      width="500px"
      @closed="approveForm.comment = ''"
    >
      <el-form :model="approveForm" label-width="80px">
        <el-form-item label="机构名称">
          <span>{{ currentApp?.tenantName }}</span>
        </el-form-item>
        <el-form-item label="审核意见">
          <el-input
            v-model="approveForm.comment"
            type="textarea"
            :rows="2"
            placeholder="可选，填写审核备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approveVisible = false">取消</el-button>
        <el-button type="success" :loading="actionLoading" @click="doApprove">
          确认通过
        </el-button>
      </template>
    </el-dialog>

    <!-- 驳回确认 -->
    <el-dialog
      v-model="rejectVisible"
      title="驳回入驻申请"
      width="500px"
      @closed="rejectForm.reason = ''"
    >
      <el-form :model="rejectForm" label-width="80px">
        <el-form-item label="机构名称">
          <span>{{ currentApp?.tenantName }}</span>
        </el-form-item>
        <el-form-item label="驳回原因" required>
          <el-input
            v-model="rejectForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请填写驳回原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectVisible = false">取消</el-button>
        <el-button type="danger" :loading="actionLoading" @click="doReject">
          确认驳回
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { get, post, formatDate as sharedFormatDate } from '@ylxb/shared'
import { ElMessage } from 'element-plus'
import type { TenantApplication, TenantType } from '@ylxb/shared'

const applications = ref<TenantApplication[]>([])
const loading = ref(false)
const actionLoading = ref(false)

const approveVisible = ref(false)
const rejectVisible = ref(false)
const currentApp = ref<TenantApplication | null>(null)

const approveForm = ref({ comment: '' })
const rejectForm = ref({ reason: '' })

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
  const map: Record<string, string> = { pending: '待审核', approved: '已通过', rejected: '已驳回' }
  return map[status] || status
}

function statusTag(status: string): string {
  const map: Record<string, string> = { pending: 'warning', approved: 'success', rejected: 'danger' }
  return map[status] || 'info'
}

function formatDate(dateStr: string): string {
  return sharedFormatDate(dateStr, 'YYYY-MM-DD HH:mm') || dateStr
}

function openApprove(row: TenantApplication) {
  currentApp.value = row
  approveForm.value.comment = ''
  approveVisible.value = true
}

function openReject(row: TenantApplication) {
  currentApp.value = row
  rejectForm.value.reason = ''
  rejectVisible.value = true
}

async function doApprove() {
  if (!currentApp.value) return
  actionLoading.value = true
  const res = await post(`/platform/applications/${currentApp.value.id}/approve`, {
    comment: approveForm.value.comment,
  })
  actionLoading.value = false
  if (res.code === 0) {
    ElMessage.success('入驻申请已通过')
    approveVisible.value = false
    fetchApplications()
  } else {
    ElMessage.error(res.message || '操作失败')
  }
}

async function doReject() {
  if (!currentApp.value) return
  if (!rejectForm.value.reason.trim()) {
    ElMessage.warning('请填写驳回原因')
    return
  }
  actionLoading.value = true
  const res = await post(`/platform/applications/${currentApp.value.id}/reject`, {
    reason: rejectForm.value.reason,
  })
  actionLoading.value = false
  if (res.code === 0) {
    ElMessage.success('入驻申请已驳回')
    rejectVisible.value = false
    fetchApplications()
  } else {
    ElMessage.error(res.message || '操作失败')
  }
}

async function fetchApplications() {
  loading.value = true
  const res = await get<TenantApplication[]>('/platform/applications')
  loading.value = false
  if (res.code === 0) {
    applications.value = res.data
  } else {
    ElMessage.error('获取数据失败')
  }
}

onMounted(() => {
  fetchApplications()
})
</script>

<style scoped>
</style>
