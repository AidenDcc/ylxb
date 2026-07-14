<template>
  <el-container class="layout-container">
    <el-aside width="220px" class="layout-aside">
      <div class="logo">
        <span class="logo-icon">⚕️</span>
        <span class="logo-text">医路相伴</span>
        <span class="logo-tag">平台管理</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#4A90D9"
        class="side-menu"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据总览</span>
        </el-menu-item>

        <el-sub-menu index="/tenants">
          <template #title>
            <el-icon><OfficeBuilding /></el-icon>
            <span>租户管理</span>
          </template>
          <el-menu-item index="/tenants/applications">入驻审核</el-menu-item>
          <el-menu-item index="/tenants/list">租户列表</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/users">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>用户总览</span>
          </template>
          <el-menu-item index="/users/doctors">医生总览</el-menu-item>
          <el-menu-item index="/users/patients">患者总览</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/moderation">
          <template #title>
            <el-icon><Checked /></el-icon>
            <span>内容审核</span>
          </template>
          <el-menu-item index="/moderation/community">社区内容</el-menu-item>
          <el-menu-item index="/moderation/consultation">咨询记录</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/compliance">
          <template #title>
            <el-icon><DocumentChecked /></el-icon>
            <span>合规管理</span>
          </template>
          <el-menu-item index="/compliance/devices">设备白名单</el-menu-item>
          <el-menu-item index="/compliance/knowledge">知识库</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/system">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/system/config">系统配置</el-menu-item>
          <el-menu-item index="/system/logs">操作日志</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/profile">
          <el-icon><User /></el-icon>
          <span>个人中心</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="layout-header">
        <div class="header-left">
          <span class="platform-name">医路相伴 - 平台管理端</span>
        </div>
        <div class="header-right">
          <el-dropdown trigger="click">
            <div class="user-info">
              <el-avatar :size="32" icon="UserFilled" />
              <span class="user-name">{{ auth.user?.name || '管理员' }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/profile')">
                  <el-icon><User /></el-icon>个人中心
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="layout-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  DataAnalysis, OfficeBuilding, UserFilled, Checked,
  DocumentChecked, Setting, User, ArrowDown, SwitchButton,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const activeMenu = computed(() => {
  const path = route.path
  if (path.startsWith('/tenants')) return path
  if (path.startsWith('/users')) return path
  if (path.startsWith('/moderation')) return path
  if (path.startsWith('/compliance')) return path
  if (path.startsWith('/system')) return path
  return path
})

onMounted(() => {
  auth.restoreSession()
})

function handleLogout() {
  auth.logout()
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
.layout-container {
  height: 100%;
}

.layout-aside {
  background-color: #304156;
  overflow-y: auto;
  overflow-x: hidden;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #263445;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
}

.logo-icon {
  font-size: 24px;
}

.logo-tag {
  font-size: 11px;
  color: #bfcbd9;
  background: rgba(74, 144, 217, 0.2);
  padding: 1px 6px;
  border-radius: 4px;
}

.side-menu {
  border-right: none;
}

.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.platform-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;
}

.user-info:hover {
  background: #f5f7fa;
}

.user-name {
  font-size: 14px;
  color: #303133;
}

.layout-main {
  background: #f0f2f5;
  overflow-y: auto;
}
</style>
