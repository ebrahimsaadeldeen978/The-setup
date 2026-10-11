/**
 * Core Types for Don's View Empire Operations Command
 */

export type TerritoryRegion = string;

export type SectorIconType = 
  | 'Building' 
  | 'Landmark' 
  | 'Palmtree' 
  | 'Crown' 
  | 'Shield' 
  | 'Star' 
  | 'Anchor' 
  | 'Navigation' 
  | 'Compass' 
  | 'Crosshair';

export interface CitySector {
  id: string;
  name: string;
  lat: number;
  lng: number;
  zoom: number;
  iconName: SectorIconType;
}

export type RacketType = 
  | 'Warehouse' 
  | 'Diner' 
  | 'Chop Shop' 
  | 'Shipping Docks' 
  | 'Casino' 
  | 'Armory' 
  | 'Smuggling Depot' 
  | 'Extortion Front';

export type MapLocationCategory = 
  | 'potential-client'       // عملاء محتملون
  | 'current-client'         // عملاء حاليون
  | 'business-supplier'      // أنشطة تجارية وموردون
  | 'conference-event'       // مؤتمرات وفعاليات مهنية
  | 'cafe-coworking'         // كافيهات ومطاعم ومساحات عمل
  | 'meeting-visit-site';    // مواقع الزيارات والاجتماعات السابقة

export type LocationImportance = 'high' | 'medium' | 'low';

export type LocationActivityStatus = 
  | 'active'       // نشط / قيد المتابعة
  | 'scheduled'    // مجدول / محدد له موعد
  | 'completed'    // مكتمل / تم اللقاء
  | 'potential'    // فرصة محتملة
  | 'dormant';     // خامل / مؤجل

export interface BusinessModelCanvas {
  keyPartners: string;           // الشركاء الرئيسيون
  keyActivities: string;         // الأنشطة الرئيسية
  keyResources: string;          // الموارد الرئيسية
  valuePropositions: string;     // القيمة المقدمة وعروض القيمة
  customerRelationships: string; // العلاقات مع العملاء
  channels: string;              // قنوات التواصل والتوزيع
  customerSegments: string;      // شرائح العملاء المستهدفة
  costStructure: string;         // هيكل التكاليف
  revenueStreams: string;        // مصادر الإيرادات وتدفقات الدخل
  notes?: string;                // ملاحظات استراتيجية
}

export interface RacketNode {
  id: string;
  name: string;
  type: RacketType;
  region: TerritoryRegion;
  x: number; // percentage coordinate 0-100 on map
  y: number; // percentage coordinate 0-100 on map
  lat: number; // Real geographic latitude
  lng: number; // Real geographic longitude
  status: OwnershipStatus;
  controllingSyndicate: string;
  hourlyIncome: number;
  defenseLevel: number; // 0 - 100
  maxDefense: number;
  guardCount: number;
  maxGuards: number;
  ringCategory: string; // e.g. "Chop Shops", "Arms Smuggling", "Gambling"
  strategicBonusText: string;
  underAttack?: boolean;
  smokeEffect?: boolean;
  assignedCapo?: string;
  lastIncident?: string;

  // New Career & Professional Map Location Fields:
  locationCategory?: MapLocationCategory; // تصنيف النقطة
  locationImportance?: LocationImportance; // درجة الأهمية
  activityStatus?: LocationActivityStatus; // حالة النقطة
  hexColor?: string; // كود اللون السداسي المخصص (Hex Code)
  customIcon?: string; // اسم الأيقونة المختارة
  lastInteractionDate?: string; // تاريخ آخر تفاعل
  addressDetails?: string; // تفاصيل العنوان أو المنطقة
  notes?: string; // ملاحظات عامة
  businessCanvas?: BusinessModelCanvas; // نموذج العمل التجاري (Business Model Canvas) للعملاء
}

export interface CrimeRing {
  id: string;
  name: string;
  category: string;
  totalVenues: number;
  ownedVenues: number;
  bonusTitle: string;
  multiplierText: string;
  bonusDescription: string;
  isUnlocked: boolean;
  iconType: string;
}

export type FamilyRank = 'Don' | 'Consigliere' | 'Underboss' | 'Caporegime' | 'Soldier';

export type MemberSpecialty = 
  | 'Demolition' 
  | 'Arson' 
  | 'Safecracker' 
  | 'Bruiser' 
  | 'Medic' 
  | 'Enforcer'
  | 'Sniper';

export interface FamilyMember {
  id: string;
  name: string;
  role: FamilyRank;
  rankTitle: string;
  avatarSeed: string;
  avatarInitials: string;
  status: 'active' | 'assigned' | 'hospitalized';
  healthPercent: number;
  assignedLocation?: string;
  assignedMission?: string;
  weapon: string;
  licenseLevel: string;
  specialties: MemberSpecialty[];
  successBonusPct: number;
  killsCount: number;
}

