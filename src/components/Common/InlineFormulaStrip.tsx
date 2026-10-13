import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Plus, 
  Trash2, 
  Calculator, 
  Check, 
  X, 
  Filter,
  Sparkles,
  Equal
} from 'lucide-react';

export interface DataColumnOption {
  key: string;
  label: string;
  sampleValues?: (string | number)[];
  uniqueValues?: string[];
  type?: 'number' | 'text' | 'category';
}

export interface FormulaBlock {
  id: string;
  // Parenthesis before column
  parenOpen: string; // '', '(', '(('
  // Column selected
  columnKey: string;
  // Calculation / Aggregation method for this column
  calcMethod: 'SUM' | 'AVG' | 'MAX' | 'MIN' | 'COUNT';
  // Optional inline filter condition (e.g. category = 'ذكور')
  filterEnabled?: boolean;
  filterValue?: string;
  // Parenthesis after column
  parenClose: string; // '', ')', '))'
  // Operator connecting to next block (or null if last)
  nextOp: '+' | '-' | '*' | '/' | null;
}

interface InlineFormulaStripProps {
  initialFormulaBlocks?: FormulaBlock[];
  availableColumns?: DataColumnOption[];
  outputFormat?: 'Percent' | 'Number' | 'Currency';
  onFormulaChange?: (
    blocks: FormulaBlock[], 
    calculatedValue: number, 
    displayFormat: 'Percent' | 'Number' | 'Currency'
  ) => void;
  metricLabel?: string;
  className?: string;
  readOnly?: boolean;
}

const DEFAULT_COLUMNS: DataColumnOption[] = [
  { 
    key: 'col_revenue', 
    label: 'الإيرادات الإجمالية (A)', 
    sampleValues: [120000, 135000, 110000, 145000],
    type: 'number' 
  },
  { 
    key: 'col_cogs', 
    label: 'تكلفة المبيعات COGS (B)', 
    sampleValues: [60000, 72000, 58000, 75000],
    type: 'number' 
  },
  { 
    key: 'col_actual', 
    label: 'المحقق الفعلي (C)', 
    sampleValues: [85, 92, 78, 95],
    type: 'number' 
  },
  { 
    key: 'col_target', 
    label: 'المستهدف المطلوب (D)', 
    sampleValues: [100, 100, 100, 100],
    type: 'number' 
  },
  { 
    key: 'col_gender', 
    label: 'تصنيف العملاء / الفئة (E)', 
    sampleValues: ['ذكور', 'إناث', 'شركات'],
    uniqueValues: ['ذكور', 'إناث', 'شركات'],
    type: 'category' 
  },
  { 
    key: 'col_expenses', 
    label: 'المصاريف التشغيلية (F)', 
    sampleValues: [18000, 22000, 19500, 21000],
    type: 'number' 
  },
];

