import React from 'react';
import { MapPin } from 'lucide-react';

interface LeftIconRailProps {
  activeTab?: string;
  onSelectTab: (tabId: string) => void;
}

export const LeftIconRail: React.FC<LeftIconRailProps> = ({
  onSelectTab,
}) => {
  return (
    <aside className="w-12 shrink-0 bg-[#FFFFFF] border-r border-[#E2DACB] flex flex-col items-center py-3 justify-start z-30 shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
      {/* Primary Home Location Icon (MapPin) */}
      <div className="flex flex-col items-center w-full px-1.5">
        <button
          onClick={() => onSelectTab('home')}
          className="w-9 h-9 rounded-xl bg-[#B31B24] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(179,27,36,0.35)] hover:bg-[#C7232D] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="الصفحة الرئيسية - الموقع الجغرافي"
        >
          <MapPin className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};
