import React, { useState, useId } from 'react';
import {
  PiggyBank,
  TrendingUp,
  AlertCircle,
  Video,
  CheckCircle2,
  ExternalLink,
  Percent,
  Coins,
  Calendar,
  RotateCcw,
} from 'lucide-react';
import { DepositInterestData } from '../../types';

interface DepositInterestSectionProps {
  data: DepositInterestData;
}

export const DepositInterestSection: React.FC<DepositInterestSectionProps> = ({
  data,
}) => {
  const amountInputId = useId();
  const termSelectId = useId();
  const rateInputId = useId();

  const [amountStr, setAmountStr] = useState<string>(
    data.defaultAmount.toLocaleString('vi-VN')
  );
  const [selectedTerm, setSelectedTerm] = useState<number>(data.defaultTerm);
  const [interestRateStr, setInterestRateStr] = useState<string>(
    data.defaultRate.toString()
  );

  const [touched, setTouched] = useState<{
    amount: boolean;
    term: boolean;
    rate: boolean;
  }>({
    amount: false,
    term: false,
    rate: false,
  });

  // Parse raw amount
  const parseAmount = (val: string): number => {
    const clean = val.replace(/\D/g, '');
    return clean ? parseInt(clean, 10) : 0;
  };

  const amount = parseAmount(amountStr);
  const rate = parseFloat(interestRateStr) || 0;

  // Validation
  const isAmountValid = amount >= data.minAmount;
  const isTermValid = selectedTerm >= 0;
  const isRateValid = !isNaN(rate) && rate >= 0 && rate <= 25;

  // Calculation
  // Standard banking formula: Tiền lãi = Số tiền gửi * (Lãi suất / 100) * (Số tháng / 12)
  // For non-term (0 months): 30 days calculation
  const calculatedInterest = Math.round(
    selectedTerm === 0
      ? (amount * (rate / 100) * 30) / 365
      : (amount * (rate / 100) * selectedTerm) / 12
  );

  const totalAmount = amount + (isAmountValid && isRateValid ? calculatedInterest : 0);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    if (rawVal === '') {
      setAmountStr('');
      return;
    }
    const num = parseInt(rawVal, 10);
    setAmountStr(num.toLocaleString('vi-VN'));
  };

  const handlePresetAmount = (val: number) => {
    setAmountStr(val.toLocaleString('vi-VN'));
    setTouched((prev) => ({ ...prev, amount: true }));
  };

  const handleTermChange = (months: number) => {
    setSelectedTerm(months);
    setTouched((prev) => ({ ...prev, term: true }));
    const found = data.termOptions.find((t) => t.months === months);
    if (found) {
      setInterestRateStr(found.suggestedRate.toString());
    }
  };

  const handleReset = () => {
    setAmountStr(data.defaultAmount.toLocaleString('vi-VN'));
    setSelectedTerm(data.defaultTerm);
    setInterestRateStr(data.defaultRate.toString());
    setTouched({ amount: false, term: false, rate: false });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#004b87] to-[#005a9e] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs mb-3">
            <PiggyBank className="w-4 h-4 text-amber-300" />
            <span>Tiết kiệm sinh lời an toàn</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {data.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-sky-100">
            {data.subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Coins className="w-5 h-5 text-[#004b87]" />
              Nhập thông tin tiền gửi
            </h3>
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-[#004b87] flex items-center gap-1 font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Làm mới
            </button>
          </div>

          {/* Input 1: Số tiền gửi */}
          <div>
            <label
              htmlFor={amountInputId}
              className="block text-sm font-bold text-slate-700 mb-1"
            >
              Số tiền gửi (VND) <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-2xl shadow-xs">
              <input
                id={amountInputId}
                type="text"
                inputMode="numeric"
                value={amountStr}
                onChange={handleAmountChange}
                onBlur={() => setTouched((p) => ({ ...p, amount: true }))}
                placeholder="Nhập số tiền gửi"
                className={`w-full px-4 py-3.5 pr-16 rounded-2xl border text-base font-semibold transition-all focus:outline-none focus:ring-2 ${
                  touched.amount && !isAmountValid
                    ? 'border-red-400 bg-red-50/30 text-red-900 focus:ring-red-400'
                    : 'border-slate-300 bg-white text-slate-900 focus:ring-[#004b87] focus:border-[#004b87]'
                }`}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-xs font-bold text-slate-400">
                VND
              </div>
            </div>

            {/* Validation Message */}
            {touched.amount && !isAmountValid && (
              <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {data.rules.amountError} (Tối thiểu 1.000.000 VND)
              </p>
            )}

            {/* Quick Amount Presets */}
            <div className="mt-2.5 flex flex-wrap gap-2">
              {[20000000, 50000000, 100000000, 200000000, 500000000].map(
                (preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetAmount(preset)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                  >
                    {(preset / 1000000).toLocaleString('vi-VN')} triệu
                  </button>
                )
              )}
            </div>
          </div>

          {/* Input 2: Kỳ hạn gửi */}
          <div>
            <label
              htmlFor={termSelectId}
              className="block text-sm font-bold text-slate-700 mb-1"
            >
              Kỳ hạn gửi <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id={termSelectId}
                value={selectedTerm}
                onChange={(e) => handleTermChange(parseInt(e.target.value, 10))}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-300 bg-white text-slate-900 font-semibold text-base focus:outline-none focus:ring-2 focus:ring-[#004b87] focus:border-[#004b87]"
              >
                {data.termOptions.map((t) => (
                  <option key={t.months} value={t.months}>
                    {t.label} (Gợi ý: {t.suggestedRate}%/năm)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Input 3: Lãi suất (%/năm) */}
          <div>
            <label
              htmlFor={rateInputId}
              className="block text-sm font-bold text-slate-700 mb-1"
            >
              Lãi suất áp dụng (%/năm) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id={rateInputId}
                type="number"
                step="0.05"
                min="0"
                max="25"
                value={interestRateStr}
                onChange={(e) => {
                  setInterestRateStr(e.target.value);
                  setTouched((p) => ({ ...p, rate: true }));
                }}
                className={`w-full px-4 py-3.5 pr-16 rounded-2xl border font-semibold text-base focus:outline-none focus:ring-2 ${
                  touched.rate && !isRateValid
                    ? 'border-red-400 bg-red-50/30 text-red-900 focus:ring-red-400'
                    : 'border-slate-300 bg-white text-slate-900 focus:ring-[#004b87] focus:border-[#004b87]'
                }`}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-xs font-bold text-slate-400">
                %/năm
              </div>
            </div>

            {touched.rate && !isRateValid && (
              <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {data.rules.rateError}
              </p>
            )}
          </div>
        </div>

        {/* Right Output: Calculation Results */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-[#003764] via-[#004b87] to-[#00274c] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <span className="text-xs uppercase tracking-wider font-semibold text-sky-200">
                Kết quả dự tính
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
                Trả lãi cuối kỳ
              </span>
            </div>

            <div className="space-y-6">
              {/* Tiền lãi dự tính */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                <p className="text-xs sm:text-sm text-sky-200 font-medium">
                  Tiền lãi dự tính
                </p>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                    {isAmountValid && isRateValid
                      ? calculatedInterest.toLocaleString('vi-VN')
                      : 0}
                  </span>
                  <span className="text-xs font-bold text-sky-200">VND</span>
                </div>
              </div>

              {/* Tổng tiền khi đáo hạn (Gốc + Lãi) */}
              <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/15">
                <p className="text-xs sm:text-sm text-sky-200 font-medium">
                  Tổng tiền nhận được (Gốc + Lãi)
                </p>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">
                    {isAmountValid && isRateValid
                      ? totalAmount.toLocaleString('vi-VN')
                      : 0}
                  </span>
                  <span className="text-xs font-bold text-sky-200">VND</span>
                </div>
              </div>
            </div>

            <p className="mt-6 text-[11px] text-sky-200/80 leading-relaxed italic">
              * Kết quả tính mang tính chất tham khảo. Tiền lãi thực tế sẽ được chuẩn hóa dựa trên số ngày gửi thực tế trong kỳ và quy định biểu lãi suất VietinBank tại thời điểm gửi tiền.
            </p>
          </div>

          {/* Video Guide Card */}
          {data.videoGuideUrl && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Video hướng dẫn gửi tiết kiệm
                  </h4>
                  <p className="text-xs text-slate-500">
                    Xem kinh nghiệm và mẹo tối ưu lãi suất
                  </p>
                </div>
              </div>

              <a
                href={data.videoGuideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors shrink-0"
              >
                <span>Xem clip</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
