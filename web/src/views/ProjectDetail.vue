<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { api } from '@/api'
import { renderMarkdown } from '@/utils/markdown'
import type { Work } from '@/types'

const route = useRoute()
const work = ref<Work | null>(null)
const loading = ref(true)
const notFound = ref(false)

async function load(slug: string): Promise<void> {
  loading.value = true
  notFound.value = false
  try {
    const list = await api.works()
    const found = list.find((w) => w.slug === slug) || null
    if (!found) {
      notFound.value = true
      work.value = null
    } else {
      work.value = found
    }
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

const html = computed(() => (work.value ? renderMarkdown(work.value.content) : ''))
</script>

<template>
  <div>
    <RouterLink to="/projects" class="nav-link">← 返回作品</RouterLink>

    <div v-if="loading" class="empty" style="margin-top: 40px">加载中…</div>
    <div v-else-if="notFound" class="empty" style="margin-top: 40px">作品不存在</div>

    <article v-else-if="work" class="post-body">
      <header class="post-head">
        <span class="tag-chip">{{ work.tag }}</span>
        <h1 class="post-title glitch-hover">{{ work.title }}</h1>
        <div class="card-meta">
          {{ work.tag }} · {{ work.link ? '已上线' : '施工中' }}
          <span v-if="work.createdAt"> · 创建于 {{ work.createdAt.slice(0, 10) }}</span>
        </div>
      </header>

      <p class="card-excerpt" style="margin: 18px auto 22px; max-width: 640px; text-align: center">{{ work.description }}</p>

      <div class="hero-actions" style="margin-bottom: 30px">
        <a v-if="work.link" :href="work.link" target="_blank" rel="noopener" class="btn btn-primary">
          前往项目 →
        </a>
        <span v-else class="tag-chip">施工中</span>
      </div>

      <div v-html="html"></div>
    </article>
  </div>
</template>
