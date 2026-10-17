import { ref } from 'vue'

// 站点固定为赛博暗色主题（已移除明暗切换）
export type Theme = 'dark' | 'light'

export const theme = ref<Theme>('dark')

function apply(): void {
  const el = document.documentElement
  el.classList.remove('dark', 'light')
  el.classList.add('dark')
}

export function initTheme(): void {
  apply()
}
