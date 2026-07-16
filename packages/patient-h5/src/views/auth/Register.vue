<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { showToast } from 'vant'

const router = useRouter()
const auth = useAuthStore()
const form = ref({ phone: '', password: '', name: '', gender: 'male' })
const loading = ref(false)

async function handleRegister() {
  if (!form.value.phone || !form.value.password || !form.value.name) {
    showToast('请填写完整信息')
    return
  }
  loading.value = true
  const res = await auth.register(form.value)
  loading.value = false
  if (res.code === 0) {
    showToast('注册成功，请登录')
    router.replace('/login')
  } else {
    showToast(res.message)
  }
}
</script>

<template>
  <div class="register-page">
    <van-nav-bar title="注册账号" left-arrow @click-left="router.back()" />
    <div class="form-wrap">
      <van-field v-model="form.phone" label="手机号" placeholder="请输入手机号" type="tel" maxlength="11" />
      <van-field v-model="form.password" label="密码" placeholder="6-20位密码" type="password" />
      <van-field v-model="form.name" label="姓名" placeholder="请输入姓名" />
      <van-field name="gender" label="性别">
        <template #input>
          <van-radio-group v-model="form.gender" direction="horizontal">
            <van-radio name="male">男</van-radio>
            <van-radio name="female">女</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-button type="primary" block round :loading="loading" @click="handleRegister" style="margin-top:24px">注册</van-button>
    </div>
  </div>
</template>

<style scoped>
.register-page { min-height: 100vh; background: var(--bg); }
.form-wrap { background: #fff; margin: 16px; border-radius: var(--radius-md); padding: 8px 0; }
</style>
