<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { get } from '@ylxb/shared'
import type { HealthRecord } from '@ylxb/shared'
import { HealthRecordTypeLabels } from '@ylxb/shared'

const router = useRouter()
const records = ref<HealthRecord[]>([])
const loading = ref(true)

onMounted(async () => {
  const res = await get<HealthRecord[]>('/health/records')
  if (res.code === 0) records.value = res.data as unknown as HealthRecord[]
  loading.value = false
})

const typeIcons: Record<string, string> = {
  medical_history: '📋', exam_report: '📄', medication: '💊', daily_feeling: '😊', vital_sign: '📊', device_data: '📟',
}
</script>

<template>
  <div class="records-page">
    <van-nav-bar title="健康档案" />
    <div class="actions-bar">
      <van-button type="primary" size="small" icon="plus" @click="router.push('/health/ocr-upload')">上传报告</van-button>
    </div>
    <van-pull-refresh v-model="loading" @refresh="onMounted">
      <div class="record-list" v-if="records.length">
        <div v-for="r in records" :key="r.id" class="record-card" @click="router.push(`/health/records/${r.id}`)">
          <div class="record-icon">{{ typeIcons[r.type] || '📋' }}</div>
          <div class="record-content">
            <div class="record-title">{{ r.title }}</div>
            <div class="record-meta">
              <van-tag size="medium" type="primary">{{ HealthRecordTypeLabels[r.type] || r.type }}</van-tag>
              <span class="record-date">{{ r.createdAt.slice(0, 10) }}</span>
            </div>
            <div class="record-desc" v-if="r.content">{{ r.content.slice(0, 60) }}{{ r.content.length > 60 ? '...' : '' }}</div>
          </div>
          <van-icon name="arrow" color="#ccc" />
        </div>
      </div>
      <van-empty v-else description="暂无健康档案" />
    </van-pull-refresh>
    <div style="height:16px"></div>
  </div>
</template>

<style scoped>
.records-page { min-height: 100vh; background: #f5f7fa; }
.actions-bar { padding: 12px 16px; display: flex; gap: 8px; }
.record-list { background: #fff; margin: 0 16px; border-radius: 12px; overflow: hidden; }
.record-card { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid #f5f5f5; cursor: pointer; }
.record-card:last-child { border-bottom: none; }
.record-icon { font-size: 32px; }
.record-content { flex: 1; min-width: 0; }
.record-title { font-size: 15px; font-weight: 500; margin-bottom: 4px; }
.record-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.record-date { font-size: 14px; color: #ccc; }
.record-desc { font-size: 14px; color: #999; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
