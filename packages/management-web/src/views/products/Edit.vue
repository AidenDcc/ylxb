<template>
  <div class="page-container">
    <div class="page-header">
      <h2>编辑商品</h2>
    </div>

    <el-card v-loading="pageLoading" style="max-width: 800px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        size="large"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>

        <el-form-item label="商品分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择商品分类" style="width: 100%">
            <el-option label="药品" value="drug" />
            <el-option label="医疗器械" value="device" />
            <el-option label="智能穿戴" value="wearable" />
            <el-option label="保健品" value="health_food" />
          </el-select>
        </el-form-item>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="售价" prop="price">
              <el-input-number
                v-model="form.price"
                :min="0"
                :precision="2"
                :step="1"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原价" prop="originalPrice">
              <el-input-number
                v-model="form.originalPrice"
                :min="0"
                :precision="2"
                :step="1"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="库存数量" prop="stock">
          <el-input-number v-model="form.stock" :min="0" :step="1" style="width: 200px" />
        </el-form-item>

        <el-form-item label="商品描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入商品描述" />
        </el-form-item>

        <el-form-item label="规格型号" prop="specification">
          <el-input v-model="form.specification" placeholder="请输入规格型号" />
        </el-form-item>

        <el-form-item label="生产厂家" prop="manufacturer">
          <el-input v-model="form.manufacturer" placeholder="请输入生产厂家" />
        </el-form-item>

        <el-form-item label="批准文号" prop="approvalNumber">
          <el-input v-model="form.approvalNumber" placeholder="请输入批准文号" />
        </el-form-item>

        <el-form-item label="是否处方药" prop="prescriptionRequired">
          <el-switch v-model="form.prescriptionRequired" active-text="是" inactive-text="否" />
        </el-form-item>

        <el-form-item label="是否上架">
          <el-switch v-model="form.isOnSale" active-text="是" inactive-text="否" />
        </el-form-item>

        <el-form-item label="商品图片">
          <el-input v-model="imagesText" placeholder="请输入图片URL，多个用逗号分隔" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit">
            {{ loading ? '保存中...' : '保存修改' }}
          </el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { get, put } from '@ylxb/shared'
import type { Product } from '@ylxb/shared'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const pageLoading = ref(false)

const form = reactive({
  name: '',
  category: '',
  price: 0,
  originalPrice: 0,
  stock: 0,
  description: '',
  specification: '',
  manufacturer: '',
  approvalNumber: '',
  prescriptionRequired: false,
  isOnSale: false,
})

const imagesText = ref('')

const rules: FormRules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入售价', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
  description: [{ required: true, message: '请输入商品描述', trigger: 'blur' }],
}

async function fetchProduct() {
  pageLoading.value = true
  try {
    const id = route.params.id as string
    const res = await get<Product[]>('/management/products')
    if (res.code === 0) {
      const product = res.data.find((p) => p.id === id)
      if (product) {
        form.name = product.name
        form.category = product.category
        form.price = product.price
        form.originalPrice = product.originalPrice
        form.stock = product.stock
        form.description = product.description
        form.specification = product.specification
        form.manufacturer = product.manufacturer
        form.approvalNumber = product.approvalNumber
        form.prescriptionRequired = product.prescriptionRequired
        form.isOnSale = product.isOnSale
        imagesText.value = (product.images || []).join(', ')
      }
    }
  } finally {
    pageLoading.value = false
  }
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    const images = imagesText.value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const id = route.params.id as string
    const res = await put(`/management/products/${id}`, {
      ...form,
      images,
    })
    if (res.code === 0) {
      ElMessage.success('商品更新成功')
      router.push('/products/list')
    }
  } catch {
    ElMessage.error('更新失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProduct()
})
</script>
