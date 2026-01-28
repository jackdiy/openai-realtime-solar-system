// 手势识别服务
// 使用Mediapipe Hands进行手势识别
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

// 手势类型定义
export enum GestureType {
  NONE = 'none',
  ZOOM_IN = 'zoom_in',      // 双手张开 - 放大
  ZOOM_OUT = 'zoom_out',    // 双手合拢 - 缩小
  ROTATE_LEFT = 'rotate_left',   // 单手向左旋转
  ROTATE_RIGHT = 'rotate_right', // 单手向右旋转
  SELECT = 'select',        // 食指指向 - 选择
  RESET = 'reset',          // 双手握拳 - 重置
  MENU = 'menu',            // 竖起大拇指 - 菜单
}

// 手势回调函数类型
export type GestureCallback = (gesture: GestureType, data?: any) => void;

// 手势识别服务类
export class GestureRecognitionService {
  private hands: Hands | null = null;
  private camera: Camera | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private canvasElement: HTMLCanvasElement | null = null;
  private isActive: boolean = false;
  private callbacks: GestureCallback[] = [];
  private lastGesture: GestureType = GestureType.NONE;
  private lastGestureTime: number = 0;
  private gestureThrottleMs: number = 300; // 手势识别节流时间
  
  // 上一帧的双手距离，用于缩放手势检测
  private lastTwoHandsDistance: number | null = null;

  constructor() {
    // 初始化Mediapipe Hands
    this.initHands();
  }

  // 初始化Mediapipe Hands
  private initHands() {
    this.hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

    this.hands.setOptions({
      maxNumHands: 2,           // 最多检测2只手
      modelComplexity: 1,       // 模型复杂度 (0, 1, 2)
      minDetectionConfidence: 0.7,  // 最小检测置信度
      minTrackingConfidence: 0.7,   // 最小跟踪置信度
    });

    this.hands.onResults((results: Results) => {
      this.onResults(results);
    });
  }

  // 启动手势识别
  async start(videoElement: HTMLVideoElement, canvasElement?: HTMLCanvasElement): Promise<void> {
    if (this.isActive) {
      console.log('手势识别已经在运行');
      return;
    }

    this.videoElement = videoElement;
    this.canvasElement = canvasElement || null;

    try {
      // 请求摄像头权限
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });

      this.videoElement.srcObject = stream;
      
      // 等待视频加载
      await new Promise<void>((resolve) => {
        if (this.videoElement) {
          this.videoElement.onloadedmetadata = () => {
            resolve();
          };
        }
      });

