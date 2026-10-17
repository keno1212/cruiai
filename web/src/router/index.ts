import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Blog from '@/views/Blog.vue'
import PostDetail from '@/views/PostDetail.vue'
import Projects from '@/views/Projects.vue'
import ProjectDetail from '@/views/ProjectDetail.vue'
import About from '@/views/About.vue'
import Admin from '@/views/Admin.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/blog', name: 'blog', component: Blog },
  { path: '/blog/:slug', name: 'post', component: PostDetail },
  { path: '/projects', name: 'projects', component: Projects },
  { path: '/projects/:slug', name: 'project', component: ProjectDetail },
  { path: '/about', name: 'about', component: About },
  // 后台入口不在导航展示；通过 Logo 三连击等隐藏热区进入
  { path: '/admin', name: 'admin', component: Admin, meta: { admin: true } }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

export default router
