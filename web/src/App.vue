<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Logo from '@/components/Logo.vue'
import BootScreen from '@/components/BootScreen.vue'
import MatrixRain from '@/components/MatrixRain.vue'
import RobotPet from '@/components/RobotPet.vue'

const router = useRouter()
const route = useRoute()
const booted = ref(false)

// 赛博小玩意：滚动进度、终端时钟、鼠标光晕、路由切换故障
const progress = ref(0)
const hexTime = ref('000000')
const glow = reactive({ x: -300, y: -300 })
const glitching = ref(false)
let clockTimer: number | undefined
let glitchTimer: number | undefined

function onScroll(): void {
  const el = document.documentElement
  const max = el.scrollHeight - el.clientHeight
  progress.value = max > 0 ? Math.min(1, el.scrollTop / max) : 0
}
function updateClock(): void {
  hexTime.value = Date.now().toString(16).toUpperCase().slice(-6).padStart(6, '0')
}
function onMove(e: MouseEvent): void {
  glow.x = e.clientX
  glow.y = e.clientY
}

const nav = [
  { to: '/', label: '首页' },
  { to: '/blog', label: '博客' },
  { to: '/projects', label: '作品' },
  { to: '/about', label: '关于' }
]

function onSecret(): void {
  router.push('/admin')
}

onMounted(() => {
  setTimeout(() => {
    booted.value = true
  }, 1900)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('mousemove', onMove)
  onScroll()
  updateClock()
  clockTimer = window.setInterval(updateClock, 1000)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('mousemove', onMove)
  if (clockTimer) window.clearInterval(clockTimer)
  if (glitchTimer) window.clearTimeout(glitchTimer)
})

// 路由切换时触发一次性视图故障动画
watch(
  () => route.fullPath,
  () => {
    glitching.value = true
    if (glitchTimer) window.clearTimeout(glitchTimer)
    glitchTimer = window.setTimeout(() => (glitching.value = false), 320)
  }
)
</script>

<template>
  <div class="app-shell">
    <transition name="boot-fade">
      <BootScreen v-if="!booted" />
    </transition>

    <MatrixRain />
    <div
      class="cursor-glow"
      :style="{ left: glow.x + 'px', top: glow.y + 'px' }"
      aria-hidden="true"
    ></div>

    <div class="scroll-progress" :style="{ transform: `scaleX(${progress})` }" aria-hidden="true"></div>
    <div class="sys-ticker" aria-hidden="true">
      <span class="tk-time">{{ hexTime }}</span>
      <span class="tk-sep">::</span>
      <span class="tk-status">SYS://ONLINE</span>
    </div>

    <header class="nav">
      <div class="nav-inner">
        <Logo @secret="onSecret" />
        <nav class="nav-links">
          <RouterLink v-for="n in nav" :key="n.to" :to="n.to" class="nav-link">
            {{ n.label }}
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="main" :class="{ glitching }">
      <RouterView />
    </main>

    <footer class="footer">
      <div class="footer-inner">
        <span>© 2026 cruiai // 创造与复盘</span>
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener" class="footer-beian">
          京ICP备2026012422号-3
        </a>
      </div>
    </footer>

    <div class="scanline" aria-hidden="true"></div>
    <div class="noise" aria-hidden="true"></div>

    <RobotPet />
  </div>
</template>
