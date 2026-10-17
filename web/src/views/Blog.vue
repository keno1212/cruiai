<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '@/api'
import type { Post } from '@/types'

const posts = ref<Post[]>([])
const loading = ref(true)
const activeCat = ref<string>('全部')

onMounted(async () => {
  try {
    posts.value = await api.posts()
  } finally {
    loading.value = false
  }
})

const categories = computed(() => {
  const set = new Set(posts.value.map((p) => p.category))
  return ['全部', ...Array.from(set)]
})

const filtered = computed(() => {
  if (activeCat.value === '全部') return posts.value
  return posts.value.filter((p) => p.category === activeCat.value)
})
</script>

<template>
  <div>
    <span class="section-label">// BLOG</span>
    <h1 class="page-title">博客</h1>
    <p class="card-excerpt" style="margin: 10px auto 0; max-width: 620px; text-align: center">
      技术复盘、开发笔记与一点日常思考。
    </p>

    <div class="filter-bar" v-if="!loading">
      <button
        v-for="c in categories"
        :key="c"
        class="filter-chip"
        :class="{ active: activeCat === c }"
        @click="activeCat = c"
      >
        {{ c }}
      </button>
    </div>

    <div v-if="loading" class="empty">加载中…</div>
    <div v-else-if="!filtered.length" class="empty">暂无文章</div>
    <div class="grid-cards" v-else>
      <RouterLink
        v-for="p in filtered"
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
  </div>
</template>
