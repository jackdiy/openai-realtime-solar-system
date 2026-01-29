"use client";

// 手势控制组件
// 显示摄像头画面和手势识别可视化
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, CameraOff, Hand } from 'lucide-react';
import { gestureService, GestureType } from '@/lib/gesture-recognition';
import { soundManager, SoundType } from '@/lib/sound-manager';

interface GestureControlProps {
  onGesture?: (gesture: GestureType) => void;
}

const GestureControl: React.FC<GestureControlProps> = ({ onGesture }) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<GestureType>(GestureType.NONE);
  const [error, setError] = useState<string | null>(null);

  // 启动/停止手势识别
  const toggleGesture = async () => {
    try {
      if (isActive) {
        // 停止手势识别
        gestureService.stop();
        setIsActive(false);
        setCurrentGesture(GestureType.NONE);
        soundManager.playSound(SoundType.DISCONNECT);
      } else {
        // 启动手势识别
        if (videoRef.current && canvasRef.current) {
          await gestureService.start(videoRef.current, canvasRef.current);
          setIsActive(true);
          setError(null);
          soundManager.playSound(SoundType.CONNECT);
        }
      }
    } catch (err: any) {
      console.error('手势识别切换失败:', err);
      setError(err.message || '无法访问摄像头');
      soundManager.playSound(SoundType.ERROR);
    }
  };

  // 监听手势事件
  useEffect(() => {
    const unsubscribe = gestureService.onGesture((gesture, data) => {
      console.log('检测到手势:', gesture, data);
      setCurrentGesture(gesture);
      
      // 播放对应音效
      switch (gesture) {
        case GestureType.ZOOM_IN:
        case GestureType.ZOOM_OUT:
          soundManager.playSound(SoundType.ZOOM);
          break;
        case GestureType.ROTATE_LEFT:
        case GestureType.ROTATE_RIGHT:
          soundManager.playSound(SoundType.ROTATE);
          break;
        case GestureType.SELECT:
          soundManager.playSound(SoundType.SELECT);
          break;
        case GestureType.RESET:
          soundManager.playSound(SoundType.RESET);
          break;
        case GestureType.MENU:
          soundManager.playSound(SoundType.CLICK);
          break;
      }
      
      // 触发回调
      if (onGesture) {
        onGesture(gesture);
      }
      
      // 清除手势显示
      setTimeout(() => {
        setCurrentGesture(GestureType.NONE);
      }, 500);
    });

    return unsubscribe;
  }, [onGesture]);

  // 获取手势显示文本
  const getGestureText = (gesture: GestureType): string => {
    switch (gesture) {
      case GestureType.ZOOM_IN:
        return '放大 🔍';
      case GestureType.ZOOM_OUT:
        return '缩小 🔍';
      case GestureType.ROTATE_LEFT:
        return '向左旋转 ↺';
      case GestureType.ROTATE_RIGHT:
        return '向右旋转 ↻';
      case GestureType.SELECT:
        return '选择 👆';
      case GestureType.RESET:
        return '重置 🔄';
      case GestureType.MENU:
        return '菜单 👍';
      default:
        return '';
    }
  };

  return (
    <div className="gesture-control">
      {/* 控制按钮 */}
      <div
        className="gesture-toggle-btn"
        onClick={toggleGesture}
        title={isActive ? t('controls.cameraOff') : t('controls.cameraOn')}
      >
        {isActive ? (
          <Camera className="h-6 w-6 text-green-400" />
        ) : (
          <CameraOff className="h-6 w-6 text-gray-400" />
        )}
      </div>

      {/* 摄像头预览窗口 */}
      {isActive && (
        <div className="gesture-preview">
          {/* 视频元素（隐藏） */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ display: 'none' }}
          />
          
          {/* Canvas显示手势追踪 */}
          <canvas
            ref={canvasRef}
            width={320}
            height={240}
            className="gesture-canvas"
          />
          
          {/* 手势提示 */}
          <div className="gesture-hint">
            <Hand className="h-5 w-5 mr-2" />
            <span>{t('gestures.detecting')}</span>
          </div>
          
          {/* 当前手势显示 */}
          {currentGesture !== GestureType.NONE && (
            <div className="current-gesture">
              {getGestureText(currentGesture)}
            </div>
          )}
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="gesture-error">
          {error}
        </div>
      )}

      {/* 手势说明面板 */}
      {isActive && (
        <div className="gesture-guide">
          <h4>{t('gestures.title')}</h4>
          <ul>
            <li>👐 {t('gestures.zoom')}</li>
            <li>✋ {t('gestures.rotate')}</li>
            <li>👆 {t('gestures.select')}</li>
            <li>✊ {t('gestures.reset')}</li>
            <li>👍 {t('gestures.menu')}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default GestureControl;
