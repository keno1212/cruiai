<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '@/api'
import { authed, login, logout } from '@/stores/auth'
import type { Post, Work, SiteInfo, PostInput, WorkInput } from '@/types'

const tab = ref<'posts' | 'works' | 'about'>('posts')
const gateToken = ref('')
const gateError = ref('')

// ---- Posts ----
const posts = ref<Post[]>([])
const postMsg = ref('')
const emptyPost: PostInput = {
  slug: '', title: '', category: '技术', status: 'draft', postDate: '', excerpt: '', content: ''
}
const postForm = ref<PostInput>({ ...emptyPost })
const editingPostId = ref<number | null>(null)

// ---- Works ----
const works = ref<Work[]>([])
const workMsg = ref('')
const emptyWork: WorkInput = {
  slug: '', title: '', tag: '项目', description: '', content: '', link: '', featured: false
}
const workForm = ref<WorkInput>({ ...emptyWork })
const editingWorkId = ref<number | null>(null)

// ---- About ----
const about = ref<SiteInfo | null>(null)
const aboutMsg = ref('')
const aboutForm = ref({ aboutText: '', contactEmail: '', github: '', techStack: '' })

async function submitGate(): Promise<void> {
  gateError.value = ''
  const ok = await login(gateToken.value.trim())
  if (!ok) {
    gateError.value = '校验失败：令牌无效或后端未启动（后台接口未授权时返回 404）。'
    return
  }
  gateToken.value = ''
  await loadAll()
}

function loadAll(): void {
  api.adminPosts().then((p) => (posts.value = p))
  api.adminWorks().then((w) => (works.value = w))
  api.about().then((a) => {
    about.value = a
    aboutForm.value = {
      aboutText: a.aboutText,
      contactEmail: a.contactEmail,
      github: a.github,
      techStack: a.techStack.join(', ')
    }
  })
}

// ---- Post actions ----
function newPost(): void {
  editingPostId.value = null
  postForm.value = { ...emptyPost }
}
function editPost(p: Post): void {
  editingPostId.value = p.id
  postForm.value = {
    slug: p.slug, title: p.title, category: p.category, status: p.status,
    postDate: p.postDate.slice(0, 10), excerpt: p.excerpt, content: p.content
  }
}
async function savePost(): Promise<void> {
  postMsg.value = ''
  try {
    await api.savePost(postForm.value, editingPostId.value ?? undefined)
    postMsg.value = '已保存'
    newPost()
    posts.value = await api.adminPosts()
  } catch (e) {
    postMsg.value = '保存失败：' + (e as Error).message
  }
}
async function delPost(id: number): Promise<void> {
  if (!confirm('确认删除该文章？')) return
  await api.deletePost(id)
  posts.value = await api.adminPosts()
}

// ---- Work actions ----
function newWork(): void {
  editingWorkId.value = null
  workForm.value = { ...emptyWork }
}
function editWork(w: Work): void {
  editingWorkId.value = w.id
  workForm.value = {
    slug: w.slug, title: w.title, tag: w.tag, description: w.description,
    content: w.content, link: w.link, featured: w.featured
  }
}
async function saveWork(): Promise<void> {
  workMsg.value = ''
  try {
    await api.saveWork(workForm.value)
    workMsg.value = '已保存'
    newWork()
    works.value = await api.adminWorks()
  } catch (e) {
    workMsg.value = '保存失败：' + (e as Error).message
  }
}

// ---- About actions ----
async function saveAbout(): Promise<void> {
  aboutMsg.value = ''
  const payload: SiteInfo = {
    aboutText: aboutForm.value.aboutText,
    contactEmail: aboutForm.value.contactEmail,
    github: aboutForm.value.github,
    techStack: aboutForm.value.techStack.split(',').map((s) => s.trim()).filter(Boolean),
    updatedAt: about.value?.updatedAt || ''
  }
  try {
    await api.saveAbout(payload)
    aboutMsg.value = '已保存'
    about.value = payload
  } catch (e) {
    aboutMsg.value = '保存失败：' + (e as Error).message
  }
}

function doLogout(): void {
  logout()
  posts.value = []
  works.value = []
}

watch(tab, () => {
  postMsg.value = ''
  workMsg.value = ''
  aboutMsg.value = ''
})

onMounted(() => {
  if (authed.value) loadAll()
})
</script>

