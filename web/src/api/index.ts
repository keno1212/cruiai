import type { Post, Work, SiteInfo, PostInput, WorkInput } from '@/types'

const TOKEN_KEY = 'cruiai_admin_token'

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || ''
}
export function setToken(t: string): void {
  localStorage.setItem(TOKEN_KEY, t)
}
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

class ApiError extends Error {
  code: 'unauthorized' | 'error'
  constructor(message: string, code: 'unauthorized' | 'error') {
    super(message)
    this.code = code
  }
}

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(path, { ...opts, headers })
  // 后台鉴权失败后端统一返回 404（不暴露后台存在），前端当作未授权处理
  if (res.status === 404) throw new ApiError('unauthorized', 'unauthorized')
  if (!res.ok) throw new ApiError('request failed', 'error')
  return (await res.json()) as T
}

export const api = {
  health: () => request<{ status: string; time: string }>('/api/health'),
  posts: (category?: string) =>
    request<Post[]>(`/api/posts${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  post: (slug: string) => request<Post>(`/api/posts/${encodeURIComponent(slug)}`),
  works: () => request<Work[]>('/api/works'),
  about: () => request<SiteInfo>('/api/about'),

  // ---- 后台（需 Bearer Token）----
  adminPosts: () => request<Post[]>('/api/admin/posts'),
  savePost: (p: PostInput, id?: number) =>
    id
      ? request<{ ok: string }>(`/api/admin/posts/${id}`, { method: 'PUT', body: JSON.stringify(p) })
      : request<{ ok: string }>('/api/admin/posts', { method: 'POST', body: JSON.stringify(p) }),
  deletePost: (id: number) =>
    request<{ ok: string }>(`/api/admin/posts/${id}`, { method: 'DELETE' }),
  adminWorks: () => request<Work[]>('/api/admin/works'),
  saveWork: (w: WorkInput) =>
    request<{ ok: string }>('/api/admin/works', { method: 'POST', body: JSON.stringify(w) }),
  saveAbout: (a: SiteInfo) =>
    request<{ ok: string }>('/api/admin/about', { method: 'POST', body: JSON.stringify(a) })
}

export { ApiError }
