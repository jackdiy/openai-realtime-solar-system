# 部署指南 | Deployment Guide

[English](#english) | [简体中文](#中文)

---

## 中文

### 本地开发部署

#### 1. 环境准备

确保你的系统已安装：
- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器
- 现代浏览器（Chrome、Firefox、Edge、Safari）
- 摄像头（用于手势控制，可选）
- 麦克风（用于语音交互）

#### 2. 克隆项目

\`\`\`bash
git clone https://github.com/jackdiy/openai-realtime-solar-system.git
cd openai-realtime-solar-system
\`\`\`

#### 3. 安装依赖

\`\`\`bash
npm install
\`\`\`

#### 4. 配置环境变量

复制 `.env.example` 到 `.env`：

\`\`\`bash
cp .env.example .env
\`\`\`

编辑 `.env` 文件，填入你的 Gemini API 密钥：

\`\`\`
GEMINI_API_KEY=your_gemini_api_key_here
\`\`\`

获取 API 密钥：
1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 登录你的 Google 账号
3. 创建新的 API 密钥
4. 复制密钥到 `.env` 文件

#### 5. 运行开发服务器

\`\`\`bash
npm run dev
\`\`\`

服务器将在 [http://localhost:3000](http://localhost:3000) 启动。

#### 6. 构建生产版本

\`\`\`bash
npm run build
npm start
\`\`\`

### 云平台部署

#### Vercel 部署（推荐）

Vercel 是 Next.js 的官方部署平台，部署最简单。

1. **安装 Vercel CLI**

\`\`\`bash
npm install -g vercel
\`\`\`

2. **登录 Vercel**

\`\`\`bash
vercel login
\`\`\`

3. **部署项目**

\`\`\`bash
vercel
\`\`\`

4. **配置环境变量**

在 Vercel 项目设置中添加环境变量：
- `GEMINI_API_KEY`: 你的 Gemini API 密钥

5. **重新部署**

\`\`\`bash
vercel --prod
\`\`\`

#### Netlify 部署

1. **安装 Netlify CLI**

\`\`\`bash
npm install -g netlify-cli
\`\`\`

2. **构建项目**

\`\`\`bash
npm run build
\`\`\`

3. **部署**

\`\`\`bash
netlify deploy --prod
\`\`\`

4. **配置环境变量**

在 Netlify 项目设置中添加 `GEMINI_API_KEY`。

#### Docker 部署

1. **创建 Dockerfile**

\`\`\`dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
\`\`\`

2. **构建镜像**

\`\`\`bash
docker build -t solar-system-explorer .
\`\`\`

3. **运行容器**

\`\`\`bash
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key solar-system-explorer
\`\`\`

### 性能优化建议

1. **启用 Next.js 图片优化**
   - 使用 `next/image` 组件
   - 配置图片域名白名单

2. **启用缓存**
   - 配置 CDN
   - 启用浏览器缓存

3. **代码分割**
   - Next.js 自动进行代码分割
   - 使用动态导入减小初始包大小

4. **压缩资源**
   - 启用 Gzip 或 Brotli 压缩
   - 压缩图片和视频

### 安全注意事项

1. **API 密钥保护**
   - 永远不要在客户端代码中硬编码 API 密钥
   - 使用环境变量
   - 考虑实现后端代理以隐藏 API 密钥

2. **HTTPS**
   - 在生产环境中始终使用 HTTPS
   - 配置 SSL 证书

3. **CORS 配置**
   - 配置正确的 CORS 策略
   - 限制允许的来源

### 故障排查

#### 构建失败

\`\`\`bash
# 清除缓存
rm -rf .next node_modules
npm install
npm run build
\`\`\`

#### 环境变量未生效

- 确保 `.env` 文件在项目根目录
- 重启开发服务器
- 检查变量名是否正确

#### 音频/视频权限问题

- 在浏览器中允许麦克风和摄像头权限
- 使用 HTTPS（某些浏览器要求）

---

## English

### Local Development Deployment

#### 1. Prerequisites

Ensure you have installed:
- Node.js 18.0 or higher
- npm or yarn package manager
- Modern browser (Chrome, Firefox, Edge, Safari)
- Camera (for gesture control, optional)
- Microphone (for voice interaction)

#### 2. Clone the Project

\`\`\`bash
git clone https://github.com/jackdiy/openai-realtime-solar-system.git
cd openai-realtime-solar-system
\`\`\`

#### 3. Install Dependencies

\`\`\`bash
npm install
\`\`\`

#### 4. Configure Environment Variables

Copy `.env.example` to `.env`:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` file and add your Gemini API key:

\`\`\`
GEMINI_API_KEY=your_gemini_api_key_here
\`\`\`

Get API Key:
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to `.env` file

#### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Server will start at [http://localhost:3000](http://localhost:3000).

#### 6. Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

### Cloud Platform Deployment

#### Vercel Deployment (Recommended)

Vercel is the official deployment platform for Next.js.

1. **Install Vercel CLI**

\`\`\`bash
npm install -g vercel
\`\`\`

2. **Login to Vercel**

\`\`\`bash
vercel login
\`\`\`

3. **Deploy Project**

\`\`\`bash
vercel
\`\`\`

4. **Configure Environment Variables**

Add environment variables in Vercel project settings:
- `GEMINI_API_KEY`: Your Gemini API key

5. **Redeploy**

\`\`\`bash
vercel --prod
\`\`\`

#### Netlify Deployment

1. **Install Netlify CLI**

\`\`\`bash
npm install -g netlify-cli
\`\`\`

2. **Build Project**

\`\`\`bash
npm run build
\`\`\`

3. **Deploy**

\`\`\`bash
netlify deploy --prod
\`\`\`

4. **Configure Environment Variables**

Add `GEMINI_API_KEY` in Netlify project settings.

#### Docker Deployment

1. **Create Dockerfile**

\`\`\`dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
\`\`\`

2. **Build Image**

\`\`\`bash
docker build -t solar-system-explorer .
\`\`\`

3. **Run Container**

\`\`\`bash
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key solar-system-explorer
\`\`\`

### Performance Optimization

1. **Enable Next.js Image Optimization**
   - Use `next/image` component
   - Configure image domain whitelist

2. **Enable Caching**
   - Configure CDN
   - Enable browser caching

3. **Code Splitting**
   - Next.js automatically splits code
   - Use dynamic imports to reduce initial bundle size

4. **Compress Assets**
   - Enable Gzip or Brotli compression
   - Compress images and videos

### Security Considerations

1. **API Key Protection**
   - Never hardcode API keys in client code
   - Use environment variables
   - Consider implementing backend proxy to hide API keys

2. **HTTPS**
   - Always use HTTPS in production
   - Configure SSL certificates

3. **CORS Configuration**
   - Configure proper CORS policies
   - Restrict allowed origins

### Troubleshooting

#### Build Fails

\`\`\`bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
\`\`\`

#### Environment Variables Not Working

- Ensure `.env` file is in project root
- Restart development server
- Check variable names are correct

#### Audio/Video Permission Issues

- Allow microphone and camera permissions in browser
- Use HTTPS (required by some browsers)
