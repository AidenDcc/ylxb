<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useElderlyStore } from '@/stores/elderly'

const router = useRouter()
const auth = useAuthStore()
const elderlyStore = useElderlyStore()
const active = ref(0)
const tabbarHeight = computed(() => elderlyStore.enabled ? '75px' : '70px')
const paddingBottom = computed(() => elderlyStore.enabled ? '75px' : '70px')
const contentMinHeight = computed(() => elderlyStore.enabled ? 'calc(100vh - 117px)' : 'calc(100vh - 112px)')

const tabs = [
  { label: '首页', icon: 'home-o', path: '/home' },
  { label: '圈子', icon: 'friends-o', path: '/community/circles' },
  { label: '咨询', icon: 'chat-o', path: '/consultation/list' },
  { label: '商城', icon: 'shop-o', path: '/mall/home' },
  { label: '我的', icon: 'contact-o', path: '/profile' },
]

// 根据当前路由更新tab
watch(() => router.currentRoute.value.path, (path) => {
  const idx = tabs.findIndex(t => path.startsWith(t.path.split('/').slice(0, 2).join('/')))
  if (idx >= 0) active.value = idx
}, { immediate: true })
</script>

<template>
  <div class="layout" :style="{ paddingBottom }">
    <!-- 顶部：租户切换 -->
    <div class="top-bar" v-if="auth.activeTenant">
      <div class="tenant-info" @click="router.push('/tenant-switch')">
        <span class="tenant-name">{{ auth.activeTenant.tenantName }}</span>
        <van-icon name="arrow-down" size="12" />
      </div>
    </div>

    <!-- 内容区 -->
    <div class="content" :style="{ minHeight: contentMinHeight }">
      <router-view />
    </div>

    <!-- 底部导航 -->
    <van-tabbar v-model="active" @change="(i: number) => router.push(tabs[i].path)" :fixed="true" :border="true" active-color="#2463EB" :style="{ '--van-tabbar-height': tabbarHeight, '--van-tabbar-item-active-font-weight': 'bold', '--van-tabbar-item-font-size': '14px', '--van-tabbar-item-font-weight': '500' }">
      <van-tabbar-item v-for="(tab, idx) in tabs" :key="idx" :icon="tab.icon">
        {{ tab.label }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script lang="ts">
import { ref, watch, computed } from 'vue'
</script>

<style scoped>
.layout {
  min-height: 100vh;
  padding-bottom: 70px;
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
  font-size: 14px;
}
.tenant-name {
  font-weight: 600;
}
.content {
  min-height: calc(100vh - 112px);
}
</style>
