// i18n 国际化配置
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 中文翻译资源
const zhCN = {
  translation: {
    // 通用
    title: "太阳系探索器",
    subtitle: "语音与手势交互式3D太阳系",
    
    // 控制面板
    controls: {
      connect: "连接",
      disconnect: "断开连接",
      micOn: "麦克风开启",
      micOff: "麦克风关闭",
      cameraOn: "摄像头开启",
      cameraOff: "摄像头关闭",
      settings: "设置",
      language: "语言",
      volume: "音量",
      gestures: "手势控制",
    },
    
    // 行星名称
    planets: {
      Sun: "太阳",
      Mercury: "水星",
      Venus: "金星",
      Earth: "地球",
      Mars: "火星",
      Jupiter: "木星",
      Saturn: "土星",
      Uranus: "天王星",
      Neptune: "海王星",
      Pluto: "冥王星",
    },
    
    // 手势提示
    gestures: {
      title: "手势控制",
      zoom: "双手张开/合拢 - 缩放",
      rotate: "单手旋转 - 旋转视角",
      select: "食指指向 - 选择星球",
      reset: "双手握拳 - 重置视图",
      menu: "竖起大拇指 - 打开菜单",
      detecting: "检测手势中...",
      notDetected: "未检测到手势",
      ready: "手势控制已就绪",
    },
    
    // 状态提示
    status: {
      connecting: "正在连接...",
      connected: "已连接",
      disconnected: "未连接",
      listening: "正在聆听...",
      speaking: "AI正在回答...",
      processing: "处理中...",
      error: "出错了",
    },
    
    // 设置
    settings: {
      title: "设置",
      language: "语言",
      chinese: "简体中文",
      english: "English",
      voice: "语音设置",
      gestures: "手势设置",
      audio: "音频设置",
      enableGestures: "启用手势控制",
      enableVoice: "启用语音控制",
      enableSound: "启用音效",
      enableMusic: "启用背景音乐",
      close: "关闭",
    },
    
    // 欢迎和引导
    welcome: {
      title: "欢迎来到太阳系探索器",
      description: "通过语音和手势与3D太阳系互动",
      voiceIntro: "点击连接按钮开始语音对话",
      gestureIntro: "启用摄像头体验手势控制",
      start: "开始探索",
    },
    
    // 数据显示
    data: {
      loading: "加载数据中...",
      noData: "暂无数据",
      close: "关闭",
    },
  },
};

// 英文翻译资源
const enUS = {
  translation: {
    // Common
    title: "Solar System Explorer",
    subtitle: "Voice & Gesture Interactive 3D Solar System",
    
    // Control Panel
    controls: {
      connect: "Connect",
      disconnect: "Disconnect",
      micOn: "Microphone On",
      micOff: "Microphone Off",
      cameraOn: "Camera On",
      cameraOff: "Camera Off",
      settings: "Settings",
      language: "Language",
      volume: "Volume",
      gestures: "Gesture Control",
    },
    
    // Planet Names
    planets: {
      Sun: "Sun",
      Mercury: "Mercury",
      Venus: "Venus",
      Earth: "Earth",
      Mars: "Mars",
      Jupiter: "Jupiter",
      Saturn: "Saturn",
      Uranus: "Uranus",
      Neptune: "Neptune",
      Pluto: "Pluto",
    },
    
    // Gesture Tips
    gestures: {
      title: "Gesture Control",
      zoom: "Spread/Pinch hands - Zoom",
      rotate: "Single hand rotate - Rotate view",
      select: "Point with index finger - Select planet",
      reset: "Two fists - Reset view",
      menu: "Thumbs up - Open menu",
      detecting: "Detecting gestures...",
      notDetected: "No gesture detected",
      ready: "Gesture control ready",
    },
    
    // Status Messages
    status: {
      connecting: "Connecting...",
      connected: "Connected",
      disconnected: "Disconnected",
      listening: "Listening...",
      speaking: "AI is responding...",
      processing: "Processing...",
      error: "Error occurred",
    },
    
    // Settings
    settings: {
      title: "Settings",
      language: "Language",
      chinese: "简体中文",
      english: "English",
      voice: "Voice Settings",
      gestures: "Gesture Settings",
      audio: "Audio Settings",
      enableGestures: "Enable Gesture Control",
      enableVoice: "Enable Voice Control",
      enableSound: "Enable Sound Effects",
      enableMusic: "Enable Background Music",
      close: "Close",
    },
    
    // Welcome and Guide
    welcome: {
      title: "Welcome to Solar System Explorer",
      description: "Interact with 3D Solar System via Voice & Gestures",
      voiceIntro: "Click connect button to start voice conversation",
      gestureIntro: "Enable camera for gesture control experience",
      start: "Start Exploring",
    },
    
    // Data Display
    data: {
      loading: "Loading data...",
      noData: "No data available",
      close: "Close",
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'zh-CN': zhCN,
      'en-US': enUS,
    },
    lng: 'zh-CN', // 默认语言为简体中文
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
