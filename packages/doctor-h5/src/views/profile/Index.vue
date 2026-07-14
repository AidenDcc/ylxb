<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { showToast } from 'vant'

const router = useRouter()
const auth = useAuthStore()

function handleLogout() {
  auth.logout()
  showToast('已退出登录')
  router.replace('/login')
}

function goAssistantList() {
  router.push('/assistants/list')
}

function goTenantSwitch() {
  router.push('/tenant-switch')
}
</script>

<template>
  <div class="profile-page">
    <!-- 医生信息卡片 -->
    <div class="profile-header">
      <div class="header-bg"></div>
      <div class="header-content">
        <span class="avatar">{{ auth.user?.avatar || '👨‍⚕️' }}</span>
        <div class="name">{{ auth.user?.name || '未登录' }}</div>
        <div class="title">
          <van-tag type="primary" size="medium">{{ auth.user?.title || '' }}</van-tag>
          <span class="dept">{{ auth.user?.department || '' }}</span>
        </div>
        <div class="hospital" v-if="auth.user?.hospital">{{ auth.user.hospital }}</div>
        <div class="stats-row" v-if="auth.user">
          <div class="stat-item">
            <span class="stat-value">{{ auth.user.consultationCount || 0 }}</span>
            <span class="stat-label">累计咨询</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ auth.user.certifications?.length || 0 }}</span>
            <span class="stat-label">资质证书</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ auth.user.specialties?.length || 0 }}</span>
            <span class="stat-label">专长领域</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 专长标签 -->
    <div class="specialties-section" v-if="auth.user?.specialties && auth.user.specialties.length > 0">
      <div class="section-label">专长领域</div>
      <div class="tags">
        <van-tag v-for="s in auth.user.specialties" :key="s" type="primary" size="medium" style="margin-right:8px; margin-bottom:6px;">
          {{ s }}
        </van-tag>
      </div>
    </div>

    <!-- 简介 -->
    <div class="bio-section" v-if="auth.user?.bio">
      <div class="section-label">个人简介</div>
      <div class="bio-text">{{ auth.user.bio }}</div>
    </div>

    <!-- 功能菜单 -->
    <div class="menu-section">
      <div class="menu-title">功能菜单</div>
      <van-cell title="切换服务机构" is-link :value="auth.activeTenant?.tenantName || '未选择'" @click="goTenantSwitch" />
      <van-cell title="助理管理" is-link @click="goAssistantList" />
      <van-cell title="资质证书" is-link :value="auth.user?.certifications?.join(', ') || '暂无'" />
    </div>

    <!-- 设置菜单 -->
    <div class="menu-section">
      <div class="menu-title">设置</div>
      <van-cell title="消息通知" is-link />
      <van-cell title="隐私设置" is-link />
      <van-cell title="关于我们" is-link value="v1.0.0" />
    </div>

    <!-- 退出登录 -->
    <div style="padding: 20px 16px;">
      <van-button type="danger" block round @click="handleLogout">退出登录</van-button>
    </div>
  </div>
</template>

<style scoped>
.profile-page { min-height: 100vh; background: #f5f7fa; padding-bottom: 20px; }
.profile-header { position: relative; overflow: hidden; }
.header-bg { background: linear-gradient(135deg, #4A90D9, #6BB5FF); height: 140px; }
.header-content { text-align: center; margin-top: -70px; position: relative; z-index: 1; }
.avatar { font-size: 64px; display: block; margin-bottom: 8px; }
.name { font-size: 20px; font-weight: 700; color: #333; }
.title { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 6px; }
.dept { font-size: 13px; color: #666; }
.hospital { font-size: 13px; color: #999; margin-top: 4px; }
.stats-row { display: flex; justify-content: center; gap: 30px; margin-top: 16px; background: #fff; border-radius: 12px; padding: 12px 20px; margin-left: 16px; margin-right: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.stat-item { text-align: center; }
.stat-value { font-size: 20px; font-weight: 700; color: #4A90D9; display: block; }
.stat-label { font-size: 11px; color: #999; margin-top: 2px; }
.specialties-section, .bio-section { background: #fff; margin: 12px 16px; border-radius: 12px; padding: 14px; }
.section-label { font-size: 13px; color: #999; margin-bottom: 8px; }
.tags { display: flex; flex-wrap: wrap; }
.bio-text { font-size: 13px; color: #666; line-height: 1.6; }
.menu-section { background: #fff; margin: 12px 16px; border-radius: 12px; overflow: hidden; }
.menu-title { font-size: 13px; color: #999; padding: 12px 16px 4px; }
</style>
