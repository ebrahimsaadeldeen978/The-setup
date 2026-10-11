import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  X, 
  PlayCircle, 
  Clock, 
  ChevronRight, 
  Building2, 
  Crosshair, 
  HeartHandshake,
  ShieldAlert,
  Info
} from 'lucide-react';
import { LiveOperation } from '../../types/dashboard';

interface TacticalControlDrawerProps {
  operations: LiveOperation[];
  onTriggerEmergencyAction: (actionType: 'call_backup' | 'medic_evac' | 'bribe_police' | 'lockdown') => void;
  onCancelOperation?: (operationId: string) => void;
}

export const TacticalControlDrawer: React.FC<TacticalControlDrawerProps> = ({
  operations,
  onTriggerEmergencyAction,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  if (!isOpen) {
    return (
      <div className="w-full flex justify-center pb-2 z-30">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-1.5 rounded-t-xl bg-[#FFFFFF] border-t border-x border-[#E2DACB] shadow-md text-xs font-serif-title uppercase font-bold text-[#1C191E] flex items-center gap-1.5 hover:text-[#B31B24] transition-colors cursor-pointer"
        >
          <ChevronUp className="w-3.5 h-3.5 text-[#B31B24]" />
          <span>▲ OPERATIONS TERMINAL ▼</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full z-30">
      <div className="command-card p-3 space-y-2.5 shadow-[0_-4px_16px_rgba(40,30,20,0.06)] bg-[#FFFFFF]">
        
        {/* Top Handle Toggle Bar matching image */}
        <div className="flex items-center justify-between border-b border-[#EFEAE0] pb-2">
          <div className="w-6" /> {/* spacer */}
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-1.5 text-xs font-serif-title uppercase font-bold tracking-wider text-[#1C191E] hover:text-[#B31B24] cursor-pointer"
          >
            <span>▲ OPERATIONS TERMINAL ▼</span>
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded text-[#7A747D] hover:text-[#1C191E] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
            title="Close Terminal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Equal-Width Distinct Cards in a Row matching image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* 1. CARD 1: LIVE OPERATIONS */}
          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] flex flex-col justify-between space-y-2.5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif-title uppercase text-[11px] font-bold text-[#1C191E] flex items-center gap-1">
                  LIVE OPERATIONS
                </span>
                <PlayCircle className="w-3.5 h-3.5 text-[#B31B24]" />
              </div>

              {/* Progress Rows with Solid Red Bars matching image */}
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="font-bold text-[#1C191E] font-serif-title uppercase">OPERATION CARMINE</span>
                    <span className="font-mono-num text-[#B31B24] font-bold">85%</span>
                  </div>
                  <div className="w-full bg-[#E5DECE] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#B31B24] h-full w-[85%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="font-bold text-[#1C191E] font-serif-title uppercase">DEFEND PORT TERMINAL</span>
                    <span className="font-mono-num text-[#B31B24] font-bold">62%</span>
                  </div>
                  <div className="w-full bg-[#E5DECE] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#B31B24] h-full w-[62%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="font-bold text-[#1C191E] font-serif-title uppercase">EXTORTION RUN</span>
                    <span className="font-mono-num text-[#B31B24] font-bold">18%</span>
                  </div>
                  <div className="w-full bg-[#E5DECE] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#B31B24] h-full w-[18%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-1.5 border-t border-[#EFEAE0]">
              <span className="text-[9px] uppercase font-bold text-[#7A747D] hover:text-[#B31B24] cursor-pointer flex items-center gap-0.5">
                VIEW ALL OPERATIONS <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* 2. CARD 2: ACTIVITY LOG */}
          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] flex flex-col justify-between space-y-2.5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif-title uppercase text-[11px] font-bold text-[#1C191E]">
                  ACTIVITY LOG
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#F7D5D8] border border-[#E89EAA] text-[#B31B24] uppercase">
                  LOG &gt;
                </span>
              </div>

              {/* Timestamped Event Rows */}
              <div className="space-y-1.5 text-[10px]">
                <div className="flex items-center gap-2 text-[#4A454D]">
                  <Clock className="w-3 h-3 text-[#7A747D] shrink-0" />
                  <span className="font-mono-num font-bold text-[#1C191E]">12:08</span>
                  <span className="truncate">Order confirmed: North Pier secured</span>
                </div>
                <div className="flex items-center gap-2 text-[#4A454D]">
                  <Clock className="w-3 h-3 text-[#7A747D] shrink-0" />
                  <span className="font-mono-num font-bold text-[#1C191E]">12:05</span>
                  <span className="truncate">Rival patrol spotted in Bronx</span>
                </div>
                <div className="flex items-center gap-2 text-[#4A454D]">
                  <Clock className="w-3 h-3 text-[#7A747D] shrink-0" />
                  <span className="font-mono-num font-bold text-[#1C191E]">11:58</span>
                  <span className="truncate">Extortion tribute collected ($42k)</span>
                </div>
                <div className="flex items-center gap-2 text-[#4A454D]">
                  <Clock className="w-3 h-3 text-[#7A747D] shrink-0" />
                  <span className="font-mono-num font-bold text-[#1C191E]">11:42</span>
                  <span className="truncate">Police bribery ledger renewed</span>
                </div>
              </div>
            </div>

            <div className="pt-1.5 border-t border-[#EFEAE0] text-[9px] text-[#7A747D]">
              <span>Real-time Wire Feed: Operational</span>
            </div>
          </div>

          {/* 3. CARD 3: ADVISOR ODDS */}
          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif-title uppercase text-[11px] font-bold text-[#1C191E]">
                  ADVISOR ODDS
                </span>
                <Info className="w-3.5 h-3.5 text-[#7A747D]" />
              </div>

              <div className="flex items-center gap-3 mb-2">
                {/* Circular Portrait of Advisor matching image */}
                <div className="w-11 h-11 rounded-full border-2 border-[#E2DACB] bg-[#EFEAE0] overflow-hidden flex items-center justify-center font-serif-title font-bold text-xs text-[#1C191E] shrink-0">
                  TH
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono-num text-lg font-extrabold text-[#1C191E] leading-none">
                      78%
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FEF3C7] text-[#D97706] font-bold border border-[#FDE68A]">
                      MEDIUM
                    </span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-[#7A747D] font-bold block mt-0.5">
                    SUCCESS PROBABILITY
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-[#554F59] leading-tight">
                Tom Hagen: Attack odds at Sector 4 are 78%. Deploying an extra crew will guarantee zero rival resistance.
              </p>
            </div>

            <div className="pt-1.5 border-t border-[#EFEAE0] text-[9px] text-[#15803D] font-bold">
              ✓ Tactical Recommendation Approved
            </div>
          </div>

          {/* 4. CARD 4: EMERGENCY DISPATCH */}
          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-serif-title uppercase text-[11px] font-bold text-[#B31B24]">
                EMERGENCY DISPATCH
              </span>
              <ShieldAlert className="w-3.5 h-3.5 text-[#B31B24]" />
            </div>

            {/* 3 Prominent Red/Coral Action Cards matching image */}
            <div className="space-y-1.5">
              <button
                onClick={() => onTriggerEmergencyAction('call_backup')}
                className="w-full p-1.5 rounded-lg bg-[#F7D5D8] hover:bg-[#F2BFC4] border border-[#E89EAA] text-[#B31B24] flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <div className="p-1 rounded bg-[#FFFFFF] text-[#B31B24]">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="font-serif-title text-[10px] font-bold block uppercase leading-tight">
                    CALL MAINS
                  </span>
                  <span className="text-[8px] text-[#7A747D] block leading-none">Emergency Garrisons</span>
                </div>
              </button>

              <button
                onClick={() => onTriggerEmergencyAction('bribe_police')}
                className="w-full p-1.5 rounded-lg bg-[#F7D5D8] hover:bg-[#F2BFC4] border border-[#E89EAA] text-[#B31B24] flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <div className="p-1 rounded bg-[#FFFFFF] text-[#B31B24]">
                  <Crosshair className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="font-serif-title text-[10px] font-bold block uppercase leading-tight">
                    GANGSTERS
                  </span>
                  <span className="text-[8px] text-[#7A747D] block leading-none">Deploy Heavy Squad</span>
                </div>
              </button>

              <button
                onClick={() => onTriggerEmergencyAction('medic_evac')}
                className="w-full p-1.5 rounded-lg bg-[#F7D5D8] hover:bg-[#F2BFC4] border border-[#E89EAA] text-[#B31B24] flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <div className="p-1 rounded bg-[#FFFFFF] text-[#B31B24]">
                  <HeartHandshake className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="font-serif-title text-[10px] font-bold block uppercase leading-tight">
                    MEDIC TEAM
                  </span>
                  <span className="text-[8px] text-[#7A747D] block leading-none">Heal Wounded Made Men</span>
                </div>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
