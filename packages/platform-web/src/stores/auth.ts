import { defineStore } from 'pinia'
import { ref } from 'vue'
import { post } from '@ylxb/shared'
import type { User } from '@ylxb/shared'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string>('')

  async function login(phone: string, password: string) {
    const res = await post<{ user: User; token: string }>('/auth/login', {
      phone,
      password,
      role: 'platform_admin',
    })
    if (res.code === 0) {
      user.value = res.data.user
      token.value = res.data.token
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      return true
    }
    return false
  }

  function logout() {
    user.value = null
    token.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  function restoreSession() {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      token.value = savedToken
      try {
        user.value = JSON.parse(savedUser)
      } catch {
        // ignore parse error
      }
    }
  }

  return { user, token, login, logout, restoreSession }
})
