<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { showToast } from 'vant'

const router = useRouter()
const auth = useAuthStore()

async function handleSwitch(tenantId: string) {
  const res = await auth.switchTenant(tenantId)
  if (res.code === 0) {
    showToast('切换成功')
    router.back()
  }
}
</script>

<template>
  <div class="tenant-switch-page">
    <van-nav-bar title="选择服务机构" left-arrow @click-left="router.back()" />
    <div class="tenant-list">
      <div
        v-for="b in auth.getTenantBindings()"
        :key="b.tenantId"
        class="tenant-item"
        :class="{ active: b.tenantId === auth.user?.activeTenantId }"
        @click="handleSwitch(b.tenantId)"
      >
        <div class="tenant-info">
          <span class="tenant-name">{{ b.tenantName }}</span>
          <span class="tenant-type">
            <van-icon :name="b.tenantType === 'hospital' ? 'hotel-o' : b.tenantType === 'pharmacy' ? 'orders-o' : 'contact-o'" size="14" />
            {{ b.role === 'patient' ? '患者' : '医生' }}
          </span>
        </div>
        <van-icon v-if="b.tenantId === auth.user?.activeTenantId" name="success" color="var(--primary-blue)" size="20" />
      </div>
    </div>
    <div class="hint">
      <van-notice-bar left-icon="info-o" text="切换服务机构后，咨询、商城等服务将切换至对应机构的专属资源" wrapable />
    </div>
  </div>
</template>

<style scoped>
.tenant-switch-page { min-height: 100vh; background: var(--bg); }
.tenant-list { margin: 16px; background: #fff; border-radius: var(--radius-md); overflow: hidden; }
.tenant-item { padding: 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); cursor: pointer; }
.tenant-item.active { background: #f0f7ff; }
.tenant-name { font-size: 16px; font-weight: 500; display: block; }
.tenant-type { font-size: 14px; color: var(--text-secondary); margin-top: 4px; display: block; }
.hint { padding: 0 16px; }
</style>
