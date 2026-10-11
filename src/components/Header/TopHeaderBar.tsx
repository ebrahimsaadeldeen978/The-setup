import React, { useState } from 'react';
import { 
  Crown, 
  TrendingUp, 
  Volume2, 
  VolumeX, 
  Grid,
  ShieldAlert,
  Plus,
  X,
  Building,
  Landmark,
  Palmtree,
  Shield,
  Star,
  Anchor,
  Navigation,
  Compass,
  Crosshair,
  MapPin,
  Trash2
} from 'lucide-react';
import { 
  TerritoryRegion, 
  EmpireFinancials, 
  ConsigliereAlert,
  CitySector,
  SectorIconType 
} from '../../types/dashboard';

interface TopHeaderBarProps {
  currentRegion: TerritoryRegion;
  sectors: CitySector[];
  onSelectSector: (sector: CitySector) => void;
  onAddSector: (newSector: CitySector) => void;
  onDeleteSector: (sectorId: string) => void;
  financials: EmpireFinancials;
  alerts: ConsigliereAlert[];
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenHierarchy: () => void;
}

// Icon renderer
export const renderSectorIcon = (iconName: SectorIconType, className = "w-3.5 h-3.5") => {
  switch (iconName) {
    case 'Landmark': return <Landmark className={className} />;
    case 'Building': return <Building className={className} />;
    case 'Palmtree': return <Palmtree className={className} />;
    case 'Crown': return <Crown className={className} />;
    case 'Shield': return <Shield className={className} />;
    case 'Star': return <Star className={className} />;
    case 'Anchor': return <Anchor className={className} />;
    case 'Navigation': return <Navigation className={className} />;
    case 'Compass': return <Compass className={className} />;
    case 'Crosshair': return <Crosshair className={className} />;
    default: return <Landmark className={className} />;
  }
};

const AVAILABLE_ICONS: { type: SectorIconType; label: string }[] = [
  { type: 'Landmark', label: 'صرح / معلم' },
  { type: 'Building', label: 'مبنى / أبراج' },
  { type: 'Crown', label: 'تاج سيادي' },
  { type: 'Shield', label: 'درع تكتيكي' },
  { type: 'Palmtree', label: 'ساحل / نخيل' },
  { type: 'Star', label: 'نجمة القيادة' },
  { type: 'Anchor', label: 'ميناء / مرسى' },
  { type: 'Navigation', label: 'ملاحة' },
  { type: 'Crosshair', label: 'هدف تكتيكي' },
  { type: 'Compass', label: 'بوصلة' },
];

// Quick presets for convenience
const PRESET_CITIES = [
  { name: 'القاهرة (Cairo)', lat: 30.0444, lng: 31.2357, icon: 'Landmark' as SectorIconType },
  { name: 'الإسكندرية (Alex)', lat: 31.2001, lng: 29.9187, icon: 'Anchor' as SectorIconType },
  { name: 'طنطا (Tanta)', lat: 30.7865, lng: 31.0004, icon: 'Building' as SectorIconType },
  { name: 'بورسعيد (Port Said)', lat: 31.2653, lng: 32.3019, icon: 'Anchor' as SectorIconType },
  { name: 'دبي (Dubai)', lat: 25.2048, lng: 55.2708, icon: 'Building' as SectorIconType },
  { name: 'روما (Rome)', lat: 41.9028, lng: 12.4964, icon: 'Crown' as SectorIconType },
];

