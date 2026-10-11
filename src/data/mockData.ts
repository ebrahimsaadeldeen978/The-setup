import { 
  CrimeRing, 
  EmpireFinancials, 
  FamilyMember, 
  LiveOperation, 
  RacketNode, 
  ConsigliereAlert,
  TerritoryRegion,
  CitySector
} from '../types/dashboard';

export const INITIAL_CITY_SECTORS: CitySector[] = [
  {
    id: 'mansoura',
    name: 'المنصورة (MANSOURA)',
    lat: 31.0409,
    lng: 31.3785,
    zoom: 13,
    iconName: 'Landmark',
  },
];

export const INITIAL_FINANCIALS: EmpireFinancials = {
  totalWealth: 0,
  netHourlyRevenue: 0,
  territoryControlPercentage: 0,
  dailyExtortionYield: 0,
  activeGuardsPayroll: 0,
};

// All mock venues and rackets on the map removed as requested by user
export const INITIAL_RACKET_NODES: RacketNode[] = [];

export const INITIAL_CRIME_RINGS: CrimeRing[] = [
  {
    id: 'ring-chop',
    name: 'Chop Shops',
    category: 'Automotive & Fleet',
    totalVenues: 0,
    ownedVenues: 0,
    bonusTitle: 'Armored Fleet Upgrades',
    multiplierText: 'Defense +25%',
    bonusDescription: 'All family transport vehicles receive bulletproof armor plating and faster getaway speeds.',
    isUnlocked: false,
    iconType: 'truck'
  },
  {
    id: 'ring-gambling',
    name: 'High-Stakes Gambling',
    category: 'Casinos & Clubs',
    totalVenues: 0,
    ownedVenues: 0,
    bonusTitle: 'High-Roller VIP Lounge',
    multiplierText: 'Revenue +30%',
    bonusDescription: 'Attracts high-profile elite gamblers and accelerates money laundering throughput.',
    isUnlocked: false,
    iconType: 'diamond'
  },
  {
    id: 'ring-extortion',
    name: 'Protection Rackets',
    category: 'Local Businesses',
    totalVenues: 0,
    ownedVenues: 0,
    bonusTitle: 'Neighborhood Domination',
    multiplierText: 'Cashflow 2.0x',
    bonusDescription: 'Local businesses pay protection tribute regularly without requiring frequent enforcement visits.',
    isUnlocked: false,
    iconType: 'shield'
  },
  {
    id: 'ring-arms',
    name: 'Arms Smuggling',
    category: 'Munitions & Weapons',
    totalVenues: 0,
    ownedVenues: 0,
    bonusTitle: 'Heavy Tommy Guns',
    multiplierText: 'Firepower +50%',
    bonusDescription: 'Equips all capos and street soldiers with Level 3 automatic assault firearms.',
    isUnlocked: false,
    iconType: 'crosshair'
  }
];

