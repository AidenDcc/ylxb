<template>
  <div class="page-container">
    <div class="page-header">
      <h2>新增商品</h2>
    </div>

    <el-card style="max-width: 800px">
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
                placeholder="请输入售价"
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
                placeholder="请输入原价"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="库存数量" prop="stock">
          <el-input-number
            v-model="form.stock"
            :min="0"
            :step="1"
            style="width: 200px"
            placeholder="请输入库存"
          />
        </el-form-item>

        <el-form-item label="商品描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入商品描述"
          />
        </el-form-item>

        <el-form-item label="规格型号" prop="specification">
          <el-input v-model="form.specification" placeholder="请输入规格型号" />
        </el-form-item>

        <el-form-item label="生产厂家" prop="manufacturer">
          <el-input v-model="form.manufacturer" placeholder="请输入生产厂家" />
        </el-form-item>

        <el-form-item label="批准文号" prop="approvalNumber">
          <el-input v-model="form.approvalNumber" placeholder="请输入批准文号（药品/器械）" />
        </el-form-item>

        <el-form-item label="是否处方药" prop="prescriptionRequired">
          <el-switch v-model="form.prescriptionRequired" active-text="是" inactive-text="否" />
        </el-form-item>

        <el-form-item label="商品图片" prop="images">
          <el-input
            v-model="imagesText"
            placeholder="请输入图片URL，多个用逗号分隔"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit">
            {{ loading ? '创建中...' : '创建商品' }}
          </el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { post } from '@ylxb/shared'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)

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
})

const imagesText = ref('')

const rules: FormRules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入售价', trigger: 'blur' }],
  originalPrice: [{ required: true, message: '请输入原价', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
  description: [{ required: true, message: '请输入商品描述', trigger: 'blur' }],
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
    const res = await post('/management/products', {
      ...form,
      images,
      tenantId: 't1',
      tenantName: '仁济医院',
      approved: false,
      isOnSale: false,
    })
    if (res.code === 0) {
      ElMessage.success('商品创建成功')
      router.push('/products/list')
    }
  } catch {
    ElMessage.error('创建失败')
  } finally {
    loading.value = false
  }
}
</script>
