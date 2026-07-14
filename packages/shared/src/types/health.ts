/** 健康档案记录 */
export interface HealthRecord {
  id: string
  patientId: string
  type: HealthRecordType
  title: string
  content: string
  images: string[]
  ocrData?: OCRResult
  tags: string[]
  createdAt: string
  updatedAt: string
}

export type HealthRecordType = 'medical_history' | 'exam_report' | 'medication' | 'daily_feeling' | 'vital_sign' | 'device_data'

/** OCR 识别结果 */
export interface OCRResult {
  raw: string
  confidence: number
  structured: {
    items: OCRItem[]
    summary: string
  }
}

/** OCR 结构化字段 */
export interface OCRItem {
  name: string
  value: string
  referenceRange: string
  unit: string
  abnormal: boolean
}

/** 体征数据 */
export interface VitalSign {
  id: string
  patientId: string
  type: VitalSignType
  value: number
  unit: string
  deviceId?: string
  deviceName?: string
  isAbnormal: boolean
  recordedAt: string
}

export type VitalSignType = 'blood_pressure_systolic' | 'blood_pressure_diastolic' | 'blood_sugar' | 'heart_rate' | 'weight' | 'spo2' | 'temperature' | 'blood_fat'

/** 体征数据点（用于曲线图） */
export interface VitalSignDataPoint {
  label: string
  time: string
  value: number
  isAbnormal: boolean
}

/** 用药提醒 */
export interface MedicationReminder {
  id: string
  patientId: string
  drugName: string
  dosage: string
  frequency: 'daily' | 'weekly' | 'custom'
  time: string
  startDate: string
  endDate: string
  note: string
  enabled: boolean
  createdAt: string
}

/** 用药记录 */
export interface MedicationRecord {
  id: string
  reminderId: string
  patientId: string
  drugName: string
  dosage: string
  takenAt: string
  skipped: boolean
  note: string
}

/** 每日体感记录 */
export interface DailyFeeling {
  id: string
  patientId: string
  date: string
  mood: 'good' | 'normal' | 'bad'
  symptoms: string[]
  note: string
  createdAt: string
}