// Preserved Family Hierarchy Tree and Roster (ما عدا الهيروركي)
export const INITIAL_FAMILY_ROSTER: FamilyMember[] = [
  {
    id: 'mem-don',
    name: 'Michael Valenti',
    role: 'Don',
    rankTitle: 'The Godfather & Supreme Ruler',
    avatarSeed: 'don-valenti',
    avatarInitials: 'MV',
    status: 'active',
    healthPercent: 100,
    weapon: 'Engraved .45 1911 Pistol',
    licenseLevel: 'Master Permit',
    specialties: ['Enforcer', 'Bruiser'],
    successBonusPct: 45,
    killsCount: 142
  },
  {
    id: 'mem-consigliere',
    name: 'Tom Hagen',
    role: 'Consigliere',
    rankTitle: 'Chief Legal & Tactical Advisor',
    avatarSeed: 'tom-hagen',
    avatarInitials: 'TH',
    status: 'active',
    healthPercent: 100,
    weapon: 'Snubnose .38 Detective',
    licenseLevel: 'Federal Immunity',
    specialties: ['Safecracker', 'Medic'],
    successBonusPct: 35,
    killsCount: 18
  },
  {
    id: 'mem-underboss',
    name: 'Rocco Lampone',
    role: 'Underboss',
    rankTitle: 'Field Marshal & Territory Boss',
    avatarSeed: 'rocco-lampone',
    avatarInitials: 'RL',
    status: 'active',
    healthPercent: 95,
    weapon: 'Custom Lupara Shotgun',
    licenseLevel: 'Level 3 Firearms',
    specialties: ['Demolition', 'Enforcer'],
    successBonusPct: 30,
    killsCount: 89
  },
  {
    id: 'mem-capo-1',
    name: 'Frankie Pentangeli',
    role: 'Caporegime',
    rankTitle: 'Bronx & Florida Crew Leader',
    avatarSeed: 'frankie-pentangeli',
    avatarInitials: 'FP',
    status: 'active',
    healthPercent: 88,
    weapon: 'Modified Thompson Drum-Mag',
    licenseLevel: 'Level 3 Firearms',
    specialties: ['Demolition', 'Arson'],
    successBonusPct: 25,
    killsCount: 64
  },
  {
    id: 'mem-capo-2',
    name: 'Salvatore Tessio',
    role: 'Caporegime',
    rankTitle: 'High-Roller Security Chief',
    avatarSeed: 'sal-tessio',
    avatarInitials: 'ST',
    status: 'active',
    healthPercent: 92,
    weapon: 'Dual Beretta Silenced',
    licenseLevel: 'Level 2 Firearms',
    specialties: ['Safecracker', 'Sniper'],
    successBonusPct: 20,
    killsCount: 51
  },
  {
    id: 'mem-soldier-1',
    name: 'Al Neri',
    role: 'Soldier',
    rankTitle: 'Head Enforcer & Bodyguard',
    avatarSeed: 'al-neri',
    avatarInitials: 'AN',
    status: 'active',
    healthPercent: 100,
    weapon: 'Police Magnum .357',
    licenseLevel: 'Special Agent Badge',
    specialties: ['Bruiser', 'Enforcer'],
    successBonusPct: 15,
    killsCount: 77
  },
  {
    id: 'mem-soldier-2',
    name: 'Jimmy "Sparks" Falcone',
    role: 'Soldier',
    rankTitle: 'Arson Specialist & Demolitionist',
    avatarSeed: 'jimmy-falcone',
    avatarInitials: 'JF',
    status: 'active',
    healthPercent: 74,
    weapon: 'Molotov Cocktails & Carbine',
    licenseLevel: 'Explosives Certified',
    specialties: ['Arson', 'Demolition'],
    successBonusPct: 15,
    killsCount: 39
  },
  {
    id: 'mem-soldier-3',
    name: 'Vito "Doc" Barone',
    role: 'Soldier',
    rankTitle: 'Street Medic & Locksmith',
    avatarSeed: 'vito-barone',
    avatarInitials: 'VB',
    status: 'active',
    healthPercent: 85,
    weapon: '.32 Pocket Revolver',
    licenseLevel: 'Level 1 Concealed',
    specialties: ['Medic', 'Safecracker'],
    successBonusPct: 10,
    killsCount: 12
  }
];

export const INITIAL_LIVE_OPERATIONS: LiveOperation[] = [];

export const INITIAL_CONSIGLIERE_ALERTS: ConsigliereAlert[] = [
  {
    id: 'alert-init',
    timestamp: '00:00',
    speaker: 'Tom Hagen Consigliere',
    message: 'غرفة العمليات جاهزة. لا توجد مقرات مضافة حالياً. انقر على الخريطة أو استخدم الإحداثيات لتسجيل مواقع ومقرات جديدة.',
    severity: 'intel'
  }
];

