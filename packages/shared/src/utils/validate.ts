/**
 * 验证工具
 */

export function isPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone)
}

export function isIdCard(idCard: string): boolean {
  return /^\d{17}[\dXx]$/.test(idCard)
}

export function isPassword(password: string): boolean {
  return password.length >= 6 && password.length <= 20
}

export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0
}
