<template>
  <div class="page-container">
    <div class="page-header">
      <h2>邀请医生</h2>
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
        <el-form-item label="医生手机号" prop="phone">
          <el-input
            v-model="form.phone"
            placeholder="请输入医生注册手机号"
            maxlength="11"
          />
        </el-form-item>
        <el-form-item label="邀请科室" prop="department">
          <el-select v-model="form.department" placeholder="请选择邀请加入的科室" style="width: 100%">
            <el-option label="心血管内科" value="心血管内科" />
            <el-option label="内分泌科" value="内分泌科" />
            <el-option label="神经内科" value="神经内科" />
            <el-option label="呼吸内科" value="呼吸内科" />
            <el-option label="消化内科" value="消化内科" />
            <el-option label="骨科" value="骨科" />
          </el-select>
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
  department: '',
  note: '',
})

const rules: FormRules = {
  phone: [
    { required: true, message: '请输入医生手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  department: [
    { required: true, message: '请选择邀请科室', trigger: 'change' },
  ],
}

async function handleInvite() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    const res = await post<{ invited: boolean; message: string }>(
      '/management/doctors/invite',
      {
        phone: form.phone,
        department: form.department,
        note: form.note,
      }
    )
    if (res.code === 0) {
      ElMessage.success(res.data.message || '邀请已发送')
      router.push('/doctors/list')
    }
  } catch {
    ElMessage.error('邀请发送失败')
  } finally {
    loading.value = false
  }
}
</script>