// 1. Initial Market Acquisition Targets (Ring Completion)
export const INITIAL_MARKET_TARGETS = [
  {
    id: 'target-1',
    stage: 'identified' as const,
    title: 'أنشطة مستهدفة',
    subtitle: 'IDENTIFIED',
    targetCount: 20,
    actualCount: 0,
    timeframe: 'الربع الحالي',
    description: 'عدد الأنشطة التجارية المستهدفة التي تم التعرف عليها في السوق.',
    lastUpdated: 'اليوم',
  },
  {
    id: 'target-2',
    stage: 'contacted' as const,
    title: 'جهات متواصل معها',
    subtitle: 'CONTACTED',
    targetCount: 15,
    actualCount: 0,
    timeframe: 'الربع الحالي',
    description: 'عدد الجهات التي تم التواصل معها فعليًا وفتح قنوات حديث.',
    lastUpdated: 'اليوم',
  },
  {
    id: 'target-3',
    stage: 'meetings' as const,
    title: 'اجتماعات وزيارات',
    subtitle: 'MEETINGS',
    targetCount: 10,
    actualCount: 0,
    timeframe: 'الربع الحالي',
    description: 'عدد الاجتماعات الميدانية أو الزيارات المنفذة لاستكشاف الاحتياج.',
    lastUpdated: 'اليوم',
  },
  {
    id: 'target-4',
    stage: 'opportunities' as const,
    title: 'فرص مهنية فعلية',
    subtitle: 'QUALIFIED',
    targetCount: 5,
    actualCount: 0,
    timeframe: 'الربع الحالي',
    description: 'عدد العلاقات المهنية التي تطورت إلى فرص ومشاريع فعلية.',
    lastUpdated: 'اليوم',
  },
];

// 2. Initial Strategic Perks (Opportunities)
export const INITIAL_OPPORTUNITIES = [];

// 3. Initial Revenue Breakdown Transactions
export const INITIAL_FINANCIAL_TRANSACTIONS = [];

// 4. Initial Organizational Hierarchy (Business Process Architecture)
export const INITIAL_BUSINESS_HIERARCHY = [
  {
    id: 'proc-supply',
    name: 'مرحلة التوريد والإمداد (Procurement)',
    level: 'phase' as const,
    parentId: null,
    clientOrProject: 'نموذج النشاط الافتراضي',
    status: 'data-gathering' as const,
    evidenceNotes: 'فحص دورات طلب المواد والموردين وقوائم الأسعار الحالية.',
    detectedGaps: 'تأخر في تسليم الخامات وتباين فواتير التوريد.',
    interventions: 'وضع آلية رقمية لتتبع الموردين وتوحيد أوامر الشراء.',
    measuredResults: 'قيد القياس الأولي.',
    updatedAt: '2026-10-11',
  },
  {
    id: 'proc-prod',
    name: 'مرحلة التشغيل والإنتاج (Operations)',
    level: 'phase' as const,
    parentId: null,
    clientOrProject: 'نموذج النشاط الافتراضي',
    status: 'uninspected' as const,
    evidenceNotes: 'مراجعة خطوط الإنتاج والفاقد وسجلات الورديات.',
    detectedGaps: '',
    interventions: '',
    measuredResults: '',
    updatedAt: '2026-10-11',
  },
  {
    id: 'proc-sales',
    name: 'مرحلة المبيعات والتوزيع (Sales & Distribution)',
    level: 'phase' as const,
    parentId: null,
    clientOrProject: 'نموذج النشاط الافتراضي',
    status: 'gap-detected' as const,
    evidenceNotes: 'تحليل قنوات البيع ونقاط التوزيع وإيرادات العملاء.',
    detectedGaps: 'عدم وجود نظام مركزي لتتبع أوامر العملاء وفواتير الآجل.',
    interventions: 'تصميم لوحة مؤشرات أداء للتدفقات النقدية والمبيعات.',
    measuredResults: '',
    updatedAt: '2026-10-11',
  },
  {
    id: 'proc-finance',
    name: 'قسم الإدارة والرقابة المالية (Finance & Control)',
    level: 'department' as const,
    parentId: 'proc-sales',
    clientOrProject: 'نموذج النشاط الافتراضي',
    status: 'improving' as const,
    evidenceNotes: 'مراجعة الحسابات والتكاليف الثابتة والمتغيرة.',
    detectedGaps: 'تأخر إعداد التقارير الشهرية لأكثر من 20 يوماً.',
    interventions: 'أتمتة تقرير الإيرادات والتكاليف وتحديد نقطة التعادل.',
    measuredResults: 'تقليص وقت إصدار التقارير إلى 48 ساعة.',
    updatedAt: '2026-10-11',
  },
];

// 5. Initial Member Profiles (Professional & Business Relationships)
export const INITIAL_RELATIONSHIPS = [];

