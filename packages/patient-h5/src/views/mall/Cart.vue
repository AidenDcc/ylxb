<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { get, post } from '@ylxb/shared'
import type { CartItem } from '@ylxb/shared'
import { formatMoney } from '@ylxb/shared'
import { showToast } from 'vant'

const router = useRouter()
const items = ref<CartItem[]>([])
const loading = ref(true)

onMounted(async () => {
  const res = await get<CartItem[]>('/mall/cart')
  if (res.code === 0) items.value = res.data as unknown as CartItem[]
  loading.value = false
})

const totalAmount = computed(() => items.value.reduce((sum, i) => sum + i.price * i.quantity, 0))

async function checkout() {
  const res = await post('/mall/orders', {
    items: items.value.map(i => ({ productId: i.productId, productName: i.productName, productImage: i.productImage, price: i.price, quantity: i.quantity, subtotal: i.price * i.quantity })),
    totalAmount: totalAmount.value,
    status: 'paid',
    patientName: '张建国',
    paidAt: new Date().toISOString(),
  })
  if (res.code === 0) {
    showToast('下单成功')
    items.value = []
    router.push('/mall/orders')
  }
}
</script>

<template>
  <div class="cart-page">
    <van-nav-bar title="购物车" left-arrow @click-left="router.back()" />
    <div class="cart-list" v-if="items.length">
      <div v-for="item in items" :key="item.id" class="cart-item">
        <span class="item-img">{{ item.productImage }}</span>
        <div class="item-info">
          <div class="item-name">{{ item.productName }}</div>
          <div class="item-price">{{ formatMoney(item.price) }}</div>
          <van-tag v-if="item.prescriptionRequired" size="medium" type="danger">处方药</van-tag>
        </div>
        <van-stepper v-model="item.quantity" min="1" max="99" />
      </div>
    </div>
    <van-empty v-else description="购物车空空如也" />
    <div class="bottom-bar" v-if="items.length">
      <div class="total">合计：<span class="price">{{ formatMoney(totalAmount) }}</span></div>
      <van-button type="danger" round @click="checkout">提交订单</van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
</script>

<style scoped>
.cart-page { min-height: 100vh; background: var(--bg); padding-bottom: 60px; }
.cart-list { background: #fff; margin: 12px 16px; border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm); }
.cart-item { display: flex; align-items: center; gap: 12px; padding: 14px; border-bottom: 1px solid var(--border-light); }
.item-img { font-size: 36px; }
.item-info { flex: 1; }
.item-name { font-size: 14px; font-weight: 500; color: var(--text-primary); }
.item-price { color: var(--danger); font-size: 14px; font-weight: 600; margin-top: 4px; }
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); box-shadow: 0 -1px 3px rgba(0,0,0,0.04); }
.total { font-size: 14px; color: var(--text-primary); }
.total .price { color: var(--danger); font-size: 18px; font-weight: 700; }
</style>
