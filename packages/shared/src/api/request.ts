/**
 * API 请求封装
 * 开发环境走 mock，生产环境走真实 HTTP 请求
 */
import type { ApiResponse, PaginatedResponse } from '../types/common'

const BASE_URL = '/api'
const USE_MOCK = true // 开发环境使用 Mock

/** 模拟网络延迟 */
function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms + Math.random() * 200))
}

/** 通用 GET 请求 */
export async function get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
  if (USE_MOCK) {
    await delay()
    // Mock 处理器由各模块单独注册
    const handler = mockHandlers.get(`${url}:${JSON.stringify(params || {})}`)
    if (handler) return handler() as Promise<ApiResponse<T>>
    // 回退到路径匹配
    const pathHandler = findMockHandler('GET', url, params)
    if (pathHandler) return pathHandler(params) as Promise<ApiResponse<T>>
    return { code: 404, message: `Mock not found: ${url}`, data: null as unknown as T }
  }
  const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''
  const res = await fetch(BASE_URL + url + query)
  return res.json()
}

/** 通用 POST 请求 */
export async function post<T>(url: string, body?: unknown): Promise<ApiResponse<T>> {
  if (USE_MOCK) {
    await delay()
    const handler = findMockHandler('POST', url, body)
    if (handler) return handler(body) as Promise<ApiResponse<T>>
    return { code: 404, message: `Mock not found: ${url}`, data: null as unknown as T }
  }
  const res = await fetch(BASE_URL + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

/** 通用 PUT 请求 */
export async function put<T>(url: string, body?: unknown): Promise<ApiResponse<T>> {
  if (USE_MOCK) {
    await delay()
    const handler = findMockHandler('PUT', url, body)
    if (handler) return handler(body) as Promise<ApiResponse<T>>
    return { code: 404, message: `Mock not found: ${url}`, data: null as unknown as T }
  }
  const res = await fetch(BASE_URL + url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

/** 通用 DELETE 请求 */
export async function del<T>(url: string): Promise<ApiResponse<T>> {
  if (USE_MOCK) {
    await delay()
    const handler = findMockHandler('DELETE', url)
    if (handler) return handler() as Promise<ApiResponse<T>>
    return { code: 404, message: `Mock not found: ${url}`, data: null as unknown as T }
  }
  const res = await fetch(BASE_URL + url, { method: 'DELETE' })
  return res.json()
}

// ========== Mock 处理器注册 ==========

type MockHandler = (params?: unknown) => unknown

interface MockEntry {
  method: string
  pattern: RegExp | string
  handler: MockHandler
}

const mockEntries: MockEntry[] = []

/** 兼容旧 API（key-value 精确匹配） */
const mockHandlers = new Map<string, () => Promise<unknown>>()

/** 注册 Mock 处理器 */
export function registerMock(method: string, path: string | RegExp, handler: MockHandler): void {
  mockEntries.push({ method, pattern: path, handler })
}

/** 查找匹配的 Mock 处理器 */
function findMockHandler(method: string, url: string, params?: unknown): MockHandler | undefined {
  for (const entry of mockEntries) {
    if (entry.method !== method) continue
    if (typeof entry.pattern === 'string' && entry.pattern === url) return entry.handler
    if (entry.pattern instanceof RegExp && entry.pattern.test(url)) return entry.handler
  }
  return undefined
}

/** 创建成功响应 */
export function ok<T>(data: T, message = 'success'): ApiResponse<T> {
  return { code: 0, message, data }
}

/** 创建分页响应 */
export function paginatedOk<T>(data: T[], total: number, page: number, pageSize: number): ApiResponse<PaginatedResponse<T>> {
  return { code: 0, message: 'success', data: { data, total, page, pageSize } }
}
