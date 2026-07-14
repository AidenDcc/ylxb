/**
 * Mock 静态数据
 * 所有演示数据集中管理
 */
import type { User, Patient, Doctor, AssistantAccount, TenantBinding } from '../types/user'
import type { Tenant, TenantApplication } from '../types/tenant'
import type { HealthRecord, VitalSign, MedicationReminder, MedicationRecord } from '../types/health'
import type { ConsultationSession, ConsultationMessage } from '../types/consultation'
import type { Product, Order, CartItem, ShippingAddress } from '../types/mall'
import type { Circle, Post, Comment } from '../types/community'
import type { FollowUpPlan, FollowUpTask } from '../types/followup'

// ==================== 租户数据 ====================
export const mockTenants: Tenant[] = [
  {
    id: 't1', name: '仁济医院', type: 'hospital', logo: '🏥',
    description: '三级甲等综合医院，提供全面慢病管理服务',
    address: '上海市黄浦区南京东路100号', contactPhone: '021-12345678', contactPerson: '张院长',
    businessLicense: 'BL-20230001', certifications: ['医疗执业许可证', '三甲资质'],
    status: 'active', doctorCount: 45, patientCount: 3200, productCount: 0, orderCount: 0,
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 't2', name: '健康大药房', type: 'pharmacy', logo: '💊',
    description: '连锁药房，提供处方药、OTC药品及医疗器械',
    address: '上海市浦东新区张杨路500号', contactPhone: '021-87654321', contactPerson: '李经理',
    businessLicense: 'BL-20230015', certifications: ['药品经营许可证', '医疗器械经营许可证'],
    status: 'active', doctorCount: 0, patientCount: 1500, productCount: 86, orderCount: 0,
    createdAt: '2024-02-20T00:00:00Z',
  },
  {
    id: 't3', name: '康宁诊所', type: 'clinic', logo: '🩺',
    description: '社区连锁诊所，专注慢病管理与康复指导',
    address: '上海市徐汇区漕溪北路200号', contactPhone: '021-55667788', contactPerson: '王主任',
    businessLicense: 'BL-20240008', certifications: ['医疗执业许可证'],
    status: 'active', doctorCount: 8, patientCount: 600, productCount: 0, orderCount: 0,
    createdAt: '2024-03-10T00:00:00Z',
  },
]

// ==================== 用户数据 ====================
const binding1: TenantBinding = { tenantId: 't1', tenantName: '仁济医院', tenantType: 'hospital', role: 'patient', joinedAt: '2024-06-01T00:00:00Z' }
const binding2: TenantBinding = { tenantId: 't2', tenantName: '健康大药房', tenantType: 'pharmacy', role: 'patient', joinedAt: '2024-07-15T00:00:00Z' }

export const mockPatients: Patient[] = [
  {
    id: 'p1', phone: '13800001111', name: '张建国', avatar: '👨‍🦳', gender: 'male',
    role: 'patient', realNameVerified: true, verificationStatus: 'verified',
    idCard: '310101196505120011',
    tenantBindings: [binding1, binding2], activeTenantId: 't1',
    birthDate: '1965-05-12', medicalHistory: ['高血压', '2型糖尿病'],
    emergencyContact: '张小明', emergencyPhone: '13800002222',
    address: '上海市黄浦区人民路50号301室',
    createdAt: '2024-05-01T00:00:00Z',
  },
  {
    id: 'p2', phone: '13800003333', name: '李美华', avatar: '👩‍🦰', gender: 'female',
    role: 'patient', realNameVerified: true, verificationStatus: 'verified',
    idCard: '310101198810150022',
    tenantBindings: [binding1], activeTenantId: 't1',
    birthDate: '1988-10-15', medicalHistory: ['甲状腺结节'],
    emergencyContact: '李建国', emergencyPhone: '13800004444',
    createdAt: '2024-06-10T00:00:00Z',
  },
  {
    id: 'p3', phone: '13800005555', name: '王大力', avatar: '👨‍💼', gender: 'male',
    role: 'patient', realNameVerified: false, verificationStatus: 'pending',
    tenantBindings: [binding2], activeTenantId: 't2',
    createdAt: '2024-08-01T00:00:00Z',
  },
]

