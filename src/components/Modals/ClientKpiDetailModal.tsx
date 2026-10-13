import React, { useState, useMemo } from 'react';
import { 
  X, 
  Plus, 
  FileSpreadsheet, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Trash2, 
  Edit3, 
  Link2, 
  RefreshCw, 
  Sliders, 
  Database, 
  HelpCircle, 
  Upload, 
  Table, 
  Sparkles,
  ExternalLink,
  ChevronDown,
  Check,
  Shield,
  Layers,
  BarChart3,
  FolderOpen,
  Filter,
  Calculator,
  Percent,
  Hash,
  ArrowRight,
  Info,
  CheckCheck,
  Search,
  Tag
} from 'lucide-react';
import { 
  ClientKpiCircle, 
  ClientKpiCategory, 
  KpiMetricItem, 
  CalculationMethod, 
  DataSourceType,
  AdvancedFormulaConfig,
  FormulaColumnTerm,
  AggregationFunction,
  ArithmeticOperator,
  DisplayOutputFormat,
  ColumnFilterRule
} from '../../types/dashboard';
import { InlineFormulaStrip } from '../Common/InlineFormulaStrip';

interface ClientKpiDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  circles: ClientKpiCircle[];
  activeCategoryId: ClientKpiCategory;
  onSelectCategory: (category: ClientKpiCategory) => void;
  onUpdateCircle: (updatedCircle: ClientKpiCircle) => void;
  selectedLocationName?: string;
}

// Sample tabular data row structure for sandbox and file parsing
interface DataRow {
  id: number;
  [key: string]: any;
}

// Dynamic Column Analysis metadata derived directly from parsed column data
interface ColumnInspection {
  key: string;
  label: string;
  totalRows: number;
  nonEmptyRows: number;
  detectedType: 'categorical' | 'numeric' | 'text';
  uniqueValues: Array<{ value: string; count: number; percent: number }>;
  min?: number;
  max?: number;
  average?: number;
  sampleValuesPreview: string[];
}

