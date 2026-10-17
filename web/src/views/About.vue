<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { api } from '@/api'
import type { SiteInfo } from '@/types'

// 前端默认内容：后端不可用时仍保证页面完整；后端返回有效数据时被覆盖
const fallback: SiteInfo = {
  aboutText:
    '我是 cruiai 的全栈程序员，专注把想法落地为真正能跑、能测、能交付的系统。技术半径覆盖前端、后端、嵌入式与音视频流媒体，也会用 AI 工具链做内容创作。\n\n' +
    '语言上长期打磨 C / C++ / Java / Python，近年也在用 Rust 与 Go 写高并发与边缘服务；前端以 Vue 为主，配合 TypeScript 与 Tailwind 打造自洽的界面。\n\n' +
    '在多媒体方向，我从零搭建过分布式视频流媒体平台（GB28181 / RTSP / RTMP / WebRTC 全协议栈，ffmpeg 编排），也做过 Android 音视频采集传输测试，以及基于 Qt + FFmpeg 的嵌入式视频接收端。\n\n' +
    '做东西的偏好很朴素：依赖尽量少、链路尽量端到端实测验证、界面尽量有质感。这个站点本身也是我边做边复盘的作品集。',
  contactEmail: 'hi@cruiai.com',
  github: 'https://github.com/cruiai',
  techStack: [
    'C / C++',
    'Java',
    'Python',
    'Rust',
    'Go',
    'Vue',
    'TypeScript',
    'Qt',
    'FFmpeg',
    'Node.js',
    'Linux / 嵌入式'
  ],
  updatedAt: ''
}

const info = ref<SiteInfo>(fallback)
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await api.about()
    if (data && data.aboutText) info.value = data
  } catch {
    // 后端不可用时保持前端默认完整内容
  } finally {
    loading.value = false
  }
})

const paragraphs = computed(() =>
  info.value.aboutText
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
)
</script>

<template>
  <div>
    <span class="section-label">// ABOUT</span>
    <h1 class="page-title">关于</h1>
    <p class="about-role">全栈程序员 · 把想法做成能跑的系统</p>

    <div v-if="loading" class="empty">加载中…</div>
    <div v-else class="about-grid">
      <div class="cyber-card">
        <span class="tag-chip">ABOUT</span>
        <div class="about-body">
          <p class="about-text" v-for="(p, i) in paragraphs" :key="i">{{ p }}</p>
        </div>
        <div class="meta-row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-10 6L2 7" />
          </svg>
          <a :href="`mailto:${info.contactEmail}`">{{ info.contactEmail }}</a>
        </div>
        <div class="meta-row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <a :href="info.github" target="_blank" rel="noopener">{{ info.github }}</a>
        </div>
      </div>

      <div class="cyber-card">
        <span class="tag-chip">技术栈</span>
        <div class="tech-list">
          <span class="tag-chip" v-for="t in info.techStack" :key="t">{{ t }}</span>
        </div>
        <p class="card-excerpt" style="margin-top: 18px">
          全栈程序员，覆盖前端、后端、嵌入式与音视频流媒体；偏好用最少的依赖把事情做扎实，并坚持端到端实测验证。
        </p>
      </div>
    </div>
  </div>
</template>
