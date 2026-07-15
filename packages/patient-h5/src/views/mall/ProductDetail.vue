<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { get, post } from '@ylxb/shared'
import type { Product } from '@ylxb/shared'
import { formatMoney } from '@ylxb/shared'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()
const product = ref<Product | null>(null)
const quantity = ref(1)

onMounted(async () => {
  const res = await get<Product>(`/mall/products/${route.params.id}`)
  if (res.code === 0) product.value = res.data as unknown as Product
})

async function addToCart() {
  const res = await post('/mall/cart/add', {
    productId: product.value?.id,
    productName: product.value?.name,
    productImage: product.value?.images[0] || '📦',
    price: product.value?.price,
    quantity: quantity.value,
    tenantId: product.value?.tenantId,
    prescriptionRequired: product.value?.prescriptionRequired,
  })
  if (res.code === 0) showToast('已加入购物车')
}

function buyNow() {
  addToCart()
  router.push('/mall/cart')
}
</script>

<template>
  <div class="detail-page" v-if="product">
    <van-nav-bar title="商品详情" left-arrow @click-left="router.back()" />
    <div class="image-area">{{ product.images[0] || '📦' }}</div>
    <div class="info-section">
      <div class="p-name">{{ product.name }}</div>
      <div class="p-spec">{{ product.specification }} · {{ product.manufacturer }}</div>
      <div class="p-price">
        <span class="price">{{ formatMoney(product.price) }}</span>
        <span class="orig" v-if="product.originalPrice > product.price">{{ formatMoney(product.originalPrice) }}</span>
        <van-tag v-if="product.prescriptionRequired" size="medium" type="danger">处方药</van-tag>
      </div>
    </div>
    <div class="desc-section">
      <h4>商品描述</h4>
      <p>{{ product.description }}</p>
      <div class="approval">批准文号：{{ product.approvalNumber || '无' }}</div>
    </div>
    <div class="bottom-bar">
      <div class="qty-ctrl">
        <van-stepper v-model="quantity" min="1" :max="product.stock" />
      </div>
      <van-button type="primary" @click="addToCart">加入购物车</van-button>
      <van-button type="danger" @click="buyNow">立即购买</van-button>
    </div>
  </div>
</template>

<style scoped>
.detail-page { min-height: 100vh; background: #f5f7fa; padding-bottom: 60px; }
.image-area { height: 200px; display: flex; align-items: center; justify-content: center; font-size: 80px; background: #fff; }
.info-section { background: #fff; padding: 16px; margin-top: 1px; }
.p-name { font-size: 17px; font-weight: 600; }
.p-spec { font-size: 14px; color: #999; margin-top: 4px; }
.p-price { margin-top: 8px; display: flex; align-items: center; gap: 8px; }
.price { color: #F5222D; font-size: 22px; font-weight: 700; }
.orig { font-size: 14px; color: #ccc; text-decoration: line-through; }
.desc-section { background: #fff; margin-top: 8px; padding: 16px; }
.desc-section h4 { font-size: 14px; margin-bottom: 8px; }
.desc-section p { font-size: 14px; color: #666; line-height: 1.6; }
.approval { font-size: 14px; color: #ccc; margin-top: 12px; }
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; padding: 8px 16px; display: flex; align-items: center; gap: 8px; border-top: 1px solid #eee; }
.qty-ctrl { margin-right: auto; }
</style>
