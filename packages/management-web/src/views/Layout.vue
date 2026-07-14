<template>
  <div class="layout">
    <!-- Sidebar -->
    <aside class="layout-sidebar">
      <div class="sidebar-logo">
        <span class="logo-icon">🏥</span>
        <span class="logo-text">医路相伴</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="false"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#4A90D9"
        router
      >
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <span>数据概览</span>
        </el-menu-item>

        <el-sub-menu index="doctors">
          <template #title>
            <el-icon><User /></el-icon>
            <span>医生管理</span>
          </template>
          <el-menu-item index="/doctors/list">医生列表</el-menu-item>
          <el-menu-item index="/doctors/invite">邀请医生</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="patients">
          <template #title>
            <el-icon><Avatar /></el-icon>
            <span>患者管理</span>
          </template>
          <el-menu-item index="/patients/list">患者列表</el-menu-item>
          <el-menu-item index="/patients/invite">邀请患者</el-menu-item>
          <el-menu-item index="/patients/blacklist">黑名单</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="products">
          <template #title>
            <el-icon><Goods /></el-icon>
            <span>商品管理</span>
          </template>
          <el-menu-item index="/products/list">商品列表</el-menu-item>
          <el-menu-item index="/products/create">新增商品</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="orders">
          <template #title>
            <el-icon><List /></el-icon>
            <span>订单管理</span>
          </template>
          <el-menu-item index="/orders/list">订单列表</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/follow-up">
          <el-icon><DataAnalysis /></el-icon>
          <span>随访数据</span>
        </el-menu-item>

        <el-menu-item index="/assistants/templates">
          <el-icon><Setting /></el-icon>
          <span>权限模板</span>
        </el-menu-item>

        <el-menu-item index="/settings">
          <el-icon><Tools /></el-icon>
          <span>机构设置</span>
        </el-menu-item>
      </el-menu>
    </aside>

    <!-- Main area -->
    <div class="layout-main">
      <!-- Header -->
      <header class="layout-header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentTitle">{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <span class="tenant-name">{{ authStore.tenantName }}</span>
          <el-dropdown trigger="click">
            <div class="user-avatar">
              <el-avatar :size="32" icon="UserFilled" />
              <span class="user-name">{{ authStore.user?.name || '管理员' }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$router.push('/settings')">
                  <el-icon><Tools /></el-icon>机构设置
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- Content -->
      <main class="layout-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Odometer, User, Avatar, Goods, List, DataAnalysis,
  Setting, Tools, ArrowDown, SwitchButton,
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const activeMenu = computed(() => route.path)
const currentTitle = computed(() => route.meta?.title as string || '')

function handleLogout() {
  authStore.logout()
  router.push('/login')
  ElMessage.success('已退出登录')
}
</script>

<style scoped>
.layout {
  display: flex;
  width: 100%;
  height: 100vh;
}

.layout-sidebar {
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  background-color: #304156;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-logo .logo-icon {
  font-size: 24px;
}

.sidebar-logo .logo-text {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  min-height: var(--header-height);
  padding: 0 20px;
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.tenant-name {
  font-size: 13px;
  color: var(--text-secondary);
  padding: 4px 12px;
  background: var(--medical-blue-bg);
  border-radius: 4px;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.user-name {
  font-size: 14px;
  color: var(--text-primary);
}

.layout-content {
  flex: 1;
  overflow-y: auto;
  background: var(--bg-color);
}
</style>
