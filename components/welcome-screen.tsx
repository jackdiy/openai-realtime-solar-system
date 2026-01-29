"use client";

// 欢迎屏幕组件
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  show: boolean;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ show }) => {
  const { t } = useTranslation();

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none">
      <div className="glass-card px-8 py-6 max-w-lg text-center pointer-events-auto animate-fade-in">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="h-12 w-12 text-purple-400 animate-pulse" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            {t('welcome.title')}
          </span>
        </h1>
        
        <p className="text-lg text-gray-300 mb-6">
          {t('welcome.description')}
        </p>
        
        <div className="space-y-3 text-left bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎙️</span>
            <div>
              <p className="font-medium text-purple-300">{t('status.connecting')}</p>
              <p className="text-sm text-gray-400">{t('welcome.voiceIntro')}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="text-2xl">👋</span>
            <div>
              <p className="font-medium text-pink-300">{t('controls.gestures')}</p>
              <p className="text-sm text-gray-400">{t('welcome.gestureIntro')}</p>
            </div>
          </div>
        </div>
        
        <p className="mt-4 text-xs text-gray-500">
          点击右上角的连接按钮开始探索
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
