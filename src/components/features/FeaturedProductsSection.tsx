import React, { useState } from 'react';
import {
  Sparkles,
  Gift,
  Star,
  ChevronLeft,
  ChevronRight,
  Heart,
  Phone,
  CheckCircle2,
  X,
  LayoutGrid,
  SlidersHorizontal,
  Maximize2,
} from 'lucide-react';
import { FeaturedProductsData, ProductItem, Consultant } from '../../types';

interface FeaturedProductsSectionProps {
  data: FeaturedProductsData;
  consultant: Consultant;
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  data,
  consultant,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [interestedProduct, setInterestedProduct] = useState<ProductItem | null>(null);
  const [previewPoster, setPreviewPoster] = useState<string | null>(null);

  const filteredItems =
    selectedCategory === 'all'
      ? data.items
      : data.items.filter((item) => item.category === selectedCategory);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? filteredItems.length - 1 : prev - 1
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#004b87] via-[#005a9e] to-sky-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Nổi bật tại quầy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {data.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-sky-100">
            {data.subtitle}
          </p>
        </div>
      </div>

      {/* Filter Chips & View Mode Switch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {data.categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentIndex(0);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
                  isActive
                    ? 'bg-[#004b87] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* View Switcher: Carousel vs Grid */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('carousel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'carousel'
                ? 'bg-white text-[#004b87] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Dạng Carousel</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-[#004b87] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Dạng Lưới</span>
          </button>
        </div>
      </div>

      {/* Display: Carousel Mode */}
      {viewMode === 'carousel' && filteredItems.length > 0 && (
        <div className="relative bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Card Frame with Red Trim / Soft Blue Gradient */}
          <div className="max-w-4xl mx-auto">
            {(() => {
              const item = filteredItems[currentIndex % filteredItems.length];
              return (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  {/* Poster Image */}
                  <div className="md:col-span-6 relative group rounded-2xl overflow-hidden bg-slate-100 border-2 border-red-500/20 shadow-md">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-auto max-h-[460px] object-contain transition-transform duration-300 group-hover:scale-102"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <button
                      onClick={() => setPreviewPoster(item.image)}
                      className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black text-white text-xs font-medium flex items-center gap-1 backdrop-blur-xs"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      Phóng to poster
                    </button>
                  </div>

                  {/* Info & Interest Button */}
                  <div className="md:col-span-6 space-y-5">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600 border border-red-200">
                          {item.badge}
                        </span>
                        <span className="text-xs font-semibold text-[#004b87]">
                          {item.categoryLabel}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>

                    <div className="pt-4 border-t border-slate-100">
                      <button
                        onClick={() => setInterestedProduct(item)}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
                      >
                        <Heart className="w-5 h-5 fill-current" />
                        <span>Tôi quan tâm</span>
                      </button>
                    </div>

                    {/* Carousel Nav indicator */}
                    <div className="pt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        {filteredItems.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`h-2 rounded-full transition-all ${
                              i === currentIndex % filteredItems.length
                                ? 'w-6 bg-[#004b87]'
                                : 'w-2 bg-slate-300'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handlePrev}
                          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                          title="Poster trước"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleNext}
                          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                          title="Poster tiếp theo"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Display: Grid Mode */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative group bg-slate-100 p-2">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-56 object-contain rounded-2xl transition-transform duration-300 group-hover:scale-102"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <button
                  onClick={() => setPreviewPoster(item.image)}
                  className="absolute bottom-4 right-4 p-2 rounded-lg bg-black/60 text-white hover:bg-black transition-colors"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-600">
                      {item.badge}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {item.categoryLabel}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-3">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setInterestedProduct(item)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    <span>Tôi quan tâm</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Popup when clicking "Tôi quan tâm" (Required from PDF 5) */}
      {interestedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs p-4 flex items-center justify-center animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setInterestedProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 mx-auto mb-4 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Heart className="w-8 h-8 fill-current" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              {data.interestResponseModal.title}
            </h3>

            <div className="mt-2 text-xs font-semibold text-[#004b87] bg-sky-50 py-1 px-3 rounded-full inline-block">
              {interestedProduct.title}
            </div>

            <p className="mt-4 text-sm text-slate-700 leading-relaxed font-medium">
              {data.interestResponseModal.message}
            </p>

            {/* Consultant Contact Box */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
              <p className="text-xs text-slate-500 font-medium">
                Tư vấn viên phụ trách:
              </p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {consultant.name} – {consultant.title}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">Hotline hỗ trợ:</span>
                <a
                  href={`tel:${consultant.phoneRaw}`}
                  className="text-base font-extrabold text-red-600 hover:underline flex items-center gap-1"
                >
                  <Phone className="w-4 h-4" />
                  {consultant.phone}
                </a>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={`tel:${consultant.phoneRaw}`}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-xs transition-colors"
              >
                <Phone className="w-4 h-4 mr-1.5" />
                Gọi Ngay
              </a>
              <button
                onClick={() => setInterestedProduct(null)}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Poster Preview Zoom Modal */}
      {previewPoster && (
        <div
          onClick={() => setPreviewPoster(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs p-4 flex items-center justify-center animate-in fade-in"
        >
          <div className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden p-2 shadow-2xl">
            <button
              onClick={() => setPreviewPoster(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewPoster}
              alt="Poster phóng to"
              className="w-full max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
