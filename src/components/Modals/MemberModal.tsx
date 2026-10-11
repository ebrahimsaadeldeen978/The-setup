import React from 'react';
import { 
  X, 
  ArrowUpCircle 
} from 'lucide-react';
import { FamilyMember } from '../../types/dashboard';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: FamilyMember | null;
  onUpgradeGear: (memberId: string) => void;
  onHealMember: (memberId: string) => void;
}

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  member,
  onUpgradeGear,
  onHealMember,
}) => {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-[#FFFFFF] border border-[#E2DACB] rounded-2xl p-5 shadow-2xl text-[#1C191E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EFEAE0] pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#F7D5D8] border border-[#E89EAA] flex items-center justify-center font-serif-title font-bold text-sm text-[#B31B24]">
              {member.avatarInitials}
            </div>
            <div>
              <span className="text-[10px] text-[#B31B24] uppercase tracking-wider font-mono-num font-bold">
                {member.role.toUpperCase()} DOSSIER
              </span>
              <h2 className="font-serif-title text-lg font-bold text-[#1C191E]">
                {member.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7A747D] hover:text-[#1C191E] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member Status & Vitals */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DECE]">
            <span className="text-[10px] uppercase font-bold text-[#7A747D] block">Current Health</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono-num font-bold text-[#1C191E]">{member.healthPercent}% HP</span>
              {member.healthPercent < 100 && (
                <button
                  onClick={() => onHealMember(member.id)}
                  className="px-2 py-0.5 rounded bg-[#E6F4EA] text-[#15803D] hover:bg-[#CEEAD6] border border-[#A8DAB5] text-[10px] font-bold cursor-pointer"
                >
                  Doctor ($10k)
                </button>
              )}
            </div>
            <div className="w-full bg-[#E5DECE] rounded-full h-1 mt-1.5 overflow-hidden">
              <div 
                className="h-full bg-[#B31B24]"
                style={{ width: `${member.healthPercent}%` }}
              />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DECE]">
            <span className="text-[10px] uppercase font-bold text-[#7A747D] block">Field Bonus</span>
            <span className="font-mono-num font-bold text-[#B31B24] text-sm block mt-1">
              +{member.successBonusPct}% Mission Odds
            </span>
            <span className="text-[9px] text-[#7A747D]">Recorded Kills: {member.killsCount}</span>
          </div>
        </div>

        {/* Weaponry & Credentials */}
        <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] mb-4 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-serif-title uppercase text-[11px] text-[#1C191E] font-bold">
              Issued Weaponry
            </span>
            <button
              onClick={() => onUpgradeGear(member.id)}
              className="px-2 py-0.5 rounded bg-[#F7D5D8] text-[#B31B24] hover:bg-[#F2BFC4] border border-[#E89EAA] text-[10px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <ArrowUpCircle className="w-3 h-3" /> Upgrade Weapon ($25k)
            </button>
          </div>
          
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#FFFFFF] border border-[#E5DECE]">
            <span className="text-[#7A747D]">Primary Firearm:</span>
            <span className="font-mono-num font-bold text-[#1C191E]">{member.weapon}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#FFFFFF] border border-[#E5DECE]">
            <span className="text-[#7A747D]">Permit Level:</span>
            <span className="font-mono-num text-[#15803D] font-bold">{member.licenseLevel}</span>
          </div>
        </div>

        {/* Specialties */}
        <div className="space-y-1.5 mb-5">
          <span className="text-[10px] uppercase font-bold text-[#7A747D] block">Specialist Skills</span>
          <div className="flex flex-wrap gap-1.5">
            {member.specialties.map(spec => (
              <span key={spec} className="px-2 py-1 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] text-xs font-semibold text-[#1C191E]">
                {spec}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EFEAE0] border border-[#E5DECE] text-[#1C191E] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          Close Dossier
        </button>
      </div>
    </div>
  );
};
