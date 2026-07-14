/** 患者端状态枚举 */

/** 订单状态 */
export const OrderStatusLabels: Record<string, string> = {
  pending: '待支付',
  paid: '待发货',
  shipped: '已发货',
  completed: '已完成',
  refunded: '已退款',
  cancelled: '已取消',
}

/** 咨询状态 */
export const ConsultationStatusLabels: Record<string, string> = {
  active: '进行中',
  closed: '已结束',
  rated: '已评价',
}

/** 体征类型标签 */
export const VitalSignLabels: Record<string, string> = {
  blood_pressure_systolic: '收缩压',
  blood_pressure_diastolic: '舒张压',
  blood_sugar: '血糖',
  heart_rate: '心率',
  weight: '体重',
  spo2: '血氧',
  temperature: '体温',
  blood_fat: '血脂',
}

/** 体征单位 */
export const VitalSignUnits: Record<string, string> = {
  blood_pressure_systolic: 'mmHg',
  blood_pressure_diastolic: 'mmHg',
  blood_sugar: 'mmol/L',
  heart_rate: 'bpm',
  weight: 'kg',
  spo2: '%',
  temperature: '°C',
  blood_fat: 'mmol/L',
}

/** 商品分类标签 */
export const ProductCategoryLabels: Record<string, string> = {
  drug: '药品',
  device: '医疗器械',
  wearable: '智能穿戴',
  health_food: '保健品',
}

/** 健康档案类型标签 */
export const HealthRecordTypeLabels: Record<string, string> = {
  medical_history: '病历',
  exam_report: '体检报告',
  medication: '用药记录',
  daily_feeling: '每日体感',
  vital_sign: '体征数据',
  device_data: '设备数据',
}
