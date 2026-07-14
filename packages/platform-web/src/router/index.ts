import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/',
    component: () => import('@/views/Layout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Index.vue'),
        meta: { title: '数据总览' },
      },
      {
        path: 'tenants/applications',
        name: 'TenantApplications',
        component: () => import('@/views/tenants/Applications.vue'),
        meta: { title: '入驻审核' },
      },
      {
        path: 'tenants/list',
        name: 'TenantList',
        component: () => import('@/views/tenants/List.vue'),
        meta: { title: '租户列表' },
      },
      {
        path: 'tenants/detail/:id',
        name: 'TenantDetail',
        component: () => import('@/views/tenants/Detail.vue'),
        meta: { title: '租户详情' },
      },
      {
        path: 'users/doctors',
        name: 'UserDoctors',
        component: () => import('@/views/users/Doctors.vue'),
        meta: { title: '医生总览' },
      },
      {
        path: 'users/patients',
        name: 'UserPatients',
        component: () => import('@/views/users/Patients.vue'),
        meta: { title: '患者总览' },
      },
      {
        path: 'moderation/community',
        name: 'ModerationCommunity',
        component: () => import('@/views/moderation/Community.vue'),
        meta: { title: '社区审核' },
      },
      {
        path: 'moderation/consultation',
        name: 'ModerationConsultation',
        component: () => import('@/views/moderation/Consultation.vue'),
        meta: { title: '咨询审核' },
      },
      {
        path: 'compliance/devices',
        name: 'ComplianceDevices',
        component: () => import('@/views/compliance/Devices.vue'),
        meta: { title: '设备合规' },
      },
      {
        path: 'compliance/knowledge',
        name: 'ComplianceKnowledge',
        component: () => import('@/views/compliance/Knowledge.vue'),
        meta: { title: '知识库' },
      },
      {
        path: 'system/config',
        name: 'SystemConfig',
        component: () => import('@/views/system/Config.vue'),
        meta: { title: '系统配置' },
      },
      {
        path: 'system/logs',
        name: 'SystemLogs',
        component: () => import('@/views/system/Logs.vue'),
        meta: { title: '操作日志' },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/Index.vue'),
        meta: { title: '个人中心' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
