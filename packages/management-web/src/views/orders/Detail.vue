<template>
  <div class="page-container">
    <div class="page-header">
      <el-button link @click="$router.push('/orders/list')">
        <el-icon><ArrowLeft /></el-icon>返回订单列表
      </el-button>
      <h2 style="margin-top: 8px">订单详情</h2>
    </div>

    <el-row :gutter="16" v-loading="loading">
      <el-col :span="16">
        <!-- Order info -->
        <el-card style="margin-bottom: 16px">
          <template #header>
            <div class="card-title">
              订单信息
              <el-tag :type="statusType(order?.status)" size="small" style="margin-left: 12px">
                {{ statusLabel(order?.status) }}
              </el-tag>
            </div>
          </template>
          <el-descriptions :column="2" border size="small">
            <el-descriptions-item label="订单编号">{{ order?.orderNo }}</el-descriptions-item>
            <el-descriptions-item label="下单时间">{{ formatTime(order?.createdAt) }}</el-descriptions-item>
            <el-descriptions-item label="支付时间">{{ formatTime(order?.paidAt) }}</el-descriptions-item>
            <el-descriptions-item label="发货时间">{{ formatTime(order?.shippedAt) }}</el-descriptions-item>
            <el-descriptions-item label="完成时间">{{ formatTime(order?.completedAt) }}</el-descriptions-item>
            <el-descriptions-item label="退款时间">{{ formatTime(order?.refundedAt) }}</el-descriptions-item>
            <el-descriptions-item label="订单备注" :span="2">{{ order?.remark || '-' }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- Order items -->
        <el-card style="margin-bottom: 16px">
          <template #header>
            <div class="card-title">商品明细</div>
          </template>
          <el-table :data="order?.items || []" size="small" style="width: 100%">
            <el-table-column prop="productName" label="商品名称" min-width="200" />
            <el-table-column prop="price" label="单价" min-width="100">
              <template #default="{ row }"> ¥{{ row.price.toFixed(2) }} </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" min-width="80" />
            <el-table-column prop="subtotal" label="小计" min-width="100">
              <template #default="{ row }"> ¥{{ row.subtotal.toFixed(2) }} </template>
            </el-table-column>
          </el-table>
          <div class="total-amount">
            合计：<strong>¥{{ order?.totalAmount.toFixed(2) }}</strong>
          </div>
        </el-card>

        <!-- Logistics -->
        <el-card v-if="order?.logistics" style="margin-bottom: 16px">
          <template #header>
            <div class="card-title">物流信息</div>
          </template>
          <el-descriptions :column="2" border size="small">
            <el-descriptions-item label="快递公司">{{ order.logistics.company }}</el-descriptions-item>
            <el-descriptions-item label="运单号">{{ order.logistics.trackingNumber }}</el-descriptions-item>
            <el-descriptions-item label="物流状态">{{ order.logistics.status }}</el-descriptions-item>
          </el-descriptions>
          <el-timeline style="margin-top: 16px">
            <el-timeline-item
              v-for="(update, idx) in order.logistics.updates"
              :key="idx"
              :timestamp="formatTime(update.time)"
              placement="top"
            >
              {{ update.description }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>

      <!-- Sidebar -->
      <el-col :span="8">
        <el-card style="margin-bottom: 16px">
          <template #header>
            <div class="card-title">收货信息</div>
          </template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="收货人">{{ order?.address?.name }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ order?.address?.phone }}</el-descriptions-item>
            <el-descriptions-item label="收货地址">
              {{ order?.address?.province }}{{ order?.address?.city }}{{ order?.address?.district }}{{ order?.address?.detail }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card style="margin-bottom: 16px">
          <template #header>
            <div class="card-title">患者信息</div>
          </template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="患者姓名">{{ order?.patientName }}</el-descriptions-item>
            <el-descriptions-item label="所属机构">{{ order?.tenantName }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- Status actions -->
        <el-card>
          <template #header>
            <div class="card-title">订单操作</div>
          </template>
          <el-button
            v-if="order?.status === 'paid'"
            type="primary"
            style="width: 100%; margin-bottom: 8px"
            @click="handleUpdateStatus('shipped')"
          >
            确认发货
          </el-button>
          <el-button
            v-if="order?.status === 'pending'"
            type="warning"
            style="width: 100%"
            @click="handleUpdateStatus('cancelled')"
          >
            取消订单
          </el-button>
          <div v-if="['completed', 'refunded', 'cancelled'].includes(order?.status || '')" class="no-action">
            该订单{{ statusLabel(order?.status) }}，无需操作
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { get, put } from '@ylxb/shared'
import { OrderStatusLabels, formatDate } from '@ylxb/shared'
import type { Order } from '@ylxb/shared'

const route = useRoute()
const order = ref<Order | null>(null)
const loading = ref(false)

function statusLabel(status?: string): string {
  if (!status) return '-'
  return OrderStatusLabels[status] || status
}

function statusType(status?: string): 'success' | 'primary' | 'warning' | 'info' | 'danger' {
  const map: Record<string, string> = {
    pending: 'warning',
    paid: 'primary',
    shipped: 'info',
    completed: 'success',
    refunded: 'danger',
    cancelled: 'info',
  }
  return (map[status || ''] || 'info') as 'success' | 'primary' | 'warning' | 'info' | 'danger'
}

function formatTime(str?: string): string {
  if (!str) return '-'
  return formatDate(str, 'YYYY-MM-DD HH:mm')
}

async function fetchDetail() {
  loading.value = true
  try {
    const id = route.params.id as string
    const res = await get<Order[]>(`/management/orders`)
    if (res.code === 0) {
      order.value = res.data.find((o) => o.id === id) || null
    }
  } finally {
    loading.value = false
  }
}

async function handleUpdateStatus(status: string) {
  try {
    const id = route.params.id as string
    const res = await put(`/management/orders/${id}/status`, { status })
    if (res.code === 0) {
      ElMessage.success('订单状态更新成功')
      if (order.value) {
        order.value.status = status as Order['status']
      }
    }
  } catch {
    ElMessage.error('操作失败')
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.card-title {
  font-size: 16px;
  font-weight: 600;
}

.total-amount {
  text-align: right;
  padding: 16px 0 0;
  font-size: 16px;
}

.total-amount strong {
  color: var(--medical-red);
  font-size: 20px;
}

.no-action {
  text-align: center;
  color: var(--text-secondary);
  padding: 8px 0;
}
</style>
