<template>
  <div class="page-container">
    <div class="page-header">
      <h2>个人中心</h2>
    </div>

    <el-card style="max-width: 640px">
      <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px">
        <el-avatar :size="72" icon="UserFilled" />
        <div>
          <div style="font-size: 20px; font-weight: 700; color: #303133">
            {{ auth.user?.name || '管理员' }}
          </div>
          <div style="font-size: 13px; color: #909399; margin-top: 4px">
            平台超级管理员
          </div>
        </div>
      </div>

      <el-divider />

      <el-form label-width="100px" :model="form">
        <el-form-item label="用户ID">
          <el-input :model-value="auth.user?.id || '-'" disabled />
        </el-form-item>

        <el-form-item label="手机号">
          <el-input :model-value="auth.user?.phone || '-'" disabled />
        </el-form-item>

        <el-form-item label="角色">
          <el-tag type="danger" size="large">平台超级管理员</el-tag>
        </el-form-item>

        <el-form-item label="姓名">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>

        <el-form-item label="注册时间">
          <el-input :model-value="auth.user?.createdAt || '-'" disabled />
        </el-form-item>

        <el-form-item label="绑定租户">
          <div v-if="!auth.user?.tenantBindings?.length" style="color: #909399">
            平台管理员无需绑定租户
          </div>
          <el-tag
            v-for="bind in auth.user?.tenantBindings"
            :key="bind.tenantId"
            style="margin-right: 8px"
          >
            {{ bind.tenantName }}
          </el-tag>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="saving" @click="handleSave">
            保存修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { put } from '@ylxb/shared'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const saving = ref(false)

const form = reactive({
  name: auth.user?.name || '',
})

async function handleSave() {
  saving.value = true
  const res = await put('/user/profile', { name: form.name })
  saving.value = false
  if (res.code === 0) {
    if (auth.user) {
      auth.user.name = form.name
    }
    ElMessage.success('个人信息已更新')
  } else {
    ElMessage.error(res.message || '保存失败')
  }
}
</script>

<style scoped>
</style>
