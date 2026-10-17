# cruiai // 创造与复盘

个人站点 · 赛博朋克风格 · **Vue3 + Go 全栈 v1.0**

- 前端：`web/`（Vue3 + Vite + TypeScript + Tailwind + Vue Router + Pinia）
- 后端：`server/`（Go + chi + pgx/stdlib + PostgreSQL）
- 设计原型与交付物：`designs/cruiai-cyber/`（含 `handoff/` 切图与标示图）

## 设计要点
- 主色：琥珀金 `#f59e0b` + 赛博青 `#22d3d3`，近黑底 `#030712`
- 字体：**Outfit**（展示）+ **JetBrains Mono**（等宽，禁用通用字体）
- 特效：启动屏、Matrix 代码雨、打字机口号、标题 glitch、扫描线/噪点、Logo 霓虹
- 明暗双主题：右上角按钮切换（已补全 handoff 中标注的明色主题缺口）
- 全局页脚含备案号：`京ICP备2026012422号-3`

## 后台（隐藏入口，不出现在导航）
1. 在任意页面 **1.2 秒内连点 Logo 3 次** 触发隐藏热区
2. 输入管理员令牌（即服务端 `ADMIN_TOKEN`）进入
3. 支持文章 / 作品 / 站点信息的增删改

> 安全设计：未携带有效令牌的后台 API 统一返回 **404**（而非 401），不暴露后台存在。

## 本地运行

### 1. 数据库（PostgreSQL）
```sql
CREATE USER cruiai WITH PASSWORD 'cruiai';
CREATE DATABASE cruiai OWNER cruiai;
```

### 2. 后端
```bash
cd server
export DATABASE_URL="postgres://cruiai:cruiai@localhost:5432/cruiai?sslmode=disable"
export ADMIN_TOKEN="换成你的强随机令牌"
# 可选：export PORT=8080
go mod tidy
go run .        # 首次启动自动建表并写入种子数据
```

### 3. 前端（开发模式，热更新）
```bash
cd web
npm install
npm run dev     # http://localhost:5173 ，/api 已代理到 :8080
```

### 4. 生产构建（前后端单服务托管）
```bash
# ① 构建前端
cd web && npm run build          # 产物输出到 web/dist

# ② 部署到项目根的 web-dist（后端以此目录托管 SPA）
cd .. && cp -r web/dist web-dist

# ③ 从【项目根 cruiai/】启动后端，自动托管 web-dist 并回退 SPA 路由
go run .                         # 或 ./cruiai-server（已编译二进制）
# 访问 http://localhost:8080
```
> 后端对 `/api/*` 以外的请求：文件存在则静态返回；不存在且为无扩展名路由（如 `/blog`）
> 则回退到 `index.html`，因此 history 模式深链接在纯后端托管下也能直接用。

## API 速览
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| GET | `/api/posts?category=` | 已发布文章列表 |
| GET | `/api/posts/{slug}` | 单篇文章 |
| GET | `/api/works` | 作品列表 |
| GET | `/api/about` | 站点信息 |
| GET/POST/PUT/DELETE | `/api/admin/posts[/id]` | 文章管理（Bearer） |
| GET/POST/PUT | `/api/admin/works` | 作品管理（Bearer） |
| POST/PUT | `/api/admin/about` | 站点信息管理（Bearer） |

生产部署请务必覆盖 `DATABASE_URL` 与 `ADMIN_TOKEN`，不要在公网使用默认值。
