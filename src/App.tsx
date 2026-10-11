/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  TerritoryRegion, 
  RacketNode, 
  FamilyMember, 
  LiveOperation, 
  CrimeRing, 
  ConsigliereAlert,
  EmpireFinancials,
  CitySector,
  MarketAcquisitionTarget,
  StrategicOpportunity,
  FinancialTransaction,
  HierarchyProcessNode,
  RelationshipContact
} from './types/dashboard';
import { 
  INITIAL_FINANCIALS, 
  INITIAL_RACKET_NODES, 
  INITIAL_CRIME_RINGS, 
  INITIAL_FAMILY_ROSTER, 
  INITIAL_LIVE_OPERATIONS, 
  INITIAL_CONSIGLIERE_ALERTS,
  INITIAL_CITY_SECTORS,
  INITIAL_MARKET_TARGETS,
  INITIAL_OPPORTUNITIES,
  INITIAL_FINANCIAL_TRANSACTIONS,
  INITIAL_BUSINESS_HIERARCHY,
  INITIAL_RELATIONSHIPS
} from './data/mockData';

import { LeftIconRail } from './components/Navigation/LeftIconRail';
import { TopHeaderBar } from './components/Header/TopHeaderBar';
import { StrategicRacketsPanel } from './components/LeftSidebar/StrategicRacketsPanel';
import { ExecutiveRosterPanel } from './components/RightSidebar/ExecutiveRosterPanel';
import { TacticalMapCanvas } from './components/StrategyCanvas/TacticalMapCanvas';
import { DispatchModal } from './components/Modals/DispatchModal';
import { HierarchyModal } from './components/Modals/HierarchyModal';
import { MemberModal } from './components/Modals/MemberModal';

