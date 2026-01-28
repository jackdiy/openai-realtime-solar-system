// Gemini 实时语音客户端服务
// 使用Gemini Multimodal Live API进行实时音频交互

import { GEMINI_MODEL, GEMINI_INSTRUCTIONS, GEMINI_TOOLS } from './gemini-config';

export class GeminiRealtimeClient {
  private ws: WebSocket | null = null;
  private apiKey: string = '';
  private isConnected: boolean = false;
  private audioContext: AudioContext | null = null;
  private audioWorklet: AudioWorkletNode | null = null;
  private mediaStream: MediaStream | null = null;
  
  // 回调函数
  private onMessageCallback: ((message: any) => void) | null = null;
  private onConnectedCallback: (() => void) | null = null;
  private onDisconnectedCallback: (() => void) | null = null;
  private onErrorCallback: ((error: any) => void) | null = null;

  constructor() {
    this.audioContext = new AudioContext({ sampleRate: 16000 });
  }

  // 连接到Gemini API
  async connect(apiKey: string): Promise<void> {
    if (this.isConnected) {
      console.log('已经连接到Gemini API');
      return;
    }

    this.apiKey = apiKey;

    try {
      // 构建WebSocket URL
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;
      
      this.ws = new WebSocket(wsUrl);
      this.ws.binaryType = 'arraybuffer';

      // WebSocket事件监听
      this.ws.onopen = () => {
        console.log('WebSocket连接已建立');
        this.isConnected = true;
        
        // 发送初始配置
        this.sendSetup();
        
        if (this.onConnectedCallback) {
          this.onConnectedCallback();
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('收到消息:', message);
          
          if (this.onMessageCallback) {
            this.onMessageCallback(message);
          }
        } catch (error) {
          console.error('解析消息失败:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket错误:', error);
        if (this.onErrorCallback) {
          this.onErrorCallback(error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket连接已关闭');
        this.isConnected = false;
        
        if (this.onDisconnectedCallback) {
          this.onDisconnectedCallback();
        }
      };
    } catch (error) {
      console.error('连接Gemini API失败:', error);
      throw error;
    }
  }

  // 发送初始设置
  private sendSetup(): void {
    if (!this.ws || !this.isConnected) return;

    const setupMessage = {
      setup: {
        model: `models/${GEMINI_MODEL}`,
        generation_config: {
          response_modalities: ['AUDIO'], // 语音响应
        },
        system_instruction: {
          parts: [{ text: GEMINI_INSTRUCTIONS }],
        },
        tools: GEMINI_TOOLS,
      },
    };

    this.send(setupMessage);
  }

  // 发送消息
  send(message: any): void {
    if (!this.ws || !this.isConnected) {
      console.error('WebSocket未连接');
      return;
    }

    try {
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error('发送消息失败:', error);
    }
  }

  // 发送音频数据
  sendAudio(audioData: ArrayBuffer): void {
    if (!this.ws || !this.isConnected) {
      console.error('WebSocket未连接');
      return;
    }

    // 将音频数据编码为base64
    const base64Audio = this.arrayBufferToBase64(audioData);
    
    const message = {
      realtime_input: {
        media_chunks: [
          {
            mime_type: 'audio/pcm;rate=16000',
            data: base64Audio,
          },
        ],
      },
    };

    this.send(message);
  }

  // 发送文本消息
  sendText(text: string): void {
    const message = {
      client_content: {
        turns: [
          {
            role: 'user',
            parts: [{ text }],
          },
        ],
        turn_complete: true,
      },
    };

    this.send(message);
  }

  // 调用工具
  sendToolResponse(toolCallId: string, functionResponse: any): void {
    const message = {
      tool_response: {
        function_responses: [
          {
            id: toolCallId,
            response: functionResponse,
          },
        ],
      },
    };

    this.send(message);
  }

  // 开始音频流
  async startAudioStream(stream: MediaStream): Promise<void> {
    this.mediaStream = stream;
    
    if (!this.audioContext) {
      this.audioContext = new AudioContext({ sampleRate: 16000 });
    }

    // 创建音频源
    // 注意：这里简化了音频处理，实际应用中可能需要更复杂的处理逻辑
    this.audioContext.createMediaStreamSource(stream);
    
    // 这里可以添加音频处理逻辑
    // 例如：降采样到16kHz，转换为PCM格式等
    
    console.log('音频流已开始');
  }

  // 停止音频流
  stopAudioStream(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    
    console.log('音频流已停止');
  }

  // 断开连接
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.stopAudioStream();
    this.isConnected = false;
  }

  // 注册回调
  onMessage(callback: (message: any) => void): void {
    this.onMessageCallback = callback;
  }

  onConnected(callback: () => void): void {
    this.onConnectedCallback = callback;
  }

  onDisconnected(callback: () => void): void {
    this.onDisconnectedCallback = callback;
  }

  onError(callback: (error: any) => void): void {
    this.onErrorCallback = callback;
  }

  // 工具函数：ArrayBuffer转Base64
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // 获取连接状态
  getIsConnected(): boolean {
    return this.isConnected;
  }
}

// 导出单例
export const geminiClient = new GeminiRealtimeClient();
