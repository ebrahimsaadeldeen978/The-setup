import React from 'react';
import { 
  TrendingUp, 
  ExternalLink, 
  FileSpreadsheet, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Plus
} from 'lucide-react';
import { ClientKpiCircle, ClientKpiCategory } from '../../types/dashboard';

interface ClientMainKpisCardProps {
  circles: ClientKpiCircle[];
  onOpenCircleDetail: (category: ClientKpiCategory) => void;
  selectedLocationName?: string;
  isClientSelected?: boolean;
}

export const ClientMainKpisCard: React.FC<ClientMainKpisCardProps> = ({
  circles,
  onOpenCircleDetail,
  selectedLocationName,
  isClientSelected = false,
}) => {
  // Ensure we have the 3 canonical circles
  const commerceCircle = circles.find(c => c.id === 'commerce') || {
    id: 'commerce' as const,
    name: 'التجارة',
    englishName: 'Commerce',
    score: 85,
    status: 'good' as const,
    metrics: [],
    tagline: 'مقاييس التجارة العامة',
    description: ''
  };

  const influencesCircle = circles.find(c => c.id === 'influences') || {
    id: 'influences' as const,
    name: 'المؤثرات',
    englishName: 'Influences',
    score: 64,
    status: 'warning' as const,
    metrics: [],
    tagline: 'المؤثرات الخاصة بالصناعة',
    description: ''
  };

  const trustCircle = circles.find(c => c.id === 'trust') || {
    id: 'trust' as const,
    name: 'الثقة',
    englishName: 'Trust',
    score: 90,
    status: 'good' as const,
    metrics: [],
    tagline: 'مقاييس رضا العميل المتفق عليها',
    description: ''
  };

  const activeCircles = [commerceCircle, influencesCircle, trustCircle];

  // Overall average
  const totalScore = Math.round(
    activeCircles.reduce((sum, c) => sum + (c.score || 0), 0) / (activeCircles.length || 1)
  );

  // Helper for status styling & glow
  const getCircleStyling = (circle: ClientKpiCircle) => {
    const score = circle.score;
    if (score >= 75) {
      return {
        strokeColor: '#16A34A', // Green 600
        bgColor: 'bg-emerald-50/70',
        borderColor: 'border-emerald-300',
        textColor: 'text-emerald-700',
        glowClass: 'shadow-[0_0_16px_rgba(22,163,74,0.35)] ring-1 ring-emerald-400/40',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        badgeText: 'مستقر / ممتاز',
        icon: <CheckCircle2 className="w-3 h-3 text-emerald-600 inline ml-0.5" />,
        pulseEffect: 'animate-none'
      };
    } else if (score >= 50) {
      return {
        strokeColor: '#D97706', // Amber 600
        bgColor: 'bg-amber-50/70',
        borderColor: 'border-amber-300',
        textColor: 'text-amber-700',
        glowClass: 'shadow-[0_0_16px_rgba(217,119,6,0.35)] ring-1 ring-amber-400/40',
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
        badgeText: 'تنبيه / متابعة',
        icon: <AlertCircle className="w-3 h-3 text-amber-600 inline ml-0.5" />,
        pulseEffect: 'animate-pulse'
      };
    } else {
      return {
        strokeColor: '#DC2626', // Red 600
        bgColor: 'bg-red-50/70',
        borderColor: 'border-red-400',
        textColor: 'text-red-700',
        glowClass: 'shadow-[0_0_20px_rgba(220,38,38,0.55)] ring-2 ring-red-400 animate-pulse',
        badgeBg: 'bg-red-100 text-red-800 border-red-300 animate-pulse',
        badgeText: 'خطر / تدخل عاجل',
        icon: <AlertTriangle className="w-3 h-3 text-red-600 inline ml-0.5 animate-bounce" />,
        pulseEffect: 'animate-pulse'
      };
    }
  };

  return (
    <div 
      className="command-card p-2 sm:p-2.5 flex flex-col justify-between h-full bg-[#FCFAF6] border border-[#E5DECE] rounded-xl hover:border-[#1C191E] transition-all group relative overflow-hidden"
    >
      {/* Background subtle watermark/pattern */}
      <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-gradient-to-tr from-[#EFEAE0]/40 to-transparent rounded-full pointer-events-none" />

      <div>
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-1 pb-1 border-b border-[#EFEAE0]">
          <div className="flex items-center gap-1">
            <h2 className="font-serif-title text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#1C191E] flex items-center gap-1">
              <span className="text-[#8A181F]">CLIENT MAIN KPIS</span>
              <span className="text-[9px] text-[#7A747D] font-normal normal-case font-sans truncate max-w-[110px]">
                {isClientSelected && selectedLocationName ? `(${selectedLocationName})` : '(المؤشرات)'}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onOpenCircleDetail('commerce')}
              className="text-[8.5px] flex items-center gap-1 px-1.5 py-0.5 bg-[#FAF8F5] border border-[#D5CDBC] hover:border-[#8A181F] text-[#4A444E] hover:text-[#8A181F] rounded transition-all font-semibold shadow-2xs"
              title="إدارة وربط الشيتات للمقاييس الثلاثة"
            >
              <FileSpreadsheet className="w-2.5 h-2.5 text-[#16A34A]" />
              <span>شيت / معادلات</span>
            </button>
            <button
              onClick={() => onOpenCircleDetail('commerce')}
              className="p-0.5 hover:bg-[#EFEAE0] rounded text-[#7A747D] hover:text-[#1C191E] transition-colors"
              title="إضافة مقياس جديد"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 3 DONUT CHARTS SIDE-BY-SIDE (COMPACT & HIGH RESOLUTION) */}
        <div className="grid grid-cols-3 gap-1.5 pt-0.5 pb-0.5">
          {activeCircles.map((circle) => {
            const styling = getCircleStyling(circle);
            const circumference = 2 * Math.PI * 14; // r = 14
            const strokeDashoffset = circumference - (circle.score / 100) * circumference;

            return (
              <div
                key={circle.id}
                onClick={() => onOpenCircleDetail(circle.id)}
                className={`flex flex-col items-center justify-between p-1.5 rounded-lg border ${styling.borderColor} ${styling.bgColor} cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm ${styling.glowClass} relative group/circle`}
                title={`انقر لفتح مقاييس ${circle.name} وبناء المعادلة`}
              >
                {/* Critical danger flashing ping indicator if < 50% */}
                {circle.score < 50 && (
                  <span className="absolute top-1 right-1 flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-600" />
                  </span>
                )}

                {/* Donut Radial Graphic - Sleek & Compact */}
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center my-0.5">
                  <svg className="w-full h-full transform -rotate-90 drop-shadow-xs" viewBox="0 0 36 36">
                    {/* Background Track Circle */}
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#E5DEC9"
                      strokeWidth="3.4"
                    />
                    {/* Progress Donut Stroke */}
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke={styling.strokeColor}
                      strokeWidth="3.6"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>

                  {/* Percentage in center */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-mono-num text-[11px] sm:text-xs font-black text-[#1C191E] tracking-tight leading-none">
                      {circle.score}%
                    </span>
                    <span className="text-[6.5px] font-bold uppercase text-[#7A747D] mt-0.5 leading-none">
                      {circle.englishName.slice(0, 3)}
                    </span>
                  </div>
                </div>

                {/* Circle Name & Badge */}
                <div className="text-center w-full mt-0.5">
                  <div className="font-bold text-[10px] text-[#1C191E] leading-tight flex items-center justify-center gap-0.5">
                    <span>{circle.name}</span>
                    <ArrowUpRight className="w-2 h-2 text-[#9E97A6] opacity-0 group-hover/circle:opacity-100 transition-opacity" />
                  </div>
                  
                  {/* Status chip with alert text */}
                  <div className={`mt-0.5 text-[7px] font-bold px-1 py-0.2 rounded-full border ${styling.badgeBg} inline-flex items-center justify-center`}>
                    {styling.icon}
                    <span>{styling.badgeText}</span>
                  </div>
                </div>

                {/* Metrics Count Pill */}
                <div className="text-[7.5px] text-[#7A747D] mt-0.5 font-mono-num flex items-center gap-0.5">
                  <span>{circle.metrics?.length || 0} مقاييس</span>
                  {circle.sheetUrl && (
                    <span className="text-[7px] text-[#16A34A] font-bold" title="مرتبط بشيت">● شيت</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info & Overall Index */}
      <div className="pt-1 mt-1 border-t border-[#EFEAE0] flex items-center justify-between text-[9px]">
        <div className="flex items-center gap-1 text-[#554F59]">
          <span className="text-[#7A747D]">المؤشر:</span>
          <span className={`font-mono-num font-extrabold ${totalScore >= 75 ? 'text-emerald-700' : totalScore >= 50 ? 'text-amber-700' : 'text-red-700'}`}>
            {totalScore}% إجمالي
          </span>
        </div>

        <button
          onClick={() => onOpenCircleDetail('commerce')}
          className="text-[#8A181F] hover:text-[#581014] font-bold text-[8.5px] flex items-center gap-0.5 transition-colors group/btn"
        >
          <span>إعداد المعادلة</span>
          <Sliders className="w-2 h-2 group-hover/btn:rotate-45 transition-transform" />
        </button>
      </div>
    </div>
  );
};
