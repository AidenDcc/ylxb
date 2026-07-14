import type { TenantType, TenantApplicationStatus } from './common'

/** 租户信息 */
export interface Tenant {
  id: string
  name: string
  type: TenantType
  logo: string
  description: string
  address: string
  contactPhone: string
  contactPerson: string
  businessLicense: string
  certifications: string[]
  status: 'active' | 'disabled' | 'pending'
  doctorCount: number
  patientCount: number
  productCount: number
  orderCount: number
  createdAt: string
}

/** 租户入驻申请 */
export interface TenantApplication {
  id: string
  tenantName: string
  tenantType: TenantType
  applicantName: string
  applicantPhone: string
  businessLicense: string
  certifications: string[]
  address: string
  description: string
  status: TenantApplicationStatus
  reviewComment?: string
  reviewedBy?: string
  reviewedAt?: string
  createdAt: string
}

/** 当前激活租户信息（轻量） */
export interface ActiveTenantInfo {
  tenantId: string
  tenantName: string
  tenantType: string
  logo: string
}