export const ClientKpiDetailModal: React.FC<ClientKpiDetailModalProps> = ({
  isOpen,
  onClose,
  circles,
  activeCategoryId,
  onSelectCategory,
  onUpdateCircle,
  selectedLocationName,
}) => {
  // Active circle
  const currentCircle: ClientKpiCircle = (circles && circles.length > 0
    ? circles.find(c => c.id === activeCategoryId) || circles[0]
    : null) || {
    id: 'commerce',
    name: 'التجارة',
    englishName: 'Commerce',
    tagline: 'المعاملات والتبادل التجاري',
    score: 82,
    status: 'good',
    description: 'المؤشرات التجارية ومعدل تدفق الصفقات والمبيعات',
    metrics: [],
  };

  // Tab mode within modal: 'metrics' | 'add-metric' | 'sheet-sync'
  const [activeTab, setActiveTab] = useState<'metrics' | 'add-metric' | 'sheet-sync'>('metrics');

  // Form State: Add / Edit Single Manual Metric
  const [metricName, setMetricName] = useState('');
  const [metricDesc, setMetricDesc] = useState('');
  const [metricUnit, setMetricUnit] = useState('%');
  const [metricCurrent, setMetricCurrent] = useState('85');
  const [metricTarget, setMetricTarget] = useState('100');
  const [metricMethod, setMetricMethod] = useState<CalculationMethod>('actual_vs_target');
  const [metricSource, setMetricSource] = useState<DataSourceType>('manual');
  const [editingMetricId, setEditingMetricId] = useState<string | null>(null);

  // =========================================================================
  // ADVANCED CALCULATION & DATA SOURCE FORM STATE
  // =========================================================================

  // Source Type: 'google_sheet' (URL) vs 'excel_csv' (Local file path / browse)
  const [sourceType, setSourceType] = useState<'google_sheet' | 'excel_csv'>('google_sheet');
  const [sheetUrl, setSheetUrl] = useState(
    currentCircle.sheetUrl || 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit'
  );
  const [localFilePath, setLocalFilePath] = useState('C:/Data/Sales_Performance_Q1.xlsx');
  const [localFileName, setLocalFileName] = useState('Sales_Performance_Q1.xlsx');
  const [sheetTabName, setSheetTabName] = useState(currentCircle.sheetName || 'البيانات_الرئيسية');

  // Output format: Percentage vs Number
  const [outputFormat, setOutputFormat] = useState<DisplayOutputFormat>('percentage');
  const [numberUnit, setNumberUnit] = useState('$');
  const [targetForNumber, setTargetForNumber] = useState<string>('50000');

  // Available Columns in the table
  const [columnsList, setColumnsList] = useState<Array<{ key: string; label: string; type: 'number' | 'text' }>>([
    { key: 'col_label', label: 'الاسم / البيان (A)', type: 'text' },
    { key: 'col_actual', label: 'المبيعات الفعلي (B)', type: 'number' },
    { key: 'col_target', label: 'المستهدف المطلوب (C)', type: 'number' },
    { key: 'col_costs', label: 'التكاليف والمصروفات (D)', type: 'number' },
    { key: 'col_gender', label: 'التصنيف / الجنس (E)', type: 'text' },
    { key: 'col_status', label: 'حالة الفرع / النشاط (F)', type: 'text' },
  ]);

  // Initial Sample Table Rows (Real rows for sandbox calculation and classification)
  const [sampleRows, setSampleRows] = useState<DataRow[]>([
    { id: 1, col_label: 'فريق الشرقية', col_actual: 28500, col_target: 25000, col_costs: 5200, col_gender: 'ذكور', col_status: 'نشط' },
    { id: 2, col_label: 'فريق الغربية', col_actual: 19800, col_target: 20000, col_costs: 4100, col_gender: 'إناث', col_status: 'نشط' },
    { id: 3, col_label: 'فريق العاصمة', col_actual: 34200, col_target: 30000, col_costs: 6800, col_gender: 'ذكور', col_status: 'مكتمل' },
    { id: 4, col_label: 'فريق الشمال', col_actual: 22400, col_target: 20000, col_costs: 4600, col_gender: 'إناث', col_status: 'نشط' },
    { id: 5, col_label: 'فريق الجنوب', col_actual: 16900, col_target: 18000, col_costs: 3700, col_gender: 'ذكور', col_status: 'نشط' },
    { id: 6, col_label: 'فرع الدلتا', col_actual: 31000, col_target: 28000, col_costs: 5900, col_gender: 'إناث', col_status: 'مكتمل' },
  ]);

  // Formula Terms State: Multi-column calculation with aggregation, operators, filters, parentheses
  const [formulaTerms, setFormulaTerms] = useState<FormulaColumnTerm[]>([
    {
      id: 'term-1',
      column: 'col_actual',
      aggregation: 'sum',
      filter: { enabled: true, filterColumn: 'col_gender', operator: 'equals', value: 'ذكور' },
      parenthesisOpen: 1,
      parenthesisClose: 0,
      nextOperator: '-',
    },
    {
      id: 'term-2',
      column: 'col_costs',
      aggregation: 'sum',
      filter: { enabled: false, filterColumn: 'col_status', operator: 'equals', value: '' },
      parenthesisOpen: 0,
      parenthesisClose: 1,
      nextOperator: '/',
    },
    {
      id: 'term-3',
      column: 'col_target',
      aggregation: 'sum',
      filter: { enabled: false, filterColumn: 'col_status', operator: 'equals', value: '' },
      parenthesisOpen: 0,
      parenthesisClose: 0,
      nextOperator: null,
    },
  ]);

  const [metricFormulaTitle, setMetricFormulaTitle] = useState('معادلة كفاءة المبيعات والربحية (مخصصة)');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  // =========================================================================
  // DYNAMIC DATA INSPECTOR ENGINE (Reads actual column data and derives options)
  // =========================================================================

  // Inspects any column in the current dataset, determining actual types, statistics, and distinct unique values
  const inspectColumnData = (columnKey: string): ColumnInspection => {
    const colMeta = columnsList.find(c => c.key === columnKey);
    const label = colMeta?.label || columnKey;
    
    const validRows = sampleRows.filter(r => r[columnKey] !== undefined && r[columnKey] !== null && String(r[columnKey]).trim() !== '');
    const rawValues = validRows.map(r => r[columnKey]);

    // Check if numeric
    const numericValues = rawValues
      .map(v => typeof v === 'number' ? v : parseFloat(String(v).replace(/[^0-9.-]/g, '')))
      .filter(n => !isNaN(n));

    const isPredominantlyNumeric = rawValues.length > 0 && (numericValues.length / rawValues.length >= 0.7);

    // Compute frequency distribution of distinct values
    const frequencyMap: Record<string, number> = {};
    rawValues.forEach(v => {
      const strVal = String(v).trim();
      frequencyMap[strVal] = (frequencyMap[strVal] || 0) + 1;
    });

    const uniqueValues = Object.entries(frequencyMap).map(([value, count]) => ({
      value,
      count,
      percent: Math.round((count / (rawValues.length || 1)) * 100),
    })).sort((a, b) => b.count - a.count);

    let min: number | undefined;
    let max: number | undefined;
    let average: number | undefined;

    if (isPredominantlyNumeric && numericValues.length > 0) {
      min = Math.min(...numericValues);
      max = Math.max(...numericValues);
      average = Math.round((numericValues.reduce((a, b) => a + b, 0) / numericValues.length) * 100) / 100;
    }

    const detectedType: 'categorical' | 'numeric' | 'text' = isPredominantlyNumeric 
      ? 'numeric' 
      : (uniqueValues.length <= 15 ? 'categorical' : 'text');

    return {
      key: columnKey,
      label,
      totalRows: sampleRows.length,
      nonEmptyRows: validRows.length,
      detectedType,
      uniqueValues,
      min,
      max,
      average,
      sampleValuesPreview: uniqueValues.slice(0, 5).map(u => u.value),
    };
  };

  // Helper for computing circle score and status from metric items
  const computeCircleScoreAndStatus = (metrics: KpiMetricItem[]) => {
    if (!metrics || metrics.length === 0) {
      return { score: 0, status: 'danger' as const };
    }
    const sum = metrics.reduce((acc, m) => acc + (m.percentage || 0), 0);
    const score = Math.min(100, Math.max(0, Math.round(sum / metrics.length)));
    const status: 'good' | 'warning' | 'danger' = score >= 75 ? 'good' : score >= 50 ? 'warning' : 'danger';
    return { score, status };
  };

  // =========================================================================
  // MATHEMATICAL FORMULA EVALUATION ENGINE
  // =========================================================================

  // Calculate aggregation for a single term on the sample rows
  const evaluateSingleTerm = (term: FormulaColumnTerm) => {
    let rowsToAggregate = sampleRows;

    // Apply filter condition if enabled and value is specified
    if (term.filter && term.filter.enabled && term.filter.value.trim()) {
      const filterCol = term.filter.filterColumn || term.column;
      const targetVal = term.filter.value.trim().toLowerCase();
      
      rowsToAggregate = sampleRows.filter(r => {
        const rowVal = String(r[filterCol] || '').trim().toLowerCase();
        if (term.filter?.operator === 'equals') {
          return rowVal === targetVal;
        } else if (term.filter?.operator === 'contains') {
          return rowVal.includes(targetVal);
        } else if (term.filter?.operator === 'not_equals') {
          return rowVal !== targetVal;
        }
        return true;
      });
    }

    // Extract numbers from selected column
    const numbers = rowsToAggregate
      .map(r => parseFloat(r[term.column]))
      .filter(n => !isNaN(n));

    if (numbers.length === 0) return 0;

    switch (term.aggregation) {
      case 'sum':
        return numbers.reduce((acc, n) => acc + n, 0);
      case 'average':
        return Math.round((numbers.reduce((acc, n) => acc + n, 0) / numbers.length) * 100) / 100;
      case 'max':
        return Math.max(...numbers);
      case 'min':
        return Math.min(...numbers);
      case 'count':
        return numbers.length;
      default:
        return numbers.reduce((acc, n) => acc + n, 0);
    }
  };

  // Evaluate the entire mathematical expression with parentheses & operators
  const calculationSummary = useMemo(() => {
    if (!formulaTerms || formulaTerms.length === 0) {
      return {
        formulaString: 'لا توجد حدود للمعادلة',
        termEvaluations: [],
        rawResult: 0,
        computedPercentage: 0,
        isValid: false,
        errorMessage: null,
      };
    }

    try {
      const termEvals: Array<{
        termId: string;
        colLabel: string;
        aggregationLabel: string;
        filterText: string;
        value: number;
        openParens: string;
        closeParens: string;
        operator: string;
      }> = [];

      let mathExpression = '';
      let humanReadableExpression = '';

      formulaTerms.forEach((term, index) => {
        const val = evaluateSingleTerm(term);
        const colObj = columnsList.find(c => c.key === term.column);
        const colName = colObj ? colObj.label.split(' ')[0] : term.column;
        
        const aggName = 
          term.aggregation === 'sum' ? 'مجموع' :
          term.aggregation === 'average' ? 'متوسط' :
          term.aggregation === 'max' ? 'أقصى' :
          term.aggregation === 'min' ? 'أدنى' : 'عدد';

        let filterText = '';
        if (term.filter && term.filter.enabled && term.filter.value) {
          const filterColObj = columnsList.find(c => c.key === term.filter?.filterColumn);
          const filterColName = filterColObj ? filterColObj.label.split(' ')[0] : 'تصنيف';
          filterText = ` [${filterColName}: ${term.filter.value}]`;
        }

        const openParensStr = '('.repeat(term.parenthesisOpen || 0);
        const closeParensStr = ')'.repeat(term.parenthesisClose || 0);
        const nextOp = index < formulaTerms.length - 1 ? (term.nextOperator || '+') : '';

        termEvals.push({
          termId: term.id,
          colLabel: colName,
          aggregationLabel: aggName,
          filterText,
          value: val,
          openParens: openParensStr,
          closeParens: closeParensStr,
          operator: nextOp,
        });

        // Safe mathematical expression string
        mathExpression += `${openParensStr}${val}${closeParensStr} ${nextOp} `;
        humanReadableExpression += `${openParensStr}${aggName}(${colName}${filterText})${closeParensStr} ${nextOp === '*' ? '×' : nextOp === '/' ? '÷' : nextOp} `;
      });

      // Safely evaluate math expression
      const cleanExpr = mathExpression.trim();
      let evaluatedRawNumber = 0;

      if (/^[0-9\.\s\+\-\*\/\(\)]+$/.test(cleanExpr)) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`return (${cleanExpr})`);
        evaluatedRawNumber = fn();
      }

      if (isNaN(evaluatedRawNumber) || !isFinite(evaluatedRawNumber)) {
        evaluatedRawNumber = 0;
      }

      // Convert to circle percentage depending on output format
      let finalPercentage = 0;
      const targetNum = parseFloat(targetForNumber) || 100;

      if (outputFormat === 'percentage') {
        if (evaluatedRawNumber > 0 && evaluatedRawNumber <= 1.5) {
          finalPercentage = Math.round(evaluatedRawNumber * 100);
        } else {
          finalPercentage = Math.round(evaluatedRawNumber);
        }
      } else {
        finalPercentage = targetNum > 0 ? Math.round((evaluatedRawNumber / targetNum) * 100) : 50;
      }

      finalPercentage = Math.min(100, Math.max(0, finalPercentage));

      return {
        formulaString: humanReadableExpression.trim(),
        termEvaluations: termEvals,
        rawResult: Math.round(evaluatedRawNumber * 100) / 100,
        computedPercentage: finalPercentage,
        isValid: true,
        errorMessage: null,
      };
    } catch (err: any) {
      return {
        formulaString: 'خطأ في صياغة المعادلة أو الأقواس',
        termEvaluations: [],
        rawResult: 0,
        computedPercentage: 0,
        isValid: false,
        errorMessage: 'تأكد من إغلاق الأقواس بشكل صحيح وضبط العمليات الحسابية',
      };
    }
  }, [formulaTerms, sampleRows, columnsList, outputFormat, targetForNumber]);

  // Handle adding a new column term
  const handleAddTerm = () => {
    const newTerm: FormulaColumnTerm = {
      id: `term-${Date.now()}`,
      column: columnsList[1]?.key || 'col_actual',
      aggregation: 'sum',
      filter: { enabled: false, filterColumn: 'col_gender', operator: 'equals', value: '' },
      parenthesisOpen: 0,
      parenthesisClose: 0,
      nextOperator: '+',
    };

    setFormulaTerms(prev => {
      // Ensure previous last term gets a default nextOperator
      if (prev.length > 0) {
        const updated = [...prev];
        if (!updated[updated.length - 1].nextOperator) {
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            nextOperator: '+',
          };
        }
        return [...updated, { ...newTerm, nextOperator: null }];
      }
      return [{ ...newTerm, nextOperator: null }];
    });
  };

  // Handle updating a single term
  const handleUpdateTerm = (termId: string, updates: Partial<FormulaColumnTerm>) => {
    setFormulaTerms(prev => prev.map(t => t.id === termId ? { ...t, ...updates } : t));
  };

  // Handle deleting a term
  const handleDeleteTerm = (termId: string) => {
    if (formulaTerms.length <= 1) return;
    setFormulaTerms(prev => {
      const filtered = prev.filter(t => t.id !== termId);
      // Ensure the last term has nextOperator: null
      if (filtered.length > 0) {
        filtered[filtered.length - 1] = {
          ...filtered[filtered.length - 1],
          nextOperator: null,
        };
      }
      return filtered;
    });
  };

  // Preset equation loader
  const applyPresetFormula = (type: 'sales_target_ratio' | 'net_profit_margin' | 'gender_segment_ratio') => {
    if (type === 'sales_target_ratio') {
      setOutputFormat('percentage');
      setMetricFormulaTitle('نسبة إنجاز المبيعات (الفعلي ÷ المستهدف)');
      setFormulaTerms([
        {
          id: 'term-p1',
          column: 'col_actual',
          aggregation: 'sum',
          filter: { enabled: false, filterColumn: 'col_gender', operator: 'equals', value: '' },
          parenthesisOpen: 1,
          parenthesisClose: 0,
          nextOperator: '/',
        },
        {
          id: 'term-p2',
          column: 'col_target',
          aggregation: 'sum',
          filter: { enabled: false, filterColumn: 'col_gender', operator: 'equals', value: '' },
          parenthesisOpen: 0,
          parenthesisClose: 1,
          nextOperator: null,
        },
      ]);
    } else if (type === 'net_profit_margin') {
      setOutputFormat('number');
      setNumberUnit('ر.س');
      setTargetForNumber('100000');
      setMetricFormulaTitle('صافي الأرباح (مجموع المبيعات - التكاليف)');
      setFormulaTerms([
        {
          id: 'term-p1',
          column: 'col_actual',
          aggregation: 'sum',
          filter: { enabled: false, filterColumn: 'col_gender', operator: 'equals', value: '' },
          parenthesisOpen: 0,
          parenthesisClose: 0,
          nextOperator: '-',
        },
        {
          id: 'term-p2',
          column: 'col_costs',
          aggregation: 'sum',
          filter: { enabled: false, filterColumn: 'col_gender', operator: 'equals', value: '' },
          parenthesisOpen: 0,
          parenthesisClose: 0,
          nextOperator: null,
        },
      ]);
    } else if (type === 'gender_segment_ratio') {
      setOutputFormat('percentage');
      setMetricFormulaTitle('حصة مبيعات الذكور مقارنة بالمستهدف الإجمالي');
      setFormulaTerms([
        {
          id: 'term-p1',
          column: 'col_actual',
          aggregation: 'sum',
          filter: { enabled: true, filterColumn: 'col_gender', operator: 'equals', value: 'ذكور' },
          parenthesisOpen: 1,
          parenthesisClose: 0,
          nextOperator: '/',
        },
        {
          id: 'term-p2',
          column: 'col_target',
          aggregation: 'sum',
          filter: { enabled: false, filterColumn: 'col_gender', operator: 'equals', value: '' },
          parenthesisOpen: 0,
          parenthesisClose: 1,
          nextOperator: null,
        },
      ]);
    }
  };

  // Local File Upload / Browser Handler (CSV or Excel)
  const handleLocalFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLocalFileName(file.name);
    setLocalFilePath(`C:/Users/User/Documents/${file.name}`);

    // If text/csv, parse content dynamically
    if (file.name.endsWith('.csv') || file.type.includes('csv')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (!text) return;

        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length > 1) {
          const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
          
          const newCols = headers.map((h, idx) => ({
            key: `col_${idx}`,
            label: `${h} (${String.fromCharCode(65 + idx)})`,
            type: 'number' as const,
          }));
          setColumnsList(newCols);

          const parsedRows: DataRow[] = lines.slice(1, 15).map((line, rIdx) => {
            const vals = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
            const rowObj: DataRow = { id: rIdx + 1 };
            headers.forEach((h, cIdx) => {
              const val = vals[cIdx] || '';
              const num = parseFloat(val);
              rowObj[`col_${cIdx}`] = !isNaN(num) ? num : val;
            });
            return rowObj;
          });

          setSampleRows(parsedRows);
          setSyncSuccessMessage(`تم تحميل وقراءة ملف "${file.name}" واستخراج ${headers.length} أعمدة بنجاح.`);
          setTimeout(() => setSyncSuccessMessage(null), 4000);
        }
      };
      reader.readAsText(file);
    } else {
      setSyncSuccessMessage(`تم تحديد مسار ملف "${file.name}" بنجاح. سيتم تحليل ومزامنة الأعمدة.`);
      setTimeout(() => setSyncSuccessMessage(null), 4000);
    }
  };

  // Save / Apply Advanced Formula to Circle
  const handleApplyFormulaToCircle = () => {
    setIsSyncing(true);

    const advancedConfig: AdvancedFormulaConfig = {
      sourceType: sourceType,
      filePath: sourceType === 'excel_csv' ? localFilePath : undefined,
      fileName: sourceType === 'excel_csv' ? localFileName : undefined,
      sheetUrl: sourceType === 'google_sheet' ? sheetUrl : undefined,
      sheetTabName: sheetTabName,
      formulaTitle: metricFormulaTitle,
      outputFormat: outputFormat,
      numberUnit: outputFormat === 'number' ? numberUnit : '%',
      targetValue: outputFormat === 'number' ? parseFloat(targetForNumber) : 100,
      terms: formulaTerms,
      humanFormula: calculationSummary.formulaString,
      calculatedRawValue: calculationSummary.rawResult,
      evaluatedPercentage: calculationSummary.computedPercentage,
    };

    setTimeout(() => {
      const newFormulaMetric: KpiMetricItem = {
        id: `formula-kpi-${Date.now()}`,
        name: metricFormulaTitle,
        description: `معادلة: ${calculationSummary.formulaString}`,
        currentValue: calculationSummary.rawResult,
        targetValue: outputFormat === 'number' ? (parseFloat(targetForNumber) || 100) : 100,
        unit: outputFormat === 'number' ? numberUnit : '%',
        calculationMethod: 'custom_ratio',
        percentage: calculationSummary.computedPercentage,
        status: calculationSummary.computedPercentage >= 75 ? 'good' : calculationSummary.computedPercentage >= 50 ? 'warning' : 'danger',
        dataSource: sourceType,
        formulaConfig: advancedConfig,
      };

      const existingMetrics = currentCircle.metrics || [];
      const updatedMetrics = [newFormulaMetric, ...existingMetrics.filter(m => !m.formulaConfig)];

      const { score, status } = computeCircleScoreAndStatus(updatedMetrics);

      const updatedCircle: ClientKpiCircle = {
        ...currentCircle,
        score,
        status,
        metrics: updatedMetrics,
        activeFormulaConfig: advancedConfig,
        sheetUrl: sourceType === 'google_sheet' ? sheetUrl : undefined,
        sheetName: sheetTabName,
        lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      onUpdateCircle(updatedCircle);
      setIsSyncing(false);
      setSyncSuccessMessage(`تم حفظ المعادلة وتحديث نسبة الدائرة بنجاح إلى ${score}%!`);
      setTimeout(() => setSyncSuccessMessage(null), 4000);
      setActiveTab('metrics');
    }, 600);
  };

  // Form Submit: Add / Edit Single Manual Metric
  const handleSubmitMetric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metricName.trim()) return;

    const currentNum = parseFloat(metricCurrent) || 0;
    const targetNum = parseFloat(metricTarget) || 100;

    let calculatedPercentage = 0;
    if (metricMethod === 'actual_vs_target') {
      calculatedPercentage = targetNum > 0 ? Math.round((currentNum / targetNum) * 100) : 0;
    } else if (metricMethod === 'survey_satisfaction' || metricMethod === 'compliance_percentage') {
      calculatedPercentage = Math.round(currentNum);
    } else {
      calculatedPercentage = Math.round(currentNum);
    }
    calculatedPercentage = Math.min(100, Math.max(0, calculatedPercentage));

    const status: 'good' | 'warning' | 'danger' = 
      calculatedPercentage >= 75 ? 'good' : calculatedPercentage >= 50 ? 'warning' : 'danger';

    const newMetric: KpiMetricItem = {
      id: editingMetricId || `metric-${Date.now()}`,
      name: metricName.trim(),
      description: metricDesc.trim(),
      currentValue: currentNum,
      targetValue: targetNum,
      unit: metricUnit.trim() || '%',
      calculationMethod: metricMethod,
      percentage: calculatedPercentage,
      status,
      dataSource: metricSource,
    };

    let updatedMetrics = [...(currentCircle.metrics || [])];
    if (editingMetricId) {
      updatedMetrics = updatedMetrics.map(m => m.id === editingMetricId ? newMetric : m);
    } else {
      updatedMetrics = [newMetric, ...updatedMetrics];
    }

    const { score, status: circleStatus } = computeCircleScoreAndStatus(updatedMetrics);

    const updatedCircle: ClientKpiCircle = {
      ...currentCircle,
      score,
      status: circleStatus,
      metrics: updatedMetrics,
    };

    onUpdateCircle(updatedCircle);
    setActiveTab('metrics');
    setEditingMetricId(null);
    setMetricName('');
    setMetricDesc('');
  };

  // Delete Metric
  const handleDeleteMetric = (metricId: string) => {
    const updatedMetrics = (currentCircle.metrics || []).filter(m => m.id !== metricId);
    const { score, status } = computeCircleScoreAndStatus(updatedMetrics);

    const updatedCircle: ClientKpiCircle = {
      ...currentCircle,
      score,
      status,
      metrics: updatedMetrics,
    };

    onUpdateCircle(updatedCircle);
  };

  // Status Styling for Circle Donut Header
  const getCircleAura = (score: number) => {
    if (score >= 75) {
      return {
        stroke: '#16A34A',
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        glow: 'shadow-[0_0_24px_rgba(22,163,74,0.3)] ring-1 ring-emerald-400',
        badge: 'مستقر / متوازن (أخضر هادئ)',
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 inline ml-1" />
      };
    } else if (score >= 50) {
      return {
        stroke: '#D97706',
        bg: 'bg-amber-50 text-amber-800 border-amber-300',
        glow: 'shadow-[0_0_24px_rgba(217,119,6,0.35)] ring-1 ring-amber-400 animate-pulse',
        badge: 'تنبيه تحذيري (وميض أصفر إرشادي)',
        icon: <AlertCircle className="w-4 h-4 text-amber-600 inline ml-1" />
      };
    } else {
      return {
        stroke: '#DC2626',
        bg: 'bg-red-50 text-red-800 border-red-400',
        glow: 'shadow-[0_0_30px_rgba(220,38,38,0.65)] ring-2 ring-red-500 animate-pulse',
        badge: 'خطر يستوجب التدخل (وميض متكرر كأن هناك خطأ)',
        icon: <AlertTriangle className="w-4 h-4 text-red-600 inline ml-1 animate-bounce" />
      };
    }
  };

  if (!isOpen) return null;

  const aura = getCircleAura(currentCircle.score);
  const circumference = 2 * Math.PI * 26; // r = 26
  const strokeDashoffset = circumference - (currentCircle.score / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-5xl bg-[#FFFFFF] border border-[#E2DACB] rounded-2xl shadow-2xl text-[#1C191E] max-h-[94vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="px-5 py-3 border-b border-[#EFEAE0] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#8A181F]/10 border border-[#8A181F]/20 flex items-center justify-center text-[#8A181F]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-title text-base sm:text-lg font-bold text-[#1C191E]">
                  CLIENT MAIN KPIS & CALCULATION ENGINE
                </h2>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#EFEAE0] text-[#554F59] font-bold">
                  {selectedLocationName ? `خاص بالعميل: ${selectedLocationName}` : 'المؤشرات الرئيسية الثلاثة'}
                </span>
              </div>
              <p className="text-xs text-[#7A747D]">
                إدارة وبناء معادلات المقاييس (التجارة • المؤثرات • الثقة) في نافذة موحدة مع قراءة بيانات الأعمدة تلقائياً
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#EFEAE0] rounded-xl text-[#7A747D] hover:text-[#1C191E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 CIRCLE TABS BAR */}
        <div className="px-5 pt-2.5 pb-2 border-b border-[#EFEAE0] bg-[#FFFFFF] flex items-center justify-between flex-wrap gap-2">
          {/* Circles Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F4F1EA] rounded-xl border border-[#E5DECE]">
            {circles.map((c) => {
              const isSelected = c.id === currentCircle.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectCategory(c.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isSelected 
                      ? 'bg-[#FFFFFF] text-[#1C191E] shadow-sm border border-[#D5CDBC]' 
                      : 'text-[#6A6470] hover:text-[#1C191E] hover:bg-[#EAE5D9]'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    c.score >= 75 ? 'bg-emerald-500 shadow-[0_0_6px_#10B981]' : c.score >= 50 ? 'bg-amber-500' : 'bg-red-500 animate-pulse'
                  }`} />
                  <span>{c.name}</span>
                  <span className="font-mono-num text-[10px] bg-[#F0EDE4] px-1.5 py-0.2 rounded text-[#332F38]">
                    {c.score}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sub-tabs within selected circle */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'metrics'
                  ? 'bg-[#1C191E] text-white shadow-xs'
                  : 'bg-[#F4F1EA] text-[#554F59] hover:bg-[#EFEAE0]'
              }`}
            >
              قائمة المقاييس ({currentCircle.metrics?.length || 0})
            </button>
            <button
              onClick={() => {
                setEditingMetricId(null);
                setMetricName('');
                setMetricDesc('');
                setActiveTab('add-metric');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'add-metric'
                  ? 'bg-[#1C191E] text-white shadow-xs'
                  : 'bg-[#F4F1EA] text-[#554F59] hover:bg-[#EFEAE0]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة مقياس يدوي</span>
            </button>
            <button
              onClick={() => setActiveTab('sheet-sync')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'sheet-sync'
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-500" />
              <span>نافذة بناء المعادلة والحساب</span>
            </button>
          </div>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5 space-y-4">

          {/* SELECTED CIRCLE HERO CARD */}
          <div className={`p-3.5 rounded-2xl border ${aura.bg} flex flex-col md:flex-row items-center justify-between gap-4 ${aura.glow} transition-all`}>
            <div className="flex items-center gap-4">
              {/* Donut Gauge */}
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    fill="none"
                    stroke="#E2DACB"
                    strokeWidth="5.5"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    fill="none"
                    stroke={aura.stroke}
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-mono-num text-base font-black text-[#1C191E] leading-none">
                    {currentCircle.score}%
                  </span>
                  <span className="text-[8px] uppercase font-bold text-[#554F59] mt-0.5">
                    النسبة
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif-title text-sm sm:text-base font-bold text-[#1C191E]">
                    الدائرة: {currentCircle.name} ({currentCircle.englishName})
                  </h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border border-current">
                    {aura.icon}
                    {aura.badge}
                  </span>
                </div>
                <p className="text-xs text-[#554F59] mt-0.5 font-medium">
                  {currentCircle.tagline}
                </p>
                <p className="text-[11px] text-[#7A747D] mt-0.5">
                  {currentCircle.description}
                </p>
              </div>
            </div>

            {/* Quick summary numbers */}
            <div className="flex md:flex-col items-end gap-1 shrink-0 text-left">
              <div className="text-xs text-[#554F59]">
                عدد المقاييس المعتمدة: <span className="font-bold font-mono-num text-[#1C191E]">{currentCircle.metrics?.length || 0}</span>
              </div>
              {currentCircle.activeFormulaConfig && (
                <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>معادلة فعالة نشطة: {currentCircle.activeFormulaConfig.outputFormat === 'percentage' ? 'نسبة مئوية' : 'رقم'}</span>
                </div>
              )}
            </div>
          </div>

          {/* SUCCESS MESSAGE BANNER */}
          {syncSuccessMessage && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center justify-between font-bold animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCheck className="w-4 h-4 text-emerald-700" />
                <span>{syncSuccessMessage}</span>
              </div>
              <button onClick={() => setSyncSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-950">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: LIST OF METRICS */}
          {/* ========================================================================= */}
          {activeTab === 'metrics' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A747D] flex items-center gap-1.5">
                  <span>المقاييس المسجلة داخل دائرة ({currentCircle.name})</span>
                  <span className="text-[11px] text-[#15803D] font-normal font-sans">
                    (تُجمع نسبها لتشكل النسبة الإجمالية {currentCircle.score}%)
                  </span>
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('sheet-sync')}
                    className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>بناء معادلة وحساب أعمدة</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingMetricId(null);
                      setMetricName('');
                      setMetricDesc('');
                      setActiveTab('add-metric');
                    }}
                    className="text-xs font-bold text-[#8A181F] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>مقياس يدوي</span>
                  </button>
                </div>
              </div>

              {currentCircle.metrics && currentCircle.metrics.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentCircle.metrics.map((metric) => {
                    const isHealthy = metric.percentage >= 75;
                    const isWarning = metric.percentage >= 50 && metric.percentage < 75;

                    return (
                      <div
                        key={metric.id}
                        className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] hover:border-[#1C191E] transition-all flex flex-col justify-between group shadow-2xs"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div>
                              <h5 className="font-bold text-xs text-[#1C191E] flex items-center gap-1.5 flex-wrap">
                                <span>{metric.name}</span>
                                {metric.formulaConfig ? (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-bold border border-purple-300 flex items-center gap-0.5">
                                    <Calculator className="w-2.5 h-2.5" />
                                    <span>معادلة مخصصة</span>
                                  </span>
                                ) : metric.dataSource === 'google_sheet' ? (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                                    جوجل شيت
                                  </span>
                                ) : metric.dataSource === 'excel_csv' ? (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-bold border border-blue-300">
                                    إكسيل / CSV
                                  </span>
                                ) : null}
                              </h5>
                              <p className="text-[11px] text-[#7A747D] line-clamp-2 mt-0.5">
                                {metric.description || 'لا يوجد وصف مدخل لهذا المقياس.'}
                              </p>
                            </div>

                            {/* Percentage badge */}
                            <div className="text-right shrink-0">
                              <span className={`font-mono-num font-black text-sm ${
                                isHealthy ? 'text-emerald-700' : isWarning ? 'text-amber-700' : 'text-red-700'
                              }`}>
                                {metric.percentage}%
                              </span>
                              <div className="text-[8.5px] text-[#7A747D]">نسبة الأداء</div>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full bg-[#EFEAE0] h-1.5 rounded-full overflow-hidden my-2">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                isHealthy ? 'bg-emerald-600' : isWarning ? 'bg-amber-600' : 'bg-red-600'
                              }`}
                              style={{ width: `${Math.min(100, Math.max(0, metric.percentage))}%` }}
                            />
                          </div>

                          {/* Numbers Details */}
                          <div className="flex items-center justify-between text-[11px] text-[#554F59] pt-1">
                            <div>
                              <span className="text-[#7A747D]">الناتج: </span>
                              <span className="font-bold font-mono-num text-[#1C191E]">
                                {metric.currentValue.toLocaleString()} {metric.unit}
                              </span>
                            </div>
                            <div>
                              <span className="text-[#7A747D]">المستهدف: </span>
                              <span className="font-bold font-mono-num text-[#1C191E]">
                                {metric.targetValue.toLocaleString()} {metric.unit}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="pt-2.5 mt-2.5 border-t border-[#EFEAE0] flex items-center justify-between text-[10px]">
                          <span className="text-[#7A747D] font-mono-num">
                            المصدر: {metric.dataSource === 'manual' ? 'إدخال يدوي' : metric.dataSource === 'google_sheet' ? 'جوجل شيت' : 'ملف محلي'}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleDeleteMetric(metric.id)}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                              title="حذف هذا المقياس"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center bg-[#FAF8F5] rounded-xl border border-dashed border-[#D5CDBC]">
                  <Database className="w-8 h-8 text-[#B31B24] mx-auto mb-2 opacity-60" />
                  <p className="text-xs font-bold text-[#1C191E]">لا توجد مقاييس مدخلة بعد لهذه الدائرة</p>
                  <p className="text-[11px] text-[#7A747D] mt-1">
                    يمكنك بناء معادلة حسابية وربط شيت / ملف، أو إضافة مقياس يدوي.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: ADD / EDIT MANUAL METRIC */}
          {/* ========================================================================= */}
          {activeTab === 'add-metric' && (
            <form onSubmit={handleSubmitMetric} className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E5DECE] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#EFEAE0]">
                <h4 className="font-bold text-xs text-[#1C191E]">
                  {editingMetricId ? 'تعديل بيانات المقياس' : `إضافة مقياس يدوي جديد لدائرة (${currentCircle.name})`}
                </h4>
                <button
                  type="button"
                  onClick={() => setActiveTab('metrics')}
                  className="text-xs text-[#7A747D] hover:underline"
                >
                  العودة للقائمة
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#554F59] mb-1">اسم المقياس *</label>
                  <input
                    type="text"
                    value={metricName}
                    onChange={(e) => setMetricName(e.target.value)}
                    placeholder="مثال: نسبة الالتزام بالعقد، متوسط وقت الاستجابة..."
                    className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-[#D5CDBC] focus:border-[#8A181F] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#554F59] mb-1">طريقة الحساب</label>
                  <select
                    value={metricMethod}
                    onChange={(e) => setMetricMethod(e.target.value as CalculationMethod)}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-[#D5CDBC] focus:border-[#8A181F] focus:outline-none"
                  >
                    <option value="actual_vs_target">فعلي مقارنة بالمستهدف (Actual ÷ Target %)</option>
                    <option value="survey_satisfaction">استبيان / نسبة رضا مباشرة (Direct %)</option>
                    <option value="compliance_percentage">نسبة مطابقة والتزام (Compliance %)</option>
                    <option value="custom_ratio">معدل / نسبة مخصصة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#554F59] mb-1">وصف المقياس ومعاييره</label>
                <textarea
                  value={metricDesc}
                  onChange={(e) => setMetricDesc(e.target.value)}
                  placeholder="كيف يتم قياس هذا المؤشر وما هي معايير النجاح..."
                  rows={2}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-[#D5CDBC] focus:border-[#8A181F] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#554F59] mb-1">القيمة الفعلية الحالية</label>
                  <input
                    type="number"
                    step="any"
                    value={metricCurrent}
                    onChange={(e) => setMetricCurrent(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-[#D5CDBC] font-mono-num font-bold focus:border-[#8A181F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#554F59] mb-1">القيمة المستهدفة</label>
                  <input
                    type="number"
                    step="any"
                    value={metricTarget}
                    onChange={(e) => setMetricTarget(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-[#D5CDBC] font-mono-num font-bold focus:border-[#8A181F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#554F59] mb-1">وحدة القياس</label>
                  <input
                    type="text"
                    value={metricUnit}
                    onChange={(e) => setMetricUnit(e.target.value)}
                    placeholder="%, $, ر.س, نقطة"
                    className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-[#D5CDBC] focus:border-[#8A181F] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('metrics')}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-[#554F59] bg-[#EFEAE0] hover:bg-[#E5DECE] transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#8A181F] hover:bg-[#581014] transition-colors shadow-sm"
                >
                  {editingMetricId ? 'حفظ التعديلات' : 'إضافة المقياس'}
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: UNIFIED ADVANCED FORMULA BUILDER & DYNAMIC COLUMN CONDITION ENGINE */}
          {/* ========================================================================= */}
          {activeTab === 'sheet-sync' && (
            <div className="p-4 sm:p-5 bg-[#FAF8F5] rounded-2xl border border-emerald-300 space-y-4 shadow-sm">
              
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-[#EFEAE0]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1C191E] flex items-center gap-1.5">
                      <span>نافذة بناء المعادلة الحسابية الموحدة — دائرة ({currentCircle.name})</span>
                    </h4>
                    <p className="text-[11px] text-[#7A747D]">
                      ربط الملف وقراءة بيانات الأعمدة تلقائياً، بناء المعادلة، تحديد العمليات الحسابية والأقواس وتصفية الفئات بناءً على البيانات الفعلية
                    </p>
                  </div>
                </div>

                <span className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full font-bold">
                  محرك المعادلات الموحد
                </span>
              </div>

              {/* STEP 1: SOURCE SELECTION (Google Sheet vs Local File Path / CSV / Excel) */}
              <div className="p-3.5 bg-white rounded-xl border border-[#E5DECE] space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold text-[#1C191E] flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-[#8A181F]" />
                    <span>1. مصدر البيانات والملف:</span>
                  </span>
                  
                  {/* Toggle: Google Sheet vs Excel/CSV Local File */}
                  <div className="flex p-0.5 bg-[#F4F1EA] rounded-lg border border-[#E5DECE] text-xs">
                    <button
                      type="button"
                      onClick={() => setSourceType('google_sheet')}
                      className={`px-3 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                        sourceType === 'google_sheet'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-[#6A6470] hover:text-[#1C191E]'
                      }`}
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>جوجل شيت (رابط)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSourceType('excel_csv')}
                      className={`px-3 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                        sourceType === 'excel_csv'
                          ? 'bg-blue-700 text-white shadow-xs'
                          : 'text-[#6A6470] hover:text-[#1C191E]'
                      }`}
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>إكسيل / CSV (مسار من الجهاز)</span>
                    </button>
                  </div>
                </div>

                {/* Conditional Inputs based on Source Type */}
                {sourceType === 'google_sheet' ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#554F59] mb-1 flex items-center gap-1">
                        <Link2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>رابط جوجل شيت (Google Sheets URL):</span>
                      </label>
                      <input
                        type="url"
                        value={sheetUrl}
                        onChange={(e) => setSheetUrl(e.target.value)}
                        placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                        className="w-full text-xs px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5CDBC] font-mono text-left focus:border-emerald-600 focus:outline-none"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#554F59] mb-1">
                        ورقة العمل (Tab Name):
                      </label>
                      <input
                        type="text"
                        value={sheetTabName}
                        onChange={(e) => setSheetTabName(e.target.value)}
                        placeholder="البيانات_الرئيسية"
                        className="w-full text-xs px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5CDBC] focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#554F59] mb-1 flex items-center gap-1">
                        <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
                        <span>حدد مسار الملف من الجهاز (Local File Path):</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={localFilePath}
                          onChange={(e) => {
                            setLocalFilePath(e.target.value);
                            const parts = e.target.value.split(/[\\/]/);
                            if (parts.length > 0) setLocalFileName(parts[parts.length - 1]);
                          }}
                          placeholder="C:/Users/User/Documents/Sales_Data.xlsx أو /path/to/data.csv"
                          className="flex-1 text-xs px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5CDBC] font-mono text-left focus:border-blue-600 focus:outline-none"
                          dir="ltr"
                        />
                        <label className="cursor-pointer px-3 py-2 rounded-lg bg-[#EFEAE0] hover:bg-[#E5DECE] text-xs font-bold text-[#1C191E] flex items-center gap-1.5 transition-colors shrink-0">
                          <Upload className="w-3.5 h-3.5 text-[#8A181F]" />
                          <span>اختر من الجهاز</span>
                          <input 
                            type="file" 
                            accept=".csv, .xlsx, .xls, text/csv" 
                            onChange={handleLocalFileSelect}
                            className="hidden" 
                          />
                        </label>
                      </div>
                      <span className="text-[10px] text-[#7A747D] mt-1 block">
                        الملف النشط: <strong className="text-[#1C191E]">{localFileName}</strong> (يتم تحليل كافة الأعمدة وقراءة بياناتها تلقائياً)
                      </span>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#554F59] mb-1">
                        اسم ورقة العمل بالإكسيل:
                      </label>
                      <input
                        type="text"
                        value={sheetTabName}
                        onChange={(e) => setSheetTabName(e.target.value)}
                        placeholder="Sheet1 أو المبيعات"
                        className="w-full text-xs px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5CDBC] focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 2: OUTPUT FORMAT & FORMULA NAME */}
              <div className="p-3.5 bg-white rounded-xl border border-[#E5DECE] space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex-1 min-w-[220px]">
                    <label className="block text-xs font-bold text-[#1C191E] mb-1 flex items-center gap-1">
                      <Edit3 className="w-3.5 h-3.5 text-[#8A181F]" />
                      <span>عنوان / مسمى المعادلة:</span>
                    </label>
                    <input
                      type="text"
                      value={metricFormulaTitle}
                      onChange={(e) => setMetricFormulaTitle(e.target.value)}
                      placeholder="اسم المعادلة الحسابية..."
                      className="w-full text-xs px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#D5CDBC] font-bold text-[#1C191E] focus:outline-none focus:border-[#8A181F]"
                    />
                  </div>

                  {/* Output Format Toggle: Percentage vs Number */}
                  <div>
                    <label className="block text-xs font-bold text-[#1C191E] mb-1 flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5 text-[#8A181F]" />
                      <span>طريقة ظهور الناتج:</span>
                    </label>
                    <div className="flex p-0.5 bg-[#F4F1EA] rounded-lg border border-[#E5DECE] text-xs">
                      <button
                        type="button"
                        onClick={() => setOutputFormat('percentage')}
                        className={`px-3 py-1 rounded-md font-bold transition-all flex items-center gap-1 ${
                          outputFormat === 'percentage'
                            ? 'bg-[#1C191E] text-white shadow-xs'
                            : 'text-[#6A6470] hover:text-[#1C191E]'
                        }`}
                      >
                        <Percent className="w-3.5 h-3.5" />
                        <span>نسبة مئوية (%)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOutputFormat('number')}
                        className={`px-3 py-1 rounded-md font-bold transition-all flex items-center gap-1 ${
                          outputFormat === 'number'
                            ? 'bg-[#1C191E] text-white shadow-xs'
                            : 'text-[#6A6470] hover:text-[#1C191E]'
                        }`}
                      >
                        <Hash className="w-3.5 h-3.5" />
                        <span>رقم عادي (قيمة عددية)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* If Number format: specify unit and target for circle scaling */}
                {outputFormat === 'number' && (
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-[#554F59] mb-1">
                        وحدة القياس للرقم (Unit):
                      </label>
                      <input
                        type="text"
                        value={numberUnit}
                        onChange={(e) => setNumberUnit(e.target.value)}
                        placeholder="$, ر.س, EGP, نقطة..."
                        className="w-full text-xs px-3 py-1.5 rounded-lg bg-white border border-[#D5CDBC] focus:border-[#8A181F] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#554F59] mb-1">
                        المستهدف لتحويل الرقم إلى نسبة % للدائرة الخارجية:
                      </label>
                      <input
                        type="number"
                        value={targetForNumber}
                        onChange={(e) => setTargetForNumber(e.target.value)}
                        placeholder="50000"
                        className="w-full text-xs px-3 py-1.5 rounded-lg bg-white border border-[#D5CDBC] font-mono-num font-bold focus:border-[#8A181F] focus:outline-none"
                      />
                      <span className="text-[10px] text-[#7A747D] mt-0.5 block">
                        تُقسم القيمة الناتجة على هذا المستهدف لاحتساب توهج ولون الدائرة (أخضر / أصفر / أحمر).
                      </span>
                    </div>
                  </div>
                )}

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] border-t border-[#EFEAE0]">
                  <span className="text-[#7A747D] font-bold">قوالب جاهزة سريعة:</span>
                  <button
                    type="button"
                    onClick={() => applyPresetFormula('sales_target_ratio')}
                    className="px-2.5 py-0.5 rounded-md bg-[#FAF8F5] border border-[#D5CDBC] hover:border-[#8A181F] text-[#1C191E] font-medium transition-colors"
                  >
                    نسبة الإنجاز: (المبيعات ÷ المستهدف) %
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetFormula('net_profit_margin')}
                    className="px-2.5 py-0.5 rounded-md bg-[#FAF8F5] border border-[#D5CDBC] hover:border-[#8A181F] text-[#1C191E] font-medium transition-colors"
                  >
                    صافي الأرباح: المبيعات - التكاليف
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetFormula('gender_segment_ratio')}
                    className="px-2.5 py-0.5 rounded-md bg-[#FAF8F5] border border-[#D5CDBC] hover:border-[#8A181F] text-[#1C191E] font-medium transition-colors"
                  >
                    تصفية فئة: مبيعات الذكور فقط ÷ المستهدف %
                  </button>
                </div>
              </div>

              {/* STEP 3: SYMMETRICAL UNIFIED FORMULA BUILDER WITH INLINE STRIP */}
              <div className="p-3.5 bg-white rounded-xl border border-[#E5DECE] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-[#1C191E] flex items-center gap-1.5">
                      <Calculator className="w-4 h-4 text-[#8A181F]" />
                      <span>3. شريط المعادلة الحسابية الموحد (نفس شريط الصورة بدون نافذة منفصلة):</span>
                    </h5>
                    <p className="text-[11px] text-[#7A747D]">
                      إضافة أعمدة، وضع أقواس، واختيار العمليات الحسابية وطريقة الحساب مباشرة على نفس الشريط البسيط
                    </p>
                  </div>
                </div>

                {/* THE INLINE FORMULA STRIP (طريقة تصميم المعادلة على شريط واحد متصل) */}
                <div className="pt-1">
                  <InlineFormulaStrip
                    metricLabel={metricFormulaTitle}
                    availableColumns={columnsList.map(c => {
                      const insp = inspectColumnData(c.key);
                      return {
                        key: c.key,
                        label: c.label,
                        uniqueValues: insp.uniqueValues.map(u => u.value),
                        sampleValues: insp.sampleValuesPreview,
                        type: insp.detectedType === 'numeric' ? 'number' : insp.detectedType === 'categorical' ? 'category' : 'text'
                      };
                    })}
                    outputFormat={outputFormat === 'percentage' ? 'Percent' : 'Number'}
                    onFormulaChange={(blocks, calcVal, dispFormat) => {
                      setOutputFormat(dispFormat === 'Percent' ? 'percentage' : 'number');
                    }}
                  />
                </div>

                {/* ADVANCED COLUMN INSPECTOR ACCORDION / TERMS BREAKDOWN */}
                <div className="pt-2 border-t border-[#EFEAE0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#554F59] flex items-center gap-1">
                      <Table className="w-3.5 h-3.5 text-blue-600" />
                      <span>تفاصيل حدود المعادلة وتصفية الفئات بناءً على البيانات الفعلية:</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleAddTerm}
                      className="px-2.5 py-1 rounded bg-[#FAF8F5] hover:bg-[#F2EFE9] border border-[#D5CDBC] text-[#1C191E] text-[11px] font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3 text-emerald-600" />
                      <span>إضافة حد تفصيلي</span>
                    </button>
                  </div>
                </div>

                {/* TERMS LIST - SYMMETRICAL & HARMONIOUS */}
                <div className="space-y-3 pt-1">
                  {formulaTerms.map((term, index) => {
                    // Inspect the column for this term
                    const currentTermInspection = inspectColumnData(term.column);

                    // Inspect the filter column if different
                    const filterColumnKey = term.filter?.filterColumn || term.column;
                    const filterColumnInspection = inspectColumnData(filterColumnKey);

                    return (
                      <div 
                        key={term.id} 
                        className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] hover:border-[#D5CDBC] transition-all space-y-3 shadow-2xs"
                      >
                        {/* Term Header & Symmetrical Controls */}
                        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                          
                          {/* Flank 1: Left / Open Parenthesis */}
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#8A181F] bg-[#8A181F]/10 px-2 py-0.5 rounded text-[11px]">
                              الحد {index + 1}
                            </span>

                            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-[#D5CDBC]">
                              <span className="text-[10px] text-[#7A747D] font-bold">قوس فتح:</span>
                              <select
                                value={term.parenthesisOpen || 0}
                                onChange={(e) => handleUpdateTerm(term.id, { parenthesisOpen: parseInt(e.target.value) })}
                                className="bg-transparent font-mono font-bold text-center text-sm text-[#1C191E] focus:outline-none"
                              >
                                <option value={0}>-</option>
                                <option value={1}>(</option>
                                <option value={2}>((</option>
                                <option value={3}>(((</option>
                              </select>
                            </div>
                          </div>

                          {/* Center: Selected Column + Aggregation */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-[#D5CDBC]">
                              <span className="text-[10px] text-[#7A747D] font-bold">العمود المحسوب:</span>
                              <select
                                value={term.column}
                                onChange={(e) => handleUpdateTerm(term.id, { column: e.target.value })}
                                className="bg-transparent font-bold text-xs text-[#1C191E] focus:outline-none"
                              >
                                {columnsList.map(col => (
                                  <option key={col.key} value={col.key}>{col.label}</option>
                                ))}
                              </select>
                            </div>

                            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-emerald-300">
                              <span className="text-[10px] text-emerald-700 font-bold">دالة التجميع:</span>
                              <select
                                value={term.aggregation}
                                onChange={(e) => handleUpdateTerm(term.id, { aggregation: e.target.value as AggregationFunction })}
                                className="bg-transparent font-bold text-xs text-emerald-800 focus:outline-none"
                              >
                                <option value="sum">مجموع (SUM)</option>
                                <option value="average">متوسط (AVG)</option>
                                <option value="max">أقصى قيمة (MAX)</option>
                                <option value="min">أدنى قيمة (MIN)</option>
                                <option value="count">عدد الصفوف (COUNT)</option>
                              </select>
                            </div>
                          </div>

                          {/* Flank 2: Right / Close Parenthesis & Delete */}
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-[#D5CDBC]">
                              <span className="text-[10px] text-[#7A747D] font-bold">قوس إغلاق:</span>
                              <select
                                value={term.parenthesisClose || 0}
                                onChange={(e) => handleUpdateTerm(term.id, { parenthesisClose: parseInt(e.target.value) })}
                                className="bg-transparent font-mono font-bold text-center text-sm text-[#1C191E] focus:outline-none"
                              >
                                <option value={0}>-</option>
                                <option value={1}>)</option>
                                <option value={2}>))</option>
                                <option value={3}>)))</option>
                              </select>
                            </div>

                            {formulaTerms.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteTerm(term.id)}
                                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                title="حذف هذا الحد من المعادلة"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* COLUMN DATA INSPECTION BADGE (Shows what was read from the column) */}
                        <div className="px-3 py-1.5 bg-white rounded-lg border border-[#EFEAE0] flex items-center justify-between text-[11px] text-[#554F59]">
                          <div className="flex items-center gap-2">
                            <Table className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>
                              بيانات العمود المقروءة: <strong className="text-[#1C191E]">{currentTermInspection.label}</strong>
                            </span>
                            <span className="text-[#7A747D]">&bull;</span>
                            <span className="text-[#7A747D]">
                              {currentTermInspection.nonEmptyRows} صفوف مسجلة
                            </span>
                            <span className="text-[#7A747D]">&bull;</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                              {currentTermInspection.detectedType === 'numeric' ? 'قيم عددية وحسابية' : currentTermInspection.detectedType === 'categorical' ? 'تصنيف فئوي' : 'نصوص'}
                            </span>
                          </div>

                          {currentTermInspection.detectedType === 'numeric' && currentTermInspection.min !== undefined && (
                            <div className="text-[10px] text-[#7A747D] font-mono-num">
                              المدى: [{currentTermInspection.min.toLocaleString()} — {currentTermInspection.max?.toLocaleString()}]
                            </div>
                          )}
                        </div>

                        {/* DYNAMIC DATA-DRIVEN FILTER CONDITION */}
                        {/* ONLY appears when the user checks it, AND derives options directly from the parsed column data! */}
                        <div className="p-2.5 bg-white rounded-xl border border-[#E2DACB] space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-[#1C191E]">
                              <input
                                type="checkbox"
                                checked={term.filter?.enabled || false}
                                onChange={(e) => {
                                  const isChecked = e.target.checked;
                                  // When enabled: read filter column and pick its first unique value automatically from data!
                                  const initialFilterCol = term.filter?.filterColumn || 'col_gender';
                                  const inspection = inspectColumnData(initialFilterCol);
                                  const firstValFromData = inspection.uniqueValues[0]?.value || '';

                                  handleUpdateTerm(term.id, {
                                    filter: {
                                      enabled: isChecked,
                                      filterColumn: initialFilterCol,
                                      operator: term.filter?.operator || 'equals',
                                      value: isChecked ? (term.filter?.value || firstValFromData) : '',
                                    }
                                  });
                                }}
                                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                              />
                              <Filter className="w-3.5 h-3.5 text-amber-600" />
                              <span>تصفية بقيمة أو فئة معينة (قراءة تلقائية من بيانات العمود)</span>
                            </label>

                            {term.filter?.enabled && (
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                                تم فحص العمود واكتشاف {filterColumnInspection.uniqueValues.length} قيم مميزة
                              </span>
                            )}
                          </div>

                          {/* Condition Content - Only shown after user checks it AND options derived 100% from actual data */}
                          {term.filter?.enabled && (
                            <div className="pt-2 border-t border-[#EFEAE0] space-y-2.5">
                              {/* Row 1: Pick which column to filter on & operator */}
                              <div className="flex items-center gap-2 flex-wrap text-xs">
                                <span className="text-[11px] text-[#554F59] font-bold">تطبيق الشرط على عمود:</span>
                                <select
                                  value={term.filter.filterColumn || 'col_gender'}
                                  onChange={(e) => {
                                    const newFilterCol = e.target.value;
                                    const inspection = inspectColumnData(newFilterCol);
                                    const firstVal = inspection.uniqueValues[0]?.value || '';
                                    handleUpdateTerm(term.id, {
                                      filter: {
                                        ...term.filter!,
                                        filterColumn: newFilterCol,
                                        value: firstVal,
                                      }
                                    });
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#D5CDBC] font-bold text-xs text-[#1C191E]"
                                >
                                  {columnsList.map(col => (
                                    <option key={col.key} value={col.key}>{col.label}</option>
                                  ))}
                                </select>

                                <span className="text-[11px] text-[#554F59] font-bold">المعيار:</span>
                                <select
                                  value={term.filter.operator || 'equals'}
                                  onChange={(e) => handleUpdateTerm(term.id, {
                                    filter: { ...term.filter!, operator: e.target.value as any }
                                  })}
                                  className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#D5CDBC] font-bold text-xs text-[#1C191E]"
                                >
                                  <option value="equals">يساوي بالضبط (=)</option>
                                  <option value="contains">يحتوي على (يشمل)</option>
                                  <option value="not_equals">لا يساوي (≠)</option>
                                </select>
                              </div>

                              {/* Row 2: REAL DYNAMIC CHIPS DERIVED DIRECTLY FROM THE COLUMN'S DATA */}
                              <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-[#E5DECE] space-y-1.5">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="font-bold text-[#554F59] flex items-center gap-1">
                                    <Tag className="w-3 h-3 text-emerald-600" />
                                    <span>خيارات مستخرجة تلقائياً من بيانات ({filterColumnInspection.label.split(' ')[0]}):</span>
                                  </span>
                                  <span className="text-[10px] text-[#7A747D]">
                                    انقر على أي خيار لتطبيقه كشرط
                                  </span>
                                </div>

                                {/* Dynamic Chips List */}
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {filterColumnInspection.uniqueValues.length > 0 ? (
                                    filterColumnInspection.uniqueValues.map((uVal) => {
                                      const isCurrent = (term.filter?.value || '').trim().toLowerCase() === uVal.value.toLowerCase();
                                      return (
                                        <button
                                          key={uVal.value}
                                          type="button"
                                          onClick={() => handleUpdateTerm(term.id, {
                                            filter: { ...term.filter!, value: uVal.value }
                                          })}
                                          className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                                            isCurrent
                                              ? 'bg-[#1C191E] text-white shadow-xs'
                                              : 'bg-white border border-[#D5CDBC] text-[#1C191E] hover:border-[#8A181F] hover:bg-amber-50/50'
                                          }`}
                                        >
                                          <span>{uVal.value}</span>
                                          <span className={`text-[10px] px-1 rounded font-mono-num ${
                                            isCurrent ? 'bg-white/20 text-white' : 'bg-[#EFEAE0] text-[#554F59]'
                                          }`}>
                                            {uVal.count} صفوف
                                          </span>
                                        </button>
                                      );
                                    })
                                  ) : (
                                    <span className="text-[11px] text-[#7A747D]">
                                      لا توجد قيم نصية فريدة في هذا العمود. يمكنك إدخال قيمة يدوية أدناه.
                                    </span>
                                  )}
                                </div>

                                {/* Direct Input Fallback / Fine-Tuning */}
                                <div className="pt-1.5 flex items-center gap-2">
                                  <span className="text-[10px] text-[#7A747D] font-bold">القيمة المطبقة حالياً في الشرط:</span>
                                  <input
                                    type="text"
                                    value={term.filter?.value || ''}
                                    onChange={(e) => handleUpdateTerm(term.id, {
                                      filter: { ...term.filter!, value: e.target.value }
                                    })}
                                    placeholder="القيمة المختارة..."
                                    className="px-2 py-0.5 rounded bg-white border border-amber-300 font-bold text-xs text-[#1C191E] w-36 focus:outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* ARITHMETIC OPERATOR CONNECTOR (Between terms) */}
                        {index < formulaTerms.length - 1 && (
                          <div className="flex items-center justify-center gap-3 pt-2 border-t border-[#EFEAE0]">
                            <span className="text-xs font-bold text-[#554F59]">
                              العملية الحسابية مع الحد التالي:
                            </span>
                            <div className="flex items-center gap-1.5">
                              {(['+', '-', '*', '/'] as ArithmeticOperator[]).map(op => (
                                <button
                                  key={op}
                                  type="button"
                                  onClick={() => handleUpdateTerm(term.id, { nextOperator: op })}
                                  className={`w-8 h-8 rounded-lg font-mono text-base font-black flex items-center justify-center transition-all ${
                                    term.nextOperator === op
                                      ? 'bg-[#8A181F] text-white shadow-xs scale-105'
                                      : 'bg-white border border-[#D5CDBC] text-[#554F59] hover:bg-[#EAE5D9]'
                                  }`}
                                  title={`استخدام عملية (${op === '*' ? 'ضرب' : op === '/' ? 'قسمة' : op === '+' ? 'جمع' : 'طرح'})`}
                                >
                                  {op === '*' ? '×' : op === '/' ? '÷' : op}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STEP 4: LIVE FORMULA DISPLAY & GAUGE PREVIEW BAR */}
              <div className="p-4 bg-gradient-to-r from-emerald-50/90 via-white to-amber-50/70 rounded-xl border border-emerald-300 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1C191E] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>صيغة المعادلة الحالية والناتج اللحظي:</span>
                  </span>

                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold font-mono-num ${
                    calculationSummary.computedPercentage >= 75 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    calculationSummary.computedPercentage >= 50 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    'bg-red-100 text-red-800 border border-red-300'
                  }`}>
                    النسبة للدائرة الخارجية: {calculationSummary.computedPercentage}%
                  </span>
                </div>

                {/* Mathematical Equation Display Box */}
                <div className="p-3 bg-white rounded-lg border border-[#D5CDBC] font-mono text-xs text-[#1C191E] flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap font-bold">
                    <span className="text-[#8A181F] text-sm">f(x) =</span>
                    <span className="text-[#1C191E] bg-[#F5F2EB] px-2.5 py-1 rounded border border-[#E5DECE] text-sm tracking-wide">
                      {calculationSummary.formulaString}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-[#7A747D] block">الناتج الرقمي:</span>
                      <span className="font-mono-num font-black text-sm text-[#1C191E]">
                        {calculationSummary.rawResult.toLocaleString()} {outputFormat === 'percentage' ? '%' : numberUnit}
                      </span>
                    </div>

                    <div className="w-px h-7 bg-[#EFEAE0]" />

                    <div className="text-right">
                      <span className="text-[10px] text-[#7A747D] block">حالة التوهج:</span>
                      <span className={`text-[11px] font-bold ${
                        calculationSummary.computedPercentage >= 75 ? 'text-emerald-700' :
                        calculationSummary.computedPercentage >= 50 ? 'text-amber-700' : 'text-red-700 animate-pulse'
                      }`}>
                        {calculationSummary.computedPercentage >= 75 ? '● أخضر مستقر' :
                         calculationSummary.computedPercentage >= 50 ? '● أصفر تنبيه' : '● أحمر تحذيري'}
                      </span>
                    </div>
                  </div>
                </div>

                {calculationSummary.errorMessage && (
                  <div className="text-[11px] text-red-600 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{calculationSummary.errorMessage}</span>
                  </div>
                )}
              </div>

              {/* STEP 5: SAVE & APPLY BUTTON */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('metrics')}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-[#554F59] bg-[#EFEAE0] hover:bg-[#E5DECE] transition-colors"
                >
                  العودة لقائمة المقاييس
                </button>

                <button
                  type="button"
                  onClick={handleApplyFormulaToCircle}
                  disabled={isSyncing || !calculationSummary.isValid}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>جاري حفظ وتطبيق المعادلة...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>حفظ المعادلة وتطبيقها على دائرة ({currentCircle.name})</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="px-5 py-3 border-t border-[#EFEAE0] bg-[#FAF8F5] flex items-center justify-between text-xs text-[#7A747D]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1C191E]">الدائرة النشطة:</span>
            <span>{currentCircle.name}</span>
            <span>&bull;</span>
            <span>النتيجة: {currentCircle.score}%</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#EFEAE0] hover:bg-[#E5DECE] text-[#1C191E] font-bold text-xs transition-colors"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
