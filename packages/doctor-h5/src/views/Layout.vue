<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const active = ref(0)

const tabs = [
  { label: '首页', icon: 'home-o', path: '/home' },
  { label: '患者', icon: 'friends-o', path: '/patients/list' },
  { label: '咨询', icon: 'chat-o', path: '/consultation/list' },
  { label: '随访', icon: 'todo-list-o', path: '/follow-up/list' },
  { label: '我的', icon: 'user-o', path: '/profile' },
]

watch(() => router.currentRoute.value.path, (path) => {
  const idx = tabs.findIndex(t => {
    const prefix = t.path.split('/').slice(0, 2).join('/')
    return path.startsWith(prefix)
  })
  if (idx >= 0) active.value = idx
}, { immediate: true })
</script>

<template>
  <div class="layout">
    <div class="top-bar" v-if="auth.activeTenant">
      <div class="tenant-info" @click="router.push('/tenant-switch')">
        <span class="tenant-name">{{ auth.activeTenant.tenantName }}</span>
        <van-icon name="arrow-down" size="12" />
      </div>
    </div>

    <div class="content">
      <router-view />
    </div>

    <van-tabbar v-model="active" @change="(i: number) => router.push(tabs[i].path)" :fixed="true" :border="true" active-color="#4A90D9">
      <van-tabbar-item v-for="(tab, idx) in tabs" :key="idx" :icon="tab.icon">
        {{ tab.label }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script lang="ts">
import { ref, watch } from 'vue'
</script>

<style scoped>
.layout {
  min-height: 100vh;
  padding-bottom: 50px;
  background: #f5f7fa;
}
.top-bar {
  background: var(--primary, #4A90D9);
  color: #fff;
  padding: 8px 16px;
  display: flex;
  justify-content: center;
}
.tenant-info {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 13px;
}
.tenant-name {
  font-weight: 500;
}
.content {
  min-height: calc(100vh - 92px);
}
</style>
