import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Plus, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  TrendingUp, 
  Trash2,
  Building,
  Activity,
  FileText
} from 'lucide-react';
import { 
  HierarchyProcessNode, 
  HierarchyNodeStatus 
} from '../../types/dashboard';

interface HierarchyModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: HierarchyProcessNode[];
  onAddNode: (node: HierarchyProcessNode) => void;
  onUpdateNode: (node: HierarchyProcessNode) => void;
  onDeleteNode: (nodeId: string) => void;
}

export const HierarchyModal: React.FC<HierarchyModalProps> = ({
  isOpen,
  onClose,
  nodes,
  onAddNode,
  onUpdateNode,
  onDeleteNode,
}) => {
  if (!isOpen) return null;

  const [selectedNode, setSelectedNode] = useState<HierarchyProcessNode | null>(nodes[0] || null);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [isEditingNode, setIsEditingNode] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formLevel, setFormLevel] = useState<'phase' | 'department' | 'process'>('phase');
  const [formParentId, setFormParentId] = useState<string>('');
  const [formClient, setFormClient] = useState('');
  const [formStatus, setFormStatus] = useState<HierarchyNodeStatus>('data-gathering');
  const [formEvidence, setFormEvidence] = useState('');
  const [formGaps, setFormGaps] = useState('');
  const [formInterventions, setFormInterventions] = useState('');
  const [formResults, setFormResults] = useState('');

  const getStatusBadge = (status: HierarchyNodeStatus) => {
    switch (status) {
      case 'uninspected':
        return { label: 'لم يُفحص بعد', color: 'bg-[#F4F1EA] text-[#7A747D] border-[#E2DACB]' };
      case 'data-gathering':
        return { label: 'قيد جمع البيانات أو الفهم', color: 'bg-[#DBEAFE] text-[#2563EB] border-[#BFDBFE]' };
      case 'verified':
        return { label: 'تم فهمه والتحقق منه', color: 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]' };
      case 'gap-detected':
        return { label: 'تم اكتشاف مشكلة أو فجوة', color: 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]' };
      case 'improving':
        return { label: 'يجري العمل على تحسينه', color: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]' };
      case 'measured':
        return { label: 'تم تنفيذ تدخل وقياس النتيجة', color: 'bg-[#EDE9FE] text-[#7C3AED] border-[#DDD6FE]' };
      default:
        return { label: status, color: 'bg-[#F4F1EA] text-[#554F59] border-[#E5DECE]' };
    }
  };

  const handleOpenAdd = () => {
    setFormName('');
    setFormLevel('phase');
    setFormParentId('');
    setFormClient('');
    setFormStatus('data-gathering');
    setFormEvidence('');
    setFormGaps('');
    setFormInterventions('');
    setFormResults('');
    setIsAddingNode(true);
    setIsEditingNode(false);
  };

  const handleOpenEdit = (node: HierarchyProcessNode) => {
    setSelectedNode(node);
    setFormName(node.name);
    setFormLevel(node.level);
    setFormParentId(node.parentId || '');
    setFormClient(node.clientOrProject);
    setFormStatus(node.status);
    setFormEvidence(node.evidenceNotes);
    setFormGaps(node.detectedGaps || '');
    setFormInterventions(node.interventions || '');
    setFormResults(node.measuredResults || '');
    setIsEditingNode(true);
    setIsAddingNode(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (isEditingNode && selectedNode) {
      const updated: HierarchyProcessNode = {
        ...selectedNode,
        name: formName.trim(),
        level: formLevel,
        parentId: formParentId || null,
        clientOrProject: formClient.trim() || 'عام',
        status: formStatus,
        evidenceNotes: formEvidence.trim(),
        detectedGaps: formGaps.trim(),
        interventions: formInterventions.trim(),
        measuredResults: formResults.trim(),
        updatedAt: new Date().toISOString().split('T')[0],
      };
      onUpdateNode(updated);
      setSelectedNode(updated);
      setIsEditingNode(false);
    } else {
      const newNode: HierarchyProcessNode = {
        id: `proc-${Date.now()}`,
        name: formName.trim(),
        level: formLevel,
        parentId: formParentId || null,
        clientOrProject: formClient.trim() || 'عام',
        status: formStatus,
        evidenceNotes: formEvidence.trim(),
        detectedGaps: formGaps.trim(),
        interventions: formInterventions.trim(),
        measuredResults: formResults.trim(),
        updatedAt: new Date().toISOString().split('T')[0],
      };
      onAddNode(newNode);
      setSelectedNode(newNode);
      setIsAddingNode(false);
    }
  };

  const phases = nodes.filter(n => n.level === 'phase');
  const departments = nodes.filter(n => n.level === 'department');
  const processes = nodes.filter(n => n.level === 'process');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-4xl bg-[#FFFFFF] border border-[#E2DACB] rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar text-[#1C191E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EFEAE0] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F7D5D8] border border-[#E89EAA] flex items-center justify-center text-[#B31B24]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#7A747D] uppercase tracking-widest font-mono-num font-bold">
                BUSINESS ARCHITECTURE MAP
              </span>
              <h2 className="font-serif-title text-lg sm:text-xl font-bold text-[#1C191E]">
                خريطة فهم النشاط التجاري للعميل والهيكل التشغيلي
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="px-3 py-1.5 rounded-lg bg-[#B31B24] text-white text-xs font-bold hover:bg-[#990000] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة مرحلة / عملية</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#7A747D] hover:text-[#1C191E] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form View (Add/Edit) */}
        {(isAddingNode || isEditingNode) ? (
          <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-title text-sm font-bold text-[#1C191E]">
                {isEditingNode ? 'تعديل بيانات وفحص العنصر' : 'إضافة جزء أو مرحلة جديدة في الهيكل'}
              </h3>
              <button
                type="button"
                onClick={() => { setIsAddingNode(false); setIsEditingNode(false); }}
                className="text-xs text-[#7A747D] hover:text-[#1C191E]"
              >
                إلغاء
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">الاسم أو المسمى *</label>
                <input
                  type="text"
                  placeholder="مثال: مرحلة التوريد، قسم الفواتير، عملية الاستلام"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">المستوى في الهيكل *</label>
                <select
                  value={formLevel}
                  onChange={(e) => setFormLevel(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                >
                  <option value="phase">مرحلة رئيسية (Phase)</option>
                  <option value="department">قسم أو وحدة (Department)</option>
                  <option value="process">عملية فرعية (Process)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">حالة الفهم والتحسين *</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as HierarchyNodeStatus)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                >
                  <option value="uninspected">لم يُفحص بعد</option>
                  <option value="data-gathering">قيد جمع البيانات أو الفهم</option>
                  <option value="verified">تم فهمه والتحقق منه</option>
                  <option value="gap-detected">تم اكتشاف مشكلة أو فجوة فيه</option>
                  <option value="improving">يجري العمل على تحسينه</option>
                  <option value="measured">تم تنفيذ تدخل وقياس نتيجته</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">العميل أو المشروع المرتبط</label>
                <input
                  type="text"
                  placeholder="اسم النشاط أو المنشأة..."
                  value={formClient}
                  onChange={(e) => setFormClient(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">العنصر الأب (Parent)</label>
                <select
                  value={formParentId}
                  onChange={(e) => setFormParentId(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                >
                  <option value="">(عنصر رئيسي مستقل)</option>
                  {phases.map(p => (
                    <option key={p.id} value={p.id}>مرحلة: {p.name}</option>
                  ))}
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>قسم: {d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">الملاحظات والأدلة المتاحة</label>
                <textarea
                  rows={2}
                  placeholder="المستندات، المقابلات، البيانات التي تم جمعها..."
                  value={formEvidence}
                  onChange={(e) => setFormEvidence(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">المشكلات والفجوات المكتشفة</label>
                <textarea
                  rows={2}
                  placeholder="الفجوة التشغيلية أو المالية في هذا الجزء..."
                  value={formGaps}
                  onChange={(e) => setFormGaps(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">التدخلات المقترحة أو المنفذة</label>
                <input
                  type="text"
                  placeholder="الحلول، التعديلات الإجرائية، الأنظمة..."
                  value={formInterventions}
                  onChange={(e) => setFormInterventions(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">النتائج المقاسة</label>
                <input
                  type="text"
                  placeholder="الأثر بالأرقام والنسب بعد التدخل..."
                  value={formResults}
                  onChange={(e) => setFormResults(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setIsAddingNode(false); setIsEditingNode(false); }}
                className="px-3 py-1.5 rounded-lg border border-[#E5DECE] bg-[#FFFFFF] text-xs text-[#7A747D] hover:bg-[#FAF8F5] cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#B31B24] text-white text-xs font-bold hover:bg-[#990000] cursor-pointer"
              >
                {isEditingNode ? 'حفظ التحديثات' : 'إضافة إلى الهيكل'}
              </button>
            </div>
          </form>
        ) : null}

        {/* Tree Canvas / Interactive Node Display */}
        <div className="space-y-6">
          <div className="text-center">
            <span className="text-[10px] font-serif-title uppercase tracking-widest text-[#B31B24] font-bold px-3 py-1 rounded bg-[#F7D5D8] border border-[#E89EAA]">
              مراحل وعمليات النشاط التجاري
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nodes.map((node) => {
              const badge = getStatusBadge(node.status);
              return (
                <div 
                  key={node.id}
                  className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E2DACB] hover:border-[#B31B24] transition-all flex flex-col justify-between space-y-2 shadow-sm"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[9px] text-[#7A747D] uppercase font-bold tracking-wider block">
                          {node.level === 'phase' ? 'مرحلة رئيسية' : node.level === 'department' ? 'قسم / وحدة' : 'عملية فرعية'}
                        </span>
                        <h4 className="font-serif-title text-sm font-bold text-[#1C191E] mt-0.5">
                          {node.name}
                        </h4>
                        <span className="text-[10px] text-[#7A747D] block">{node.clientOrProject}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <button
                          onClick={() => handleOpenEdit(node)}
                          className="p-1 rounded text-[#7A747D] hover:text-[#B31B24] hover:bg-[#FFFFFF] transition-colors cursor-pointer"
                          title="تعديل هذا الجزء"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteNode(node.id)}
                          className="p-1 rounded text-[#7A747D] hover:text-[#DC2626] hover:bg-[#FFFFFF] transition-colors cursor-pointer"
                          title="حذف هذا الجزء"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {node.evidenceNotes && (
                      <div className="mt-2 text-xs bg-[#FFFFFF] p-2 rounded-lg border border-[#E5DECE] text-[#554F59]">
                        <span className="font-semibold text-[#1C191E] block text-[10px]">الملاحظات والأدلة:</span>
                        {node.evidenceNotes}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#EFEAE0] text-[10px]">
                    <div>
                      <span className="text-[#7A747D] block">الفجوة / المشكلة:</span>
                      <span className="text-[#DC2626] font-semibold">{node.detectedGaps || 'لا توجد فجوات مسجلة'}</span>
                    </div>
                    <div>
                      <span className="text-[#7A747D] block">التدخل والنتيجة:</span>
                      <span className="text-[#15803D] font-semibold">{node.measuredResults || node.interventions || 'قيد المتابعة'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#EFEAE0] flex items-center justify-between">
          <span className="text-xs text-[#7A747D]">
            إجمالي الأجزاء والعمليات المسجلة: <strong className="text-[#1C191E]">{nodes.length}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EFEAE0] border border-[#E5DECE] text-[#1C191E] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
