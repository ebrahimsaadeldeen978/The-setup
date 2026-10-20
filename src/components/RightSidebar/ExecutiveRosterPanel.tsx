import React, { useState } from 'react';
import { 
  Users, 
  Settings, 
  ChevronRight, 
  Shield, 
  Crosshair, 
  Key, 
  Truck, 
  Diamond, 
  Building2, 
  Scale,
  Briefcase,
  Layers,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  BadgePercent,
  Cpu,
  TrendingUp,
  GitBranch,
  ArrowUpRight,
  ListOrdered,
  Trash2
} from 'lucide-react';
import { 
  HierarchyProcessNode, 
  RelationshipContact,
  HierarchyNodeStatus,
  RelationshipRole,
  OrganizationHierarchyModel,
  LadderRoadmapModel,
  DepartmentKey
} from '../../types/dashboard';
import { isClientOrContractedPin } from '../../utils/activityStatusHelpers';
import { InactiveActivityNotice } from '../Common/InactiveActivityNotice';
import { EmptyLocationContactsNotice } from '../Common/EmptyLocationContactsNotice';

interface ExecutiveRosterPanelProps {
  // 4. Organizational Hierarchy (4 Departments & 6-Step Ladder)
  hierarchyNodes?: HierarchyProcessNode[];
  orgHierarchy?: OrganizationHierarchyModel;
  ladderRoadmap?: LadderRoadmapModel;
  onOpenHierarchyTree: (initialView?: 'departments' | 'ladder', selectedItemKey?: string) => void;

  // 5. Member Profiles (Professional & Business Relationships)
  relationships: RelationshipContact[];
  onSelectRelationship: (contact: RelationshipContact) => void;
  onOpenAddRelationship: () => void;
  onOpenAllRelationships: () => void;
  onDeleteRelationship?: (contactId: string) => void;

  // Selected Location from Map
  selectedLocation?: import('../../types/dashboard').RacketNode | null;
}