const doctorBinding1: TenantBinding = { tenantId: 't1', tenantName: '仁济医院', tenantType: 'hospital', role: 'doctor', joinedAt: '2024-01-20T00:00:00Z' }
const doctorBinding2: TenantBinding = { tenantId: 't3', tenantName: '康宁诊所', tenantType: 'clinic', role: 'doctor', joinedAt: '2024-04-01T00:00:00Z' }

export const mockDoctors: Doctor[] = [
  {
    id: 'd1', phone: '13900001111', name: '陈主任', avatar: '👨‍⚕️', gender: 'male',
    role: 'doctor', realNameVerified: true, verificationStatus: 'verified',
    tenantBindings: [doctorBinding1, doctorBinding2], activeTenantId: 't1',
    title: '主任医师', department: '心血管内科', hospital: '仁济医院',
    certifications: ['医师执业证书', '心血管专科证书'],
    consultationCount: 1250,
    tenantPatients: { 't1': ['p1', 'p2'], 't3': [] },
    bio: '从事心血管内科临床工作20年，擅长高血压、冠心病诊治及慢病管理',
    specialties: ['高血压', '冠心病', '慢病管理'],
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'd2', phone: '13900002222', name: '刘医生', avatar: '👩‍⚕️', gender: 'female',
    role: 'doctor', realNameVerified: true, verificationStatus: 'verified',
    tenantBindings: [doctorBinding1], activeTenantId: 't1',
    title: '副主任医师', department: '内分泌科', hospital: '仁济医院',
    certifications: ['医师执业证书', '内分泌专科证书'],
    consultationCount: 890,
    tenantPatients: { 't1': ['p1'] },
    bio: '内分泌代谢疾病专家，专注糖尿病、甲状腺疾病诊治',
    specialties: ['糖尿病', '甲状腺疾病', '骨质疏松'],
    createdAt: '2024-02-01T00:00:00Z',
  },
]

export const mockAssistants: AssistantAccount[] = [
  {
    id: 'a1', doctorId: 'd1', tenantId: 't1', name: '小明（助理）', phone: '13900003333', avatar: '🧑‍💻',
    permissions: {
      canReplyConsultation: true, canViewPatient: true,
      canManageFollowUp: true, canViewOrders: false, canExportData: false,
    },
    createdAt: '2024-03-01T00:00:00Z', status: 'active',
  },
]

// ==================== 健康档案数据 ====================
export const mockHealthRecords: HealthRecord[] = [
  {
    id: 'hr1', patientId: 'p1', type: 'medical_history', title: '高血压病史记录',
    content: '确诊原发性高血压15年，最高血压180/110mmHg，目前服用硝苯地平控释片控制',
    images: [], tags: ['高血压', '慢病'],
    createdAt: '2024-06-15T00:00:00Z', updatedAt: '2024-06-15T00:00:00Z',
  },
  {
    id: 'hr2', patientId: 'p1', type: 'exam_report', title: '2024年度体检报告',
    content: '血常规、尿常规、肝功能、肾功能、血糖、血脂等各项检查结果',
    images: [],
    ocrData: {
      raw: '体检报告OCR识别内容', confidence: 0.95,
      structured: {
        items: [
          { name: '空腹血糖', value: '6.8', referenceRange: '3.9-6.1', unit: 'mmol/L', abnormal: true },
          { name: '总胆固醇', value: '5.2', referenceRange: '2.8-5.7', unit: 'mmol/L', abnormal: false },
          { name: '收缩压', value: '145', referenceRange: '90-140', unit: 'mmHg', abnormal: true },
          { name: '舒张压', value: '88', referenceRange: '60-90', unit: 'mmHg', abnormal: false },
        ],
        summary: '空腹血糖偏高，血压偏高，建议复查控制',
      },
    },
    tags: ['体检', '年度'],
    createdAt: '2024-07-20T00:00:00Z', updatedAt: '2024-07-20T00:00:00Z',
  },
  {
    id: 'hr3', patientId: 'p1', type: 'medication', title: '降压药用药记录',
    content: '硝苯地平控释片 30mg 每日一次，早餐后服用',
    images: [], tags: ['降压药', '长期用药'],
    createdAt: '2024-06-15T00:00:00Z', updatedAt: '2024-08-01T00:00:00Z',
  },
]

