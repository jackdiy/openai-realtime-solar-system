"use client";

// 主应用组件 - 集成Gemini语音、手势控制和i18n
import { useEffect, useState, useCallback } from "react";
import Controls from "@/components/controls";
import Scene from "@/components/scene";
import Logs from "@/components/logs";
import Settings from "@/components/settings";
import GestureControl from "@/components/gesture-control";
import WelcomeScreen from "@/components/welcome-screen";
import { geminiClient } from "@/lib/gemini-client";
import { GestureType } from "@/lib/gesture-recognition";
import { soundManager, SoundType } from "@/lib/sound-manager";
import "@/lib/i18n";

type ToolCallOutput = {
  response: string;
  [key: string]: any;
};

export default function App() {
  const [logs, setLogs] = useState<any[]>([]);
  const [toolCall, setToolCall] = useState<any>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初始化
  useEffect(() => {
    console.log('太阳系探索器已启动 - 默认语言：简体中文');
  }, []);

  // 启动Gemini会话
  async function startSession() {
    try {
      setError(null);
      soundManager.playSound(SoundType.CONNECT);
      
      // 获取Gemini配置
      const config = await fetch("/api/gemini").then((response) =>
        response.json()
      );

      if (config.error) {
        throw new Error(config.error);
      }

      // 连接到Gemini
      await geminiClient.connect(config.apiKey);

      // 设置消息回调
      geminiClient.onMessage((message) => {
        console.log('收到Gemini消息:', message);
        handleGeminiMessage(message);
      });

      geminiClient.onConnected(() => {
        console.log('已连接到Gemini');
        setIsSessionActive(true);
        setIsListening(true);
        setLogs([]);
        soundManager.playSound(SoundType.SUCCESS);
      });

      geminiClient.onDisconnected(() => {
        console.log('Gemini连接已断开');
        setIsSessionActive(false);
        setIsListening(false);
        soundManager.playSound(SoundType.DISCONNECT);
      });

      geminiClient.onError((error) => {
        console.error('Gemini错误:', error);
        setError(error.message || '连接失败');
        soundManager.playSound(SoundType.ERROR);
      });

      // 开始音频流
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      await geminiClient.startAudioStream(stream);

    } catch (error: any) {
      console.error("启动会话失败:", error);
      setError(error.message || '启动失败');
      soundManager.playSound(SoundType.ERROR);
    }
  }

  // 停止会话
  function stopSession() {
    try {
      geminiClient.disconnect();
      setIsSessionActive(false);
      setIsListening(false);
      soundManager.playSound(SoundType.DISCONNECT);
    } catch (error) {
      console.error("停止会话失败:", error);
    }
  }

  // 处理Gemini消息
  function handleGeminiMessage(message: any) {
    // 根据Gemini的消息格式处理不同类型的响应
    if (message.toolCall) {
      handleToolCall(message.toolCall);
    } else if (message.serverContent) {
      // 处理AI响应文本
      const content = message.serverContent;
      setLogs((prev) => [content, ...prev]);
    }
  }

  // 处理工具调用
  async function handleToolCall(toolCall: any) {
    console.log("工具调用:", toolCall);
    setToolCall(toolCall);
    soundManager.playSound(SoundType.SELECT);

    // 初始化工具调用输出
    const toolCallOutput: ToolCallOutput = {
      response: `工具调用 ${toolCall.name} 执行成功。`,
    };

    // 处理特殊工具调用
    if (toolCall.name === "get_iss_position") {
      const issPosition = await fetch("/api/iss").then((response) =>
        response.json()
      );
      console.log("ISS位置:", issPosition);
      toolCallOutput.issPosition = issPosition;
    }

    // 发送工具响应回Gemini
    geminiClient.sendToolResponse(toolCall.id, toolCallOutput);
  }

  // 处理手势
  const handleGesture = useCallback((gesture: GestureType) => {
    console.log('检测到手势:', gesture);
    
    // 将手势映射到工具调用
    const gestureToTool: { [key in GestureType]?: any } = {
      [GestureType.ZOOM_IN]: {
        name: 'zoom',
        arguments: JSON.stringify({ direction: 'in' }),
      },
      [GestureType.ZOOM_OUT]: {
        name: 'zoom',
        arguments: JSON.stringify({ direction: 'out' }),
      },
      [GestureType.RESET]: {
        name: 'reset_camera',
        arguments: '{}',
      },
      [GestureType.MENU]: {
        name: 'show_orbit',
        arguments: '{}',
      },
    };

    const toolCall = gestureToTool[gesture];
    if (toolCall) {
      setToolCall(toolCall);
    }
  }, []);

  // 连接/断开按钮点击
  const handleConnectClick = async () => {
    if (isSessionActive) {
      console.log("正在停止会话");
      stopSession();
    } else {
      console.log("正在启动会话");
      await startSession();
    }
  };

  // 麦克风切换
  const handleMicToggleClick = async () => {
    if (!isSessionActive) return;
    
    if (isListening) {
      console.log("正在关闭麦克风");
      geminiClient.stopAudioStream();
      setIsListening(false);
      soundManager.playSound(SoundType.CLICK);
    } else {
      console.log("正在开启麦克风");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      await geminiClient.startAudioStream(stream);
      setIsListening(true);
      soundManager.playSound(SoundType.CLICK);
    }
  };

  return (
    <div className="relative size-full">
      {/* 3D场景 */}
      <Scene toolCall={toolCall} />
      
      {/* 控制按钮 */}
      <Controls
        handleConnectClick={handleConnectClick}
        handleMicToggleClick={handleMicToggleClick}
        isConnected={isSessionActive}
        isListening={isListening}
      />
      
      {/* 设置面板 */}
      <Settings />
      
      {/* 手势控制 */}
      <GestureControl onGesture={handleGesture} />
      
      {/* 日志显示 */}
      <Logs messages={logs} />
      
      {/* 错误提示 */}
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="glass-card px-6 py-4 bg-red-500/20 border-red-500/50">
            <p className="text-red-200">{error}</p>
          </div>
        </div>
      )}
      
      {/* 欢迎屏幕 */}
      <WelcomeScreen show={!isSessionActive && !error} />
    </div>
  );
}