export const InlineFormulaStrip: React.FC<InlineFormulaStripProps> = ({
  initialFormulaBlocks,
  availableColumns = DEFAULT_COLUMNS,
  outputFormat: initialFormat = 'Percent',
  onFormulaChange,
  metricLabel,
  className = '',
  readOnly = false,
}) => {
  // Output format selector: Percent %, Number, Currency
  const [format, setFormat] = useState<'Percent' | 'Number' | 'Currency'>(initialFormat);

  // Formula blocks along the single inline strip
  const [blocks, setBlocks] = useState<FormulaBlock[]>(() => {
    if (initialFormulaBlocks && initialFormulaBlocks.length > 0) {
      return initialFormulaBlocks;
    }
    const col1 = availableColumns[0]?.key || 'col_revenue';
    const col2 = availableColumns[1]?.key || 'col_cogs';
    return [
      {
        id: 'blk-1',
        parenOpen: '(',
        columnKey: col1,
        calcMethod: 'SUM',
        parenClose: '',
        nextOp: '-',
      },
      {
        id: 'blk-2',
        parenOpen: '',
        columnKey: col2,
        calcMethod: 'SUM',
        parenClose: ')',
        nextOp: null,
      },
    ];
  });

  // Calculate live value from blocks
  const calculateResult = (currentBlocks: FormulaBlock[]): number => {
    try {
      if (currentBlocks.length === 0) return 0;

      // Map each column to a simulated aggregated value based on method
      const evaluateBlockVal = (b: FormulaBlock): number => {
        const col = availableColumns.find(c => c.key === b.columnKey) || availableColumns[0];
        const numValues = (col?.sampleValues || [100]).filter(v => typeof v === 'number') as number[];
        
        let baseVal = 100;
        if (numValues.length > 0) {
          switch (b.calcMethod) {
            case 'SUM':
              baseVal = numValues.reduce((a, b) => a + b, 0);
              break;
            case 'AVG':
              baseVal = Math.round(numValues.reduce((a, b) => a + b, 0) / numValues.length);
              break;
            case 'MAX':
              baseVal = Math.max(...numValues);
              break;
            case 'MIN':
              baseVal = Math.min(...numValues);
              break;
            case 'COUNT':
              baseVal = numValues.length;
              break;
          }
        }

        // If filter is active on a categorical condition, scale by sample ratio
        if (b.filterEnabled && b.filterValue) {
          baseVal = Math.round(baseVal * 0.6); // realistic filter sample
        }

        return baseVal;
      };

      // Construct mathematical expression
      let expr = '';
      currentBlocks.forEach((b) => {
        if (b.parenOpen) expr += b.parenOpen;
        const val = evaluateBlockVal(b);
        expr += val.toString();
        if (b.parenClose) expr += b.parenClose;
        if (b.nextOp) expr += ` ${b.nextOp} `;
      });

      // Safe clean up
      const sanitized = expr.replace(/[^0-9+\-*/(). ]/g, '');
      if (!sanitized) return 0;

      // eslint-disable-next-line no-new-func
      const result = new Function(`'use strict'; return (${sanitized})`)();
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return Math.round(result * 100) / 100;
      }
      return 0;
    } catch {
      return 0;
    }
  };

  const calculatedVal = calculateResult(blocks);

  // Notify parent on change
  const notifyChange = (newBlocks: FormulaBlock[], newFormat: 'Percent' | 'Number' | 'Currency') => {
    const val = calculateResult(newBlocks);
    onFormulaChange?.(newBlocks, val, newFormat);
  };

  // Update block fields
  const handleUpdateBlock = (id: string, updates: Partial<FormulaBlock>) => {
    if (readOnly) return;
    const nextBlocks = blocks.map(b => (b.id === id ? { ...b, ...updates } : b));
    setBlocks(nextBlocks);
    notifyChange(nextBlocks, format);
  };

  // Add a new column directly onto the exact same ribbon!
  const handleAddColumnToStrip = () => {
    if (readOnly) return;
    const availableKeys = availableColumns.map(c => c.key);
    const unusedKey = availableKeys.find(k => !blocks.some(b => b.columnKey === k)) || availableKeys[0] || 'col_revenue';

    // Update previous last block to have an operator (default '+')
    const updatedPrev = blocks.map((b, idx) => {
      if (idx === blocks.length - 1 && !b.nextOp) {
        return { ...b, nextOp: '+' as const };
      }
      return b;
    });

    const newBlock: FormulaBlock = {
      id: `blk-${Date.now()}`,
      parenOpen: '',
      columnKey: unusedKey,
      calcMethod: 'SUM',
      parenClose: '',
      nextOp: null,
    };

    const nextBlocks = [...updatedPrev, newBlock];
    setBlocks(nextBlocks);
    notifyChange(nextBlocks, format);
  };

  // Remove a block
  const handleRemoveBlock = (id: string) => {
    if (readOnly || blocks.length <= 1) return;
    const filtered = blocks.filter(b => b.id !== id);
    // Ensure last item has no nextOp
    if (filtered.length > 0) {
      filtered[filtered.length - 1] = {
        ...filtered[filtered.length - 1],
        nextOp: null,
      };
    }
    setBlocks(filtered);
    notifyChange(filtered, format);
  };

  // Format change
  const handleFormatChange = (newFormat: 'Percent' | 'Number' | 'Currency') => {
    setFormat(newFormat);
    notifyChange(blocks, newFormat);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* 
        THE INLINE STRIP (شريط المعادلة الأفقي الموحد المستوحى تماماً من صورة المستخدم) 
        - نفس الشريط البسيط بدون أي نافذة منفصلة
        - حواف كلاسيكية مستقيمة ومربعات أنيقة (Sharp rectangular dropdowns & inputs)
        - طريقة ترتيب واختيار متسقة وواضحة جداً
      */}
      <div className="w-full bg-[#EAE8E2] border border-[#C5BFB5] p-2 sm:p-2.5 rounded-none shadow-xs flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs select-none">
        
        {/* Label Prefix */}
        <div className="flex items-center gap-1.5 shrink-0 pl-1 border-l border-[#C5BFB5]">
          <Calculator className="w-3.5 h-3.5 text-[#5A555E]" />
          <span className="font-bold text-[#2C292E] text-[11px] sm:text-xs">
            {metricLabel ? `المعادلة (${metricLabel}):` : 'المعادلة:'}
          </span>
        </div>

        {/* SEQUENCE OF FORMULA BLOCKS (Side-by-side on the SAME strip) */}
        {blocks.map((block, index) => {
          const selectedCol = availableColumns.find(c => c.key === block.columnKey) || availableColumns[0];
          const hasCategories = selectedCol?.uniqueValues && selectedCol.uniqueValues.length > 0;

          return (
            <div key={block.id} className="inline-flex items-center gap-1 shrink-0 bg-white/60 p-1 border border-[#D5D0C6]">
              
              {/* 1. OPEN PARENTHESIS (اختيار الأقواس) */}
              <div className="relative inline-flex items-center">
                <select
                  disabled={readOnly}
                  value={block.parenOpen}
                  onChange={(e) => handleUpdateBlock(block.id, { parenOpen: e.target.value })}
                  className="appearance-none bg-white border border-[#9E9E9E] hover:border-[#616161] focus:border-black rounded-none px-1.5 py-1 pr-4 text-[11px] font-mono font-bold text-[#1C191E] cursor-pointer"
                  title="قوس فتح (أولوية الحساب)"
                >
                  <option value="">( - )</option>
                  <option value="(">(</option>
                  <option value="((">((</option>
                  <option value="(((">(((</option>
                </select>
                <ChevronDown className="w-2.5 h-2.5 absolute right-0.5 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" />
              </div>

              {/* 2. COLUMN SELECTOR (اختيار العمود المطلوب) */}
              <div className="relative inline-flex items-center">
                <select
                  disabled={readOnly}
                  value={block.columnKey}
                  onChange={(e) => handleUpdateBlock(block.id, { columnKey: e.target.value })}
                  className="appearance-none bg-white border border-[#9E9E9E] hover:border-[#616161] focus:border-black rounded-none px-2 py-1 pr-6 text-[11px] font-medium text-[#1C191E] cursor-pointer min-w-[130px] max-w-[210px] truncate"
                  title="اختيار العمود من البيانات"
                >
                  {availableColumns.map(col => (
                    <option key={col.key} value={col.key}>
                      {col.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none" />
              </div>

              {/* 3. CALCULATION METHOD (طريقة الحساب: مجموع، متوسط، أقصى، أدنى، عدد) */}
              <div className="relative inline-flex items-center">
                <select
                  disabled={readOnly}
                  value={block.calcMethod}
                  onChange={(e) => handleUpdateBlock(block.id, { calcMethod: e.target.value as any })}
                  className="appearance-none bg-white border border-[#9E9E9E] hover:border-[#616161] focus:border-black rounded-none px-1.5 py-1 pr-5 text-[10.5px] font-bold text-[#15803D] cursor-pointer"
                  title="طريقة حساب العمود (تجميع)"
                >
                  <option value="SUM">مجموع SUM</option>
                  <option value="AVG">متوسط AVG</option>
                  <option value="MAX">أقصى MAX</option>
                  <option value="MIN">أدنى MIN</option>
                  <option value="COUNT">عدد COUNT</option>
                </select>
                <ChevronDown className="w-3 h-3 absolute right-1 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none" />
              </div>

              {/* 4. OPTIONAL INLINE FILTER TAG (شرط تصفية فئة معينة مباشرة داخل الشريط) */}
              {hasCategories && (
                <div className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleUpdateBlock(block.id, { 
                      filterEnabled: !block.filterEnabled,
                      filterValue: block.filterValue || selectedCol.uniqueValues?.[0] || ''
                    })}
                    className={`px-1.5 py-1 text-[10px] font-bold border transition-colors flex items-center gap-0.5 cursor-pointer ${
                      block.filterEnabled 
                        ? 'bg-[#EBF5EE] border-[#15803D] text-[#15803D]' 
                        : 'bg-white border-[#9E9E9E] text-[#666] hover:text-black'
                    }`}
                    title="تصفية فئة معينة من هذا العمود"
                  >
                    <Filter className="w-2.5 h-2.5" />
                    <span>تصفية</span>
                  </button>

                  {block.filterEnabled && (
                    <div className="relative inline-flex items-center">
                      <select
                        value={block.filterValue || ''}
                        onChange={(e) => handleUpdateBlock(block.id, { filterValue: e.target.value })}
                        className="appearance-none bg-[#EBF5EE] border border-[#15803D] rounded-none px-1.5 py-1 pr-4 text-[10px] font-bold text-[#15803D] cursor-pointer"
                      >
                        {selectedCol.uniqueValues?.map(val => (
                          <option key={val} value={val}>{val}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-2.5 h-2.5 absolute right-0.5 top-1/2 -translate-y-1/2 text-[#15803D] pointer-events-none" />
                    </div>
                  )}
                </div>
              )}

              {/* 5. CLOSE PARENTHESIS */}
              <div className="relative inline-flex items-center">
                <select
                  disabled={readOnly}
                  value={block.parenClose}
                  onChange={(e) => handleUpdateBlock(block.id, { parenClose: e.target.value })}
                  className="appearance-none bg-white border border-[#9E9E9E] hover:border-[#616161] focus:border-black rounded-none px-1.5 py-1 pr-4 text-[11px] font-mono font-bold text-[#1C191E] cursor-pointer"
                  title="قوس إغلاق"
                >
                  <option value="">( - )</option>
                  <option value=")">)</option>
                  <option value="))">))</option>
                  <option value=")))">)))</option>
                </select>
                <ChevronDown className="w-2.5 h-2.5 absolute right-0.5 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" />
              </div>

              {/* Delete this block (if more than 1) */}
              {!readOnly && blocks.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveBlock(block.id)}
                  className="p-1 text-[#9E9E9E] hover:text-[#B31B24] cursor-pointer transition-colors"
                  title="حذف هذا الجزء من المعادلة"
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* 6. ARITHMETIC OPERATOR TO NEXT BLOCK (+, -, *, /) */}
              {index < blocks.length - 1 && (
                <div className="relative inline-flex items-center mr-1">
                  <select
                    disabled={readOnly}
                    value={block.nextOp || '+'}
                    onChange={(e) => handleUpdateBlock(block.id, { nextOp: e.target.value as any })}
                    className="appearance-none bg-white border border-[#9E9E9E] hover:border-[#616161] focus:border-black rounded-none px-2 py-1 pr-5 text-[11px] font-bold text-[#1C191E] cursor-pointer min-w-[38px] text-center"
                    title="العملية الحسابية الرابطة"
                  >
                    <option value="+">+</option>
                    <option value="-">-</option>
                    <option value="*">×</option>
                    <option value="/">÷</option>
                  </select>
                  <ChevronDown className="w-3 h-3 absolute right-1 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none" />
                </div>
              )}

            </div>
          );
        })}

        {/* 7. ADD COLUMN BUTTON (مباشرة على نفس الشريط بدون أي نافذة) */}
        {!readOnly && (
          <button
            type="button"
            onClick={handleAddColumnToStrip}
            className="bg-white hover:bg-[#F2EFE9] border border-[#9E9E9E] hover:border-black text-[#1C191E] px-2.5 py-1 rounded-none text-[11px] font-bold flex items-center gap-1 shadow-2xs cursor-pointer transition-all shrink-0"
            title="إضافة عمود آخر إلى شريط المعادلة نفسه"
          >
            <Plus className="w-3.5 h-3.5 text-[#15803D]" />
            <span>+ عمود</span>
          </button>
        )}

        {/* 8. OUTPUT FORMAT SELECTOR (% أو رقم أو عملة) */}
        <div className="inline-flex items-center gap-1 bg-white/70 p-0.5 border border-[#D5D0C6] shrink-0">
          <span className="text-[10px] text-[#666] font-semibold px-1">الناتج:</span>
          <div className="relative inline-flex items-center">
            <select
              disabled={readOnly}
              value={format}
              onChange={(e) => handleFormatChange(e.target.value as any)}
              className="appearance-none bg-white border border-[#9E9E9E] hover:border-[#616161] rounded-none px-2 py-1 pr-5 text-[10.5px] font-bold text-[#1C191E] cursor-pointer"
              title="طريقة عرض النتيجة"
            >
              <option value="Percent">نسبة مئوية %</option>
              <option value="Number">رقم عادي</option>
              <option value="Currency">عملة (SAR)</option>
            </select>
            <ChevronDown className="w-3 h-3 absolute right-1 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none" />
          </div>
        </div>

        {/* 9. EQUALS & LIVE RESULT BADGE (على نفس الشريط تماماً) */}
        <div className="inline-flex items-center gap-1.5 bg-white border border-[#9E9E9E] px-2.5 py-1 rounded-none shadow-2xs mr-auto shrink-0">
          <Equal className="w-3.5 h-3.5 text-[#7A747D]" />
          <span className="text-[10.5px] text-[#7A747D] font-bold">النتيجة:</span>
          <span className="font-mono font-bold text-xs text-[#15803D]">
            {calculatedVal.toLocaleString()}
            {format === 'Percent' ? '%' : format === 'Currency' ? ' ر.س' : ''}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] animate-pulse" title="حساب حي وفوري" />
        </div>

      </div>
    </div>
  );
};