<template>
  <div>
    <!-- 登录闸门（隐藏后台的第一道门） -->
    <div v-if="!authed" class="admin-gate">
      <span class="tag-chip">RESTRICTED</span>
      <h2 style="margin: 16px 0 4px; font-size: 1.3rem">后台入口</h2>
      <p class="card-excerpt">输入管理员令牌以进入。令牌即服务端 <code>ADMIN_TOKEN</code>。</p>
      <input
        v-model="gateToken"
        type="password"
        placeholder="ADMIN_TOKEN"
        @keyup.enter="submitGate"
      />
      <button class="btn btn-primary" style="width: 100%; margin-top: 16px; justify-content: center" @click="submitGate">
        进入
      </button>
      <div v-if="gateError" class="notice err" style="margin-top: 14px">{{ gateError }}</div>
    </div>

    <!-- 已授权：管理面板 -->
    <div v-else>
      <div class="row-between">
        <div>
          <span class="section-label">// ADMIN</span>
          <h1 class="page-title">管理面板</h1>
        </div>
        <button class="btn btn-ghost" @click="doLogout">退出登录</button>
      </div>

      <div class="tabs">
        <button class="tab" type="button" :class="{ active: tab === 'posts' }" @click="tab = 'posts'">文章</button>
        <button class="tab" type="button" :class="{ active: tab === 'works' }" @click="tab = 'works'">作品</button>
        <button class="tab" type="button" :class="{ active: tab === 'about' }" @click="tab = 'about'">站点信息</button>
      </div>

      <!-- 文章 -->
      <section v-if="tab === 'posts'">
        <div class="notice ok" v-if="postMsg">{{ postMsg }}</div>
        <div class="row-between" style="margin-bottom: 16px">
          <strong>文章列表（{{ posts.length }}）</strong>
          <button class="btn btn-primary" @click="newPost">+ 新建</button>
        </div>
        <div class="grid-cards">
          <div v-for="p in posts" :key="p.id" class="cyber-card">
            <span class="tag-chip" :class="{ muted: p.status !== 'published' }">{{ p.status }}</span>
            <div class="card-title">{{ p.title }}</div>
            <div class="card-meta">{{ p.category }} · {{ p.slug }}</div>
            <div class="hero-actions" style="margin-top: 14px">
              <button class="btn btn-ghost" @click="editPost(p)">编辑</button>
              <button class="btn btn-danger" @click="delPost(p.id)">删除</button>
            </div>
          </div>
        </div>

        <div class="cyber-card" style="margin-top: 22px">
          <strong>{{ editingPostId ? '编辑文章 #' + editingPostId : '新建文章' }}</strong>
          <div class="form-grid" style="margin-top: 14px">
            <div class="field">
              <label>slug</label>
              <input v-model="postForm.slug" placeholder="my-post" />
            </div>
            <div class="field">
              <label>标题</label>
              <input v-model="postForm.title" placeholder="标题" />
            </div>
            <div class="field">
              <label>分类</label>
              <input v-model="postForm.category" placeholder="技术" />
            </div>
            <div class="field">
              <label>状态</label>
              <select v-model="postForm.status">
                <option value="draft">draft</option>
                <option value="published">published</option>
              </select>
            </div>
            <div class="field">
              <label>发布日期</label>
              <input v-model="postForm.postDate" placeholder="2026-07-20" />
            </div>
            <div class="field">
              <label>摘要</label>
              <input v-model="postForm.excerpt" placeholder="一句话摘要" />
            </div>
          </div>
          <div class="field">
            <label>正文（支持 # 标题 / - 列表 / **粗体** / `代码`）</label>
            <textarea v-model="postForm.content"></textarea>
          </div>
          <button class="btn btn-primary" @click="savePost">保存文章</button>
        </div>
      </section>

      <!-- 作品 -->
      <section v-if="tab === 'works'">
        <div class="notice ok" v-if="workMsg">{{ workMsg }}</div>
        <div class="row-between" style="margin-bottom: 16px">
          <strong>作品列表（{{ works.length }}）</strong>
          <button class="btn btn-primary" @click="newWork">+ 新建</button>
        </div>
        <div class="grid-cards">
          <div v-for="w in works" :key="w.id" class="cyber-card">
            <span class="tag-chip">{{ w.featured ? '精选' : w.tag }}</span>
            <div class="card-title">{{ w.title }}</div>
            <div class="card-meta">{{ w.slug }}</div>
            <div class="hero-actions" style="margin-top: 14px">
              <button class="btn btn-ghost" @click="editWork(w)">编辑</button>
            </div>
          </div>
        </div>

        <div class="cyber-card" style="margin-top: 22px">
          <strong>{{ editingWorkId ? '编辑作品 #' + editingWorkId : '新建作品' }}</strong>
          <div class="form-grid" style="margin-top: 14px">
            <div class="field">
              <label>slug</label>
              <input v-model="workForm.slug" placeholder="my-work" />
            </div>
            <div class="field">
              <label>标题</label>
              <input v-model="workForm.title" placeholder="标题" />
            </div>
            <div class="field">
              <label>标签</label>
              <input v-model="workForm.tag" placeholder="项目" />
            </div>
            <div class="field">
              <label>链接</label>
              <input v-model="workForm.link" placeholder="https://" />
            </div>
          </div>
          <div class="field">
            <label>描述</label>
            <input v-model="workForm.description" placeholder="一句话描述" />
          </div>
          <div class="field">
            <label>正文</label>
            <textarea v-model="workForm.content"></textarea>
          </div>
          <label style="display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 0.82rem; color: var(--c-text-dim)">
            <input type="checkbox" v-model="workForm.featured" /> 设为精选
          </label>
          <button class="btn btn-primary" style="margin-top: 12px" @click="saveWork">保存作品</button>
        </div>
      </section>

      <!-- 站点信息 -->
      <section v-if="tab === 'about'">
        <div class="notice ok" v-if="aboutMsg">{{ aboutMsg }}</div>
        <div class="cyber-card">
          <strong>站点信息</strong>
          <div class="field" style="margin-top: 14px">
            <label>关于文本</label>
            <textarea v-model="aboutForm.aboutText"></textarea>
          </div>
          <div class="form-grid">
            <div class="field">
              <label>联系邮箱</label>
              <input v-model="aboutForm.contactEmail" placeholder="you@example.com" />
            </div>
            <div class="field">
              <label>GitHub</label>
              <input v-model="aboutForm.github" placeholder="https://github.com/..." />
            </div>
          </div>
          <div class="field">
            <label>技术栈（英文逗号分隔）</label>
            <input v-model="aboutForm.techStack" placeholder="Go, Vue3, PostgreSQL" />
          </div>
          <button class="btn btn-primary" @click="saveAbout">保存站点信息</button>
        </div>
      </section>

      <p style="margin-top: 24px; font-family: 'JetBrains Mono', monospace; font-size: 0.74rem; color: var(--c-text-muted)">
        <RouterLink to="/" class="nav-link">← 返回前台</RouterLink>
      </p>
    </div>
  </div>
</template>
