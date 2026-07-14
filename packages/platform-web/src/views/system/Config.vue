<template>
  <div class="page-container">
    <div class="page-header">
      <h2>系统配置</h2>
    </div>

    <el-card style="max-width: 720px">
      <el-form
        ref="formRef"
        :model="form"
        label-width="160px"
        v-loading="loading"
      >
        <el-divider content-position="left">基础配置</el-divider>

        <el-form-item label="平台名称">
          <el-input v-model="form.siteName" placeholder="请输入平台名称" />
        </el-form-item>

        <el-divider content-position="left">租户限制</el-divider>

        <el-form-item label="单个租户最大医生数">
          <el-input-number
            v-model="form.maxTenantDoctors"
            :min="1"
            :max="10000"
            placeholder="0 表示不限制"
          />
          <span style="margin-left: 8px; color: #909399; font-size: 13px">
            设置为 0 表示不限制
          </span>
        </el-form-item>

        <el-form-item label="单个租户最大患者数">
          <el-input-number
            v-model="form.maxTenantPatients"
            :min="1"
            :max="500000"
          />
          <span style="margin-left: 8px; color: #909399; font-size: 13px">
            设置为 0 表示不限制
          </span>
        </el-form-item>

        <el-divider content-position="left">咨询配置</el-divider>

        <el-form-item label="咨询记录归档天数">
          <el-input-number
            v-model="form.consultationArchiveDays"
            :min="30"
            :max="3650"
          />
          <span style="margin-left: 8px; color: #909399; font-size: 13px">
            超过该天数的咨询记录自动归档
          </span>
        </el-form-item>

        <el-divider content-position="left">内容审核</el-divider>

        <el-form-item label="开启内容审核">
          <el-switch v-model="form.contentReviewRequired" active-text="开启" inactive-text="关闭" />
          <span style="margin-left: 8px; color: #909399; font-size: 13px">
            开启后社区内容和咨询消息需要审核
          </span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="saving" @click="handleSave">
            保存配置
          </el-button>
          <el-button @click="fetchConfig">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { get, put } from '@ylxb/shared'
import { ElMessage } from 'element-plus'

interface SystemConfig {
  siteName: string
  maxTenantDoctors: number
  maxTenantPatients: number
  consultationArchiveDays: number
  contentReviewRequired: boolean
}

const loading = ref(false)
const saving = ref(false)

const form = reactive<SystemConfig>({
  siteName: '医路相伴',
  maxTenantDoctors: 200,
  maxTenantPatients: 50000,
  consultationArchiveDays: 365,
  contentReviewRequired: true,
})

async function fetchConfig() {
  loading.value = true
  const res = await get<SystemConfig>('/platform/system/config')
  loading.value = false
  if (res.code === 0) {
    Object.assign(form, res.data)
  } else {
    ElMessage.error('获取系统配置失败')
  }
}

async function handleSave() {
  saving.value = true
  const res = await put<SystemConfig>('/platform/system/config', { ...form })
  saving.value = false
  if (res.code === 0) {
    ElMessage.success('系统配置已保存')
  } else {
    ElMessage.error(res.message || '保存失败')
  }
}

onMounted(() => {
  fetchConfig()
})
</script>

<style scoped>
</style>
