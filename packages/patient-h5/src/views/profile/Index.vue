<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { showConfirmDialog } from 'vant'

const router = useRouter()
const auth = useAuthStore()

function handleLogout() {
  showConfirmDialog({ title: '退出登录', message: '确定要退出登录吗？' }).then(() => {
    auth.logout()
    router.replace('/login')
  }).catch(() => {})
}
</script>

<template>
  <div class="profile-page">
    <div class="user-header">
      <span class="avatar">{{ auth.user?.avatar || '👤' }}</span>
      <div class="name">{{ auth.user?.name || '用户' }}</div>
      <div class="phone">{{ auth.user?.phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') || '' }}</div>
      <van-tag v-if="auth.user?.realNameVerified" type="success" size="medium">已实名</van-tag>
      <van-tag v-else type="warning" size="medium" @click="router.push('/verify-identity')">去认证</van-tag>
    </div>

    <div class="menu-section">
      <van-cell title="当前服务机构" :value="auth.activeTenant?.tenantName || '未选择'" is-link @click="router.push('/tenant-switch')" />
      <van-cell title="租户绑定管理" :value="`${auth.user?.tenantBindings?.length || 0} 个机构`" is-link @click="router.push('/tenant-switch')" />
    </div>

    <div class="menu-section">
      <van-cell title="健康档案" icon="description" is-link @click="router.push('/health/records')" />
      <van-cell title="体征数据" icon="chart-trending-o" is-link @click="router.push('/health/vital-signs')" />
      <van-cell title="用药提醒" icon="clock-o" is-link @click="router.push('/reminders')" />
    </div>

    <div class="menu-section">
      <van-cell title="我的订单" icon="orders-o" is-link @click="router.push('/mall/orders')" />
      <van-cell title="我的收藏" icon="star-o" is-link />
      <van-cell title="收货地址" icon="location-o" is-link />
    </div>

    <div class="menu-section">
      <van-cell title="设置" icon="setting-o" is-link />
      <van-cell title="隐私管理" icon="shield-o" is-link />
      <van-cell title="关于我们" icon="info-o" is-link />
    </div>

    <div class="logout-btn">
      <van-button type="danger" block round @click="handleLogout">退出登录</van-button>
    </div>
  </div>
</template>

<style scoped>
.profile-page { min-height: 100vh; background: #f5f7fa; padding-bottom: 30px; }
.user-header { background: linear-gradient(135deg, #4A90D9, #6BB5FF); color: #fff; padding: 24px 16px; text-align: center; }
.avatar { font-size: 52px; display: block; margin-bottom: 8px; }
.name { font-size: 18px; font-weight: 600; }
.phone { font-size: 13px; opacity: 0.8; margin: 4px 0 8px; }
.menu-section { background: #fff; margin: 12px 16px; border-radius: 12px; overflow: hidden; }
.logout-btn { padding: 24px 16px; }
</style>
