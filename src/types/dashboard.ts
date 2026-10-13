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

export type OwnershipStatus = 'owned' | 'contested' | 'rival' | 'neutral';

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
  pinType?: string; // نوع الدبوس (lead, client, bussiness food, build the agreement, event, meeting, relationship)
  imageUrl?: string; // رابط أو كود الصورة التعبيرية لشكل المكان
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

// =========================================================
// 4-A. 4 Core Departments Architecture (الأقسام الأربعة الأساسية)
// =========================================================

export type DepartmentKey = 'finance' | 'operations' | 'hr' | 'marketing';

export interface DepartmentMetric {
  id: string;
  name: string;
  departmentKey: DepartmentKey;
  currentValue: number;
  targetValue: number;
  percentage: number; // 0 - 100%
  unit: string;
  weight?: number;
  notes?: string;
  status: 'healthy' | 'warning' | 'critical';
  updatedAt: string;
}

export interface DepartmentNode {
  key: DepartmentKey;
  name: string;
  arabicName: string;
  description: string;
  iconName: string;
  color: string;
  score: number; // calculated percentage %
  metrics: DepartmentMetric[];
}

export interface OrganizationHierarchyModel {
  organizationName: string;
  overallScore: number; // calculated average of 4 departments
  departments: DepartmentNode[];
  lastUpdated: string;
}

// =========================================================
// 4-B. 6-Step Operational Ladder (سلّم الـ 6 خطوات التشغيلية)
// =========================================================

export type LadderMetricSourceType = 'manual' | 'google_sheet' | 'google_form' | 'excel' | 'csv';

export interface LadderMetric {
  id: string;
  name: string;
  stepNumber: number;
  percentage: number;
  currentValue?: number;
  targetValue?: number;
  unit?: string;
  notes?: string;
  isCompleted?: boolean;
  status?: 'healthy' | 'warning' | 'critical';
  dataSource?: {
    type: LadderMetricSourceType;
    sourceUrlOrPath?: string;
    sheetName?: string;
    column?: string;
    aggregation?: 'sum' | 'avg' | 'max' | 'min' | 'count';
    filterCondition?: string;
    lastSynced?: string;
  };
}

export interface LadderStep {
  stepNumber: 1 | 2 | 3 | 4 | 5 | 6;
  id: string;
  title: string;
  subtitle: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending' | 'needs_attention';
  score: number; // 0 - 100%
  metrics: LadderMetric[];
}

export interface LadderRoadmapModel {
  overallProgress: number; // 0 - 100%
  steps: LadderStep[];
  currentActiveStep: number;
  lastUpdated: string;
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

// =========================================================
// 6. Client Main KPIs & 3 Donut Circles (Commerce, Influences, Trust)
// =========================================================

export type ClientKpiCategory = 'commerce' | 'influences' | 'trust';

export type CalculationMethod = 
  | 'sum'               // جمع الأرقام
  | 'average'           // المتوسط الحسابي
  | 'actual_vs_target'  // نسبة الفعلي إلى المستهدف (Actual / Target %)
  | 'min_max_scale'     // مقياس بين حد أدنى وأقصى
  | 'threshold'         // عتبة إنجاز
  | 'custom_ratio'      // معدل / نسبة مخصصة
  | 'survey_satisfaction' // نسبة رضا أو استبيان
  | 'compliance_percentage'; // نسبة مطابقة والتزام

export type DataSourceType = 'google_sheet' | 'excel_csv' | 'manual';

export type AggregationFunction = 'sum' | 'average' | 'max' | 'min' | 'count';
export type ArithmeticOperator = '+' | '-' | '*' | '/';
export type DisplayOutputFormat = 'percentage' | 'number';

export interface ColumnFilterRule {
  enabled: boolean;
  filterColumn?: string;      // مثلاً عمود التصنيف "النوع" أو "الجنس" أو "الفرع"
  operator: 'equals' | 'contains' | 'not_equals';
  value: string;              // مثلاً "ذكور" أو "إناث" أو "الرياض"
}

export interface FormulaColumnTerm {
  id: string;
  column: string;                  // اسم أو رمز العمود (مثال: B أو "المبيعات")
  aggregation: AggregationFunction; // مجموع، متوسط، أقصى، أدنى، عدد
  filter?: ColumnFilterRule;       // تصفية حسب قيمة معينة
  parenthesisOpen?: number;        // عدد الأقواس المفتوحة (
  parenthesisClose?: number;       // عدد الأقواس المغلقة )
  nextOperator?: ArithmeticOperator | null; // المعامل التالي (+, -, *, /)
}

export interface AdvancedFormulaConfig {
  sourceType: 'google_sheet' | 'excel_csv';
  formulaTitle?: string;
  filePath?: string;               // مسار الملف من الجهاز
  fileName?: string;               // اسم الملف المحلي
  sheetUrl?: string;               // رابط جوجل شيت
  sheetTabName?: string;           // اسم ورقة العمل / Tab
  terms: FormulaColumnTerm[];      // حدود المعادلة الحسابية
  outputFormat: DisplayOutputFormat; // 'percentage' | 'number'
  numberUnit?: string;             // وحدة القياس في حال اختيار رقم
  targetValue?: number;
  targetForNumber?: number;        // المستهدف لتحويل الرقم إلى نسبة للدائرة
  customFormulaString?: string;    // تعبير المعادلة النصي المقروء
  humanFormula?: string;
  calculatedResult?: number;       // الناتج الرقمي المحسوب
  calculatedRawValue?: number;
  calculatedPercentage?: number;   // النسبة المئوية الناتجة للدائرة
  evaluatedPercentage?: number;
}

export interface SheetIntegrationConfig {
  url?: string;
  sheetName?: string;
  dataColumn?: string;      // مثلاً العمود B أو "المبيعات"
  targetColumn?: string;    // عمود القيمة المستهدفة
  range?: string;           // مثلاً B2:B100
  lastSyncTime?: string;
  syncStatus?: 'connected' | 'idle' | 'error';
  sampleValues?: number[];
  notes?: string;
  formulaConfig?: AdvancedFormulaConfig;
}

export interface KpiMetricItem {
  id: string;
  category?: ClientKpiCategory;
  name: string;
  description: string;
  unit: string;
  currentValue: number;
  targetValue: number;
  percentage: number; // 0 - 100
  calculationMethod: CalculationMethod;
  dataSource: DataSourceType;
  status?: 'good' | 'warning' | 'danger';
  sheetConfig?: SheetIntegrationConfig;
  formulaConfig?: AdvancedFormulaConfig;
  weight?: number; // default 1
  updatedAt?: string;
}

export interface ClientKpiCircle {
  id: ClientKpiCategory;
  name: string;            // 'التجارة' | 'المؤثرات' | 'الثقة'
  englishName: string;     // 'Commerce' | 'Influences' | 'Trust'
  tagline: string;
  score: number;           // 0 - 100
  status: 'good' | 'warning' | 'danger';
  description: string;
  metrics: KpiMetricItem[];
  sheetUrl?: string;
  sheetName?: string;
  defaultDataColumn?: string;
  activeFormulaConfig?: AdvancedFormulaConfig;
  lastSyncedAt?: string;
}