export const mockVitalSigns: VitalSign[] = [
  { id: 'vs1', patientId: 'p1', type: 'blood_pressure_systolic', value: 145, unit: 'mmHg', deviceName: '欧姆龙血压计', isAbnormal: true, recordedAt: '2024-08-01T08:00:00Z' },
  { id: 'vs2', patientId: 'p1', type: 'blood_pressure_diastolic', value: 88, unit: 'mmHg', deviceName: '欧姆龙血压计', isAbnormal: false, recordedAt: '2024-08-01T08:00:00Z' },
  { id: 'vs3', patientId: 'p1', type: 'blood_sugar', value: 6.8, unit: 'mmol/L', isAbnormal: true, recordedAt: '2024-08-01T07:30:00Z' },
  { id: 'vs4', patientId: 'p1', type: 'heart_rate', value: 72, unit: 'bpm', isAbnormal: false, recordedAt: '2024-08-01T08:00:00Z' },
  { id: 'vs5', patientId: 'p1', type: 'spo2', value: 98, unit: '%', isAbnormal: false, recordedAt: '2024-08-01T08:00:00Z' },
  { id: 'vs6', patientId: 'p1', type: 'weight', value: 75, unit: 'kg', isAbnormal: false, recordedAt: '2024-08-01T07:00:00Z' },
  // 历史数据
  { id: 'vs7', patientId: 'p1', type: 'blood_pressure_systolic', value: 142, unit: 'mmHg', deviceName: '欧姆龙血压计', isAbnormal: true, recordedAt: '2024-07-31T08:00:00Z' },
  { id: 'vs8', patientId: 'p1', type: 'blood_pressure_systolic', value: 148, unit: 'mmHg', deviceName: '欧姆龙血压计', isAbnormal: true, recordedAt: '2024-07-30T08:00:00Z' },
  { id: 'vs9', patientId: 'p1', type: 'blood_sugar', value: 7.1, unit: 'mmol/L', isAbnormal: true, recordedAt: '2024-07-31T07:30:00Z' },
  { id: 'vs10', patientId: 'p1', type: 'blood_sugar', value: 6.5, unit: 'mmol/L', isAbnormal: true, recordedAt: '2024-07-30T07:30:00Z' },
]

export const mockReminders: MedicationReminder[] = [
  {
    id: 'r1', patientId: 'p1', drugName: '硝苯地平控释片', dosage: '30mg',
    frequency: 'daily', time: '08:00', startDate: '2024-06-15', endDate: '2025-06-15',
    note: '早餐后服用，注意监测血压', enabled: true,
    createdAt: '2024-06-15T00:00:00Z',
  },
  {
    id: 'r2', patientId: 'p1', drugName: '二甲双胍', dosage: '500mg',
    frequency: 'daily', time: '08:00', startDate: '2024-06-15', endDate: '2025-06-15',
    note: '餐中服用，注意监测血糖', enabled: true,
    createdAt: '2024-06-15T00:00:00Z',
  },
  {
    id: 'r3', patientId: 'p1', drugName: '阿司匹林', dosage: '100mg',
    frequency: 'daily', time: '08:00', startDate: '2024-06-15', endDate: '2025-06-15',
    note: '餐后服用', enabled: false,
    createdAt: '2024-06-15T00:00:00Z',
  },
]

