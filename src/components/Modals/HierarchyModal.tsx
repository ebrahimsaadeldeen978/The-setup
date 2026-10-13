import React, { useState, useEffect } from 'react';
import { 
  X, 
  Layers, 
  Plus, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Trash2,
  Building,
  Activity,
  FileText,
  BadgePercent,
  Cpu,
  Users,
  GitBranch,
  ListOrdered,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Scale,
  RefreshCw,
  Check,
  Building2,
  Info,
  Database,
  FileSpreadsheet,
  Link2,
  Upload,
  Table,
  FolderOpen,
  Filter,
  Calculator,
  Percent,
  Hash,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { 
  HierarchyProcessNode, 
  HierarchyNodeStatus,
  OrganizationHierarchyModel,
  LadderRoadmapModel,
  DepartmentKey,
  DepartmentMetric,
  DepartmentNode,
  LadderStep,
  LadderMetric,
  LadderMetricSourceType,
  RacketNode
} from '../../types/dashboard';
import { InlineFormulaStrip } from '../Common/InlineFormulaStrip';

interface HierarchyModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Backward compatibility
  nodes?: HierarchyProcessNode[];
  onAddNode?: (node: HierarchyProcessNode) => void;
  onUpdateNode?: (node: HierarchyProcessNode) => void;
  onDeleteNode?: (nodeId: string) => void;

  // 4 Departments & 6-Step Ladder
  orgHierarchy: OrganizationHierarchyModel;
  onUpdateOrgHierarchy: (model: OrganizationHierarchyModel) => void;
  ladderRoadmap: LadderRoadmapModel;
  onUpdateLadderRoadmap: (model: LadderRoadmapModel) => void;
  selectedLocation?: RacketNode | null;
  initialView?: 'departments' | 'ladder';
  initialSelectedKey?: string;
}

// Sample dataset row for simulation and sandbox calculation of uploaded files or sheets
interface DataRow {
  id: number;
  [key: string]: any;
}

