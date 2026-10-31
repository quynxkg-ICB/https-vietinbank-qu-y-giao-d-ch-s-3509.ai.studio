import React, { useState } from 'react';
import {
  HelpCircle,
  KeyRound,
  CreditCard,
  ScanFace,
  Receipt,
  CalendarDays,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Phone,
  Maximize2,
  X,
  Youtube,
  Sparkles,
} from 'lucide-react';
import { FaqData, Consultant } from '../../types';

interface FaqSectionProps {
  faqData: FaqData;
  consultant: Consultant;
  onBackToMain: () => void;
  onFinishSession: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  'forgot-password': KeyRound,
  'close-card': CreditCard,
  'biometric-update': ScanFace,
  'e-tax': Receipt,
  'book-appointment': CalendarDays,
};

export const FaqSection: React.FC<FaqSectionProps> = ({
  faqData,
  consultant,
  onBackToMain,
  onFinishSession,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<'none' | 'success' | 'unresolved'>('none');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  const selectedTopic = faqData.topics.find((t) => t.id === selectedTopicId);

  const handleSelectTopic = (id: string) => {
    setSelectedTopicId(id);
    setActiveStepIndex(0);
    setFeedbackStatus('none');
  };

  const handleFeedback = (isGood: boolean) => {
    if (isGood) {
      setFeedbackStatus('success');
    } else {
      setFeedbackStatus('unresolved');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Banner */}
      <div className="bg-gradient-to-r from-[#004b87] to-[#0066b2] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-xs mb-3">
            <HelpCircle className="w-4 h-4 text-amber-300" />
            <span>Trung tâm hướng dẫn & trợ giúp</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {faqData.questionPrompt}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-sky-100">
            Chọn chủ đề cần hỗ trợ để xem quy trình từng bước bằng hình ảnh minh họa chi tiết và video hướng dẫn.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      {!selectedTopic ? (
        /* Topic Selection Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {faqData.topics.map((topic, index) => {
            const IconComponent = iconMap[topic.id] || HelpCircle;
            return (
              <div
                key={topic.id}
                onClick={() => handleSelectTopic(topic.id)}
                className="group cursor-pointer bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#004b87]/40 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#004b87] to-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#004b87] flex items-center justify-center group-hover:bg-[#004b87] group-hover:text-white transition-colors shadow-xs">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      {topic.steps.length} bước
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#004b87] transition-colors leading-snug">
                    {index + 1}. {topic.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-500 line-clamp-2">
                    {topic.shortDesc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#004b87]">
                  <span>Xem hướng dẫn chi tiết</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed Step-by-Step Guide for Selected Topic */
        <div className="space-y-6">
          {/* Header Bar of the Topic */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedTopicId(null)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                title="Quay lại danh sách câu hỏi"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Hướng dẫn thao tác
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedTopic.title}
                </h3>
              </div>
            </div>

            {selectedTopic.videoUrl && (
              <a
                href={selectedTopic.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-xs sm:text-sm shadow-xs transition-colors shrink-0"
              >
                <Youtube className="w-4 h-4" />
                <span>Xem Video Hướng Dẫn</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
              </a>
            )}
          </div>

          {/* Stepper Grid / Carousel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Step List / Navigation */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2 max-h-[620px] overflow-y-auto">
              <div className="px-2 py-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Các bước thực hiện ({selectedTopic.steps.length} bước)
              </div>
              {selectedTopic.steps.map((step, idx) => {
                const isCurrent = activeStepIndex === idx;
                return (
                  <button
                    key={step.step}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`w-full text-left p-3.5 rounded-xl transition-all flex items-start space-x-3 ${
                      isCurrent
                        ? 'bg-[#004b87] text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        isCurrent
                          ? 'bg-white text-[#004b87]'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {step.step}
                    </span>
                    <div className="flex-1">
                      <p
                        className={`text-xs sm:text-sm font-semibold leading-tight ${
                          isCurrent ? 'text-white' : 'text-slate-800'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p
                        className={`text-xs mt-1 line-clamp-2 ${
                          isCurrent ? 'text-sky-100' : 'text-slate-500'
                        }`}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Current Step Active Card with Image */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              {(() => {
                const current = selectedTopic.steps[activeStepIndex];
                return (
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-[#004b87] text-xs font-bold">
                          Bước {current.step} / {selectedTopic.steps.length}
                        </span>
                        <h4 className="font-bold text-slate-800 text-base sm:text-lg">
                          {current.title}
                        </h4>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-100 text-slate-700 text-sm leading-relaxed whitespace-pre-line mb-4 font-medium">
                      {current.desc}
                    </div>

                    {/* Step Image */}
                    <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900/5 aspect-4/3 flex items-center justify-center">
                      <img
                        src={current.image}
                        alt={`Minh họa bước ${current.step}`}
                        className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-102"
                        onError={(e) => {
                          // Clean fallback placeholder with helpful instructions
                          const target = e.target as HTMLImageElement;
                          target.src =
                            'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <button
                        onClick={() => setPreviewImage(current.image)}
                        className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs font-medium backdrop-blur-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Phóng to ảnh</span>
                      </button>
                    </div>

                    {/* Prev / Next controls */}
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                      <button
                        disabled={activeStepIndex === 0}
                        onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                          activeStepIndex === 0
                            ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        ← Bước trước
                      </button>

                      <div className="text-xs text-slate-500 font-medium">
                        Bước {activeStepIndex + 1} của {selectedTopic.steps.length}
                      </div>

                      <button
                        disabled={activeStepIndex === selectedTopic.steps.length - 1}
                        onClick={() =>
                          setActiveStepIndex((prev) =>
                            Math.min(selectedTopic.steps.length - 1, prev + 1)
                          )
                        }
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                          activeStepIndex === selectedTopic.steps.length - 1
                            ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                            : 'bg-[#004b87] hover:bg-[#003866] text-white shadow-xs'
                        }`}
                      >
                        Bước tiếp theo →
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Customer Satisfaction Feedback Card (Mandatory Requirement) */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center">
            {feedbackStatus === 'none' && (
              <div>
                <h4 className="text-lg font-bold text-slate-800">
                  Anh/chị thực hiện ổn hay chưa?
                </h4>
                <p className="mt-1 text-sm text-slate-500">
                  Phản hồi của Quý khách giúp VietinBank hoàn thiện chất lượng hỗ trợ tại quầy.
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => handleFeedback(true)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition-all active:scale-95 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Đã ổn rồi</span>
                  </button>

                  <button
                    onClick={() => handleFeedback(false)}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow-xs transition-all active:scale-95 flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>Chưa ổn, cần hỗ trợ thêm</span>
                  </button>
                </div>
              </div>
            )}

            {/* If Customer clicked "Đã ổn" */}
            {feedbackStatus === 'success' && (
              <div className="py-2 space-y-3 animate-in fade-in">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-800">
                  Rất vui vì đã hỗ trợ được Quý khách!
                </h4>
                <p className="text-sm text-slate-600">
                  Quý khách có thể quay lại menu chính để tra cứu thêm các dịch vụ khác hoặc kết thúc trò chuyện.
                </p>
              </div>
            )}

            {/* If Customer clicked "Chưa ổn" (Required Exact Text) */}
            {feedbackStatus === 'unresolved' && (
              <div className="p-4 sm:p-6 rounded-2xl bg-amber-50 border border-amber-200 text-left max-w-2xl mx-auto space-y-4 animate-in fade-in">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-amber-900 text-base">
                      Cảm ơn Quý khách đã phản hồi!
                    </h5>
                    <p className="mt-1 text-sm text-amber-800 leading-relaxed font-medium">
                      Quý khách có thể liên hệ Chuyên viên tư vấn{' '}
                      <strong>{consultant.name}</strong> – số điện thoại:{' '}
                      <strong className="text-red-700 underline">{consultant.phone}</strong> để hỗ trợ trực tiếp. Em sẽ cố gắng cải thiện để phục vụ Quý khách tốt hơn!
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <a
                    href={`tel:${consultant.phoneRaw}`}
                    className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Gọi tư vấn ngay: {consultant.phone}</span>
                  </a>
                </div>
              </div>
            )}

            {/* Navigation buttons: "Quay lại menu chính" & "Kết thúc cuộc trò chuyện" */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSelectedTopicId(null);
                  setFeedbackStatus('none');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#004b87] hover:bg-[#003866] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
              >
                Quay lại menu chính
              </button>

              <button
                onClick={() => setShowExitConfirm(true)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-medium transition-colors"
              >
                Kết thúc cuộc trò chuyện
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs p-4 flex items-center justify-center animate-in fade-in"
        >
          <div className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden p-2 shadow-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Ảnh phóng to"
              className="w-full max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Exit Session Modal (Mandatory Requirement) */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs p-4 flex items-center justify-center animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-100">
            <div className="w-14 h-14 mx-auto mb-4 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">
              Cảm ơn Quý khách!
            </h4>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed font-medium">
              “Cảm ơn Quý khách đã sử dụng dịch vụ của VietinBank. Chúc Quý khách một ngày tốt lành!”
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onFinishSession();
                }}
                className="px-6 py-2.5 rounded-xl bg-[#004b87] text-white font-semibold text-sm hover:bg-[#003866] transition-colors"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