// ==================== 咨询数据 ====================
export const mockSessions: ConsultationSession[] = [
  {
    id: 'cs1', patientId: 'p1', patientName: '张建国', patientAvatar: '👨‍🦳',
    doctorId: 'd1', doctorName: '陈主任', doctorAvatar: '👨‍⚕️',
    doctorTitle: '主任医师', doctorDepartment: '心血管内科',
    tenantId: 't1', tenantName: '仁济医院',
    status: 'active', subject: '血压控制问题咨询',
    lastMessage: '好的，我调整一下用药方案', lastMessageAt: '2024-08-01T15:30:00Z',
    unreadPatientCount: 1, unreadDoctorCount: 0,
    createdAt: '2024-07-25T10:00:00Z',
  },
  {
    id: 'cs2', patientId: 'p1', patientName: '张建国', patientAvatar: '👨‍🦳',
    doctorId: 'd2', doctorName: '刘医生', doctorAvatar: '👩‍⚕️',
    doctorTitle: '副主任医师', doctorDepartment: '内分泌科',
    tenantId: 't1', tenantName: '仁济医院',
    status: 'active', subject: '血糖控制咨询',
    lastMessage: '最近血糖控制得不错，继续保持', lastMessageAt: '2024-07-30T11:00:00Z',
    unreadPatientCount: 0, unreadDoctorCount: 0,
    createdAt: '2024-07-20T09:00:00Z',
  },
  {
    id: 'cs3', patientId: 'p2', patientName: '李美华', patientAvatar: '👩‍🦰',
    doctorId: 'd1', doctorName: '陈主任', doctorAvatar: '👨‍⚕️',
    doctorTitle: '主任医师', doctorDepartment: '心血管内科',
    tenantId: 't1', tenantName: '仁济医院',
    status: 'closed', subject: '甲状腺术后复查咨询',
    lastMessage: '好的，三个月后再复查，谢谢医生！', lastMessageAt: '2024-06-20T16:00:00Z',
    unreadPatientCount: 0, unreadDoctorCount: 0,
    rating: 5, ratingComment: '陈主任非常专业耐心，感谢！',
    createdAt: '2024-06-15T14:00:00Z', closedAt: '2024-06-20T16:00:00Z',
  },
]

