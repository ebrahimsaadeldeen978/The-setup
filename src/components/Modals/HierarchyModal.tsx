import React from 'react';
import { 
  X, 
  Crown, 
  Scale 
} from 'lucide-react';
import { FamilyMember } from '../../types/dashboard';

interface HierarchyModalProps {
  isOpen: boolean;
  onClose: () => void;
  roster: FamilyMember[];
  onSelectMember: (member: FamilyMember) => void;
}

export const HierarchyModal: React.FC<HierarchyModalProps> = ({
  isOpen,
  onClose,
  roster,
  onSelectMember,
}) => {
  if (!isOpen) return null;

  const don = roster.find(m => m.role === 'Don');
  const consigliere = roster.find(m => m.role === 'Consigliere');
  const underboss = roster.find(m => m.role === 'Underboss');
  const capos = roster.filter(m => m.role === 'Caporegime');
  const soldiers = roster.filter(m => m.role === 'Soldier');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-4xl bg-[#FFFFFF] border border-[#E2DACB] rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar text-[#1C191E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EFEAE0] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F7D5D8] border border-[#E89EAA] flex items-center justify-center text-[#B31B24]">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#7A747D] uppercase tracking-widest font-mono-num font-bold">
                SUPREME LINE OF COMMAND
              </span>
              <h2 className="font-serif-title text-lg sm:text-xl font-bold text-[#1C191E]">
                Valenti Family Organizational Tree
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#7A747D] hover:text-[#1C191E] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tree Canvas */}
        <div className="space-y-6 flex flex-col items-center">
          
          {/* Level 1: DON */}
          {don && (
            <div className="flex flex-col items-center">
              <div 
                onClick={() => { onSelectMember(don); onClose(); }}
                className="w-72 p-3.5 rounded-2xl bg-[#FAF8F5] border-2 border-[#B31B24] shadow-md text-center cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-[#FFFFFF] border border-[#E2DACB] flex items-center justify-center font-serif-title font-bold text-base text-[#B31B24]">
                  {don.avatarInitials}
                </div>
                <span className="text-[10px] uppercase font-bold text-[#B31B24] tracking-widest block font-serif-title">
                  THE GODFATHER
                </span>
                <h3 className="font-serif-title text-base font-bold text-[#1C191E]">{don.name}</h3>
                <p className="text-[11px] text-[#7A747D] mt-0.5">{don.rankTitle}</p>
              </div>
              <div className="w-0.5 h-6 bg-[#D5CDC0] my-1" />
            </div>
          )}

          {/* Level 2: UNDERBOSS & CONSIGLIERE */}
          <div className="flex flex-wrap items-center justify-center gap-8 relative w-full max-w-xl">
            <div className="hidden sm:block absolute top-1/2 left-24 right-24 h-0.5 bg-[#D5CDC0] -translate-y-1/2 -z-0" />

            {consigliere && (
              <div 
                onClick={() => { onSelectMember(consigliere); onClose(); }}
                className="w-64 p-3 rounded-xl bg-[#FAF8F5] border border-[#E2DACB] shadow-sm text-center cursor-pointer hover:scale-105 transition-transform z-10"
              >
                <span className="text-[9px] uppercase font-bold text-[#15803D] tracking-wider block font-serif-title">
                  CONSIGLIERE (ADVISOR)
                </span>
                <h4 className="font-serif-title text-sm font-bold text-[#1C191E]">{consigliere.name}</h4>
                <p className="text-[10px] text-[#7A747D]">{consigliere.rankTitle}</p>
              </div>
            )}

            {underboss && (
              <div 
                onClick={() => { onSelectMember(underboss); onClose(); }}
                className="w-64 p-3 rounded-xl bg-[#FAF8F5] border border-[#E2DACB] shadow-sm text-center cursor-pointer hover:scale-105 transition-transform z-10"
              >
                <span className="text-[9px] uppercase font-bold text-[#7C3AED] tracking-wider block font-serif-title">
                  UNDERBOSS (FIELD MARSHAL)
                </span>
                <h4 className="font-serif-title text-sm font-bold text-[#1C191E]">{underboss.name}</h4>
                <p className="text-[10px] text-[#7A747D]">{underboss.rankTitle}</p>
              </div>
            )}
          </div>

          {/* Level 3: CAPOS */}
          <div className="w-full">
            <div className="text-center mb-3">
              <span className="text-[10px] font-serif-title uppercase tracking-widest text-[#B31B24] font-bold px-3 py-1 rounded bg-[#F7D5D8] border border-[#E89EAA]">
                CAPOREGIMES (CREW LEADERS)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {capos.map((capo) => (
                <div
                  key={capo.id}
                  onClick={() => { onSelectMember(capo); onClose(); }}
                  className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E2DACB] hover:border-[#B31B24] transition-all cursor-pointer shadow-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif-title text-xs font-bold text-[#1C191E]">{capo.name}</span>
                    <span className="text-[9px] font-mono-num text-[#15803D] font-bold">{capo.status}</span>
                  </div>
                  <p className="text-[10px] text-[#7A747D]">{capo.rankTitle}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Level 4: SOLDIERS */}
          <div className="w-full">
            <div className="text-center mb-3">
              <span className="text-[10px] font-serif-title uppercase tracking-widest text-[#7A747D] font-bold px-3 py-1 rounded bg-[#F4F1EA] border border-[#E2DACB]">
                SOLDIERS & SPECIALISTS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {soldiers.map((soldier) => (
                <div
                  key={soldier.id}
                  onClick={() => { onSelectMember(soldier); onClose(); }}
                  className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DACB] hover:border-[#B31B24] transition-all cursor-pointer text-xs shadow-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#1C191E] truncate text-[11px]">{soldier.name}</span>
                    <span className="text-[9px] font-mono-num text-[#B31B24] font-bold">{soldier.healthPercent}% HP</span>
                  </div>
                  <p className="text-[10px] text-[#7A747D] truncate">{soldier.weapon}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
