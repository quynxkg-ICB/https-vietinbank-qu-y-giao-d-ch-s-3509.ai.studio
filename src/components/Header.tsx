import React, { useState, useEffect } from 'react';
import { Phone, Clock, Home, Building2, HelpCircle } from 'lucide-react';
import { BankInfo } from '../types';

interface HeaderProps {
  bankInfo: BankInfo;
  activeTab: string;
  onNavigateHome: () => void;
  onOpenConsultantModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  bankInfo,
  activeTab,
  onNavigateHome,
  onOpenConsultantModal,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: VietinBank Logo */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={onNavigateHome}
              className="group flex items-center space-x-3 text-left focus:outline-none focus:ring-2 focus:ring-[#004b87] rounded-lg p-1 transition-transform active:scale-95"
              title="Về Trang Chủ"
            >
              <img
                src={bankInfo.logo}
                alt="VietinBank Logo"
                className="h-10 sm:h-12 w-auto object-contain drop-shadow-xs"
                onError={(e) => {
                  // Fallback in case raw github link is throttled
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=300&q=80';
                }}
              />
              <div className="hidden sm:block border-l border-slate-300 pl-3">
                <p className="text-xs font-semibold text-[#004b87] uppercase tracking-wider">
                  {bankInfo.branchName}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {bankInfo.slogan}
                </p>
              </div>
            </button>
          </div>

          {/* Right: Actions, Consultant & Clock */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Live Clock on Kiosk */}
            <div className="hidden lg:flex items-center space-x-2 bg-slate-100/80 px-3 py-1.5 rounded-full text-slate-700 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#004b87]" />
              <span>{currentTime || '08:00:00'}</span>
              <span className="text-slate-400">|</span>
              <span className="text-emerald-700 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Đang phục vụ
              </span>
            </div>

            {/* Consultant Quick Support Button */}
            <button
              onClick={onOpenConsultantModal}
              className="flex items-center space-x-2 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-medium text-xs sm:text-sm shadow-xs hover:shadow-md transition-all active:scale-95 hover:brightness-105"
            >
              <Phone className="w-4 h-4 animate-bounce" />
              <span className="hidden sm:inline">Hỗ trợ tại quầy:</span>
              <span className="font-bold underline decoration-white/40">
                {bankInfo.consultant.phone}
              </span>
            </button>

            {/* Home button if not on home */}
            {activeTab !== 'home' && (
              <button
                onClick={onNavigateHome}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#004b87] text-white text-xs sm:text-sm font-semibold hover:bg-[#003764] transition-colors shadow-xs"
              >
                <Home className="w-4 h-4" />
                <span className="hidden md:inline">Trang chủ</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