export const mockMessages: Record<string, ConsultationMessage[]> = {
  cs1: [
    { id: 'm1', sessionId: 'cs1', senderId: 'p1', senderName: '张建国', senderRole: 'patient', content: '陈主任您好，最近血压有些波动，早上测145/88，需要调整用药吗？', type: 'text', createdAt: '2024-08-01T14:00:00Z' },
    { id: 'm2', sessionId: 'cs1', senderId: 'd1', senderName: '陈主任', senderRole: 'doctor', content: '张先生您好，145/88这个数值确实偏高。最近饮食和运动情况怎么样？有没有感觉头晕等不适？', type: 'text', createdAt: '2024-08-01T14:30:00Z' },
    { id: 'm3', sessionId: 'cs1', senderId: 'p1', senderName: '张建国', senderRole: 'patient', content: '最近天气热，运动少了些，饮食正常。偶尔有点头晕。', type: 'text', createdAt: '2024-08-01T15:00:00Z' },
    { id: 'm4', sessionId: 'cs1', senderId: 'd1', senderName: '陈主任', senderRole: 'doctor', content: '好的，我调整一下用药方案。硝苯地平加到35mg，继续监测血压，如果一周后还高于140请及时复诊。', type: 'text', createdAt: '2024-08-01T15:30:00Z' },
  ],
  cs2: [
    { id: 'm5', sessionId: 'cs2', senderId: 'p1', senderName: '张建国', senderRole: 'patient', content: '刘医生好，我最近空腹血糖在6.5-7.0之间，比上个月降了一些', type: 'text', createdAt: '2024-07-30T10:00:00Z' },
    { id: 'm6', sessionId: 'cs2', senderId: 'd2', senderName: '刘医生', senderRole: 'doctor', content: '最近血糖控制得不错，继续保持饮食和运动计划。二甲双胍按时吃了没？', type: 'text', createdAt: '2024-07-30T10:30:00Z' },
    { id: 'm7', sessionId: 'cs2', senderId: 'p1', senderName: '张建国', senderRole: 'patient', content: '每天都按时吃，没有不良反应', type: 'text', createdAt: '2024-07-30T10:45:00Z' },
    { id: 'm8', sessionId: 'cs2', senderId: 'd2', senderName: '刘医生', senderRole: 'doctor', content: '很好，继续保持。下个月再查一次糖化血红蛋白，到时候把结果发给我看。', type: 'text', createdAt: '2024-07-30T11:00:00Z' },
  ],
  cs3: [
    { id: 'm9', sessionId: 'cs3', senderId: 'p2', senderName: '李美华', senderRole: 'patient', content: '陈主任您好，我做完甲状腺结节手术3个月了，今天复查结果出来了，麻烦帮我看一下', type: 'text', createdAt: '2024-06-15T14:00:00Z' },
    { id: 'm10', sessionId: 'cs3', senderId: 'd1', senderName: '陈主任', senderRole: 'doctor', content: '李女士您好，请把复查报告发给我看看', type: 'text', createdAt: '2024-06-15T14:30:00Z' },
    { id: 'm11', sessionId: 'cs3', senderId: 'p2', senderName: '李美华', senderRole: 'patient', content: '好的，三个月后再复查，谢谢医生！', type: 'text', createdAt: '2024-06-20T16:00:00Z' },
  ],
}

// ==================== 商城数据 ====================
export const mockProducts: Product[] = [
  {
    id: 'prod1', tenantId: 't2', tenantName: '健康大药房',
    name: '硝苯地平控释片 30mg×7片', category: 'drug',
    price: 28.50, originalPrice: 35.00, stock: 200, sales: 1560,
    images: ['💊'], description: '用于治疗高血压、心绞痛',
    specification: '30mg×7片/盒', manufacturer: '拜耳医药',
    approvalNumber: '国药准字H20030001', prescriptionRequired: true,
    approved: true, isOnSale: true, createdAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 'prod2', tenantId: 't2', tenantName: '健康大药房',
    name: '二甲双胍缓释片 500mg×30片', category: 'drug',
    price: 18.00, originalPrice: 22.00, stock: 150, sales: 2300,
    images: ['💊'], description: '用于2型糖尿病的血糖控制',
    specification: '500mg×30片/盒', manufacturer: '中美施贵宝',
    approvalNumber: '国药准字H20040002', prescriptionRequired: true,
    approved: true, isOnSale: true, createdAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 'prod3', tenantId: 't2', tenantName: '健康大药房',
    name: '欧姆龙电子血压计 HEM-7124', category: 'device',
    price: 299.00, originalPrice: 399.00, stock: 80, sales: 890,
    images: ['🩺'], description: '智能加压，大屏显示，心率监测，血压异常提醒',
    specification: 'HEM-7124', manufacturer: '欧姆龙',
    approvalNumber: '辽械注准20162070001', prescriptionRequired: false,
    approved: true, isOnSale: true, createdAt: '2024-04-15T00:00:00Z',
  },
  {
    id: 'prod4', tenantId: 't2', tenantName: '健康大药房',
    name: '三诺血糖仪 安稳+型', category: 'device',
    price: 99.00, originalPrice: 129.00, stock: 120, sales: 1200,
    images: ['📟'], description: '5秒快速测量，微量采血，记忆存储500组数据，支持蓝牙同步',
    specification: '安稳+型', manufacturer: '三诺生物',
    approvalNumber: '湘械注准20152070002', prescriptionRequired: false,
    approved: true, isOnSale: true, createdAt: '2024-04-20T00:00:00Z',
  },
  {
    id: 'prod5', tenantId: 't2', tenantName: '健康大药房',
    name: '华为手环8 智能健康手环', category: 'wearable',
    price: 269.00, originalPrice: 299.00, stock: 60, sales: 450,
    images: ['⌚'], description: '24小时心率监测、血氧检测、睡眠监测、运动记录',
    specification: '华为手环8 NFC版', manufacturer: '华为',
    approvalNumber: '', prescriptionRequired: false,
    approved: true, isOnSale: true, createdAt: '2024-05-01T00:00:00Z',
  },
]

