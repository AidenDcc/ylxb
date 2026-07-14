<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { get, del } from '@ylxb/shared'
import { showToast, showConfirmDialog } from 'vant'
import type { AssistantAccount } from '@ylxb/shared'

const router = useRouter()
const assistants = ref<AssistantAccount[]>([])
const loading = ref(true)

onMounted(async () => {
  const res = await get<AssistantAccount[]>('/doctor/assistants')
  if (res.code === 0) {
    assistants.value = (res.data as unknown as AssistantAccount[]) || []
  }
  loading.value = false
})

function goCreate() {
  router.push('/assistants/create')
}

function goPermission(id: string) {
  router.push('/assistants/permission/' + id)
}

async function handleDelete(id: string) {
  try {
    await showConfirmDialog({
      title: '删除助理',
      message: '确定要删除该助理账号吗？',
      confirmButtonColor: '#F5222D',
    })
    const res = await del('/doctor/assistants/' + id)
    if (res.code === 0) {
      assistants.value = assistants.value.filter(a => a.id !== id)
      showToast('已删除')
    } else {
      showToast(res.message)
    }
  } catch {
    // user cancelled
  }
}
</script>

<template>
  <div class="assistant-list-page">
    <van-nav-bar title="助理管理" right-text="添加" @click-right="goCreate" />

    <van-list v-model:loading="loading" :finished="true" finished-text="没有更多了">
      <div
        v-for="assistant in assistants"
        :key="assistant.id"
        class="assistant-card"
      >
        <div class="card-main">
          <span class="assistant-avatar">{{ assistant.avatar || '🧑‍💻' }}</span>
          <div class="assistant-info">
            <div class="assistant-name">{{ assistant.name }}</div>
            <div class="assistant-phone">{{ assistant.phone }}</div>
            <div class="assistant-status">
              <van-tag :type="assistant.status === 'active' ? 'success' : 'danger'" size="medium">
                {{ assistant.status === 'active' ? '正常' : '已禁用' }}
              </van-tag>
            </div>
          </div>
        </div>
        <div class="card-permissions">
          <van-tag v-if="assistant.permissions.canReplyConsultation" type="primary" size="medium" plain>可回复咨询</van-tag>
          <van-tag v-if="assistant.permissions.canViewPatient" type="primary" size="medium" plain>可查看患者</van-tag>
          <van-tag v-if="assistant.permissions.canManageFollowUp" type="primary" size="medium" plain>可管理随访</van-tag>
          <van-tag v-if="assistant.permissions.canViewOrders" type="primary" size="medium" plain>可查看订单</van-tag>
          <van-tag v-if="assistant.permissions.canExportData" type="primary" size="medium" plain>可导出数据</van-tag>
        </div>
        <div class="card-actions">
          <van-button size="small" type="primary" plain @click="goPermission(assistant.id)">配置权限</van-button>
          <van-button size="small" type="danger" plain @click="handleDelete(assistant.id)">删除</van-button>
        </div>
      </div>
    </van-list>

    <van-empty v-if="!loading && assistants.length === 0" description="暂无助理账号">
      <van-button type="primary" size="small" @click="goCreate">添加助理</van-button>
    </van-empty>
  </div>
</template>

<style scoped>
.assistant-list-page { min-height: 100vh; background: #f5f7fa; }
.assistant-card {
  background: #fff;
  margin: 8px 12px;
  border-radius: 12px;
  padding: 16px;
}
.card-main { display: flex; gap: 12px; margin-bottom: 10px; }
.assistant-avatar { font-size: 40px; flex-shrink: 0; }
.assistant-name { font-size: 16px; font-weight: 500; }
.assistant-phone { font-size: 12px; color: #999; margin-top: 2px; }
.assistant-status { margin-top: 4px; }
.card-permissions { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.card-actions { display: flex; gap: 8px; justify-content: flex-end; border-top: 1px solid #f5f5f5; padding-top: 10px; }
</style>
