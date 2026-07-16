<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { get } from '@ylxb/shared'
import type { Order } from '@ylxb/shared'
import { formatMoney, OrderStatusLabels } from '@ylxb/shared'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()
const order = ref<Order | null>(null)
const steps = [
  { key: 'paid', label: '已支付' },
  { key: 'shipped', label: '已发货' },
  { key: 'completed', label: '已完成' },
]

onMounted(async () => {
  const res = await get<Order>(`/mall/orders/${route.params.id}`)
  if (res.code === 0) order.value = res.data as unknown as Order
})
</script>

<template>
  <div class="od-page" v-if="order">
    <van-nav-bar title="订单详情" left-arrow @click-left="router.back()" />
    <div class="content">
      <div class="status-card">
        <div class="status">{{ OrderStatusLabels[order.status] || order.status }}</div>
        <div class="order-no">订单号：{{ order.orderNo }}</div>
      </div>
      <div class="section">
        <h4>商品信息</h4>
        <div v-for="item in order.items" :key="item.productId" class="prod-item">
          <span>{{ item.productImage }}</span>
          <span class="pname">{{ item.productName }}</span>
          <span>×{{ item.quantity }}</span>
          <span>{{ formatMoney(item.subtotal) }}</span>
        </div>
      </div>
      <div class="section" v-if="order.logistics">
        <h4>物流信息</h4>
        <p>{{ order.logistics.company }} · {{ order.logistics.trackingNumber }}</p>
        <div v-for="u in order.logistics.updates" :key="u.time" class="log-update">{{ u.time.slice(0,16).replace('T',' ') }} {{ u.description }}</div>
      </div>
      <div class="section">
        <h4>收货地址</h4>
        <p>{{ order.address.name }} {{ order.address.phone }}</p>
        <p>{{ order.address.province }}{{ order.address.city }}{{ order.address.district }} {{ order.address.detail }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.od-page { min-height: 100vh; background: var(--bg); }
.content { padding: 16px; }
.status-card { background: linear-gradient(135deg, var(--primary-blue), var(--primary-blue-light)); color: #fff; border-radius: var(--radius-md); padding: 20px; margin-bottom: 12px; box-shadow: var(--shadow-sm); }
.status { font-size: 20px; font-weight: 700; }
.order-no { font-size: 14px; opacity: 0.8; margin-top: 4px; }
.section { background: #fff; border-radius: var(--radius-md); padding: 16px; margin-bottom: 12px; box-shadow: var(--shadow-sm); }
.section h4 { font-size: 14px; margin-bottom: 8px; color: var(--text-primary); }
.section p { font-size: 14px; color: var(--text-secondary); line-height: 1.6; }
.prod-item { display: flex; align-items: center; gap: 8px; padding: 8px 0; font-size: 14px; border-bottom: 1px solid var(--border-light); }
.pname { flex: 1; }
.log-update { font-size: 14px; color: var(--text-secondary); padding: 2px 0; }
</style>
