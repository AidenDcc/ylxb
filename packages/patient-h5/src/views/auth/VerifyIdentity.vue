<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { showToast } from 'vant'

const router = useRouter()
const auth = useAuthStore()
const realName = ref('')
const idCard = ref('')
const loading = ref(false)

async function handleSubmit() {
  if (!realName.value || !idCard.value) { showToast('请填写完整信息'); return }
  loading.value = true
  const res = await auth.verifyIdentity({ realName: realName.value, idCard: idCard.value })
  loading.value = false
  if (res.code === 0) {
    showToast('提交成功，审核中')
    router.back()
  }
}
</script>

<template>
  <div class="verify-page">
    <van-nav-bar title="实名认证" left-arrow @click-left="router.back()" />
    <div class="form-wrap">
      <van-notice-bar left-icon="info-o" color="#FA8C16" background="#fff7e6" text="实名认证后才能使用咨询、健康档案等核心功能" wrapable />
      <van-field v-model="realName" label="真实姓名" placeholder="请输入身份证姓名" />
      <van-field v-model="idCard" label="身份证号" placeholder="请输入18位身份证号" maxlength="18" />
      <div class="upload-section">
        <p class="label">身份证照片（演示模式，无需真实上传）</p>
        <div class="upload-box">
          <div class="upload-item"><van-icon name="photo-o" size="32" /><span>人像面</span></div>
          <div class="upload-item"><van-icon name="photo-o" size="32" /><span>国徽面</span></div>
        </div>
      </div>
      <van-button type="primary" block round :loading="loading" @click="handleSubmit" style="margin-top:24px">提交认证</van-button>
    </div>
  </div>
</template>

<style scoped>
.verify-page { min-height: 100vh; background: #f5f7fa; }
.form-wrap { background: #fff; margin: 16px; border-radius: 12px; padding: 8px 0 24px 16px; }
.upload-section { padding: 16px 16px 16px 0; }
.upload-section .label { font-size: 14px; color: #666; margin-bottom: 12px; }
.upload-box { display: flex; gap: 16px; }
.upload-item { width: 120px; height: 80px; border: 1px dashed #ddd; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; font-size: 14px; color: #999; }
</style>
