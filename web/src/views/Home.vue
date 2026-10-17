<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '@/api'
import type { Post, Work } from '@/types'

const works = ref<Work[]>([])
const posts = ref<Post[]>([])
const loading = ref(true)

const slogans = [
  '正在重写 cruiai v1.0 — 前端 Vue3 + 后端 Go',
  '记录小游戏、技术博客与一点生活',
  '一个站点，两种身份：门户 + 工作台',
  'OPERATOR: Keno // STATUS: ONLINE'
]
const typed = ref('')

let sloganIndex = 0
let charIndex = 0
let deleting = false
let twTimer: number | undefined

function tick(): void {
  const current = slogans[sloganIndex]
  if (!deleting) {
    charIndex += 1
    typed.value = current.slice(0, charIndex)
    if (charIndex >= current.length) {
      deleting = true
      twTimer = window.setTimeout(tick, 1500)
      return
    }
    twTimer = window.setTimeout(tick, 70)
  } else {
    charIndex -= 1
    typed.value = current.slice(0, charIndex)
    if (charIndex <= 0) {
      deleting = false
      sloganIndex = (sloganIndex + 1) % slogans.length
      twTimer = window.setTimeout(tick, 400)
      return
    }
    twTimer = window.setTimeout(tick, 35)
  }
}

function startTypewriter(): void {
  sloganIndex = 0
  charIndex = 0
  deleting = false
  typed.value = ''
  tick()
}

function stopTypewriter(): void {
  if (twTimer) window.clearTimeout(twTimer)
}

onMounted(async () => {
  startTypewriter()
  try {
    const [w, p] = await Promise.all([api.works(), api.posts()])
    works.value = w
    posts.value = p
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  stopTypewriter()
})

const featured = () =>
  works.value
    .filter((w) => w.featured)
    .concat(works.value.filter((w) => !w.featured))
    .slice(0, 3)
</script>

<template>
  <section class="hero">
    <div class="hero-content">
      <div class="hero-badge">Keno 的创作站 // 全栈程序员</div>
      <h1 class="hero-title">
        <span class="hero-line1">喜欢造东西的人</span><br />
        <span class="hero-line2">和他的工作台</span>
      </h1>
      <div class="hero-type">&gt; {{ typed }}<span class="tw-caret"></span></div>
      <p class="hero-sub">
        我是 Keno，全栈程序员。这里记录我做的小游戏、写的技术博客，和一点生活里的日常。
      </p>
      <div class="hero-actions">
        <RouterLink to="/blog" class="btn btn-primary">开始阅读 →</RouterLink>
        <RouterLink to="/projects" class="btn btn-secondary">看看作品</RouterLink>
      </div>
      <div class="hero-stats" v-if="!loading">
        <div class="stat-item">
          <div class="stat-value">{{ works.length }}+</div>
          <div class="stat-label">项目作品</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ posts.length }}</div>
          <div class="stat-label">技术文章</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">∞</div>
          <div class="stat-label">创造灵感</div>
        </div>
      </div>
    </div>
  </section>

  <section class="section" v-if="!loading && posts.length">
    <span class="section-label">// BLOG</span>
    <div class="section-head">
      <h2 class="section-title">最新文章</h2>
      <RouterLink to="/blog" class="nav-link">全部 →</RouterLink>
    </div>
    <div class="grid-2">
      <RouterLink
        v-for="p in posts.slice(0, 2)"
        :key="p.id"
        :to="`/blog/${p.slug}`"
        class="cyber-card"
      >
        <span class="tag-chip">{{ p.category }}</span>
        <div class="card-title">{{ p.title }}</div>
        <div class="card-excerpt">{{ p.excerpt }}</div>
        <div class="card-meta">{{ p.postDate.slice(0, 10) }}</div>
      </RouterLink>
    </div>
  </section>

  <section class="section" v-if="!loading && works.length">
    <span class="section-label">// PROJECTS</span>
    <div class="section-head">
      <h2 class="section-title">项目作品</h2>
      <RouterLink to="/projects" class="nav-link">全部 →</RouterLink>
    </div>
    <div class="grid-3">
      <RouterLink
        v-for="w in featured()"
        :key="w.id"
        :to="`/projects/${w.slug}`"
        class="cyber-card"
      >
        <span class="tag-chip">{{ w.tag }}</span>
        <div class="card-title">{{ w.title }}</div>
        <div class="card-excerpt">{{ w.description }}</div>
        <div class="card-meta">{{ w.tag }} · {{ w.link ? '已上线' : '施工中' }}</div>
      </RouterLink>
    </div>
  </section>

  <section class="category-section">
    <span class="section-label">// NAVIGATE</span>
    <h2 class="section-title">快速导航</h2>
    <div class="category-grid">
      <RouterLink to="/blog" class="category-card">
        <h3>博客分类</h3>
        <div class="category-tags">
          <span class="tag-chip">小游戏</span>
          <span class="tag-chip">AI</span>
          <span class="tag-chip">工程</span>
          <span class="tag-chip">复盘</span>
        </div>
      </RouterLink>
      <RouterLink to="/projects" class="category-card">
        <h3>作品状态</h3>
        <div class="category-tags">
          <span class="tag-chip">进行中</span>
          <span class="tag-chip">已归档</span>
        </div>
      </RouterLink>
      <RouterLink to="/about" class="category-card">
        <h3>关于</h3>
        <div class="category-tags">
          <span class="tag-chip">个人简介</span>
          <span class="tag-chip">联系方式</span>
        </div>
      </RouterLink>
    </div>
  </section>
</template>