export const HierarchyModal: React.FC<HierarchyModalProps> = ({
  isOpen,
  onClose,
  nodes = [],
  orgHierarchy,
  onUpdateOrgHierarchy,
  ladderRoadmap,
  onUpdateLadderRoadmap,
  selectedLocation = null,
  initialView = 'departments',
  initialSelectedKey,
}) => {
  // Active view: 'departments' (الأقسام الـ 4) or 'ladder' (سلّم الـ 6 خطوات)
  const [activeTab, setActiveTab] = useState<'departments' | 'ladder'>(initialView);

  // Selected Department Key ('finance' | 'operations' | 'hr' | 'marketing')
  const [selectedDeptKey, setSelectedDeptKey] = useState<DepartmentKey>(
    (initialSelectedKey as DepartmentKey) || 'finance'
  );

  // Selected Step Number (1..6)
  const [selectedStepNumber, setSelectedStepNumber] = useState<number>(() => {
    if (initialSelectedKey) {
      const num = parseInt(initialSelectedKey.replace(/\D/g, ''));
      if (num >= 1 && num <= 6) return num;
    }
    return 1;
  });

  // Synchronize initial selection on opening
  useEffect(() => {
    if (initialView) setActiveTab(initialView);
    if (initialSelectedKey) {
      if (initialView === 'departments' && ['finance', 'operations', 'hr', 'marketing'].includes(initialSelectedKey)) {
        setSelectedDeptKey(initialSelectedKey as DepartmentKey);
      } else if (initialView === 'ladder') {
        const num = parseInt(initialSelectedKey.replace(/\D/g, ''));
        if (num >= 1 && num <= 6) setSelectedStepNumber(num);
      }
    }
  }, [initialView, initialSelectedKey]);

  // Metric Form States (for adding or editing a metric manually)
  const [isAddingMetric, setIsAddingMetric] = useState(false);
  const [editingMetricId, setEditingMetricId] = useState<string | null>(null);

  const [metricName, setMetricName] = useState('');
  const [metricCurrent, setMetricCurrent] = useState<string>('80');
  const [metricTarget, setMetricTarget] = useState<string>('100');
  const [metricUnit, setMetricUnit] = useState<string>('%');
  const [metricPercentage, setMetricPercentage] = useState<string>('80');
  const [metricStatus, setMetricStatus] = useState<'healthy' | 'warning' | 'critical'>('healthy');
  const [metricNotes, setMetricNotes] = useState('');

  // =========================================================================
  // DATA SOURCE INTEGRATION MODAL / DRAWER STATE (جوجل فورم، شيت إكسل، CSV)
  // =========================================================================
  const [isDataSourceModalOpen, setIsDataSourceModalOpen] = useState(false);
  const [dataSourceType, setDataSourceType] = useState<LadderMetricSourceType>('google_sheet');
  const [sourceUrlOrPath, setSourceUrlOrPath] = useState('https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit');
  const [sheetTabName, setSheetTabName] = useState('بيانات_النموذج');
  const [localFileName, setLocalFileName] = useState('Financial_Performance_Q3.xlsx');
  
  // Available columns detected from the source
  const [detectedColumns, setDetectedColumns] = useState<Array<{ key: string; label: string; type: 'number' | 'text' }>>([
    { key: 'col_revenue', label: 'الإيرادات الإجمالية (A)', type: 'number' },
    { key: 'col_cogs', label: 'تكلفة البضاعة والمباشر (B)', type: 'number' },
    { key: 'col_actual', label: 'القيمة الفعلية المحققة (C)', type: 'number' },
    { key: 'col_target', label: 'المستهدف المطلوب (D)', type: 'number' },
    { key: 'col_cashing_days', label: 'أيام التحصيل والسيولة (E)', type: 'number' },
    { key: 'col_branch', label: 'الفرع أو الإقليم (F)', type: 'text' },
    { key: 'col_status', label: 'حالة العملية / الرد (G)', type: 'text' },
  ]);

  // Sample data rows for sandbox calculation
  const [sampleRows, setSampleRows] = useState<DataRow[]>([
    { id: 1, col_revenue: 125000, col_cogs: 62000, col_actual: 48, col_target: 50, col_cashing_days: 28, col_branch: 'المركز الرئيسي', col_status: 'معتمد' },
    { id: 2, col_revenue: 84000, col_cogs: 41000, col_actual: 46, col_target: 50, col_cashing_days: 34, col_branch: 'فرع الغربية', col_status: 'معتمد' },
    { id: 3, col_revenue: 142000, col_cogs: 69000, col_actual: 51, col_target: 50, col_cashing_days: 25, col_branch: 'المركز الرئيسي', col_status: 'معتمد' },
    { id: 4, col_revenue: 96000, col_cogs: 51000, col_actual: 44, col_target: 50, col_cashing_days: 38, col_branch: 'فرع الشرقية', col_status: 'قيد المراجعة' },
    { id: 5, col_revenue: 110000, col_cogs: 54000, col_actual: 49, col_target: 50, col_cashing_days: 30, col_branch: 'فرع الغربية', col_status: 'معتمد' },
  ]);

  // Selected column for computation
  const [selectedColumnKey, setSelectedColumnKey] = useState('col_actual');
  const [aggregationType, setAggregationType] = useState<'avg' | 'sum' | 'max' | 'min' | 'count'>('avg');
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [filterColumnKey, setFilterColumnKey] = useState('col_status');
  const [filterValue, setFilterValue] = useState('معتمد');
  const [outputDisplayFormat, setOutputDisplayFormat] = useState<'percentage' | 'number'>('percentage');
  const [customTargetNumber, setCustomTargetNumber] = useState('100');
  const [customUnit, setCustomUnit] = useState('%');
  const [metricNameToAdd, setMetricNameToAdd] = useState('');

  // Organization name (from selected location or custom)
  const orgName = selectedLocation ? selectedLocation.name : (orgHierarchy.organizationName || 'المؤسسة التجارية');

  // Currently selected department object
  const currentDept = orgHierarchy.departments.find(d => d.key === selectedDeptKey) || orgHierarchy.departments[0];

  // Currently selected step object
  const currentStep = ladderRoadmap.steps.find(s => s.stepNumber === selectedStepNumber) || ladderRoadmap.steps[0];

  // Automatically recalculate percentage when current or target changes in manual form
  const handleCurrentTargetChange = (curr: string, targ: string) => {
    setMetricCurrent(curr);
    setMetricTarget(targ);
    const c = parseFloat(curr);
    const t = parseFloat(targ);
    if (!isNaN(c) && !isNaN(t) && t > 0) {
      const calcPct = Math.min(100, Math.max(0, Math.round((c / t) * 100)));
      setMetricPercentage(calcPct.toString());
      if (calcPct >= 80) setMetricStatus('healthy');
      else if (calcPct >= 60) setMetricStatus('warning');
      else setMetricStatus('critical');
    }
  };

  const handleOpenAddMetric = () => {
    setMetricName('');
    setMetricCurrent('80');
    setMetricTarget('100');
    setMetricUnit('%');
    setMetricPercentage('80');
    setMetricStatus('healthy');
    setMetricNotes('');
    setEditingMetricId(null);
    setIsAddingMetric(true);
  };

  const handleOpenEditMetric = (m: DepartmentMetric | LadderMetric) => {
    setMetricName(m.name);
    setMetricCurrent((m.currentValue ?? m.percentage).toString());
    setMetricTarget((m.targetValue ?? 100).toString());
    setMetricUnit(m.unit || '%');
    setMetricPercentage(m.percentage.toString());
    setMetricStatus((m as any).status || (m.percentage >= 80 ? 'healthy' : m.percentage >= 60 ? 'warning' : 'critical'));
    setMetricNotes(m.notes || '');
    setEditingMetricId(m.id);
    setIsAddingMetric(true);
  };

  // Open Data Source Integration
  const handleOpenDataSourceModal = (defaultName?: string) => {
    setMetricNameToAdd(defaultName || `مؤشر مربوط: ${currentStep.title}`);
    setIsDataSourceModalOpen(true);
  };

  // Calculate live preview value for data source
  const liveCalculatedValue = React.useMemo(() => {
    let rowsToUse = [...sampleRows];
    if (filterEnabled && filterColumnKey && filterValue) {
      rowsToUse = rowsToUse.filter(r => String(r[filterColumnKey]) === String(filterValue));
    }

    if (rowsToUse.length === 0) return { value: 0, percentage: 0 };

    if (aggregationType === 'count') {
      const val = rowsToUse.length;
      const target = parseFloat(customTargetNumber) || 10;
      const pct = Math.min(100, Math.round((val / target) * 100));
      return { value: val, percentage: pct };
    }

    const numbers = rowsToUse.map(r => parseFloat(r[selectedColumnKey]) || 0);
    let val = 0;
    if (aggregationType === 'sum') {
      val = numbers.reduce((a, b) => a + b, 0);
    } else if (aggregationType === 'avg') {
      val = numbers.length > 0 ? numbers.reduce((a, b) => a + b, 0) / numbers.length : 0;
      val = Math.round(val * 10) / 10;
    } else if (aggregationType === 'max') {
      val = Math.max(...numbers);
    } else if (aggregationType === 'min') {
      val = Math.min(...numbers);
    }

    let pct = 0;
    if (outputDisplayFormat === 'percentage') {
      pct = Math.min(100, Math.max(0, Math.round(val)));
    } else {
      const target = parseFloat(customTargetNumber) || 100;
      pct = target > 0 ? Math.min(100, Math.max(0, Math.round((val / target) * 100))) : 0;
    }

    return { value: val, percentage: pct };
  }, [sampleRows, filterEnabled, filterColumnKey, filterValue, selectedColumnKey, aggregationType, outputDisplayFormat, customTargetNumber]);

  // Submit Metric for Department (الفكرة الأولى)
  const handleSaveDepartmentMetric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metricName.trim()) return;

    const pct = Math.min(100, Math.max(0, parseFloat(metricPercentage) || 0));
    const curr = parseFloat(metricCurrent) || pct;
    const targ = parseFloat(metricTarget) || 100;

    let updatedMetrics = [...currentDept.metrics];

    if (editingMetricId) {
      updatedMetrics = updatedMetrics.map(m => {
        if (m.id === editingMetricId) {
          return {
            ...m,
            name: metricName.trim(),
            currentValue: curr,
            targetValue: targ,
            percentage: pct,
            unit: metricUnit.trim() || '%',
            status: metricStatus,
            notes: metricNotes.trim(),
            updatedAt: new Date().toISOString().split('T')[0],
          };
        }
        return m;
      });
    } else {
      const newMetric: DepartmentMetric = {
        id: `dept-m-${Date.now()}`,
        name: metricName.trim(),
        departmentKey: currentDept.key,
        currentValue: curr,
        targetValue: targ,
        percentage: pct,
        unit: metricUnit.trim() || '%',
        status: metricStatus,
        notes: metricNotes.trim(),
        updatedAt: new Date().toISOString().split('T')[0],
      };
      updatedMetrics.push(newMetric);
    }

    const newDeptScore = updatedMetrics.length > 0
      ? Math.round(updatedMetrics.reduce((sum, m) => sum + m.percentage, 0) / updatedMetrics.length)
      : 0;

    const updatedDepartments = orgHierarchy.departments.map(d => {
      if (d.key === currentDept.key) {
        return {
          ...d,
          score: newDeptScore,
          metrics: updatedMetrics,
        };
      }
      return d;
    });

    const newOverallScore = Math.round(
      updatedDepartments.reduce((sum, d) => sum + d.score, 0) / (updatedDepartments.length || 1)
    );

    const updatedModel: OrganizationHierarchyModel = {
      ...orgHierarchy,
      organizationName: orgName,
      overallScore: newOverallScore,
      departments: updatedDepartments,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    onUpdateOrgHierarchy(updatedModel);
    setIsAddingMetric(false);
    setEditingMetricId(null);
  };

  // Delete Metric from Department
  const handleDeleteDepartmentMetric = (metricId: string) => {
    const updatedMetrics = currentDept.metrics.filter(m => m.id !== metricId);
    const newDeptScore = updatedMetrics.length > 0
      ? Math.round(updatedMetrics.reduce((sum, m) => sum + m.percentage, 0) / updatedMetrics.length)
      : 0;

    const updatedDepartments = orgHierarchy.departments.map(d => {
      if (d.key === currentDept.key) {
        return {
          ...d,
          score: newDeptScore,
          metrics: updatedMetrics,
        };
      }
      return d;
    });

    const newOverallScore = Math.round(
      updatedDepartments.reduce((sum, d) => sum + d.score, 0) / (updatedDepartments.length || 1)
    );

    onUpdateOrgHierarchy({
      ...orgHierarchy,
      overallScore: newOverallScore,
      departments: updatedDepartments,
    });
  };

  // Save Manual Metric for Step
  const handleSaveLadderMetric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metricName.trim()) return;

    const pct = Math.min(100, Math.max(0, parseFloat(metricPercentage) || 0));
    const curr = parseFloat(metricCurrent) || pct;
    const targ = parseFloat(metricTarget) || 100;

    let updatedMetrics = [...currentStep.metrics];

    if (editingMetricId) {
      updatedMetrics = updatedMetrics.map(m => {
        if (m.id === editingMetricId) {
          return {
            ...m,
            name: metricName.trim(),
            percentage: pct,
            currentValue: curr,
            targetValue: targ,
            unit: metricUnit.trim() || '%',
            notes: metricNotes.trim(),
            isCompleted: pct >= 100,
            status: pct >= 80 ? 'healthy' : pct >= 60 ? 'warning' : 'critical',
          };
        }
        return m;
      });
    } else {
      const newMetric: LadderMetric = {
        id: `ladder-m-${Date.now()}`,
        name: metricName.trim(),
        stepNumber: currentStep.stepNumber,
        percentage: pct,
        currentValue: curr,
        targetValue: targ,
        unit: metricUnit.trim() || '%',
        notes: metricNotes.trim(),
        isCompleted: pct >= 100,
        status: pct >= 80 ? 'healthy' : pct >= 60 ? 'warning' : 'critical',
      };
      updatedMetrics.push(newMetric);
    }

    const newStepScore = updatedMetrics.length > 0
      ? Math.round(updatedMetrics.reduce((sum, m) => sum + m.percentage, 0) / updatedMetrics.length)
      : 0;

    const newStepStatus = newStepScore >= 100 ? 'completed' : newStepScore > 0 ? 'in_progress' : 'pending';

    const updatedSteps = ladderRoadmap.steps.map(s => {
      if (s.stepNumber === currentStep.stepNumber) {
        return {
          ...s,
          score: newStepScore,
          status: newStepStatus as any,
          metrics: updatedMetrics,
        };
      }
      return s;
    });

    const newOverallRoadmap = Math.round(
      updatedSteps.reduce((sum, s) => sum + s.score, 0) / (updatedSteps.length || 1)
    );

    onUpdateLadderRoadmap({
      ...ladderRoadmap,
      overallProgress: newOverallRoadmap,
      steps: updatedSteps,
      lastUpdated: new Date().toISOString().split('T')[0],
    });

    setIsAddingMetric(false);
    setEditingMetricId(null);
  };

  // Save Linked Data Source Metric to the current step (Google Forms, Google Sheet, Excel, CSV)
  const handleSaveDataSourceMetric = () => {
    if (!metricNameToAdd.trim()) return;

    const colObj = detectedColumns.find(c => c.key === selectedColumnKey);
    const colLabel = colObj ? colObj.label : selectedColumnKey;

    const newMetric: LadderMetric = {
      id: `ladder-source-${Date.now()}`,
      name: metricNameToAdd.trim(),
      stepNumber: currentStep.stepNumber,
      percentage: liveCalculatedValue.percentage,
      currentValue: liveCalculatedValue.value,
      targetValue: outputDisplayFormat === 'percentage' ? 100 : (parseFloat(customTargetNumber) || 100),
      unit: outputDisplayFormat === 'percentage' ? '%' : customUnit,
      notes: `مربوط تلقائياً بـ ${
        dataSourceType === 'google_form' ? 'نموذج جوجل (Google Form)' :
        dataSourceType === 'google_sheet' ? 'جدول بيانات جوجل (Google Sheet)' :
        dataSourceType === 'excel' ? `ملف إكسل (${localFileName})` : `ملف CSV (${localFileName})`
      } عبر عمود [${colLabel}]`,
      isCompleted: liveCalculatedValue.percentage >= 100,
      status: liveCalculatedValue.percentage >= 80 ? 'healthy' : liveCalculatedValue.percentage >= 60 ? 'warning' : 'critical',
      dataSource: {
        type: dataSourceType,
        sourceUrlOrPath: dataSourceType === 'google_sheet' || dataSourceType === 'google_form' ? sourceUrlOrPath : localFileName,
        sheetName: sheetTabName,
        column: colLabel,
        aggregation: aggregationType,
        filterCondition: filterEnabled ? `${filterColumnKey} = ${filterValue}` : undefined,
        lastSynced: new Date().toISOString().split('T')[0],
      }
    };

    const updatedMetrics = [...currentStep.metrics, newMetric];
    const newStepScore = Math.round(updatedMetrics.reduce((sum, m) => sum + m.percentage, 0) / updatedMetrics.length);
    const newStepStatus = newStepScore >= 100 ? 'completed' : newStepScore > 0 ? 'in_progress' : 'pending';

    const updatedSteps = ladderRoadmap.steps.map(s => {
      if (s.stepNumber === currentStep.stepNumber) {
        return {
          ...s,
          score: newStepScore,
          status: newStepStatus as any,
          metrics: updatedMetrics,
        };
      }
      return s;
    });

    const newOverallRoadmap = Math.round(
      updatedSteps.reduce((sum, s) => sum + s.score, 0) / (updatedSteps.length || 1)
    );

    onUpdateLadderRoadmap({
      ...ladderRoadmap,
      overallProgress: newOverallRoadmap,
      steps: updatedSteps,
      lastUpdated: new Date().toISOString().split('T')[0],
    });

    setIsDataSourceModalOpen(false);
  };

  // Re-sync metric from data source
  const handleSyncLadderMetric = (metricId: string) => {
    const updatedMetrics = currentStep.metrics.map(m => {
      if (m.id === metricId && m.dataSource) {
        // Simulate live re-fetch with slight adjustment
        const refreshedPct = Math.min(100, Math.max(10, m.percentage + Math.floor(Math.random() * 5) - 2));
        return {
          ...m,
          percentage: refreshedPct,
          status: (refreshedPct >= 80 ? 'healthy' : refreshedPct >= 60 ? 'warning' : 'critical') as any,
          dataSource: {
            ...m.dataSource,
            lastSynced: new Date().toISOString().split('T')[0],
          }
        };
      }
      return m;
    });

    const newStepScore = Math.round(updatedMetrics.reduce((sum, m) => sum + m.percentage, 0) / updatedMetrics.length);
    const updatedSteps = ladderRoadmap.steps.map(s => {
      if (s.stepNumber === currentStep.stepNumber) {
        return { ...s, score: newStepScore, metrics: updatedMetrics };
      }
      return s;
    });

    onUpdateLadderRoadmap({
      ...ladderRoadmap,
      steps: updatedSteps,
      overallProgress: Math.round(updatedSteps.reduce((sum, s) => sum + s.score, 0) / updatedSteps.length),
      lastUpdated: new Date().toISOString().split('T')[0],
    });
  };

  // Delete Metric from Step
  const handleDeleteLadderMetric = (metricId: string) => {
    const updatedMetrics = currentStep.metrics.filter(m => m.id !== metricId);
    const newStepScore = updatedMetrics.length > 0
      ? Math.round(updatedMetrics.reduce((sum, m) => sum + m.percentage, 0) / updatedMetrics.length)
      : 0;
    const newStepStatus = newStepScore >= 100 ? 'completed' : newStepScore > 0 ? 'in_progress' : 'pending';

    const updatedSteps = ladderRoadmap.steps.map(s => {
      if (s.stepNumber === currentStep.stepNumber) {
        return {
          ...s,
          score: newStepScore,
          status: newStepStatus as any,
          metrics: updatedMetrics,
        };
      }
      return s;
    });

    const newOverallRoadmap = Math.round(
      updatedSteps.reduce((sum, s) => sum + s.score, 0) / (updatedSteps.length || 1)
    );

    onUpdateLadderRoadmap({
      ...ladderRoadmap,
      overallProgress: newOverallRoadmap,
      steps: updatedSteps,
      lastUpdated: new Date().toISOString().split('T')[0],
    });
  };

  const getDeptColor = (key: DepartmentKey) => {
    switch (key) {
      case 'finance': return { bg: 'bg-[#DCFCE7]', border: 'border-[#BBF7D0]', text: 'text-[#15803D]', hex: '#15803D' };
      case 'operations': return { bg: 'bg-[#FEE2E2]', border: 'border-[#FECACA]', text: 'text-[#B31B24]', hex: '#B31B24' };
      case 'hr': return { bg: 'bg-[#FEF3C7]', border: 'border-[#FDE68A]', text: 'text-[#D97706]', hex: '#D97706' };
      case 'marketing': return { bg: 'bg-[#EDE9FE]', border: 'border-[#DDD6FE]', text: 'text-[#7C3AED]', hex: '#7C3AED' };
      default: return { bg: 'bg-[#FAF8F5]', border: 'border-[#E2DACB]', text: 'text-[#1C191E]', hex: '#1C191E' };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-5xl bg-[#FFFFFF] border border-[#E2DACB] rounded-2xl shadow-2xl max-h-[92vh] flex flex-col text-[#1C191E] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-[#EFEAE0] flex items-center justify-between bg-[#FCFAF6] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F7D5D8] border border-[#E89EAA] flex items-center justify-center text-[#B31B24] shrink-0 shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#7A747D] uppercase tracking-widest font-mono-num font-bold">
                  ORGANIZATIONAL HIERARCHY & ROADMAP
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#EFEAE0] font-bold text-[#554F59]">
                  {selectedLocation ? `خاص بـ: ${selectedLocation.name}` : 'النموذج المؤسسي'}
                </span>
              </div>
              <h2 className="font-serif-title text-base sm:text-lg font-bold text-[#1C191E] mt-0.5">
                هيكل الأقسام الأساسية وسلّم النضج التشغيلي
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#7A747D] hover:text-[#1C191E] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* VIEW SWITCHER TABS */}
        <div className="px-4 py-2 bg-[#F8F5EE] border-b border-[#E5DECE] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setActiveTab('departments'); setIsAddingMetric(false); }}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'departments'
                  ? 'bg-[#FFFFFF] text-[#B31B24] shadow-sm border border-[#E0D8C8]'
                  : 'text-[#7A747D] hover:text-[#1C191E] hover:bg-[#EFEAE0]'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>1. شجرة الأقسام الأربعة الأساسية</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono-num font-bold ${
                orgHierarchy.overallScore >= 80 ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#FEF3C7] text-[#D97706]'
              }`}>
                {orgHierarchy.overallScore}%
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('ladder'); setIsAddingMetric(false); }}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'ladder'
                  ? 'bg-[#FFFFFF] text-[#B31B24] shadow-sm border border-[#E0D8C8]'
                  : 'text-[#7A747D] hover:text-[#1C191E] hover:bg-[#EFEAE0]'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              <span>2. سلّم الـ 6 خطوات لبناء تجارة مزدهرة</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono-num font-bold bg-[#F7D5D8] text-[#B31B24]">
                {ladderRoadmap.overallProgress}%
              </span>
            </button>
          </div>

          <div className="text-[11px] text-[#7A747D] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#15803D]" />
            <span>يتم حفظ وتحديث المقاييس والمصادر تلقائياً</span>
          </div>
        </div>

        {/* MODAL SCROLLABLE BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">

          {/* ========================================================= */}
          {/* VIEW 1: 4 CORE DEPARTMENTS TREE (الفكرة الأولى) */}
          {/* ========================================================= */}
          {activeTab === 'departments' && (
            <div className="space-y-6">
              {/* TOP ROOT NODE */}
              <div className="flex flex-col items-center">
                <div className="w-full max-w-xl p-4 rounded-2xl bg-[#FCFAF6] border-2 border-[#B31B24] shadow-md flex items-center justify-between gap-4 text-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#F7D5D8] flex items-center justify-center text-[#B31B24] shrink-0 shadow-xs">
                      <Scale className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#7A747D] font-bold uppercase tracking-wider block">
                        خلية المنظومة المركزية
                      </span>
                      <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#1C191E]">
                        {orgName}
                      </h3>
                      <p className="text-[10px] text-[#7A747D]">
                        الأداء الإجمالي = متوسط نجاح الأقسام الـ 4
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-[#7A747D]">المؤشر العام:</span>
                    <span className={`text-2xl font-mono-num font-bold px-3 py-1 rounded-xl shadow-xs border ${
                      orgHierarchy.overallScore >= 80 ? 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]' :
                      orgHierarchy.overallScore >= 65 ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]' :
                      'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'
                    }`}>
                      {orgHierarchy.overallScore}%
                    </span>
                  </div>
                </div>

                <div className="w-0.5 h-6 bg-[#D5CDC0]" />
                <div className="w-[85%] max-w-3xl h-0.5 bg-[#D5CDC0] relative" />
                <div className="w-[85%] max-w-3xl flex justify-between h-4">
                  <div className="w-0.5 h-full bg-[#D5CDC0]" />
                  <div className="w-0.5 h-full bg-[#D5CDC0]" />
                  <div className="w-0.5 h-full bg-[#D5CDC0]" />
                  <div className="w-0.5 h-full bg-[#D5CDC0]" />
                </div>
              </div>

              {/* 4 DEPARTMENTS BRANCHES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {orgHierarchy.departments.map((dept) => {
                  const isSelected = selectedDeptKey === dept.key;
                  const colors = getDeptColor(dept.key);

                  return (
                    <div
                      key={dept.key}
                      onClick={() => { setSelectedDeptKey(dept.key); setIsAddingMetric(false); }}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected 
                          ? `${colors.bg} ${colors.border} shadow-md ring-2 ring-[#B31B24]/10 -translate-y-0.5` 
                          : 'bg-[#FAF8F5] border-[#E2DACB] hover:border-[#B31B24] hover:bg-[#FFFFFF] shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono-num font-bold uppercase ${colors.text} bg-[#FFFFFF] border ${colors.border}`}>
                            {dept.name}
                          </span>
                          <span className={`text-sm font-mono-num font-bold ${
                            dept.score >= 80 ? 'text-[#15803D]' :
                            dept.score >= 65 ? 'text-[#D97706]' : 'text-[#DC2626]'
                          }`}>
                            {dept.score}%
                          </span>
                        </div>

                        <h4 className="font-serif-title text-sm font-bold text-[#1C191E] mb-1">
                          {dept.arabicName}
                        </h4>
                        <p className="text-[10px] text-[#554F59] line-clamp-2 leading-relaxed">
                          {dept.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[#E5DECE] space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-[#7A747D]">
                          <span>المقاييس المسجلة:</span>
                          <span className="font-mono-num font-bold text-[#1C191E]">{dept.metrics.length} مقاييس</span>
                        </div>
                        <div className="w-full bg-[#E5DECE] h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, dept.score)}%`, backgroundColor: dept.color }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DEPARTMENT DETAILS & METRICS PANEL */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2DACB] shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFEAE0]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentDept.color }} />
                      <h4 className="font-serif-title text-sm sm:text-base font-bold text-[#1C191E]">
                        مؤشرات ومقاييس {currentDept.arabicName}
                      </h4>
                      <span className="text-xs font-mono-num font-bold text-[#15803D] px-2 py-0.5 rounded bg-[#DCFCE7]">
                        المعدل: {currentDept.score}%
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7A747D] mt-1">{currentDept.description}</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenAddMetric}
                    className="px-3.5 py-1.5 rounded-xl bg-[#B31B24] hover:bg-[#8A181F] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 self-start sm:self-auto shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة مقياس للقسم</span>
                  </button>
                </div>

                {/* ADD / EDIT METRIC FORM IN DEPARTMENT */}
                {isAddingMetric && (
                  <form onSubmit={handleSaveDepartmentMetric} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#B31B24] space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <h5 className="font-serif-title text-xs font-bold text-[#1C191E] flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5 text-[#B31B24]" />
                        <span>{editingMetricId ? 'تعديل مقياس' : `إضافة مقياس جديد إلى ${currentDept.arabicName}`}</span>
                      </h5>
                      <button
                        type="button"
                        onClick={() => setIsAddingMetric(false)}
                        className="text-xs text-[#7A747D] hover:text-[#1C191E]"
                      >
                        إلغاء
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">اسم المقياس *</label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: نسبة الالتزام بالموازنة، كفاءة التسليم..."
                          value={metricName}
                          onChange={(e) => setMetricName(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">القيمة الفعلية</label>
                        <input
                          type="number"
                          value={metricCurrent}
                          onChange={(e) => handleCurrentTargetChange(e.target.value, metricTarget)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs font-mono-num focus:outline-none focus:border-[#B31B24]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">المستهدف</label>
                        <input
                          type="number"
                          value={metricTarget}
                          onChange={(e) => handleCurrentTargetChange(metricCurrent, e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs font-mono-num focus:outline-none focus:border-[#B31B24]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">الوحدة</label>
                        <input
                          type="text"
                          value={metricUnit}
                          onChange={(e) => setMetricUnit(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">النسبة المئوية المحسوبة %</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={metricPercentage}
                          onChange={(e) => setMetricPercentage(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs font-mono-num font-bold focus:outline-none focus:border-[#B31B24]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">حالة المقياس</label>
                        <select
                          value={metricStatus}
                          onChange={(e) => setMetricStatus(e.target.value as any)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                        >
                          <option value="healthy">مستقر / ممتاز</option>
                          <option value="warning">تنبيه / يحتاج متابعة</option>
                          <option value="critical">حرج / فجوة تشغيلية</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">ملاحظات وطريقة الحساب أو المصدر</label>
                      <input
                        type="text"
                        placeholder="كيف يُقاس وما هي آلية التحقق أو التدخل المقترحة..."
                        value={metricNotes}
                        onChange={(e) => setMetricNotes(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddingMetric(false)}
                        className="px-3 py-1.5 rounded-lg border border-[#E5DECE] bg-[#FFFFFF] text-xs text-[#7A747D] hover:bg-[#FAF8F5]"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-[#B31B24] text-white text-xs font-bold hover:bg-[#8A181F]"
                      >
                        {editingMetricId ? 'حفظ التعديلات' : 'إضافة المقياس وإعادة الحساب'}
                      </button>
                    </div>
                  </form>
                )}

                {/* METRICS LIST TABLE */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#7A747D] font-bold pb-1 border-b border-[#EFEAE0]">
                    <span>المقاييس المسجلة داخل هذا القسم ({currentDept.metrics.length})</span>
                    <span>متوسط نجاح المقاييس = مؤشر القسم ({currentDept.score}%)</span>
                  </div>

                  {currentDept.metrics.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#7A747D] bg-[#FAF8F5] rounded-xl border border-dashed border-[#E0D8C8]">
                      <Activity className="w-6 h-6 mx-auto mb-1 text-[#9A94A0]" />
                      <p className="font-semibold text-[#1C191E]">لا توجد مقاييس مسجلة داخل هذا القسم بعد</p>
                      <p className="text-[10px] mt-0.5">اضغط على زر (إضافة مقياس للقسم) لإدخال مؤشرات الأداء الحقيقية</p>
                    </div>
                  ) : (
                    currentDept.metrics.map((metric) => (
                      <div 
                        key={metric.id}
                        className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E2DACB] hover:border-[#B31B24] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-serif-title text-xs font-bold text-[#1C191E]">
                              {metric.name}
                            </h5>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                              metric.status === 'healthy' ? 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]' :
                              metric.status === 'warning' ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]' :
                              'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'
                            }`}>
                              {metric.status === 'healthy' ? 'مستقر' : metric.status === 'warning' ? 'تنبيه' : 'حرج'}
                            </span>
                          </div>

                          {metric.notes && (
                            <p className="text-[10px] text-[#7A747D] mt-0.5 line-clamp-1">{metric.notes}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                          <div className="text-right">
                            <span className="text-[9px] text-[#7A747D] block">الفعلي / المستهدف:</span>
                            <span className="font-mono-num text-xs font-bold text-[#1C191E]">
                              {metric.currentValue} / {metric.targetValue} {metric.unit}
                            </span>
                          </div>

                          <div className="w-24 text-center">
                            <span className="font-mono-num font-bold text-xs text-[#B31B24] block">
                              {metric.percentage}%
                            </span>
                            <div className="w-full bg-[#E5DECE] h-1.5 rounded-full overflow-hidden mt-0.5">
                              <div 
                                className="h-full bg-[#B31B24] rounded-full"
                                style={{ width: `${Math.min(100, metric.percentage)}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-1 border-r border-[#E5DECE] pr-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditMetric(metric)}
                              className="p-1 rounded text-[#7A747D] hover:text-[#B31B24] hover:bg-[#FFFFFF] transition-colors"
                              title="تعديل المقياس"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDepartmentMetric(metric.id)}
                              className="p-1 rounded text-[#7A747D] hover:text-[#DC2626] hover:bg-[#FFFFFF] transition-colors"
                              title="حذف المقياس"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 2: 6-STEP OPERATIONAL LADDER - CONTINUOUS CONNECTED LINE */}
          {/* ========================================================= */}
          {activeTab === 'ladder' && (
            <div className="space-y-6">
              
              {/* LADDER OVERALL PROGRESS BANNER */}
              <div className="p-4 rounded-2xl bg-[#FCFAF6] border border-[#E2DACB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <span className="text-[10px] text-[#7A747D] uppercase font-bold tracking-wider">
                    OPERATIONAL MATURITY PIPELINE (6 STEPS)
                  </span>
                  <h3 className="font-serif-title text-sm sm:text-base font-bold text-[#1C191E] mt-0.5">
                    الخطوات الـ 6 لبناء تجارة مزدهرة
                  </h3>
                  <p className="text-[11px] text-[#7A747D]">
                    خط متصل ومسار متتابع يربط التحليل المالي والسيولة بالمخزون واقتصاديات التسويق والسيطرة الاستراتيجية.
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-[#FFFFFF] p-2.5 rounded-xl border border-[#E5DECE] shrink-0 self-start sm:self-auto">
                  <div className="text-right">
                    <span className="text-[9px] text-[#7A747D] block font-bold">إجمالي إنجاز المسار:</span>
                    <span className="text-lg font-mono-num font-bold text-[#B31B24]">
                      {ladderRoadmap.overallProgress}%
                    </span>
                  </div>
                  <div className="w-16 bg-[#EFEAE0] h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#B31B24] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, ladderRoadmap.overallProgress)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* CONTINUOUS CONNECTED LINE (خط متصل أنيق بدون نوافذ منفصلة) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FCFAF6] border border-[#E2DACB] shadow-xs">
                <div className="relative py-4 px-2">
                  {/* The continuous unbroken rail across all 6 steps */}
                  <div className="absolute top-[38px] right-6 left-6 h-1.5 bg-[#E2DACB] rounded-full z-0" />
                  
                  {/* The active progress fill on the line */}
                  <div 
                    className="absolute top-[38px] right-6 h-1.5 bg-gradient-to-l from-[#15803D] via-[#B31B24] to-[#B31B24] rounded-full z-0 transition-all duration-500"
                    style={{ 
                      width: `${Math.min(96, Math.max(8, ((selectedStepNumber - 1) / 5) * 92 + 8))}%` 
                    }}
                  />

                  {/* 6 Connected Steps Milestone Stations along the line */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative z-10">
                    {ladderRoadmap.steps.slice(0, 6).map((step) => {
                      const isSelected = selectedStepNumber === step.stepNumber;
                      const isDone = step.status === 'completed' || step.score === 100;
                      const inProgress = step.status === 'in_progress';

                      return (
                        <div
                          key={step.id}
                          onClick={() => { setSelectedStepNumber(step.stepNumber); setIsAddingMetric(false); }}
                          className={`flex flex-col items-center text-center cursor-pointer group/station transition-all p-2 rounded-xl select-none relative ${
                            isSelected 
                              ? 'bg-[#FFFFFF] shadow-sm ring-1 ring-[#B31B24]/30' 
                              : 'hover:bg-[#F5F0E6]'
                          }`}
                        >
                          {/* Station node directly on the line */}
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm font-mono-num transition-all shadow-xs mb-2 ${
                            isSelected 
                              ? 'bg-[#B31B24] text-white ring-4 ring-[#F7D5D8] scale-110' :
                            isDone 
                              ? 'bg-[#15803D] text-white ring-2 ring-[#DCFCE7]' :
                            inProgress 
                              ? 'bg-[#D97706] text-white ring-2 ring-[#FEF3C7]' :
                              'bg-[#FFFFFF] border-2 border-[#D5CDC0] text-[#7A747D]'
                          }`}>
                            {step.stepNumber}
                          </div>

                          {/* EXACT Step Title Label */}
                          <h4 className={`text-xs font-bold leading-tight transition-colors line-clamp-2 min-h-[32px] ${
                            isSelected ? 'text-[#B31B24] font-serif-title' : 'text-[#1C191E] group-hover/station:text-[#B31B24]'
                          }`}>
                            {step.title}
                          </h4>

                          {/* Score and metric badge */}
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className={`text-[10px] font-mono-num font-bold px-1.5 py-0.2 rounded ${
                              step.score >= 80 ? 'bg-[#DCFCE7] text-[#15803D]' :
                              step.score >= 60 ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-[#FEE2E2] text-[#B31B24]'
                            }`}>
                              {step.score}%
                            </span>
                            <span className="text-[9px] text-[#7A747D] font-mono-num">
                              ({step.metrics.length})
                            </span>
                          </div>

                          {/* Active downward pointing arrow directly under the active node */}
                          {isSelected && (
                            <div className="absolute -bottom-2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-[#B31B24]" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#EFEAE0] text-[10px] text-[#7A747D]">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#B31B24]" />
                    <span>انقر على أي محطة في الخط المتصل لتنبثق المؤشرات ومصادر البيانات تحتها</span>
                  </span>
                  <span className="font-bold text-[#1C191E]">الخطوة المحددة: {currentStep.title}</span>
                </div>
              </div>

              {/* VERTICAL STREAM OF INDICATORS UNDER SELECTED STEP (ينبثق تحته بشكل عمودي المؤشرات) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2DACB] shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                
                {/* Active Step Header with Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFEAE0]">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-6 h-6 rounded-full bg-[#B31B24] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {currentStep.stepNumber}
                      </span>
                      <h4 className="font-serif-title text-base font-bold text-[#1C191E]">
                        {currentStep.title}
                      </h4>
                      <span className="text-xs font-mono-num font-bold text-[#B31B24] px-2 py-0.5 rounded bg-[#F7D5D8] border border-[#E89EAA]">
                        نسبة إنجاز الخطوة: {currentStep.score}%
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7A747D] mt-1">{currentStep.description}</p>
                  </div>

                  {/* Actions: Add manual indicator + Link from Google Sheet / Google Form / Excel / CSV */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleOpenDataSourceModal()}
                      className="px-3.5 py-1.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      title="ربط مؤشر من جوجل فورم أو شيت إكسل أو CSV"
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>ربط مصدر بيانات (شيت / فورم / إكسل)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenAddMetric}
                      className="px-3.5 py-1.5 rounded-xl bg-[#B31B24] hover:bg-[#8A181F] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة مؤشر يدوي</span>
                    </button>
                  </div>
                </div>

                {/* ADD / EDIT MANUAL METRIC FORM */}
                {isAddingMetric && (
                  <form onSubmit={handleSaveLadderMetric} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#B31B24] space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <h5 className="font-serif-title text-xs font-bold text-[#1C191E] flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5 text-[#B31B24]" />
                        <span>{editingMetricId ? 'تعديل مؤشر الخطوة' : `إضافة مؤشر يدوي إلى ${currentStep.title}`}</span>
                      </h5>
                      <button
                        type="button"
                        onClick={() => setIsAddingMetric(false)}
                        className="text-xs text-[#7A747D] hover:text-[#1C191E]"
                      >
                        إلغاء
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">اسم المؤشر أو المخرج *</label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: هامش الربح التشغيلي، دورة تحويل النقد، معدل دوران المخزون..."
                          value={metricName}
                          onChange={(e) => setMetricName(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">نسبة الإنجاز % *</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={metricPercentage}
                          onChange={(e) => setMetricPercentage(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs font-mono-num font-bold focus:outline-none focus:border-[#B31B24]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">القيمة الفعلية</label>
                        <input
                          type="number"
                          value={metricCurrent}
                          onChange={(e) => handleCurrentTargetChange(e.target.value, metricTarget)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs font-mono-num"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">المستهدف المطلوب</label>
                        <input
                          type="number"
                          value={metricTarget}
                          onChange={(e) => handleCurrentTargetChange(metricCurrent, e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs font-mono-num"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">الوحدة</label>
                        <input
                          type="text"
                          value={metricUnit}
                          onChange={(e) => setMetricUnit(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">الملاحظات أو الشواهد</label>
                      <input
                        type="text"
                        placeholder="طريقة القياس، التقارير أو الملفات التابعة..."
                        value={metricNotes}
                        onChange={(e) => setMetricNotes(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddingMetric(false)}
                        className="px-3 py-1.5 rounded-lg border border-[#E5DECE] bg-[#FFFFFF] text-xs text-[#7A747D] hover:bg-[#FAF8F5]"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-[#B31B24] text-white text-xs font-bold hover:bg-[#8A181F]"
                      >
                        {editingMetricId ? 'حفظ التعديلات' : 'إضافة إلى الخطوة وإعادة الحساب'}
                      </button>
                    </div>
                  </form>
                )}

                {/* VERTICAL CASCADE: INDICATORS STACK (ينبثق تحته بشكل عمودي) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-[#7A747D] font-bold pb-1 border-b border-[#EFEAE0]">
                    <span>المؤشرات المنبثقة عمودياً تحت {currentStep.title} ({currentStep.metrics.length})</span>
                    <span>متوسط نجاح الخطوة = {currentStep.score}%</span>
                  </div>

                  {currentStep.metrics.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#7A747D] bg-[#FAF8F5] rounded-xl border border-dashed border-[#E0D8C8]">
                      <Activity className="w-8 h-8 mx-auto mb-2 text-[#9A94A0]" />
                      <p className="font-bold text-[#1C191E] text-sm">لا توجد مؤشرات مسجلة لهذه الخطوة بعد</p>
                      <p className="text-[11px] mt-1">
                        يمكنك إضافة مؤشر يدوي أو ربطه مباشرة بـ (جوجل فورم أو شيت إكسل أو CSV) لحساب الأداء تلقائياً
                      </p>
                      <div className="mt-3 flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenDataSourceModal()}
                          className="px-3 py-1.5 rounded-lg bg-[#15803D] text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Database className="w-3.5 h-3.5" />
                          <span>ربط ملف أو شيت</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleOpenAddMetric}
                          className="px-3 py-1.5 rounded-lg bg-[#B31B24] text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>إضافة يدوي</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    currentStep.metrics.map((metric) => (
                      <div 
                        key={metric.id}
                        className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E2DACB] hover:border-[#B31B24] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                      >
                        {/* Indicator Info & Source Badge */}
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-serif-title text-xs sm:text-sm font-bold text-[#1C191E]">
                              {metric.name}
                            </h5>

                            {/* Data Source Badge */}
                            {metric.dataSource ? (
                              <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border ${
                                metric.dataSource.type === 'google_form' ? 'bg-[#EDE9FE] text-[#7C3AED] border-[#DDD6FE]' :
                                metric.dataSource.type === 'google_sheet' ? 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]' :
                                metric.dataSource.type === 'excel' ? 'bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]' :
                                'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                              }`}>
                                <Database className="w-3 h-3" />
                                <span>
                                  {metric.dataSource.type === 'google_form' ? 'جوجل فورم' :
                                   metric.dataSource.type === 'google_sheet' ? 'جوجل شيت' :
                                   metric.dataSource.type === 'excel' ? 'إكسل' : 'CSV'}
                                </span>
                                {metric.dataSource.column && (
                                  <span className="opacity-75">[{metric.dataSource.column}]</span>
                                )}
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#EFEAE0] text-[#7A747D]">
                                يدوي
                              </span>
                            )}

                            {/* Health status badge */}
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                              metric.percentage >= 80 ? 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]' :
                              metric.percentage >= 60 ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]' :
                              'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'
                            }`}>
                              {metric.percentage >= 80 ? 'مستقر' : metric.percentage >= 60 ? 'تنبيه' : 'حرج'}
                            </span>
                          </div>

                          {metric.notes && (
                            <p className="text-[10px] text-[#7A747D] line-clamp-1">{metric.notes}</p>
                          )}

                          {metric.dataSource?.lastSynced && (
                            <div className="flex items-center gap-1 text-[8.5px] text-[#9A94A0]">
                              <span>آخر مزامنة: {metric.dataSource.lastSynced}</span>
                            </div>
                          )}
                        </div>

                        {/* Numbers, Progress, and Action Buttons */}
                        <div className="flex items-center gap-3 shrink-0 justify-between sm:justify-end">
                          {metric.currentValue !== undefined && metric.targetValue !== undefined && (
                            <div className="text-right">
                              <span className="text-[9px] text-[#7A747D] block">الفعلي / المستهدف:</span>
                              <span className="font-mono-num text-xs font-bold text-[#1C191E]">
                                {metric.currentValue} / {metric.targetValue} {metric.unit || '%'}
                              </span>
                            </div>
                          )}

                          <div className="w-24 text-center">
                            <span className="font-mono-num font-bold text-xs text-[#B31B24] block">
                              {metric.percentage}%
                            </span>
                            <div className="w-full bg-[#E5DECE] h-1.5 rounded-full overflow-hidden mt-0.5">
                              <div 
                                className="h-full bg-[#B31B24] rounded-full transition-all"
                                style={{ width: `${Math.min(100, metric.percentage)}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-1 border-r border-[#E5DECE] pr-2">
                            {/* Sync button if from source */}
                            {metric.dataSource && (
                              <button
                                type="button"
                                onClick={() => handleSyncLadderMetric(metric.id)}
                                className="p-1 rounded text-[#15803D] hover:bg-[#DCFCE7] transition-colors cursor-pointer"
                                title="إعادة مزامنة البيانات من المصدر"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleOpenEditMetric(metric)}
                              className="p-1 rounded text-[#7A747D] hover:text-[#B31B24] hover:bg-[#FFFFFF] transition-colors"
                              title="تعديل المؤشر"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLadderMetric(metric.id)}
                              className="p-1 rounded text-[#7A747D] hover:text-[#DC2626] hover:bg-[#FFFFFF] transition-colors"
                              title="حذف المؤشر"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ========================================================= */}
        {/* DATA SOURCE CONNECTION DIALOG / MODAL (جوجل فورم أو شيت إكسل أو CSV) */}
        {/* ========================================================= */}
        {isDataSourceModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div 
              className="w-full max-w-2xl bg-[#FFFFFF] border-2 border-[#15803D] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 bg-[#F2FAF4] border-b border-[#BBF7D0] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] flex items-center justify-center text-[#15803D]">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif-title text-sm font-bold text-[#1C191E]">
                      إمداد وربط المؤشر بمصدر بيانات حي
                    </h3>
                    <p className="text-[10px] text-[#7A747D]">
                      الخطوة المستهدفة: {currentStep.title}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDataSourceModalOpen(false)}
                  className="p-1.5 rounded-lg text-[#7A747D] hover:text-[#1C191E] hover:bg-[#E2DACB]/30"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 overflow-y-auto space-y-4 text-xs custom-scrollbar">
                
                {/* 1. Source Type Picker (جوجل فورم، جوجل شيت، إكسل، CSV) */}
                <div>
                  <label className="block text-[10px] font-bold text-[#7A747D] mb-1.5">
                    اختر نوع مصدر البيانات المطلوب ربطه:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setDataSourceType('google_form')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                        dataSourceType === 'google_form'
                          ? 'bg-[#EDE9FE] border-[#7C3AED] text-[#7C3AED] shadow-xs ring-1 ring-[#7C3AED]'
                          : 'bg-[#FAF8F5] border-[#E2DACB] text-[#554F59] hover:bg-[#FFFFFF]'
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                      <span className="font-bold text-[10.5px]">جوجل فورم</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDataSourceType('google_sheet')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                        dataSourceType === 'google_sheet'
                          ? 'bg-[#DCFCE7] border-[#15803D] text-[#15803D] shadow-xs ring-1 ring-[#15803D]'
                          : 'bg-[#FAF8F5] border-[#E2DACB] text-[#554F59] hover:bg-[#FFFFFF]'
                      }`}
                    >
                      <FileSpreadsheet className="w-5 h-5" />
                      <span className="font-bold text-[10.5px]">جوجل شيت</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDataSourceType('excel')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                        dataSourceType === 'excel'
                          ? 'bg-[#E0F2FE] border-[#0284C7] text-[#0284C7] shadow-xs ring-1 ring-[#0284C7]'
                          : 'bg-[#FAF8F5] border-[#E2DACB] text-[#554F59] hover:bg-[#FFFFFF]'
                      }`}
                    >
                      <Table className="w-5 h-5" />
                      <span className="font-bold text-[10.5px]">ملف إكسل (XLSX)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDataSourceType('csv')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                        dataSourceType === 'csv'
                          ? 'bg-[#FEF3C7] border-[#D97706] text-[#D97706] shadow-xs ring-1 ring-[#D97706]'
                          : 'bg-[#FAF8F5] border-[#E2DACB] text-[#554F59] hover:bg-[#FFFFFF]'
                      }`}
                    >
                      <FolderOpen className="w-5 h-5" />
                      <span className="font-bold text-[10.5px]">ملف CSV</span>
                    </button>
                  </div>
                </div>

                {/* 2. Source Configuration (رابط أو مسار الملف) */}
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] space-y-2.5">
                  {dataSourceType === 'google_sheet' || dataSourceType === 'google_form' ? (
                    <div>
                      <label className="block text-[10px] font-semibold text-[#7A747D] mb-1">
                        {dataSourceType === 'google_form' ? 'رابط نموذج جوجل أو شيت الردود (Google Form / Responses Sheet URL):' : 'رابط جدول بيانات جوجل (Google Spreadsheet URL):'}
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Link2 className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-[#9A94A0]" />
                          <input
                            type="url"
                            value={sourceUrlOrPath}
                            onChange={(e) => setSourceUrlOrPath(e.target.value)}
                            placeholder="https://docs.google.com/spreadsheets/d/..."
                            className="w-full pr-8 pl-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-xs font-mono text-[#1C191E] focus:outline-none focus:border-[#15803D]"
                          />
                        </div>
                        <input
                          type="text"
                          value={sheetTabName}
                          onChange={(e) => setSheetTabName(e.target.value)}
                          placeholder="اسم الورقة / التبويب"
                          className="w-36 px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-xs focus:outline-none focus:border-[#15803D]"
                          title="اسم الورقة"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-semibold text-[#7A747D] mb-1">
                        مسار الملف من الجهاز أو استعراض (Local File Path):
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <FolderOpen className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-[#9A94A0]" />
                          <input
                            type="text"
                            value={localFileName}
                            onChange={(e) => setLocalFileName(e.target.value)}
                            placeholder="C:/Business/Data_Export.xlsx"
                            className="w-full pr-8 pl-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-xs font-mono text-[#1C191E] focus:outline-none focus:border-[#15803D]"
                          />
                        </div>
                        <label className="px-3 py-1.5 rounded-lg bg-[#EFEAE0] hover:bg-[#E2DACB] text-[#1C191E] font-bold text-xs flex items-center gap-1 cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>تصفح</span>
                          <input
                            type="file"
                            accept={dataSourceType === 'excel' ? '.xlsx, .xls' : '.csv'}
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setLocalFileName(e.target.files[0].name);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Metric Name */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#7A747D] mb-1">
                    اسم المؤشر الناتج داخل الخطوة:
                  </label>
                  <input
                    type="text"
                    value={metricNameToAdd}
                    onChange={(e) => setMetricNameToAdd(e.target.value)}
                    placeholder="مثال: هامش الربح المحسوب من الشيت..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-xs focus:outline-none focus:border-[#15803D]"
                  />
                </div>

                {/* 4. INLINE FORMULA STRIP (طريقة تصميم المعادلة على شريط واحد متصل بدون أي نافذة منفصلة) */}
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-[#1C191E] flex items-center gap-1.5">
                      <Calculator className="w-3.5 h-3.5 text-[#15803D]" />
                      <span>شريط المعادلة الحسابية الموحد (نفس شريط الصورة بدون نافذة منفصلة):</span>
                    </span>
                    <span className="text-[9.5px] text-[#7A747D]">
                      إضافة أعمدة • تحديد الأقواس • اختيار دالة الحساب • العمليات الحسابية
                    </span>
                  </div>

                  {/* Single continuous strip */}
                  <InlineFormulaStrip
                    metricLabel={metricNameToAdd || 'مؤشر الخطوة'}
                    availableColumns={detectedColumns.map(col => ({
                      key: col.key,
                      label: col.label,
                      sampleValues: sampleRows.map(r => typeof r[col.key] === 'number' ? r[col.key] : parseFloat(r[col.key]) || 100),
                      uniqueValues: Array.from(new Set(sampleRows.map(r => String(r[col.key])).filter(Boolean))),
                      type: col.type as any
                    }))}
                    outputFormat={outputDisplayFormat === 'percentage' ? 'Percent' : 'Number'}
                    onFormulaChange={(blocks, calcVal, dispFormat) => {
                      setOutputDisplayFormat(dispFormat === 'Percent' ? 'percentage' : 'number');
                    }}
                  />
                </div>

                {/* LIVE PREVIEW SANDBOX */}
                <div className="p-3 rounded-xl bg-[#DCFCE7]/40 border border-[#BBF7D0] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#15803D]" />
                    <div>
                      <span className="text-[10px] text-[#15803D] font-bold block">معاينة النتيجة الحية للمؤشر:</span>
                      <span className="text-sm font-bold text-[#1C191E]">
                        القيمة المحسوبة: <strong className="font-mono-num">{liveCalculatedValue.value}</strong> {outputDisplayFormat === 'percentage' ? '%' : customUnit}
                      </span>
                    </div>
                  </div>

                  <div className="text-left">
                    <span className="text-[9px] text-[#7A747D] block">المساهمة في الخطوة:</span>
                    <span className="text-base font-mono-num font-bold text-[#15803D]">
                      {liveCalculatedValue.percentage}%
                    </span>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-3.5 bg-[#FAF8F5] border-t border-[#E5DECE] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDataSourceModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-[#E5DECE] bg-[#FFFFFF] text-xs text-[#7A747D] hover:bg-[#FAF8F5]"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleSaveDataSourceMetric}
                  className="px-4 py-1.5 rounded-xl bg-[#15803D] text-white text-xs font-bold hover:bg-[#166534] shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>ربط وحفظ المؤشر في الخطوة</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL FOOTER */}
        <div className="p-3.5 sm:p-4 border-t border-[#EFEAE0] bg-[#FCFAF6] flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center gap-2 text-[#7A747D] flex-wrap">
            <span className="font-bold text-[#1C191E]">{orgName}</span>
            <span>•</span>
            <span>الأداء الكلي للأقسام: <strong className="text-[#15803D] font-mono-num">{orgHierarchy.overallScore}%</strong></span>
            <span>•</span>
            <span>إنجاز السلّم: <strong className="text-[#B31B24] font-mono-num">{ladderRoadmap.overallProgress}%</strong></span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EFEAE0] border border-[#E5DECE] text-[#1C191E] font-bold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
