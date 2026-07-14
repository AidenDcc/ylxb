<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { post } from '@ylxb/shared'
import type { OCRResult } from '@ylxb/shared'
import { showToast } from 'vant'

const router = useRouter()
const uploading = ref(false)
const result = ref<OCRResult | null>(null)

async function handleUpload() {
  uploading.value = true
  const res = await post<OCRResult>('/health/ocr', {})
  uploading.value = false
  if (res.code === 0) {
    result.value = res.data as unknown as OCRResult
    showToast('识别完成')
  }
}
</script>

<template>
  <div class="ocr-page">
    <van-nav-bar title="OCR报告上传" left-arrow @click-left="router.back()" />
    <div class="content">
      <van-notice-bar left-icon="info-o" text="支持上传病历、化验单、体检报告等医疗文书图片，系统将自动识别关键指标" wrapable />

      <!-- 上传区 -->
      <div class="upload-zone" @click="handleUpload">
        <van-icon name="photograph" size="40" color="#4A90D9" />
        <p>点击拍照/上传报告图片</p>
        <span class="hint">（演示模式：点击自动模拟OCR识别）</span>
      </div>

      <van-button type="primary" block round :loading="uploading" @click="handleUpload" style="margin-top:16px">
        {{ uploading ? '识别中...' : '上传并识别' }}
      </van-button>

      <!-- 识别结果 -->
      <div v-if="result" class="result-section">
        <h3>识别结果（置信度：{{ (result.confidence * 100).toFixed(0) }}%）</h3>
        <div class="result-items">
          <div v-for="item in result.structured.items" :key="item.name" class="result-item" :class="{ abnormal: item.abnormal }">
            <div class="r-name">{{ item.name }}</div>
            <div class="r-value">
              <strong>{{ item.value }}</strong> {{ item.unit }}
              <span class="r-ref">参考：{{ item.referenceRange }}</span>
            </div>
            <van-tag v-if="item.abnormal" size="medium" type="danger">↑异常</van-tag>
            <van-tag v-else size="medium" type="success">正常</van-tag>
          </div>
        </div>
        <div class="summary">
          <strong>综合评估：</strong>{{ result.structured.summary }}
        </div>
        <van-button type="primary" block round style="margin-top:16px" @click="showToast('已保存至健康档案'); router.back()">确认保存</van-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ocr-page { min-height: 100vh; background: #f5f7fa; }
.content { padding: 16px; }
.upload-zone { background: #fff; border: 2px dashed #4A90D9; border-radius: 12px; padding: 40px 16px; text-align: center; cursor: pointer; margin-top: 16px; }
.upload-zone p { margin-top: 12px; font-size: 14px; color: #666; }
.upload-zone .hint { font-size: 11px; color: #ccc; }
.result-section { margin-top: 20px; background: #fff; border-radius: 12px; padding: 16px; }
.result-section h3 { font-size: 15px; margin-bottom: 12px; }
.result-item { padding: 10px 0; border-bottom: 1px solid #f5f5f5; display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.result-item.abnormal { background: #fff2f0; margin: 0 -16px; padding: 10px 16px; }
.r-name { font-size: 13px; font-weight: 500; min-width: 80px; }
.r-value { font-size: 14px; flex: 1; }
.r-ref { font-size: 11px; color: #ccc; margin-left: 4px; }
.summary { margin-top: 16px; padding: 12px; background: #f0f7ff; border-radius: 8px; font-size: 13px; line-height: 1.6; }
</style>
