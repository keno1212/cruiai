import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  // Pages 项目站部署时通过 VITE_BASE 指定子路径（如 /cruiai/）；本地默认根路径
  base: process.env.VITE_BASE || '/',
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  server: {
    port: 5173,
    // 开发期把 /api 代理到 Go 后端
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
})
