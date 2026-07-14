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
        meta: { title: '数据概览', icon: 'Odometer' },
      },
      {
        path: 'doctors/list',
        name: 'DoctorList',
        component: () => import('@/views/doctors/List.vue'),
        meta: { title: '医生管理', icon: 'User' },
      },
      {
        path: 'doctors/invite',
        name: 'DoctorInvite',
        component: () => import('@/views/doctors/Invite.vue'),
        meta: { title: '邀请医生', parent: 'doctors' },
      },
      {
        path: 'doctors/detail/:id',
        name: 'DoctorDetail',
        component: () => import('@/views/doctors/Detail.vue'),
        meta: { title: '医生详情', parent: 'doctors' },
      },
      {
        path: 'patients/list',
        name: 'PatientList',
        component: () => import('@/views/patients/List.vue'),
        meta: { title: '患者管理', icon: 'Avatar' },
      },
      {
        path: 'patients/invite',
        name: 'PatientInvite',
        component: () => import('@/views/patients/Invite.vue'),
        meta: { title: '邀请患者', parent: 'patients' },
      },
      {
        path: 'patients/blacklist',
        name: 'PatientBlacklist',
        component: () => import('@/views/patients/Blacklist.vue'),
        meta: { title: '黑名单', parent: 'patients' },
      },
      {
        path: 'products/list',
        name: 'ProductList',
        component: () => import('@/views/products/List.vue'),
        meta: { title: '商品管理', icon: 'Goods' },
      },
      {
        path: 'products/create',
        name: 'ProductCreate',
        component: () => import('@/views/products/Create.vue'),
        meta: { title: '新增商品', parent: 'products' },
      },
      {
        path: 'products/edit/:id',
        name: 'ProductEdit',
        component: () => import('@/views/products/Edit.vue'),
        meta: { title: '编辑商品', parent: 'products' },
      },
      {
        path: 'orders/list',
        name: 'OrderList',
        component: () => import('@/views/orders/List.vue'),
        meta: { title: '订单管理', icon: 'List' },
      },
      {
        path: 'orders/detail/:id',
        name: 'OrderDetail',
        component: () => import('@/views/orders/Detail.vue'),
        meta: { title: '订单详情', parent: 'orders' },
      },
      {
        path: 'follow-up',
        name: 'FollowUp',
        component: () => import('@/views/follow-up/Index.vue'),
        meta: { title: '随访数据', icon: 'DataAnalysis' },
      },
      {
        path: 'assistants/templates',
        name: 'AssistantTemplates',
        component: () => import('@/views/assistants/Templates.vue'),
        meta: { title: '权限模板', icon: 'Setting' },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/settings/Index.vue'),
        meta: { title: '机构设置', icon: 'Tools' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
