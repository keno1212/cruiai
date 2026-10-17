<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ (e: 'secret'): void }>()

// 隐藏热区：1.2 秒内连点 3 次 Logo 触发后台入口
const clicks = ref(0)
let timer: number | undefined

function onLogoClick(): void {
  clicks.value += 1
  if (timer) window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    clicks.value = 0
  }, 1200)
  if (clicks.value >= 3) {
    clicks.value = 0
    emit('secret')
  }
}
</script>

<template>
  <RouterLink to="/" class="logo" @click="onLogoClick" aria-label="cruiai 首页">
    <span class="logo-mark" aria-hidden="true">
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- 六边形框 -->
        <path d="M20 3 L34 11.5 L34 28.5 L20 37 L6 28.5 L6 11.5 Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
        <!-- 内部 C 弧 -->
        <path d="M25 13 A8 8 0 1 0 25 27" stroke="var(--c-amber)" stroke-width="3" stroke-linecap="round" fill="none" />
        <!-- 内部点（落在 C 右侧） -->
        <circle cx="27.5" cy="20" r="2.4" fill="var(--c-cyan)" />
      </svg>
    </span>
    <span class="logo-word">crui<span class="logo-ai">Ai</span></span>
  </RouterLink>
</template>
