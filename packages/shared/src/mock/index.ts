/**
 * Mock 数据注册入口
 * 在应用启动时调用 setupMock() 注册所有 API mock 处理器
 */
import { registerMock, ok, paginatedOk } from '../api/request'
import * as data from './data'
import { generateId, getNowStr } from '../utils'

export function setupMock(): void {
  // ==================== 认证模块 ====================
  registerMock('POST', '/auth/login', (body) => {
    const { phone } = body as { phone: string; password: string }
    if (phone === '13800001111') {
      return ok({ user: data.mockPatients[0], token: 'mock-token-p1' })
    }
    if (phone === '13900001111') {
      return ok({ user: data.mockDoctors[0], token: 'mock-token-d1' })
    }
    if (phone === '13900009999') {
      return ok({ user: { ...data.mockPatients[0], role: 'tenant_admin', id: 'admin1', name: '管理员', phone: '13900009999', tenantBindings: [{ tenantId: 't1', tenantName: '仁济医院', tenantType: 'hospital', role: 'tenant_admin', joinedAt: '2024-01-01T00:00:00Z' }], activeTenantId: 't1' }, token: 'mock-token-admin' })
    }
    if (phone === '13900008888') {
      return ok({ user: { ...data.mockPatients[0], role: 'platform_admin', id: 'super1', name: '超级管理员', phone: '13900008888', tenantBindings: [], activeTenantId: null }, token: 'mock-token-super' })
    }
    return { code: 401, message: '手机号或密码错误', data: null }
  })

  registerMock('POST', '/auth/register', (body) => {
    return ok({ userId: generateId(), message: '注册成功，请完成实名认证' })
  })

  registerMock('POST', '/auth/verify-identity', () => {
    return ok({ verified: true, message: '实名认证提交成功，审核中' })
  })

  registerMock('GET', '/user/info', () => {
    return ok(data.mockPatients[0])
  })

  registerMock('PUT', '/user/profile', (body) => {
    return ok({ ...data.mockPatients[0], ...(body as object) })
  })

  // ==================== 租户模块 ====================
  registerMock('GET', '/tenant/list', () => {
    return ok(data.mockTenants.filter((t) => t.status === 'active'))
  })

  registerMock('GET', '/tenant/my-bindings', () => {
    return ok(data.mockPatients[0].tenantBindings)
  })

  registerMock('POST', '/tenant/switch', (body) => {
    const { tenantId } = body as { tenantId: string }
    return ok({ activeTenantId: tenantId, message: '租户切换成功' })
  })

  // ==================== 健康档案 ====================
  registerMock('GET', '/health/records', () => {
    return ok(data.mockHealthRecords)
  })

  registerMock('GET', /^\/health\/records\/\w+$/, () => {
    return ok(data.mockHealthRecords[0])
  })

  registerMock('POST', '/health/records', (body) => {
    const newRecord = { id: generateId(), ...(body as object), createdAt: getNowStr(), updatedAt: getNowStr() }
    return ok(newRecord)
  })

  registerMock('POST', '/health/ocr', () => {
    return ok({
      raw: '模拟OCR识别结果',
      confidence: 0.92,
      structured: {
        items: [
          { name: '空腹血糖', value: '6.8', referenceRange: '3.9-6.1', unit: 'mmol/L', abnormal: true },
          { name: '总胆固醇', value: '5.2', referenceRange: '2.8-5.7', unit: 'mmol/L', abnormal: false },
        ],
        summary: '检测到血糖偏高，请注意控制',
      },
    })
  })

  // ==================== 体征数据 ====================
  registerMock('GET', '/health/vital-signs', () => {
    return ok(data.mockVitalSigns)
  })

  registerMock('GET', /^\/health\/vital-signs\/latest$/, () => {
    return ok(data.mockVitalSigns.slice(0, 6))
  })

  // ==================== 用药提醒 ====================
  registerMock('GET', '/health/reminders', () => {
    return ok(data.mockReminders)
  })

  registerMock('POST', '/health/reminders', (body) => {
    const newReminder = { id: generateId(), ...(body as object), createdAt: getNowStr() }
    return ok(newReminder)
  })

  registerMock('PUT', /^\/health\/reminders\/\w+$/, (body) => {
    return ok(body)
  })

  registerMock('DELETE', /^\/health\/reminders\/\w+$/, () => {
    return ok({ deleted: true })
  })

  // ==================== 医患咨询 ====================
  registerMock('GET', '/consultation/sessions', () => {
    return ok(data.mockSessions)
  })

  registerMock('GET', /^\/consultation\/sessions\/\w+$/, () => {
    return ok(data.mockSessions[0])
  })

  registerMock('GET', /^\/consultation\/messages\/\w+$/, (params) => {
    const url = (params as { url?: string })?.url || ''
    const sessionId = url.split('/').pop() || 'cs1'
    return ok(data.mockMessages[sessionId] || [])
  })

  registerMock('POST', '/consultation/sessions', (body) => {
    const newSession = {
      id: generateId(),
      ...(body as object),
      status: 'active',
      unreadPatientCount: 0,
      unreadDoctorCount: 1,
      lastMessageAt: getNowStr(),
      createdAt: getNowStr(),
    }
    return ok(newSession)
  })

  registerMock('POST', '/consultation/messages', (body) => {
    const { sessionId } = body as { sessionId: string }
    const newMsg = {
      id: generateId(),
      sessionId,
      ...(body as object),
      createdAt: getNowStr(),
    }
    if (data.mockMessages[sessionId]) {
      data.mockMessages[sessionId].push(newMsg as never)
    }
    return ok(newMsg)
  })

  registerMock('POST', '/consultation/close', (body) => {
    return ok({ status: 'closed', closedAt: getNowStr() })
  })

  registerMock('POST', '/consultation/rate', (body) => {
    return ok({ ...(body as object), ratedAt: getNowStr() })
  })

  // ==================== 商城模块 ====================
  registerMock('GET', '/mall/products', () => {
    return ok(data.mockProducts)
  })

  registerMock('GET', /^\/mall\/products\/\w+$/, () => {
    return ok(data.mockProducts[0])
  })

  registerMock('GET', '/mall/cart', () => {
    return ok(data.mockCartItems)
  })

  registerMock('POST', '/mall/cart/add', (body) => {
    const newItem = { id: generateId(), ...(body as object) }
    data.mockCartItems.push(newItem as never)
    return ok(data.mockCartItems)
  })

  registerMock('PUT', '/mall/cart/update', (body) => {
    return ok(body)
  })

  registerMock('DELETE', /^\/mall\/cart\/\w+$/, () => {
    return ok({ deleted: true })
  })

  registerMock('GET', '/mall/orders', () => {
    return ok(data.mockOrders)
  })

  registerMock('GET', /^\/mall\/orders\/\w+$/, () => {
    return ok(data.mockOrders[0])
  })

  registerMock('POST', '/mall/orders', (body) => {
    const newOrder = {
      id: generateId(),
      orderNo: 'YLXB' + Date.now(),
      ...(body as object),
      status: 'pending',
      createdAt: getNowStr(),
    }
    return ok(newOrder)
  })

  registerMock('GET', '/mall/addresses', () => {
    return ok(data.mockAddresses)
  })

  registerMock('POST', '/mall/addresses', (body) => {
    const newAddr = { id: generateId(), ...(body as object) }
    return ok(newAddr)
  })

  // ==================== 病友圈子 ====================
  registerMock('GET', '/community/circles', () => {
    return ok(data.mockCircles)
  })

  registerMock('GET', /^\/community\/circles\/\w+$/, () => {
    return ok(data.mockCircles[0])
  })

  registerMock('GET', /^\/community\/posts\?circleId=/, (params) => {
    const url = (params as { url?: string })?.url || ''
    const circleId = new URLSearchParams(url.split('?')[1] || '').get('circleId')
    const posts = circleId ? data.mockPosts.filter((p) => p.circleId === circleId) : data.mockPosts
    return ok(posts)
  })

  registerMock('GET', /^\/community\/posts\/\w+$/, (params) => {
    const url = (params as { url?: string })?.url || ''
    const postId = url.split('/').pop() || 'post1'
    return ok(data.mockPosts.find((p) => p.id === postId) || data.mockPosts[0])
  })

  registerMock('GET', /^\/community\/comments\/\w+$/, (params) => {
    const url = (params as { url?: string })?.url || ''
    const postId = url.split('/').pop() || 'post1'
    return ok(data.mockComments[postId] || [])
  })

  registerMock('POST', '/community/posts', (body) => {
    const newPost = { id: generateId(), ...(body as object), likeCount: 0, commentCount: 0, collectCount: 0, isLiked: false, isCollected: false, isPinned: false, isEssence: false, status: 'normal', createdAt: getNowStr() }
    return ok(newPost)
  })

  registerMock('POST', '/community/comments', (body) => {
    const newComment = { id: generateId(), ...(body as object), likeCount: 0, isLiked: false, createdAt: getNowStr() }
    return ok(newComment)
  })

  registerMock('POST', '/community/like', (body) => {
    return ok({ isLiked: true })
  })

  registerMock('POST', '/community/collect', (body) => {
    return ok({ isCollected: true })
  })

  // ==================== 医生端 ====================
  registerMock('GET', '/doctor/patients', () => {
    return ok(data.mockPatients.map((p) => ({ ...p, idCard: undefined })))
  })

  registerMock('GET', /^\/doctor\/patients\/\w+$/, () => {
    const patient = { ...data.mockPatients[0] }
    return ok({ ...patient, healthRecords: data.mockHealthRecords, vitalSigns: data.mockVitalSigns.slice(0, 6) })
  })

  registerMock('GET', '/doctor/consultations', () => {
    return ok(data.mockSessions)
  })

  registerMock('GET', '/doctor/assistants', () => {
    return ok(data.mockAssistants)
  })

  registerMock('POST', '/doctor/assistants', (body) => {
    const newAssistant = { id: generateId(), ...(body as object), createdAt: getNowStr(), status: 'active' }
    return ok(newAssistant)
  })

  registerMock('PUT', /^\/doctor\/assistants\/\w+$/, (body) => {
    return ok(body)
  })

  registerMock('GET', '/doctor/follow-ups', () => {
    return ok(data.mockFollowUpPlans)
  })

  registerMock('GET', /^\/doctor\/follow-ups\/\w+$/, () => {
    return ok(data.mockFollowUpPlans[0])
  })

  registerMock('POST', '/doctor/follow-ups', (body) => {
    const newPlan = { id: generateId(), ...(body as object), totalTasks: 0, completedTasks: 0, createdAt: getNowStr() }
    return ok(newPlan)
  })

  registerMock('GET', /^\/doctor\/follow-up-tasks\/\w+$/, (params) => {
    const url = (params as { url?: string })?.url || ''
    const planId = url.split('/').pop()
    return ok(data.mockFollowUpTasks.filter((t) => t.planId === planId))
  })

  // ==================== 医患管理端 ====================
  registerMock('GET', '/management/dashboard', () => {
    return ok({
      doctorCount: 45, patientCount: 3200, consultationCount: 356,
      orderCount: 128, revenue: 56800,
      weeklyConsultations: [12, 19, 15, 22, 18, 25, 20],
      weeklyOrders: [5, 8, 6, 10, 7, 12, 9],
    })
  })

  registerMock('GET', '/management/doctors', () => {
    return ok(data.mockDoctors.map((d) => ({ ...d, idCard: undefined })))
  })

  registerMock('POST', '/management/doctors/invite', (body) => {
    return ok({ invited: true, message: '邀请已发送' })
  })

  registerMock('DELETE', /^\/management\/doctors\/\w+$/, () => {
    return ok({ removed: true })
  })

  registerMock('GET', '/management/patients', () => {
    return ok(data.mockPatients.map((p) => ({ ...p, idCard: undefined })))
  })

  registerMock('POST', '/management/patients/invite', (body) => {
    return ok({ invited: true, message: '邀请已发送' })
  })

  registerMock('POST', /^\/management\/patients\/\w+\/blacklist$/, () => {
    return ok({ blacklisted: true })
  })

  registerMock('GET', '/management/products', () => {
    return ok(data.mockProducts)
  })

  registerMock('POST', '/management/products', (body) => {
    const newProduct = { id: generateId(), ...(body as object), sales: 0, createdAt: getNowStr() }
    return ok(newProduct)
  })

  registerMock('PUT', /^\/management\/products\/\w+$/, (body) => {
    return ok(body)
  })

  registerMock('GET', '/management/orders', () => {
    return ok(data.mockOrders)
  })

  registerMock('GET', /^\/management\/orders\/\w+$/, () => {
    return ok(data.mockOrders[0])
  })

  registerMock('PUT', /^\/management\/orders\/\w+\/status$/, (body) => {
    return ok(body)
  })

  // ==================== 平台端 ====================
  registerMock('GET', '/platform/dashboard', () => {
    return ok({
      tenantCount: 12, doctorCount: 380, patientCount: 15600,
      consultationCount: 23400, orderCount: 8900, revenue: 2560000,
      pendingApplications: 3,
      tenantGrowth: [5, 6, 7, 8, 9, 10, 12],
      monthlyRevenue: [180000, 220000, 250000, 280000, 310000, 350000, 380000],
    })
  })

  registerMock('GET', '/platform/tenants', () => {
    return ok(data.mockTenants)
  })

  registerMock('GET', /^\/platform\/tenants\/\w+$/, () => {
    return ok(data.mockTenants[0])
  })

  registerMock('GET', '/platform/applications', () => {
    return ok(data.mockApplications)
  })

  registerMock('POST', /^\/platform\/applications\/\w+\/approve$/, () => {
    return ok({ approved: true, tenantId: generateId() })
  })

  registerMock('POST', /^\/platform\/applications\/\w+\/reject$/, () => {
    return ok({ rejected: true })
  })

  registerMock('GET', '/platform/users/doctors', () => {
    return ok(data.mockDoctors.map((d) => ({ ...d, idCard: undefined })))
  })

  registerMock('GET', '/platform/users/patients', () => {
    return ok(data.mockPatients.map((p) => ({ ...p, idCard: undefined })))
  })

  registerMock('GET', '/platform/moderation/posts', () => {
    return ok(data.mockPosts)
  })

  registerMock('POST', /^\/platform\/moderation\/posts\/\w+\/hide$/, () => {
    return ok({ hidden: true })
  })

  registerMock('GET', '/platform/compliance/devices', () => {
    return ok([
      { id: 'dev1', name: '欧姆龙电子血压计 HEM-7124', manufacturer: '欧姆龙', type: '血压计', certificationNo: '辽械注准20162070001', status: 'approved' },
      { id: 'dev2', name: '三诺血糖仪 安稳+型', manufacturer: '三诺生物', type: '血糖仪', certificationNo: '湘械注准20152070002', status: 'approved' },
      { id: 'dev3', name: '鱼跃血氧仪 YX301', manufacturer: '鱼跃医疗', type: '血氧仪', certificationNo: '苏械注准20172070003', status: 'approved' },
    ])
  })

  registerMock('GET', '/platform/compliance/knowledge', () => {
    return ok([
      { id: 'kb1', title: '高血压防治指南（2024版）', category: '诊疗指南', author: '中华医学会', updatedAt: '2024-03-01' },
      { id: 'kb2', title: '2型糖尿病基层诊疗指南', category: '诊疗指南', author: '中华医学会', updatedAt: '2024-02-15' },
      { id: 'kb3', title: '慢病患者居家自我管理手册', category: '患者教育', author: '平台运营', updatedAt: '2024-06-01' },
    ])
  })

  registerMock('GET', '/platform/system/config', () => {
    return ok({
      siteName: '医路相伴',
      maxTenantDoctors: 200,
      maxTenantPatients: 50000,
      consultationArchiveDays: 365,
      contentReviewRequired: true,
    })
  })

  registerMock('GET', '/platform/audit-logs', () => {
    return ok([
      { id: 'log1', userId: 'admin1', userName: '张院长', action: '邀请医生入驻', target: '陈主任', tenantId: 't1', createdAt: '2024-08-01T10:00:00Z' },
      { id: 'log2', userId: 'super1', userName: '超级管理员', action: '审核通过租户入驻', target: '健康大药房', createdAt: '2024-07-15T14:00:00Z' },
      { id: 'log3', userId: 'd1', userName: '陈主任', action: '创建随访计划', target: '张建国-高血压随访', tenantId: 't1', createdAt: '2024-07-20T09:00:00Z' },
    ])
  })

  // ==================== 随访（患者端） ====================
  registerMock('GET', '/follow-up/plans', () => {
    return ok(data.mockFollowUpPlans)
  })

  registerMock('GET', '/follow-up/tasks', () => {
    return ok(data.mockFollowUpTasks)
  })

  registerMock('POST', '/follow-up/tasks/submit', (body) => {
    return ok({ ...(body as object), submittedAt: getNowStr(), status: 'completed' })
  })

  console.log('[Mock] 所有 API Mock 处理器已注册')
}
