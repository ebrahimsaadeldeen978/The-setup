import React from 'react';
import { Users, MapPin, Lock, FileQuestion } from 'lucide-react';

interface EmptyLocationContactsNoticeProps {
  compact?: boolean;
}

export const EmptyLocationContactsNotice: React.FC<EmptyLocationContactsNoticeProps> = ({
  compact = false,
}) => {
  return (
    <div className={`relative flex flex-col items-center justify-center text-center w-full h-full min-h-[160px] p-4 bg-[#FCFAF6] border border-[#E8E1D3] rounded-xl overflow-hidden select-none ${
      compact ? 'py-4' : 'py-6'
    }`}>
      {/* Background Subtle Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
        <Users className="w-36 h-36 text-[#1C191E]" />
      </div>

      {/* Empty List & Directory Icon Emblem */}
      <div className="relative mb-3 flex items-center justify-center">
        {/* Glow */}
        <div className="absolute -inset-2 bg-gradient-to-tr from-[#7A747D]/10 via-[#B31B24]/10 to-transparent rounded-full blur-xs" />
        
        {/* Emblem Badge representing empty list / contacts directory */}
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-b from-[#FFFFFF] to-[#F3EFE7] border-2 border-[#D8D0C0] shadow-md flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            {/* Empty list / roster icon */}
            <Users className="w-7 h-7 text-[#7A747D]" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#FAF7F2] border border-[#D5CDC0] flex items-center justify-center">
              <Lock className="w-2.5 h-2.5 text-[#B31B24]" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Required Label */}
      <h3 className="font-serif-title text-sm sm:text-base font-bold text-[#1C191E] tracking-wide leading-tight">
        لم يتم تحديد أي موقع
      </h3>

      {/* Description & Block Note */}
      <p className="text-[10.5px] text-[#7A747D] mt-1 max-w-[250px] leading-relaxed">
        تظهر جهات الاتصال المرتبطة بكل نشاط بمجرد النقر على دبوسه في الخريطة.
      </p>

      {/* Disabled Action Badge */}
      <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F2EB] border border-[#E0D8C8] text-[9.5px] text-[#7A747D]">
        <Lock className="w-3 h-3 text-[#B31B24]" />
        <span>بناء جهات الاتصال مقفل حتى تحديد دبوس</span>
      </div>
    </div>
  );
};
