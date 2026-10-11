import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  MapPin, 
  Users, 
  UserCheck, 
  Building2, 
  Calendar, 
  Coffee, 
  Briefcase, 
  Clock, 
  Tag, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Palette,
  Flag,
  FileText
} from 'lucide-react';
import { 
  RacketNode, 
  TerritoryRegion, 
  MapLocationCategory, 
  LocationImportance, 
  LocationActivityStatus,
  BusinessModelCanvas
} from '../../types/dashboard';
import { ICON_REGISTRY, CATEGORY_CONFIG, PRESET_COLORS, renderDynamicIcon } from './MapIconRegistry';

interface AddMapLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLocation: (newNode: RacketNode) => void;
  region: TerritoryRegion;
  initialLat?: number;
  initialLng?: number;
}

export const AddMapLocationModal: React.FC<AddMapLocationModalProps> = ({
  isOpen,
  onClose,
  onAddLocation,
  region,
  initialLat = 31.0409,
  initialLng = 31.3785,
}) => {
  if (!isOpen) return null;

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MapLocationCategory>('potential-client');
  const [importance, setImportance] = useState<LocationImportance>('high');
  const [activityStatus, setActivityStatus] = useState<LocationActivityStatus>('potential');
  const [hexColor, setHexColor] = useState('#B31B24');
  const [customIcon, setCustomIcon] = useState('Building2');
  const [selectedIconTab, setSelectedIconTab] = useState<'business' | 'events' | 'meetings' | 'work' | 'general'>('business');
  const [lastInteractionDate, setLastInteractionDate] = useState(new Date().toISOString().split('T')[0]);
  const [addressDetails, setAddressDetails] = useState('');
  const [notes, setNotes] = useState('');
  const [lat, setLat] = useState(initialLat.toFixed(6));
  const [lng, setLng] = useState(initialLng.toFixed(6));

  // Business Model Canvas toggle & state (if client / potential client)
  const isClientType = category === 'potential-client' || category === 'current-client';
  const [showBmcFields, setShowBmcFields] = useState(isClientType);
  const [bmc, setBmc] = useState<BusinessModelCanvas>({
    keyPartners: '',
    keyActivities: '',
    keyResources: '',
    valuePropositions: '',
    customerRelationships: '',
    channels: '',
    customerSegments: '',
    costStructure: '',
    revenueStreams: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    const newNode: RacketNode = {
      id: `loc-${Date.now()}`,
      name: name.trim(),
      type: category === 'cafe-coworking' ? 'Diner' : category === 'conference-event' ? 'Casino' : 'Warehouse',
      region: region,
      x: 50,
      y: 50,
      lat: isNaN(parsedLat) ? initialLat : parsedLat,
      lng: isNaN(parsedLng) ? initialLng : parsedLng,
      status: 'owned',
      controllingSyndicate: isClientType ? 'عميل مستهدف' : 'شريك / موقع استراتيجي',
      hourlyIncome: 0,
      defenseLevel: 100,
      maxDefense: 100,
      guardCount: 0,
      maxGuards: 0,
      ringCategory: CATEGORY_CONFIG[category].label,
      strategicBonusText: notes || 'نقطة مسجلة على الخريطة التكتيكية',
      underAttack: false,
      smokeEffect: false,

      // Custom fields
      locationCategory: category,
      locationImportance: importance,
      activityStatus: activityStatus,
      hexColor: hexColor,
      customIcon: customIcon,
      lastInteractionDate: lastInteractionDate,
      addressDetails: addressDetails.trim(),
      notes: notes.trim(),
      businessCanvas: isClientType ? bmc : undefined,
    };

    onAddLocation(newNode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-[#FFFFFF] border border-[#E2DACB] rounded-2xl shadow-2xl text-[#1C191E] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#FAF8F5] border-b border-[#EFEAE0] px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: hexColor }}
            >
              {renderDynamicIcon(customIcon, "w-4 h-4")}
            </div>
            <div>
              <h3 className="font-serif-title font-bold text-sm text-[#1C191E]">
                إضافة نقطة / نشاط جديد على الخريطة
              </h3>
              <p className="text-[10px] text-[#7A747D]">
                أتحرك فين، ومين موجود في كل مكان (عملاء، موردون، فعاليات، كافيهات)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-md text-[#7A747D] hover:text-[#1C191E] hover:bg-[#EFEAE0] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto custom-scrollbar space-y-4 text-xs">
          
          {/* 1. Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-[#7A747D] uppercase font-bold block mb-1">
                اسم المكان / النشاط التجاري *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: شركة النيل للحلول الرقمية / كافيه ديب ريبابليك"
                className="w-full p-2 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] outline-none font-medium text-xs text-[#1C191E] focus:border-[#B31B24]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#7A747D] uppercase font-bold block mb-1">
                نوع النقطة *
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const val = e.target.value as MapLocationCategory;
                  setCategory(val);
                  setHexColor(CATEGORY_CONFIG[val].defaultColor);
                  if (val === 'potential-client' || val === 'current-client') {
                    setShowBmcFields(true);
                  }
                }}
                className="w-full p-2 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] outline-none font-medium text-xs text-[#1C191E] focus:border-[#B31B24]"
              >
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Importance, Status & Last Interaction Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-[#7A747D] uppercase font-bold block mb-1">
                درجة الأهمية
              </label>
              <select
                value={importance}
                onChange={(e) => setImportance(e.target.value as LocationImportance)}
                className="w-full p-2 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] outline-none font-medium text-xs text-[#1C191E] focus:border-[#B31B24]"
              >
                <option value="high">أهمية قصوى (High Priority)</option>
                <option value="medium">أهمية متوسطة (Medium)</option>
                <option value="low">أهمية اعتيادية (Low)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#7A747D] uppercase font-bold block mb-1">
                حالة النشاط / المتابعة
              </label>
              <select
                value={activityStatus}
                onChange={(e) => setActivityStatus(e.target.value as LocationActivityStatus)}
                className="w-full p-2 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] outline-none font-medium text-xs text-[#1C191E] focus:border-[#B31B24]"
              >
                <option value="potential">فرصة محتملة</option>
                <option value="active">نشط / قيد المتابعة</option>
                <option value="scheduled">مجدول / محدد له موعد</option>
                <option value="completed">مكتمل / تم اللقاء</option>
                <option value="dormant">خامل / مؤجل</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#7A747D] uppercase font-bold block mb-1">
                تاريخ آخر تفاعل
              </label>
              <input
                type="date"
                value={lastInteractionDate}
                onChange={(e) => setLastInteractionDate(e.target.value)}
                className="w-full p-2 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] outline-none font-medium text-xs text-[#1C191E] focus:border-[#B31B24]"
              />
            </div>
          </div>

          {/* 3. Coordinates & Location Details */}
          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] space-y-2">
            <span className="text-[10px] text-[#7A747D] uppercase font-bold flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-[#B31B24]" />
              <span>الموقع الجغرافي والإحداثيات الدقيقة</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-[9px] text-[#7A747D] block mb-0.5">خط العرض (Latitude)</span>
                <input
                  type="text"
                  required
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="31.0409"
                  className="w-full p-1.5 rounded bg-white border border-[#E5DECE] outline-none font-mono-num text-xs text-[#1C191E]"
                />
              </div>
              <div>
                <span className="text-[9px] text-[#7A747D] block mb-0.5">خط الطول (Longitude)</span>
                <input
                  type="text"
                  required
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  placeholder="31.3785"
                  className="w-full p-1.5 rounded bg-white border border-[#E5DECE] outline-none font-mono-num text-xs text-[#1C191E]"
                />
              </div>
              <div>
                <span className="text-[9px] text-[#7A747D] block mb-0.5">العنوان / المنطقة</span>
                <input
                  type="text"
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                  placeholder="شارع المشاية، المنصورة"
                  className="w-full p-1.5 rounded bg-white border border-[#E5DECE] outline-none text-xs text-[#1C191E]"
                />
              </div>
            </div>
          </div>

          {/* 4. Custom Hex Color Picker (براح كامل مع هيكسا كود) */}
          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#7A747D] uppercase font-bold flex items-center gap-1.5">
                <Palette className="w-3 h-3 text-[#B31B24]" />
                <span>تحديد لون العلامة (براح كامل بالهيكسا كود Hex Code)</span>
              </span>
              <div className="flex items-center gap-2">
                <span 
                  className="w-4 h-4 rounded-full border border-black/20 shadow-xs" 
                  style={{ backgroundColor: hexColor }} 
                />
                <span className="font-mono-num font-bold text-xs text-[#1C191E]">
                  {hexColor}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                <input 
                  type="color" 
                  value={hexColor} 
                  onChange={(e) => setHexColor(e.target.value)}
                  className="w-8 h-8 rounded border border-[#E5DECE] cursor-pointer bg-white p-0.5"
                  title="اختر أي لون تريده بحرية"
                />
                <input 
                  type="text"
                  value={hexColor}
                  onChange={(e) => setHexColor(e.target.value)}
                  placeholder="#B31B24"
                  maxLength={7}
                  className="w-24 p-1.5 rounded bg-white border border-[#E5DECE] font-mono-num text-xs font-bold text-[#1C191E] uppercase"
                />
              </div>

              {/* Quick Preset Swatches */}
              <div className="flex items-center gap-1 flex-wrap">
                {PRESET_COLORS.map((c) => (
                  <button
                    type="button"
                    key={c.hex}
                    onClick={() => setHexColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    title={c.label}
                    className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                      hexColor.toLowerCase() === c.hex.toLowerCase() 
                        ? 'border-[#1C191E] scale-110 ring-2 ring-[#B31B24]' 
                        : 'border-black/10 hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 5. Comprehensive Icon Browser by Domain */}
          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#7A747D] uppercase font-bold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#B31B24]" />
                <span>استعراض واختيار أيقونة النقطة (مشاريع، صناعات، إيفنتات، مقابلات، عمل)</span>
              </span>
              <span className="text-[10px] font-bold text-[#B31B24]">
                المختارة: {customIcon}
              </span>
            </div>

            {/* Icon Category Tabs */}
            <div className="flex items-center gap-1 border-b border-[#E5DECE] pb-1 overflow-x-auto">
              {(['business', 'events', 'meetings', 'work', 'general'] as const).map((tabKey) => {
                const labels = {
                  business: 'المشاريع والصناعات',
                  events: 'الفعاليات والإيفنتات',
                  meetings: 'المقابلات والاجتماعات',
                  work: 'العمل والإنتاجية',
                  general: 'أماكن عامة وكافيهات'
                };
                return (
                  <button
                    key={tabKey}
                    type="button"
                    onClick={() => setSelectedIconTab(tabKey)}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      selectedIconTab === tabKey 
                        ? 'bg-[#B31B24] text-white shadow-xs' 
                        : 'bg-white hover:bg-[#EFEAE0] text-[#554F59] border border-[#E5DECE]'
                    }`}
                  >
                    {labels[tabKey]}
                  </button>
                );
              })}
            </div>

            {/* Icons Grid for active tab */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5 max-h-36 overflow-y-auto p-1 bg-white rounded-lg border border-[#E5DECE]">
              {ICON_REGISTRY.filter(item => item.category === selectedIconTab).map((item) => {
                const isSelected = customIcon === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setCustomIcon(item.name)}
                    className={`p-1.5 rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer text-center ${
                      isSelected 
                        ? 'bg-[#F7D5D8] border border-[#E89EAA] text-[#B31B24] ring-1 ring-[#B31B24]' 
                        : 'hover:bg-[#FAF8F5] border border-transparent hover:border-[#E5DECE] text-[#554F59]'
                    }`}
                    title={item.label}
                  >
                    {renderDynamicIcon(item.name, "w-4 h-4")}
                    <span className="text-[8px] truncate w-full font-serif-title">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Notes & Strategy */}
          <div>
            <label className="text-[10px] text-[#7A747D] uppercase font-bold block mb-1">
              ملاحظات وتفاصيل استراتيجية
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="سجل أية تفاصيل خاصة بالزيارة أو الهدف من التحرك إلى هنا..."
              className="w-full p-2 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] outline-none text-xs text-[#1C191E]"
            />
          </div>

          {/* 7. Business Model Canvas (For Clients / Potential Clients) */}
          {isClientType && (
            <div className="border border-[#E5DECE] rounded-xl overflow-hidden bg-[#FAF8F5]">
              <div 
                onClick={() => setShowBmcFields(!showBmcFields)}
                className="p-2.5 bg-[#FAF8F5] flex items-center justify-between cursor-pointer hover:bg-[#EFEAE0] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#B31B24]" />
                  <span className="font-serif-title font-bold text-xs text-[#1C191E]">
                    مخطط نموذج العمل التجاري (Business Model Canvas) للعميل
                  </span>
                </div>
                <span className="text-[10px] text-[#7A747D] font-bold">
                  {showBmcFields ? '▲ إخفاء المخطط' : '▼ تعبئة مخطط نموذج العمل'}
                </span>
              </div>

              {showBmcFields && (
                <div className="p-3 bg-white border-t border-[#E5DECE] space-y-2.5">
                  <p className="text-[9px] text-[#7A747D]">
                    يظهر هذا المخطط حصرياً عند الضغط على العميل في الخريطة لتحليل وفهم نشاطه وأقسامه بدقة.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <span className="text-[9px] font-bold text-[#1C191E] block mb-0.5">عروض القيمة (Value Proposition)</span>
                      <textarea
                        rows={2}
                        value={bmc.valuePropositions}
                        onChange={(e) => setBmc({ ...bmc, valuePropositions: e.target.value })}
                        placeholder="ما القيمة التي يقدمها لزبائنه؟"
                        className="w-full p-1.5 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[10px]"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-[#1C191E] block mb-0.5">شرائح العملاء (Customer Segments)</span>
                      <textarea
                        rows={2}
                        value={bmc.customerSegments}
                        onChange={(e) => setBmc({ ...bmc, customerSegments: e.target.value })}
                        placeholder="من هم عملاؤه؟"
                        className="w-full p-1.5 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[10px]"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-[#1C191E] block mb-0.5">قنوات التواصل والتوزيع (Channels)</span>
                      <textarea
                        rows={2}
                        value={bmc.channels}
                        onChange={(e) => setBmc({ ...bmc, channels: e.target.value })}
                        placeholder="المتاجر، المنصات، نقاط البيع"
                        className="w-full p-1.5 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[10px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <span className="text-[9px] font-bold text-[#1C191E] block mb-0.5">الأنشطة والموارد الرئيسية (Activities & Resources)</span>
                      <textarea
                        rows={2}
                        value={bmc.keyActivities}
                        onChange={(e) => setBmc({ ...bmc, keyActivities: e.target.value })}
                        placeholder="الإنتاج، التسويق، المنظومة، المواد"
                        className="w-full p-1.5 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[10px]"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-[#1C191E] block mb-0.5">الشركاء الرئيسيون (Key Partners)</span>
                      <textarea
                        rows={2}
                        value={bmc.keyPartners}
                        onChange={(e) => setBmc({ ...bmc, keyPartners: e.target.value })}
                        placeholder="الموردون، الشركاء اللوجستيون، البنوك"
                        className="w-full p-1.5 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[10px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <span className="text-[9px] font-bold text-[#1C191E] block mb-0.5">مصادر الإيرادات (Revenue Streams)</span>
                      <input
                        type="text"
                        value={bmc.revenueStreams}
                        onChange={(e) => setBmc({ ...bmc, revenueStreams: e.target.value })}
                        placeholder="مبيعات مباشرة، اشتراكات، صيانة"
                        className="w-full p-1.5 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[10px]"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-[#1C191E] block mb-0.5">هيكل التكاليف (Cost Structure)</span>
                      <input
                        type="text"
                        value={bmc.costStructure}
                        onChange={(e) => setBmc({ ...bmc, costStructure: e.target.value })}
                        placeholder="إيجارات، مرتبات، توريد خامات"
                        className="w-full p-1.5 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[10px]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#EFEAE0]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] text-xs font-bold uppercase text-[#554F59] hover:bg-[#EFEAE0] transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-[#B31B24] hover:bg-[#C7232D] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة النقطة إلى الخريطة</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
