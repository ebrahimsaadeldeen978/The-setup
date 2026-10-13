import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Palette, 
  FileText, 
  BookmarkPlus, 
  Check, 
  Eye, 
  Camera, 
  Upload, 
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { 
  RacketNode, 
  TerritoryRegion, 
  MapLocationCategory, 
  LocationImportance, 
  LocationActivityStatus,
  BusinessModelCanvas
} from '../../types/dashboard';
import { 
  STRATEGIC_PIN_TYPES, 
  StrategicPinTypeKey,
  getPinTypeMeta,
  getSavedPinColors,
  saveCustomPinColor,
  removeSavedPinColor,
  renderPinIcon,
  TacticalMapPinGraphic,
  DEFAULT_PRESET_COLORS
} from '../StrategyCanvas/TacticalPinRegistry';

interface AddMapLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLocation: (newNode: RacketNode) => void;
  onUpdateLocation?: (updatedNode: RacketNode) => void;
  region: TerritoryRegion;
  initialLat?: number;
  initialLng?: number;
  editNode?: RacketNode | null;
}

export const AddMapLocationModal: React.FC<AddMapLocationModalProps> = ({
  isOpen,
  onClose,
  onAddLocation,
  onUpdateLocation,
  region,
  initialLat = 31.0409,
  initialLng = 31.3785,
  editNode = null,
}) => {
  const isEditing = !!editNode;

  // 1. Core Pin Type selection (the 7 requested types)
  const [selectedPinType, setSelectedPinType] = useState<StrategicPinTypeKey>('lead');
  
  // 2. Form states
  const [name, setName] = useState('');
  const [importance, setImportance] = useState<LocationImportance>('high');
  const [activityStatus, setActivityStatus] = useState<LocationActivityStatus>('potential');
  const [hexColor, setHexColor] = useState('#E11D48');
  const [savedColors, setSavedColors] = useState<string[]>([]);
  const [customIcon, setCustomIcon] = useState('UserPlus');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [lastInteractionDate, setLastInteractionDate] = useState(new Date().toISOString().split('T')[0]);
  const [addressDetails, setAddressDetails] = useState('');
  const [lat, setLat] = useState(initialLat.toFixed(6));
  const [lng, setLng] = useState(initialLng.toFixed(6));

  // Business Model Canvas toggle & state (if client / potential client)
  const isClientType = selectedPinType === 'lead' || selectedPinType === 'client';
  const [showBmcFields, setShowBmcFields] = useState(false);
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

  // Populate form on open or when editNode changes
  useEffect(() => {
    if (isOpen) {
      setSavedColors(getSavedPinColors());

      if (editNode) {
        setName(editNode.name || '');
        setSelectedPinType((editNode.pinType as StrategicPinTypeKey) || 'lead');
        setImportance(editNode.locationImportance || 'high');
        setActivityStatus(editNode.activityStatus || 'potential');
        setHexColor(editNode.hexColor || '#E11D48');
        setCustomIcon(editNode.customIcon || 'UserPlus');
        setNotes(editNode.notes || '');
        setImageUrl(editNode.imageUrl || '');
        setLastInteractionDate(editNode.lastInteractionDate || new Date().toISOString().split('T')[0]);
        setAddressDetails(editNode.addressDetails || '');
        setLat(editNode.lat ? editNode.lat.toFixed(6) : initialLat.toFixed(6));
        setLng(editNode.lng ? editNode.lng.toFixed(6) : initialLng.toFixed(6));
        if (editNode.businessCanvas) {
          setBmc(editNode.businessCanvas);
          setShowBmcFields(true);
        } else {
          setShowBmcFields(false);
        }
      } else {
        setName('');
        setSelectedPinType('lead');
        setImportance('high');
        setActivityStatus('potential');
        setHexColor('#E11D48');
        setCustomIcon('UserPlus');
        setNotes('');
        setImageUrl('');
        setLastInteractionDate(new Date().toISOString().split('T')[0]);
        setAddressDetails('');
        setLat(initialLat.toFixed(6));
        setLng(initialLng.toFixed(6));
        setShowBmcFields(false);
      }
    }
  }, [isOpen, editNode, initialLat, initialLng]);

  // Sync default color & icon when switching pin type (if creating)
  const handleSelectPinType = (typeKey: StrategicPinTypeKey) => {
    setSelectedPinType(typeKey);
    const meta = getPinTypeMeta(typeKey);
    if (meta) {
      // If user hasn't customized or is adding new
      if (!isEditing) {
        setHexColor(meta.defaultColor);
      }
      setCustomIcon(meta.iconName);
    }
  };

  // Save current hex color into saved list
  const handleSaveCurrentColor = () => {
    if (!hexColor) return;
    const updated = saveCustomPinColor(hexColor);
    setSavedColors(updated);
  };

  // Delete a saved color
  const handleDeleteSavedColor = (e: React.MouseEvent, colorToDelete: string) => {
    e.stopPropagation();
    const updated = removeSavedPinColor(colorToDelete);
    setSavedColors(updated);
  };

  // Handle image upload from file system
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Automatically persist the chosen color for future selections!
    saveCustomPinColor(hexColor);

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    const pinMeta = getPinTypeMeta(selectedPinType);

    if (isEditing && editNode && onUpdateLocation) {
      const updatedNode: RacketNode = {
        ...editNode,
        name: name.trim(),
        lat: isNaN(parsedLat) ? editNode.lat : parsedLat,
        lng: isNaN(parsedLng) ? editNode.lng : parsedLng,
        pinType: selectedPinType,
        locationCategory: (selectedPinType === 'lead' ? 'potential-client' : selectedPinType === 'client' ? 'current-client' : 'meeting-visit-site') as MapLocationCategory,
        locationImportance: importance,
        activityStatus: activityStatus,
        hexColor: hexColor,
        customIcon: customIcon || pinMeta?.iconName || 'MapPin',
        lastInteractionDate: lastInteractionDate,
        addressDetails: addressDetails.trim(),
        notes: notes.trim(),
        imageUrl: imageUrl.trim() || undefined,
        controllingSyndicate: pinMeta?.shortTitle || editNode.controllingSyndicate,
        ringCategory: pinMeta?.shortTitle || editNode.ringCategory,
        strategicBonusText: notes.trim() || pinMeta?.meaning || editNode.strategicBonusText,
        businessCanvas: isClientType && showBmcFields ? bmc : undefined,
      };

      onUpdateLocation(updatedNode);
      onClose();
      return;
    }

    const newNode: RacketNode = {
      id: `loc-pin-${Date.now()}`,
      name: name.trim(),
      type: selectedPinType === 'bussiness food' ? 'Diner' : selectedPinType === 'event' ? 'Casino' : 'Warehouse',
      region: region,
      x: 50,
      y: 50,
      lat: isNaN(parsedLat) ? initialLat : parsedLat,
      lng: isNaN(parsedLng) ? initialLng : parsedLng,
      status: 'owned',
      controllingSyndicate: pinMeta?.shortTitle || 'دبوس تكتيكي',
      hourlyIncome: 0,
      defenseLevel: 100,
      maxDefense: 100,
      guardCount: 0,
      maxGuards: 0,
      ringCategory: pinMeta?.shortTitle || 'نقطة ميدانية',
      strategicBonusText: notes.trim() || pinMeta?.meaning || 'دبوس مسجل على الخريطة',
      underAttack: false,
      smokeEffect: false,

      // Custom fields
      pinType: selectedPinType,
      locationCategory: (selectedPinType === 'lead' ? 'potential-client' : selectedPinType === 'client' ? 'current-client' : 'meeting-visit-site') as MapLocationCategory,
      locationImportance: importance,
      activityStatus: activityStatus,
      hexColor: hexColor,
      customIcon: customIcon || pinMeta?.iconName || 'MapPin',
      lastInteractionDate: lastInteractionDate,
      addressDetails: addressDetails.trim(),
      notes: notes.trim(),
      imageUrl: imageUrl.trim() || undefined,
      businessCanvas: isClientType && showBmcFields ? bmc : undefined,
    };

    onAddLocation(newNode);
    onClose();
  };

  if (!isOpen) return null;

  const currentPinMeta = getPinTypeMeta(selectedPinType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-[#FFFFFF] border border-[#E2DACB] rounded-2xl shadow-2xl text-[#1C191E] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="bg-[#FAF8F5] border-b border-[#EFEAE0] px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: hexColor }}
            >
              {renderPinIcon(customIcon, "w-4 h-4 text-white")}
            </div>
            <div>
              <h3 className="font-serif-title font-bold text-sm text-[#1C191E] flex items-center gap-1.5">
                <span>{isEditing ? 'تعديل تفاصيل الدبوس' : 'إضافة دبوس جديد على الخريطة'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EFEAE0] text-[#7A747D]">
                  شكل دبوس تكتيكي
                </span>
              </h3>
              <p className="text-[10px] text-[#7A747D]">
                {isEditing ? 'تعديل الاسم والنوع واللون والصورة والملاحظات' : 'تحديد نوع الدبوس من التصنيفات الـ 7 وحفظ اللون والملاحظات'}
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

        {/* Live Pin Preview Banner */}
        <div className="bg-gradient-to-r from-[#FAF8F5] via-[#FFFFFF] to-[#FAF8F5] border-b border-[#EFEAE0] px-4 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <TacticalMapPinGraphic
              color={hexColor}
              iconName={customIcon}
              size="md"
              isSelected={true}
            />
            <div>
              <div className="text-[10px] font-bold text-[#7A747D] uppercase">
                معاينة شكل الدبوس الحية على الخريطة
              </div>
              <div className="font-serif-title font-bold text-xs text-[#1C191E]">
                {name.trim() || 'اسم المكان / الدبوس'}
              </div>
              <div className="text-[9px] text-[#554F59] flex items-center gap-1.5">
                <span className="font-bold" style={{ color: hexColor }}>
                  {currentPinMeta?.label} ({currentPinMeta?.shortTitle})
                </span>
                {notes.trim() && (
                  <span className="text-[#7A747D] truncate max-w-[220px]">
                    &bull; 📝 {notes.trim()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[10px] text-[#7A747D] bg-[#FFFFFF] border border-[#E2DACB] rounded-lg px-2.5 py-1">
            <Eye className="w-3.5 h-3.5 text-[#B31B24]" />
            <span>سيظهر بهذا الشكل والأيقونة داخله</span>
          </div>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto custom-scrollbar space-y-4 text-xs">
          
          {/* 1. Pin Type Selector: 7 Core Types requested by user */}
          <div>
            <label className="text-[11px] text-[#1C191E] font-bold block mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#B31B24]" />
                <span>اختر نوع الدبوس (الأيقونة والوصف الداخلي) *</span>
              </span>
              <span className="text-[10px] text-[#7A747D] font-normal">
                {currentPinMeta?.meaning}
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {STRATEGIC_PIN_TYPES.map((pt) => {
                const isSelected = selectedPinType === pt.key;
                return (
                  <button
                    key={pt.key}
                    type="button"
                    onClick={() => handleSelectPinType(pt.key)}
                    className={`p-2 rounded-xl border text-right transition-all flex items-start gap-2.5 cursor-pointer ${
                      isSelected 
                        ? 'bg-[#FAF8F5] border-[#B31B24] ring-2 ring-[#B31B24]/20 shadow-xs' 
                        : 'bg-white border-[#E5DECE] hover:border-[#D5CDBC] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-xs"
                      style={{ 
                        backgroundColor: isSelected ? hexColor : pt.defaultColor,
                        color: '#FFFFFF'
                      }}
                    >
                      {renderPinIcon(pt.iconName, "w-4 h-4 text-white")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-serif-title font-bold text-xs text-[#1C191E] truncate">
                          {pt.label}
                        </span>
                        {isSelected && (
                          <span className="w-3.5 h-3.5 rounded-full bg-[#B31B24] text-white flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                      <p className="text-[9.5px] text-[#7A747D] leading-tight mt-0.5 line-clamp-2">
                        {pt.meaning}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Color Selection: Hex Code + Color Picker + Saved Colors Palette */}
          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#1C191E] font-bold flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#B31B24]" />
                <span>لون الدبوس المخصص (هيكسا كود Hex Code وحفظ الألوان)</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span 
                  className="w-4 h-4 rounded-full border border-black/20 shadow-xs" 
                  style={{ backgroundColor: hexColor }} 
                />
                <span className="font-mono-num font-bold text-xs text-[#1C191E]">
                  {hexColor}
                </span>
              </div>
            </div>

            {/* Inputs: Color picker + Hex text input + Save color button */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white border border-[#E5DECE] rounded-lg p-1">
                <input 
                  type="color" 
                  value={hexColor} 
                  onChange={(e) => setHexColor(e.target.value)}
                  className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent p-0"
                  title="اختر أي لون تريده بحرية من عجلة الألوان"
                />
                <input 
                  type="text" 
                  value={hexColor} 
                  onChange={(e) => setHexColor(e.target.value)}
                  placeholder="#E11D48"
                  maxLength={7}
                  className="w-24 p-1 rounded bg-transparent font-mono-num text-xs font-bold text-[#1C191E] uppercase outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveCurrentColor}
                className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#EFEAE0] border border-[#E5DECE] text-[#1C191E] font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                title="احفظ هذا اللون للمرات القادمة"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-[#B31B24]" />
                <span>حفظ هذا اللون للمرات القادمة</span>
              </button>
            </div>

            {/* Saved Colors & Presets Palette */}
            <div>
              <span className="text-[10px] text-[#7A747D] font-bold block mb-1">
                الألوان المحفوظة والمستخدمة (اضغط لاختيار اللون مباشرة دون إدخال الهيكسا كود):
              </span>
              <div className="flex items-center gap-1.5 flex-wrap bg-white p-2 rounded-lg border border-[#E5DECE]">
                {savedColors.map((colorHex) => {
                  const isCurrent = hexColor.toLowerCase() === colorHex.toLowerCase();
                  return (
                    <div 
                      key={colorHex}
                      className="relative group"
                    >
                      <button
                        type="button"
                        onClick={() => setHexColor(colorHex)}
                        style={{ backgroundColor: colorHex }}
                        title={`لون محفوظ: ${colorHex}`}
                        className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                          isCurrent 
                            ? 'border-[#1C191E] scale-110 ring-2 ring-[#B31B24]' 
                            : 'border-black/15 hover:scale-110'
                        }`}
                      />
                      {!DEFAULT_PRESET_COLORS.includes(colorHex) && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSavedColor(e, colorHex)}
                          title="حذف من المحفوظات"
                          className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 text-white rounded-full text-[8px] hidden group-hover:flex items-center justify-center cursor-pointer shadow-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Photo of the place (صورة تعبيرية لشكل المكان) */}
          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] space-y-2">
            <span className="text-[11px] text-[#1C191E] font-bold flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#B31B24]" />
              <span>صورة تعبيرية لشكل المكان (تظهر في أعلى بطاقة الدبوس)</span>
            </span>

            {imageUrl ? (
              <div className="relative w-full h-28 rounded-lg overflow-hidden border border-[#E5DECE] bg-black/10 group">
                <img 
                  src={imageUrl} 
                  alt="معاينة صورة المكان" 
                  className="w-full h-full object-cover" 
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-md text-[10px] flex items-center gap-1 shadow-md cursor-pointer transition-colors"
                  title="حذف الصورة"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>حذف الصورة</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="p-3 rounded-lg border-2 border-dashed border-[#D5CDBC] hover:border-[#B31B24] bg-white hover:bg-[#FAF8F5] flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-[#B31B24]" />
                  <span className="font-bold text-[10.5px] text-[#1C191E]">رفع صورة من الجهاز</span>
                  <span className="text-[8.5px] text-[#7A747D]">اختر صورة تعبر عن شكل المكان</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageFileChange} 
                  />
                </label>

                <div className="p-2.5 rounded-lg border border-[#E5DECE] bg-white flex flex-col justify-center">
                  <span className="text-[9.5px] font-bold text-[#7A747D] block mb-1">
                    أو ضع رابط صورة مباشر (URL):
                  </span>
                  <input 
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full p-1.5 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[10px] text-[#1C191E] outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 4. Name & Related Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-[#7A747D] uppercase font-bold block mb-1">
                اسم المكان / العميل / الفعالية *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: شركة الأفق للاستشارات / اجتماع صفقة Q3"
                className="w-full p-2 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] outline-none font-medium text-xs text-[#1C191E] focus:border-[#B31B24]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#7A747D] uppercase font-bold block mb-1">
                العنوان / الحي / النطاق الجغرافي
              </label>
              <input
                type="text"
                value={addressDetails}
                onChange={(e) => setAddressDetails(e.target.value)}
                placeholder="مثال: شارع المشاية، المنصورة"
                className="w-full p-2 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] outline-none font-medium text-xs text-[#1C191E] focus:border-[#B31B24]"
              />
            </div>
          </div>

          {/* 5. Prominent Note for the Pin */}
          <div>
            <label className="text-[10px] text-[#1C191E] uppercase font-bold block mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-[#B31B24]" />
              <span>ملاحظة متعلقة بالدبوس (تظهر مع تفاصيل المكان والدبوس على الخريطة)</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="اكتب هنا الملاحظة الخاصة بهذا الدبوس، هدف اللقاء، نقاط الاتفاق أو تفاصيل المتابعة..."
              className="w-full p-2 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] outline-none text-xs text-[#1C191E] focus:border-[#B31B24]"
            />
          </div>

          {/* 6. Coordinates & Priority */}
          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] space-y-2">
            <span className="text-[10px] text-[#7A747D] uppercase font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#B31B24]" />
              <span>إحداثيات الدبوس على الخريطة</span>
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
                <span className="text-[9px] text-[#7A747D] block mb-0.5">درجة الأهمية</span>
                <select
                  value={importance}
                  onChange={(e) => setImportance(e.target.value as LocationImportance)}
                  className="w-full p-1.5 rounded bg-white border border-[#E5DECE] outline-none text-xs text-[#1C191E]"
                >
                  <option value="high">أهمية قصوى (High Priority)</option>
                  <option value="medium">أهمية متوسطة (Medium)</option>
                  <option value="low">أهمية اعتيادية (Low)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 7. Optional Business Model Canvas for Clients */}
          {isClientType && (
            <div className="border border-[#E5DECE] rounded-xl overflow-hidden bg-[#FAF8F5]">
              <div 
                onClick={() => setShowBmcFields(!showBmcFields)}
                className="p-2.5 bg-[#FAF8F5] flex items-center justify-between cursor-pointer hover:bg-[#EFEAE0] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#B31B24]" />
                  <span className="font-serif-title font-bold text-xs text-[#1C191E]">
                    نموذج العمل التجاري (Business Model Canvas) للعميل (اختياري)
                  </span>
                </div>
                <span className="text-[10px] text-[#7A747D] font-bold">
                  {showBmcFields ? '▲ إخفاء المخطط' : '▼ فتح تفاصيل نموذج العمل'}
                </span>
              </div>

              {showBmcFields && (
                <div className="p-3 bg-white border-t border-[#E5DECE] space-y-2.5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <span className="text-[9px] font-bold text-[#1C191E] block mb-0.5">عروض القيمة (Value Proposition)</span>
                      <textarea
                        rows={2}
                        value={bmc.valuePropositions}
                        onChange={(e) => setBmc({ ...bmc, valuePropositions: e.target.value })}
                        placeholder="ما هي القيمة التي يحتاجها العميل؟"
                        className="w-full p-1.5 rounded border border-[#E5DECE] text-[10px]"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-[#1C191E] block mb-0.5">شرائح العملاء (Customer Segments)</span>
                      <textarea
                        rows={2}
                        value={bmc.customerSegments}
                        onChange={(e) => setBmc({ ...bmc, customerSegments: e.target.value })}
                        placeholder="فئة العميل وسوقه المستهدف..."
                        className="w-full p-1.5 rounded border border-[#E5DECE] text-[10px]"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-[#1C191E] block mb-0.5">العلاقة مع العميل (Relationships)</span>
                      <textarea
                        rows={2}
                        value={bmc.customerRelationships}
                        onChange={(e) => setBmc({ ...bmc, customerRelationships: e.target.value })}
                        placeholder="طبيعة العلاقة والتواصل..."
                        className="w-full p-1.5 rounded border border-[#E5DECE] text-[10px]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#EFEAE0]">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] hover:bg-[#EFEAE0] text-xs font-bold text-[#554F59] transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="flex-1 py-2 px-4 rounded-lg bg-[#B31B24] hover:bg-[#C7232D] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'حفظ التعديلات' : 'تأكيد وإضافة الدبوس على الخريطة'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
