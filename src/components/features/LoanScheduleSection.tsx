import React, { useState, useId } from 'react';
import {
  Calculator,
  Calendar,
  FileSpreadsheet,
  X,
  Printer,
  Download,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  TrendingDown,
  Percent,
  CheckCircle,
} from 'lucide-react';
import { LoanScheduleData, ScheduleRow } from '../../types';

interface LoanScheduleSectionProps {
  data: LoanScheduleData;
}

export const LoanScheduleSection: React.FC<LoanScheduleSectionProps> = ({
  data,
}) => {
  const loanInputId = useId();
  const collateralInputId = useId();
  const monthsInputId = useId();
  const rateInputId = useId();
  const disbDateInputId = useId();
  const cycleSelectId = useId();
  const payDaySelectId = useId();
  const roundingSelectId = useId();

  // Inputs
  const [loanAmountStr, setLoanAmountStr] = useState<string>(
    data.defaultLoanAmount.toLocaleString('vi-VN')
  );
  const [collateralStr, setCollateralStr] = useState<string>(
    data.defaultCollateralValue.toLocaleString('vi-VN')
  );
  const [months, setMonths] = useState<number>(data.defaultMonths);
  const [annualRateStr, setAnnualRateStr] = useState<string>(
    data.defaultInterestRate.toString()
  );
  const [disbursementDate, setDisbursementDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedCycleId, setSelectedCycleId] = useState<string>('monthly');
  const [dueDayOfMonth, setDueDayOfMonth] = useState<number>(25);
  const [roundOption, setRoundOption] = useState<'exact' | 'thousand'>('thousand');
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // Helper parser
  const parseNum = (str: string): number => {
    const clean = str.replace(/\D/g, '');
    return clean ? parseInt(clean, 10) : 0;
  };

  const loanAmount = parseNum(loanAmountStr);
  const collateralVal = parseNum(collateralStr);
  const annualRate = parseFloat(annualRateStr) || 0;

  const currentCycle =
    data.frequencyOptions.find((c) => c.id === selectedCycleId) ||
    data.frequencyOptions[0];

  // Number of periods
  const totalPeriods = Math.max(
    1,
    Math.ceil(months / currentCycle.intervalMonths)
  );

  // Periodic interest rate
  const periodicRate = annualRate / 100 / currentCycle.divisor;

  // Generate detailed repayment schedule
  const generateSchedule = (): { rows: ScheduleRow[]; totalInterest: number; totalPayment: number } => {
    const rows: ScheduleRow[] = [];
    if (loanAmount <= 0 || totalPeriods <= 0) {
      return { rows: [], totalInterest: 0, totalPayment: 0 };
    }

    const rawPrincipalPerPeriod = loanAmount / totalPeriods;
    let currentBalance = loanAmount;
    let accumulatedInterest = 0;
    let accumulatedPrincipal = 0;

    // Disbursement Date parse
    const [startYear, startMonth, startDay] = disbursementDate
      .split('-')
      .map((x) => parseInt(x, 10));

    // Period 0: Disbursement
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const disbDateDisplay = `${pad(startDay)}/${pad(startMonth)}/${startYear}`;

    rows.push({
      period: 0,
      paymentDate: disbDateDisplay,
      beginningBalance: loanAmount,
      principal: 0,
      interest: 0,
      totalPayment: 0,
      endingBalance: loanAmount,
    });

    for (let p = 1; p <= totalPeriods; p++) {
      const isLastPeriod = p === totalPeriods;
      let pPrincipal: number;

      if (isLastPeriod) {
        // Adjust any rounding variance in final period
        pPrincipal = loanAmount - accumulatedPrincipal;
      } else {
        if (roundOption === 'thousand') {
          pPrincipal = Math.round(rawPrincipalPerPeriod / 1000) * 1000;
        } else {
          pPrincipal = Math.round(rawPrincipalPerPeriod);
        }
      }

      accumulatedPrincipal += pPrincipal;

      let pInterest = currentBalance * periodicRate;
      if (roundOption === 'thousand') {
        pInterest = Math.round(pInterest / 1000) * 1000;
      } else {
        pInterest = Math.round(pInterest);
      }

      accumulatedInterest += pInterest;
      const pTotal = pPrincipal + pInterest;
      const endBalance = Math.max(0, currentBalance - pPrincipal);

      // Calculate Payment Date: intervalMonths forward, day = dueDayOfMonth
      const totalMonthsAhead = p * currentCycle.intervalMonths;
      const targetDate = new Date(startYear, startMonth - 1 + totalMonthsAhead, 1);
      const daysInTargetMonth = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth() + 1,
        0
      ).getDate();
      const actualDay = Math.min(dueDayOfMonth, daysInTargetMonth);
      const formattedDate = `${pad(actualDay)}/${pad(
        targetDate.getMonth() + 1
      )}/${targetDate.getFullYear()}`;

      rows.push({
        period: p,
        paymentDate: formattedDate,
        beginningBalance: currentBalance,
        principal: pPrincipal,
        interest: pInterest,
        totalPayment: pTotal,
        endingBalance: endBalance,
      });

      currentBalance = endBalance;
    }

    return {
      rows,
      totalInterest: accumulatedInterest,
      totalPayment: loanAmount + accumulatedInterest,
    };
  };

  const { rows, totalInterest, totalPayment } = generateSchedule();

  const firstPeriodPayment = rows[1]?.totalPayment || 0;
  const lastPeriodPayment = rows[rows.length - 1]?.totalPayment || 0;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#004b87] to-[#005a9e] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs mb-3">
            <Calculator className="w-4 h-4 text-emerald-300" />
            <span>Kế hoạch tài chính & vay vốn</span>
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
        {/* Step 1: Input Form (No sliders, clean text inputs) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#004b87]" />
              Bước 1: Nhập thông tin khoản vay
            </h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              Dư nợ giảm dần
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Số tiền vay */}
            <div className="sm:col-span-2">
              <label
                htmlFor={loanInputId}
                className="block text-sm font-bold text-slate-700 mb-1"
              >
                Số tiền vay (VND) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id={loanInputId}
                  type="text"
                  inputMode="numeric"
                  value={loanAmountStr}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '');
                    setLoanAmountStr(raw ? parseInt(raw, 10).toLocaleString('vi-VN') : '');
                  }}
                  placeholder="Nhập số tiền cần vay"
                  className="w-full px-4 py-3.5 pr-16 rounded-2xl border border-slate-300 font-bold text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004b87] focus:border-[#004b87]"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-xs font-bold text-slate-400">
                  VND
                </div>
              </div>
              {/* Presets */}
              <div className="mt-2 flex flex-wrap gap-2">
                {[100000000, 300000000, 500000000, 1000000000, 2000000000].map(
                  (val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setLoanAmountStr(val.toLocaleString('vi-VN'))}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
                    >
                      {(val / 1000000000 >= 1
                        ? `${val / 1000000000} tỷ`
                        : `${val / 1000000} tr`)}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Giá trị tài sản bảo đảm (tham chiếu) */}
            <div className="sm:col-span-2">
              <label
                htmlFor={collateralInputId}
                className="block text-xs font-semibold text-slate-500 mb-1"
              >
                Giá trị tài sản bảo đảm / BĐS (dự kiến)
              </label>
              <div className="relative">
                <input
                  id={collateralInputId}
                  type="text"
                  inputMode="numeric"
                  value={collateralStr}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '');
                    setCollateralStr(raw ? parseInt(raw, 10).toLocaleString('vi-VN') : '');
                  }}
                  className="w-full px-3.5 py-2.5 pr-14 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004b87]"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs font-bold text-slate-400">
                  VND
                </div>
              </div>
              {collateralVal > 0 && loanAmount > 0 && (
                <p className="mt-1 text-[11px] text-slate-500">
                  Tỷ lệ vay / tài sản: {((loanAmount / collateralVal) * 100).toFixed(1)}% (LTV)
                </p>
              )}
            </div>

            {/* Thời gian vay (tháng) */}
            <div>
              <label
                htmlFor={monthsInputId}
                className="block text-sm font-bold text-slate-700 mb-1"
              >
                Thời hạn vay (tháng) <span className="text-red-500">*</span>
              </label>
              <input
                id={monthsInputId}
                type="number"
                min="1"
                max="360"
                value={months}
                onChange={(e) => setMonths(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004b87]"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                {(months / 12).toFixed(1)} năm ({totalPeriods} kỳ thanh toán)
              </span>
            </div>

            {/* Lãi suất (%/năm) */}
            <div>
              <label
                htmlFor={rateInputId}
                className="block text-sm font-bold text-slate-700 mb-1"
              >
                Lãi suất vay (%/năm) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id={rateInputId}
                  type="number"
                  step="0.1"
                  min="0"
                  max="30"
                  value={annualRateStr}
                  onChange={(e) => setAnnualRateStr(e.target.value)}
                  className="w-full px-4 py-3 pr-14 rounded-2xl border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004b87]"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs font-bold text-slate-400">
                  %/năm
                </div>
              </div>
            </div>

            {/* Ngày giải ngân */}
            <div>
              <label
                htmlFor={disbDateInputId}
                className="block text-sm font-bold text-slate-700 mb-1"
              >
                Ngày giải ngân <span className="text-red-500">*</span>
              </label>
              <input
                id={disbDateInputId}
                type="date"
                value={disbursementDate}
                onChange={(e) => setDisbursementDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004b87]"
              />
            </div>

            {/* Chu kỳ trả nợ */}
            <div>
              <label
                htmlFor={cycleSelectId}
                className="block text-sm font-bold text-slate-700 mb-1"
              >
                Chu kỳ trả nợ <span className="text-red-500">*</span>
              </label>
              <select
                id={cycleSelectId}
                value={selectedCycleId}
                onChange={(e) => setSelectedCycleId(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004b87]"
              >
                {data.frequencyOptions.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label} (LS/{f.divisor})
                  </option>
                ))}
              </select>
            </div>

            {/* Ngày trả nợ định kỳ */}
            <div>
              <label
                htmlFor={payDaySelectId}
                className="block text-sm font-bold text-slate-700 mb-1"
              >
                Ngày trả nợ hàng kỳ
              </label>
              <select
                id={payDaySelectId}
                value={dueDayOfMonth}
                onChange={(e) => setDueDayOfMonth(parseInt(e.target.value, 10))}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004b87]"
              >
                {[5, 10, 15, 20, 25, 28].map((d) => (
                  <option key={d} value={d}>
                    Ngày {d} hằng tháng
                  </option>
                ))}
              </select>
            </div>

            {/* Quy tắc làm tròn */}
            <div>
              <label
                htmlFor={roundingSelectId}
                className="block text-sm font-bold text-slate-700 mb-1"
              >
                Quy tắc làm tròn
              </label>
              <select
                id={roundingSelectId}
                value={roundOption}
                onChange={(e) => setRoundOption(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004b87]"
              >
                <option value="thousand">Làm tròn đến 1.000 đồng</option>
                <option value="exact">Làm tròn đến đơn vị đồng</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Card: Summary & Button "Xem chi tiết" */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-gradient-to-br from-[#003764] via-[#004b87] to-[#00274c] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-5">
              <span className="text-xs uppercase font-bold tracking-wider text-sky-200">
                Ước tính nghĩa vụ trả nợ
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold">
                Gốc đều, lãi giảm dần
              </span>
            </div>

            <div className="space-y-4">
              {/* Số tiền trả kỳ đầu */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                <span className="text-xs text-sky-200 block font-medium">
                  Số tiền trả kỳ đầu (cao nhất)
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                    {firstPeriodPayment.toLocaleString('vi-VN')}
                  </span>
                  <span className="text-xs font-bold text-sky-200">VND</span>
                </div>
              </div>

              {/* Số tiền trả kỳ cuối */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                <span className="text-xs text-sky-200 block font-medium">
                  Số tiền trả kỳ cuối (thấp nhất)
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xl sm:text-2xl font-bold text-white">
                    {lastPeriodPayment.toLocaleString('vi-VN')}
                  </span>
                  <span className="text-xs font-bold text-sky-200">VND</span>
                </div>
              </div>

              {/* Tổng lãi & Tổng phải trả */}
              <div className="pt-2 border-t border-white/10 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-sky-200">
                  <span>Tổng tiền lãi phải trả:</span>
                  <span className="font-bold text-white">
                    {totalInterest.toLocaleString('vi-VN')} VND
                  </span>
                </div>
                <div className="flex justify-between text-sky-200">
                  <span>Tổng gốc và lãi:</span>
                  <span className="font-extrabold text-white text-base">
                    {totalPayment.toLocaleString('vi-VN')} VND
                  </span>
                </div>
              </div>
            </div>

            {/* Bước 2: Nút Xem chi tiết (Requirement from PDF 3) */}
            <div className="mt-6 pt-2">
              <button
                onClick={() => setShowDetailModal(true)}
                className="w-full py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span>Xem Chi Tiết Lịch Trả Nợ</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-[#004b87] flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              Ưu điểm phương thức dư nợ giảm dần:
            </p>
            <p>• Tổng lãi phải trả thấp hơn so với phương thức trả góp đều.</p>
            <p>• Tiền trả giảm dần theo thời gian, giảm bớt áp lực tài chính các năm sau.</p>
          </div>
        </div>
      </div>

      {/* Detail Repayment Schedule Modal (Exact Table Structure from PDF 3) */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs p-2 sm:p-6 flex items-center justify-center animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Bảng tính lịch trả nợ với dư nợ giảm dần
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Khoản vay: {loanAmount.toLocaleString('vi-VN')} VND | Thời gian: {months} tháng | Lãi suất: {annualRate}%/năm
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-white text-slate-600 text-xs font-semibold flex items-center gap-1 shadow-xs"
                  title="In bảng tính"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">In</span>
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Table */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
                <table className="min-w-full text-xs sm:text-sm text-left">
                  <thead className="bg-[#004b87] text-white uppercase text-[11px] font-bold tracking-wider">
                    <tr>
                      <th className="py-3 px-3 sm:px-4 text-center">STT</th>
                      <th className="py-3 px-3 sm:px-4">Kỳ trả nợ</th>
                      <th className="py-3 px-3 sm:px-4 text-right">Số gốc còn lại</th>
                      <th className="py-3 px-3 sm:px-4 text-right">Gốc</th>
                      <th className="py-3 px-3 sm:px-4 text-right">Lãi</th>
                      <th className="py-3 px-3 sm:px-4 text-right">Tổng gốc + Lãi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {rows.map((row) => (
                      <tr
                        key={row.period}
                        className={`hover:bg-slate-50 transition-colors ${
                          row.period === 0 ? 'bg-amber-50/50 font-medium' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 sm:px-4 text-center font-bold text-slate-700">
                          {row.period}
                        </td>
                        <td className="py-2.5 px-3 sm:px-4 font-semibold text-slate-800">
                          {row.paymentDate}
                        </td>
                        <td className="py-2.5 px-3 sm:px-4 text-right font-medium text-slate-700">
                          {row.beginningBalance.toLocaleString('vi-VN')}
                        </td>
                        <td className="py-2.5 px-3 sm:px-4 text-right font-semibold text-[#004b87]">
                          {row.period === 0 ? '-' : row.principal.toLocaleString('vi-VN')}
                        </td>
                        <td className="py-2.5 px-3 sm:px-4 text-right font-semibold text-rose-600">
                          {row.period === 0 ? '-' : row.interest.toLocaleString('vi-VN')}
                        </td>
                        <td className="py-2.5 px-3 sm:px-4 text-right font-bold text-slate-900">
                          {row.period === 0 ? '-' : row.totalPayment.toLocaleString('vi-VN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* Total Row */}
                  <tfoot className="bg-slate-100 font-extrabold text-slate-900 border-t-2 border-slate-300">
                    <tr>
                      <td colSpan={2} className="py-3 px-4 text-center uppercase tracking-wider text-xs">
                        TỔNG CỘNG
                      </td>
                      <td className="py-3 px-4 text-right">-</td>
                      <td className="py-3 px-4 text-right text-[#004b87]">
                        {loanAmount.toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3 px-4 text-right text-rose-600">
                        {totalInterest.toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3 px-4 text-right text-emerald-700 text-sm">
                        {totalPayment.toLocaleString('vi-VN')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500 italic">
                * Bảng tính được lập dựa trên quy định tính lãi theo dư nợ giảm dần của VietinBank.
              </span>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#004b87] text-white text-xs sm:text-sm font-semibold hover:bg-[#003764] transition-colors"
              >
                Đóng bảng tính
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
