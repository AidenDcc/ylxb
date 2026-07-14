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
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue'),
    meta: { title: '注册' },
  },
  {
    path: '/verify-identity',
    name: 'VerifyIdentity',
    component: () => import('@/views/auth/VerifyIdentity.vue'),
    meta: { title: '实名认证', requiresAuth: true },
  },
  {
    path: '/',
    component: () => import('@/views/Layout.vue'),
    redirect: '/home',
    children: [
      { path: 'home', name: 'Home', component: () => import('@/views/home/Index.vue'), meta: { title: '首页' } },
      { path: 'tenant-switch', name: 'TenantSwitch', component: () => import('@/views/TenantSwitch.vue'), meta: { title: '切换租户' } },
      // 健康档案
      { path: 'health/records', name: 'HealthRecords', component: () => import('@/views/health/Records.vue'), meta: { title: '健康档案' } },
      { path: 'health/records/:id', name: 'HealthRecordDetail', component: () => import('@/views/health/RecordDetail.vue'), meta: { title: '档案详情' } },
      { path: 'health/ocr-upload', name: 'OCRUpload', component: () => import('@/views/health/OCRUpload.vue'), meta: { title: '报告上传' } },
      { path: 'health/vital-signs', name: 'VitalSigns', component: () => import('@/views/health/VitalSigns.vue'), meta: { title: '体征数据' } },
      { path: 'health/medications', name: 'Medications', component: () => import('@/views/health/Medications.vue'), meta: { title: '用药记录' } },
      // 咨询
      { path: 'consultation/list', name: 'ConsultationList', component: () => import('@/views/consultation/List.vue'), meta: { title: '我的咨询' } },
      { path: 'consultation/chat/:id', name: 'ConsultationChat', component: () => import('@/views/consultation/Chat.vue'), meta: { title: '咨询对话' } },
      { path: 'consultation/doctors', name: 'DoctorList', component: () => import('@/views/consultation/DoctorList.vue'), meta: { title: '咨询医生' } },
      // 用药提醒
      { path: 'reminders', name: 'Reminders', component: () => import('@/views/reminders/Index.vue'), meta: { title: '用药提醒' } },
      // 商城
      { path: 'mall/home', name: 'MallHome', component: () => import('@/views/mall/Home.vue'), meta: { title: '医药商城' } },
      { path: 'mall/product/:id', name: 'ProductDetail', component: () => import('@/views/mall/ProductDetail.vue'), meta: { title: '商品详情' } },
      { path: 'mall/cart', name: 'Cart', component: () => import('@/views/mall/Cart.vue'), meta: { title: '购物车' } },
      { path: 'mall/orders', name: 'Orders', component: () => import('@/views/mall/Orders.vue'), meta: { title: '我的订单' } },
      { path: 'mall/order/:id', name: 'OrderDetail', component: () => import('@/views/mall/OrderDetail.vue'), meta: { title: '订单详情' } },
      // 病友圈子
      { path: 'community/circles', name: 'Circles', component: () => import('@/views/community/Circles.vue'), meta: { title: '病友圈子' } },
      { path: 'community/circle/:id', name: 'CirclePosts', component: () => import('@/views/community/CirclePosts.vue'), meta: { title: '圈子' } },
      { path: 'community/post/:id', name: 'PostDetail', component: () => import('@/views/community/PostDetail.vue'), meta: { title: '帖子详情' } },
      { path: 'community/create-post', name: 'CreatePost', component: () => import('@/views/community/CreatePost.vue'), meta: { title: '发帖' } },
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
