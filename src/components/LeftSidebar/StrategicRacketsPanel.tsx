import React from 'react';
import { 
  Shield, 
  Package, 
  Building2, 
  Crown, 
  Crosshair, 
  Truck, 
  ChevronRight, 
  Eye,
  Plus
} from 'lucide-react';
import { CrimeRing, RacketNode } from '../../types/dashboard';

interface StrategicRacketsPanelProps {
  crimeRings: CrimeRing[];
  rackets: RacketNode[];
  selectedRingFilter?: string | null;
  onSelectRingFilter?: (category: string) => void;
  onSelectRacket: (racket: RacketNode) => void;
}

export const StrategicRacketsPanel: React.FC<StrategicRacketsPanelProps> = ({
  rackets,
  selectedRingFilter,
  onSelectRingFilter,
  onSelectRacket,
}) => {
  // Dynamic metrics derived purely from current user rackets (0 when empty)
  const totalRackets = rackets.length;
  const ownedRackets = rackets.filter(r => r.status === 'owned').length;
  const completionPct = totalRackets > 0 ? Math.round((ownedRackets / totalRackets) * 100) : 0;

  // Category counts
  const extortCount = rackets.filter(r => r.type === 'Extortion Front' || r.ringCategory?.includes('Extortion')).length;
  const depotCount = rackets.filter(r => r.type === 'Warehouse' || r.type === 'Smuggling Depot').length;
  const venueCount = rackets.filter(r => r.type === 'Casino' || r.type === 'Diner').length;
  const caposAssigned = rackets.filter(r => r.assignedCapo).length;

  const totalHourlyRevenue = rackets.reduce((sum, r) => sum + (r.status === 'owned' ? r.hourlyIncome : 0), 0);

  // Revenue by category
  const extortRevenue = rackets.filter(r => r.type === 'Extortion Front').reduce((s, r) => s + (r.status === 'owned' ? r.hourlyIncome : 0), 0);
  const gamblingRevenue = rackets.filter(r => r.type === 'Casino').reduce((s, r) => s + (r.status === 'owned' ? r.hourlyIncome : 0), 0);
  const logisticsRevenue = rackets.filter(r => r.type === 'Warehouse' || r.type === 'Shipping Docks').reduce((s, r) => s + (r.status === 'owned' ? r.hourlyIncome : 0), 0);
  const otherRevenue = Math.max(0, totalHourlyRevenue - (extortRevenue + gamblingRevenue + logisticsRevenue));

  const extortPct = totalHourlyRevenue > 0 ? Math.round((extortRevenue / totalHourlyRevenue) * 100) : 0;
  const gamblingPct = totalHourlyRevenue > 0 ? Math.round((gamblingRevenue / totalHourlyRevenue) * 100) : 0;
  const logisticsPct = totalHourlyRevenue > 0 ? Math.round((logisticsRevenue / totalHourlyRevenue) * 100) : 0;
  const otherPct = totalHourlyRevenue > 0 ? Math.round((otherRevenue / totalHourlyRevenue) * 100) : 0;

  // Unlocked bonuses from owned user rackets
  const activeBonuses = rackets
    .filter(r => r.status === 'owned' && r.strategicBonusText)
    .slice(0, 3);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3">
      
      {/* 1. CARD 1: RING COMPLETION */}
      <div className="command-card p-3 flex flex-col justify-between h-full">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-title text-xs font-bold uppercase tracking-wider text-[#1C191E]">
              RING COMPLETION
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="font-mono-num font-bold text-xs text-[#1C191E]">
                {ownedRackets}/{totalRackets}
              </span>
            </div>
          </div>

          {/* Solid Crimson Bar */}
          <div className="w-full bg-[#EFEAE0] rounded-full h-1 overflow-hidden">
            <div 
              className="h-full bg-[#B31B24] transition-all duration-300" 
              style={{ width: `${completionPct}%` }}
            />
          </div>

          {/* 4 Square Status Boxes in a row */}
          <div className="grid grid-cols-4 gap-1.5 pt-0.5">
            {/* Box 1: Shield */}
            <div className="p-1.5 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] flex flex-col items-center justify-center text-center">
              <div className="p-1 rounded bg-[#FFFFFF] border border-[#E5DECE] text-[#B31B24] mb-0.5">
                <Shield className="w-3 h-3" />
              </div>
              <span className="text-[8px] uppercase tracking-wider text-[#7A747D] font-bold block truncate w-full">
                EXTORT
              </span>
              <div className="w-full bg-[#E5DECE] h-1 rounded-full my-0.5 overflow-hidden">
                <div 
                  className="bg-[#B31B24] h-full" 
                  style={{ width: totalRackets > 0 ? `${Math.min(100, Math.round((extortCount / totalRackets) * 100))}%` : '0%' }}
                />
              </div>
              <span className="font-mono-num text-[9px] font-bold text-[#1C191E]">{extortCount}</span>
            </div>

            {/* Box 2: Package */}
            <div className="p-1.5 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] flex flex-col items-center justify-center text-center">
              <div className="p-1 rounded bg-[#FFFFFF] border border-[#E5DECE] text-[#D97706] mb-0.5">
                <Package className="w-3 h-3" />
              </div>
              <span className="text-[8px] uppercase tracking-wider text-[#7A747D] font-bold block truncate w-full">
                DEPOTS
              </span>
              <div className="w-full bg-[#E5DECE] h-1 rounded-full my-0.5 overflow-hidden">
                <div 
                  className="bg-[#D97706] h-full" 
                  style={{ width: totalRackets > 0 ? `${Math.min(100, Math.round((depotCount / totalRackets) * 100))}%` : '0%' }}
                />
              </div>
              <span className="font-mono-num text-[9px] font-bold text-[#1C191E]">{depotCount}</span>
            </div>

            {/* Box 3: Building */}
            <div className="p-1.5 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] flex flex-col items-center justify-center text-center">
              <div className="p-1 rounded bg-[#FFFFFF] border border-[#E5DECE] text-[#B31B24] mb-0.5">
                <Building2 className="w-3 h-3" />
              </div>
              <span className="text-[8px] uppercase tracking-wider text-[#7A747D] font-bold block truncate w-full">
                VENUES
              </span>
              <div className="w-full bg-[#E5DECE] h-1 rounded-full my-0.5 overflow-hidden">
                <div 
                  className="bg-[#B31B24] h-full" 
                  style={{ width: totalRackets > 0 ? `${Math.min(100, Math.round((venueCount / totalRackets) * 100))}%` : '0%' }}
                />
              </div>
              <span className="font-mono-num text-[9px] font-bold text-[#1C191E]">{venueCount}</span>
            </div>

            {/* Box 4: Crown */}
            <div className="p-1.5 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] flex flex-col items-center justify-center text-center">
              <div className="p-1 rounded bg-[#FFFFFF] border border-[#E5DECE] text-[#15803D] mb-0.5">
                <Crown className="w-3 h-3" />
              </div>
              <span className="text-[8px] uppercase tracking-wider text-[#7A747D] font-bold block truncate w-full">
                CAPOS
              </span>
              <div className="w-full bg-[#E5DECE] h-1 rounded-full my-0.5 overflow-hidden">
                <div 
                  className="bg-[#15803D] h-full" 
                  style={{ width: caposAssigned > 0 ? '100%' : '0%' }}
                />
              </div>
              <span className="font-mono-num text-[9px] font-bold text-[#1C191E]">{caposAssigned}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 mt-2 border-t border-[#EFEAE0] flex items-center justify-between text-[10px] text-[#7A747D]">
          <span>Territory Control Target</span>
          <span className="font-bold text-[#1C191E]">{completionPct}% Achieved</span>
        </div>
      </div>

      {/* 2. CARD 2: STRATEGIC PERKS */}
      <div className="command-card p-3 flex flex-col justify-between h-full">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-title text-xs font-bold uppercase tracking-wider text-[#1C191E]">
              STRATEGIC PERKS
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="font-mono-num font-bold text-xs text-[#1C191E]">
                {activeBonuses.length}/15
              </span>
            </div>
          </div>

          {/* Dynamic Perks list or Empty State */}
          {activeBonuses.length === 0 ? (
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] text-center flex flex-col items-center justify-center py-4 my-1">
              <Shield className="w-5 h-5 text-[#B31B24] mb-1.5 opacity-60" />
              <span className="font-serif-title text-xs font-bold text-[#1C191E]">لا توجد ميزات نشطة</span>
              <span className="text-[10px] text-[#7A747D] mt-0.5">
                أضف وسيطر على مقرات جديدة على الخريطة لتفعيل الميزات التكتيكية
              </span>
            </div>
          ) : (
            <div className="space-y-1.5">
              {activeBonuses.map((venue) => (
                <div 
                  key={venue.id}
                  onClick={() => onSelectRacket(venue)}
                  className="p-1.5 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] flex items-center justify-between hover:border-[#B31B24] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded bg-[#FFFFFF] border border-[#E5DECE] flex items-center justify-center text-[#B31B24] shrink-0">
                      <Crosshair className="w-3 h-3" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-[#1C191E] block font-serif-title leading-tight truncate">
                        {venue.name}
                      </span>
                      <span className="text-[8px] text-[#7A747D] block truncate">
                        {venue.strategicBonusText || 'Active front bonus'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono-num font-bold text-[#15803D] shrink-0">
                    ACTIVE
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-2 mt-2 border-t border-[#EFEAE0] flex items-center justify-between text-[10px] text-[#7A747D]">
          <span>Active Syndicate Boosts</span>
          <span className="font-bold text-[#15803D]">{activeBonuses.length} Active</span>
        </div>
      </div>

      {/* 3. CARD 3: REVENUE BREAKDOWN (MONTHLY / HOURLY) */}
      <div className="command-card p-3 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-serif-title text-xs font-bold uppercase tracking-wider text-[#1C191E]">
              REVENUE BREAKDOWN
            </h2>
            <span className="text-[9px] uppercase font-bold text-[#7A747D]">Hourly</span>
          </div>

          {/* Donut Chart + Legend */}
          <div className="flex items-center justify-between gap-2">
            {/* Radial Donut Graphic */}
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#EFEBE2"
                  strokeWidth="4"
                />
                {totalHourlyRevenue > 0 && (
                  <>
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#D97706"
                      strokeWidth="4"
                      strokeDasharray={`${extortPct + gamblingPct} 100`}
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#B31B24"
                      strokeWidth="4.5"
                      strokeDasharray={`${extortPct} 100`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />
                  </>
                )}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-mono-num text-[11px] font-extrabold text-[#1C191E] leading-tight">
                  ${totalHourlyRevenue > 0 ? (totalHourlyRevenue > 999 ? `${(totalHourlyRevenue / 1000).toFixed(0)}k` : totalHourlyRevenue) : '0'}
                </span>
                <span className="text-[7px] uppercase tracking-wider text-[#7A747D]">
                  /hr
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-0.5 text-[9px] flex-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[#554F59]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B31B24]" />
                  Extortion
                </span>
                <span className="font-mono-num font-bold text-[#1C191E]">{extortPct}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[#554F59]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                  Casinos
                </span>
                <span className="font-mono-num font-bold text-[#1C191E]">{gamblingPct}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[#554F59]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                  Logistics
                </span>
                <span className="font-mono-num font-bold text-[#1C191E]">{logisticsPct}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[#554F59]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9A94A0]" />
                  Other
                </span>
                <span className="font-mono-num font-bold text-[#1C191E]">{otherPct}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 mt-2 border-t border-[#EFEAE0] flex items-center justify-between text-[10px] text-[#7A747D]">
          <span>Net Inflow Status</span>
          <span className="font-bold text-[#1C191E]">
            {totalHourlyRevenue > 0 ? `+$${totalHourlyRevenue.toLocaleString()}/hr` : 'لا توجد تدفقات'}
          </span>
        </div>
      </div>

    </div>
  );
};
