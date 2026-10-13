import React, { useState } from 'react';
import { 
  Target, 
  Lightbulb, 
  PieChart, 
  Plus, 
  X, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Layers, 
  ExternalLink,
  DollarSign,
  TrendingUp,
  Filter,
  Calendar,
  Building,
  User,
  Info
} from 'lucide-react';
import { 
  MarketAcquisitionTarget, 
  StrategicOpportunity, 
  FinancialTransaction,
  FinancialCategory,
  OpportunityStage,
  BusinessModelCanvas,
  ClientKpiCircle,
  ClientKpiCategory
} from '../../types/dashboard';
import { INITIAL_CLIENT_KPIS } from '../../data/mockData';
import { BusinessModelCanvasPanel } from './BusinessModelCanvasPanel';
import { ClientMainKpisCard } from './ClientMainKpisCard';
import { ClientKpiDetailModal } from '../Modals/ClientKpiDetailModal';

interface StrategicRacketsPanelProps {
  // 1. Ring Completion: Market Targets
  marketTargets: MarketAcquisitionTarget[];
  onUpdateMarketTarget: (target: MarketAcquisitionTarget) => void;
  
  // 2. Strategic Perks: Opportunities
  opportunities: StrategicOpportunity[];
  onAddOpportunity: (opp: StrategicOpportunity) => void;
  onUpdateOpportunity: (opp: StrategicOpportunity) => void;
  onDeleteOpportunity: (oppId: string) => void;

  // 3. Client Main KPIs & Financials
  clientKpis?: ClientKpiCircle[];
  onUpdateClientKpiCircle?: (circle: ClientKpiCircle) => void;
  financialTransactions: FinancialTransaction[];
  onAddTransaction: (tx: FinancialTransaction) => void;
  onDeleteTransaction: (txId: string) => void;

  // Selected Location on Map & Business Model Canvas
  selectedLocation?: import('../../types/dashboard').RacketNode | null;
  onUpdateBusinessCanvas?: (locationId: string, updatedCanvas: import('../../types/dashboard').BusinessModelCanvas) => void;
  relationships?: import('../../types/dashboard').RelationshipContact[];
  onOpenAddContact?: () => void;
  onSelectRelationship?: (contact: import('../../types/dashboard').RelationshipContact) => void;
  onOpenHierarchyTree?: () => void;
}

