<template>
  <div class="page-container">
    <div class="page-header">
      <h2>订单管理</h2>
    </div>

    <div class="search-bar">
      <el-input
        v-model="keyword"
        placeholder="搜索订单号、患者姓名"
        clearable
        style="width: 280px"
        @input="handleSearch"
      />
      <el-select v-model="statusFilter" placeholder="订单状态" clearable style="width: 140px" @change="handleSearch">
        <el-option label="待支付" value="pending" />
        <el-option label="待发货" value="paid" />
        <el-option label="已发货" value="shipped" />
        <el-option label="已完成" value="completed" />
        <el-option label="已退款" value="refunded" />
        <el-option label="已取消" value="cancelled" />
      </el-select>
    </div>

    <el-card>
      <el-table :data="filteredOrders" stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="orderNo" label="订单编号" min-width="180" />
        <el-table-column prop="patientName" label="患者" min-width="100" />
        <el-table-column label="商品" min-width="200">
          <template #default="{ row }">
            <span v-for="(item, idx) in row.items" :key="idx">
              {{ item.productName }} × {{ item.quantity }}
              <template v-if="idx < row.items.length - 1">；</template>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="金额" min-width="100">
          <template #default="{ row }"> ¥{{ row.totalAmount.toFixed(2) }} </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small">
              {{ statusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="下单时间" min-width="160">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="$router.push(`/orders/detail/${row.id}`)">
              详情
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无订单数据" />
        </template>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { get } from '@ylxb/shared'
import { OrderStatusLabels } from '@ylxb/shared'
import { formatDate } from '@ylxb/shared'
import type { Order } from '@ylxb/shared'

const orders = ref<Order[]>([])
const loading = ref(false)
const keyword = ref('')
const statusFilter = ref('')

const filteredOrders = computed(() => {
  let list = orders.value
  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    list = list.filter(
      (o) => o.orderNo.toLowerCase().includes(kw) || o.patientName.toLowerCase().includes(kw)
    )
  }
  if (statusFilter.value) {
    list = list.filter((o) => o.status === statusFilter.value)
  }
  return list
})

function statusLabel(status: string): string {
  return OrderStatusLabels[status] || status
}

function statusType(status: string): 'success' | 'primary' | 'warning' | 'info' | 'danger' {
  const map: Record<string, string> = {
    pending: 'warning',
    paid: 'primary',
    shipped: 'info',
    completed: 'success',
    refunded: 'danger',
    cancelled: 'info',
  }
  return (map[status] || 'info') as 'success' | 'primary' | 'warning' | 'info' | 'danger'
}

function formatTime(str?: string): string {
  if (!str) return '-'
  return formatDate(str, 'YYYY-MM-DD HH:mm')
}

function handleSearch() {
  // computed handles filtering
}

async function fetchOrders() {
  loading.value = true
  try {
    const res = await get<Order[]>('/management/orders')
    if (res.code === 0) {
      orders.value = res.data
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})
</script>
