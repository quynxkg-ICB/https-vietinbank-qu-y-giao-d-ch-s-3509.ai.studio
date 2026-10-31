import React from 'react';
import { Phone, MapPin, ShieldCheck, HeartHandshake } from 'lucide-react';
import { BankInfo, NavItem } from '../types';

interface FooterProps {
  bankInfo: BankInfo;
  navItems: NavItem[];
  onSelectTab: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  bankInfo,
  navItems,
  onSelectTab,
}) => {
  return (
    <footer className="bg-slate-900 text-white mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Branch */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src={bankInfo.logo}
                alt="VietinBank"
                className="h-9 w-auto object-contain brightness-0 invert"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {bankInfo.fullName} – {bankInfo.branchName}. Đồng hành cùng sự phát triển thịnh vượng của Quý khách hàng.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bảo mật chuẩn quốc tế PCI-DSS</span>
            </div>
          </div>

          {/* Col 2: Quick Features */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Tính Năng Tương Tác
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {navItems.slice(0, 4).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onSelectTab(item.id)}
                    className="hover:text-sky-300 transition-colors text-left"
                  >
                    • {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: More Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Dịch Vụ Nổi Bật
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {navItems.slice(4).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onSelectTab(item.id)}
                    className="hover:text-sky-300 transition-colors text-left"
                  >
                    • {item.title}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onSelectTab('download-ipay')}
                  className="hover:text-sky-300 transition-colors text-left"
                >
                  • Cài đặt App VietinBank iPay Mobile
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Hotline */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Hỗ Trợ Tại Quầy
            </h4>
            <p className="text-xs text-slate-400">
              Chuyên viên tư vấn: <strong className="text-white">{bankInfo.consultant.name}</strong>
            </p>
            <p className="text-xs text-slate-400">
              Điện thoại:{' '}
              <a
                href={`tel:${bankInfo.consultant.phoneRaw}`}
                className="text-amber-300 font-bold hover:underline"
              >
                {bankInfo.consultant.phone}
              </a>
            </p>
            <p className="text-xs text-slate-400">
              Tổng đài CSKH VietinBank:{' '}
              <a
                href="tel:1900558868"
                className="text-white font-bold hover:underline"
              >
                {bankInfo.hotline}
              </a>
            </p>
            <div className="pt-2">
              <span className="inline-block text-[11px] text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                Phục vụ từ Thứ 2 đến Thứ 6
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} VietinBank – {bankInfo.branchName}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <HeartHandshake className="w-3.5 h-3.5 text-red-500" />
            Nâng giá trị cuộc sống
          </p>
        </div>
      </div>
    </footer>
  );
};
