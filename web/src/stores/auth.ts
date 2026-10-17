import { ref } from 'vue'
import { api, getToken, setToken, clearToken, ApiError } from '@/api'

export const token = ref(getToken())
export const authed = ref(!!token.value)

// 用后台接口验证 token 是否合法：成功 = 200，失败后端返回 404（视为未授权）。
export async function login(t: string): Promise<boolean> {
  setToken(t)
  token.value = t
  try {
    await api.adminPosts()
    authed.value = true
    return true
  } catch (e) {
    clearToken()
    token.value = ''
    authed.value = false
    if (e instanceof ApiError && e.code === 'unauthorized') return false
    return false
  }
}

export function logout(): void {
  clearToken()
  token.value = ''
  authed.value = false
}
