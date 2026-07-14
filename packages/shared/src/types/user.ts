import type { UserRole, Gender, VerificationStatus } from './common'

/** 租户绑定关系 */
export interface TenantBinding {
  tenantId: string
  tenantName: string
  tenantType: string
  role: string
  joinedAt: string
}

/** 用户基础信息 */
export interface User {
  id: string
  phone: string
  name: string
  avatar: string
  gender: Gender
  role: UserRole
  realNameVerified: boolean
  verificationStatus: VerificationStatus
  idCard?: string
  tenantBindings: TenantBinding[]
  activeTenantId: string | null
  createdAt: string
}

/** 患者扩展信息 */
export interface Patient extends User {
  role: 'patient'
  birthDate?: string
  medicalHistory?: string[]
  emergencyContact?: string
  emergencyPhone?: string
  address?: string
}

/** 医生扩展信息 */
export interface Doctor extends User {
  role: 'doctor'
  title: string           // 职称
  department: string       // 科室
  hospital: string         // 所属医院
  certifications: string[] // 资质证书
  consultationCount: number
  tenantPatients: Record<string, string[]> // tenantId -> patientIds
  bio?: string
  specialties?: string[]
}

/** 医生助理子账号 */
export interface AssistantAccount {
  id: string
  doctorId: string
  tenantId: string
  name: string
  phone: string
  avatar: string
  permissions: AssistantPermissions
  createdAt: string
  status: 'active' | 'disabled'
}

/** 助理权限配置 */
export interface AssistantPermissions {
  canReplyConsultation: boolean
  canViewPatient: boolean
  canManageFollowUp: boolean
  canViewOrders: boolean
  canExportData: boolean
}

/** 登录请求 */
export interface LoginRequest {
  phone: string
  password: string
  role: UserRole
}

/** 注册请求 */
export interface RegisterRequest {
  phone: string
  password: string
  name: string
  role: UserRole
  gender: Gender
}

/** 实名认证请求 */
export interface VerifyIdentityRequest {
  realName: string
  idCard: string
  idCardFront: string  // 身份证正面照片
  idCardBack: string   // 身份证背面照片
}
