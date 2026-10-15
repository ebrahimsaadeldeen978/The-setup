import React, { useState, useMemo } from 'react';
import { 
  X, 
  Vault, 
  HeartHandshake, 
  Target, 
  UserCheck, 
  FileCheck, 
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  Sparkles,
  Building2,
  Briefcase,
  FileText,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { VaultRecord, VaultCategory } from '../../types/dashboard';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  vaultRecords: VaultRecord[];
  onAddRecord: (record: VaultRecord) => void;
  onUpdateRecord: (record: VaultRecord) => void;
  onDeleteRecord: (recordId: string) => void;
  initialCategory?: VaultCategory;
}

interface IndicatorConfig {
  key: VaultCategory;
  title: string;
  englishTitle: string;
  shortLabel: string;
  badgeLabel: string;
  description: string;
  detailedMeaning: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  lightBg: string;
  borderColor: string;
  accentText: string;
  questionPrompt: string;
}

export const VAULT_INDICATORS: IndicatorConfig[] = [
  {
    key: 'relationships',
    title: 'العلاقات',
    englishTitle: 'Relationships & Network',
    shortLabel: 'علاقات عمل',
    badgeLabel: 'شبكة العلاقات',
    description: 'العلاقات التي جمعناها من الشغل بجميع أنواعها ومجالاتها المهنية.',
    detailedMeaning: 'يوثق هذا الأرشيف كافة العلاقات المهنية والشخصية التي بنيناها في سوق العمل؛ من هو الطرف، متى تم بناء العلاقة، وسياق التعارف والتواصل المستمر.',
    icon: HeartHandshake,
    color: '#0284C7', // Sky Blue
    lightBg: '#F0F9FF',
    borderColor: '#BAE6FD',
    accentText: 'text-[#0284C7]',
    questionPrompt: 'متى جمعنا هذه العلاقة ومن هو الطرف؟',
  },
  {
    key: 'target_leads',
    title: 'العملاء المستهدفين',
    englishTitle: 'Target Qualified Leads',
    shortLabel: 'مستهدفون',
    badgeLabel: 'فرص العرض',
    description: 'عدد العملاء المستهدفين المتاحين للعرض عليهم وتقديم مقترح قيمتنا.',
    detailedMeaning: 'يوثق هذا الأرشيف كل عميل مستهدف تم تحديده ودراسة احتياجه وأصبح متاحاً ومستعداً لنقدم له عرض القيمة المضافة لخدماتنا.',
    icon: Target,
    color: '#D97706', // Amber / Gold
    lightBg: '#FFFBEB',
    borderColor: '#FDE68A',
    accentText: 'text-[#D97706]',
    questionPrompt: 'متى استهدفنا هذا العميل وما هي القيمة المقترحة للعرض عليه؟',
  },
  {
    key: 'current_clients',
    title: 'العملاء الحاليين',
    englishTitle: 'Current / Pilot Clients',
    shortLabel: 'عملاء حاليون',
    badgeLabel: 'بداية العمل الفعلي',
    description: 'العملاء المستهدفين الذين تم تحويلهم لبداية العمل معهم في نموذج مبدئي أو مجاني (أول تعامل في الشغل).',
    detailedMeaning: 'يوثق هذا الأرشيف كل عميل مستهدف نجحنا في تحويله لبدء العمل الفعلي؛ متى بدأنا معه، وما هو النموذج المبدئي (PoC) أو المجاني المعتمد لأول تعامل.',
    icon: UserCheck,
    color: '#16A34A', // Emerald Green
    lightBg: '#F0FDF4',
    borderColor: '#BBF7D0',
    accentText: 'text-[#16A34A]',
    questionPrompt: 'متى بدأنا معه شغل فعلي وما هو نموذج التعامل الأولي؟',
  },
  {
    key: 'contracted',
    title: 'المتعاقدين',
    englishTitle: 'Contracted & Retained Clients',
    shortLabel: 'متعاقدون',
    badgeLabel: 'عقود موثقة',
    description: 'العملاء الذين جربونا مرة وحابين يشتغلوا معانا تاني سواء في نفس المشروع أو مشروع آخر فتعاقدوا معانا.',
    detailedMeaning: 'يوثق هذا الأرشيف قمة الثقة والنجاح؛ العملاء الذين خاضوا التجربة الأولى معنا وأكدوا رغبتهم في تجديد واستمرار العمل عبر إبرام عقود رسمية متجددة أو لمشاريع لاحقة.',
    icon: FileCheck,
    color: '#B31B24', // Crimson Brand
    lightBg: '#FEF2F2',
    borderColor: '#FECACA',
    accentText: 'text-[#B31B24]',
    questionPrompt: 'متى تحول إلى التعاقد وما هو المشروع أو الاتفاق المتجدد؟',
  },
];

