<template>
  <div class="page-container">
    <div class="page-header">
      <h2>邀请患者</h2>
    </div>

    <el-card style="max-width: 600px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        size="large"
        @submit.prevent="handleInvite"
      >
        <el-form-item label="患者手机号" prop="phone">
          <el-input
            v-model="form.phone"
            placeholder="请输入患者注册手机号"
            maxlength="11"
          />
        </el-form-item>
        <el-form-item label="患者姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入患者姓名" />
        </el-form-item>
        <el-form-item label="邀请备注" prop="note">
          <el-input
            v-model="form.note"
            type="textarea"
            :rows="3"
            placeholder="选填，可填写邀请说明"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleInvite">
            {{ loading ? '发送中...' : '发送邀请' }}
          </el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { post } from '@ylxb/shared'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  phone: '',
  name: '',
  note: '',
})

const rules: FormRules = {
  phone: [
    { required: true, message: '请输入患者手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入患者姓名', trigger: 'blur' },
  ],
}

async function handleInvite() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    const res = await post<{ invited: boolean; message: string }>(
      '/management/patients/invite',
      {
        phone: form.phone,
        name: form.name,
        note: form.note,
      }
    )
    if (res.code === 0) {
      ElMessage.success(res.data.message || '邀请已发送')
      router.push('/patients/list')
    }
  } catch {
    ElMessage.error('邀请发送失败')
  } finally {
    loading.value = false
  }
}
</script>