export const ExecutiveRosterPanel: React.FC<ExecutiveRosterPanelProps> = ({
  hierarchyNodes = [],
  orgHierarchy,
  ladderRoadmap,
  onOpenHierarchyTree,
  relationships,
  onSelectRelationship,
  onOpenAddRelationship,
  onOpenAllRelationships,
  onDeleteRelationship,
  selectedLocation = null,
}) => {
  // Internal view switcher for Card 1: 'departments' (4 Core Departments) or 'ladder' (6-Step Ladder)
  const [activeHierarchyView, setActiveHierarchyView] = useState<'departments' | 'ladder'>('departments');
  const [selectedStepKey, setSelectedStepKey] = useState<string | null>('step-1');

  // Determine if selected location is an active client or contracted entity
  const isClientOrContracted = isClientOrContractedPin(selectedLocation);

  // Filter contacts belonging to this location (or none if no location selected)
  const displayedRelationships = selectedLocation
    ? relationships.filter(r => 
        (r.locationId && r.locationId === selectedLocation.id) ||
        (r.organization && selectedLocation.name && r.organization.trim().toLowerCase().includes(selectedLocation.name.trim().toLowerCase())) ||
        (r.organization && selectedLocation.name && selectedLocation.name.trim().toLowerCase().includes(r.organization.trim().toLowerCase()))
      )
    : [];

  // Departments safe fallback
  const departments = orgHierarchy?.departments || [
    { key: 'finance' as DepartmentKey, name: 'Financial Management', arabicName: 'إدارة المالية', description: 'السيولة والتكاليف', iconName: 'BadgePercent', color: '#15803D', score: 82, metrics: [] },
    { key: 'operations' as DepartmentKey, name: 'Operations Management', arabicName: 'إدارة التشغيل', description: 'الجودة والتسليم', iconName: 'Cpu', color: '#B31B24', score: 87, metrics: [] },
    { key: 'hr' as DepartmentKey, name: 'Human Resources', arabicName: 'الموارد البشرية', description: 'الإنتاجية والفريق', iconName: 'Users', color: '#D97706', score: 79, metrics: [] },
    { key: 'marketing' as DepartmentKey, name: 'Marketing & Sales', arabicName: 'التسويق والمبيعات', description: 'الفرص والمبيعات', iconName: 'TrendingUp', color: '#7C3AED', score: 81, metrics: [] },
  ];

  // Calculated overall score
  const overallOrgScore = orgHierarchy?.overallScore ?? Math.round(
    departments.reduce((sum, d) => sum + d.score, 0) / (departments.length || 1)
  );

  // Ladder safe fallback
  const ladderSteps = ladderRoadmap?.steps || [];
  const ladderOverall = ladderRoadmap?.overallProgress ?? 74;

  const getRoleLabel = (role: RelationshipRole) => {
    switch (role) {
      case 'potential-client': return 'عميل محتمل';
      case 'active-client': return 'عميل حالي';
      case 'supplier': return 'مورد';
      case 'potential-partner': return 'شريك محتمل';
      case 'advisor': return 'مستشار';
      default: return 'علاقة مهنية';
    }
  };

  const getDepartmentIcon = (key: DepartmentKey) => {
    switch (key) {
      case 'finance': return <BadgePercent className="w-3 h-3 text-[#15803D]" />;
      case 'operations': return <Cpu className="w-3 h-3 text-[#B31B24]" />;
      case 'hr': return <Users className="w-3 h-3 text-[#D97706]" />;
      case 'marketing': return <TrendingUp className="w-3 h-3 text-[#7C3AED]" />;
      default: return <Building2 className="w-3 h-3 text-[#554F59]" />;
    }
  };

  return (
    <aside className="w-[300px] lg:w-[330px] shrink-0 flex flex-col gap-3 p-3 overflow-y-auto custom-scrollbar z-30">
      
      {/* 1. CARD 1: ORGANIZATIONAL HIERARCHY (Top Card - Business Architecture & 4 Departments / 6-Step Ladder) */}
      <div className="command-card p-3 space-y-2.5 bg-[#FCFAF6] border border-[#E5DECE] rounded-xl hover:border-[#1C191E] transition-all">
        {/* Title bar with View Switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h2 className="font-serif-title text-xs font-bold uppercase tracking-wider text-[#1C191E] flex items-center gap-1">
              <span>ORGANIZATIONAL HIERARCHY</span>
            </h2>
          </div>
          {isClientOrContracted ? (
            <button 
              onClick={() => onOpenHierarchyTree(activeHierarchyView)}
              className="text-[#9A94A0] hover:text-[#B31B24] transition-colors cursor-pointer p-1 rounded hover:bg-[#F5F2EB]"
              title="تخصيص وإدارة هيكل العمليات والأقسام والمقاييس"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#F4EFE6] border border-[#E2DACB] text-[#7A747D] font-bold">
              غير مفعّل
            </span>
          )}
        </div>

        {isClientOrContracted ? (
          <>
            {/* View Switcher: Lively, sleek tabs */}
            <div className="grid grid-cols-2 gap-1 p-0.5 rounded-lg bg-[#F2EDE4] border border-[#E2DACB] text-[9.5px] font-bold">
              <button
                type="button"
                onClick={() => setActiveHierarchyView('departments')}
                className={`py-1 px-2 rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  activeHierarchyView === 'departments'
                    ? 'bg-[#FFFFFF] text-[#B31B24] shadow-xs border border-[#E0D8C8]'
                    : 'text-[#7A747D] hover:text-[#1C191E]'
                }`}
              >
                <GitBranch className="w-3 h-3" />
                <span>الأقسام الـ 4 ({overallOrgScore}%)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveHierarchyView('ladder')}
                className={`py-1 px-2 rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  activeHierarchyView === 'ladder'
                    ? 'bg-[#FFFFFF] text-[#B31B24] shadow-xs border border-[#E0D8C8]'
                    : 'text-[#7A747D] hover:text-[#1C191E]'
                }`}
              >
                <ListOrdered className="w-3 h-3" />
                <span>سلّم الـ 6 خطوات ({ladderOverall}%)</span>
              </button>
            </div>

            {/* HIERARCHICAL VIEW CONTAINER */}
            <div>
              {/* VIEW 1: 4 CORE DEPARTMENTS CELL TREE */}
              {activeHierarchyView === 'departments' && (
              <div 
                className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] flex flex-col items-center hover:border-[#B31B24] transition-all group/tree relative"
              >
                {/* Top Root Node: THE ORGANIZATION / BUSINESS CELL */}
                <div 
                  onClick={() => onOpenHierarchyTree('departments')}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#B31B24] shadow-xs flex items-center justify-between text-center cursor-pointer hover:bg-[#FDF8F8] transition-colors"
                  title="المنظومة ككل: اضغط لفتح شجرة الأقسام بالكامل"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Scale className="w-3.5 h-3.5 text-[#B31B24] shrink-0" />
                    <span className="font-serif-title text-[10px] font-bold text-[#1C191E] truncate">
                      {selectedLocation ? selectedLocation.name : (orgHierarchy?.organizationName || 'المؤسسة التجارية')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[7.5px] uppercase text-[#7A747D] font-bold">الأداء العام:</span>
                    <span className={`text-[10px] font-mono-num font-bold px-1.5 py-0.2 rounded ${
                      overallOrgScore >= 80 ? 'bg-[#DCFCE7] text-[#15803D]' :
                      overallOrgScore >= 65 ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-[#FEE2E2] text-[#DC2626]'
                    }`}>
                      {overallOrgScore}%
                    </span>
                  </div>
                </div>

                {/* Connecting Line down to 4 departments */}
                <div className="w-px h-2 bg-[#D5CDC0]" />

                {/* Branching Bar */}
                <div className="w-[88%] h-px bg-[#D5CDC0] relative" />

                {/* 4 Departments Grid (مالية، تشغيل، موارد بشرية، تسويق) */}
                <div className="w-full grid grid-cols-2 gap-1.5 mt-1.5">
                  {departments.map((dept) => {
                    const metricsCount = dept.metrics?.length || 0;
                    return (
                      <div
                        key={dept.key}
                        onClick={() => onOpenHierarchyTree('departments', dept.key)}
                        className="p-1.5 rounded-lg bg-[#FFFFFF] border border-[#E2DACB] hover:border-[#B31B24] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group/node"
                        title={`${dept.arabicName}: اضغط لإدارة المقاييس`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1 truncate">
                            {getDepartmentIcon(dept.key)}
                            <span className="text-[9px] font-bold text-[#1C191E] truncate font-serif-title">
                              {dept.arabicName}
                            </span>
                          </div>
                          <span className={`text-[9px] font-mono-num font-bold ${
                            dept.score >= 80 ? 'text-[#15803D]' :
                            dept.score >= 65 ? 'text-[#D97706]' : 'text-[#DC2626]'
                          }`}>
                            {dept.score}%
                          </span>
                        </div>

                        {/* Mini progress bar and metric count */}
                        <div className="mt-1 flex items-center justify-between gap-1 text-[7.5px] text-[#7A747D]">
                          <div className="flex-1 bg-[#EFEAE0] h-1 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all"
                              style={{ 
                                width: `${Math.min(100, dept.score)}%`,
                                backgroundColor: dept.color || '#B31B24' 
                              }}
                            />
                          </div>
                          <span className="font-mono-num">{metricsCount} م</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer hint */}
                <div className="flex items-center justify-between w-full mt-2 pt-1.5 border-t border-[#EFEAE0] text-[8px] text-[#7A747D]">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                    <span>مؤشر الأقسام يحدد الأداء الكلي</span>
                  </span>
                  <button
                    onClick={() => onOpenHierarchyTree('departments')}
                    className="text-[#B31B24] hover:text-[#8A181F] font-bold flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>تفاصيل المقاييس</span>
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 2: 6-STEP LADDER ROADMAP - CONTINUOUS CONNECTED LINE */}
            {activeHierarchyView === 'ladder' && (
              <div 
                className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] flex flex-col hover:border-[#B31B24] transition-all"
              >
                {/* Ladder Header */}
                <div 
                  onClick={() => onOpenHierarchyTree('ladder')}
                  className="flex items-center justify-between pb-2 mb-2 border-b border-[#EFEAE0] cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <ListOrdered className="w-3.5 h-3.5 text-[#B31B24]" />
                    <span className="text-[10px] font-bold text-[#1C191E] font-serif-title">
                      مسار النضج التشغيلي (خط متصل)
                    </span>
                  </div>
                  <span className="text-[9.5px] font-mono-num font-bold text-[#B31B24] px-1.5 py-0.5 rounded bg-[#F7D5D8] border border-[#E89EAA]">
                    {ladderOverall}% إنجاز
                  </span>
                </div>

                {/* CONTINUOUS CONNECTED LINE (خط متصل أنيق بدون نوافذ منفصلة) */}
                <div className="relative pl-1 pr-1 py-1">
                  {/* The continuous connecting background track line */}
                  <div className="absolute top-4 bottom-4 right-[15px] w-0.5 bg-[#E2DACB] z-0" />
                  
                  {/* The filled progress line based on overall completion */}
                  <div 
                    className="absolute top-4 right-[15px] w-0.5 bg-gradient-to-b from-[#15803D] via-[#B31B24] to-[#E2DACB] z-0 transition-all duration-500" 
                    style={{ height: `${Math.min(94, Math.max(10, ladderOverall))}%` }}
                  />

                  {/* 6 Steps sitting on the continuous line */}
                  <div className="space-y-2.5 relative z-10">
                    {ladderSteps.slice(0, 6).map((step) => {
                      const isSelected = selectedStepKey === step.id;
                      const isDone = step.status === 'completed' || step.score === 100;
                      const inProgress = step.status === 'in_progress';

                      return (
                        <div key={step.id} className="relative">
                          {/* Station node directly on the connected line */}
                          <div
                            onClick={() => setSelectedStepKey(isSelected ? null : step.id)}
                            className={`flex items-center gap-2 cursor-pointer transition-all group/step py-0.5 select-none ${
                              isSelected ? 'text-[#B31B24]' : 'text-[#1C191E]'
                            }`}
                            title={`${step.title} - انقر لتنبثق المؤشرات عمودياً`}
                          >
                            {/* Connected node circle */}
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[9px] font-mono-num shrink-0 transition-all shadow-xs ${
                              isDone 
                                ? 'bg-[#15803D] text-white ring-2 ring-[#DCFCE7]' :
                              inProgress 
                                ? 'bg-[#B31B24] text-white ring-2 ring-[#F7D5D8] animate-pulse' :
                              isSelected
                                ? 'bg-[#B31B24] text-white ring-2 ring-[#F7D5D8]' :
                                'bg-[#FFFFFF] border-2 border-[#D5CDC0] text-[#7A747D]'
                            }`}>
                              {step.stepNumber}
                            </div>

                            {/* Step Title Label along the line */}
                            <div className="flex-1 flex items-center justify-between min-w-0 pr-0.5">
                              <span className={`text-[9.5px] font-bold truncate transition-colors ${
                                isSelected ? 'text-[#B31B24] font-serif-title' : 'text-[#1C191E] group-hover/step:text-[#B31B24]'
                              }`}>
                                {step.title}
                              </span>

                              <div className="flex items-center gap-1.5 shrink-0 mr-1">
                                <span className={`text-[9px] font-mono-num font-bold ${
                                  step.score >= 80 ? 'text-[#15803D]' :
                                  step.score >= 60 ? 'text-[#D97706]' : 'text-[#B31B24]'
                                }`}>
                                  {step.score}%
                                </span>
                                <ChevronRight className={`w-3 h-3 text-[#9A94A0] transition-transform duration-200 ${
                                  isSelected ? 'rotate-90 text-[#B31B24]' : ''
                                }`} />
                              </div>
                            </div>
                          </div>

                          {/* VERTICAL DROP-DOWN INDICATORS (ينبثق تحته عمودياً المؤشرات) */}
                          {isSelected && (
                            <div className="mr-8 mt-1.5 mb-2 p-2 rounded-lg bg-[#FFFFFF] border border-[#E2DACB] shadow-xs space-y-1.5 animate-in slide-in-from-top-2 duration-150">
                              <div className="flex items-center justify-between text-[8px] text-[#7A747D] pb-1 border-b border-[#EFEAE0]">
                                <span className="font-bold">المؤشرات التابعة ({step.metrics.length})</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenHierarchyTree('ladder', step.id);
                                  }}
                                  className="text-[#B31B24] hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
                                >
                                  <span>إدارة وربط المصادر</span>
                                  <ArrowUpRight className="w-2.5 h-2.5" />
                                </button>
                              </div>

                              {/* Vertical list of metrics */}
                              {step.metrics.length === 0 ? (
                                <p className="text-[8.5px] text-[#9A94A0] text-center py-1">لا توجد مؤشرات مسجلة لهذه الخطوة بعد</p>
                              ) : (
                                step.metrics.map((m) => (
                                  <div key={m.id} className="p-1.5 rounded bg-[#FAF8F5] border border-[#EFEAE0] space-y-1">
                                    <div className="flex items-center justify-between gap-1 text-[8.5px]">
                                      <span className="font-bold text-[#1C191E] truncate" title={m.name}>
                                        {m.name}
                                      </span>
                                      <span className="font-mono-num font-bold text-[#B31B24] shrink-0">
                                        {m.percentage}%
                                      </span>
                                    </div>

                                    {/* Data Source Badge if linked */}
                                    {m.dataSource && (
                                      <div className="flex items-center gap-1 text-[7px] text-[#7A747D]">
                                        <span className={`px-1 py-0.2 rounded font-bold ${
                                          m.dataSource.type === 'google_form' ? 'bg-[#EDE9FE] text-[#7C3AED]' :
                                          m.dataSource.type === 'google_sheet' ? 'bg-[#DCFCE7] text-[#15803D]' :
                                          m.dataSource.type === 'excel' ? 'bg-[#E0F2FE] text-[#0284C7]' :
                                          m.dataSource.type === 'csv' ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-[#EFEAE0] text-[#554F59]'
                                        }`}>
                                          {m.dataSource.type === 'google_form' ? 'جوجل فورم' :
                                           m.dataSource.type === 'google_sheet' ? 'جوجل شيت' :
                                           m.dataSource.type === 'excel' ? 'إكسل' :
                                           m.dataSource.type === 'csv' ? 'CSV' : 'يدوي'}
                                        </span>
                                        {m.dataSource.column && (
                                          <span className="truncate">عمود: {m.dataSource.column}</span>
                                        )}
                                      </div>
                                    )}

                                    {/* Progress line */}
                                    <div className="w-full bg-[#E5DECE] h-1 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-[#B31B24] rounded-full transition-all"
                                        style={{ width: `${Math.min(100, m.percentage)}%` }}
                                      />
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer hint */}
                <div className="flex items-center justify-between w-full mt-2 pt-1.5 border-t border-[#EFEAE0] text-[8px] text-[#7A747D]">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B31B24]" />
                    <span>انقر على أي خطوة لإظهار مؤشراتها</span>
                  </span>
                  <button
                    onClick={() => onOpenHierarchyTree('ladder')}
                    className="text-[#B31B24] hover:text-[#8A181F] font-bold flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>فتح السلّم وربط البيانات</span>
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            )}
            </div>

            {/* Row of 7 Specialty Badges matching exact original card icons */}
            <div className="flex items-center justify-between pt-1 border-t border-[#EFEAE0]">
              <div className="p-1 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[#B31B24]" title="استكشاف وفحص">
                <Crosshair className="w-3 h-3" />
              </div>
              <div className="p-1 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[#D97706]" title="تحليل فجوات">
                <Key className="w-3 h-3" />
              </div>
              <div className="p-1 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[#554F59]" title="إدارة عمليات">
                <Building2 className="w-3 h-3" />
              </div>
              <div className="p-1 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[#B31B24]" title="سلاسل إمداد وتوريد">
                <Truck className="w-3 h-3" />
              </div>
              <div className="p-1 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[#7C3AED]" title="مخرجات ونموذج عمل">
                <Diamond className="w-3 h-3" />
              </div>
              <div className="p-1 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[#15803D]" title="تحسين وتدخل مقاس">
                <Shield className="w-3 h-3" />
              </div>
              <div className="p-1 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[#B31B24]" title="فريق العمل والوظائف">
                <Users className="w-3 h-3" />
              </div>
            </div>
          </>
        ) : (
          <InactiveActivityNotice selectedLocation={selectedLocation} compact={true} />
        )}
      </div>

      {/* 2. CARD 2: MEMBER PROFILES (Bottom Card - Professional & Business Relationships) */}
      <div className="command-card p-3 space-y-2.5 flex-1 flex flex-col bg-[#FCFAF6] border border-[#E5DECE] rounded-xl hover:border-[#1C191E] transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 truncate">
            <h2 className="font-serif-title text-xs font-bold uppercase tracking-wider text-[#1C191E] flex items-center gap-1.5 truncate">
              <span>MEMBER PROFILES</span>
              <span className="text-[10px] text-[#7A747D] font-normal normal-case font-sans">
                {selectedLocation ? `(${displayedRelationships.length})` : '(جهات الاتصال)'}
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <button 
              type="button"
              onClick={selectedLocation ? onOpenAddRelationship : undefined}
              disabled={!selectedLocation}
              className={`p-1 rounded transition-colors ${
                selectedLocation
                  ? 'bg-[#F7D5D8] border border-[#E89EAA] text-[#B31B24] hover:bg-[#B31B24] hover:text-white cursor-pointer'
                  : 'bg-[#F4F1EA] border border-[#E5DECE] text-[#A8A1AF] cursor-not-allowed opacity-40'
              }`}
              title={selectedLocation ? "إضافة جهة اتصال لهذا الموقع" : "يجب تحديد دبوس على الخريطة أولاً لإنشاء جهة اتصال"}
            >
              <Plus className="w-3 h-3" />
            </button>
            <button 
              type="button"
              onClick={onOpenAllRelationships}
              className="text-[#9A94A0] hover:text-[#B31B24] transition-colors cursor-pointer p-1"
              title="عرض كل العلاقات والتواصل"
            >
              <Users className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Contacts Roster matching original styling */}
        <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[220px] custom-scrollbar pr-0.5">
          {!selectedLocation ? (
            <EmptyLocationContactsNotice compact={true} />
          ) : displayedRelationships.length === 0 ? (
            <div className="p-4 text-center text-xs text-[#7A747D] bg-[#FAF8F5] rounded-xl border border-[#E5DECE]">
              <Users className="w-6 h-6 text-[#7A747D] mx-auto mb-1 opacity-40" />
              <p className="font-semibold text-[11px] text-[#1C191E]">لا توجد علاقات مسجلة لهذا الموقع بعد</p>
              <p className="text-[9px] mt-0.5 text-[#8A181F] font-bold">{selectedLocation.name}</p>
              <button
                type="button"
                onClick={onOpenAddRelationship}
                className="mt-2 px-2.5 py-1 rounded bg-[#B31B24] text-white text-[10px] font-bold hover:bg-[#8A181F] transition-colors cursor-pointer"
              >
                + إضافة جهة اتصال لهذا الموقع
              </button>
            </div>
          ) : (
            displayedRelationships.map((contact) => (
              <div 
                key={contact.id}
                onClick={() => onSelectRelationship(contact)}
                className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] hover:border-[#B31B24] transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#E0D8C8] overflow-hidden flex items-center justify-center font-serif-title font-bold text-xs text-[#B31B24] shadow-xs shrink-0">
                    {contact.photoUrl ? (
                      <img src={contact.photoUrl} alt={contact.name} className="w-full h-full object-cover" />
                    ) : (
                      contact.avatarInitials || contact.name.slice(0, 2)
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-[#1C191E] group-hover:text-[#B31B24] transition-colors truncate">
                        {contact.name}
                      </span>
                      {contact.trustLevel && (
                        <span className="text-[7.5px] font-bold px-1.5 py-0.2 rounded bg-[#DCFCE7] text-[#15803D] shrink-0">
                          {contact.trustLevel}
                        </span>
                      )}
                    </div>
                    <div className="text-[9px] text-[#7A747D] truncate">
                      {contact.jobTitle || contact.organization || 'تواصل مهني'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 text-[#9A94A0] transition-colors">
                  <span className="text-[8.5px] font-mono-num text-[#7A747D]">
                    {contact.lastContactDate || 'اليوم'}
                  </span>
                  {onDeleteRelationship && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRelationship(contact.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-[#7A747D] hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                      title="حذف جهة الاتصال"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 group-hover:text-[#B31B24]" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info & view all button */}
        <div className="pt-2 border-t border-[#EFEAE0] flex items-center justify-between text-[9px] text-[#7A747D]">
          <span>إجمالي الاتصالات: <strong className="text-[#1C191E] font-mono-num">{relationships.length}</strong></span>
          <button 
            onClick={onOpenAllRelationships}
            className="text-[#B31B24] hover:text-[#8A181F] font-bold flex items-center gap-0.5 cursor-pointer"
          >
            <span>عرض السجل المهني</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

    </aside>
  );
};
