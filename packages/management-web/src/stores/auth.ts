import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { post } from '@ylxb/shared'
import type { User, TenantBinding } from '@ylxb/shared'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string>('')
  const activeTenant = ref<TenantBinding | null>(null)

  const isLoggedIn = computed(() => !!token.value)
  const isTenantAdmin = computed(() => user.value?.role === 'tenant_admin')

  const tenantId = computed(() => activeTenant.value?.tenantId || '')
  const tenantName = computed(() => activeTenant.value?.tenantName || '仁济医院')

  /** 登录 */
  async function login(phone: string, password: string) {
    const res = await post<{ user: User; token: string }>('/auth/login', {
      phone,
      password,
      role: 'tenant_admin',
    })
    if (res.code === 0) {
      user.value = res.data.user
      token.value = res.data.token
      if (res.data.user.tenantBindings && res.data.user.tenantBindings.length > 0) {
        activeTenant.value = res.data.user.tenantBindings[0]
      }
      return true
    }
    return false
  }

  /** 登出 */
  function logout() {
    user.value = null
    token.value = ''
    activeTenant.value = null
  }

  /** 刷新用户信息 */
  async function refreshUser() {
    const res = await post<{ user: User; token: string }>('/auth/login', {
      phone: '13900009999',
      password: '123456',
      role: 'tenant_admin',
    })
    if (res.code === 0) {
      user.value = res.data.user
    }
  }

  return {
    user,
    token,
    activeTenant,
    isLoggedIn,
    isTenantAdmin,
    tenantId,
    tenantName,
    login,
    logout,
    refreshUser,
  }
})
