"use client";

// 设置面板组件
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, X, Volume2, Languages } from 'lucide-react';
import { soundManager } from '@/lib/sound-manager';

interface SettingsProps {
  onLanguageChange?: (lang: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ onLanguageChange }) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [enableSound, setEnableSound] = useState(true);
  const [enableMusic, setEnableMusic] = useState(true);
  const [volume, setVolume] = useState(50);

  // 切换设置面板
  const toggleSettings = () => {
    setIsOpen(!isOpen);
  };

  // 切换语言
  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  // 切换音效
  const handleSoundToggle = () => {
    const newState = !enableSound;
    setEnableSound(newState);
    soundManager.setEnabled(newState);
  };

  // 切换背景音乐
  const handleMusicToggle = () => {
    const newState = !enableMusic;
    setEnableMusic(newState);
    soundManager.setMusicEnabled(newState);
  };

  // 调整音量
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    soundManager.setVolume(newVolume / 100);
  };

  return (
    <>
      {/* 设置按钮 */}
      <div
        className="settings-btn"
        onClick={toggleSettings}
        title={t('controls.settings')}
      >
        <SettingsIcon className="h-6 w-6" />
      </div>

      {/* 设置面板 */}
      {isOpen && (
        <div className="settings-overlay" onClick={toggleSettings}>
          <div 
            className="settings-panel"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 标题栏 */}
            <div className="settings-header">
              <h2 className="text-2xl font-bold">{t('settings.title')}</h2>
              <button
                className="settings-close-btn"
                onClick={toggleSettings}
                aria-label={t('settings.close')}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* 设置内容 */}
            <div className="settings-content">
              {/* 语言设置 */}
              <div className="settings-section">
                <div className="settings-section-header">
                  <Languages className="h-5 w-5" />
                  <h3>{t('settings.language')}</h3>
                </div>
                <div className="settings-section-content">
                  <div className="language-options">
                    <button
                      className={`language-btn ${i18n.language === 'zh-CN' ? 'active' : ''}`}
                      onClick={() => handleLanguageChange('zh-CN')}
                    >
                      {t('settings.chinese')}
                    </button>
                    <button
                      className={`language-btn ${i18n.language === 'en-US' ? 'active' : ''}`}
                      onClick={() => handleLanguageChange('en-US')}
                    >
                      {t('settings.english')}
                    </button>
                  </div>
                </div>
              </div>

              {/* 音频设置 */}
              <div className="settings-section">
                <div className="settings-section-header">
                  <Volume2 className="h-5 w-5" />
                  <h3>{t('settings.audio')}</h3>
                </div>
                <div className="settings-section-content">
                  {/* 音效开关 */}
                  <div className="settings-item">
                    <label className="settings-label">
                      {t('settings.enableSound')}
                    </label>
                    <label className="settings-switch">
                      <input
                        type="checkbox"
                        checked={enableSound}
                        onChange={handleSoundToggle}
                      />
                      <span className="settings-slider"></span>
                    </label>
                  </div>

                  {/* 背景音乐开关 */}
                  <div className="settings-item">
                    <label className="settings-label">
                      {t('settings.enableMusic')}
                    </label>
                    <label className="settings-switch">
                      <input
                        type="checkbox"
                        checked={enableMusic}
                        onChange={handleMusicToggle}
                      />
                      <span className="settings-slider"></span>
                    </label>
                  </div>

                  {/* 音量滑块 */}
                  <div className="settings-item">
                    <label className="settings-label">
                      {t('controls.volume')}: {volume}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="settings-slider-range"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
