"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Mic, MicOff, Wifi } from "lucide-react";

interface ControlsProps {
  isConnected: boolean;
  isListening: boolean;
  handleConnectClick: () => void;
  handleMicToggleClick: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  isConnected,
  isListening,
  handleConnectClick,
  handleMicToggleClick,
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="absolute top-4 right-4 flex items-center z-10 gap-2">
      {/* 连接按钮 */}
      <div
        className="control-btn glass-card"
        onClick={handleConnectClick}
        title={isConnected ? t('controls.disconnect') : t('controls.connect')}
      >
        <Wifi
          className={`h-6 w-6 transition-all duration-300 ${
            isConnected 
              ? "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" 
              : "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]"
          }`}
        />
      </div>
      
      {/* 麦克风按钮 */}
      <div
        className={`control-btn glass-card ${
          isConnected ? "cursor-pointer" : "cursor-not-allowed opacity-50"
        }`}
        onClick={isConnected ? handleMicToggleClick : undefined}
        title={isListening ? t('controls.micOff') : t('controls.micOn')}
      >
        {isListening ? (
          <Mic className="h-6 w-6 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)] animate-pulse" />
        ) : (
          <MicOff className="h-6 w-6 text-gray-400" />
        )}
      </div>
    </div>
  );
};

export default Controls;
