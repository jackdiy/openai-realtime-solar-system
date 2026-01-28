// 音效管理器
// 使用Tone.js管理背景音乐和音效
import * as Tone from 'tone';

// 音效类型
export enum SoundType {
  CLICK = 'click',
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ZOOM = 'zoom',
  ROTATE = 'rotate',
  SELECT = 'select',
  RESET = 'reset',
  ERROR = 'error',
  SUCCESS = 'success',
}

// 音效管理器类
export class SoundManager {
  private synth: Tone.PolySynth | null = null;
  private backgroundMusic: Tone.Player | null = null;
  private isEnabled: boolean = true;
  private isMusicEnabled: boolean = true;
  private volume: number = 0.5;
  private musicVolume: number = 0.3;

  constructor() {
    this.init();
  }

  // 初始化音效系统
  private async init() {
    try {
      // 创建合成器
      this.synth = new Tone.PolySynth(Tone.Synth, {
        volume: -10,
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.3,
          release: 1,
        },
      }).toDestination();

      console.log('音效系统初始化成功');
    } catch (error) {
      console.error('音效系统初始化失败:', error);
    }
  }

  // 播放音效
  async playSound(type: SoundType) {
    if (!this.isEnabled || !this.synth) return;

    try {
      // 确保音频上下文已启动
      if (Tone.context.state !== 'running') {
        await Tone.start();
      }

      const now = Tone.now();

      switch (type) {
        case SoundType.CLICK:
          this.synth.triggerAttackRelease('C5', '16n', now);
          break;
        
        case SoundType.CONNECT:
          this.synth.triggerAttackRelease(['E4', 'G4', 'B4'], '8n', now);
          break;
        
        case SoundType.DISCONNECT:
          this.synth.triggerAttackRelease(['B4', 'G4', 'E4'], '8n', now);
          break;
        
        case SoundType.ZOOM:
          this.synth.triggerAttackRelease('A4', '32n', now);
          break;
        
        case SoundType.ROTATE:
          this.synth.triggerAttackRelease('D4', '32n', now);
          break;
        
        case SoundType.SELECT:
          this.synth.triggerAttackRelease(['C5', 'E5'], '16n', now);
          break;
        
        case SoundType.RESET:
          this.synth.triggerAttackRelease(['C4', 'E4', 'G4', 'C5'], '8n', now);
          break;
        
        case SoundType.ERROR:
          this.synth.triggerAttackRelease(['F3', 'Eb3'], '8n', now);
          break;
        
        case SoundType.SUCCESS:
          this.synth.triggerAttackRelease(['C5', 'E5', 'G5'], '8n', now);
          break;
        
        default:
          this.synth.triggerAttackRelease('C4', '16n', now);
      }
    } catch (error) {
      console.error('播放音效失败:', error);
    }
  }

  // 播放背景音乐
  async playBackgroundMusic() {
    if (!this.isMusicEnabled) return;

    try {
      // 确保音频上下文已启动
      if (Tone.context.state !== 'running') {
        await Tone.start();
      }

      // 创建环境音乐序列
      const sequence = new Tone.Sequence(
        (time, note) => {
          if (this.synth) {
            this.synth.triggerAttackRelease(note, '2n', time, 0.1);
          }
        },
        [
          ['C3', 'E3', 'G3'],
          ['A2', 'C3', 'E3'],
          ['F2', 'A2', 'C3'],
          ['G2', 'B2', 'D3'],
        ],
        '2n'
      ).start(0);

      Tone.Transport.start();
      console.log('背景音乐已开始播放');
    } catch (error) {
      console.error('播放背景音乐失败:', error);
    }
  }

  // 停止背景音乐
  stopBackgroundMusic() {
    try {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      console.log('背景音乐已停止');
    } catch (error) {
      console.error('停止背景音乐失败:', error);
    }
  }

  // 设置音效开关
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // 设置背景音乐开关
  setMusicEnabled(enabled: boolean) {
    this.isMusicEnabled = enabled;
    if (!enabled) {
      this.stopBackgroundMusic();
    } else {
      this.playBackgroundMusic();
    }
  }

  // 设置音量
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.synth) {
      this.synth.volume.value = Tone.gainToDb(this.volume);
    }
  }

  // 获取当前音量
  getVolume(): number {
    return this.volume;
  }

  // 获取音效开关状态
  isEnabledState(): boolean {
    return this.isEnabled;
  }

  // 获取背景音乐开关状态
  isMusicEnabledState(): boolean {
    return this.isMusicEnabled;
  }

  // 清理资源
  dispose() {
    this.stopBackgroundMusic();
    if (this.synth) {
      this.synth.dispose();
      this.synth = null;
    }
    if (this.backgroundMusic) {
      this.backgroundMusic.dispose();
      this.backgroundMusic = null;
    }
  }
}

// 导出单例
export const soundManager = new SoundManager();
