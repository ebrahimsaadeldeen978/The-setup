import React from 'react';
import { 
  Building2, 
  Factory, 
  Store, 
  Cpu, 
  ShoppingBag, 
  Briefcase, 
  Truck, 
  Layers, 
  DollarSign, 
  PieChart, 
  Database,
  Calendar, 
  Award, 
  Trophy, 
  Sparkles, 
  Flag, 
  Megaphone,
  Users, 
  UserCheck, 
  Handshake, 
  MessageSquare, 
  Coffee, 
  Clock, 
  Compass,
  Laptop, 
  Target, 
  CheckCircle2, 
  Bookmark, 
  FileText, 
  FolderKanban, 
  Presentation,
  MapPin,
  Utensils,
  Landmark,
  Shield,
  Zap,
  Globe
} from 'lucide-react';
import { MapLocationCategory } from '../../types/dashboard';

export interface IconDefinition {
  name: string;
  label: string;
  category: 'business' | 'events' | 'meetings' | 'work' | 'general';
}

export const ICON_REGISTRY: IconDefinition[] = [
  // 1. مشاريع وصناعات (Business & Industries)
  { name: 'Building2', label: 'شركة / مؤسسة', category: 'business' },
  { name: 'Factory', label: 'مصنع / إنتاج', category: 'business' },
  { name: 'Store', label: 'متجر / تجزئة', category: 'business' },
  { name: 'Cpu', label: 'تكنولوجيا وبرمجيات', category: 'business' },
  { name: 'ShoppingBag', label: 'تجارة إلكترونية', category: 'business' },
  { name: 'Truck', label: 'سلاسل إمداد وموردين', category: 'business' },
  { name: 'Database', label: 'بيانات وتحليلات', category: 'business' },
  { name: 'DollarSign', label: 'مالية واستثمار', category: 'business' },
  { name: 'PieChart', label: 'استشارات وتطوير', category: 'business' },
  { name: 'Layers', label: 'مجموعة أعمال', category: 'business' },
  { name: 'Landmark', label: 'جهة حكومية / كبرى', category: 'business' },
  { name: 'Globe', label: 'أعمال دولية', category: 'business' },

  // 2. فعاليات ومؤتمرات (Events & Conferences)
  { name: 'Calendar', label: 'مؤتمر سنوي', category: 'events' },
  { name: 'Award', label: 'قمة مهنية / ملتقى', category: 'events' },
  { name: 'Trophy', label: 'معرض صناعي', category: 'events' },
  { name: 'Megaphone', label: 'ندوة / إطلاق عمل', category: 'events' },
  { name: 'Sparkles', label: 'هاكاثون / ورشة', category: 'events' },
  { name: 'Flag', label: 'إيفنت تواصل (Networking)', category: 'events' },
  { name: 'Presentation', label: 'عرض تقديمي / مؤتمر', category: 'events' },

  // 3. مقابلات واجتماعات (Meetings & Encounters)
  { name: 'Handshake', label: 'صفقة / شراكة', category: 'meetings' },
  { name: 'Users', label: 'اجتماع طاولة عمل', category: 'meetings' },
  { name: 'UserCheck', label: 'مقابلة مع عميل', category: 'meetings' },
  { name: 'MessageSquare', label: 'جلسة استكشاف واحتياج', category: 'meetings' },
  { name: 'Clock', label: 'موعد متابعة دوري', category: 'meetings' },
  { name: 'Shield', label: 'اجتماع مغلق وحاسم', category: 'meetings' },

  // 4. بيئات عمل ومشاريع (Work & Execution)
  { name: 'Briefcase', label: 'مشروع قيد التنفيذ', category: 'work' },
  { name: 'Laptop', label: 'عمل مكتبي / تقني', category: 'work' },
  { name: 'Target', label: 'هدف تشغيلي', category: 'work' },
  { name: 'CheckCircle2', label: 'مشروع مكتمل', category: 'work' },
  { name: 'FolderKanban', label: 'إدارة مشاريع', category: 'work' },
  { name: 'FileText', label: 'دراسة وتحليل فجوات', category: 'work' },
  { name: 'Zap', label: 'تدخل عاجل وسريع', category: 'work' },

  // 5. كافيهات، مطاعم، مساحات عمل وأماكن عامة
  { name: 'Coffee', label: 'كافيه لقاءات', category: 'general' },
  { name: 'Utensils', label: 'مطعم / غداء عمل', category: 'general' },
  { name: 'Bookmark', label: 'مساحة عمل مشتركة (Coworking)', category: 'general' },
  { name: 'Compass', label: 'استكشاف ميداني', category: 'general' },
  { name: 'MapPin', label: 'موقع جغرافي عام', category: 'general' },
];

