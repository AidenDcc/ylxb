<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { get } from '@ylxb/shared'
import type { Product } from '@ylxb/shared'
import { formatMoney } from '@ylxb/shared'

const router = useRouter()
const products = ref<Product[]>([])
const loading = ref(true)
const activeCategory = ref('all')

const categories = [
  { key: 'all', label: '全部' },
  { key: 'drug', label: '药品' },
  { key: 'device', label: '器械' },
  { key: 'wearable', label: '穿戴' },
]

onMounted(async () => {
  const res = await get<Product[]>('/mall/products')
  if (res.code === 0) products.value = res.data as unknown as Product[]
  loading.value = false
})
</script>

<template>
  <div class="mall-page">
    <van-nav-bar title="医药商城">
      <template #right>
        <van-icon name="cart-o" size="22" @click="router.push('/mall/cart')" />
      </template>
    </van-nav-bar>

    <div class="category-bar">
      <span v-for="c in categories" :key="c.key" class="cat-item" :class="{ active: activeCategory === c.key }" @click="activeCategory = c.key">{{ c.label }}</span>
    </div>

    <div class="product-grid">
      <div v-for="p in filteredProducts" :key="p.id" class="product-card" @click="router.push(`/mall/product/${p.id}`)">
        <div class="p-image">{{ p.images[0] || '📦' }}</div>
        <div class="p-info">
          <div class="p-name">{{ p.name }}</div>
          <div class="p-spec">{{ p.specification }}</div>
          <div class="p-price">
            <span class="price">{{ formatMoney(p.price) }}</span>
            <span class="orig-price" v-if="p.originalPrice > p.price">{{ formatMoney(p.originalPrice) }}</span>
          </div>
          <div class="p-sold">已售{{ p.sales }}</div>
        </div>
      </div>
    </div>
    <van-empty v-if="!loading && filteredProducts.length === 0" description="暂无商品" />
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
const filteredProducts = computed(() => activeCategory.value === 'all' ? products.value : products.value.filter(p => p.category === activeCategory.value))
</script>

<style scoped>
.mall-page { min-height: 100vh; background: #f5f7fa; }
.category-bar { display: flex; gap: 0; background: #fff; padding: 8px 16px; overflow-x: auto; }
.cat-item { padding: 6px 16px; border-radius: 20px; font-size: 13px; white-space: nowrap; cursor: pointer; }
.cat-item.active { background: #4A90D9; color: #fff; }
.product-grid { padding: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.product-card { background: #fff; border-radius: 10px; overflow: hidden; cursor: pointer; }
.p-image { height: 120px; display: flex; align-items: center; justify-content: center; font-size: 48px; background: #f8f9fa; }
.p-info { padding: 10px; }
.p-name { font-size: 13px; font-weight: 500; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.p-spec { font-size: 11px; color: #ccc; margin: 4px 0; }
.p-price { margin-top: 4px; }
.price { color: #F5222D; font-size: 16px; font-weight: 700; }
.orig-price { font-size: 11px; color: #ccc; text-decoration: line-through; margin-left: 4px; }
.p-sold { font-size: 10px; color: #ccc; margin-top: 2px; }
</style>
