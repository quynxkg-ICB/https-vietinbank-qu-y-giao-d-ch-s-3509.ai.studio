import React from 'react';
import { Phone, X, UserCheck, MessageSquareHeart, CheckCircle2 } from 'lucide-react';
import { Consultant } from '../types';

interface ConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultant: Consultant;
  customTitle?: string;
  customMessage?: string;
}

export const ConsultantModal: React.FC<ConsultantModalProps> = ({
  isOpen,
  onClose,
  consultant,
  customTitle,
  customMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-[#004b87] to-sky-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <UserCheck className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-slate-800">
            {customTitle || 'Hỗ Trợ Trực Tiếp Tại Quầy'}
          </h3>

          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            {customMessage ||
              'Chuyên viên tư vấn VietinBank sẵn sàng giải đáp thắc mắc và hỗ trợ Quý khách hoàn tất giao dịch nhanh nhất.'}
          </p>

          {/* Consultant Card */}
          <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-left">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
                  {consultant.title}
                </p>
                <h4 className="text-base font-bold text-[#004b87]">
                  {consultant.name}
                </h4>
                <p className="text-xs text-slate-500">VietinBank Chi nhánh Kiên Giang</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                Sẵn sàng phục vụ
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">Số điện thoại:</span>
              <a
                href={`tel:${consultant.phoneRaw}`}
                className="text-base font-bold text-red-600 hover:underline flex items-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                {consultant.phone}
              </a>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href={`tel:${consultant.phoneRaw}`}
              className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-xl bg-[#004b87] text-white font-semibold text-sm hover:bg-[#003866] transition-colors shadow-xs"
            >
              <Phone className="w-4 h-4 mr-2" />
              Gọi Ngay
            </a>
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
