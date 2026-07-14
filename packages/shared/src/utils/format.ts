/**
 * 通用格式化工具
 */

/** 格式化金额 */
export function formatMoney(amount: number): string {
  return `¥${amount.toFixed(2)}`
}

/** 格式化手机号（脱敏） */
export function maskPhone(phone: string): string {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/** 格式化身份证号（脱敏） */
export function maskIdCard(idCard: string): string {
  return idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')
}

/** 截断文本 */
export function truncateText(text: string, maxLen: number): string {
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text
}

/** 生成唯一ID */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}
