import React from 'react';
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
  Plus
} from 'lucide-react';
import { 
  HierarchyProcessNode, 
  RelationshipContact,
  HierarchyNodeStatus,
  RelationshipRole
} from '../../types/dashboard';

interface ExecutiveRosterPanelProps {
  // 4. Organizational Hierarchy (Business Understanding Tree)
  hierarchyNodes: HierarchyProcessNode[];
  onOpenHierarchyTree: () => void;

  // 5. Member Profiles (Professional & Business Relationships)
  relationships: RelationshipContact[];
  onSelectRelationship: (contact: RelationshipContact) => void;
  onOpenAddRelationship: () => void;
  onOpenAllRelationships: () => void;

  // Selected Location from Map
  selectedLocation?: import('../../types/dashboard').RacketNode | null;
}

export const ExecutiveRosterPanel: React.FC<ExecutiveRosterPanelProps> = ({
  hierarchyNodes,
  onOpenHierarchyTree,
  relationships,
  onSelectRelationship,
  onOpenAddRelationship,
  onOpenAllRelationships,
  selectedLocation = null,
}) => {
  // Determine if selected location is a commercial enterprise / client (shows Organizational Hierarchy)
  const isClientOrBusiness = !selectedLocation || (
    selectedLocation.locationCategory === 'potential-client' ||
    selectedLocation.locationCategory === 'current-client' ||
    selectedLocation.locationCategory === 'business-supplier' ||
    selectedLocation.controllingSyndicate === 'عميل مستهدف'
  );

  // Filter contacts belonging to this location (or all if none selected)
  const displayedRelationships = selectedLocation
    ? relationships.filter(r => 
        (r.locationId && r.locationId === selectedLocation.id) ||
        (r.organization && selectedLocation.name && r.organization.trim().toLowerCase().includes(selectedLocation.name.trim().toLowerCase())) ||
        (selectedLocation.name && r.name && selectedLocation.name.trim().toLowerCase().includes(r.organization.trim().toLowerCase()))
      )
    : relationships;

  // Filter hierarchy processes for this client/business if filtered, or all
  const displayedHierarchyNodes = selectedLocation
    ? hierarchyNodes.filter(n => 
        !n.clientOrProject || 
        n.clientOrProject === 'عام' || 
        n.clientOrProject === 'نموذج النشاط الافتراضي' ||
        n.clientOrProject.toLowerCase().includes(selectedLocation.name.toLowerCase())
      )
    : hierarchyNodes;

  // Stage counts for small summary
  const uninspectedCount = displayedHierarchyNodes.filter(n => n.status === 'uninspected').length;
  const verifiedCount = displayedHierarchyNodes.filter(n => n.status === 'verified').length;
  const gapCount = displayedHierarchyNodes.filter(n => n.status === 'gap-detected').length;
  const improvingCount = displayedHierarchyNodes.filter(n => n.status === 'improving').length;

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

  return (
    <aside className="w-[300px] lg:w-[330px] shrink-0 flex flex-col gap-3 p-3 overflow-y-auto custom-scrollbar z-30">
      
      {/* 1. CARD 1: ORGANIZATIONAL HIERARCHY (Top Card - Business Architecture) */}
      <div className="command-card p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-title text-xs font-bold uppercase tracking-wider text-[#1C191E] flex items-center gap-1.5">
            <span>ORGANIZATIONAL HIERARCHY</span>
          </h2>
          <button 
            onClick={onOpenHierarchyTree}
            className="text-[#9A94A0] hover:text-[#B31B24] transition-colors cursor-pointer"
            title="تخصيص وإدارة هيكل العمليات والأقسام"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hierarchical Process & Structure Tree Canvas matching exact visual styling */}
        {isClientOrBusiness ? (
          <div 
            onClick={onOpenHierarchyTree}
            className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] flex flex-col items-center cursor-pointer hover:border-[#B31B24] transition-all"
          >
            {/* Top Node: THE CORE BUSINESS MODEL / PHASES */}
            <div className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#B31B24] shadow-sm flex items-center gap-1.5 text-center">
              <Scale className="w-3 h-3 text-[#B31B24]" />
              <span className="font-serif-title text-[10px] font-bold text-[#1C191E]">
                {selectedLocation ? `هيكل وأقسام: ${selectedLocation.name}` : 'هيكل النشاط والعمليات'}
              </span>
            </div>

            {/* Line down to Level 2 */}
            <div className="w-px h-3 bg-[#D5CDC0]" />

            {/* Level 2: 2 Nodes (المراحل الرئيسية: التوريد والإنتاج والمبيعات) */}
            <div className="relative flex items-center gap-4">
              <div className="absolute top-0 left-4 right-4 h-px bg-[#D5CDC0]" />
              <div className="px-2 py-1 rounded bg-[#FFFFFF] border border-[#E2DACB] text-[9px] font-bold text-[#554F59] font-serif-title">
                المراحل الرئيسية
              </div>
              <div className="px-2 py-1 rounded bg-[#FFFFFF] border border-[#E2DACB] text-[9px] font-bold text-[#554F59] font-serif-title">
                الأقسام والوظائف
              </div>
            </div>

            {/* Line down to Level 3 */}
            <div className="w-px h-3 bg-[#D5CDC0]" />

            {/* Level 3: 4 Process Status Boxes */}
            <div className="relative flex items-center gap-1.5">
              <div className="absolute top-0 left-2 right-2 h-px bg-[#D5CDC0]" />
              <div className="px-1.5 py-0.5 rounded bg-[#FFFFFF] border border-[#E2DACB] text-[8px] font-bold text-[#7A747D]">
                توريد
              </div>
              <div className="px-1.5 py-0.5 rounded bg-[#FFFFFF] border border-[#E2DACB] text-[8px] font-bold text-[#7A747D]">
                تشغيل
              </div>
              <div className="px-1.5 py-0.5 rounded bg-[#FFFFFF] border border-[#E2DACB] text-[8px] font-bold text-[#7A747D]">
                مبيعات
              </div>
              <div className="px-1.5 py-0.5 rounded bg-[#FFFFFF] border border-[#E2DACB] text-[8px] font-bold text-[#7A747D]">
                مالية
              </div>
            </div>

            {/* Line down to Level 4: Status Indicator Dots */}
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-[#EFEAE0] w-full justify-center">
              <span className="text-[8px] uppercase tracking-wider text-[#9A94A0] font-bold mr-1">الحالات المفحوصة:</span>
              {displayedHierarchyNodes.slice(0, 8).map((node, i) => (
                <span 
                  key={node.id || i} 
                  className={`w-1.5 h-1.5 rounded-full ${
                    node.status === 'gap-detected' ? 'bg-[#DC2626]' :
                    node.status === 'improving' ? 'bg-[#D97706]' :
                    node.status === 'verified' || node.status === 'measured' ? 'bg-[#15803D]' : 'bg-[#B31B24]'
                  }`}
                  title={`${node.name}: ${node.status}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] text-center text-[10px] text-[#7A747D]">
            <Building2 className="w-5 h-5 text-[#7A747D] mx-auto mb-1 opacity-50" />
            <span>مخطط الأقسام والعمليات يظهر حصرياً للعملاء والأنشطة التجارية</span>
          </div>
        )}

        {/* Row of 7 Specialty Badges matching original card icons */}
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
      </div>

      {/* 2. CARD 2: MEMBER PROFILES (Bottom Card - Professional & Business Relationships) */}
      <div className="command-card p-3.5 space-y-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 truncate">
            <h2 className="font-serif-title text-xs font-bold uppercase tracking-wider text-[#1C191E] flex items-center gap-1.5 truncate">
              <span>MEMBER PROFILES</span>
              <span className="text-[10px] text-[#7A747D] font-normal normal-case font-sans">
                {selectedLocation ? `(${displayedRelationships.length})` : '(جهات الاتصال)'}
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenAddRelationship}
              className="p-1 rounded-md text-[#7A747D] hover:text-[#B31B24] hover:bg-[#FAF8F5] border border-transparent hover:border-[#E5DECE] transition-colors cursor-pointer"
              title="إضافة جهة اتصال / علاقة مهنية تابعة لهذا المكان"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={onOpenAllRelationships}
              className="text-[10px] font-bold text-[#7A747D] hover:text-[#B31B24] uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
            >
              <span>VIEW ALL</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 4 Member Profile Cards stacked vertically */}
        <div className="space-y-2 flex-1">
          {displayedRelationships.length === 0 ? (
            <div 
              onClick={onOpenAddRelationship}
              className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] text-center cursor-pointer hover:border-[#B31B24] transition-all my-auto"
            >
              <Users className="w-6 h-6 text-[#B31B24] mx-auto mb-1.5 opacity-60" />
              <h4 className="font-serif-title text-xs font-bold text-[#1C191E]">
                {selectedLocation ? `لا توجد جهات مسجلة لـ ${selectedLocation.name}` : 'لا توجد جهات مسجلة بعد'}
              </h4>
              <p className="text-[10px] text-[#7A747D] mt-0.5">
                انقر هنا لإضافة صاحب المكان، موظف وسيط، مدير فرع، مورد، أو شريك خاص بهذا المكان
              </p>
            </div>
          ) : (
            displayedRelationships.slice(0, 4).map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectRelationship(rel)}
                className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] hover:border-[#B31B24] transition-all flex items-center justify-between gap-2 cursor-pointer shadow-sm"
              >
                {/* Avatar + Info */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#EFEAE0] border border-[#D5CDC0] flex items-center justify-center font-serif-title font-bold text-xs text-[#1C191E] shrink-0">
                    {rel.avatarInitials}
                  </div>
                  
                  <div className="min-w-0">
                    <h3 className="font-serif-title text-xs font-bold text-[#1C191E] uppercase truncate">
                      {rel.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[9px] text-[#7A747D]">
                      <span className="truncate">{rel.organization}</span>
                      <span>&bull;</span>
                      <span className="truncate">{getRoleLabel(rel.roleType)}</span>
                    </div>

                    {/* Progress / Step indicator bar */}
                    <div className="w-20 bg-[#E5DECE] rounded-full h-1 mt-1 overflow-hidden">
                      <div 
                        className="bg-[#B31B24] h-full"
                        style={{ width: rel.nextStep ? '100%' : '50%' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRelationship(rel);
                  }}
                  className="w-8 h-8 rounded-lg bg-[#F7D5D8] border border-[#E89EAA] hover:bg-[#F2BFC4] text-[#B31B24] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                  title="عرض تفاصيل وسجل العلاقة"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

      </div>

    </aside>
  );
};
