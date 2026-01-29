# 安全说明 | Security Notes

## 重要安全提示

### Gemini API密钥保护

⚠️ **当前实现状态：** 本项目的Gemini API集成**尚未完全实现生产级别的安全措施**。

#### 问题

Gemini Multimodal Live API 需要通过WebSocket直接连接，这带来了以下安全挑战：

1. **API密钥暴露风险**
   - 直接在客户端使用API密钥会暴露在浏览器中
   - 任何人都可以通过开发者工具查看API密钥
   - 可能导致API密钥被滥用和产生意外费用

2. **当前实现**
   - 服务器端API路由(`/api/gemini`)只返回配置信息，不暴露API密钥
   - 客户端Gemini连接代码已被注释，防止不安全的直接连接
   - 需要额外的WebSocket代理服务器来安全地处理Gemini连接

#### 推荐的生产解决方案

有几种方法可以安全地实现Gemini API集成：

##### 方案1：WebSocket代理服务器（推荐）

创建一个独立的WebSocket代理服务器：

\`\`\`typescript
// websocket-proxy-server.ts
import { WebSocketServer } from 'ws';
import WebSocket from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (clientWs) => {
  // 使用服务器端的API密钥连接到Gemini
  const geminiWs = new WebSocket(
    \`wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=\${process.env.GEMINI_API_KEY}\`
  );

  // 在客户端和Gemini之间转发消息
  clientWs.on('message', (data) => {
    geminiWs.send(data);
  });

  geminiWs.on('message', (data) => {
    clientWs.send(data);
  });

  // 错误处理...
});
\`\`\`

然后客户端连接到你的代理服务器：

\`\`\`typescript
// 客户端
const ws = new WebSocket('wss://your-domain.com/gemini-proxy');
\`\`\`

##### 方案2：使用Next.js API路由（有限制）

虽然Next.js API路由主要用于HTTP请求，但可以配合轮询或Server-Sent Events：

\`\`\`typescript
// app/api/gemini/chat/route.ts
export async function POST(request: Request) {
  const { message } = await request.json();
  
  // 使用服务器端API密钥调用Gemini
  const response = await fetch('https://generativelanguage.googleapis.com/...', {
    headers: {
      'Authorization': \`Bearer \${process.env.GEMINI_API_KEY}\`
    },
    // ...
  });
  
  return response;
}
\`\`\`

##### 方案3：使用云函数/边缘函数

如Vercel Edge Functions或Cloudflare Workers：

\`\`\`typescript
// api/gemini.ts (Vercel Edge Function)
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  // 使用环境变量中的API密钥
  // 代理到Gemini API
}
\`\`\`

### 实施步骤

如果你想在生产环境中使用此项目：

1. **选择一个安全方案**（推荐方案1）

2. **实现WebSocket代理**
   - 创建独立的WebSocket服务器
   - 或使用云服务提供的WebSocket支持

3. **更新客户端代码**
   - 修改 `lib/gemini-client.ts`
   - 连接到你的代理服务器而不是直接连接Gemini

4. **配置CORS和认证**
   - 限制谁可以访问你的代理
   - 实现速率限制
   - 添加用户认证

5. **测试安全性**
   - 确保API密钥不会暴露在客户端
   - 测试各种攻击场景
   - 监控API使用情况

### 开发测试

对于**本地开发和测试**，你可以：

1. 使用原有的OpenAI Realtime API（需要OpenAI API密钥）
2. 实现模拟的Gemini响应用于UI测试
3. 专注于手势控制和UI功能的开发

### 其他安全最佳实践

1. **环境变量管理**
   - 使用 `.env.local` 存储敏感信息
   - 添加 `.env*` 到 `.gitignore`
   - 不要提交包含密钥的配置文件

2. **速率限制**
   - 实现API请求速率限制
   - 防止API滥用

3. **用户认证**
   - 为生产应用添加用户认证
   - 跟踪每个用户的API使用量

4. **监控和日志**
   - 监控API调用
   - 设置异常告警
   - 记录可疑活动

### 相关资源

- [Gemini API安全最佳实践](https://ai.google.dev/gemini-api/docs/oauth)
- [Next.js环境变量](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [WebSocket安全](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers)

---

## 免责声明

本项目提供的代码和示例仅用于学习和演示目的。在生产环境中使用前，必须实现适当的安全措施。开发者应对因不安全的API密钥处理而导致的任何问题负责。

建议在公开部署前咨询安全专家并进行全面的安全审计。
