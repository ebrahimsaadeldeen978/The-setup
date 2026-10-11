import React, { useState } from 'react';
import { 
  X, 
  Swords, 
  Shield, 
  Flame, 
  Users, 
  Check, 
  Clock, 
  Percent 
} from 'lucide-react';
import { FamilyMember, RacketNode } from '../../types/dashboard';

interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetNode: RacketNode | null;
  roster: FamilyMember[];
  initialOperationType?: 'takeover' | 'reinforce' | 'extort' | 'arson_bomb';
  preSelectedMember?: FamilyMember | null;
  onConfirmDispatch: (
    targetNode: RacketNode,
    operationType: 'takeover' | 'reinforce' | 'arson_bomb' | 'extort' | 'defend',
    selectedMemberIds: string[],
    calculatedSuccessRate: number
  ) => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  isOpen,
  onClose,
  targetNode,
  roster,
  initialOperationType = 'takeover',
  preSelectedMember,
  onConfirmDispatch,
}) => {
  const [opType, setOpType] = useState<'takeover' | 'reinforce' | 'arson_bomb' | 'extort'>(
    initialOperationType
  );
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(
    preSelectedMember ? [preSelectedMember.id] : []
  );

  if (!isOpen || !targetNode) return null;

  const toggleMemberSelection = (id: string) => {
    if (selectedMemberIds.includes(id)) {
      setSelectedMemberIds(selectedMemberIds.filter(m => m !== id));
    } else {
      setSelectedMemberIds([...selectedMemberIds, id]);
    }
  };

  let baseOdds = 65;
  if (targetNode.status === 'contested') baseOdds = 72;
  if (targetNode.status === 'owned') baseOdds = 90;

  selectedMemberIds.forEach(id => {
    const member = roster.find(m => m.id === id);
    if (member) baseOdds += member.successBonusPct;
  });

  const finalSuccessOdds = Math.min(Math.max(baseOdds, 20), 98);

  const handleLaunch = () => {
    onConfirmDispatch(targetNode, opType, selectedMemberIds, finalSuccessOdds);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-[#FFFFFF] border border-[#E2DACB] rounded-2xl p-5 shadow-2xl text-[#1C191E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EFEAE0] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#F7D5D8] border border-[#E89EAA] text-[#B31B24]">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#B31B24] uppercase tracking-wider font-mono-num font-bold">
                COMMITTING FIELD OPERATION
              </span>
              <h2 className="font-serif-title text-base sm:text-lg font-bold text-[#1C191E]">
                {targetNode.name}
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

        {/* Operation Type Switcher */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            onClick={() => setOpType('takeover')}
            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
              opType === 'takeover'
                ? 'bg-[#F7D5D8] border-[#E89EAA] text-[#B31B24] shadow-sm'
                : 'bg-[#FAF8F5] border-[#E5DECE] text-[#554F59] hover:bg-[#EFEBE2]'
            }`}
          >
            <Swords className="w-4 h-4 mx-auto mb-1 text-[#B31B24]" />
            <span className="font-serif-title text-xs font-bold block uppercase">Takeover</span>
            <span className="text-[9px] text-[#7A747D]">Direct Assault</span>
          </button>

          <button
            onClick={() => setOpType('reinforce')}
            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
              opType === 'reinforce'
                ? 'bg-[#E6F4EA] border-[#A8DAB5] text-[#15803D] shadow-sm'
                : 'bg-[#FAF8F5] border-[#E5DECE] text-[#554F59] hover:bg-[#EFEBE2]'
            }`}
          >
            <Shield className="w-4 h-4 mx-auto mb-1 text-[#15803D]" />
            <span className="font-serif-title text-xs font-bold block uppercase">Reinforce</span>
            <span className="text-[9px] text-[#7A747D]">Add Garrison</span>
          </button>

          <button
            onClick={() => setOpType('arson_bomb')}
            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
              opType === 'arson_bomb'
                ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#D97706] shadow-sm'
                : 'bg-[#FAF8F5] border-[#E5DECE] text-[#554F59] hover:bg-[#EFEBE2]'
            }`}
          >
            <Flame className="w-4 h-4 mx-auto mb-1 text-[#D97706]" />
            <span className="font-serif-title text-xs font-bold block uppercase">Sabotage</span>
            <span className="text-[9px] text-[#7A747D]">Torch Venue</span>
          </button>
        </div>

        {/* Made Men Selection */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#1C191E] font-serif-title uppercase font-bold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#B31B24]" /> Assign Crew Members
            </span>
            <span className="text-[#7A747D] font-mono-num text-[11px]">
              {selectedMemberIds.length} Selected
            </span>
          </div>

          <div className="max-h-40 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
            {roster.filter(m => m.role !== 'Don' && m.status !== 'hospitalized').map((member) => {
              const isSelected = selectedMemberIds.includes(member.id);
              return (
                <div
                  key={member.id}
                  onClick={() => toggleMemberSelection(member.id)}
                  className={`p-2 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#F7D5D8] border-[#E89EAA] text-[#B31B24]'
                      : 'bg-[#FAF8F5] border-[#E5DECE] text-[#554F59] hover:border-[#D5CDC0]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-5 h-5 rounded-md border border-[#E2DACB] bg-[#FFFFFF] flex items-center justify-center font-bold text-[10px]">
                      {isSelected ? <Check className="w-3 h-3 text-[#B31B24]" /> : member.avatarInitials}
                    </div>
                    <div className="truncate">
                      <span className="font-bold block truncate text-[#1C191E]">{member.name}</span>
                      <span className="text-[9px] text-[#7A747D]">{member.rankTitle}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-[#15803D] font-mono-num font-bold">
                    +{member.successBonusPct}% Odds
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Odds Preview */}
        <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] mb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#7A747D] uppercase font-bold block">Consigliere Estimated Success</span>
            <div className="flex items-center gap-1.5 font-bold font-mono-num text-sm text-[#15803D]">
              <Percent className="w-4 h-4" />
              <span>{finalSuccessOdds}% PROBABILITY</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#7A747D] uppercase font-bold block">Mission Time</span>
            <span className="font-mono-num text-xs font-bold text-[#1C191E] flex items-center justify-end gap-1">
              <Clock className="w-3 h-3 text-[#B31B24]" /> 45 Seconds
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EFEAE0] border border-[#E5DECE] text-xs font-bold uppercase tracking-wider text-[#554F59] cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={selectedMemberIds.length === 0}
            onClick={handleLaunch}
            className="flex-2 py-2 rounded-xl bg-[#B31B24] hover:bg-[#C7232D] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Swords className="w-4 h-4" />
            <span>Deploy Squad</span>
          </button>
        </div>

      </div>
    </div>
  );
};
