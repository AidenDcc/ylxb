/** 咨询会话 */
export interface ConsultationSession {
  id: string
  patientId: string
  patientName: string
  patientAvatar: string
  doctorId: string
  doctorName: string
  doctorAvatar: string
  doctorTitle: string
  doctorDepartment: string
  tenantId: string
  tenantName: string
  status: ConsultationStatus
  subject: string
  lastMessage?: string
  lastMessageAt?: string
  unreadPatientCount: number
  unreadDoctorCount: number
  rating?: number
  ratingComment?: string
  createdAt: string
  closedAt?: string
}

export type ConsultationStatus = 'active' | 'closed' | 'rated'

/** 咨询消息 */
export interface ConsultationMessage {
  id: string
  sessionId: string
  senderId: string
  senderName: string
  senderRole: 'patient' | 'doctor' | 'assistant'
  content: string
  type: 'text' | 'image'
  imageUrl?: string
  createdAt: string
}

/** 发送消息请求 */
export interface SendMessageRequest {
  sessionId: string
  content: string
  type: 'text' | 'image'
  imageUrl?: string
}

/** 创建咨询会话 */
export interface CreateConsultationRequest {
  doctorId: string
  tenantId: string
  subject: string
  initialMessage: string
}

/** 咨询评价 */
export interface ConsultationRating {
  sessionId: string
  rating: number   // 1-5
  comment: string
}