export const mockCartItems: CartItem[] = [
  { id: 'ci1', productId: 'prod1', productName: '硝苯地平控释片 30mg×7片', productImage: '💊', price: 28.50, quantity: 2, tenantId: 't2', prescriptionRequired: true },
  { id: 'ci2', productId: 'prod4', productName: '三诺血糖仪 安稳+型', productImage: '📟', price: 99.00, quantity: 1, tenantId: 't2', prescriptionRequired: false },
]

export const mockOrders: Order[] = [
  {
    id: 'ord1', orderNo: 'YLXB20240801001', tenantId: 't2', tenantName: '健康大药房',
    patientId: 'p1', patientName: '张建国',
    items: [{ productId: 'prod1', productName: '硝苯地平控释片 30mg×7片', productImage: '💊', price: 28.50, quantity: 3, subtotal: 85.50 }],
    totalAmount: 85.50, status: 'completed',
    logistics: { company: '顺丰速运', trackingNumber: 'SF1234567890', status: '已签收', updates: [{ time: '2024-08-05T10:00:00Z', description: '已签收' }] },
    address: { id: 'addr1', patientId: 'p1', name: '张建国', phone: '13800001111', province: '上海市', city: '上海市', district: '黄浦区', detail: '人民路50号301室', isDefault: true },
    remark: '', createdAt: '2024-08-01T10:00:00Z', paidAt: '2024-08-01T10:05:00Z', shippedAt: '2024-08-02T09:00:00Z', completedAt: '2024-08-05T10:00:00Z',
  },
  {
    id: 'ord2', orderNo: 'YLXB20240810001', tenantId: 't2', tenantName: '健康大药房',
    patientId: 'p1', patientName: '张建国',
    items: [{ productId: 'prod3', productName: '欧姆龙电子血压计 HEM-7124', productImage: '🩺', price: 299.00, quantity: 1, subtotal: 299.00 }],
    totalAmount: 299.00, status: 'shipped',
    logistics: { company: '京东物流', trackingNumber: 'JD9876543210', status: '运输中', updates: [{ time: '2024-08-11T08:00:00Z', description: '已揽收' }] },
    address: { id: 'addr1', patientId: 'p1', name: '张建国', phone: '13800001111', province: '上海市', city: '上海市', district: '黄浦区', detail: '人民路50号301室', isDefault: true },
    remark: '请放快递柜', createdAt: '2024-08-10T15:00:00Z', paidAt: '2024-08-10T15:02:00Z', shippedAt: '2024-08-11T08:00:00Z',
  },
]

export const mockAddresses: ShippingAddress[] = [
  { id: 'addr1', patientId: 'p1', name: '张建国', phone: '13800001111', province: '上海市', city: '上海市', district: '黄浦区', detail: '人民路50号301室', isDefault: true },
  { id: 'addr2', patientId: 'p1', name: '张小明', phone: '13800002222', province: '上海市', city: '上海市', district: '浦东新区', detail: '张杨路100号1201室', isDefault: false },
]

