<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { api } from '@/api'
import { renderMarkdown } from '@/utils/markdown'
import type { Post } from '@/types'

const route = useRoute()
const post = ref<Post | null>(null)
const loading = ref(true)
const notFound = ref(false)

async function load(slug: string): Promise<void> {
  loading.value = true
  notFound.value = false
  try {
    post.value = await api.post(slug)
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => load(route.params.slug as string))
watch(
  () => route.params.slug,
  (s) => {
    if (typeof s === 'string') load(s)
  }
)

const html = computed(() => (post.value ? renderMarkdown(post.value.content) : ''))
</script>

<template>
  <div>
    <RouterLink to="/blog" class="nav-link">← 返回博客</RouterLink>

    <div v-if="loading" class="empty" style="margin-top: 40px">加载中…</div>
    <div v-else-if="notFound" class="empty" style="margin-top: 40px">文章不存在</div>

    <article v-else-if="post" class="post-body">
      <header class="post-head">
        <span class="tag-chip">{{ post.category }}</span>
        <h1 class="post-title glitch-hover">{{ post.title }}</h1>
        <div class="card-meta">发布于 {{ post.postDate.slice(0, 10) }} · 更新于 {{ post.updatedAt.slice(0, 10) }}</div>
      </header>
      <div v-html="html"></div>
    </article>
  </div>
</template>
