<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { showToast } from 'vant'

const router = useRouter()
const auth = useAuthStore()
const phone = ref('13900001111')
const password = ref('123456')
const loading = ref(false)

async function handleLogin() {
  if (!phone.value || !password.value) {
    showToast('请输入手机号和密码')
    return
  }
  loading.value = true
  const res = await auth.login(phone.value, password.value)
  loading.value = false
  if (res.code === 0) {
    showToast('登录成功')
    router.replace('/home')
  } else {
    showToast(res.message)
  }
}

function handleAssistantLogin() {
  phone.value = '13900003333'
  password.value = '123456'
}
</script>

<template>
  <div class="login-page">
    <div class="login-header">
      <div class="logo">🏥</div>
      <h1>医路相伴</h1>
      <p>院外医患沟通平台 · 医生端</p>
    </div>
    <div class="login-form">
      <van-field v-model="phone" label="手机号" placeholder="请输入手机号" type="tel" maxlength="11" />
      <van-field v-model="password" label="密码" placeholder="请输入密码" type="password" />
      <van-button type="primary" block round :loading="loading" @click="handleLogin" style="margin-top:24px">登录</van-button>
      <div class="assistant-link">
        <span @click="handleAssistantLogin">使用助理账号登录</span>
      </div>
      <div class="demo-hint">
        <p>医生演示账号：13900001111 / 123456（陈主任）</p>
        <p>助理演示账号：13900003333 / 123456（小明助理）</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page { min-height: 100vh; background: linear-gradient(135deg, #e8f4fd 0%, #f5f7fa 100%); padding: 40px 24px; }
.login-header { text-align: center; margin-bottom: 40px; }
.logo { font-size: 64px; margin-bottom: 12px; }
.login-header h1 { font-size: 24px; color: var(--primary); margin-bottom: 8px; }
.login-header p { font-size: 14px; color: #999; }
.login-form { background: #fff; border-radius: 16px; padding: 24px 16px; }
.assistant-link { text-align: center; margin-top: 16px; font-size: 14px; color: var(--primary); cursor: pointer; }
.demo-hint { margin-top: 20px; padding: 12px; background: #fffbe6; border-radius: 8px; font-size: 12px; color: #999; text-align: center; line-height: 1.8; }
</style>
