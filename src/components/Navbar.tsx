import React from 'react';
import {
  HelpCircle,
  Smartphone,
  Gamepad2,
  PiggyBank,
  Calculator,
  Sparkles,
  MapPin,
  Home,
} from 'lucide-react';
import { NavItem } from '../types';

interface NavbarProps {
  items: NavItem[];
  activeTab: string;
  onSelectTab: (id: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  HelpCircle,
  Smartphone,
  Gamepad2,
  PiggyBank,
  Calculator,
  Sparkles,
  MapPin,
};

export const Navbar: React.FC<NavbarProps> = ({
  items,
  activeTab,
  onSelectTab,
}) => {
  return (
    <nav className="bg-white border-b border-slate-200/90 shadow-xs sticky top-20 z-30">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none no-scrollbar">
          {/* Home icon button */}
          <button
            onClick={() => onSelectTab('home')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
              activeTab === 'home'
                ? 'bg-[#004b87] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#004b87] hover:bg-slate-100'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Tổng quan</span>
          </button>

          {items.map((item) => {
            const IconComponent = iconMap[item.icon] || HelpCircle;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
                  isActive
                    ? 'bg-[#004b87] text-white shadow-xs'
                    : 'text-slate-700 hover:text-[#004b87] hover:bg-slate-100/80'
                }`}
              >
                <IconComponent
                  className={`w-4 h-4 ${
                    isActive ? 'text-white' : 'text-[#004b87]'
                  }`}
                />
                <span>{item.title}</span>
                {item.badge && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-red-500 text-white'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
