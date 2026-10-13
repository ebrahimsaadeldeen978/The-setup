import React, { useState } from 'react';
import { 
  X, 
  User, 
  Building, 
  Phone, 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2,
  Send,
  MessageSquare,
  Briefcase
} from 'lucide-react';
import { 
  RelationshipContact, 
  RelationshipRole, 
  RelationshipStatus 
} from '../../types/dashboard';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: RelationshipContact | null;
  onUpdateContact: (contact: RelationshipContact) => void;
  onDeleteContact: (contactId: string) => void;
  onAddContact: (contact: RelationshipContact) => void;
  isCreateMode?: boolean;
}

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  contact,
  onUpdateContact,
  onDeleteContact,
  onAddContact,
  isCreateMode = false,
}) => {
  const [isEditing, setIsEditing] = useState(isCreateMode || !contact);

  // Form Fields
  const [name, setName] = useState(contact?.name || '');
  const [organization, setOrganization] = useState(contact?.organization || '');
  const [roleType, setRoleType] = useState<RelationshipRole>(contact?.roleType || 'potential-client');
  const [relationshipStatus, setRelationshipStatus] = useState<RelationshipStatus>(contact?.relationshipStatus || 'initial-contact');
  const [projectOrDeal, setProjectOrDeal] = useState(contact?.projectOrDeal || '');
  const [lastContactDate, setLastContactDate] = useState(contact?.lastContactDate || new Date().toISOString().split('T')[0]);
  const [lastContactResult, setLastContactResult] = useState(contact?.lastContactResult || '');
  const [nextStep, setNextStep] = useState(contact?.nextStep || '');
  const [nextStepDate, setNextStepDate] = useState(contact?.nextStepDate || '');
  const [newLogNotes, setNewLogNotes] = useState('');
  const [newLogOutcome, setNewLogOutcome] = useState('');

  const getRoleBadge = (role: RelationshipRole) => {
    switch (role) {
      case 'potential-client': return 'عميل محتمل';
      case 'active-client': return 'عميل حالي';
      case 'supplier': return 'مورد';
      case 'potential-partner': return 'شريك محتمل';
      case 'advisor': return 'مستشار / موجه';
      default: return 'أخرى';
    }
  };

  const getStatusBadge = (status: RelationshipStatus) => {
    switch (status) {
      case 'initial-contact': return { label: 'تواصل أولي', color: 'bg-[#DBEAFE] text-[#2563EB] border-[#BFDBFE]' };
      case 'needs-analysis': return { label: 'تحليل احتياج', color: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]' };
      case 'active-deal': return { label: 'صفقة / مشروع قائم', color: 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]' };
      case 'nurturing': return { label: 'متابعة وبناء ثقة', color: 'bg-[#EDE9FE] text-[#7C3AED] border-[#DDD6FE]' };
      case 'dormant': return { label: 'خامل', color: 'bg-[#F4F1EA] text-[#7A747D] border-[#E2DACB]' };
      default: return { label: status, color: 'bg-[#F4F1EA] text-[#554F59] border-[#E5DECE]' };
    }
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const initials = name
      .trim()
      .split(' ')
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase() || 'م';

    if (isCreateMode || !contact) {
      const newContact: RelationshipContact = {
        id: `contact-${Date.now()}`,
        name: name.trim(),
        organization: organization.trim() || 'جهة عامة',
        roleType,
        relationshipStatus,
        projectOrDeal: projectOrDeal.trim(),
        lastContactDate,
        lastContactResult: lastContactResult.trim(),
        nextStep: nextStep.trim(),
        nextStepDate,
        avatarInitials: initials,
        interactionsLog: lastContactResult ? [
          {
            id: `log-${Date.now()}`,
            date: lastContactDate,
            notes: 'تسجيل أولي للعلاقة وتواصل استكشافي',
            outcome: lastContactResult.trim(),
          }
        ] : [],
      };
      onAddContact(newContact);
      onClose();
    } else {
      const updated: RelationshipContact = {
        ...contact,
        name: name.trim(),
        organization: organization.trim(),
        roleType,
        relationshipStatus,
        projectOrDeal: projectOrDeal.trim(),
        lastContactDate,
        lastContactResult: lastContactResult.trim(),
        nextStep: nextStep.trim(),
        nextStepDate,
        avatarInitials: initials,
      };
      onUpdateContact(updated);
      setIsEditing(false);
    }
  };

  const handleAddInteractionLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact || !newLogNotes.trim()) return;

    const newLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      notes: newLogNotes.trim(),
      outcome: newLogOutcome.trim() || 'تم التوثيق',
    };

    const updated: RelationshipContact = {
      ...contact,
      lastContactDate: newLog.date,
      lastContactResult: newLog.outcome,
      interactionsLog: [newLog, ...(contact.interactionsLog || [])],
    };

    onUpdateContact(updated);
    setNewLogNotes('');
    setNewLogOutcome('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-[#FFFFFF] border border-[#E2DACB] rounded-2xl p-5 shadow-2xl text-[#1C191E] max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EFEAE0] pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#F7D5D8] border border-[#E89EAA] flex items-center justify-center font-serif-title font-bold text-sm text-[#B31B24]">
              {contact?.avatarInitials || (name ? name[0] : 'ع')}
            </div>
            <div>
              <span className="text-[10px] text-[#B31B24] uppercase tracking-wider font-mono-num font-bold">
                {isCreateMode ? 'إضافة علاقة مهنية جديدة' : 'ملف الشريك أو العميل (DOSSIER)'}
              </span>
              <h2 className="font-serif-title text-lg font-bold text-[#1C191E]">
                {contact?.name || name || 'سجل جديد'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {!isCreateMode && contact && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded-lg text-[#7A747D] hover:text-[#B31B24] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
                title="تعديل البيانات"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#7A747D] hover:text-[#1C191E] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Edit or Create Form */}
        {(isEditing || isCreateMode) ? (
          <form onSubmit={handleSaveContact} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">الاسم بالكامل *</label>
                <input
                  type="text"
                  placeholder="مثال: م. أحمد عبد العزيز"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">الجهة أو النشاط *</label>
                <input
                  type="text"
                  placeholder="مثال: شركة الدلتا للتوزيع"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">نوع العلاقة والدور *</label>
                <select
                  value={roleType}
                  onChange={(e) => setRoleType(e.target.value as RelationshipRole)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                >
                  <option value="potential-client">عميل محتمل</option>
                  <option value="active-client">عميل حالي</option>
                  <option value="supplier">مورد</option>
                  <option value="potential-partner">شريك محتمل</option>
                  <option value="advisor">مستشار / خبير</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">حالة العلاقة الحالية *</label>
                <select
                  value={relationshipStatus}
                  onChange={(e) => setRelationshipStatus(e.target.value as RelationshipStatus)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                >
                  <option value="initial-contact">تواصل أولي</option>
                  <option value="needs-analysis">تحليل احتياج</option>
                  <option value="active-deal">صفقة / مشروع قائم</option>
                  <option value="nurturing">متابعة وبناء ثقة</option>
                  <option value="dormant">خامل</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">المشروع أو النشاط المرتبط</label>
              <input
                type="text"
                placeholder="مثال: مشروع ميكنة فواتير التوريد"
                value={projectOrDeal}
                onChange={(e) => setProjectOrDeal(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">تاريخ آخر تواصل</label>
                <input
                  type="date"
                  value={lastContactDate}
                  onChange={(e) => setLastContactDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">نتيجة آخر تواصل</label>
                <input
                  type="text"
                  placeholder="أبدى اهتماماً، تم الاتفاق على عرض..."
                  value={lastContactResult}
                  onChange={(e) => setLastContactResult(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">الخطوة التالية المطلوبة</label>
                <input
                  type="text"
                  placeholder="إرسال مقترح العمل..."
                  value={nextStep}
                  onChange={(e) => setNextStep(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">موعد الخطوة التالية</label>
                <input
                  type="date"
                  value={nextStepDate}
                  onChange={(e) => setNextStepDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              {!isCreateMode && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#E5DECE] bg-[#FFFFFF] text-xs text-[#7A747D] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  إلغاء التعديل
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#B31B24] text-white text-xs font-bold hover:bg-[#990000] cursor-pointer"
              >
                {isCreateMode ? 'إضافة جهة الاتصال' : 'حفظ التحديثات'}
              </button>
            </div>
          </form>
        ) : contact ? (
          <div className="space-y-4">
            {/* Quick Cards Info */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DECE]">
                <span className="text-[10px] uppercase font-bold text-[#7A747D] block">الدور والجهة</span>
                <span className="font-bold text-[#1C191E] block mt-0.5">{contact.organization}</span>
                <span className="text-[10px] text-[#B31B24] font-semibold">{getRoleBadge(contact.roleType)}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DECE]">
                <span className="text-[10px] uppercase font-bold text-[#7A747D] block">حالة العلاقة</span>
                <div className="mt-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(contact.relationshipStatus).color}`}>
                    {getStatusBadge(contact.relationshipStatus).label}
                  </span>
                </div>
                <span className="text-[9px] text-[#7A747D] block mt-1">مشروع: {contact.projectOrDeal || 'غير محدد'}</span>
              </div>
            </div>

            {/* Next Step & Last Contact */}
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-serif-title uppercase text-[11px] text-[#1C191E] font-bold">
                  خطة المتابعة والتواصل
                </span>
                <span className="text-[10px] text-[#7A747D]">
                  آخر تواصل: {contact.lastContactDate || 'غير مسجل'}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-[#FFFFFF] border border-[#E5DECE]">
                <span className="text-[#7A747D] text-[10px] block">نتيجة آخر تواصل:</span>
                <span className="font-semibold text-[#1C191E]">{contact.lastContactResult || 'لا توجد نتيجة مسجلة'}</span>
              </div>

              <div className="p-2 rounded-lg bg-[#FFFFFF] border border-[#E5DECE]">
                <span className="text-[#7A747D] text-[10px] block">الخطوة التالية المطلوبة:</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#B31B24]">{contact.nextStep || 'لم تُحدد بعد'}</span>
                  {contact.nextStepDate && (
                    <span className="font-mono-num text-[10px] text-[#7A747D]">{contact.nextStepDate}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Interaction Log Input */}
            <form onSubmit={handleAddInteractionLog} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] space-y-2 text-xs">
              <span className="font-serif-title uppercase text-[11px] text-[#1C191E] font-bold block">
                تسجيل تفاعل أو تواصل جديد
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="ملاحظات المحادثة أو الزيارة..."
                  value={newLogNotes}
                  onChange={(e) => setNewLogNotes(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                />
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="النتيجة أو القرار..."
                    value={newLogOutcome}
                    onChange={(e) => setNewLogOutcome(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-[#B31B24] text-white font-bold hover:bg-[#990000] cursor-pointer"
                  >
                    تسجيل
                  </button>
                </div>
              </div>
            </form>

            {/* History Log */}
            {contact.interactionsLog && contact.interactionsLog.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[#7A747D] block">سجل التفاعلات والتواصل</span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
                  {contact.interactionsLog.map((log) => (
                    <div key={log.id} className="p-2 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] text-xs flex items-center justify-between">
                      <div>
                        <span className="text-[#1C191E] font-semibold block">{log.notes}</span>
                        <span className="text-[10px] text-[#15803D]">{log.outcome}</span>
                      </div>
                      <span className="font-mono-num text-[10px] text-[#7A747D]">{log.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  onDeleteContact(contact.id);
                  onClose();
                }}
                className="px-3 py-2 rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] border border-[#FECACA] text-[#DC2626] text-xs font-bold transition-colors cursor-pointer"
              >
                حذف السجل
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EFEAE0] border border-[#E5DECE] text-[#1C191E] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
              >
                إغلاق
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
