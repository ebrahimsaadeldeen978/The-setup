import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Calendar, 
  Clock, 
  Trash2, 
  Edit3, 
  CheckCircle2,
  Briefcase,
  MapPin,
  Camera,
  Share2,
  MessageCircle,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Award,
  ExternalLink,
  Copy,
  Check,
  Building,
  Heart
} from 'lucide-react';
import { RelationshipContact } from '../../types/dashboard';
import { compressImage } from '../../utils/storageUtils';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: RelationshipContact | null;
  onUpdateContact: (contact: RelationshipContact) => void;
  onDeleteContact: (contactId: string) => void;
  onAddContact: (contact: RelationshipContact) => void;
  isCreateMode?: boolean;
  selectedLocation?: import('../../types/dashboard').RacketNode | null;
}

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  contact,
  onUpdateContact,
  onDeleteContact,
  onAddContact,
  isCreateMode = false,
  selectedLocation = null,
}) => {
  const [isEditing, setIsEditing] = useState(isCreateMode || !contact);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Form Fields State
  const [photoUrl, setPhotoUrl] = useState<string>(contact?.photoUrl || '');
  
  // 1. تفاصيل الشخص
  const [name, setName] = useState<string>(contact?.name || '');
  const [age, setAge] = useState<string | number>(contact?.age ?? '');
  const [religion, setReligion] = useState<string>(contact?.religion || 'مسلم');
  const [jobTitle, setJobTitle] = useState<string>(contact?.jobTitle || '');
  const [experience, setExperience] = useState<string>(contact?.experience || '');
  const [address, setAddress] = useState<string>(contact?.address || '');

  // 2. طرق التواصل
  const [phone1, setPhone1] = useState<string>(contact?.phone1 || '');
  const [phone2, setPhone2] = useState<string>(contact?.phone2 || '');
  const [whatsapp, setWhatsapp] = useState<string>(contact?.whatsapp || '');
  const [facebook, setFacebook] = useState<string>(contact?.facebook || '');
  const [instagram, setInstagram] = useState<string>(contact?.instagram || '');
  const [linkedin, setLinkedin] = useState<string>(contact?.linkedin || '');
  const [xTwitter, setXTwitter] = useState<string>(contact?.xTwitter || '');

  // 3. تفاصيل العلاقة
  const [trustLevel, setTrustLevel] = useState<string | number>(contact?.trustLevel || 'عالية جداً (95%)');
  const [strengths, setStrengths] = useState<string>(contact?.strengths || '');
  const [weaknesses, setWeaknesses] = useState<string>(contact?.weaknesses || '');
  const [potentialBenefit, setPotentialBenefit] = useState<string>(contact?.potentialBenefit || '');

  // Reset or initialize state when contact or modal opens
  useEffect(() => {
    if (contact) {
      setPhotoUrl(contact.photoUrl || '');
      setName(contact.name || '');
      setAge(contact.age ?? '');
      setReligion(contact.religion || 'مسلم');
      setJobTitle(contact.jobTitle || '');
      setExperience(contact.experience || '');
      setAddress(contact.address || '');

      setPhone1(contact.phone1 || '');
      setPhone2(contact.phone2 || '');
      setWhatsapp(contact.whatsapp || '');
      setFacebook(contact.facebook || '');
      setInstagram(contact.instagram || '');
      setLinkedin(contact.linkedin || '');
      setXTwitter(contact.xTwitter || '');

      setTrustLevel(contact.trustLevel || 'عالية جداً (95%)');
      setStrengths(contact.strengths || '');
      setWeaknesses(contact.weaknesses || '');
      setPotentialBenefit(contact.potentialBenefit || '');
      setIsEditing(isCreateMode);
    } else {
      setPhotoUrl('');
      setName('');
      setAge('');
      setReligion('مسلم');
      setJobTitle('');
      setExperience('');
      setAddress('');

      setPhone1('');
      setPhone2('');
      setWhatsapp('');
      setFacebook('');
      setInstagram('');
      setLinkedin('');
      setXTwitter('');

      setTrustLevel('عالية (90%)');
      setStrengths('');
      setWeaknesses('');
      setPotentialBenefit('');
      setIsEditing(true);
    }
    setIsConfirmingDelete(false);
  }, [contact, isCreateMode, isOpen]);

  if (!isOpen) return null;

  // Handle Photo Upload with automatic compression
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 400, 400, 0.75);
        if (compressed) {
          setPhotoUrl(compressed);
        }
      } catch (err) {
        console.warn('Failed to compress avatar image:', err);
      }
    }
  };

  // Copy to clipboard helper
  const handleCopy = (text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Submit Handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const initials = name
      .trim()
      .split(' ')
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase() || 'ش';

    const contactData: RelationshipContact = {
      id: contact?.id || `contact-${Date.now()}`,
      name: name.trim(),
      age: age ? String(age).trim() : undefined,
      religion: religion.trim() || undefined,
      jobTitle: jobTitle.trim() || undefined,
      experience: experience.trim() || undefined,
      address: address.trim() || undefined,
      photoUrl: photoUrl.trim() || undefined,

      phone1: phone1.trim() || undefined,
      phone2: phone2.trim() || undefined,
      whatsapp: whatsapp.trim() || undefined,
      facebook: facebook.trim() || undefined,
      instagram: instagram.trim() || undefined,
      linkedin: linkedin.trim() || undefined,
      xTwitter: xTwitter.trim() || undefined,

      trustLevel: trustLevel ? String(trustLevel).trim() : undefined,
      strengths: strengths.trim() || undefined,
      weaknesses: weaknesses.trim() || undefined,
      potentialBenefit: potentialBenefit.trim() || undefined,

      organization: contact?.organization || (selectedLocation ? selectedLocation.name : (jobTitle ? `جهة عمل ${name.split(' ')[0]}` : 'جهة عمل خاصة')),
      locationId: contact?.locationId || selectedLocation?.id || undefined,
      roleType: contact?.roleType || 'active-client',
      relationshipStatus: contact?.relationshipStatus || 'active-deal',
      lastContactDate: contact?.lastContactDate || new Date().toISOString().split('T')[0],
      avatarInitials: initials,
    };

    if (isCreateMode || !contact) {
      onAddContact(contactData);
      onClose();
    } else {
      onUpdateContact(contactData);
      setIsEditing(false);
    }
  };

  const cleanWhatsappNumber = (val?: string) => {
    if (!val) return '';
    return val.replace(/[^0-9]/g, '');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      dir="rtl"
    >
      <div 
        className="w-full max-w-3xl bg-[#FFFFFF] border border-[#E2DACB] rounded-2xl shadow-2xl text-[#1C191E] max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ============================================================== */}
        {/* MODAL HEADER CONTROLS (Top Right & Left Action Buttons) */}
        {/* ============================================================== */}
        <div className="bg-[#FAF8F5] border-b border-[#EFEAE0] px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A747D]">
              MEMBER PROFILE & DOSSIER
            </span>
            <span className="text-xs text-[#E5DECE]">•</span>
            <span className="text-xs font-bold text-[#1C191E]">
              {isEditing ? (isCreateMode ? 'إضافة جهة اتصال جديدة' : 'تعديل بيانات الشخص') : 'ملف جهة الاتصال'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {!isEditing && contact && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setIsConfirmingDelete(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#EFEAE0] border border-[#E5DECE] text-xs font-bold text-[#1C191E] flex items-center gap-1 transition-colors cursor-pointer"
                  title="تعديل هذا الملف"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#B31B24]" />
                  <span>تعديل</span>
                </button>

                {isConfirmingDelete ? (
                  <div className="flex items-center gap-1 bg-red-50 border border-red-200 px-2 py-0.5 rounded-lg animate-in fade-in">
                    <span className="text-[10px] font-bold text-red-700">تأكيد الحذف؟</span>
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteContact(contact.id);
                        setIsConfirmingDelete(false);
                        onClose();
                      }}
                      className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold cursor-pointer transition-colors shadow-xs"
                    >
                      نعم، حذف
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsConfirmingDelete(false)}
                      className="px-1.5 py-0.5 rounded bg-white border border-[#E5DECE] hover:bg-[#FAF8F5] text-[#1C191E] text-[10px] font-bold cursor-pointer transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(true)}
                    className="px-2.5 py-1 rounded-lg text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    title="حذف جهة الاتصال"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف</span>
                  </button>
                )}
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#7A747D] hover:text-[#1C191E] hover:bg-[#EFEAE0] transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SCROLLABLE MAIN CONTENT */}
        {/* ============================================================== */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-6">

          {/* ============================================================ */}
          {/* 1. CENTERED PHOTO IN THE MIDDLE & HERO BANNER (صورة الشخص في المنتصف) */}
          {/* ============================================================ */}
          <div className="flex flex-col items-center justify-center text-center pt-2 pb-1">
            <div className="relative group">
              {/* Photo Frame */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-xl bg-[#FAF8F5] overflow-hidden flex items-center justify-center ring-2 ring-[#E2DACB] transition-transform group-hover:scale-105">
                {photoUrl ? (
                  <img 
                    src={photoUrl} 
                    alt={name || 'صورة الشخص'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#FAF8F5] to-[#EFEAE0] text-[#B31B24]">
                    <User className="w-12 h-12 stroke-[1.5] opacity-60" />
                    <span className="font-serif-title font-black text-sm tracking-widest mt-1">
                      {name ? name.slice(0, 2) : 'عضو'}
                    </span>
                  </div>
                )}
              </div>

              {/* Photo Upload / Change Action Overlay Button */}
              <label 
                className="absolute bottom-1 right-1 p-2 rounded-full bg-[#B31B24] hover:bg-[#990000] text-white shadow-lg cursor-pointer transition-transform hover:scale-110 flex items-center justify-center border-2 border-white"
                title="تغيير أو رفع صورة الشخص"
              >
                <Camera className="w-4 h-4" />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
              </label>

              {photoUrl && isEditing && (
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/60 hover:bg-red-600 text-white shadow-md cursor-pointer transition-colors"
                  title="حذف الصورة"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Centered Name & Job Title under Photo */}
            <div className="mt-3 space-y-1">
              <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-[#1C191E]">
                {name || (isEditing ? 'اسم جهة الاتصال' : 'غير محدد')}
              </h2>
              {jobTitle && (
                <p className="text-xs sm:text-sm font-semibold text-[#B31B24] flex items-center justify-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{jobTitle}</span>
                </p>
              )}

              {/* Quick Tags / Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {religion && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EFEAE0] text-[#554F59] border border-[#E2DACB]">
                    الدين: {religion}
                  </span>
                )}
                {age && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EFEAE0] text-[#554F59] border border-[#E2DACB] font-mono-num">
                    السن: {age} سنة
                  </span>
                )}
                {trustLevel && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>الثقة: {trustLevel}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* VIEW MODE: 3 DEDICATED ORGANIZED SECTIONS */}
          {/* ============================================================ */}
          {!isEditing ? (
            <div className="space-y-5">

              {/* -------------------------------------------------------- */}
              {/* SECTION 1: تفاصيل الشخص (Personal Details) */}
              {/* -------------------------------------------------------- */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] shadow-2xs space-y-3">
                <div className="flex items-center gap-2 border-b border-[#EFEAE0] pb-2 text-[#B31B24]">
                  <User className="w-4 h-4" />
                  <h3 className="font-serif-title text-sm font-bold text-[#1C191E]">
                    تفاصيل الشخص
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  {/* الاسم */}
                  <div className="p-2.5 rounded-lg bg-white border border-[#E5DECE] space-y-0.5">
                    <span className="text-[10px] font-bold text-[#7A747D] block">الاسم</span>
                    <span className="font-bold text-[#1C191E]">{name || '—'}</span>
                  </div>

                  {/* السن */}
                  <div className="p-2.5 rounded-lg bg-white border border-[#E5DECE] space-y-0.5">
                    <span className="text-[10px] font-bold text-[#7A747D] block">السن</span>
                    <span className="font-bold text-[#1C191E] font-mono-num">
                      {age ? `${age} سنة` : '—'}
                    </span>
                  </div>

                  {/* الدين */}
                  <div className="p-2.5 rounded-lg bg-white border border-[#E5DECE] space-y-0.5">
                    <span className="text-[10px] font-bold text-[#7A747D] block">الدين</span>
                    <span className="font-bold text-[#1C191E]">{religion || '—'}</span>
                  </div>

                  {/* الوظيفة */}
                  <div className="p-2.5 rounded-lg bg-white border border-[#E5DECE] space-y-0.5 sm:col-span-2 md:col-span-1">
                    <span className="text-[10px] font-bold text-[#7A747D] block">الوظيفة</span>
                    <span className="font-bold text-[#1C191E]">{jobTitle || '—'}</span>
                  </div>

                  {/* الخبرة */}
                  <div className="p-2.5 rounded-lg bg-white border border-[#E5DECE] space-y-0.5 sm:col-span-2">
                    <span className="text-[10px] font-bold text-[#7A747D] block">الخبرة</span>
                    <span className="text-[#1C191E] leading-relaxed">{experience || '—'}</span>
                  </div>

                  {/* العنوان */}
                  <div className="p-2.5 rounded-lg bg-white border border-[#E5DECE] space-y-0.5 sm:col-span-2 md:col-span-3 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#B31B24] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-[#7A747D] block">العنوان</span>
                      <span className="font-bold text-[#1C191E]">{address || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* -------------------------------------------------------- */}
              {/* SECTION 2: طرق التواصل (Contact Methods) */}
              {/* -------------------------------------------------------- */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] shadow-2xs space-y-3">
                <div className="flex items-center gap-2 border-b border-[#EFEAE0] pb-2 text-[#0284C7]">
                  <Share2 className="w-4 h-4" />
                  <h3 className="font-serif-title text-sm font-bold text-[#1C191E]">
                    طرق التواصل
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {/* رقم هاتف 1 */}
                  <div className="p-2.5 rounded-lg bg-white border border-[#E5DECE] flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-[#7A747D] block">رقم هاتف 1</span>
                        <span className="font-mono-num font-bold text-[#1C191E] truncate block" dir="ltr">
                          {phone1 || '—'}
                        </span>
                      </div>
                    </div>
                    {phone1 && (
                      <button
                        type="button"
                        onClick={() => handleCopy(phone1, 'phone1')}
                        className="p-1 rounded text-[#7A747D] hover:text-[#0284C7] hover:bg-[#F0F9FF] cursor-pointer"
                        title="نسخ الرقم"
                      >
                        {copiedField === 'phone1' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  {/* رقم هاتف 2 */}
                  <div className="p-2.5 rounded-lg bg-white border border-[#E5DECE] flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] text-[#7A747D] flex items-center justify-center shrink-0">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-[#7A747D] block">رقم هاتف 2</span>
                        <span className="font-mono-num font-bold text-[#1C191E] truncate block" dir="ltr">
                          {phone2 || '—'}
                        </span>
                      </div>
                    </div>
                    {phone2 && (
                      <button
                        type="button"
                        onClick={() => handleCopy(phone2, 'phone2')}
                        className="p-1 rounded text-[#7A747D] hover:text-[#0284C7] hover:bg-[#F0F9FF] cursor-pointer"
                        title="نسخ الرقم"
                      >
                        {copiedField === 'phone2' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  {/* واتساب */}
                  <div className="p-2.5 rounded-lg bg-white border border-[#E5DECE] flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] flex items-center justify-center shrink-0">
                        <MessageCircle className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-[#7A747D] block">واتساب (WhatsApp)</span>
                        <span className="font-mono-num font-bold text-[#1C191E] truncate block" dir="ltr">
                          {whatsapp || '—'}
                        </span>
                      </div>
                    </div>
                    {whatsapp && (
                      <a
                        href={`https://wa.me/${cleanWhatsappNumber(whatsapp)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 rounded bg-[#16A34A] hover:bg-[#15803D] text-white text-[10px] font-bold flex items-center gap-1 shadow-xs"
                      >
                        <span>محادثة</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>

                  {/* فيس بوك */}
                  <div className="p-2.5 rounded-lg bg-white border border-[#E5DECE] flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] flex items-center justify-center shrink-0">
                        <Facebook className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-[#7A747D] block">فيس بوك</span>
                        <span className="text-[#1C191E] font-medium truncate block" dir="ltr">
                          {facebook || '—'}
                        </span>
                      </div>
                    </div>
                    {facebook && (
                      <button
                        type="button"
                        onClick={() => handleCopy(facebook, 'facebook')}
                        className="p-1 rounded text-[#7A747D] hover:text-[#1D4ED8]"
                      >
                        {copiedField === 'facebook' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  {/* انستجرام */}
                  <div className="p-2.5 rounded-lg bg-white border border-[#E5DECE] flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#FDF2F8] border border-[#FBCFE8] text-[#DB2777] flex items-center justify-center shrink-0">
                        <Instagram className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-[#7A747D] block">انستجرام</span>
                        <span className="text-[#1C191E] font-medium truncate block" dir="ltr">
                          {instagram || '—'}
                        </span>
                      </div>
                    </div>
                    {instagram && (
                      <button
                        type="button"
                        onClick={() => handleCopy(instagram, 'instagram')}
                        className="p-1 rounded text-[#7A747D] hover:text-[#DB2777]"
                      >
                        {copiedField === 'instagram' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  {/* لينكد إن */}
                  <div className="p-2.5 rounded-lg bg-white border border-[#E5DECE] flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0">
                        <Linkedin className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-[#7A747D] block">لينكد إن</span>
                        <span className="text-[#1C191E] font-medium truncate block" dir="ltr">
                          {linkedin || '—'}
                        </span>
                      </div>
                    </div>
                    {linkedin && (
                      <button
                        type="button"
                        onClick={() => handleCopy(linkedin, 'linkedin')}
                        className="p-1 rounded text-[#7A747D] hover:text-[#0284C7]"
                      >
                        {copiedField === 'linkedin' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  {/* إكس (تويتر) */}
                  <div className="p-2.5 rounded-lg bg-white border border-[#E5DECE] flex items-center justify-between sm:col-span-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] text-[#1C191E] flex items-center justify-center shrink-0">
                        <Twitter className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-[#7A747D] block">منصة إكس (X)</span>
                        <span className="text-[#1C191E] font-medium truncate block" dir="ltr">
                          {xTwitter || '—'}
                        </span>
                      </div>
                    </div>
                    {xTwitter && (
                      <button
                        type="button"
                        onClick={() => handleCopy(xTwitter, 'xTwitter')}
                        className="p-1 rounded text-[#7A747D] hover:text-[#1C191E]"
                      >
                        {copiedField === 'xTwitter' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* -------------------------------------------------------- */}
              {/* SECTION 3: تفاصيل العلاقة (Relationship Assessment) */}
              {/* -------------------------------------------------------- */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] shadow-2xs space-y-3">
                <div className="flex items-center gap-2 border-b border-[#EFEAE0] pb-2 text-[#D97706]">
                  <ShieldCheck className="w-4 h-4" />
                  <h3 className="font-serif-title text-sm font-bold text-[#1C191E]">
                    تفاصيل العلاقة والتقييم الاستراتيجي
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* درجة الثقة */}
                  <div className="p-3 rounded-lg bg-white border border-[#E5DECE] space-y-1.5 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#7A747D]">درجة الثقة</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#DCFCE7] text-[#15803D]">
                        {trustLevel || 'غير محدد'}
                      </span>
                    </div>
                    <div className="w-full bg-[#EFEAE0] rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-emerald-600 h-full rounded-full" 
                        style={{ width: typeof trustLevel === 'string' && trustLevel.includes('%') ? trustLevel.match(/\d+/)?.[0] + '%' : '85%' }} 
                      />
                    </div>
                  </div>

                  {/* نقاط القوة */}
                  <div className="p-3 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] space-y-1">
                    <div className="flex items-center gap-1.5 text-[#16A34A] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>نقاط القوة</span>
                    </div>
                    <p className="text-[#1C191E] leading-relaxed text-[11.5px]">
                      {strengths || 'لم يتم تسجيل نقاط قوة محددة بعد.'}
                    </p>
                  </div>

                  {/* نقاط الضعف */}
                  <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] space-y-1">
                    <div className="flex items-center gap-1.5 text-[#B31B24] font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>نقاط الضعف</span>
                    </div>
                    <p className="text-[#1C191E] leading-relaxed text-[11.5px]">
                      {weaknesses || 'لم يتم رصد نقاط ضعف أو محاذير.'}
                    </p>
                  </div>

                  {/* الفائدة الممكنة */}
                  <div className="p-3 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] space-y-1 md:col-span-2">
                    <div className="flex items-center gap-1.5 text-[#D97706] font-bold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>الفائدة الممكنة (Mutual Benefit & Value)</span>
                    </div>
                    <p className="text-[#1C191E] leading-relaxed text-[11.5px]">
                      {potentialBenefit || 'تحقيق التعاون المشترك وبناء القيمة المتبادلة.'}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* ============================================================ */
            /* EDIT / CREATE FORM: 3 SECTIONS FOR EDITING */
            /* ============================================================ */
            <form onSubmit={handleSave} className="space-y-6">

              {/* -------------------------------------------------------- */}
              {/* EDIT SECTION 1: تفاصيل الشخص */}
              {/* -------------------------------------------------------- */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] space-y-3">
                <div className="flex items-center gap-2 border-b border-[#EFEAE0] pb-2 text-[#B31B24]">
                  <User className="w-4 h-4" />
                  <h3 className="font-serif-title text-sm font-bold text-[#1C191E]">
                    1. تفاصيل الشخص
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#1C191E] mb-1">
                      الاسم الكامل <span className="text-[#B31B24]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: م. أحمد عبد الرحمن"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] focus:outline-none focus:border-[#B31B24]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C191E] mb-1">
                      السن (العمر)
                    </label>
                    <input
                      type="number"
                      placeholder="مثال: 38"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] font-mono-num focus:outline-none focus:border-[#B31B24]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C191E] mb-1">
                      الدين
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: مسلم"
                      value={religion}
                      onChange={(e) => setReligion(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] focus:outline-none focus:border-[#B31B24]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#1C191E] mb-1">
                      الوظيفة (المسمى الوظيفي)
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: مدير العمليات وسلاسل الإمداد"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] focus:outline-none focus:border-[#B31B24]"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-[#1C191E] mb-1">
                      الخبرة المهنية
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: 14 سنة خبرة في إدارة المستودعات واللوجستيات"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] focus:outline-none focus:border-[#B31B24]"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-[#1C191E] mb-1">
                      العنوان
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: المنصورة، حي الجامعة، شارع أحمد ماهر"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] focus:outline-none focus:border-[#B31B24]"
                    />
                  </div>
                </div>
              </div>

              {/* -------------------------------------------------------- */}
              {/* EDIT SECTION 2: طرق التواصل */}
              {/* -------------------------------------------------------- */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] space-y-3">
                <div className="flex items-center gap-2 border-b border-[#EFEAE0] pb-2 text-[#0284C7]">
                  <Share2 className="w-4 h-4" />
                  <h3 className="font-serif-title text-sm font-bold text-[#1C191E]">
                    2. طرق التواصل
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1C191E] mb-1">
                      رقم هاتف 1
                    </label>
                    <input
                      type="text"
                      placeholder="+20 100 000 0000"
                      value={phone1}
                      onChange={(e) => setPhone1(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] font-mono-num focus:outline-none focus:border-[#B31B24]"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C191E] mb-1">
                      رقم هاتف 2
                    </label>
                    <input
                      type="text"
                      placeholder="+20 120 000 0000"
                      value={phone2}
                      onChange={(e) => setPhone2(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] font-mono-num focus:outline-none focus:border-[#B31B24]"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C191E] mb-1">
                      واتساب (WhatsApp)
                    </label>
                    <input
                      type="text"
                      placeholder="+201000000000"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] font-mono-num focus:outline-none focus:border-[#B31B24]"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C191E] mb-1">
                      فيس بوك
                    </label>
                    <input
                      type="text"
                      placeholder="facebook.com/username"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] focus:outline-none focus:border-[#B31B24]"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C191E] mb-1">
                      انستجرام
                    </label>
                    <input
                      type="text"
                      placeholder="@username"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] focus:outline-none focus:border-[#B31B24]"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C191E] mb-1">
                      لينكد إن
                    </label>
                    <input
                      type="text"
                      placeholder="linkedin.com/in/username"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] focus:outline-none focus:border-[#B31B24]"
                      dir="ltr"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#1C191E] mb-1">
                      إكس (Twitter)
                    </label>
                    <input
                      type="text"
                      placeholder="@username"
                      value={xTwitter}
                      onChange={(e) => setXTwitter(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] focus:outline-none focus:border-[#B31B24]"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* -------------------------------------------------------- */}
              {/* EDIT SECTION 3: تفاصيل العلاقة */}
              {/* -------------------------------------------------------- */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] space-y-3">
                <div className="flex items-center gap-2 border-b border-[#EFEAE0] pb-2 text-[#D97706]">
                  <ShieldCheck className="w-4 h-4" />
                  <h3 className="font-serif-title text-sm font-bold text-[#1C191E]">
                    3. تفاصيل العلاقة
                  </h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1C191E] mb-1">
                      درجة الثقة
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: عالية جداً (95%) أو 5/5"
                      value={trustLevel}
                      onChange={(e) => setTrustLevel(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] focus:outline-none focus:border-[#B31B24]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C191E] mb-1">
                      نقاط القوة
                    </label>
                    <textarea
                      rows={2}
                      placeholder="وضح نقاط القوة والتميز في الشخص أو العلاقة معه..."
                      value={strengths}
                      onChange={(e) => setStrengths(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] focus:outline-none focus:border-[#B31B24]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C191E] mb-1">
                      نقاط الضعف
                    </label>
                    <textarea
                      rows={2}
                      placeholder="وضح أي نقاط ضعف أو محاذير يجب الانتباه لها..."
                      value={weaknesses}
                      onChange={(e) => setWeaknesses(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] focus:outline-none focus:border-[#B31B24]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C191E] mb-1">
                      الفائدة الممكنة
                    </label>
                    <textarea
                      rows={2}
                      placeholder="وضح الفائدة الاستراتيجية والتجارية المتوقعة من توطيد هذه العلاقة..."
                      value={potentialBenefit}
                      onChange={(e) => setPotentialBenefit(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DACB] text-xs text-[#1C191E] focus:outline-none focus:border-[#B31B24]"
                    />
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-[#EFEAE0]">
                {!isCreateMode && contact ? (
                  isConfirmingDelete ? (
                    <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg animate-in fade-in">
                      <span className="text-xs font-bold text-red-700">تأكيد حذف الملف نهائياً؟</span>
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteContact(contact.id);
                          setIsConfirmingDelete(false);
                          onClose();
                        }}
                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                      >
                        نعم، حذف
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsConfirmingDelete(false)}
                        className="px-2 py-1 rounded bg-white border border-[#E5DECE] text-[#1C191E] text-xs font-bold hover:bg-[#FAF8F5] cursor-pointer"
                      >
                        إلغاء
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsConfirmingDelete(true)}
                      className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف جهة الاتصال</span>
                    </button>
                  )
                ) : <div />}

                <div className="flex items-center gap-2">
                  {!isCreateMode && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setIsConfirmingDelete(false);
                      }}
                      className="px-4 py-2 rounded-lg border border-[#E5DECE] bg-white text-xs font-bold text-[#7A747D] hover:bg-[#FAF8F5] cursor-pointer"
                    >
                      إلغاء
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-[#B31B24] hover:bg-[#990000] text-white text-xs font-bold shadow-xs transition-transform hover:scale-[1.02] cursor-pointer"
                  >
                    {isCreateMode ? 'إضافة جهة الاتصال' : 'حفظ التعديلات'}
                  </button>
                </div>
              </div>

            </form>
          )}

        </div>

        {/* ============================================================== */}
        {/* FOOTER */}
        {/* ============================================================== */}
        <div className="bg-[#FAF8F5] border-t border-[#EFEAE0] px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-[#7A747D] shrink-0">
          <div className="flex items-center gap-2">
            {!isEditing && contact && (
              isConfirmingDelete ? (
                <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg animate-in fade-in">
                  <span className="text-xs font-bold text-red-700">تأكيد حذف الملف نهائياً؟</span>
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteContact(contact.id);
                      setIsConfirmingDelete(false);
                      onClose();
                    }}
                    className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                  >
                    نعم، حذف الآن
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(false)}
                    className="px-2.5 py-1 rounded bg-white border border-[#E5DECE] hover:bg-[#FAF8F5] text-[#1C191E] text-xs font-bold cursor-pointer transition-colors"
                  >
                    تراجع
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="حذف جهة الاتصال"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف جهة الاتصال</span>
                </button>
              )
            )}
            <span className="hidden sm:inline">ملفات جهات الاتصال والأعضاء (Member Profiles)</span>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && contact && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(true);
                  setIsConfirmingDelete(false);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EFEAE0] border border-[#E5DECE] text-xs font-bold text-[#1C191E] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#B31B24]" />
                <span>تعديل الملف</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-[#E5DECE] bg-white text-xs font-bold text-[#1C191E] hover:bg-[#FAF8F5] cursor-pointer shadow-xs"
            >
              إغلاق
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
