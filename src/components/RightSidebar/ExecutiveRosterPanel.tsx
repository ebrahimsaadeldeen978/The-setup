import React from 'react';
import { 
  Users, 
  Settings, 
  ChevronRight, 
  Shield, 
  Crosshair, 
  Key, 
  Truck, 
  Diamond, 
  Building2, 
  Heart,
  Scale,
  Briefcase
} from 'lucide-react';
import { FamilyMember } from '../../types/dashboard';

interface ExecutiveRosterPanelProps {
  roster: FamilyMember[];
  onDispatchMember: (member: FamilyMember, action: 'attack' | 'reinforce' | 'upgrade') => void;
  onOpenHierarchyTree: () => void;
  onSelectMember?: (member: FamilyMember) => void;
}

export const ExecutiveRosterPanel: React.FC<ExecutiveRosterPanelProps> = ({
  roster,
  onDispatchMember,
  onOpenHierarchyTree,
  onSelectMember,
}) => {
  return (
    <aside className="w-[300px] lg:w-[330px] shrink-0 flex flex-col gap-3 p-3 overflow-y-auto custom-scrollbar z-30">
      
      {/* 1. CARD 1: ORGANIZATIONAL HIERARCHY (Top Card in Image) */}
      <div className="command-card p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-title text-xs font-bold uppercase tracking-wider text-[#1C191E]">
            ORGANIZATIONAL HIERARCHY
          </h2>
          <button 
            onClick={onOpenHierarchyTree}
            className="text-[#9A94A0] hover:text-[#1C191E] transition-colors cursor-pointer"
            title="Configure Tree"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hierarchical Family Tree Canvas matching image */}
        <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] flex flex-col items-center">
          
          {/* Top Node: THE DON */}
          <div 
            onClick={onOpenHierarchyTree}
            className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#B31B24] shadow-sm flex items-center gap-1.5 text-center cursor-pointer hover:border-[#990000] transition-colors"
          >
            <Scale className="w-3 h-3 text-[#B31B24]" />
            <span className="font-serif-title text-[10px] font-bold text-[#1C191E]">DON</span>
          </div>

          {/* Line down to Level 2 */}
          <div className="w-px h-3 bg-[#D5CDC0]" />

          {/* Level 2: 2 Nodes (Underboss, Consigliere) */}
          <div className="relative flex items-center gap-6">
            <div className="absolute top-0 left-6 right-6 h-px bg-[#D5CDC0]" />
            <div className="px-2 py-1 rounded bg-[#FFFFFF] border border-[#E2DACB] text-[9px] font-bold text-[#554F59] font-serif-title">
              UNDERBOSS
            </div>
            <div className="px-2 py-1 rounded bg-[#FFFFFF] border border-[#E2DACB] text-[9px] font-bold text-[#554F59] font-serif-title">
              CONSIGLIERE
            </div>
          </div>

          {/* Line down to Level 3 */}
          <div className="w-px h-3 bg-[#D5CDC0]" />

          {/* Level 3: 4 Capo Boxes */}
          <div className="relative flex items-center gap-2">
            <div className="absolute top-0 left-3 right-3 h-px bg-[#D5CDC0]" />
            <div className="px-1.5 py-0.5 rounded bg-[#FFFFFF] border border-[#E2DACB] text-[8px] font-bold text-[#7A747D]">
              CAPO
            </div>
            <div className="px-1.5 py-0.5 rounded bg-[#FFFFFF] border border-[#E2DACB] text-[8px] font-bold text-[#7A747D]">
              CAPO
            </div>
            <div className="px-1.5 py-0.5 rounded bg-[#FFFFFF] border border-[#E2DACB] text-[8px] font-bold text-[#7A747D]">
              CAPO
            </div>
            <div className="px-1.5 py-0.5 rounded bg-[#FFFFFF] border border-[#E2DACB] text-[8px] font-bold text-[#7A747D]">
              CAPO
            </div>
          </div>

          {/* Line down to Level 4: Soldiers dots */}
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-[#EFEAE0] w-full justify-center">
            <span className="text-[8px] uppercase tracking-wider text-[#9A94A0] font-bold mr-1">SOLDIERS:</span>
            {[...Array(8)].map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#B31B24]" />
            ))}
          </div>
        </div>

        {/* Row of 7 Specialty Badges matching bottom of card in image */}
        <div className="flex items-center justify-between pt-1 border-t border-[#EFEAE0]">
          <div className="p-1 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[#B31B24]" title="Firearms">
            <Crosshair className="w-3 h-3" />
          </div>
          <div className="p-1 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[#D97706]" title="Safecracking">
            <Key className="w-3 h-3" />
          </div>
          <div className="p-1 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[#554F59]" title="Extortion Fronts">
            <Building2 className="w-3 h-3" />
          </div>
          <div className="p-1 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[#B31B24]" title="Logistics Fleet">
            <Truck className="w-3 h-3" />
          </div>
          <div className="p-1 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[#7C3AED]" title="Gambling Pit">
            <Diamond className="w-3 h-3" />
          </div>
          <div className="p-1 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[#15803D]" title="Perimeter Defense">
            <Shield className="w-3 h-3" />
          </div>
          <div className="p-1 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[#B31B24]" title="Hit Squads">
            <Users className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* 2. CARD 2: MEMBER PROFILES (Bottom Card in Image) */}
      <div className="command-card p-3.5 space-y-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-title text-xs font-bold uppercase tracking-wider text-[#1C191E]">
            MEMBER PROFILES
          </h2>
          <button 
            onClick={onOpenHierarchyTree}
            className="text-[10px] font-bold text-[#7A747D] hover:text-[#B31B24] uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
          >
            <span>VIEW ALL</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* 4 Member Profile Cards stacked vertically */}
        <div className="space-y-2 flex-1">
          {roster.slice(0, 4).map((member) => (
            <div
              key={member.id}
              onClick={() => onSelectMember && onSelectMember(member)}
              className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] hover:border-[#B31B24] transition-all flex items-center justify-between gap-2 cursor-pointer shadow-sm"
            >
              {/* Avatar + Info */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#EFEAE0] border border-[#D5CDC0] flex items-center justify-center font-serif-title font-bold text-xs text-[#1C191E] shrink-0">
                  {member.avatarInitials}
                </div>
                
                <div className="min-w-0">
                  <h3 className="font-serif-title text-xs font-bold text-[#1C191E] uppercase truncate">
                    {member.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[9px] text-[#7A747D]">
                    <span>{member.role}</span>
                    <span>&bull;</span>
                    <span className="truncate">{member.weapon}</span>
                  </div>

                  {/* Health Bar */}
                  <div className="w-20 bg-[#E5DECE] rounded-full h-1 mt-1 overflow-hidden">
                    <div 
                      className="bg-[#B31B24] h-full"
                      style={{ width: `${member.healthPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button (Soft rose-pink/coral pill button with icon like image) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDispatchMember(member, 'attack');
                }}
                className="w-8 h-8 rounded-lg bg-[#F7D5D8] border border-[#E89EAA] hover:bg-[#F2BFC4] text-[#B31B24] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                title="Dispatch Member"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

      </div>

    </aside>
  );
};
