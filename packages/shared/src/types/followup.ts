/** 随访计划 */
export interface FollowUpPlan {
  id: string
  doctorId: string
  patientId: string
  patientName: string
  tenantId: string
  tenantName: string
  title: string
  description: string
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom'
  customDays?: number
  startDate: string
  endDate: string
  status: 'active' | 'paused' | 'completed'
  totalTasks: number
  completedTasks: number
  createdAt: string
}

/** 随访任务 */
export interface FollowUpTask {
  id: string
  planId: string
  patientId: string
  doctorId: string
  title: string
  description: string
  type: 'vital_sign' | 'medication' | 'feeling' | 'questionnaire' | 'custom'
  scheduledAt: string
  completedAt?: string
  status: 'pending' | 'completed' | 'missed'
  result?: FollowUpResult
}

/** 随访结果 */
export interface FollowUpResult {
  vitalSigns?: Record<string, number>
  feeling?: string
  symptoms?: string[]
  medicationTaken: boolean
  note: string
  submittedAt: string
}