// ==================== 圈子数据 ====================
export const mockCircles: Circle[] = [
  { id: 'c1', name: '高血压病友圈', description: '高血压患者交流、经验分享、血压管理心得', coverImage: '💓', memberCount: 5200, postCount: 1800, isOfficial: true, category: '慢病管理', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'c2', name: '糖尿病互助圈', description: '糖尿病饮食、运动、血糖控制交流圈', coverImage: '🍬', memberCount: 4300, postCount: 1450, isOfficial: true, category: '慢病管理', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'c3', name: '术后康复交流', description: '各类手术后康复经验分享，互帮互助', coverImage: '🏥', memberCount: 3100, postCount: 980, isOfficial: false, category: '康复', createdAt: '2024-02-15T00:00:00Z' },
  { id: 'c4', name: '健康饮食圈子', description: '分享健康食谱、饮食搭配，助力慢病管理', coverImage: '🥗', memberCount: 2800, postCount: 750, isOfficial: false, category: '生活', createdAt: '2024-03-01T00:00:00Z' },
]

export const mockPosts: Post[] = [
  {
    id: 'post1', circleId: 'c1', circleName: '高血压病友圈',
    authorId: 'p1', authorName: '张建国', authorAvatar: '👨‍🦳', authorRole: 'patient',
    authorTenants: ['仁济医院'],
    content: '坚持低盐饮食一个月，配合每天散步30分钟，血压从150/95降到了135/85。大家一定要坚持健康生活方式，配合医生用药，血压真的可以控制好的！💪',
    images: [], likeCount: 128, commentCount: 23, collectCount: 15,
    isLiked: true, isCollected: false, isPinned: false, isEssence: true,
    status: 'normal', createdAt: '2024-07-28T09:00:00Z',
  },
  {
    id: 'post2', circleId: 'c1', circleName: '高血压病友圈',
    authorId: 'd1', authorName: '陈主任', authorAvatar: '👨‍⚕️', authorRole: 'doctor',
    authorTenants: ['仁济医院', '康宁诊所'],
    content: '【科普】高血压患者夏季注意事项：1. 夏季血压可能自然下降，切勿自行停药；2. 多饮水，避免脱水导致血液黏稠；3. 空调温度不宜过低，温差过大易诱发心脑血管事件；4. 定期监测血压，发现异常及时就医。',
    images: [], likeCount: 256, commentCount: 35, collectCount: 89,
    isLiked: false, isCollected: true, isPinned: true, isEssence: true,
    status: 'normal', createdAt: '2024-07-25T10:00:00Z',
  },
  {
    id: 'post3', circleId: 'c2', circleName: '糖尿病互助圈',
    authorId: 'p2', authorName: '李美华', authorAvatar: '👩‍🦰', authorRole: 'patient',
    authorTenants: ['仁济医院'],
    content: '分享一个低GI的早餐搭配：全麦面包+鸡蛋+无糖豆浆+小番茄，餐后2小时血糖7.2，比之前吃白粥馒头好太多了！',
    images: [], likeCount: 89, commentCount: 12, collectCount: 35,
    isLiked: false, isCollected: false, isPinned: false, isEssence: false,
    status: 'normal', createdAt: '2024-07-30T08:00:00Z',
  },
]

export const mockComments: Record<string, Comment[]> = {
  post1: [
    { id: 'cmt1', postId: 'post1', authorId: 'u3', authorName: '健康达人', authorAvatar: '🏃', authorRole: 'patient', content: '太棒了！坚持就是胜利！想问下饮食上具体怎么控制的？', likeCount: 15, isLiked: false, createdAt: '2024-07-28T09:30:00Z' },
    { id: 'cmt2', postId: 'post1', authorId: 'p1', authorName: '张建国', authorAvatar: '👨‍🦳', authorRole: 'patient', content: '主要是控盐，每天不超过5g，少吃腌制食品，多吃新鲜蔬菜', likeCount: 8, isLiked: true, createdAt: '2024-07-28T10:00:00Z' },
  ],
  post2: [
    { id: 'cmt3', postId: 'post2', authorId: 'u5', authorName: '老刘', authorAvatar: '👴', authorRole: 'patient', content: '谢谢陈主任科普！夏天确实容易放松警惕', likeCount: 20, isLiked: false, createdAt: '2024-07-25T11:00:00Z' },
  ],
}

