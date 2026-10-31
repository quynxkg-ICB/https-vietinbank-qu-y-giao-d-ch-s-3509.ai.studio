import React, { useState } from 'react';
import {
  Smartphone,
  Apple,
  ExternalLink,
  ShieldCheck,
  Zap,
  CheckCircle,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';
import { DownloadIpayData } from '../../types';

interface DownloadIpaySectionProps {
  data: DownloadIpayData;
}

export const DownloadIpaySection: React.FC<DownloadIpaySectionProps> = ({ data }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Generate Google Chart API QR or SVG QR for 100% reliable scan without dependency issues
  const getQrUrl = (url: string) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
      url
    )}&color=004b87&bgcolor=ffffff&margin=1`;

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#004b87] via-[#005a9e] to-[#003866] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs mb-3">
            <Smartphone className="w-4 h-4 text-emerald-300" />
            <span>VietinBank iPay Mobile</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {data.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-sky-100 leading-relaxed">
            {data.subtitle}
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-radial from-white/10 to-transparent rounded-full pointer-events-none" />
      </div>

      {/* Two QR Code Cards: iOS & Android */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* iOS Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm">
                  <Apple className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg sm:text-xl">
                    {data.ios.platform}
                  </h3>
                  <span className="text-xs font-medium text-slate-500">
                    Dành cho iPhone & iPad
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                {data.ios.storeName}
              </span>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                <img
                  src={getQrUrl(data.ios.url)}
                  alt="QR Code iPay iOS"
                  className="w-44 h-44 sm:w-48 sm:h-48 object-contain"
                />
              </div>
              <p className="mt-3 text-xs sm:text-sm font-semibold text-slate-700 text-center">
                {data.ios.qrLabel}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Mở camera điện thoại quét để cài đặt ngay
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <a
              href={data.ios.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-xl bg-black text-white text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
            >
              <Apple className="w-4 h-4 mr-2" />
              Tải trên App Store
              <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-70" />
            </a>
            <button
              onClick={() => handleCopy(data.ios.url, 'ios')}
              className="px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              title="Sao chép liên kết"
            >
              {copiedType === 'ios' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">Đã chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Sao chép link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Android Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <Smartphone className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg sm:text-xl">
                    {data.android.platform}
                  </h3>
                  <span className="text-xs font-medium text-slate-500">
                    Samsung, Xiaomi, Oppo, v.v.
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                {data.android.storeName}
              </span>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                <img
                  src={getQrUrl(data.android.url)}
                  alt="QR Code iPay Android"
                  className="w-44 h-44 sm:w-48 sm:h-48 object-contain"
                />
              </div>
              <p className="mt-3 text-xs sm:text-sm font-semibold text-slate-700 text-center">
                {data.android.qrLabel}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Mở máy ảnh hoặc Zalo để quét tải ứng dụng
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <a
              href={data.android.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Tải trên Google Play
              <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-70" />
            </a>
            <button
              onClick={() => handleCopy(data.android.url, 'android')}
              className="px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              title="Sao chép liên kết"
            >
              {copiedType === 'android' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">Đã chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Sao chép link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* iPay Key Highlights */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          Tiện ích vượt trội khi sử dụng VietinBank iPay Mobile
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.features.map((feat, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3.5 rounded-xl bg-sky-50/50 border border-sky-100"
            >
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                {feat}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