export const StrategicRacketsPanel: React.FC<StrategicRacketsPanelProps> = ({
  marketTargets,
  onUpdateMarketTarget,
  opportunities,
  onAddOpportunity,
  onUpdateOpportunity,
  onDeleteOpportunity,
  financialTransactions,
  onAddTransaction,
  onDeleteTransaction,
  clientKpis,
  onUpdateClientKpiCircle,
  selectedLocation = null,
  onUpdateBusinessCanvas,
  relationships = [],
  onOpenAddContact,
  onSelectRelationship,
  onOpenHierarchyTree,
}) => {
  // Client Main KPIs 3 Circles State
  const [localKpis, setLocalKpis] = useState<ClientKpiCircle[]>(clientKpis || INITIAL_CLIENT_KPIS);
  const [isKpiModalOpen, setIsKpiModalOpen] = useState(false);
  const [activeKpiCategory, setActiveKpiCategory] = useState<ClientKpiCategory>('commerce');
  const [card3ViewMode, setCard3ViewMode] = useState<'kpis' | 'bmc'>('kpis');

  // Keep localKpis in sync with parent if prop updates
  React.useEffect(() => {
    if (clientKpis && clientKpis.length > 0) {
      setLocalKpis(clientKpis);
    }
  }, [clientKpis]);

  const handleOpenCircleDetail = (category: ClientKpiCategory) => {
    setActiveKpiCategory(category);
    setIsKpiModalOpen(true);
  };

  const handleUpdateCircle = (updated: ClientKpiCircle) => {
    setLocalKpis(prev => prev.map(c => c.id === updated.id ? updated : c));
    if (onUpdateClientKpiCircle) {
      onUpdateClientKpiCircle(updated);
    }
  };

  // Modal states for modal interactions
  const [activeModal, setActiveModal] = useState<'ring' | 'perks' | 'revenue' | null>(null);

  // Selected item states
  const [editingTarget, setEditingTarget] = useState<MarketAcquisitionTarget | null>(null);
  const [selectedOpp, setSelectedOpp] = useState<StrategicOpportunity | null>(null);
  const [isAddingOpp, setIsAddingOpp] = useState(false);
  const [isAddingTx, setIsAddingTx] = useState(false);

  // New Opportunity Form State
  const [newOppTitle, setNewOppTitle] = useState('');
  const [newOppOrg, setNewOppOrg] = useState('');
  const [newOppDesc, setNewOppDesc] = useState('');
  const [newOppEvidence, setNewOppEvidence] = useState('');
  const [newOppStage, setNewOppStage] = useState<OpportunityStage>('discovered');
  const [newOppNextStep, setNewOppNextStep] = useState('');
  const [newOppDate, setNewOppDate] = useState('');

  // New Transaction Form State
  const [newTxType, setNewTxType] = useState<'revenue' | 'cost'>('revenue');
  const [newTxAmount, setNewTxAmount] = useState('');
  const [newTxDate, setNewTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTxSource, setNewTxSource] = useState('');
  const [newTxClient, setNewTxClient] = useState('');
  const [newTxCategory, setNewTxCategory] = useState<FinancialCategory>('data-analysis');
  const [newTxNotes, setNewTxNotes] = useState('');

  // -------------------------------------------------------------
  // 1. Calculations: Market Acquisition Targets (Ring Completion)
  // -------------------------------------------------------------
  const totalTargeted = marketTargets.reduce((sum, t) => sum + t.targetCount, 0);
  const totalActual = marketTargets.reduce((sum, t) => sum + t.actualCount, 0);
  const ringCompletionPct = totalTargeted > 0 ? Math.min(100, Math.round((totalActual / totalTargeted) * 100)) : 0;

  const targetBox1 = marketTargets[0] || { title: 'أنشطة مستهدفة', targetCount: 20, actualCount: 0 };
  const targetBox2 = marketTargets[1] || { title: 'جهات متواصل معها', targetCount: 15, actualCount: 0 };
  const targetBox3 = marketTargets[2] || { title: 'اجتماعات وزيارات', targetCount: 10, actualCount: 0 };
  const targetBox4 = marketTargets[3] || { title: 'فرص مهنية فعلية', targetCount: 5, actualCount: 0 };

  const box1Pct = targetBox1.targetCount > 0 ? Math.min(100, Math.round((targetBox1.actualCount / targetBox1.targetCount) * 100)) : 0;
  const box2Pct = targetBox2.targetCount > 0 ? Math.min(100, Math.round((targetBox2.actualCount / targetBox2.targetCount) * 100)) : 0;
  const box3Pct = targetBox3.targetCount > 0 ? Math.min(100, Math.round((targetBox3.actualCount / targetBox3.targetCount) * 100)) : 0;
  const box4Pct = targetBox4.targetCount > 0 ? Math.min(100, Math.round((targetBox4.actualCount / targetBox4.targetCount) * 100)) : 0;

  // -------------------------------------------------------------
  // 2. Calculations: Strategic Perks (Opportunities)
  // -------------------------------------------------------------
  const totalOppsCount = opportunities.length;
  const activeOpportunities = opportunities.slice(0, 3);

  const getStageBadge = (stage: OpportunityStage) => {
    switch (stage) {
      case 'discovered':
        return { label: 'اكتُشفت', color: 'text-[#D97706] bg-[#FEF3C7] border-[#FDE68A]' };
      case 'verifying':
        return { label: 'قيد التحقق', color: 'text-[#2563EB] bg-[#DBEAFE] border-[#BFDBFE]' };
      case 'ready':
        return { label: 'جاهزة للتقديم', color: 'text-[#7C3AED] bg-[#EDE9FE] border-[#DDD6FE]' };
      case 'in-progress':
        return { label: 'قيد التنفيذ', color: 'text-[#15803D] bg-[#DCFCE7] border-[#BBF7D0]' };
      case 'completed':
        return { label: 'مكتملة', color: 'text-[#047857] bg-[#D1FAE5] border-[#A7F3D0]' };
      case 'paused':
        return { label: 'متوقفة', color: 'text-[#DC2626] bg-[#FEE2E2] border-[#FECACA]' };
      default:
        return { label: stage, color: 'text-[#554F59] bg-[#F4F1EA] border-[#E5DECE]' };
    }
  };

  // -------------------------------------------------------------
  // 3. Calculations: Revenue Breakdown
  // -------------------------------------------------------------
  const totalRevenue = financialTransactions
    .filter(tx => tx.type === 'revenue')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalCosts = financialTransactions
    .filter(tx => tx.type === 'cost')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netIncome = totalRevenue - totalCosts;

  // Category breakdowns for revenue
  const revAnalysis = financialTransactions
    .filter(tx => tx.type === 'revenue' && tx.category === 'data-analysis')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const revConsulting = financialTransactions
    .filter(tx => tx.type === 'revenue' && tx.category === 'consulting')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const revSystems = financialTransactions
    .filter(tx => tx.type === 'revenue' && tx.category === 'systems-impl')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const revOther = financialTransactions
    .filter(tx => tx.type === 'revenue' && tx.category === 'other')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const analysisPct = totalRevenue > 0 ? Math.round((revAnalysis / totalRevenue) * 100) : 0;
  const consultingPct = totalRevenue > 0 ? Math.round((revConsulting / totalRevenue) * 100) : 0;
  const systemsPct = totalRevenue > 0 ? Math.round((revSystems / totalRevenue) * 100) : 0;
  const otherPct = totalRevenue > 0 ? Math.max(0, 100 - (analysisPct + consultingPct + systemsPct)) : 0;

  // Handlers for Target Update
  const handleSaveTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTarget) return;
    onUpdateMarketTarget(editingTarget);
    setEditingTarget(null);
  };

  // Handlers for New Opportunity
  const handleCreateOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOppTitle.trim()) return;

    const newOpp: StrategicOpportunity = {
      id: `opp-${Date.now()}`,
      title: newOppTitle.trim(),
      organization: newOppOrg.trim() || 'جهة عمل غير محددة',
      shortDescription: newOppDesc.trim(),
      availableEvidence: newOppEvidence.trim(),
      stage: newOppStage,
      nextStep: newOppNextStep.trim(),
      followUpDate: newOppDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddOpportunity(newOpp);
    // Also update actual qualified opportunity count if relevant
    const oppTarget = marketTargets.find(t => t.stage === 'opportunities');
    if (oppTarget) {
      onUpdateMarketTarget({
        ...oppTarget,
        actualCount: oppTarget.actualCount + 1,
      });
    }

    setNewOppTitle('');
    setNewOppOrg('');
    setNewOppDesc('');
    setNewOppEvidence('');
    setNewOppStage('discovered');
    setNewOppNextStep('');
    setNewOppDate('');
    setIsAddingOpp(false);
  };

  // Handlers for New Transaction
  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(newTxAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const newTx: FinancialTransaction = {
      id: `tx-${Date.now()}`,
      type: newTxType,
      amount: parsedAmount,
      date: newTxDate || new Date().toISOString().split('T')[0],
      source: newTxSource.trim() || (newTxType === 'revenue' ? 'دفعة عميل' : 'مصاريف تشغيل'),
      clientOrProject: newTxClient.trim() || 'عام',
      category: newTxCategory,
      notes: newTxNotes.trim(),
    };

    onAddTransaction(newTx);
    setNewTxAmount('');
    setNewTxSource('');
    setNewTxClient('');
    setNewTxNotes('');
    setIsAddingTx(false);
  };

  return (
    <>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-2">
        
        {/* 1. CARD 1: RING COMPLETION (Market Acquisition Pipeline Targets) - COMPACT */}
        <div 
          onClick={() => setActiveModal('ring')}
          className="command-card p-2 sm:p-2.5 flex flex-col justify-between h-full cursor-pointer hover:border-[#B31B24] transition-all group"
          title="انقر لتعديل وإدارة أهداف السوق"
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="font-serif-title text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#1C191E] flex items-center gap-1">
                <span>RING COMPLETION</span>
                <span className="text-[9px] text-[#7A747D] font-normal normal-case font-sans">(أهداف السوق)</span>
              </h2>
              <div className="flex items-center gap-1">
                <span className="font-mono-num font-bold text-xs text-[#1C191E]">
                  {totalActual}/{totalTargeted}
                </span>
                <Edit3 className="w-2.5 h-2.5 text-[#7A747D] group-hover:text-[#B31B24] transition-colors" />
              </div>
            </div>

            {/* Solid Crimson Bar */}
            <div className="w-full bg-[#EFEAE0] rounded-full h-1 overflow-hidden">
              <div 
                className="h-full bg-[#B31B24] transition-all duration-300" 
                style={{ width: `${ringCompletionPct}%` }}
              />
            </div>

            {/* 4 Square Status Boxes in a row */}
            <div className="grid grid-cols-4 gap-1 pt-0.5">
              {/* Box 1: Identified */}
              <div className="p-1 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] flex flex-col items-center justify-center text-center">
                <div className="p-0.5 rounded bg-[#FFFFFF] border border-[#E5DECE] text-[#B31B24] mb-0.5">
                  <Target className="w-2.5 h-2.5" />
                </div>
                <span className="text-[7.5px] uppercase tracking-wider text-[#7A747D] font-bold block truncate w-full" title={targetBox1.title}>
                  مستهدفة
                </span>
                <div className="w-full bg-[#E5DECE] h-0.5 rounded-full my-0.5 overflow-hidden">
                  <div 
                    className="bg-[#B31B24] h-full" 
                    style={{ width: `${box1Pct}%` }}
                  />
                </div>
                <span className="font-mono-num text-[8.5px] font-bold text-[#1C191E]">
                  {targetBox1.actualCount}/{targetBox1.targetCount}
                </span>
              </div>

              {/* Box 2: Contacted */}
              <div className="p-1 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] flex flex-col items-center justify-center text-center">
                <div className="p-0.5 rounded bg-[#FFFFFF] border border-[#E5DECE] text-[#D97706] mb-0.5">
                  <Clock className="w-2.5 h-2.5" />
                </div>
                <span className="text-[7.5px] uppercase tracking-wider text-[#7A747D] font-bold block truncate w-full" title={targetBox2.title}>
                  تواصل
                </span>
                <div className="w-full bg-[#E5DECE] h-0.5 rounded-full my-0.5 overflow-hidden">
                  <div 
                    className="bg-[#D97706] h-full" 
                    style={{ width: `${box2Pct}%` }}
                  />
                </div>
                <span className="font-mono-num text-[8.5px] font-bold text-[#1C191E]">
                  {targetBox2.actualCount}/{targetBox2.targetCount}
                </span>
              </div>

              {/* Box 3: Meetings */}
              <div className="p-1 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] flex flex-col items-center justify-center text-center">
                <div className="p-0.5 rounded bg-[#FFFFFF] border border-[#E5DECE] text-[#B31B24] mb-0.5">
                  <Layers className="w-2.5 h-2.5" />
                </div>
                <span className="text-[7.5px] uppercase tracking-wider text-[#7A747D] font-bold block truncate w-full" title={targetBox3.title}>
                  زيارات
                </span>
                <div className="w-full bg-[#E5DECE] h-0.5 rounded-full my-0.5 overflow-hidden">
                  <div 
                    className="bg-[#B31B24] h-full" 
                    style={{ width: `${box3Pct}%` }}
                  />
                </div>
                <span className="font-mono-num text-[8.5px] font-bold text-[#1C191E]">
                  {targetBox3.actualCount}/{targetBox3.targetCount}
                </span>
              </div>

              {/* Box 4: Opportunities */}
              <div className="p-1 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] flex flex-col items-center justify-center text-center">
                <div className="p-0.5 rounded bg-[#FFFFFF] border border-[#E5DECE] text-[#15803D] mb-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                </div>
                <span className="text-[7.5px] uppercase tracking-wider text-[#7A747D] font-bold block truncate w-full" title={targetBox4.title}>
                  فرص
                </span>
                <div className="w-full bg-[#E5DECE] h-0.5 rounded-full my-0.5 overflow-hidden">
                  <div 
                    className="bg-[#15803D] h-full" 
                    style={{ width: `${box4Pct}%` }}
                  />
                </div>
                <span className="font-mono-num text-[8.5px] font-bold text-[#1C191E]">
                  {targetBox4.actualCount}/{targetBox4.targetCount}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-1 mt-1 border-t border-[#EFEAE0] flex items-center justify-between text-[9px] text-[#7A747D]">
            <span>معدل إنجاز خطة السوق</span>
            <span className="font-bold text-[#1C191E]">{ringCompletionPct}% محقق</span>
          </div>
        </div>

        {/* 2. CARD 2: STRATEGIC PERKS (Strategic Opportunities & Initiatives) - COMPACT */}
        <div 
          onClick={() => setActiveModal('perks')}
          className="command-card p-2 sm:p-2.5 flex flex-col justify-between h-full cursor-pointer hover:border-[#B31B24] transition-all group"
          title="انقر لفتح واستعراض وإضافة الفرص التجارية والمبادرات"
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="font-serif-title text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#1C191E] flex items-center gap-1">
                <span>STRATEGIC PERKS</span>
                <span className="text-[9px] text-[#7A747D] font-normal normal-case font-sans">(الفرص التجارية)</span>
              </h2>
              <div className="flex items-center gap-1">
                <span className="font-mono-num font-bold text-xs text-[#1C191E]">
                  {totalOppsCount}
                </span>
                <Plus className="w-2.5 h-2.5 text-[#7A747D] group-hover:text-[#B31B24] transition-colors" />
              </div>
            </div>

            {/* Dynamic Perks list or Empty State */}
            {activeOpportunities.length === 0 ? (
              <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] text-center flex flex-col items-center justify-center py-2.5 my-0.5">
                <Lightbulb className="w-4 h-4 text-[#B31B24] mb-1 opacity-60" />
                <span className="font-serif-title text-[11px] font-bold text-[#1C191E]">لا توجد فرص مسجلة بعد</span>
                <span className="text-[9px] text-[#7A747D] mt-0.5">
                  انقر هنا لإضافة فرصة تجارية جديدة
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                {activeOpportunities.slice(0, 2).map((opp) => {
                  const badge = getStageBadge(opp.stage);
                  return (
                    <div 
                      key={opp.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOpp(opp);
                        setActiveModal('perks');
                      }}
                      className="p-1 sm:p-1.5 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] flex items-center justify-between hover:border-[#B31B24] transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-5 h-5 rounded bg-[#FFFFFF] border border-[#E5DECE] flex items-center justify-center text-[#B31B24] shrink-0">
                          <Lightbulb className="w-2.5 h-2.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-[#1C191E] block font-serif-title leading-tight truncate">
                            {opp.title}
                          </span>
                          <span className="text-[7.5px] text-[#7A747D] block truncate">
                            {opp.organization}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[7px] font-bold px-1 py-0.2 rounded border shrink-0 ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer info */}
          <div className="pt-1 mt-1 border-t border-[#EFEAE0] flex items-center justify-between text-[9px] text-[#7A747D]">
            <span>الفرص النشطة</span>
            <span className="font-bold text-[#15803D]">{totalOppsCount} مسجلة</span>
          </div>
        </div>

        {/* 3. CARD 3: CLIENT MAIN KPIS (3 DONUT CHARTS) OR BUSINESS MODEL CANVAS */}
        {selectedLocation && (selectedLocation.locationCategory === 'potential-client' || selectedLocation.locationCategory === 'current-client' || selectedLocation.controllingSyndicate === 'عميل مستهدف') ? (
          <div className="flex flex-col h-full bg-[#FCFAF6] border border-[#E5DECE] rounded-xl overflow-hidden shadow-2xs">
            {/* Top Switcher Tab between Client Main KPIs & BMC */}
            <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#FAF8F5] border-b border-[#EFEAE0] text-[10px]">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCard3ViewMode('kpis')}
                  className={`px-2 py-0.5 rounded font-bold transition-all ${
                    card3ViewMode === 'kpis'
                      ? 'bg-[#1C191E] text-white shadow-xs'
                      : 'text-[#7A747D] hover:text-[#1C191E] hover:bg-[#EFEAE0]'
                  }`}
                >
                  CLIENT MAIN KPIS
                </button>
                <button
                  onClick={() => setCard3ViewMode('bmc')}
                  className={`px-2 py-0.5 rounded font-bold transition-all ${
                    card3ViewMode === 'bmc'
                      ? 'bg-[#8A181F] text-white shadow-xs'
                      : 'text-[#7A747D] hover:text-[#8A181F] hover:bg-[#EFEAE0]'
                  }`}
                >
                  MODEL CANVAS
                </button>
              </div>

              <span className="text-[9px] text-[#554F59] font-bold truncate max-w-[130px]">
                {selectedLocation.name}
              </span>
            </div>

            <div className="flex-1 min-h-0">
              {card3ViewMode === 'kpis' ? (
                <ClientMainKpisCard
                  circles={localKpis}
                  onOpenCircleDetail={handleOpenCircleDetail}
                  selectedLocationName={selectedLocation.name}
                  isClientSelected={true}
                />
              ) : (
                <BusinessModelCanvasPanel
                  selectedLocation={selectedLocation}
                  onUpdateCanvas={(locationId, updatedCanvas) => {
                    if (onUpdateBusinessCanvas) {
                      onUpdateBusinessCanvas(locationId, updatedCanvas);
                    }
                  }}
                  relationships={relationships}
                  onOpenAddContact={onOpenAddContact || (() => {})}
                  onSelectRelationship={onSelectRelationship || (() => {})}
                  onOpenHierarchyTree={onOpenHierarchyTree || (() => {})}
                />
              )}
            </div>
          </div>
        ) : (
          <ClientMainKpisCard
            circles={localKpis}
            onOpenCircleDetail={handleOpenCircleDetail}
            isClientSelected={false}
          />
        )}

      </div>

      {/* ========================================================= */}
      {/* MODAL 1: Ring Completion (Market Acquisition Pipeline Targets) */}
      {/* ========================================================= */}
      {activeModal === 'ring' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="w-full max-w-2xl bg-[#FFFFFF] border border-[#E2DACB] rounded-2xl p-5 shadow-2xl text-[#1C191E] max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EFEAE0] pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] flex items-center justify-center text-[#B31B24]">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-[#7A747D] uppercase font-bold tracking-wider">
                    MARKET ACQUISITION PIPELINE
                  </span>
                  <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#1C191E]">
                    إدارة أهداف السوق وبناء شبكة العلاقات
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg text-[#7A747D] hover:text-[#1C191E] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#7A747D] mb-4">
              قياس مدى التقدم في الوصول إلى الجهات المستهدفة في السوق وتطوير العلاقات إلى فرص فعلية. يتم احتساب التقدم وفق السجلات الفعلية.
            </p>

            {/* List of 4 stages with inline edit controls */}
            <div className="space-y-3 mb-5">
              {marketTargets.map((target) => {
                const isEditingThis = editingTarget?.id === target.id;
                const progressPct = target.targetCount > 0 ? Math.min(100, Math.round((target.actualCount / target.targetCount) * 100)) : 0;
                
                return (
                  <div key={target.id} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DECE]">
                    {isEditingThis ? (
                      <form onSubmit={handleSaveTarget} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#B31B24]">{target.title}</span>
                          <span className="text-[10px] text-[#7A747D]">{target.subtitle}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div>
                            <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">اسم الهدف</label>
                            <input
                              type="text"
                              value={editingTarget.title}
                              onChange={(e) => setEditingTarget({ ...editingTarget, title: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">العدد المستهدف</label>
                            <input
                              type="number"
                              min="1"
                              value={editingTarget.targetCount}
                              onChange={(e) => setEditingTarget({ ...editingTarget, targetCount: Math.max(1, parseInt(e.target.value) || 1) })}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">العدد المحقق</label>
                            <input
                              type="number"
                              min="0"
                              value={editingTarget.actualCount}
                              onChange={(e) => setEditingTarget({ ...editingTarget, actualCount: Math.max(0, parseInt(e.target.value) || 0) })}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">الفترة الزمنية</label>
                          <input
                            type="text"
                            value={editingTarget.timeframe}
                            onChange={(e) => setEditingTarget({ ...editingTarget, timeframe: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                          />
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingTarget(null)}
                            className="px-3 py-1.5 rounded-lg border border-[#E5DECE] bg-[#FFFFFF] text-xs text-[#7A747D] hover:bg-[#FAF8F5] cursor-pointer"
                          >
                            إلغاء
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-lg bg-[#B31B24] text-white text-xs font-bold hover:bg-[#990000] cursor-pointer"
                          >
                            حفظ التعديلات
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div>
                            <h4 className="text-xs font-bold text-[#1C191E]">{target.title}</h4>
                            <p className="text-[10px] text-[#7A747D]">{target.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono-num text-xs font-bold text-[#B31B24]">
                              {target.actualCount} / {target.targetCount}
                            </span>
                            <button
                              onClick={() => setEditingTarget(target)}
                              className="p-1 rounded-md text-[#7A747D] hover:text-[#B31B24] hover:bg-[#FFFFFF] border border-transparent hover:border-[#E5DECE] cursor-pointer"
                              title="تعديل هذا الهدف"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Progress line */}
                        <div className="w-full bg-[#E5DECE] rounded-full h-1.5 overflow-hidden my-1.5">
                          <div 
                            className="bg-[#B31B24] h-full transition-all duration-300"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[9px] text-[#7A747D]">
                          <span>الفترة: {target.timeframe}</span>
                          <span className="font-bold text-[#1C191E]">{progressPct}% مكتمل</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EFEAE0] border border-[#E5DECE] text-[#1C191E] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: Strategic Perks (Strategic Opportunities & Initiatives) */}
      {/* ========================================================= */}
      {activeModal === 'perks' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="w-full max-w-2xl bg-[#FFFFFF] border border-[#E2DACB] rounded-2xl p-5 shadow-2xl text-[#1C191E] max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EFEAE0] pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] flex items-center justify-center text-[#B31B24]">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-[#7A747D] uppercase font-bold tracking-wider">
                    STRATEGIC OPPORTUNITIES
                  </span>
                  <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#1C191E]">
                    إدارة الفرص والمبادرات التجارية
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddingOpp(!isAddingOpp)}
                  className="px-3 py-1.5 rounded-lg bg-[#B31B24] text-white text-xs font-bold hover:bg-[#990000] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة فرصة جديدة</span>
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-lg text-[#7A747D] hover:text-[#1C191E] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Add Opportunity Form if open */}
            {isAddingOpp && (
              <form onSubmit={handleCreateOpportunity} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] mb-4 space-y-3">
                <h4 className="text-xs font-bold text-[#1C191E] flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-[#B31B24]" />
                  <span>تسجيل فرصة تجارية / مبادرة جديدة</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">اسم الفرصة / المبادرة *</label>
                    <input
                      type="text"
                      placeholder="مثال: تحليل الفاقد في سلاسل التوريد"
                      value={newOppTitle}
                      onChange={(e) => setNewOppTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">الجهة المرتبطة بها *</label>
                    <input
                      type="text"
                      placeholder="مثال: مصنع النيل للأغذية"
                      value={newOppOrg}
                      onChange={(e) => setNewOppOrg(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">الحالة الحالية *</label>
                    <select
                      value={newOppStage}
                      onChange={(e) => setNewOppStage(e.target.value as OpportunityStage)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                    >
                      <option value="discovered">اكتُشفت (Discovered)</option>
                      <option value="verifying">قيد التحقق (Verifying)</option>
                      <option value="ready">جاهزة للتقديم (Ready)</option>
                      <option value="in-progress">قيد التنفيذ (In-Progress)</option>
                      <option value="completed">مكتملة (Completed)</option>
                      <option value="paused">متوقفة (Paused)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">موعد المتابعة</label>
                    <input
                      type="date"
                      value={newOppDate}
                      onChange={(e) => setNewOppDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">وصف مختصر للفرصة</label>
                  <textarea
                    rows={2}
                    placeholder="شرح موجز للمشكلة أو التدخل المقترح وقيمته التجارية..."
                    value={newOppDesc}
                    onChange={(e) => setNewOppDesc(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">الأدلة المتاحة</label>
                    <input
                      type="text"
                      placeholder="أرقام، تقارير، مقابلات ميدانية..."
                      value={newOppEvidence}
                      onChange={(e) => setNewOppEvidence(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">الخطوة التالية</label>
                    <input
                      type="text"
                      placeholder="إعداد عرض، اجتماع مع المدير..."
                      value={newOppNextStep}
                      onChange={(e) => setNewOppNextStep(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingOpp(false)}
                    className="px-3 py-1.5 rounded-lg border border-[#E5DECE] bg-[#FFFFFF] text-xs text-[#7A747D] hover:bg-[#FAF8F5] cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#B31B24] text-white text-xs font-bold hover:bg-[#990000] cursor-pointer"
                  >
                    إضافة الفرصة
                  </button>
                </div>
              </form>
            )}

            {/* List of Opportunities */}
            <div className="space-y-2.5 mb-5">
              {opportunities.length === 0 ? (
                <div className="p-8 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] text-center">
                  <Lightbulb className="w-8 h-8 text-[#B31B24] mx-auto mb-2 opacity-50" />
                  <h4 className="font-serif-title text-sm font-bold text-[#1C191E]">لا توجد فرص تجارية مسجلة حالياً</h4>
                  <p className="text-xs text-[#7A747D] mt-1">
                    اضغط على زر &quot;إضافة فرصة جديدة&quot; بالأعلى لتدوين أول مبادرة أو فرصة تم اكتشافها.
                  </p>
                </div>
              ) : (
                opportunities.map((opp) => {
                  const badge = getStageBadge(opp.stage);
                  return (
                    <div key={opp.id} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-[#1C191E] block font-serif-title">{opp.title}</span>
                          <span className="text-[10px] text-[#7A747D]">{opp.organization}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${badge.color}`}>
                            {badge.label}
                          </span>
                          <button
                            onClick={() => onDeleteOpportunity(opp.id)}
                            className="p-1 rounded text-[#7A747D] hover:text-[#DC2626] transition-colors cursor-pointer"
                            title="حذف الفرصة"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {opp.shortDescription && (
                        <p className="text-xs text-[#554F59] leading-relaxed bg-[#FFFFFF] p-2 rounded-lg border border-[#E5DECE]">
                          {opp.shortDescription}
                        </p>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] text-[#7A747D] pt-1">
                        <div>
                          <span className="font-semibold text-[#1C191E] block">الأدلة المتاحة:</span>
                          <span>{opp.availableEvidence || 'لا توجد أدلة مسجلة'}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-[#1C191E] block">الخطوة التالية:</span>
                          <span>{opp.nextStep || 'غير محددة'}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-[#1C191E] block">موعد المتابعة:</span>
                          <span className="font-mono-num">{opp.followUpDate || 'غير محدد'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EFEAE0] border border-[#E5DECE] text-[#1C191E] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: Revenue Breakdown (Financial Transactions) */}
      {/* ========================================================= */}
      {activeModal === 'revenue' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="w-full max-w-2xl bg-[#FFFFFF] border border-[#E2DACB] rounded-2xl p-5 shadow-2xl text-[#1C191E] max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EFEAE0] pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] flex items-center justify-center text-[#B31B24]">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-[#7A747D] uppercase font-bold tracking-wider">
                    FINANCIAL LEDGER &amp; REVENUE
                  </span>
                  <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#1C191E]">
                    قياس التقدم المالي والتجاري الفعلي
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddingTx(!isAddingTx)}
                  className="px-3 py-1.5 rounded-lg bg-[#B31B24] text-white text-xs font-bold hover:bg-[#990000] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>تسجيل إيراد / تكلفة</span>
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-lg text-[#7A747D] hover:text-[#1C191E] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Financial Summary KPI Cards */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DECE]">
                <span className="text-[10px] text-[#7A747D] block font-semibold">إجمالي الإيرادات</span>
                <span className="font-mono-num font-bold text-sm text-[#1C191E] mt-0.5 block">
                  ${totalRevenue.toLocaleString()}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DECE]">
                <span className="text-[10px] text-[#7A747D] block font-semibold">التكاليف المسجلة</span>
                <span className="font-mono-num font-bold text-sm text-[#DC2626] mt-0.5 block">
                  ${totalCosts.toLocaleString()}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DECE]">
                <span className="text-[10px] text-[#7A747D] block font-semibold">صافي العائد (الربح)</span>
                <span className={`font-mono-num font-bold text-sm mt-0.5 block ${netIncome >= 0 ? 'text-[#15803D]' : 'text-[#DC2626]'}`}>
                  {netIncome >= 0 ? '+' : ''}${netIncome.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Add Transaction Form */}
            {isAddingTx && (
              <form onSubmit={handleCreateTransaction} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] mb-4 space-y-3">
                <h4 className="text-xs font-bold text-[#1C191E] flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-[#B31B24]" />
                  <span>تسجيل عملية مالية جديدة</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">النوع *</label>
                    <select
                      value={newTxType}
                      onChange={(e) => setNewTxType(e.target.value as 'revenue' | 'cost')}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                    >
                      <option value="revenue">إيراد محقق (+)</option>
                      <option value="cost">تكلفة مسجلة (-)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">المبلغ ($) *</label>
                    <input
                      type="number"
                      step="any"
                      min="1"
                      placeholder="1500"
                      value={newTxAmount}
                      onChange={(e) => setNewTxAmount(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">التاريخ</label>
                    <input
                      type="date"
                      value={newTxDate}
                      onChange={(e) => setNewTxDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">التصنيف المالي</label>
                    <select
                      value={newTxCategory}
                      onChange={(e) => setNewTxCategory(e.target.value as FinancialCategory)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                    >
                      <option value="data-analysis">تحليل بيانات</option>
                      <option value="consulting">استشارات</option>
                      <option value="systems-impl">تنفيذ أنظمة</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">المصدر</label>
                    <input
                      type="text"
                      placeholder="دفعة أولى / أتعاب استشارة..."
                      value={newTxSource}
                      onChange={(e) => setNewTxSource(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">المشروع أو العميل</label>
                    <input
                      type="text"
                      placeholder="اسم العميل أو المشروع"
                      value={newTxClient}
                      onChange={(e) => setNewTxClient(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-[10px] text-[#7A747D] mb-1 font-semibold">ملاحظات إضافية</label>
                  <input
                    type="text"
                    placeholder="ملاحظات تفصيلية..."
                    value={newTxNotes}
                    onChange={(e) => setNewTxNotes(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5DECE] text-[#1C191E] text-xs focus:outline-none focus:border-[#B31B24]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingTx(false)}
                    className="px-3 py-1.5 rounded-lg border border-[#E5DECE] bg-[#FFFFFF] text-xs text-[#7A747D] hover:bg-[#FAF8F5] cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#B31B24] text-white text-xs font-bold hover:bg-[#990000] cursor-pointer"
                  >
                    تسجيل المعاملة
                  </button>
                </div>
              </form>
            )}

            {/* Transactions List */}
            <div className="space-y-2 mb-5">
              {financialTransactions.length === 0 ? (
                <div className="p-8 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] text-center">
                  <DollarSign className="w-8 h-8 text-[#B31B24] mx-auto mb-2 opacity-50" />
                  <h4 className="font-serif-title text-sm font-bold text-[#1C191E]">لا توجد بيانات مالية مسجلة بعد</h4>
                  <p className="text-xs text-[#7A747D] mt-1">
                    لم تسجل أي إيرادات أو تكاليف حتى الآن. اضغط على زر &quot;تسجيل إيراد / تكلفة&quot; لتسجيل أول عملية.
                  </p>
                </div>
              ) : (
                financialTransactions.map((tx) => (
                  <div key={tx.id} className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DECE] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${tx.type === 'revenue' ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#FEE2E2] text-[#DC2626]'}`}>
                        {tx.type === 'revenue' ? '+' : '-'}
                      </div>
                      <div>
                        <span className="font-bold text-[#1C191E] block">{tx.source}</span>
                        <span className="text-[10px] text-[#7A747D]">
                          {tx.clientOrProject} &bull; {tx.category} &bull; {tx.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`font-mono-num font-bold text-sm ${tx.type === 'revenue' ? 'text-[#15803D]' : 'text-[#DC2626]'}`}>
                        {tx.type === 'revenue' ? '+' : '-'}${tx.amount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="p-1 rounded text-[#7A747D] hover:text-[#DC2626] transition-colors cursor-pointer"
                        title="حذف المعاملة"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EFEAE0] border border-[#E5DECE] text-[#1C191E] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: Client Main KPIs 3 Circles & Sheet Sync Manager */}
      {/* ========================================================= */}
      {isKpiModalOpen && (
        <ClientKpiDetailModal
          isOpen={isKpiModalOpen}
          onClose={() => setIsKpiModalOpen(false)}
          circles={localKpis}
          activeCategoryId={activeKpiCategory}
          onSelectCategory={(cat) => setActiveKpiCategory(cat)}
          onUpdateCircle={handleUpdateCircle}
          selectedLocationName={selectedLocation?.name}
        />
      )}
    </>
  );
};
