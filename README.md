# 太阳系探索器

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![NextJS](https://img.shields.io/badge/Built_with-NextJS-blue)
![Gemini API](https://img.shields.io/badge/Powered_by-Gemini_API-orange)

这是一个集成了 **语音交互** 和 **手势控制** 的3D太阳系探索应用。通过 Gemini AI 实现自然语言对话，通过 Mediapipe 实现实时手势识别，为用户提供沉浸式的太阳系探索体验。

![screenshot](./public/screenshot.jpg)

## ✨ 主要特性

- 🎙️ **Gemini 语音交互** - 使用 Gemini 2.5 Flash Lite API 进行实时语音对话
- 🗣️ **本地TTS语音** - 使用Edge浏览器的Xiaoxiao音色进行中文语音合成
- 👋 **手势控制** - 通过 Mediapipe Hands 识别手势，实现 AR 般的交互体验
- 🌍 **国际化支持** - 默认简体中文，可切换至英文
- 🎨 **现代化UI设计** - 玻璃拟态效果、渐变色彩、流畅动画
- 🎵 **音效系统** - 使用 Tone.js 提供交互音效和背景音乐
- 🌌 **3D场景** - 基于 Spline 的高质量3D太阳系模型

## 🎮 交互方式

### 语音控制
- 询问任何关于太阳系的问题
- 聚焦到特定行星："告诉我关于火星的信息"
- 查看数据图表："地球上陆地和水的分布是什么？"
- 查看国际空间站："国际空间站现在在哪里？"
- 查看卫星："显示木星的伽利略卫星"
- 查看轨道视图："行星在轨道上的位置如何？"

### 手势控制
- 👐 **双手张开/合拢** - 放大/缩小视图
- ✋ **单手旋转** - 旋转视角
- 👆 **食指指向** - 选择星球
- ✊ **双手握拳** - 重置视图
- 👍 **竖起大拇指** - 打开轨道视图

## 🚀 快速开始

### 1. 前置要求

- Node.js 18+
- Gemini API 密钥
- Microsoft Edge 浏览器（推荐，用于获得最佳Xiaoxiao语音体验）

### 2. 获取 API 密钥

访问 [Google AI Studio](https://makersuite.google.com/app/apikey) 获取 Gemini API 密钥。

### 3. 克隆项目

```bash
git clone https://github.com/jackdiy/openai-realtime-solar-system.git
cd openai-realtime-solar-system
```

### 4. 配置环境变量

创建 `.env` 文件：

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### 5. 安装依赖

```bash
npm install
```

### 6. 运行应用

```bash
npm run dev
```

应用将在 [http://localhost:3000](http://localhost:3000) 运行。

## 🛠️ 技术栈

- **前端框架**: Next.js 15, React 19
- **AI API**: Google Gemini 2.5 Flash Lite
- **手势识别**: Mediapipe Hands
- **3D渲染**: Spline
- **语音合成**: Web Speech API (Edge浏览器Xiaoxiao音色)
- **音效**: Tone.js
- **国际化**: react-i18next
- **样式**: Tailwind CSS + 自定义玻璃拟态效果
- **语言**: TypeScript

## 📁 项目结构

```
├── app/                    # Next.js 应用目录
│   ├── api/               # API 路由
│   │   ├── gemini/       # Gemini API 集成
│   │   └── iss/          # 国际空间站位置 API
│   ├── globals.css       # 全局样式
│   └── layout.tsx        # 根布局
├── components/            # React 组件
│   ├── app.tsx           # 主应用组件
│   ├── controls.tsx      # 控制按钮
│   ├── gesture-control.tsx  # 手势控制
│   ├── settings.tsx      # 设置面板
│   ├── scene.tsx         # 3D 场景
│   └── enhanced-styles.css  # 增强样式
├── lib/                   # 工具库
│   ├── i18n.ts           # 国际化配置
│   ├── gemini-client.ts  # Gemini 客户端
│   ├── gemini-config.ts  # Gemini 配置
│   ├── gesture-recognition.ts  # 手势识别服务
│   ├── sound-manager.ts  # 音效管理器
│   └── tts-service.ts    # TTS语音服务
└── public/               # 静态资源
```

## 🎨 设计特色

- **玻璃拟态效果** - 半透明背景、模糊滤镜
- **HSL 颜色系统** - 精心调配的和谐色彩
- **流畅动画** - 微交互、过渡效果
- **现代字体** - Inter、Roboto
- **深色模式** - 优雅的深色主题

## 📝 自定义

### 更改语音指令

编辑 `lib/gemini-config.ts` 中的 `GEMINI_INSTRUCTIONS`。

### 添加新工具

在 `lib/gemini-config.ts` 的 `GEMINI_TOOLS` 中添加新的工具定义。

### 更改3D场景

在 `components/scene.tsx` 中更新 Spline 场景 URL。

### 更改TTS音色

如果不使用Edge浏览器的Xiaoxiao音色，可以在 `lib/tts-service.ts` 中修改音色选择逻辑。

## 🎙️ 语音功能说明

### Gemini语音理解
本项目使用 Gemini 2.5 Flash Lite 进行语音理解和对话。用户可以用中文与AI进行自然对话。

### Edge浏览器TTS
本项目使用浏览器原生的Web Speech API进行语音合成。为获得最佳中文语音体验，推荐使用Microsoft Edge浏览器，它提供了高质量的Xiaoxiao（晓晓）神经网络语音。

**Xiaoxiao语音特点：**
- 自然流畅的中文女声
- 神经网络合成，音质优秀
- 完全免费，无需额外配置
- Edge浏览器原生支持

**在其他浏览器中：**
项目会自动回退到可用的中文语音或浏览器默认语音。

## 🔒 安全性

### API密钥保护
- 使用环境变量存储API密钥
- 不在客户端代码中暴露密钥
- 生产环境建议使用WebSocket代理

详见 `SECURITY.md`

## 📖 更多文档

- **DEPLOYMENT.md** - 详细部署指南
- **GESTURES.md** - 手势控制使用说明
- **SECURITY.md** - 安全实施指南
- **PROJECT_SUMMARY.md** - 项目改造总结

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 💡 使用提示

### 推荐环境
- **浏览器**: Microsoft Edge（获得最佳Xiaoxiao语音体验）
- **网络**: 稳定的互联网连接（用于Gemini API）
- **设备**: 带摄像头和麦克风的设备

### 首次使用
1. 允许浏览器访问麦克风权限（用于语音交互）
2. 允许浏览器访问摄像头权限（用于手势控制，可选）
3. 点击右上角WiFi图标连接Gemini AI
4. 开始用中文与AI对话探索太阳系

### 故障排查

**语音识别不工作：**
- 确保已配置 `GEMINI_API_KEY`
- 检查麦克风权限
- 检查网络连接

**TTS语音不工作：**
- 确保使用支持Web Speech API的浏览器
- 推荐使用Edge浏览器获得Xiaoxiao语音
- 检查浏览器音量设置

**手势识别不工作：**
- 检查摄像头权限
- 确保光线充足
- 保持手在摄像头可见范围内

## 🌟 特别说明

本项目是对原OpenAI Realtime Solar System项目的全面改造，主要改进包括：

1. **AI后端切换** - 从OpenAI切换到Gemini 2.5 Flash Lite
2. **TTS集成** - 添加Edge浏览器Xiaoxiao语音支持
3. **手势控制** - 新增Mediapipe手势识别系统
4. **国际化** - 默认简体中文界面和交互
5. **现代化UI** - 全新的玻璃拟态设计风格
6. **音效系统** - 丰富的交互音效和背景音乐

项目代码包含详细的中文注释，便于理解和二次开发。
