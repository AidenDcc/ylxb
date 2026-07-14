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
    redirect: '/home',
    children: [
      { path: 'home', name: 'Home', component: () => import('@/views/home/Index.vue'), meta: { title: '首页' } },
      { path: 'tenant-switch', name: 'TenantSwitch', component: () => import('@/views/TenantSwitch.vue'), meta: { title: '切换租户' } },
      // 患者管理
      { path: 'patients/list', name: 'PatientList', component: () => import('@/views/patients/List.vue'), meta: { title: '患者列表' } },
      { path: 'patients/detail/:id', name: 'PatientDetail', component: () => import('@/views/patients/Detail.vue'), meta: { title: '患者详情' } },
      // 咨询管理
      { path: 'consultation/list', name: 'ConsultationList', component: () => import('@/views/consultation/List.vue'), meta: { title: '咨询管理' } },
      { path: 'consultation/chat/:id', name: 'ConsultationChat', component: () => import('@/views/consultation/Chat.vue'), meta: { title: '咨询对话' } },
      // 随访管理
      { path: 'follow-up/list', name: 'FollowUpList', component: () => import('@/views/follow-up/List.vue'), meta: { title: '随访计划' } },
      { path: 'follow-up/create', name: 'FollowUpCreate', component: () => import('@/views/follow-up/Create.vue'), meta: { title: '创建随访' } },
      { path: 'follow-up/detail/:id', name: 'FollowUpDetail', component: () => import('@/views/follow-up/Detail.vue'), meta: { title: '随访详情' } },
      // 助理管理
      { path: 'assistants/list', name: 'AssistantList', component: () => import('@/views/assistants/List.vue'), meta: { title: '助理管理' } },
      { path: 'assistants/create', name: 'AssistantCreate', component: () => import('@/views/assistants/Create.vue'), meta: { title: '创建助理' } },
      { path: 'assistants/permission/:id', name: 'AssistantPermission', component: () => import('@/views/assistants/Permission.vue'), meta: { title: '权限配置' } },
      // 个人中心
      { path: 'profile', name: 'Profile', component: () => import('@/views/profile/Index.vue'), meta: { title: '我的' } },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/home' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
