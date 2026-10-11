import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  MapPin, 
  FileText, 
  Plus, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  X,
  Send,
  Layers,
  ArrowRight,
  ExternalLink,
  Edit3,
  Calendar,
  Sparkles
} from 'lucide-react';
import { 
  RacketNode, 
  BusinessModelCanvas, 
  RelationshipContact 
} from '../../types/dashboard';

interface BusinessModelCanvasPanelProps {
  selectedLocation: RacketNode | null;
  onUpdateCanvas: (locationId: string, updatedCanvas: BusinessModelCanvas) => void;
  relationships: RelationshipContact[];
  onOpenAddContact: () => void;
  onSelectRelationship: (contact: RelationshipContact) => void;
  onOpenHierarchyTree: () => void;
}

export const BusinessModelCanvasPanel: React.FC<BusinessModelCanvasPanelProps> = ({
  selectedLocation,
  onUpdateCanvas,
  relationships,
  onOpenAddContact,
  onSelectRelationship,
  onOpenHierarchyTree,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const isClient = selectedLocation && (
    selectedLocation.locationCategory === 'potential-client' || 
    selectedLocation.locationCategory === 'current-client' ||
    selectedLocation.controllingSyndicate === 'عميل مستهدف'
  );

  const canvas = selectedLocation?.businessCanvas || {
    keyPartners: '',
    keyActivities: '',
    keyResources: '',
    valuePropositions: '',
    customerRelationships: '',
    channels: '',
    customerSegments: '',
    costStructure: '',
    revenueStreams: '',
    notes: '',
  };

  const [formData, setFormData] = useState<BusinessModelCanvas>(canvas);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) return;
    onUpdateCanvas(selectedLocation.id, formData);
    setIsEditing(false);
  };

  // If no node selected or not a client, show guidance state
  if (!selectedLocation) {
    return (
      <div className="command-card p-3 flex flex-col justify-between h-full group">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-serif-title text-xs font-bold uppercase tracking-wider text-[#1C191E] flex items-center gap-1.5">
              <span>BUSINESS MODEL CANVAS</span>
              <span className="text-[10px] text-[#7A747D] font-normal normal-case font-sans">(نموذج عمل العميل)</span>
            </h2>
            <span className="text-[9px] uppercase font-bold text-[#7A747D]">
              في انتظار التحديد
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] text-center flex flex-col items-center justify-center my-1">
            <Building2 className="w-6 h-6 text-[#B31B24] mb-1.5 opacity-60" />
            <h4 className="font-serif-title text-xs font-bold text-[#1C191E]">
              اضغط على أي عميل في الخريطة
            </h4>
            <p className="text-[10px] text-[#7A747D] mt-1 max-w-xs leading-relaxed">
              يظهر مخطط نموذج العمل التجاري (Business Model Canvas) فور تحديد عميل حالي أو مستهدف لتحليل منظومة عمله وأقسامه.
            </p>
          </div>
        </div>

        <div className="pt-2 mt-2 border-t border-[#EFEAE0] flex items-center justify-between text-[10px] text-[#7A747D]">
          <span>تحليل منظومة العميل</span>
          <span className="font-bold text-[#B31B24]">حدد نقطة في الخريطة</span>
        </div>
      </div>
    );
  }

  if (!isClient) {
    return (
      <div className="command-card p-3 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-serif-title text-xs font-bold uppercase tracking-wider text-[#1C191E] flex items-center gap-1.5">
              <span>BUSINESS MODEL CANVAS</span>
            </h2>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[#554F59] font-bold">
              {selectedLocation.ringCategory || 'موقع عام'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] space-y-2">
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded-md flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: selectedLocation.hexColor || '#B31B24' }}
              >
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-serif-title text-xs font-bold text-[#1C191E]">
                  {selectedLocation.name}
                </h4>
                <p className="text-[9px] text-[#7A747D]">
                  {selectedLocation.addressDetails || 'نقطة ميدانية مسجلة'}
                </p>
              </div>
            </div>

            <p className="text-[10px] text-[#7A747D] leading-relaxed">
              هذه النقطة مصنفة كموقع لقاء أو نشاط أو مورد. يتم عرض مخطط نموذج العمل التجاري (Business Model Canvas) حصرياً عند الضغط على عميل حالي أو عميل مستهدف.
            </p>

            <div className="flex items-center gap-2 pt-1 border-t border-[#EFEAE0]">
              <span className="text-[9px] font-bold text-[#7A747D]">تاريخ آخر تفاعل:</span>
              <span className="text-[9px] font-mono-num font-bold text-[#1C191E]">
                {selectedLocation.lastInteractionDate || 'اليوم'}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 mt-2 border-t border-[#EFEAE0] flex items-center justify-between text-[10px] text-[#7A747D]">
          <span>الحالة: {selectedLocation.activityStatus || 'نشط'}</span>
          <span className="font-bold text-[#554F59]">موقع تفاعل مهني</span>
        </div>
      </div>
    );
  }

  // Active Client Canvas Display
  return (
    <div className="command-card p-3 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 truncate">
            <div 
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: selectedLocation.hexColor || '#B31B24' }}
            />
            <h2 className="font-serif-title text-xs font-bold uppercase tracking-wider text-[#1C191E] truncate">
              BMC: {selectedLocation.name}
            </h2>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => {
                setFormData(canvas);
                setIsEditing(!isEditing);
              }}
              className="p-1 rounded text-[#7A747D] hover:text-[#B31B24] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              title="تعديل نموذج العمل التجاري"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenHierarchyTree}
              className="p-1 rounded text-[#7A747D] hover:text-[#B31B24] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              title="فتح هيكل الأقسام والعمليات"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Editing Mode */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-2 text-[10px]">
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <span className="font-bold text-[#7A747D] block">عروض القيمة (Value Prop)</span>
                <input
                  type="text"
                  value={formData.valuePropositions}
                  onChange={(e) => setFormData({ ...formData, valuePropositions: e.target.value })}
                  placeholder="القيمة للعملاء..."
                  className="w-full p-1 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[10px]"
                />
              </div>
              <div>
                <span className="font-bold text-[#7A747D] block">شرائح العملاء (Segments)</span>
                <input
                  type="text"
                  value={formData.customerSegments}
                  onChange={(e) => setFormData({ ...formData, customerSegments: e.target.value })}
                  placeholder="الفئات المستهدفة..."
                  className="w-full p-1 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[10px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <span className="font-bold text-[#7A747D] block">الأنشطة الرئيسية (Activities)</span>
                <input
                  type="text"
                  value={formData.keyActivities}
                  onChange={(e) => setFormData({ ...formData, keyActivities: e.target.value })}
                  placeholder="التصنيع، التوزيع..."
                  className="w-full p-1 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[10px]"
                />
              </div>
              <div>
                <span className="font-bold text-[#7A747D] block">الشركاء الرئيسيون (Partners)</span>
                <input
                  type="text"
                  value={formData.keyPartners}
                  onChange={(e) => setFormData({ ...formData, keyPartners: e.target.value })}
                  placeholder="الموردون، الشركاء..."
                  className="w-full p-1 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[10px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <span className="font-bold text-[#7A747D] block">تدفقات الإيرادات (Revenue)</span>
                <input
                  type="text"
                  value={formData.revenueStreams}
                  onChange={(e) => setFormData({ ...formData, revenueStreams: e.target.value })}
                  placeholder="المبيعات، العقود..."
                  className="w-full p-1 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[10px]"
                />
              </div>
              <div>
                <span className="font-bold text-[#7A747D] block">هيكل التكاليف (Costs)</span>
                <input
                  type="text"
                  value={formData.costStructure}
                  onChange={(e) => setFormData({ ...formData, costStructure: e.target.value })}
                  placeholder="المرتبات، التوريد..."
                  className="w-full p-1 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[10px]"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="submit"
                className="flex-1 py-1 rounded bg-[#B31B24] hover:bg-[#C7232D] text-white font-bold text-[9px] cursor-pointer"
              >
                حفظ النموذج
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="py-1 px-2 rounded bg-[#FAF8F5] border border-[#E5DECE] text-[9px] font-bold cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </form>
        ) : (
          /* View Mode: Compact 5-Box Business Model Canvas Grid */
          <div className="space-y-1.5">
            {/* Value Proposition Hero Strip */}
            <div className="p-1.5 rounded-lg bg-[#FAF8F5] border border-[#E5DECE]">
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#B31B24] block">
                عروض القيمة (Value Proposition):
              </span>
              <p className="text-[10px] font-medium text-[#1C191E] truncate">
                {canvas.valuePropositions || 'لم تحدد عروض القيمة بعد — انقر لتسجيلها'}
              </p>
            </div>

            {/* 3 Blocks in Middle */}
            <div className="grid grid-cols-3 gap-1 text-[9px]">
              <div className="p-1 rounded bg-[#FAF8F5] border border-[#E5DECE]">
                <span className="text-[7.5px] uppercase font-bold text-[#7A747D] block truncate">
                  الشركاء والأنشطة
                </span>
                <p className="text-[8.5px] font-medium text-[#1C191E] truncate" title={canvas.keyPartners || canvas.keyActivities}>
                  {canvas.keyPartners || canvas.keyActivities || 'عام'}
                </p>
              </div>

              <div className="p-1 rounded bg-[#FAF8F5] border border-[#E5DECE]">
                <span className="text-[7.5px] uppercase font-bold text-[#7A747D] block truncate">
                  العملاء والقنوات
                </span>
                <p className="text-[8.5px] font-medium text-[#1C191E] truncate" title={canvas.customerSegments}>
                  {canvas.customerSegments || canvas.channels || 'شرائح السوق'}
                </p>
              </div>

              <div className="p-1 rounded bg-[#FAF8F5] border border-[#E5DECE]">
                <span className="text-[7.5px] uppercase font-bold text-[#7A747D] block truncate">
                  الموارد الرئيسية
                </span>
                <p className="text-[8.5px] font-medium text-[#1C191E] truncate" title={canvas.keyResources}>
                  {canvas.keyResources || 'الأصول والخبرات'}
                </p>
              </div>
            </div>

            {/* Financial Architecture: Costs & Revenue */}
            <div className="grid grid-cols-2 gap-1 text-[9px]">
              <div className="p-1 rounded bg-[#FAF8F5] border border-[#E5DECE]">
                <span className="text-[7.5px] uppercase font-bold text-[#DC2626] block">
                  التكاليف (Cost):
                </span>
                <span className="text-[8.5px] font-bold text-[#1C191E] truncate block">
                  {canvas.costStructure || 'مرتبات وتشغيل'}
                </span>
              </div>
              <div className="p-1 rounded bg-[#FAF8F5] border border-[#E5DECE]">
                <span className="text-[7.5px] uppercase font-bold text-[#15803D] block">
                  الإيرادات (Revenue):
                </span>
                <span className="text-[8.5px] font-bold text-[#1C191E] truncate block">
                  {canvas.revenueStreams || 'مبيعات وعقود'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-2 mt-2 border-t border-[#EFEAE0] flex items-center justify-between text-[10px] text-[#7A747D]">
        <span>نموذج العمل التجاري للعميل</span>
        <button
          onClick={onOpenHierarchyTree}
          className="font-bold text-[#B31B24] hover:underline cursor-pointer flex items-center gap-0.5"
        >
          <span>تحليل الأقسام والهيكل</span>
          <ArrowRight className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
};
