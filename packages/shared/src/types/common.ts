/** 通用 API 响应结构 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

/** 分页请求参数 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/** 用户角色 */
export type UserRole = 'patient' | 'doctor' | 'assistant' | 'tenant_admin' | 'platform_admin'

/** 健康数据可见范围 */
export type HealthDataScope = 'global' | 'tenant'

/** 性别 */
export type Gender = 'male' | 'female' | 'unknown'

/** 实名认证状态 */
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'

/** 租户类型 */
export type TenantType = 'hospital' | 'pharmacy' | 'clinic'

/** 租户入驻状态 */
export type TenantApplicationStatus = 'pending' | 'approved' | 'rejected'