      // 创建摄像头
      if (this.hands) {
        this.camera = new Camera(this.videoElement, {
          onFrame: async () => {
            if (this.hands && this.videoElement) {
              await this.hands.send({ image: this.videoElement });
            }
          },
          width: 1280,
          height: 720
        });

        await this.camera.start();
        this.isActive = true;
        console.log('手势识别已启动');
      }
    } catch (error) {
      console.error('启动手势识别失败:', error);
      throw error;
    }
  }

  // 停止手势识别
  stop(): void {
    if (this.camera) {
      this.camera.stop();
      this.camera = null;
    }

    if (this.videoElement && this.videoElement.srcObject) {
      const stream = this.videoElement.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      this.videoElement.srcObject = null;
    }

    this.isActive = false;
    this.lastTwoHandsDistance = null;
    console.log('手势识别已停止');
  }

  // 注册手势回调
  onGesture(callback: GestureCallback): () => void {
    this.callbacks.push(callback);
    // 返回取消注册函数
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  // 触发手势回调
  private triggerGesture(gesture: GestureType, data?: any): void {
    // 手势节流
    const now = Date.now();
    if (now - this.lastGestureTime < this.gestureThrottleMs && gesture === this.lastGesture) {
      return;
    }

    this.lastGesture = gesture;
    this.lastGestureTime = now;

    this.callbacks.forEach(callback => {
      callback(gesture, data);
    });
  }

  // 处理识别结果
  private onResults(results: Results): void {
    // 如果有canvas，绘制手势追踪效果
    if (this.canvasElement && this.videoElement) {
      const canvasCtx = this.canvasElement.getContext('2d');
      if (canvasCtx) {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        canvasCtx.drawImage(results.image, 0, 0, this.canvasElement.width, this.canvasElement.height);
        
        // 绘制手部关键点
        if (results.multiHandLandmarks) {
          for (const landmarks of results.multiHandLandmarks) {
            this.drawHandLandmarks(canvasCtx, landmarks);
          }
        }
        canvasCtx.restore();
      }
    }

    // 识别手势
    const gesture = this.recognizeGesture(results);
    if (gesture !== GestureType.NONE) {
      this.triggerGesture(gesture);
    }
  }

  // 绘制手部关键点
  private drawHandLandmarks(ctx: CanvasRenderingContext2D, landmarks: any[]): void {
    // 绘制手部连接线
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4],     // 大拇指
      [0, 5], [5, 6], [6, 7], [7, 8],     // 食指
      [0, 9], [9, 10], [10, 11], [11, 12], // 中指
      [0, 13], [13, 14], [14, 15], [15, 16], // 无名指
      [0, 17], [17, 18], [18, 19], [19, 20], // 小指
    ];

    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;

    for (const [start, end] of connections) {
      const startPoint = landmarks[start];
      const endPoint = landmarks[end];
      
      ctx.beginPath();
      ctx.moveTo(startPoint.x * ctx.canvas.width, startPoint.y * ctx.canvas.height);
      ctx.lineTo(endPoint.x * ctx.canvas.width, endPoint.y * ctx.canvas.height);
      ctx.stroke();
    }

    // 绘制关键点
    ctx.fillStyle = '#FF0000';
    for (const landmark of landmarks) {
      ctx.beginPath();
      ctx.arc(
        landmark.x * ctx.canvas.width,
        landmark.y * ctx.canvas.height,
        5,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  }

  // 识别手势
  private recognizeGesture(results: Results): GestureType {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      this.lastTwoHandsDistance = null;
      return GestureType.NONE;
    }

    const hands = results.multiHandLandmarks;

    // 双手手势检测
    if (hands.length === 2) {
      return this.recognizeTwoHandGesture(hands[0], hands[1]);
    }

    // 单手手势检测
    if (hands.length === 1) {
      return this.recognizeOneHandGesture(hands[0]);
    }

    return GestureType.NONE;
  }

  // 识别双手手势
  private recognizeTwoHandGesture(hand1: any[], hand2: any[]): GestureType {
    // 计算两手手腕之间的距离
    const wrist1 = hand1[0];
    const wrist2 = hand2[0];
    const distance = Math.sqrt(
      Math.pow(wrist1.x - wrist2.x, 2) +
      Math.pow(wrist1.y - wrist2.y, 2)
    );

    // 检测握拳 - 重置手势
    const isFist1 = this.isFist(hand1);
    const isFist2 = this.isFist(hand2);
    if (isFist1 && isFist2) {
      this.lastTwoHandsDistance = null;
      return GestureType.RESET;
    }

    // 检测缩放手势
    if (this.lastTwoHandsDistance !== null) {
      const distanceChange = distance - this.lastTwoHandsDistance;
      const threshold = 0.05; // 距离变化阈值

      if (distanceChange > threshold) {
        this.lastTwoHandsDistance = distance;
        return GestureType.ZOOM_IN;
      } else if (distanceChange < -threshold) {
        this.lastTwoHandsDistance = distance;
        return GestureType.ZOOM_OUT;
      }
    }

    this.lastTwoHandsDistance = distance;
    return GestureType.NONE;
  }

  // 识别单手手势
  private recognizeOneHandGesture(hand: any[]): GestureType {
    // 检测大拇指竖起 - 菜单手势
    if (this.isThumbsUp(hand)) {
      return GestureType.MENU;
    }

    // 检测食指指向 - 选择手势
    if (this.isPointing(hand)) {
      return GestureType.SELECT;
    }

    // 检测手掌旋转 - 旋转视角
    const rotationDirection = this.getRotationDirection(hand);
    if (rotationDirection === 'left') {
      return GestureType.ROTATE_LEFT;
    } else if (rotationDirection === 'right') {
      return GestureType.ROTATE_RIGHT;
    }

    return GestureType.NONE;
  }

  // 检测是否握拳
  private isFist(hand: any[]): boolean {
    // 检查所有手指是否弯曲
    const fingerTips = [4, 8, 12, 16, 20]; // 大拇指、食指、中指、无名指、小指的指尖
    const fingerMCPs = [2, 5, 9, 13, 17];  // 对应的掌指关节

    let bentFingers = 0;
    for (let i = 0; i < fingerTips.length; i++) {
      const tip = hand[fingerTips[i]];
      const mcp = hand[fingerMCPs[i]];
      
      // 如果指尖的y坐标大于掌指关节（在屏幕坐标系中，y越大越靠下）
      if (tip.y > mcp.y) {
        bentFingers++;
      }
    }

    // 至少4个手指弯曲才算握拳
    return bentFingers >= 4;
  }

  // 检测大拇指是否竖起
  private isThumbsUp(hand: any[]): boolean {
    const thumbTip = hand[4];
    const thumbIP = hand[3];
    const indexMCP = hand[5];
    
    // 大拇指指尖在大拇指IP关节之上，且其他手指弯曲
    const thumbUp = thumbTip.y < thumbIP.y;
    const otherFingersBent = this.areOtherFingersBent(hand, [8, 12, 16, 20]);
    
    return thumbUp && otherFingersBent;
  }

  // 检测是否食指指向
  private isPointing(hand: any[]): boolean {
    const indexTip = hand[8];
    const indexMCP = hand[5];
    
    // 食指伸直，其他手指弯曲
    const indexExtended = indexTip.y < indexMCP.y - 0.1;
    const otherFingersBent = this.areOtherFingersBent(hand, [12, 16, 20]);
    
    return indexExtended && otherFingersBent;
  }

  // 检查指定手指是否弯曲
  private areOtherFingersBent(hand: any[], fingerTips: number[]): boolean {
    const fingerMCPs = [9, 13, 17]; // 中指、无名指、小指的掌指关节
    
    let bentCount = 0;
    for (let i = 0; i < fingerTips.length; i++) {
      const tip = hand[fingerTips[i]];
      const mcp = hand[fingerMCPs[i]];
      
      if (tip.y > mcp.y) {
        bentCount++;
      }
    }
    
    return bentCount >= 2;
  }

  // 获取旋转方向
  private getRotationDirection(hand: any[]): 'left' | 'right' | null {
    // 这里可以实现更复杂的旋转检测逻辑
    // 简化版本：检测手腕和中指的x坐标关系
    const wrist = hand[0];
    const middleTip = hand[12];
    
    const deltaX = middleTip.x - wrist.x;
    
    if (deltaX > 0.2) {
      return 'right';
    } else if (deltaX < -0.2) {
      return 'left';
    }
    
    return null;
  }

  // 获取当前状态
  isRunning(): boolean {
    return this.isActive;
  }
}

// 导出单例
export const gestureService = new GestureRecognitionService();
