<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '@/api'
import type { Work } from '@/types'

const works = ref<Work[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    works.value = await api.works()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <span class="section-label">// PROJECTS</span>
    <h1 class="page-title">作品</h1>
    <p class="card-excerpt" style="margin: 10px auto 0; max-width: 620px; text-align: center">
      我做过的小游戏、工具与平台项目。点卡片可前往对应站点。
    </p>

    <div v-if="loading" class="empty">加载中…</div>
    <div v-else-if="!works.length" class="empty">暂无作品</div>
    <div class="grid-cards" v-else>
      <div v-for="w in works" :key="w.id" class="cyber-card">
        <span class="tag-chip" v-if="w.featured">精选</span>
        <span class="tag-chip" v-else>{{ w.tag }}</span>
        <div class="card-title">{{ w.title }}</div>
        <div class="card-excerpt">{{ w.description }}</div>
        <div class="card-meta">{{ w.tag }}</div>
        <div class="hero-actions" style="margin-top: 16px">
          <RouterLink :to="`/projects/${w.slug}`" class="btn btn-ghost">查看详情 →</RouterLink>
          <a v-if="w.link" :href="w.link" target="_blank" rel="noopener" class="btn btn-ghost">
            前往 →
          </a>
          <span v-else class="tag-chip">施工中</span>
        </div>
      </div>
    </div>
  </div>
</template>