export interface LiveOperation {
  id: string;
  title: string;
  targetNodeId: string;
  targetNodeName: string;
  operationType: 'takeover' | 'reinforce' | 'arson_bomb' | 'extort' | 'defend';
  progressPercent: number;
  remainingSeconds: number;
  totalDurationSeconds: number;
  assignedMemberIds: string[];
  successProbability: number;
  status: 'in-progress' | 'succeeded' | 'failed';
  startedAt: string;
}

export interface ConsigliereAlert {
  id: string;
  timestamp: string;
  speaker: string;
  message: string;
  severity: 'critical' | 'warning' | 'intel' | 'financial';
}

export interface EmpireFinancials {
  totalWealth: number;
  netHourlyRevenue: number;
  territoryControlPercentage: number;
  dailyExtortionYield: number;
  activeGuardsPayroll: number;
}

// ==========================================
// Professional Journey & Opportunity System Types
// ==========================================

export type MarketGoalStage = 'identified' | 'contacted' | 'meetings' | 'opportunities';

export interface MarketAcquisitionTarget {
  id: string;
  stage: MarketGoalStage;
  title: string;
  subtitle: string;
  targetCount: number;
  actualCount: number;
  timeframe: string; // e.g. "Q1 2026", "هذا الشهر", "الربع الحالي"
  description?: string;
  lastUpdated?: string;
}

export type OpportunityStage = 
  | 'discovered'    // اكتُشفت
  | 'verifying'     // قيد التحقق
  | 'ready'         // جاهزة للتقديم
  | 'in-progress'   // قيد التنفيذ
  | 'completed'     // مكتملة
  | 'paused';       // متوقفة

export interface StrategicOpportunity {
  id: string;
  title: string;
  organization: string; // الجهة المرتبطة بها
  shortDescription: string;
  availableEvidence: string; // الأدلة المتاحة
  stage: OpportunityStage; // الحالة الحالية
  nextStep: string; // الخطوة التالية
  followUpDate: string; // موعد المتابعة
  estimatedValue?: number;
  notes?: string;
  createdAt: string;
}

export type FinancialCategory = 
  | 'data-analysis'    // تحليل البيانات
  | 'consulting'       // استشارات
  | 'systems-impl'     // تنفيذ الأنظمة
  | 'other';           // أخرى

export interface FinancialTransaction {
  id: string;
  type: 'revenue' | 'cost'; // إيراد أم تكلفة
  amount: number;
  date: string;
  source: string; // المصدر
  clientOrProject: string; // المشروع أو العميل المرتبط
  category: FinancialCategory;
  notes?: string;
}

export type HierarchyNodeStatus = 
  | 'uninspected'   // لم يُفحص بعد
  | 'data-gathering'// قيد جمع البيانات أو الفهم
  | 'verified'      // تم فهمه والتحقق من المعلومات المتاحة
  | 'gap-detected'  // تم اكتشاف مشكلة أو فجوة فيه
  | 'improving'     // يجري العمل على تحسينه
  | 'measured';     // تم تنفيذ تدخل وقياس نتيجته

export interface HierarchyProcessNode {
  id: string;
  name: string;
  level: 'phase' | 'department' | 'process'; // مرحلة رئيسية | قسم | عملية
  parentId?: string | null;
  clientOrProject: string;
  status: HierarchyNodeStatus;
  evidenceNotes: string; // الملاحظات والأدلة
  detectedGaps?: string; // المشكلات والفجوات
  interventions?: string; // التدخلات
  measuredResults?: string; // النتائج المرتبطة
  updatedAt: string;
}

export type RelationshipRole = 
  | 'potential-client'  // عميل محتمل
  | 'active-client'     // عميل حالي
  | 'supplier'          // مورد
  | 'potential-partner' // شريك محتمل
  | 'advisor'           // مستشار / موجه
  | 'other';            // أخرى

export type RelationshipStatus = 
  | 'initial-contact'   // تواصل أولي
  | 'needs-analysis'    // تحليل احتياج
  | 'active-deal'       // صفقة / مشروع قائم
  | 'nurturing'         // متابعة وبناء ثقة
  | 'dormant';          // خامل

export interface RelationshipContact {
  id: string;
  name: string;
  organization: string; // الجهة أو النشاط
  roleType: RelationshipRole;
  relationshipStatus: RelationshipStatus;
  locationId?: string; // معرف النقطة أو النشاط التجاري المرتبط بالخريطة
  projectOrDeal?: string;
  lastContactDate: string; // تاريخ آخر تواصل
  lastContactResult: string; // نتيجة آخر تواصل
  nextStep: string; // الخطوة التالية المطلوبة
  nextStepDate: string; // موعدها
  interactionsLog?: {
    id: string;
    date: string;
    notes: string;
    outcome: string;
  }[];
  avatarInitials: string;
}

