<template>
  <div class="page-container">
    <div class="page-header">
      <h2>商品管理</h2>
    </div>

    <div class="search-bar">
      <el-input
        v-model="keyword"
        placeholder="搜索商品名称、批准文号"
        clearable
        style="width: 280px"
        @input="handleSearch"
      />
      <el-select v-model="categoryFilter" placeholder="商品分类" clearable style="width: 160px" @change="handleSearch">
        <el-option label="药品" value="drug" />
        <el-option label="医疗器械" value="device" />
        <el-option label="智能穿戴" value="wearable" />
        <el-option label="保健品" value="health_food" />
      </el-select>
      <el-button type="primary" @click="$router.push('/products/create')">
        <el-icon><Plus /></el-icon>新增商品
      </el-button>
    </div>

    <el-card>
      <el-table :data="filteredProducts" stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="商品名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" min-width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ categoryLabel(row.category) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="售价" min-width="100">
          <template #default="{ row }"> ¥{{ row.price.toFixed(2) }} </template>
        </el-table-column>
        <el-table-column prop="originalPrice" label="原价" min-width="100">
          <template #default="{ row }"> ¥{{ row.originalPrice.toFixed(2) }} </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" min-width="80" sortable />
        <el-table-column prop="sales" label="销量" min-width="80" sortable />
        <el-table-column prop="isOnSale" label="上架状态" min-width="100">
          <template #default="{ row }">
            <el-switch
              :model-value="row.isOnSale"
              active-color="#52C41A"
              inactive-color="#C0C4CC"
              @change="(val: any) => handleToggleSale(row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="140" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="$router.push(`/products/edit/${row.id}`)">
              编辑
            </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无商品数据">
            <el-button type="primary" @click="$router.push('/products/create')">
              新增商品
            </el-button>
          </el-empty>
        </template>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { get, del } from '@ylxb/shared'
import { ProductCategoryLabels } from '@ylxb/shared'
import type { Product } from '@ylxb/shared'

const products = ref<Product[]>([])
const loading = ref(false)
const keyword = ref('')
const categoryFilter = ref('')

const filteredProducts = computed(() => {
  let list = products.value
  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    list = list.filter((p) => p.name.toLowerCase().includes(kw) || p.approvalNumber.includes(kw))
  }
  if (categoryFilter.value) {
    list = list.filter((p) => p.category === categoryFilter.value)
  }
  return list
})

function categoryLabel(cat: string): string {
  return ProductCategoryLabels[cat] || cat
}

function handleSearch() {
  // computed handles filtering
}

async function fetchProducts() {
  loading.value = true
  try {
    const res = await get<Product[]>('/management/products')
    if (res.code === 0) {
      products.value = res.data
    }
  } finally {
    loading.value = false
  }
}

function handleToggleSale(row: any, val: boolean) {
  row.isOnSale = val
  ElMessage.success(val ? '已上架' : '已下架')
}

async function handleDelete(row: any) {
  try {
    await ElMessageBox.confirm(`确定要删除商品「${row.name}」吗？此操作不可恢复。`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    products.value = products.value.filter((p) => p.id !== row.id)
    ElMessage.success('删除成功')
  } catch {
    // cancelled
  }
}

onMounted(() => {
  fetchProducts()
})
</script>
