import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  ExternalLink,
  Search,
  Building2,
  Navigation,
  Maximize2,
  X,
  Compass,
} from 'lucide-react';
import { BranchData, BranchItem } from '../../types';

interface BranchesSectionProps {
  data: BranchData;
}

export const BranchesSection: React.FC<BranchesSectionProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<BranchItem | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const filteredBranches = data.branches.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#004b87] via-[#005a9e] to-sky-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs mb-3">
            <Compass className="w-4 h-4 text-emerald-300" />
            <span>Mạng lưới VietinBank Kiên Giang</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {data.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-sky-100">
            {data.subtitle} – Giờ phục vụ: {data.workingHoursDefault}
          </p>
        </div>
      </div>

      {/* Search & Statistics Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm điểm giao dịch, địa chỉ..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#004b87] text-slate-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Counter */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <span>Hiển thị:</span>
          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#004b87] font-bold">
            {filteredBranches.length} / {data.branches.length} địa điểm
          </span>
        </div>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBranches.map((branch) => (
          <div
            key={branch.stt}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#004b87]/40 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Photo */}
              <div className="relative group h-48 bg-slate-100 overflow-hidden">
                <img
                  src={branch.image}
                  alt={branch.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute top-3 left-3 bg-[#004b87] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xs">
                  #{branch.stt}
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#004b87] text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xs">
                  {branch.unit}
                </div>
                <button
                  onClick={() => setPreviewImage(branch.image)}
                  className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black transition-colors"
                  title="Xem ảnh lớn"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3.5">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#004b87] transition-colors leading-snug">
                  {branch.name}
                </h3>

                {/* Address + Google Maps Link (Requirement from PDF 4) */}
                <div className="flex items-start space-x-2 text-xs text-slate-600">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="leading-relaxed">{branch.address}</p>
                    <a
                      href={branch.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#004b87] hover:underline mt-1 bg-sky-50 px-2 py-0.5 rounded-md"
                    >
                      <Navigation className="w-3 h-3 text-[#004b87]" />
                      <span>Xem trên Google Maps</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                    </a>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start space-x-2 text-xs text-slate-600">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p>{branch.workingHours}</p>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Hotline click-to-call & Maps button */}
            <div className="p-5 pt-0">
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {/* Telephone hotline click-to-call (Requirement from PDF 4) */}
                <a
                  href={`tel:${branch.phoneRaw}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{branch.phone}</span>
                </a>

                {/* Direct Google Maps */}
                <a
                  href={branch.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1"
                  title="Chỉ đường Google Maps"
                >
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>Chỉ đường</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBranches.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-700">
            Không tìm thấy điểm giao dịch phù hợp
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Vui lòng thử tìm kiếm theo từ khóa khác hoặc xóa bộ lọc.
          </p>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs p-4 flex items-center justify-center animate-in fade-in"
        >
          <div className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden p-2 shadow-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Điểm giao dịch phóng to"
              className="w-full max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