export const VaultModal: React.FC<VaultModalProps> = ({
  isOpen,
  onClose,
  vaultRecords,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord,
  initialCategory = 'relationships',
}) => {
  const [activeCategory, setActiveCategory] = useState<VaultCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingRecord, setEditingRecord] = useState<VaultRecord | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formEntityType, setFormEntityType] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDescription, setFormDescription] = useState('');
  const [formEngagementModel, setFormEngagementModel] = useState('');
  const [formProjectOrDomain, setFormProjectOrDomain] = useState('');
  const [formOutcomeOrValue, setFormOutcomeOrValue] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Keep active category synced if initialCategory changes
  React.useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  // Counts for each indicator (uncapped, just counting items)
  const counts = useMemo(() => {
    return {
      relationships: vaultRecords.filter(r => r.category === 'relationships').length,
      target_leads: vaultRecords.filter(r => r.category === 'target_leads').length,
      current_clients: vaultRecords.filter(r => r.category === 'current_clients').length,
      contracted: vaultRecords.filter(r => r.category === 'contracted').length,
      total: vaultRecords.length,
    };
  }, [vaultRecords]);

  const activeConfig = useMemo(() => {
    return VAULT_INDICATORS.find(i => i.key === activeCategory) || VAULT_INDICATORS[0];
  }, [activeCategory]);

  // Filtered records for current active category
  const filteredRecords = useMemo(() => {
    return vaultRecords
      .filter(r => r.category === activeCategory)
      .filter(r => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          (r.projectOrDomain && r.projectOrDomain.toLowerCase().includes(q)) ||
          (r.entityType && r.entityType.toLowerCase().includes(q)) ||
          r.date.includes(q)
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [vaultRecords, activeCategory, searchQuery]);

  const handleOpenAddForm = () => {
    setEditingRecord(null);
    setFormTitle('');
    setFormEntityType('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormDescription('');
    setFormEngagementModel(
      activeCategory === 'relationships' ? 'علاقة عمل وتواصل مهني' :
      activeCategory === 'target_leads' ? 'عرض القيمة المقترحة (Pitch)' :
      activeCategory === 'current_clients' ? 'نموذج مبدئي تجريبي (PoC / Free Pilot)' :
      'عقد سنوي رسمي متجدد'
    );
    setFormProjectOrDomain('');
    setFormOutcomeOrValue('');
    setFormNotes('');
    setIsAddingNew(true);
  };

  const handleOpenEditForm = (record: VaultRecord) => {
    setEditingRecord(record);
    setFormTitle(record.title);
    setFormEntityType(record.entityType || '');
    setFormDate(record.date);
    setFormDescription(record.description);
    setFormEngagementModel(record.engagementModel || '');
    setFormProjectOrDomain(record.projectOrDomain || '');
    setFormOutcomeOrValue(record.outcomeOrValue || '');
    setFormNotes(record.notes || '');
    setIsAddingNew(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDate) return;

    if (editingRecord) {
      // Update
      const updated: VaultRecord = {
        ...editingRecord,
        title: formTitle.trim(),
        entityType: formEntityType.trim() || undefined,
        date: formDate,
        description: formDescription.trim(),
        engagementModel: formEngagementModel.trim() || undefined,
        projectOrDomain: formProjectOrDomain.trim() || undefined,
        outcomeOrValue: formOutcomeOrValue.trim() || undefined,
        notes: formNotes.trim() || undefined,
      };
      onUpdateRecord(updated);
    } else {
      // Create new
      const newRec: VaultRecord = {
        id: `vault-${activeCategory}-${Date.now()}`,
        category: activeCategory,
        title: formTitle.trim(),
        entityType: formEntityType.trim() || undefined,
        date: formDate,
        description: formDescription.trim(),
        engagementModel: formEngagementModel.trim() || undefined,
        projectOrDomain: formProjectOrDomain.trim() || undefined,
        outcomeOrValue: formOutcomeOrValue.trim() || undefined,
        notes: formNotes.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      onAddRecord(newRec);
    }

    setIsAddingNew(false);
    setEditingRecord(null);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      dir="rtl"
    >
      <div 
        className="w-full max-w-4xl bg-[#FFFFFF] border border-[#E2DACB] rounded-2xl shadow-2xl text-[#1C191E] max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ============================================================== */}
        {/* MODAL HEADER */}
        {/* ============================================================== */}
        <div className="bg-[#FAF8F5] border-b border-[#EFEAE0] px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E2DACB] shadow-xs flex items-center justify-center text-[#B31B24]">
              <Vault className="w-5 h-5 text-[#B31B24]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A747D]">
                  STRATEGIC ASSETS & REPOSITORY
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#EFEAE0] text-[#1C191E]">
                  مستودع الخزينة
                </span>
              </div>
              <h2 className="font-serif-title text-lg sm:text-xl font-bold text-[#1C191E] flex items-center gap-2">
                <span>Vault (الخزينة)</span>
                <span className="text-xs font-normal text-[#7A747D] font-sans">
                  — مؤشرات وأرشيف مسار العمل التراكمي
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#7A747D] hover:text-[#1C191E] hover:bg-[#EFEAE0] transition-colors cursor-pointer"
              title="إغلاق الخزينة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TOP: 4 UNCAPPED INDICATORS OVERVIEW CARDS (بدون حد أقصى) */}
        {/* ============================================================== */}
        <div className="p-4 sm:p-5 border-b border-[#EFEAE0] bg-[#FAF8F5]/50 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-bold text-[#7A747D] flex items-center gap-1.5">
              <span>المؤشرات الاستراتيجية الأربعة (عدادات مفتوحة تراكمية):</span>
              <span className="text-[10px] bg-[#EFEAE0] px-2 py-0.5 rounded-full text-[#1C191E] font-medium">
                إجمالي السجلات: {counts.total}
              </span>
            </div>
            <span className="text-[10px] text-[#7A747D]">
              اضغط على أي مؤشر لاستعراض تفاصيل وتاريخ عملياته الموثقة
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {VAULT_INDICATORS.map((ind) => {
              const IconComp = ind.icon;
              const count = counts[ind.key];
              const isSelected = activeCategory === ind.key;

              return (
                <div
                  key={ind.key}
                  onClick={() => {
                    setActiveCategory(ind.key);
                    setIsAddingNew(false);
                    setEditingRecord(null);
                  }}
                  className={`relative p-3 rounded-xl border text-right transition-all cursor-pointer group flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white shadow-md ring-2'
                      : 'bg-[#FFFFFF] hover:bg-[#FAF8F5] border-[#E5DECE]'
                  }`}
                  style={{
                    borderColor: isSelected ? ind.color : '#E5DECE',
                    boxShadow: isSelected ? `0 4px 14px ${ind.color}25` : undefined,
                  }}
                >
                  <div>
                    {/* Top row with icon & count */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
                        style={{ backgroundColor: ind.lightBg, color: ind.color, border: `1px solid ${ind.borderColor}` }}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="text-right">
                        <span 
                          className="font-mono-num text-xl sm:text-2xl font-black block leading-none"
                          style={{ color: ind.color }}
                        >
                          {count}
                        </span>
                      </div>
                    </div>

                    {/* Indicator Name */}
                    <h3 className="font-serif-title text-xs sm:text-sm font-bold text-[#1C191E] flex items-center gap-1">
                      <span>{ind.title}</span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ind.color }} />
                      )}
                    </h3>

                    <p className="text-[9.5px] text-[#7A747D] line-clamp-2 mt-0.5 leading-tight">
                      {ind.description}
                    </p>
                  </div>

                  {/* Bottom selection indicator */}
                  <div className="pt-2 mt-1 border-t border-[#EFEAE0] flex items-center justify-between text-[9px]">
                    <span className="text-[#7A747D] font-medium">
                      {count} {ind.shortLabel}
                    </span>
                    <span 
                      className={`font-bold transition-colors ${
                        isSelected ? ind.accentText : 'text-[#7A747D] group-hover:text-[#1C191E]'
                      }`}
                    >
                      {isSelected ? 'الأرشيف مفتوح ✓' : 'عرض الأرشيف ←'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* ACTIVE INDICATOR CONTEXT BANNER & ARCHIVE EXPLORER */}
        {/* ============================================================== */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-4">
          
          {/* Active Indicator Deep-dive Header */}
          <div 
            className="p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            style={{
              backgroundColor: activeConfig.lightBg,
              borderColor: activeConfig.borderColor,
            }}
          >
            <div className="flex items-start gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white shadow-xs"
                style={{ color: activeConfig.color, border: `1px solid ${activeConfig.borderColor}` }}
              >
                {React.createElement(activeConfig.icon, { className: 'w-5 h-5' })}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span 
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: activeConfig.color }}
                  >
                    أرشيف {activeConfig.title}
                  </span>
                  <span className="text-[10px] text-[#7A747D] font-medium font-mono-num">
                    مجموع العمليات: {filteredRecords.length}
                  </span>
                </div>
                <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#1C191E] mt-0.5">
                  الرقم ({counts[activeCategory]}) هو مجموع لـ: {activeConfig.title}
                </h3>
                <p className="text-xs text-[#4A454E] mt-0.5 max-w-2xl leading-relaxed">
                  {activeConfig.detailedMeaning}
                </p>
              </div>
            </div>

            {/* Top Action: Add to this indicator */}
            <div className="shrink-0 w-full sm:w-auto flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenAddForm}
                className="w-full sm:w-auto px-3.5 py-2 rounded-lg text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-transform hover:scale-[1.02] cursor-pointer"
                style={{ backgroundColor: activeConfig.color }}
              >
                <Plus className="w-4 h-4" />
                <span>+ تسجيل عملية جديدة</span>
              </button>
            </div>
          </div>

          {/* ADD / EDIT FORM (Inline Accordion) */}
          {isAddingNew && (
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] shadow-sm animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#EFEAE0] pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B31B24]" />
                  <h4 className="font-serif-title text-sm font-bold text-[#1C191E]">
                    {editingRecord ? `تعديل سجل في مؤشر: ${activeConfig.title}` : `تسجيل عملية جديدة في: ${activeConfig.title}`}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingRecord(null);
                  }}
                  className="p-1 rounded-md text-[#7A747D] hover:text-[#1C191E] hover:bg-[#EFEAE0] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1C191E] mb-1">
                      اسم الجهة / العميل / الشخص <span className="text-[#B31B24]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: شركة آفاق التقنية أو د. وليد"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] focus:outline-none focus:border-[#B31B24]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C191E] mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#B31B24]" />
                      <span>متى حدث ذلك؟ (تاريخ العملية) <span className="text-[#B31B24]">*</span></span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] font-mono-num focus:outline-none focus:border-[#B31B24]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C191E] mb-1">
                      تصنيف الكيان / نوع الجهة
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: قطاع خاص، جهة استشارية، فينتك..."
                      value={formEntityType}
                      onChange={(e) => setFormEntityType(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] focus:outline-none focus:border-[#B31B24]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1C191E] mb-1">
                      نموذج التعامل / طريقة التحويل
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: نموذج مبدئي (PoC)، نموذج مجاني، عقد سنوي..."
                      value={formEngagementModel}
                      onChange={(e) => setFormEngagementModel(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] focus:outline-none focus:border-[#B31B24]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C191E] mb-1">
                      المشروع أو مجال النشاط
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: تحليل البيانات، أتمتة العمليات، شراكة..."
                      value={formProjectOrDomain}
                      onChange={(e) => setFormProjectOrDomain(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] focus:outline-none focus:border-[#B31B24]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C191E] mb-1">
                    ماذا حدث بالتفصيل؟ (شرح العملية وسياق تسجيلها في هذا المؤشر) <span className="text-[#B31B24]">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="وضح كيف ومتى تمت هذه الخطوة وما بُني عليها..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] focus:outline-none focus:border-[#B31B24]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1C191E] mb-1">
                      الأثر أو القيمة المتحققة
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: فتح قناة تواصل استراتيجية، بدء التشغيل التجريبي..."
                      value={formOutcomeOrValue}
                      onChange={(e) => setFormOutcomeOrValue(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] focus:outline-none focus:border-[#B31B24]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C191E] mb-1">
                      ملاحظات إضافية
                    </label>
                    <input
                      type="text"
                      placeholder="أي ملحوظات مهمة للتتبع المستقبلي"
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] focus:outline-none focus:border-[#B31B24]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EFEAE0]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNew(false);
                      setEditingRecord(null);
                    }}
                    className="px-3.5 py-1.5 rounded-lg border border-[#E5DECE] bg-white text-xs text-[#7A747D] hover:bg-[#FAF8F5] cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-1.5 rounded-lg text-white font-bold text-xs shadow-xs cursor-pointer"
                    style={{ backgroundColor: activeConfig.color }}
                  >
                    {editingRecord ? 'حفظ التعديلات' : 'حفظ في الأرشيف والخزينة'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SEARCH & FILTER BAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 text-[#7A747D] absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث في أرشيف السجلات أو التاريخ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-8 pl-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] text-xs text-[#1C191E] focus:outline-none focus:border-[#B31B24]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7A747D] hover:text-[#1C191E] text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="text-[11px] text-[#7A747D] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>مرتب زمنياً من الأحدث إلى الأقدم وفق تاريخ كل عملية</span>
            </div>
          </div>

          {/* CHRONOLOGICAL ARCHIVE CARDS LIST */}
          <div className="space-y-3">
            {filteredRecords.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-[#FAF8F5] border border-[#E5DECE] flex flex-col items-center justify-center">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-2"
                  style={{ backgroundColor: activeConfig.lightBg, color: activeConfig.color }}
                >
                  {React.createElement(activeConfig.icon, { className: 'w-6 h-6' })}
                </div>
                <h4 className="font-serif-title text-sm font-bold text-[#1C191E]">
                  لا توجد سجلات مسجلة في هذا الأرشيف بعد
                </h4>
                <p className="text-xs text-[#7A747D] mt-1 max-w-sm">
                  {searchQuery 
                    ? 'لم يتم العثور على نتائج تطابق بحثك. جرّب كلمات بحث مختلفة.' 
                    : `ابدأ بتسجيل أول عملية لتوثيق متى وتفاصيل أول ${activeConfig.shortLabel}.`}
                </p>
                {!searchQuery && (
                  <button
                    type="button"
                    onClick={handleOpenAddForm}
                    className="mt-3 px-4 py-1.5 rounded-lg text-white font-bold text-xs shadow-xs cursor-pointer"
                    style={{ backgroundColor: activeConfig.color }}
                  >
                    + إضافة أول سجل الآن
                  </button>
                )}
              </div>
            ) : (
              filteredRecords.map((record, index) => {
                return (
                  <div
                    key={record.id}
                    className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#E5DECE] hover:border-[#D4AF37] transition-all shadow-xs space-y-2.5 relative group"
                  >
                    {/* Top Row: Date Badge & Title */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EFEAE0] pb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-[#FAF8F5] border border-[#E2DACB] font-mono-num font-bold text-[10px] flex items-center justify-center text-[#7A747D]">
                          #{filteredRecords.length - index}
                        </span>

                        <div>
                          <h4 className="font-serif-title text-sm font-bold text-[#1C191E] flex items-center gap-2">
                            <span>{record.title}</span>
                            {record.entityType && (
                              <span className="text-[9px] font-normal px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E5DECE] text-[#7A747D]">
                                {record.entityType}
                              </span>
                            )}
                          </h4>
                        </div>
                      </div>

                      {/* Date Badge: "متى حصل ده" */}
                      <div className="flex items-center gap-2">
                        <div 
                          className="px-2.5 py-1 rounded-lg font-mono-num text-[11px] font-bold flex items-center gap-1.5 shadow-2xs"
                          style={{
                            backgroundColor: activeConfig.lightBg,
                            color: activeConfig.color,
                            border: `1px solid ${activeConfig.borderColor}`,
                          }}
                          title="تاريخ حدوث العملية"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>حدث في: {record.date}</span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleOpenEditForm(record)}
                            className="p-1.5 rounded-lg text-[#7A747D] hover:text-[#B31B24] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                            title="تعديل السجل"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteRecord(record.id)}
                            className="p-1.5 rounded-lg text-[#7A747D] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="حذف السجل"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* What Happened (Description) */}
                    <div>
                      <p className="text-xs text-[#2A2530] leading-relaxed">
                        {record.description}
                      </p>
                    </div>

                    {/* Meta pills / details */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                      {record.engagementModel && (
                        <div className="px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E5DECE] text-[#4A454E] flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-[#7A747D]" />
                          <span>النموذج: <strong className="text-[#1C191E]">{record.engagementModel}</strong></span>
                        </div>
                      )}

                      {record.projectOrDomain && (
                        <div className="px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E5DECE] text-[#4A454E] flex items-center gap-1">
                          <Tag className="w-3 h-3 text-[#7A747D]" />
                          <span>المشروع: <strong className="text-[#1C191E]">{record.projectOrDomain}</strong></span>
                        </div>
                      )}

                      {record.outcomeOrValue && (
                        <div className="px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E5DECE] text-[#4A454E] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>الأثر: <strong className="text-[#1C191E]">{record.outcomeOrValue}</strong></span>
                        </div>
                      )}

                      {record.notes && (
                        <div className="px-2 py-0.5 rounded-md bg-[#FEF9C3] border border-[#FDE047] text-[#854D0E] flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>{record.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* FOOTER */}
        {/* ============================================================== */}
        <div className="bg-[#FAF8F5] border-t border-[#EFEAE0] px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="text-xs text-[#7A747D] flex items-center gap-2">
            <span className="font-bold text-[#1C191E]">Vault (الخزينة)</span>
            <span>•</span>
            <span>جميع المؤشرات الأربعة تعمل كعدادات تراكمية مفتوحة تحفظ تاريخ كل عملية بدقة</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-1.5 rounded-lg border border-[#E5DECE] bg-white text-xs font-bold text-[#1C191E] hover:bg-[#FAF8F5] transition-colors cursor-pointer shadow-xs"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
