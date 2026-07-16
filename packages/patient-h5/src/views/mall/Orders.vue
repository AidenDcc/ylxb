<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { get } from '@ylxb/shared'
import type { Order } from '@ylxb/shared'
import { formatMoney, OrderStatusLabels } from '@ylxb/shared'

const router = useRouter()
const orders = ref<Order[]>([])
const loading = ref(true)
const activeTab = ref(0)

onMounted(async () => {
  const res = await get<Order[]>('/mall/orders')
  if (res.code === 0) orders.value = res.data as unknown as Order[]
  loading.value = false
})
</script>

<template>
  <div class="orders-page">
    <van-nav-bar title="我的订单" left-arrow @click-left="router.back()" />
    <van-tabs v-model:active="activeTab">
      <van-tab title="全部" />
      <van-tab title="待发货" />
      <van-tab title="已发货" />
      <van-tab title="已完成" />
    </van-tabs>
    <div class="order-list" v-if="orders.length">
      <div v-for="o in orders" :key="o.id" class="order-card" @click="router.push(`/mall/order/${o.id}`)">
        <div class="o-header">
          <span>{{ o.tenantName }}</span>
          <van-tag :type="o.status === 'completed' ? 'success' : o.status === 'shipped' ? 'primary' : 'warning'" size="medium">
            {{ OrderStatusLabels[o.status] || o.status }}
          </van-tag>
        </div>
        <div v-for="item in o.items" :key="item.productId" class="o-item">
          <span class="o-img">{{ item.productImage }}</span>
          <div class="o-info">
            <div class="o-name">{{ item.productName }}</div>
            <div class="o-qty">×{{ item.quantity }}</div>
          </div>
          <div class="o-price">{{ formatMoney(item.subtotal) }}</div>
        </div>
        <div class="o-footer">
          <span>{{ o.createdAt.slice(0, 10) }}</span>
          <span class="total">合计：<strong>{{ formatMoney(o.totalAmount) }}</strong></span>
        </div>
      </div>
    </div>
    <van-empty v-else description="暂无订单" />
  </div>
</template>

<style scoped>
.orders-page { min-height: 100vh; background: var(--bg); }
.order-list { padding: 12px 16px; }
.order-card { background: #fff; border-radius: var(--radius-md); margin-bottom: 10px; overflow: hidden; cursor: pointer; box-shadow: var(--shadow-sm); }
.o-header { display: flex; justify-content: space-between; padding: 10px 14px; font-size: 14px; border-bottom: 1px solid var(--border-light); }
.o-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; }
.o-img { font-size: 32px; }
.o-info { flex: 1; }
.o-name { font-size: 14px; color: var(--text-primary); }
.o-qty { font-size: 14px; color: var(--text-secondary); }
.o-price { font-size: 14px; font-weight: 500; color: var(--text-primary); }
.o-footer { display: flex; justify-content: space-between; padding: 10px 14px; font-size: 14px; color: var(--text-secondary); border-top: 1px solid var(--border-light); }
.total strong { color: var(--text-primary); font-size: 14px; }
</style>
