<template>
  <div class="page-container">
    <div class="page-header">
      <div style="display: flex; align-items: center; gap: 12px">
        <el-button @click="router.back()" :icon="'ArrowLeft'">返回</el-button>
        <h2>{{ tenant.name }}</h2>
        <el-tag :type="statusTag(tenant.status)" size="small">
          {{ statusLabel(tenant.status) }}
        </el-tag>
      </div>
    </div>

    <!-- 基本信息 -->
    <div class="detail-section">
      <h3>基本信息</h3>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">机构名称</span>
          <span class="detail-value">{{ tenant.name }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">机构类型</span>
          <span class="detail-value">{{ typeLabel(tenant.type) }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">联系人</span>
          <span class="detail-value">{{ tenant.contactPerson }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">联系电话</span>
          <span class="detail-value">{{ tenant.contactPhone }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">机构地址</span>
          <span class="detail-value">{{ tenant.address }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">营业执照号</span>
          <span class="detail-value">{{ tenant.businessLicense }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">机构简介</span>
          <span class="detail-value">{{ tenant.description }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">入驻时间</span>
          <span class="detail-value">{{ formatDate(tenant.createdAt) }}</span>
        </div>
      </div>
    </div>

    <!-- 数据统计 -->
    <div class="detail-section">
      <h3>数据统计</h3>
      <div class="stat-cards" style="grid-template-columns: repeat(4, 1fr)">
        <div class="stat-card">
          <div class="label">医生数</div>
          <div class="value">{{ tenant.doctorCount }}</div>
        </div>
        <div class="stat-card">
          <div class="label">患者数</div>
          <div class="value">{{ tenant.patientCount }}</div>
        </div>
        <div class="stat-card">
          <div class="label">商品数</div>
          <div class="value">{{ tenant.productCount }}</div>
        </div>
        <div class="stat-card">
          <div class="label">订单数</div>
          <div class="value">{{ tenant.orderCount }}</div>
        </div>
      </div>
    </div>

    <!-- 资质证书 -->
    <div class="detail-section">
      <h3>资质证书</h3>
      <div style="display: flex; gap: 8px; flex-wrap: wrap">
        <el-tag v-for="cert in tenant.certifications" :key="cert" type="success" size="large">
          {{ cert }}
        </el-tag>
        <span v-if="!tenant.certifications?.length" style="color: #909399">暂无资质证书信息</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { get, formatDate as sharedFormatDate } from '@ylxb/shared'
import { ElMessage } from 'element-plus'
import type { Tenant, TenantType } from '@ylxb/shared'

const router = useRouter()
const route = useRoute()

const typeLabels: Record<TenantType, string> = {
  hospital: '医院',
  pharmacy: '药房',
  clinic: '诊所',
}

function typeLabel(type: TenantType): string {
  return typeLabels[type] || type
}

function statusLabel(status: string): string {
  const map: Record<string, string> = { active: '启用', disabled: '禁用', pending: '待审核' }
  return map[status] || status
}

function statusTag(status: string): 'success' | 'primary' | 'warning' | 'info' | 'danger' {
  const map: Record<string, string> = { active: 'success', disabled: 'danger', pending: 'warning' }
  return (map[status] || 'info') as 'success' | 'primary' | 'warning' | 'info' | 'danger'
}

function formatDate(dateStr: string): string {
  return sharedFormatDate(dateStr, 'YYYY-MM-DD HH:mm') || dateStr
}

const tenant = ref<Tenant>({
  id: '',
  name: '',
  type: 'hospital',
  logo: '',
  description: '',
  address: '',
  contactPhone: '',
  contactPerson: '',
  businessLicense: '',
  certifications: [],
  status: 'active',
  doctorCount: 0,
  patientCount: 0,
  productCount: 0,
  orderCount: 0,
  createdAt: '',
})

async function fetchTenant() {
  const id = route.params.id as string
  const res = await get<Tenant>(`/platform/tenants/${id}`)
  if (res.code === 0) {
    tenant.value = res.data
  } else {
    ElMessage.error('获取租户信息失败')
  }
}

onMounted(() => {
  fetchTenant()
})
</script>

<style scoped>
</style>