export const TopHeaderBar: React.FC<TopHeaderBarProps> = ({
  currentRegion,
  sectors,
  onSelectSector,
  onAddSector,
  onDeleteSector,
  financials,
  isMuted,
  onToggleMute,
  onOpenHierarchy
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [cityName, setCityName] = useState('');
  const [cityLat, setCityLat] = useState('30.0444');
  const [cityLng, setCityLng] = useState('31.2357');
  const [selectedIcon, setSelectedIcon] = useState<SectorIconType>('Building');

  const handleCreateSector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityName.trim()) return;

    const lat = parseFloat(cityLat);
    const lng = parseFloat(cityLng);
    if (isNaN(lat) || isNaN(lng)) return;

    const newSector: CitySector = {
      id: `sector-${Date.now()}`,
      name: cityName.trim(),
      lat: lat,
      lng: lng,
      zoom: 13,
      iconName: selectedIcon,
    };

    onAddSector(newSector);
    setCityName('');
    setIsAddModalOpen(false);
  };

  const handleApplyPreset = (preset: typeof PRESET_CITIES[0]) => {
    setCityName(preset.name);
    setCityLat(String(preset.lat));
    setCityLng(String(preset.lng));
    setSelectedIcon(preset.icon);
  };

  return (
    <header className="w-full bg-[#FFFFFF] border-b border-[#E2DACB] shadow-[0_2px_8px_rgba(0,0,0,0.03)] z-40">
      {/* Top Primary Bar */}
      <div className="max-w-[1920px] mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Valenti Syndicate Shield Crest & Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div 
            onClick={onOpenHierarchy}
            className="w-10 h-10 rounded-xl bg-[#F4F1EA] border border-[#E2DACB] flex items-center justify-center cursor-pointer shadow-sm hover:border-[#B31B24] transition-all group"
            title="Inspect Supreme Command"
          >
            <div className="relative flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-[#B31B24]" />
              <Crown className="w-3 h-3 text-[#B31B24] absolute -top-1.5" />
            </div>
          </div>

          <div>
            <h1 className="font-serif-title text-base sm:text-lg font-bold tracking-wide text-[#1C191E] uppercase leading-tight">
              VALENTI SYNDICATE
            </h1>
            <p className="text-[10px] tracking-wider text-[#6E6773] uppercase font-semibold">
              STRATEGY &amp; OPERATIONS COMMAND
            </p>
          </div>
        </div>

        {/* Center: DYNAMIC CITY SECTORS (Starting with Mansoura, plus Add City Box) */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {/* Rendered Sectors */}
            {sectors.map((sector) => {
              const isActive = currentRegion === sector.id;
              const isMansoura = sector.id === 'mansoura';

              return (
                <div
                  key={sector.id}
                  className={`flex items-center rounded-lg text-xs font-bold tracking-wider font-serif-title transition-all ${
                    isActive
                      ? 'bg-[#F7D5D8] border border-[#E49BA3] text-[#B31B24] shadow-xs'
                      : 'bg-[#F9F7F2] hover:bg-[#EFEBE2] border border-[#E2DACB] text-[#554F59]'
                  }`}
                >
                  <button
                    onClick={() => onSelectSector(sector)}
                    className="flex items-center gap-1.5 px-3 py-1.5 cursor-pointer"
                  >
                    <span className={isActive ? 'text-[#B31B24]' : 'text-[#7A747D]'}>
                      {renderSectorIcon(sector.iconName)}
                    </span>
                    <span className="text-[11px] uppercase whitespace-nowrap">
                      {sector.name}
                    </span>
                  </button>

                  {/* Delete button for user-added cities (cannot delete default Mansoura) */}
                  {!isMansoura && (
                    <button
                      onClick={() => onDeleteSector(sector.id)}
                      className="pr-2 pl-0.5 text-[#7A747D] hover:text-[#B31B24] transition-colors cursor-pointer"
                      title={`حذف قطاع ${sector.name}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}

            {/* MANDATORY USER FEATURE: Box to add new cities and pick an icon */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[#B31B24] bg-[#FDF8F8] hover:bg-[#F7D5D8] text-[#B31B24] text-xs font-bold tracking-wider font-serif-title transition-all cursor-pointer shadow-xs"
              title="إضافة مدينة أو قطاع جديد"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="text-[11px] uppercase">+ إضافة مدينة</span>
            </button>
          </div>

        {/* Right: 3 Metric Cards + Dots Menu */}
        <div className="flex items-center gap-2.5 ml-auto lg:ml-0">
          
          {/* Total Wealth Card */}
          <div className="bg-[#FFFFFF] border border-[#E2DACB] rounded-xl px-3 py-1 min-w-[110px] flex flex-col items-start shadow-xs">
            <span className="text-[8px] uppercase tracking-wider text-[#7A747D] font-bold">
              TOTAL WEALTH
            </span>
            <span className="text-sm font-bold font-mono-num text-[#1C191E]">
              $ {financials.totalWealth.toLocaleString()}
            </span>
          </div>

          {/* Net Hourly Revenue Card */}
          <div className="bg-[#FFFFFF] border border-[#E2DACB] rounded-xl px-3 py-1 min-w-[120px] flex flex-col items-start shadow-xs">
            <span className="text-[8px] uppercase tracking-wider text-[#7A747D] font-bold">
              NET HOURLY REVENUE
            </span>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#15803D]" />
              <span className="text-sm font-bold font-mono-num text-[#1C191E]">
                $ {financials.netHourlyRevenue.toLocaleString()}<span className="text-[10px] text-[#7A747D] font-normal">/hr</span>
              </span>
            </div>
          </div>

          {/* Territory Control Card */}
          <div className="bg-[#FFFFFF] border border-[#E2DACB] rounded-xl px-3 py-1 min-w-[110px] flex flex-col items-start shadow-xs">
            <span className="text-[8px] uppercase tracking-wider text-[#7A747D] font-bold">
              TERRITORY CONTROL
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
              <span className="text-sm font-bold font-mono-num text-[#1C191E]">
                {financials.territoryControlPercentage}%
              </span>
            </div>
          </div>

          {/* Auxiliary Options */}
          <div className="flex items-center gap-1 pl-1">
            <button
              onClick={onToggleMute}
              className="p-1.5 rounded-lg border border-[#E2DACB] bg-[#FFFFFF] hover:bg-[#F5F2EB] text-[#7A747D] transition-colors cursor-pointer"
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#B31B24]" />}
            </button>
            <button
              onClick={onOpenHierarchy}
              className="p-1.5 rounded-lg border border-[#E2DACB] bg-[#FFFFFF] hover:bg-[#F5F2EB] text-[#7A747D] transition-colors cursor-pointer"
              title="Command Options"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* ============================================================== */}
      {/* MODAL: ADD NEW CITY / SECTOR WITH CUSTOM ICON PICKER           */}
      {/* ============================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#FFFFFF] border border-[#E2DACB] rounded-2xl p-5 shadow-2xl text-[#1C191E]" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#EFEAE0] pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#B31B24]" />
                <h3 className="font-serif-title font-bold text-sm text-[#1C191E]">
                  إضافة قطاع / مدينة جديدة للسيطرة
                </h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#7A747D] hover:text-[#1C191E] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSector} className="space-y-3.5 text-xs">
              {/* City Name Input */}
              <div>
                <span className="text-[10px] text-[#7A747D] uppercase font-bold block mb-1">
                  اسم المدينة / القطاع
                </span>
                <input
                  type="text"
                  required
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  placeholder="مثال: القاهرة، الإسكندرية، طنطا، روما..."
                  className="w-full p-2 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] outline-none font-medium text-xs text-[#1C191E]"
                />
              </div>

              {/* Coordinates: Lat and Lng */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-[#7A747D] uppercase font-bold block mb-1">
                    خط العرض (Latitude)
                  </span>
                  <input
                    type="text"
                    required
                    value={cityLat}
                    onChange={(e) => setCityLat(e.target.value)}
                    placeholder="30.0444"
                    className="w-full p-2 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] outline-none font-mono-num font-bold text-xs text-[#1C191E]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#7A747D] uppercase font-bold block mb-1">
                    خط الطول (Longitude)
                  </span>
                  <input
                    type="text"
                    required
                    value={cityLng}
                    onChange={(e) => setCityLng(e.target.value)}
                    placeholder="31.2357"
                    className="w-full p-2 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] outline-none font-mono-num font-bold text-xs text-[#1C191E]"
                  />
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <span className="text-[10px] text-[#7A747D] uppercase font-bold block mb-1">
                  مدن جاهزة للاختيار السريع:
                </span>
                <div className="flex flex-wrap gap-1">
                  {PRESET_CITIES.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="px-2 py-1 rounded bg-[#FAF8F5] hover:bg-[#EFEAE0] border border-[#E5DECE] text-[10px] text-[#1C191E] font-medium transition-colors cursor-pointer"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* MANDATORY USER FEATURE: ICON PICKER */}
              <div>
                <span className="text-[10px] text-[#7A747D] uppercase font-bold block mb-1.5">
                  حدد أيقونة للمدينة (Choose Sector Icon):
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {AVAILABLE_ICONS.map((item) => {
                    const isSelected = selectedIcon === item.type;
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => setSelectedIcon(item.type)}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#F7D5D8] border-[#B31B24] text-[#B31B24] ring-1 ring-[#B31B24]'
                            : 'bg-[#FAF8F5] border-[#E5DECE] text-[#554F59] hover:bg-[#EFEAE0]'
                        }`}
                      >
                        {renderSectorIcon(item.type, "w-4 h-4")}
                        <span className="text-[8px] font-bold truncate max-w-full">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#EFEAE0]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] text-xs font-bold uppercase text-[#554F59] cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-[#B31B24] hover:bg-[#C7232D] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>تأكيد وإضافة المدينة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
