<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { get } from '@ylxb/shared'
import type { HealthRecord } from '@ylxb/shared'
import { HealthRecordTypeLabels } from '@ylxb/shared'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()
const record = ref<HealthRecord | null>(null)

onMounted(async () => {
  const res = await get<HealthRecord>(`/health/records/${route.params.id}`)
  if (res.code === 0) record.value = res.data as unknown as HealthRecord
})
</script>

<template>
  <div class="detail-page" v-if="record">
    <van-nav-bar title="档案详情" left-arrow @click-left="router.back()" />
    <div class="content">
      <div class="title-section">
        <h2>{{ record.title }}</h2>
        <van-tag type="primary">{{ HealthRecordTypeLabels[record.type] || record.type }}</van-tag>
      </div>
      <div class="meta">创建时间：{{ record.createdAt.slice(0, 10) }}</div>
      <div class="text-content">{{ record.content || '暂无详细内容' }}</div>

      <div v-if="record.ocrData" class="ocr-section">
        <h3>OCR 识别结果</h3>
        <div class="confidence">识别置信度：{{ (record.ocrData.confidence * 100).toFixed(0) }}%</div>
        <div class="ocr-items">
          <div v-for="item in record.ocrData.structured.items" :key="item.name" class="ocr-item" :class="{ abnormal: item.abnormal }">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-value">
              {{ item.value }} {{ item.unit }}
              <span class="ref">({{ item.referenceRange }})</span>
            </div>
            <van-tag v-if="item.abnormal" size="medium" type="danger">异常</van-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-page { min-height: 100vh; background: #f5f7fa; }
.content { padding: 16px; }
.title-section { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.title-section h2 { font-size: 18px; }
.meta { font-size: 14px; color: #999; margin-bottom: 16px; }
.text-content { background: #fff; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.8; white-space: pre-wrap; }
.ocr-section { margin-top: 16px; background: #fff; border-radius: 8px; padding: 16px; }
.ocr-section h3 { font-size: 15px; margin-bottom: 8px; }
.confidence { font-size: 14px; color: #999; margin-bottom: 12px; }
.ocr-item { padding: 10px 0; border-bottom: 1px solid #f5f5f5; display: flex; align-items: center; gap: 8px; }
.ocr-item.abnormal { background: #fff2f0; margin: 0 -16px; padding: 10px 16px; }
.item-name { font-size: 14px; font-weight: 500; min-width: 80px; }
.item-value { font-size: 14px; }
.ref { font-size: 14px; color: #ccc; }
</style>
