import React from 'react';
import { 
  UserPlus, 
  UserCheck, 
  Utensils, 
  Handshake, 
  Calendar, 
  Briefcase, 
  HeartHandshake,
  Building2,
  Factory,
  Store,
  Cpu,
  ShoppingBag,
  Truck,
  Coffee,
  Sparkles,
  MapPin,
  Clock,
  Target,
  CheckCircle2,
  Shield,
  Zap,
  Globe,
  Award,
  DollarSign,
  FileText
} from 'lucide-react';

export type StrategicPinTypeKey = 
  | 'lead'
  | 'client'
  | 'bussiness food'
  | 'build the agreement'
  | 'event'
  | 'meeting'
  | 'relationship';

export interface StrategicPinType {
  key: StrategicPinTypeKey;
  label: string;
  shortTitle: string;
  meaning: string;
  iconName: string;
  defaultColor: string;
}

/**
 * 7 Core Strategic Pin Types specified by user:
 * lead = بتشير الى عميل محتمل 
 * client = عميل حالي
 * bussiness food = مقابلة مع عميل او اماكن تواجد العميل
 * build the agreement = عقد صفقة او بناء الاتفاق 
 * event = حصور فعاليات ومؤتمرات
 * meeting = اجتماع عمل وتخطيط 
 * relationship = بناء علاقة
 */
export const STRATEGIC_PIN_TYPES: StrategicPinType[] = [
  {
    key: 'lead',
    shortTitle: 'عميل محتمل',
    label: 'Lead',
    meaning: 'بتشير الى عميل محتمل',
    iconName: 'UserPlus',
    defaultColor: '#E11D48', // روز قرمزي
  },
  {
    key: 'client',
    shortTitle: 'عميل حالي',
    label: 'Client',
    meaning: 'عميل حالي',
    iconName: 'UserCheck',
    defaultColor: '#16A34A', // أخضر زمردي
  },
  {
    key: 'bussiness food',
    shortTitle: 'مقابلة / تواجد العميل',
    label: 'Bussiness Food',
    meaning: 'مقابلة مع عميل او اماكن تواجد العميل',
    iconName: 'Utensils',
    defaultColor: '#D97706', // برتقالي ذهبي
  },
  {
    key: 'build the agreement',
    shortTitle: 'عقد صفقة / بناء الاتفاق',
    label: 'Build the Agreement',
    meaning: 'عقد صفقة او بناء الاتفاق',
    iconName: 'Handshake',
    defaultColor: '#2563EB', // أزرق ملكي
  },
  {
    key: 'event',
    shortTitle: 'فعاليات ومؤتمرات',
    label: 'Event',
    meaning: 'حضور فعاليات ومؤتمرات',
    iconName: 'Calendar',
    defaultColor: '#7C3AED', // بنفسجي
  },
  {
    key: 'meeting',
    shortTitle: 'اجتماع عمل وتخطيط',
    label: 'Meeting',
    meaning: 'اجتماع عمل وتخطيط',
    iconName: 'Briefcase',
    defaultColor: '#0D9488', // فيروزي
  },
  {
    key: 'relationship',
    shortTitle: 'بناء علاقة',
    label: 'Relationship',
    meaning: 'بناء علاقة',
    iconName: 'HeartHandshake',
    defaultColor: '#DB2777', // ماجينتا وردي
  },
];

export const getPinTypeMeta = (typeKeyOrName?: string): StrategicPinType | undefined => {
  if (!typeKeyOrName) return undefined;
  const normalized = typeKeyOrName.trim().toLowerCase();
  return STRATEGIC_PIN_TYPES.find(p => 
    p.key.toLowerCase() === normalized || 
    p.label.toLowerCase() === normalized || 
    p.iconName.toLowerCase() === normalized ||
    p.shortTitle === typeKeyOrName
  );
};

/**
 * Storage helpers for saved custom hex colors
 */
const STORAGE_KEY_SAVED_COLORS = 'tactical_saved_pin_colors';

export const DEFAULT_PRESET_COLORS: string[] = [
  '#B31B24', // Don Crimson
  '#16A34A', // Emerald Green
  '#2563EB', // Royal Blue
  '#D97706', // Gold Amber
  '#7C3AED', // Purple
  '#0D9488', // Teal
  '#E11D48', // Rose Red (Lead)
  '#DB2777', // Magenta (Relationship)
  '#EA580C', // Orange
  '#4F46E5', // Indigo
  '#0284C7', // Sky Blue
  '#475569', // Slate
  '#1C191E', // Charcoal Black
];

export const getSavedPinColors = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_COLORS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read saved colors from localStorage', e);
  }
  return DEFAULT_PRESET_COLORS;
};