// ==================== 随访数据 ====================
export const mockFollowUpPlans: FollowUpPlan[] = [
  {
    id: 'fp1', doctorId: 'd1', patientId: 'p1', patientName: '张建国',
    tenantId: 't1', tenantName: '仁济医院',
    title: '高血压长期随访管理', description: '每月定期监测血压，评估用药效果，指导生活方式',
    frequency: 'monthly', startDate: '2024-06-15', endDate: '2025-06-15',
    status: 'active', totalTasks: 12, completedTasks: 2,
    createdAt: '2024-06-15T00:00:00Z',
  },
  {
    id: 'fp2', doctorId: 'd2', patientId: 'p1', patientName: '张建国',
    tenantId: 't1', tenantName: '仁济医院',
    title: '糖尿病季度随访', description: '每季度检查血糖控制情况，调整降糖方案',
    frequency: 'monthly', startDate: '2024-07-01', endDate: '2025-07-01',
    status: 'active', totalTasks: 4, completedTasks: 1,
    createdAt: '2024-07-01T00:00:00Z',
  },
]

export const mockFollowUpTasks: FollowUpTask[] = [
  {
    id: 'ft1', planId: 'fp1', patientId: 'p1', doctorId: 'd1',
    title: '7月血压监测', description: '请测量并记录本周血压数据（早晚各一次）',
    type: 'vital_sign', scheduledAt: '2024-07-15T08:00:00Z',
    completedAt: '2024-07-16T09:00:00Z', status: 'completed',
    result: {
      vitalSigns: { blood_pressure_systolic: 142, blood_pressure_diastolic: 86 },
      feeling: '感觉良好，偶尔头晕', symptoms: ['偶尔头晕'],
      medicationTaken: true, note: '早上忘记测了一次，其余都按时测量',
      submittedAt: '2024-07-16T09:00:00Z',
    },
  },
  {
    id: 'ft2', planId: 'fp1', patientId: 'p1', doctorId: 'd1',
    title: '8月血压监测', description: '请测量并记录本周血压数据（早晚各一次）',
    type: 'vital_sign', scheduledAt: '2024-08-01T08:00:00Z',
    status: 'pending',
  },
  {
    id: 'ft3', planId: 'fp2', patientId: 'p1', doctorId: 'd2',
    title: '8月血糖监测', description: '连续3天空腹及餐后2小时血糖',
    type: 'vital_sign', scheduledAt: '2024-08-05T08:00:00Z',
    status: 'pending',
  },
]

// ==================== 入驻申请数据 ====================
export const mockApplications: TenantApplication[] = [
  {
    id: 'app1', tenantName: '瑞金康复医院', tenantType: 'hospital',
    applicantName: '赵院长', applicantPhone: '13900009999',
    businessLicense: 'BL-20240020', certifications: ['医疗执业许可证'],
    address: '上海市静安区延安西路500号', description: '专业康复医疗机构，开展术后康复、慢病康复',
    status: 'pending', createdAt: '2024-07-20T00:00:00Z',
  },
  {
    id: 'app2', tenantName: '益丰大药房', tenantType: 'pharmacy',
    applicantName: '钱经理', applicantPhone: '13900008888',
    businessLicense: 'BL-20240021', certifications: ['药品经营许可证', '医疗器械经营许可证'],
    address: '上海市闵行区莘庄镇100号', description: '全国连锁药房，覆盖上海200家门店',
    status: 'pending', createdAt: '2024-07-25T00:00:00Z',
  },
]
