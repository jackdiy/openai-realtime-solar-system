# 太阳系探索器 | Solar System Explorer

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![NextJS](https://img.shields.io/badge/Built_with-NextJS-blue)
![Gemini API](https://img.shields.io/badge/Powered_by-Gemini_API-orange)

[English](#english) | [简体中文](#中文)

---

## 中文

这是一个集成了 **语音交互** 和 **手势控制** 的3D太阳系探索应用。通过 Gemini AI 实现自然语言对话，通过 Mediapipe 实现实时手势识别，为用户提供沉浸式的太阳系探索体验。

![screenshot](./public/screenshot.jpg)

### ✨ 主要特性

- 🎙️ **Gemini 语音交互** - 使用 Gemini 2.0 Flash API 进行实时语音对话
- 👋 **手势控制** - 通过 Mediapipe Hands 识别手势，实现 AR 般的交互体验
- 🌍 **国际化支持** - 默认简体中文，可切换至英文
- 🎨 **现代化UI设计** - 玻璃拟态效果、渐变色彩、流畅动画
- 🎵 **音效系统** - 使用 Tone.js 提供交互音效和背景音乐
- 🌌 **3D场景** - 基于 Spline 的高质量3D太阳系模型

### 🎮 交互方式

#### 语音控制
- 询问任何关于太阳系的问题
- 聚焦到特定行星："告诉我关于火星的信息"
- 查看数据图表："地球上陆地和水的分布是什么？"
- 查看国际空间站："国际空间站现在在哪里？"
- 查看卫星："显示木星的伽利略卫星"
- 查看轨道视图："行星在轨道上的位置如何？"

#### 手势控制
- 👐 **双手张开/合拢** - 放大/缩小视图
- ✋ **单手旋转** - 旋转视角
- 👆 **食指指向** - 选择星球
- ✊ **双手握拳** - 重置视图
- 👍 **竖起大拇指** - 打开轨道视图

### 🚀 快速开始

#### 1. 前置要求

- Node.js 18+
- Gemini API 密钥

#### 2. 获取 API 密钥

访问 [Google AI Studio](https://makersuite.google.com/app/apikey) 获取 Gemini API 密钥。

#### 3. 克隆项目

\`\`\`bash
git clone https://github.com/jackdiy/openai-realtime-solar-system.git
cd openai-realtime-solar-system
\`\`\`

#### 4. 配置环境变量

创建 `.env` 文件：

\`\`\`bash
GEMINI_API_KEY=your_gemini_api_key_here
\`\`\`

#### 5. 安装依赖

\`\`\`bash
npm install
\`\`\`

#### 6. 运行应用

\`\`\`bash
npm run dev
\`\`\`

应用将在 [http://localhost:3000](http://localhost:3000) 运行。

### 🛠️ 技术栈

- **前端框架**: Next.js 15, React 19
- **AI API**: Google Gemini 2.0 Flash
- **手势识别**: Mediapipe Hands
- **3D渲染**: Spline
- **音效**: Tone.js
- **国际化**: react-i18next
- **样式**: Tailwind CSS + 自定义玻璃拟态效果
- **语言**: TypeScript

### 📁 项目结构

\`\`\`
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
│   └── sound-manager.ts  # 音效管理器
└── public/               # 静态资源
\`\`\`

### 🎨 设计特色

- **玻璃拟态效果** - 半透明背景、模糊滤镜
- **HSL 颜色系统** - 精心调配的和谐色彩
- **流畅动画** - 微交互、过渡效果
- **现代字体** - Inter、Roboto
- **深色模式** - 优雅的深色主题

### 📝 自定义

#### 更改语音指令

编辑 `lib/gemini-config.ts` 中的 `GEMINI_INSTRUCTIONS`。

#### 添加新工具

在 `lib/gemini-config.ts` 的 `GEMINI_TOOLS` 中添加新的工具定义。

#### 更改3D场景

在 `components/scene.tsx` 中更新 Spline 场景 URL。

### 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

---

## English

An interactive 3D solar system exploration app with **voice interaction** and **gesture control**. Powered by Gemini AI for natural language conversations and Mediapipe for real-time gesture recognition, providing an immersive solar system exploration experience.

### ✨ Key Features

- 🎙️ **Gemini Voice Interaction** - Real-time voice conversation using Gemini 2.0 Flash API
- 👋 **Gesture Control** - AR-like interaction using Mediapipe Hands
- 🌍 **Internationalization** - Default Simplified Chinese, switchable to English
- 🎨 **Modern UI Design** - Glassmorphism, gradients, smooth animations
- 🎵 **Sound System** - Interactive sounds and background music using Tone.js
- 🌌 **3D Scene** - High-quality 3D solar system model based on Spline

### 🎮 Interaction Methods

#### Voice Control
- Ask any questions about the solar system
- Focus on specific planets: "Tell me about Mars"
- View data charts: "What's the distribution of land and water on Earth?"
- Check ISS position: "Where is the International Space Station?"
- View moons: "Show me Jupiter's Galilean moons"
- View orbit view: "How are the planets positioned in their orbits?"

#### Gesture Control
- 👐 **Spread/Pinch hands** - Zoom in/out
- ✋ **Single hand rotate** - Rotate view
- 👆 **Point with index finger** - Select planet
- ✊ **Two fists** - Reset view
- 👍 **Thumbs up** - Open orbit view

### 🚀 Quick Start

#### 1. Prerequisites

- Node.js 18+
- Gemini API Key

#### 2. Get API Key

Visit [Google AI Studio](https://makersuite.google.com/app/apikey) to get your Gemini API key.

#### 3. Clone the Repository

\`\`\`bash
git clone https://github.com/jackdiy/openai-realtime-solar-system.git
cd openai-realtime-solar-system
\`\`\`

#### 4. Configure Environment Variables

Create a `.env` file:

\`\`\`bash
GEMINI_API_KEY=your_gemini_api_key_here
\`\`\`

#### 5. Install Dependencies

\`\`\`bash
npm install
\`\`\`

#### 6. Run the Application

\`\`\`bash
npm run dev
\`\`\`

The app will be available at [http://localhost:3000](http://localhost:3000).

### 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19
- **AI API**: Google Gemini 2.0 Flash
- **Gesture Recognition**: Mediapipe Hands
- **3D Rendering**: Spline
- **Audio**: Tone.js
- **i18n**: react-i18next
- **Styling**: Tailwind CSS + Custom Glassmorphism
- **Language**: TypeScript

### 📝 Customization

#### Change Voice Instructions

Edit `GEMINI_INSTRUCTIONS` in `lib/gemini-config.ts`.

#### Add New Tools

Add new tool definitions in `GEMINI_TOOLS` in `lib/gemini-config.ts`.

#### Change 3D Scene

Update the Spline scene URL in `components/scene.tsx`.

### 🤝 Contributing

Issues and Pull Requests are welcome!

### 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
