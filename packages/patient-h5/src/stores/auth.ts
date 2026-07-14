import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, TenantBinding } from '@ylxb/shared'
import { get, post, storage } from '@ylxb/shared'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(storage.get<User>('user'))
  const token = ref<string | null>(storage.get<string>('token'))
  const isLoggedIn = computed(() => !!token.value && !!user.value)

  const activeTenant = computed(() => {
    if (!user.value?.activeTenantId || !user.value?.tenantBindings) return null
    return user.value.tenantBindings.find((b) => b.tenantId === user.value!.activeTenantId) || null
  })

  async function login(phone: string, password: string) {
    const res = await post<{ user: User; token: string }>('/auth/login', { phone, password, role: 'patient' })
    if (res.code === 0) {
      user.value = res.data.user
      token.value = res.data.token
      storage.set('user', res.data.user)
      storage.set('token', res.data.token)
    }
    return res
  }

  async function register(data: { phone: string; password: string; name: string; gender: string }) {
    return post('/auth/register', { ...data, role: 'patient' })
  }

  async function verifyIdentity(data: { realName: string; idCard: string }) {
    const res = await post<{ verified: boolean }>('/auth/verify-identity', data)
    if (res.code === 0 && user.value) {
      user.value.realNameVerified = true
      storage.set('user', user.value)
    }
    return res
  }

  async function switchTenant(tenantId: string) {
    const res = await post<{ activeTenantId: string }>('/tenant/switch', { tenantId })
    if (res.code === 0 && user.value) {
      user.value.activeTenantId = res.data.activeTenantId
      storage.set('user', user.value)
    }
    return res
  }

  function logout() {
    user.value = null
    token.value = null
    storage.remove('user')
    storage.remove('token')
  }

  function getTenantBindings(): TenantBinding[] {
    return user.value?.tenantBindings || []
  }

  return { user, token, isLoggedIn, activeTenant, login, register, verifyIdentity, switchTenant, logout, getTenantBindings }
})
