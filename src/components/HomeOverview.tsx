import React from 'react';
import {
  HelpCircle,
  Smartphone,
  Gamepad2,
  PiggyBank,
  Calculator,
  Sparkles,
  MapPin,
  ChevronRight,
  Phone,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import { NavItem, BankInfo } from '../types';

interface HomeOverviewProps {
  navItems: NavItem[];
  bankInfo: BankInfo;
  onSelectFeature: (id: string) => void;
  onOpenConsultant: () => void;
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

export const HomeOverview: React.FC<HomeOverviewProps> = ({
  navItems,
  bankInfo,
  onSelectFeature,
  onOpenConsultant,
}) => {
  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#003866] via-[#004b87] to-[#005a9e] text-white p-6 sm:p-10 shadow-xl border border-sky-900/30">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-xs mb-3 border border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Hệ Thống Tương Tác Số Tại Quầy Giao Dịch</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Chào Mừng Quý Khách Đến Với <br />
            <span className="text-amber-300">VietinBank Chi Nhánh Kiên Giang</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-sky-100 leading-relaxed">
            Vui lòng chọn tiện ích bên dưới để tra cứu thông tin nhanh, tính lãi tiền gửi & lịch trả nợ, tải ứng dụng iPay hoặc tham gia trò chơi nhận voucher xăng 2 lít trong thời gian chờ đợi.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectFeature('faq')}
              className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Giải đáp thắc mắc ngay</span>
            </button>

            <button
              onClick={() => onSelectFeature('game')}
              className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm backdrop-blur-xs border border-white/20 transition-all active:scale-95 flex items-center gap-2"
            >
              <Gamepad2 className="w-4 h-4 text-amber-300" />
              <span>Chơi Game nhận Voucher</span>
            </button>
          </div>
        </div>

        {/* Ambient background graphics */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-80 h-80 rounded-full bg-radial from-white/10 to-transparent pointer-events-none" />
      </div>

      {/* 7 Feature Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            Danh mục dịch vụ tương tác (7 Tính năng)
          </h2>
          <span className="text-xs font-semibold text-slate-400">
            Chạm vào thẻ để mở
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {navItems.map((item, idx) => {
            const IconComponent = iconMap[item.icon] || HelpCircle;
            const isFeatured = item.id === 'featured-products' || item.id === 'game';

            return (
              <div
                key={item.id}
                onClick={() => onSelectFeature(item.id)}
                className={`group cursor-pointer rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                  isFeatured
                    ? 'bg-gradient-to-br from-white via-sky-50/50 to-white border-2 border-red-500/30 shadow-md hover:shadow-xl hover:-translate-y-1'
                    : 'bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#004b87]/40 hover:-translate-y-1'
                }`}
              >
                {/* Top indicator ribbon */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-xs ${
                      isFeatured
                        ? 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white'
                        : 'bg-sky-50 text-[#004b87] group-hover:bg-[#004b87] group-hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {item.badge ? (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600 border border-red-200">
                      {item.badge}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-300">
                      0{idx + 1}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#004b87] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#004b87]">
                  <span>Trải nghiệm ngay</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Support & Consultant Callout Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-100 text-[#004b87] flex items-center justify-center shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Cần hỗ trợ trực tiếp từ Chuyên viên tư vấn?
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Chuyên viên: <strong className="text-[#004b87]">{bankInfo.consultant.name}</strong> – {bankInfo.consultant.title} VietinBank Kiên Giang
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <a
            href={`tel:${bankInfo.consultant.phoneRaw}`}
            className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Gọi ngay: {bankInfo.consultant.phone}</span>
          </a>
          <button
            onClick={onOpenConsultant}
            className="px-4 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
          >
            Xem thông tin
          </button>
        </div>
      </div>
    </div>
  );
};
