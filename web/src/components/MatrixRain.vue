<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
let raf = 0
let ctx: CanvasRenderingContext2D | null = null
let columns: string[] = []
let drops: number[] = []
let fontSize = 16
let width = 0
let height = 0

// 主题相关颜色（随明暗主题刷新）
let fadeColor = 'rgba(3, 7, 18, 0.08)'
let headColor = '#f59e0b'
let tailColor = 'rgba(34, 211, 211, 0.55)'

const glyphs = '01アイウエオカキクケコｱｲｳｴｵABCDEFｦﾝ<>/{}#$%&*+='.split('')
const dpr = Math.min(window.devicePixelRatio || 1, 2)

function hexToRgba(hex: string, a: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

// 读取当前主题令牌，使代码雨颜色随明暗主题变化
function readThemeColors(): void {
  const cs = getComputedStyle(document.documentElement)
  const bg = (cs.getPropertyValue('--c-bg') || '#030712').trim()
  const cyan = (cs.getPropertyValue('--c-cyan') || '#22d3d3').trim()
  const amber = (cs.getPropertyValue('--c-amber') || '#f59e0b').trim()
  fadeColor = hexToRgba(bg, 0.08)
  tailColor = hexToRgba(cyan, 0.55)
  headColor = amber
}

function resize(): void {
  const el = canvas.value
  if (!el) return
  // 以窗口视口为基准，保证全屏铺满（fixed 画布不能依赖 clientWidth/height）
  width = window.innerWidth
  height = window.innerHeight
  el.style.width = `${width}px`
  el.style.height = `${height}px`
  el.width = Math.floor(width * dpr)
  el.height = Math.floor(height * dpr)
  ctx = el.getContext('2d')
  if (ctx) {
    ctx.resetTransform ? ctx.resetTransform() : ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(dpr, dpr)
  }
  const cols = Math.floor(width / fontSize)
  columns = new Array(cols).fill(' ')
  drops = new Array(cols).fill(1).map(() => Math.random() * -20)
  readThemeColors()
}

function draw(): void {
  if (!ctx) return
  ctx.fillStyle = fadeColor
  ctx.fillRect(0, 0, width, height)
  ctx.font = `${fontSize}px "JetBrains Mono", monospace`
  for (let i = 0; i < columns.length; i++) {
    const ch = glyphs[Math.floor(Math.random() * glyphs.length)]
    const x = i * fontSize
    const y = drops[i] * fontSize
    // 头部亮青、尾部暗琥珀，营造赛博雨
    ctx.fillStyle = Math.random() > 0.92 ? headColor : tailColor
    ctx.fillText(ch, x, y)
    if (y > height && Math.random() > 0.975) drops[i] = 0
    drops[i] += 0.6
  }
  raf = requestAnimationFrame(draw)
}

onMounted(() => {
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('cruiai-theme', resize)
  raf = requestAnimationFrame(draw)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
  window.removeEventListener('cruiai-theme', resize)
})
</script>

<template>
  <canvas ref="canvas" class="matrix-bg" aria-hidden="true"></canvas>
</template>