export const CATEGORY_CONFIG: Record<MapLocationCategory, { label: string; defaultColor: string; defaultIcon: string }> = {
  'potential-client': {
    label: 'عملاء محتملون',
    defaultColor: '#B31B24',
    defaultIcon: 'Building2',
  },
  'current-client': {
    label: 'عملاء حاليون',
    defaultColor: '#15803D',
    defaultIcon: 'CheckCircle2',
  },
  'business-supplier': {
    label: 'أنشطة تجارية وموردون',
    defaultColor: '#D97706',
    defaultIcon: 'Truck',
  },
  'conference-event': {
    label: 'مؤتمرات وفعاليات مهنية',
    defaultColor: '#7C3AED',
    defaultIcon: 'Calendar',
  },
  'cafe-coworking': {
    label: 'كافيهات ومطاعم ومساحات عمل',
    defaultColor: '#0D9488',
    defaultIcon: 'Coffee',
  },
  'meeting-visit-site': {
    label: 'مواقع الزيارات والاجتماعات',
    defaultColor: '#2563EB',
    defaultIcon: 'Handshake',
  },
};

export const PRESET_COLORS = [
  { hex: '#B31B24', label: 'أحمر قرمزي (Don Crimson)' },
  { hex: '#15803D', label: 'أخضر زمردي (Emerald Green)' },
  { hex: '#2563EB', label: 'أزرق ملكي (Royal Blue)' },
  { hex: '#D97706', label: 'ذهبي / برتقالي (Gold Amber)' },
  { hex: '#7C3AED', label: 'بنفسجي داكن (Purple)' },
  { hex: '#0D9488', label: 'فيروزي (Teal)' },
  { hex: '#DC2626', label: 'أحمر ناري (Fire Red)' },
  { hex: '#4B5563', label: 'رمادي حجري (Slate)' },
  { hex: '#000000', label: 'أسود فحمي (Noir Black)' },
  { hex: '#EC4899', label: 'وردي (Rose)' },
];

export const renderDynamicIcon = (iconName?: string, className = "w-3.5 h-3.5 text-white") => {
  switch (iconName) {
    case 'Building2': return <Building2 className={className} />;
    case 'Factory': return <Factory className={className} />;
    case 'Store': return <Store className={className} />;
    case 'Cpu': return <Cpu className={className} />;
    case 'ShoppingBag': return <ShoppingBag className={className} />;
    case 'Truck': return <Truck className={className} />;
    case 'Database': return <Database className={className} />;
    case 'DollarSign': return <DollarSign className={className} />;
    case 'PieChart': return <PieChart className={className} />;
    case 'Layers': return <Layers className={className} />;
    case 'Landmark': return <Landmark className={className} />;
    case 'Globe': return <Globe className={className} />;
    case 'Calendar': return <Calendar className={className} />;
    case 'Award': return <Award className={className} />;
    case 'Trophy': return <Trophy className={className} />;
    case 'Megaphone': return <Megaphone className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'Flag': return <Flag className={className} />;
    case 'Presentation': return <Presentation className={className} />;
    case 'Handshake': return <Handshake className={className} />;
    case 'Users': return <Users className={className} />;
    case 'UserCheck': return <UserCheck className={className} />;
    case 'MessageSquare': return <MessageSquare className={className} />;
    case 'Clock': return <Clock className={className} />;
    case 'Shield': return <Shield className={className} />;
    case 'Briefcase': return <Briefcase className={className} />;
    case 'Laptop': return <Laptop className={className} />;
    case 'Target': return <Target className={className} />;
    case 'CheckCircle2': return <CheckCircle2 className={className} />;
    case 'FolderKanban': return <FolderKanban className={className} />;
    case 'FileText': return <FileText className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'Coffee': return <Coffee className={className} />;
    case 'Utensils': return <Utensils className={className} />;
    case 'Bookmark': return <Bookmark className={className} />;
    case 'Compass': return <Compass className={className} />;
    case 'MapPin': return <MapPin className={className} />;
    default: return <Building2 className={className} />;
  }
};
