import React from 'react';
import { MapPin } from 'lucide-react';
import { RacketNode } from '../../types/dashboard';
import { getPinActivityLabel } from '../../utils/activityStatusHelpers';

interface InactiveActivityNoticeProps {
  windowTitle?: string;
  selectedLocation?: RacketNode | null;
  compact?: boolean;
}

export const InactiveActivityNotice: React.FC<InactiveActivityNoticeProps> = ({
  windowTitle,
  selectedLocation,
  compact = false,
}) => {
  const isLocationSelected = !!selectedLocation;
  const activityLabel = isLocationSelected ? getPinActivityLabel(selectedLocation) : null;

  return (
    <div className={`relative flex flex-col items-center justify-center text-center w-full h-full min-h-[160px] p-4 bg-[#FCFAF6] border border-[#E8E1D3] rounded-xl overflow-hidden select-none ${
      compact ? 'py-4' : 'py-6'
    }`}>
      {/* Background Subtle Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05]">
        <img 
          src="/assets/aistudio/network_3038c009.png" 
          alt="" 
          className="w-44 h-44 object-contain" 
        />
      </div>

      {/* Network Hub Center Icon Badge */}
      <div className="relative mb-3 flex items-center justify-center">
        {/* Subtle glow / backdrop */}
        <div className="absolute -inset-2 bg-gradient-to-tr from-[#1C191E]/5 to-[#B31B24]/10 rounded-2xl blur-xs" />
        
        {/* Image Badge Container */}
        <div className="relative w-16 h-16 rounded-2xl bg-[#FFFFFF] border border-[#E5DECE] shadow-sm flex items-center justify-center p-3">
          <img 
            src="/assets/aistudio/network_3038c009.png" 
            alt="نشاط متفاعل" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Main Required Label */}
      <h3 className="font-serif-title text-sm sm:text-base font-bold text-[#1C191E] tracking-wide leading-tight">
        لم تحدد نشاط متفاعل
      </h3>

      {/* Contextual Subtitle */}
      <p className="text-[10.5px] text-[#7A747D] mt-1 max-w-[260px] leading-relaxed">
        {isLocationSelected ? (
          <>
            الموقع المحدد: <span className="font-bold text-[#1C191E]">{selectedLocation.name}</span>
            <br />
            <span className="text-[#8A181F] font-medium text-[10px]">
              ({activityLabel})
            </span>
            <br />
            <span className="text-[9.5px] text-[#9A94A0] mt-0.5 inline-block">
              تتطلب هذه النافذة تحديد دبوس عبارة عن عميل حالي أو متعاقد.
            </span>
          </>
        ) : (
          <span>
            يرجى تحديد دبوس من الخريطة يمثل <strong className="text-[#1C191E]">عميل حالي</strong> أو <strong className="text-[#1C191E]">متعاقد</strong> لعرض البيانات التشغيلية.
          </span>
        )}
      </p>

      {/* Visual Indicator of Expected Pin Types */}
      <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E5DECE] text-[9px] text-[#554F59]">
        <MapPin className="w-2.5 h-2.5 text-[#16A34A]" />
        <span>المطلوب:</span>
        <span className="font-bold text-[#16A34A]">عميل حالي</span>
        <span className="text-[#C2BAC8]">|</span>
        <span className="font-bold text-[#2563EB]">متعاقد</span>
      </div>
    </div>
  );
};
