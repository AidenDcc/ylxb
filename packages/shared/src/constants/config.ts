/** 应用全局配置 */

export const APP_CONFIG = {
  name: '医路相伴',
  shortName: 'MedPal',
  /** 主色 - 医疗蓝 */
  primaryColor: '#4A90D9',
  /** 辅助色 */
  successColor: '#52C41A',
  warningColor: '#FA8C16',
  dangerColor: '#F5222D',
  /** 分页默认 */
  defaultPageSize: 20,
  /** 图片上传限制 */
  maxImageSize: 10 * 1024 * 1024, // 10MB
  maxImageCount: 9,
  /** Mock 延迟（模拟网络） */
  mockDelay: 300,
} as const
