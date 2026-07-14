import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Doctor, TenantBinding } from '@ylxb/shared'
import { get, post, storage } from '@ylxb/shared'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<Doctor | null>(storage.get<Doctor>('doctor_user'))
  const token = ref<string | null>(storage.get<string>('doctor_token'))
  const isLoggedIn = computed(() => !!token.value && !!user.value)

  const activeTenant = computed(() => {
    if (!user.value?.activeTenantId || !user.value?.tenantBindings) return null
    return user.value.tenantBindings.find((b) => b.tenantId === user.value!.activeTenantId) || null
  })

  async function login(phone: string, password: string) {
    const res = await post<{ user: Doctor; token: string }>('/auth/login', { phone, password, role: 'doctor' })
    if (res.code === 0) {
      user.value = res.data.user as Doctor
      token.value = res.data.token
      storage.set('doctor_user', res.data.user)
      storage.set('doctor_token', res.data.token)
    }
    return res
  }

  async function switchTenant(tenantId: string) {
    const res = await post<{ activeTenantId: string }>('/tenant/switch', { tenantId })
    if (res.code === 0 && user.value) {
      user.value.activeTenantId = res.data.activeTenantId
      storage.set('doctor_user', user.value)
    }
    return res
  }

  function logout() {
    user.value = null
    token.value = null
    storage.remove('doctor_user')
    storage.remove('doctor_token')
  }

  function getTenantBindings(): TenantBinding[] {
    return user.value?.tenantBindings || []
  }

  return { user, token, isLoggedIn, activeTenant, login, switchTenant, logout, getTenantBindings }
})