export default function App() {
  // Navigation & Region (Mansoura as first default sector)
  const [activeNavTab, setActiveNavTab] = useState<string>('home');
  const [sectors, setSectors] = useState<CitySector[]>(INITIAL_CITY_SECTORS);
  const [currentRegion, setCurrentRegion] = useState<TerritoryRegion>('mansoura');
  
  // Data State
  const [financials, setFinancials] = useState<EmpireFinancials>(INITIAL_FINANCIALS);
  const [rackets, setRackets] = useState<RacketNode[]>(INITIAL_RACKET_NODES);
  const [crimeRings, setCrimeRings] = useState<CrimeRing[]>(INITIAL_CRIME_RINGS);
  const [roster, setRoster] = useState<FamilyMember[]>(INITIAL_FAMILY_ROSTER);
  const [operations, setOperations] = useState<LiveOperation[]>(INITIAL_LIVE_OPERATIONS);
  const [alerts, setAlerts] = useState<ConsigliereAlert[]>(INITIAL_CONSIGLIERE_ALERTS);

  // Career, Market Opportunities & Real Ledger State
  const [marketTargets, setMarketTargets] = useState<MarketAcquisitionTarget[]>(() => {
    const saved = localStorage.getItem('don_market_targets');
    return saved ? JSON.parse(saved) : INITIAL_MARKET_TARGETS;
  });

  const [opportunities, setOpportunities] = useState<StrategicOpportunity[]>(() => {
    const saved = localStorage.getItem('don_strategic_opportunities');
    return saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
  });

  const [financialTransactions, setFinancialTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem('don_financial_transactions');
    return saved ? JSON.parse(saved) : INITIAL_FINANCIAL_TRANSACTIONS;
  });

  const [hierarchyNodes, setHierarchyNodes] = useState<HierarchyProcessNode[]>(() => {
    const saved = localStorage.getItem('don_business_hierarchy');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESS_HIERARCHY;
  });

  const [relationships, setRelationships] = useState<RelationshipContact[]>(() => {
    const saved = localStorage.getItem('don_relationships');
    return saved ? JSON.parse(saved) : INITIAL_RELATIONSHIPS;
  });

  // LocalStorage persistence for all 5 systems
  useEffect(() => {
    localStorage.setItem('don_market_targets', JSON.stringify(marketTargets));
  }, [marketTargets]);

  useEffect(() => {
    localStorage.setItem('don_strategic_opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem('don_financial_transactions', JSON.stringify(financialTransactions));
  }, [financialTransactions]);

  useEffect(() => {
    localStorage.setItem('don_business_hierarchy', JSON.stringify(hierarchyNodes));
  }, [hierarchyNodes]);

  useEffect(() => {
    localStorage.setItem('don_relationships', JSON.stringify(relationships));
  }, [relationships]);

  // Synchronize target 1 (identified) with contacts count and target 4 with opportunities count if desired
  useEffect(() => {
    setMarketTargets(prev => prev.map(target => {
      if (target.stage === 'identified' && relationships.length > target.actualCount) {
        return { ...target, actualCount: relationships.length };
      }
      if (target.stage === 'opportunities' && opportunities.length > target.actualCount) {
        return { ...target, actualCount: opportunities.length };
      }
      return target;
    }));
  }, [relationships.length, opportunities.length]);

  // Selection
  const [selectedNode, setSelectedNode] = useState<RacketNode | null>(null);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [selectedRingFilter, setSelectedRingFilter] = useState<string | null>(null);

  // Selected Relationship & Modal
  const [selectedRelationship, setSelectedRelationship] = useState<RelationshipContact | null>(null);
  const [isRelationshipModalOpen, setIsRelationshipModalOpen] = useState(false);
  const [isRelationshipCreateMode, setIsRelationshipCreateMode] = useState(false);

  // Modals
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchTargetNode, setDispatchTargetNode] = useState<RacketNode | null>(null);
  const [dispatchOpType, setDispatchOpType] = useState<'takeover' | 'reinforce' | 'arson_bomb' | 'extort'>('takeover');
  const [dispatchPreSelectedMember, setDispatchPreSelectedMember] = useState<FamilyMember | null>(null);

  const [isHierarchyModalOpen, setIsHierarchyModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);


  // Google Maps Quota State
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setIsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  // Audio FX
  const [isMuted, setIsMuted] = useState(false);

  // Live Operation Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setOperations((prevOps) => {
        let hasChanges = false;
        const nextOps: LiveOperation[] = [];

        for (const op of prevOps) {
          if (op.remainingSeconds <= 1) {
            hasChanges = true;
            // Mark target node owned
            setRackets((prevNodes) =>
              prevNodes.map((node) => {
                if (node.id === op.targetNodeId) {
                  return {
                    ...node,
                    status: 'owned',
                    controllingSyndicate: 'Valenti Syndicate',
                    defenseLevel: Math.min(node.defenseLevel + 25, 100),
                    guardCount: Math.min(node.guardCount + 4, node.maxGuards),
                  };
                }
                return node;
              })
            );

            // Free assigned members
            setRoster((prevRoster) =>
              prevRoster.map((mem) => {
                if (op.assignedMemberIds.includes(mem.id)) {
                  return {
                    ...mem,
                    status: 'active',
                    assignedMission: undefined,
                    killsCount: mem.killsCount + 1,
                  };
                }
                return mem;
              })
            );

            // Add alert
            setAlerts((prevAlerts) => [
              {
                id: `alert-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                speaker: 'Tom Hagen',
                message: `Mission "${op.title}" completed. Full territory tribute secured.`,
                severity: 'intel',
              },
              ...prevAlerts.slice(0, 7),
            ]);

            setFinancials((prevFin) => ({
              ...prevFin,
              totalWealth: prevFin.totalWealth + 65000,
              territoryControlPercentage: Math.min(prevFin.territoryControlPercentage + 2, 100),
            }));
          } else {
            const newRemaining = op.remainingSeconds - 1;
            const newProgress = Math.min(
              100,
              Math.round(((op.totalDurationSeconds - newRemaining) / op.totalDurationSeconds) * 100)
            );
            nextOps.push({
              ...op,
              remainingSeconds: newRemaining,
              progressPercent: newProgress,
            });
          }
        }

        return hasChanges ? nextOps : nextOps;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Synchronize dynamic financials with actual user rackets
  useEffect(() => {
    const totalHourly = rackets.reduce((sum, r) => sum + (r.status === 'owned' ? r.hourlyIncome : 0), 0);
    const totalCount = rackets.length;
    const ownedCount = rackets.filter(r => r.status === 'owned').length;
    const controlPct = totalCount > 0 ? Math.round((ownedCount / totalCount) * 100) : 0;

    setFinancials(prev => ({
      ...prev,
      netHourlyRevenue: totalHourly,
      territoryControlPercentage: controlPct
    }));
  }, [rackets]);

  const handleSelectRegion = (region: TerritoryRegion) => {
    setCurrentRegion(region);
    setSelectedNode(null);
  };

  const handleSelectSector = (sector: CitySector) => {
    setCurrentRegion(sector.id);
    setSelectedNode(null);
  };

  const handleAddSector = (newSector: CitySector) => {
    setSectors((prev) => [...prev, newSector]);
    setCurrentRegion(newSector.id);
    setSelectedNode(null);
  };

  const handleDeleteSector = (sectorId: string) => {
    setSectors((prev) => prev.filter((s) => s.id !== sectorId));
    if (currentRegion === sectorId) {
      setCurrentRegion('mansoura');
    }
    setSelectedNode(null);
  };

  const handleOpenLaunchModal = (
    node: RacketNode,
    type: 'takeover' | 'reinforce' | 'extort' | 'arson_bomb'
  ) => {
    setDispatchTargetNode(node);
    setDispatchOpType(type);
    setDispatchPreSelectedMember(null);
    setIsDispatchModalOpen(true);
  };

  const handleDispatchFromRoster = (member: FamilyMember, action: 'attack' | 'reinforce' | 'upgrade') => {
    if (action === 'upgrade') {
      setSelectedMember(member);
      setIsMemberModalOpen(true);
      return;
    }

    const regionalNodes = rackets.filter(r => r.region === currentRegion);
    const candidateTarget = action === 'attack'
      ? regionalNodes.find(r => r.status === 'rival' || r.status === 'contested') || regionalNodes[0]
      : regionalNodes.find(r => r.status === 'owned') || regionalNodes[0];

    setDispatchTargetNode(candidateTarget);
    setDispatchOpType(action === 'attack' ? 'takeover' : 'reinforce');
    setDispatchPreSelectedMember(member);
    setIsDispatchModalOpen(true);
  };

  const handleConfirmDispatch = (
    targetNode: RacketNode,
    operationType: 'takeover' | 'reinforce' | 'arson_bomb' | 'extort' | 'defend',
    selectedMemberIds: string[],
    calculatedSuccessRate: number
  ) => {
    const newOp: LiveOperation = {
      id: `op-${Date.now()}`,
      title: `${operationType === 'takeover' ? 'Assault' : operationType === 'arson_bomb' ? 'Sabotage' : 'Defend'}: ${targetNode.name}`,
      targetNodeId: targetNode.id,
      targetNodeName: targetNode.name,
      operationType: operationType,
      progressPercent: 5,
      remainingSeconds: 40,
      totalDurationSeconds: 40,
      assignedMemberIds: selectedMemberIds,
      successProbability: calculatedSuccessRate,
      status: 'in-progress',
      startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setOperations((prev) => [newOp, ...prev]);

    setRoster((prev) =>
      prev.map((m) =>
        selectedMemberIds.includes(m.id)
          ? { ...m, status: 'assigned', assignedMission: newOp.title }
          : m
      )
    );
  };

  const handleEmergencyAction = (type: 'call_backup' | 'medic_evac' | 'bribe_police' | 'lockdown') => {
    if (type === 'call_backup') {
      setFinancials((prev) => ({ ...prev, totalWealth: Math.max(0, prev.totalWealth - 25000) }));
      setRackets((prev) =>
        prev.map((r) =>
          r.region === currentRegion && r.status === 'owned'
            ? { ...r, guardCount: Math.min(r.guardCount + 2, r.maxGuards) }
            : r
        )
      );
    } else if (type === 'medic_evac') {
      setFinancials((prev) => ({ ...prev, totalWealth: Math.max(0, prev.totalWealth - 15000) }));
      setRoster((prev) =>
        prev.map((m) =>
          m.status === 'hospitalized'
            ? { ...m, status: 'active', healthPercent: 100 }
            : { ...m, healthPercent: Math.min(m.healthPercent + 25, 100) }
        )
      );
    } else if (type === 'bribe_police') {
      setFinancials((prev) => ({ ...prev, totalWealth: Math.max(0, prev.totalWealth - 50000) }));
    }
  };

  const handleAddNewRacket = (newRacket: RacketNode) => {
    setRackets((prev) => [newRacket, ...prev]);
    setSelectedNode(newRacket);
    setAlerts((prev) => [
      {
        id: `alert-add-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        speaker: 'Vincenzo Surveyor',
        message: `New syndicate front registered at coordinates: [${newRacket.lat.toFixed(4)}, ${newRacket.lng.toFixed(4)}]`,
        severity: 'intel',
      },
      ...prev.slice(0, 7),
    ]);
  };

  const currentRegionNodes = rackets.filter((n) => n.region === currentRegion);

  return (
    <div className="flex h-screen w-screen bg-[#F4F1EA] text-[#1C191E] overflow-hidden select-none">
      
      {/* 1. FAR LEFT VERTICAL ICON RAIL (Matches vertical rail in reference image) */}
      <LeftIconRail
        activeTab={activeNavTab}
        onSelectTab={setActiveNavTab}
      />

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        
        {/* Google Maps Quota Warning Banner */}
        {isQuotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm shrink-0">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}

        {/* Top Header Bar (Empire Overview, Mansoura & Dynamic Cities, Add City with Icon Picker) */}
        <TopHeaderBar
          currentRegion={currentRegion}
          sectors={sectors}
          onSelectSector={handleSelectSector}
          onAddSector={handleAddSector}
          onDeleteSector={handleDeleteSector}
          financials={financials}
          alerts={alerts}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
          onOpenHierarchy={() => setIsHierarchyModalOpen(true)}
        />

        {/* WORKSPACE: Wide Map directly next to left rail, 3 cards side-by-side below map, and roster on right */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          
          {/* MAIN CANVAS & BOTTOM STRATEGIC WINDOWS */}
          <main className="flex-1 flex flex-col min-w-0 p-3 h-full overflow-hidden gap-2.5">
            {/* WIDE TACTICAL MAP: Takes the old place of the left panel, now directly next to sidebar */}
            <div className="flex-1 w-full min-h-[320px] flex flex-col overflow-hidden">
              <TacticalMapCanvas
                region={currentRegion}
                sectors={sectors}
                nodes={currentRegionNodes}
                allRackets={rackets}
                selectedNode={selectedNode}
                onSelectNode={(node) => setSelectedNode(node)}
                onLaunchOperation={handleOpenLaunchModal}
                filterRingCategory={selectedRingFilter}
                onAddNewRacket={handleAddNewRacket}
                onSelectRegion={handleSelectRegion}
              />
            </div>

            {/* THE 3 STRATEGIC WINDOWS SIDE-BY-SIDE IN THE BOTTOM */}
            <div className="w-full shrink-0">
              <StrategicRacketsPanel
                marketTargets={marketTargets}
                onUpdateMarketTarget={(updatedTarget) => {
                  setMarketTargets(prev => prev.map(t => t.id === updatedTarget.id ? updatedTarget : t));
                }}
                opportunities={opportunities}
                onAddOpportunity={(newOpp) => {
                  setOpportunities(prev => [newOpp, ...prev]);
                }}
                onUpdateOpportunity={(updatedOpp) => {
                  setOpportunities(prev => prev.map(o => o.id === updatedOpp.id ? updatedOpp : o));
                }}
                onDeleteOpportunity={(oppId) => {
                  setOpportunities(prev => prev.filter(o => o.id !== oppId));
                }}
                financialTransactions={financialTransactions}
                onAddTransaction={(newTx) => {
                  setFinancialTransactions(prev => [newTx, ...prev]);
                }}
                onDeleteTransaction={(txId) => {
                  setFinancialTransactions(prev => prev.filter(t => t.id !== txId));
                }}
              />
            </div>
          </main>

          {/* RIGHT COLUMN: Executive Hierarchy Tree & Member Profiles */}
          <ExecutiveRosterPanel
            hierarchyNodes={hierarchyNodes}
            onOpenHierarchyTree={() => setIsHierarchyModalOpen(true)}
            relationships={relationships}
            onSelectRelationship={(rel) => {
              setSelectedRelationship(rel);
              setIsRelationshipCreateMode(false);
              setIsRelationshipModalOpen(true);
            }}
            onOpenAddRelationship={() => {
              setSelectedRelationship(null);
              setIsRelationshipCreateMode(true);
              setIsRelationshipModalOpen(true);
            }}
            onOpenAllRelationships={() => {
              if (relationships.length > 0) {
                setSelectedRelationship(relationships[0]);
                setIsRelationshipCreateMode(false);
              } else {
                setSelectedRelationship(null);
                setIsRelationshipCreateMode(true);
              }
              setIsRelationshipModalOpen(true);
            }}
          />

        </div>

      </div>

      {/* MODALS */}
      <DispatchModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        targetNode={dispatchTargetNode}
        roster={roster}
        initialOperationType={dispatchOpType}
        preSelectedMember={dispatchPreSelectedMember}
        onConfirmDispatch={handleConfirmDispatch}
      />

      {/* Window 4 Modal: Organizational Hierarchy for Business Process Architecture */}
      <HierarchyModal
        isOpen={isHierarchyModalOpen}
        onClose={() => setIsHierarchyModalOpen(false)}
        nodes={hierarchyNodes}
        onAddNode={(newNode) => setHierarchyNodes(prev => [...prev, newNode])}
        onUpdateNode={(updatedNode) => setHierarchyNodes(prev => prev.map(n => n.id === updatedNode.id ? updatedNode : n))}
        onDeleteNode={(nodeId) => setHierarchyNodes(prev => prev.filter(n => n.id !== nodeId))}
      />

      {/* Window 5 Modal: Member Profiles & Business Relationship Dossier */}
      <MemberModal
        isOpen={isRelationshipModalOpen}
        onClose={() => setIsRelationshipModalOpen(false)}
        contact={selectedRelationship}
        isCreateMode={isRelationshipCreateMode}
        onAddContact={(newContact) => {
          setRelationships(prev => [newContact, ...prev]);
          setSelectedRelationship(newContact);
        }}
        onUpdateContact={(updatedContact) => {
          setRelationships(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
          setSelectedRelationship(updatedContact);
        }}
        onDeleteContact={(contactId) => {
          setRelationships(prev => prev.filter(c => c.id !== contactId));
          setSelectedRelationship(null);
        }}
      />

    </div>
  );
}