export const saveCustomPinColor = (newHex: string): string[] => {
  if (!newHex) return getSavedPinColors();
  const trimmed = newHex.trim().toUpperCase();
  if (!/^#([0-9A-F]{3}){1,2}$/i.test(trimmed)) return getSavedPinColors();

  const current = getSavedPinColors();
  const updated = [trimmed, ...current.filter(c => c.toUpperCase() !== trimmed)].slice(0, 24);
  try {
    localStorage.setItem(STORAGE_KEY_SAVED_COLORS, JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not save color to localStorage', e);
  }
  return updated;
};

export const removeSavedPinColor = (hexToRemove: string): string[] => {
  const current = getSavedPinColors();
  const updated = current.filter(c => c.toUpperCase() !== hexToRemove.trim().toUpperCase());
  try {
    localStorage.setItem(STORAGE_KEY_SAVED_COLORS, JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not remove color from localStorage', e);
  }
  return updated;
};

/**
 * Render appropriate icon for a pin
 */
export const renderPinIcon = (iconOrType?: string, className = "w-3.5 h-3.5") => {
  const norm = (iconOrType || '').trim().toLowerCase();

  switch (norm) {
    case 'lead':
    case 'userplus':
      return <UserPlus className={className} />;
    case 'client':
    case 'usercheck':
      return <UserCheck className={className} />;
    case 'bussiness food':
    case 'business food':
    case 'utensils':
    case 'restaurant':
      return <Utensils className={className} />;
    case 'build the agreement':
    case 'handshake':
    case 'agreement':
      return <Handshake className={className} />;
    case 'event':
    case 'calendar':
      return <Calendar className={className} />;
    case 'meeting':
    case 'briefcase':
      return <Briefcase className={className} />;
    case 'relationship':
    case 'hearthandshake':
    case 'heart':
      return <HeartHandshake className={className} />;
    case 'building2':
    case 'building':
      return <Building2 className={className} />;
    case 'factory':
      return <Factory className={className} />;
    case 'store':
      return <Store className={className} />;
    case 'coffee':
      return <Coffee className={className} />;
    case 'cpu':
      return <Cpu className={className} />;
    case 'truck':
      return <Truck className={className} />;
    case 'shoppingbag':
      return <ShoppingBag className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'target':
      return <Target className={className} />;
    case 'award':
      return <Award className={className} />;
    case 'dollarsign':
      return <DollarSign className={className} />;
    case 'filetext':
      return <FileText className={className} />;
    case 'clock':
      return <Clock className={className} />;
    case 'shield':
      return <Shield className={className} />;
    case 'globe':
      return <Globe className={className} />;
    default:
      return <MapPin className={className} />;
  }
};

/**
 * High-definition SVG Tactical Map Pin
 * Points downward with tip touching coordinate (x=18, y=43)
 */
export interface TacticalMapPinGraphicProps {
  color: string;
  iconName?: string;
  isSelected?: boolean;
  isHovered?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TacticalMapPinGraphic: React.FC<TacticalMapPinGraphicProps> = ({
  color,
  iconName,
  isSelected = false,
  isHovered = false,
  size = 'md',
  className = '',
}) => {
  // Dimensions
  const width = size === 'sm' ? 28 : size === 'lg' ? 42 : 34;
  const height = size === 'sm' ? 36 : size === 'lg' ? 52 : 44;
  const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <div 
      className={`relative flex flex-col items-center select-none transition-all duration-200 ${
        isSelected ? 'scale-115 z-30' : isHovered ? 'scale-105 z-20' : 'z-10'
      } ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        // Anchor the point of the pin to bottom center
        transformOrigin: 'bottom center',
      }}
    >
      {/* Selected Halo / Pulse Glow */}
      {isSelected && (
        <div 
          className="absolute -top-1 w-9 h-9 rounded-full animate-ping opacity-60 pointer-events-none"
          style={{ backgroundColor: color }}
        />
      )}

      {/* Pin SVG */}
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 34 44" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-md"
      >
        {/* Ground shadow beneath the tip */}
        <ellipse cx="17" cy="42" rx="6" ry="2" fill="rgba(0, 0, 0, 0.35)" />

        {/* Outer Pin Body (Teardrop shape) */}
        <path
          d="M17 1C8.716 1 2 7.716 2 16C2 26 15.2 39.4 16.4 40.6C16.73 40.95 17.27 40.95 17.6 40.6C18.8 39.4 32 26 32 16C32 7.716 25.284 1 17 1Z"
          fill={color}
          stroke="#FFFFFF"
          strokeWidth="2"
        />

        {/* Inner white circular badge */}
        <circle 
          cx="17" 
          cy="16" 
          r="10.5" 
          fill="#FFFFFF" 
          stroke="rgba(0,0,0,0.06)" 
          strokeWidth="1" 
        />
      </svg>

      {/* Icon placed precisely inside the inner circular badge */}
      <div 
        className="absolute top-[5px] left-0 right-0 mx-auto w-5 h-5 flex items-center justify-center pointer-events-none"
        style={{ color: color }}
      >
        {renderPinIcon(iconName, iconSize)}
      </div>
    </div>
  );
};
