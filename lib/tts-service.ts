// TTS 语音服务
// 使用Edge浏览器的Xiaoxiao音色进行文本转语音

export class TTSService {
  private synth: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private isEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoice();
    }
  }

  // 初始化Xiaoxiao音色
  private initVoice() {
    if (!this.synth) return;

    const setVoice = () => {
      const voices = this.synth!.getVoices();
      
      // 优先查找Edge浏览器的Xiaoxiao音色（中文女声）
      // Xiaoxiao是Microsoft Edge浏览器提供的中文神经网络语音
      const xiaoxiao = voices.find(
        voice => voice.name.includes('Xiaoxiao') || 
                 voice.name.includes('晓晓') ||
                 (voice.lang === 'zh-CN' && voice.name.includes('Microsoft'))
      );

      if (xiaoxiao) {
        this.voice = xiaoxiao;
        console.log('已选择Xiaoxiao音色:', xiaoxiao.name);
      } else {
        // 回退到任何可用的中文音色
        const chineseVoice = voices.find(voice => voice.lang.startsWith('zh'));
        if (chineseVoice) {
          this.voice = chineseVoice;
          console.log('未找到Xiaoxiao，使用中文音色:', chineseVoice.name);
        } else {
          console.warn('未找到中文音色，将使用默认音色');
        }
      }
    };

    // 在某些浏览器中，voices列表需要异步加载
    if (this.synth.getVoices().length > 0) {
      setVoice();
    } else {
      this.synth.addEventListener('voiceschanged', setVoice);
    }
  }

  // 朗读文本
  speak(text: string, options?: {
    rate?: number;    // 语速 (0.1 - 10，默认1)
    pitch?: number;   // 音调 (0 - 2，默认1)
    volume?: number;  // 音量 (0 - 1，默认1)
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synth || !this.isEnabled) {
        resolve();
        return;
      }

      // 停止当前正在播放的语音
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // 设置音色
      if (this.voice) {
        utterance.voice = this.voice;
      }
      
      // 设置语言为简体中文
      utterance.lang = 'zh-CN';
      
      // 应用选项
      utterance.rate = options?.rate ?? 1.0;
      utterance.pitch = options?.pitch ?? 1.0;
      utterance.volume = options?.volume ?? 1.0;

      // 事件处理
      utterance.onend = () => resolve();
      utterance.onerror = (event) => {
        console.error('TTS错误:', event);
        reject(event);
      };

      // 开始朗读
      this.synth.speak(utterance);
    });
  }

  // 停止朗读
  stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  // 暂停朗读
  pause(): void {
    if (this.synth) {
      this.synth.pause();
    }
  }

  // 恢复朗读
  resume(): void {
    if (this.synth) {
      this.synth.resume();
    }
  }

  // 检查是否正在朗读
  isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }

  // 获取可用的音色列表
  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  // 获取当前使用的音色
  getCurrentVoice(): SpeechSynthesisVoice | null {
    return this.voice;
  }

  // 设置是否启用TTS
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  // 获取TTS启用状态
  isEnabledState(): boolean {
    return this.isEnabled;
  }

  // 检查浏览器是否支持TTS
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  // 检查是否使用Edge浏览器
  isEdgeBrowser(): boolean {
    if (typeof window === 'undefined') return false;
    const userAgent = window.navigator.userAgent.toLowerCase();
    return userAgent.includes('edg/') || userAgent.includes('edge/');
  }
}

// 导出单例 - 仅在浏览器环境中创建
export const ttsService = typeof window !== 'undefined' ? new TTSService() : ({
  speak: async () => {},
  stop: () => {},
  pause: () => {},
  resume: () => {},
  isSpeaking: () => false,
  getAvailableVoices: () => [],
  getCurrentVoice: () => null,
  setEnabled: () => {},
  isEnabledState: () => true,
  isSupported: () => false,
  isEdgeBrowser: () => false,
} as unknown as TTSService);
