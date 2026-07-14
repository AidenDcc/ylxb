<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { get, put } from '@ylxb/shared'
import { showToast } from 'vant'
import type { AssistantAccount } from '@ylxb/shared'

const route = useRoute()
const router = useRouter()
const assistantId = route.params.id as string

const assistant = ref<AssistantAccount | null>(null)
const permissions = ref({
  canReplyConsultation: false,
  canViewPatient: false,
  canManageFollowUp: false,
  canViewOrders: false,
  canExportData: false,
})
const loading = ref(true)
const saving = ref(false)

onMounted(async () => {
  const res = await get<AssistantAccount[]>('/doctor/assistants')
  if (res.code === 0) {
    const list = (res.data as unknown as AssistantAccount[]) || []
    assistant.value = list.find(a => a.id === assistantId) || null
    if (assistant.value) {
      permissions.value = { ...assistant.value.permissions }
    }
  }
  loading.value = false
})

async function handleSave() {
  saving.value = true
  const res = await put('/doctor/assistants/' + assistantId, {
    permissions: permissions.value,
  })
  saving.value = false
  if (res.code === 0) {
    showToast('权限更新成功')
    router.back()
  } else {
    showToast(res.message)
  }
}
</script>

<template>
  <div class="permission-page">
    <van-nav-bar title="权限配置" left-arrow @click-left="router.back()" />

    <van-loading v-if="loading" type="spinner" class="loading" />

    <template v-if="assistant && !loading">
      <div class="assistant-card">
        <span class="avatar">{{ assistant.avatar || '🧑‍💻' }}</span>
        <div class="info">
          <div class="name">{{ assistant.name }}</div>
          <div class="phone">{{ assistant.phone }}</div>
          <van-tag :type="assistant.status === 'active' ? 'success' : 'danger'" size="medium">
            {{ assistant.status === 'active' ? '正常' : '已禁用' }}
          </van-tag>
        </div>
      </div>

      <div class="permission-section">
        <h3>功能权限</h3>
        <div class="permission-list">
          <div class="permission-item">
            <div class="perm-info">
              <span class="perm-label">可回复咨询</span>
              <span class="perm-desc">允许代表医生回复患者咨询消息</span>
            </div>
            <van-switch v-model="permissions.canReplyConsultation" active-color="#4A90D9" size="22" />
          </div>
          <div class="permission-item">
            <div class="perm-info">
              <span class="perm-label">可查看患者</span>
              <span class="perm-desc">查看患者健康档案、体征数据和基本信息</span>
            </div>
            <van-switch v-model="permissions.canViewPatient" active-color="#4A90D9" size="22" />
          </div>
          <div class="permission-item">
            <div class="perm-info">
              <span class="perm-label">可管理随访</span>
              <span class="perm-desc">创建、编辑和查看随访计划及任务</span>
            </div>
            <van-switch v-model="permissions.canManageFollowUp" active-color="#4A90D9" size="22" />
          </div>
          <div class="permission-item">
            <div class="perm-info">
              <span class="perm-label">可查看订单</span>
              <span class="perm-desc">查看商城订单信息和物流状态</span>
            </div>
            <van-switch v-model="permissions.canViewOrders" active-color="#4A90D9" size="22" />
          </div>
          <div class="permission-item">
            <div class="perm-info">
              <span class="perm-label">可导出数据</span>
              <span class="perm-desc">导出患者数据和咨询记录</span>
            </div>
            <van-switch v-model="permissions.canExportData" active-color="#4A90D9" size="22" />
          </div>
        </div>
      </div>

      <div style="padding: 20px 16px;">
        <van-button type="primary" block round :loading="saving" @click="handleSave">保存权限</van-button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.permission-page { min-height: 100vh; background: #f5f7fa; padding-bottom: 20px; }
.loading { display: flex; justify-content: center; padding: 40px 0; }
.assistant-card { display: flex; align-items: center; gap: 12px; background: #fff; margin: 12px; border-radius: 12px; padding: 16px; }
.avatar { font-size: 40px; }
.name { font-size: 16px; font-weight: 500; }
.phone { font-size: 12px; color: #999; margin-top: 2px; margin-bottom: 4px; }
.permission-section { background: #fff; margin: 12px; border-radius: 12px; padding: 16px; }
.permission-section h3 { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
.permission-list { background: #f9f9f9; border-radius: 8px; }
.permission-item { display: flex; justify-content: space-between; align-items: center; padding: 14px; border-bottom: 1px solid #eee; }
.permission-item:last-child { border-bottom: none; }
.perm-info { display: flex; flex-direction: column; flex: 1; }
.perm-label { font-size: 14px; color: #333; font-weight: 500; }
.perm-desc { font-size: 11px; color: #999; margin-top: 2px; }
</style>
