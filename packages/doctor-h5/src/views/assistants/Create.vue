<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { post } from '@ylxb/shared'
import { showToast } from 'vant'

const router = useRouter()
const loading = ref(false)

const form = ref({
  name: '',
  phone: '',
  canReplyConsultation: true,
  canViewPatient: true,
  canManageFollowUp: true,
  canViewOrders: false,
  canExportData: false,
})

async function handleSubmit() {
  if (!form.value.name || !form.value.phone) {
    showToast('请填写必填信息')
    return
  }
  if (!/^1\d{10}$/.test(form.value.phone)) {
    showToast('请输入正确的手机号')
    return
  }
  loading.value = true
  const res = await post('/doctor/assistants', {
    name: form.value.name,
    phone: form.value.phone,
    permissions: {
      canReplyConsultation: form.value.canReplyConsultation,
      canViewPatient: form.value.canViewPatient,
      canManageFollowUp: form.value.canManageFollowUp,
      canViewOrders: form.value.canViewOrders,
      canExportData: form.value.canExportData,
    },
  })
  loading.value = false
  if (res.code === 0) {
    showToast('创建成功')
    router.back()
  } else {
    showToast(res.message)
  }
}
</script>

<template>
  <div class="assistant-create-page">
    <van-nav-bar title="添加助理" left-arrow @click-left="router.back()" />

    <div class="form-section">
      <van-field v-model="form.name" label="姓名" placeholder="请输入助理姓名" :rules="[{ required: true }]" />
      <van-field v-model="form.phone" label="手机号" placeholder="请输入手机号" type="tel" maxlength="11" :rules="[{ required: true }]" />

      <div class="permission-section">
        <h3>权限配置</h3>
        <div class="permission-list">
          <div class="permission-item">
            <span>可回复咨询</span>
            <van-switch v-model="form.canReplyConsultation" active-color="#4A90D9" size="22" />
          </div>
          <div class="permission-item">
            <span>可查看患者</span>
            <van-switch v-model="form.canViewPatient" active-color="#4A90D9" size="22" />
          </div>
          <div class="permission-item">
            <span>可管理随访</span>
            <van-switch v-model="form.canManageFollowUp" active-color="#4A90D9" size="22" />
          </div>
          <div class="permission-item">
            <span>可查看订单</span>
            <van-switch v-model="form.canViewOrders" active-color="#4A90D9" size="22" />
          </div>
          <div class="permission-item">
            <span>可导出数据</span>
            <van-switch v-model="form.canExportData" active-color="#4A90D9" size="22" />
          </div>
        </div>
      </div>

      <div style="padding: 20px 16px;">
        <van-button type="primary" block round :loading="loading" @click="handleSubmit">创建助理</van-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.assistant-create-page { min-height: 100vh; background: #f5f7fa; padding-bottom: 20px; }
.form-section { background: #fff; margin: 12px; border-radius: 12px; overflow: hidden; }
.permission-section { padding: 16px; }
.permission-section h3 { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
.permission-list { background: #f9f9f9; border-radius: 8px; }
.permission-item { display: flex; justify-content: space-between; align-items: center; padding: 14px; border-bottom: 1px solid #eee; }
.permission-item:last-child { border-bottom: none; }
.permission-item span { font-size: 14px; color: #333; }
</style>
