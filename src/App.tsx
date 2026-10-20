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
  RelationshipContact,
  ClientKpiCircle,
  OrganizationHierarchyModel,
  LadderRoadmapModel,
  VaultRecord
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
  INITIAL_ORGANIZATION_HIERARCHY,
  INITIAL_LADDER_ROADMAP,
  INITIAL_RELATIONSHIPS,
  INITIAL_CLIENT_KPIS,
  INITIAL_VAULT_RECORDS
} from './data/mockData';

import { LeftIconRail } from './components/Navigation/LeftIconRail';
import { TopHeaderBar } from './components/Header/TopHeaderBar';
import { StrategicRacketsPanel } from './components/LeftSidebar/StrategicRacketsPanel';
import { ExecutiveRosterPanel } from './components/RightSidebar/ExecutiveRosterPanel';
import { TacticalMapCanvas } from './components/StrategyCanvas/TacticalMapCanvas';
import { DispatchModal } from './components/Modals/DispatchModal';
import { HierarchyModal } from './components/Modals/HierarchyModal';
import { MemberModal } from './components/Modals/MemberModal';
import { safeSetItem, safeGetItem, cleanupBloatedStorage } from './utils/storageUtils';

// Run cleanup once on script initialization to purge any existing oversized payloads
cleanupBloatedStorage();

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
    const saved = safeGetItem('don_market_targets');
    return saved ? JSON.parse(saved) : INITIAL_MARKET_TARGETS;
  });

  const [opportunities, setOpportunities] = useState<StrategicOpportunity[]>(() => {
    const saved = safeGetItem('don_strategic_opportunities');
    return saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
  });

  const [financialTransactions, setFinancialTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = safeGetItem('don_financial_transactions');
    return saved ? JSON.parse(saved) : INITIAL_FINANCIAL_TRANSACTIONS;
  });

  const [hierarchyNodes, setHierarchyNodes] = useState<HierarchyProcessNode[]>(() => {
    const saved = safeGetItem('don_business_hierarchy');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESS_HIERARCHY;
  });

  // 4-A. 4 Core Departments Architecture Model
  const [orgHierarchy, setOrgHierarchy] = useState<OrganizationHierarchyModel>(() => {
    const saved = safeGetItem('don_org_hierarchy');
    return saved ? JSON.parse(saved) : INITIAL_ORGANIZATION_HIERARCHY;
  });

  // 4-B. 6-Step Operational Ladder Model
  const [ladderRoadmap, setLadderRoadmap] = useState<LadderRoadmapModel>(() => {
    const saved = safeGetItem('don_ladder_roadmap');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Verify that steps have the required user titles
        if (parsed.steps && parsed.steps[0]?.title === 'P&L وهيكل الربحية') {
          return parsed;
        }
      } catch (e) {
        // Fallback to fresh initial data
      }
    }
    return INITIAL_LADDER_ROADMAP;
  });

  const [hierarchyInitialView, setHierarchyInitialView] = useState<'departments' | 'ladder'>('departments');
  const [hierarchySelectedKey, setHierarchySelectedKey] = useState<string | undefined>(undefined);

  const [relationships, setRelationships] = useState<RelationshipContact[]>(() => {
    const saved = safeGetItem('don_relationships');
    return saved ? JSON.parse(saved) : INITIAL_RELATIONSHIPS;
  });

  const [clientKpis, setClientKpis] = useState<ClientKpiCircle[]>(() => {
    const saved = safeGetItem('don_client_kpis');
    return saved ? JSON.parse(saved) : INITIAL_CLIENT_KPIS;
  });

  // Vault (الخزينة) State: 4 Uncapped Indicators with Full Chronological History
  const [vaultRecords, setVaultRecords] = useState<VaultRecord[]>(() => {
    const saved = safeGetItem('don_vault_records');
    return saved ? JSON.parse(saved) : INITIAL_VAULT_RECORDS;
  });

  // Safe LocalStorage persistence for all systems
  useEffect(() => {
    safeSetItem('don_vault_records', JSON.stringify(vaultRecords));
  }, [vaultRecords]);

  useEffect(() => {
    safeSetItem('don_market_targets', JSON.stringify(marketTargets));
  }, [marketTargets]);

  useEffect(() => {
    safeSetItem('don_strategic_opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    safeSetItem('don_financial_transactions', JSON.stringify(financialTransactions));
  }, [financialTransactions]);

  useEffect(() => {
    safeSetItem('don_business_hierarchy', JSON.stringify(hierarchyNodes));
  }, [hierarchyNodes]);

  useEffect(() => {
    safeSetItem('don_org_hierarchy', JSON.stringify(orgHierarchy));
  }, [orgHierarchy]);

  useEffect(() => {
    safeSetItem('don_ladder_roadmap', JSON.stringify(ladderRoadmap));
  }, [ladderRoadmap]);

  useEffect(() => {
    safeSetItem('don_relationships', JSON.stringify(relationships));
  }, [relationships]);

  useEffect(() => {
    safeSetItem('don_client_kpis', JSON.stringify(clientKpis));
  }, [clientKpis]);

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
        message: `تم تثبيت دبوس جديد على الخريطة: ${newRacket.name} [${newRacket.lat.toFixed(4)}, ${newRacket.lng.toFixed(4)}]`,
        severity: 'intel',
      },
      ...prev.slice(0, 7),
    ]);
  };

  const handleDeleteRacket = (nodeId: string) => {
    setRackets((prev) => prev.filter((r) => r.id !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
    setAlerts((prev) => [
      {
        id: `alert-del-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        speaker: 'Operations Command',
        message: 'تم حذف الدبوس بنجاح من الخريطة التكتيكية',
        severity: 'intel',
      },
      ...prev.slice(0, 7),
    ]);
  };

  const handleUpdateRacket = (updatedNode: RacketNode) => {
    setRackets((prev) => prev.map((r) => (r.id === updatedNode.id ? updatedNode : r)));
    setSelectedNode(updatedNode);
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
          <main className="flex-1 flex flex-col min-w-0 p-2 sm:p-2.5 h-full overflow-hidden gap-2">
            {/* WIDE TACTICAL MAP: Extended canvas height taking old left panel space directly next to sidebar */}
            <div className="flex-1 w-full min-h-[360px] flex flex-col overflow-hidden">
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
                onDeleteRacket={handleDeleteRacket}
                onUpdateRacket={handleUpdateRacket}
                onSelectRegion={handleSelectRegion}
              />
            </div>

            {/* THE 3 STRATEGIC WINDOWS SIDE-BY-SIDE IN THE BOTTOM (COMPACT & SLEEK) */}
            <div className="w-full shrink-0">
              <StrategicRacketsPanel
                vaultRecords={vaultRecords}
                onAddVaultRecord={(record) => {
                  setVaultRecords(prev => [record, ...prev]);
                }}
                onUpdateVaultRecord={(record) => {
                  setVaultRecords(prev => prev.map(r => r.id === record.id ? record : r));
                }}
                onDeleteVaultRecord={(recordId) => {
                  setVaultRecords(prev => prev.filter(r => r.id !== recordId));
                }}
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
                clientKpis={clientKpis}
                onUpdateClientKpiCircle={(updated) => {
                  setClientKpis(prev => prev.map(c => c.id === updated.id ? updated : c));
                }}
                financialTransactions={financialTransactions}
                onAddTransaction={(newTx) => {
                  setFinancialTransactions(prev => [newTx, ...prev]);
                }}
                onDeleteTransaction={(txId) => {
                  setFinancialTransactions(prev => prev.filter(t => t.id !== txId));
                }}
                selectedLocation={selectedNode}
                relationships={relationships}
                onOpenAddContact={() => {
                  setSelectedRelationship(null);
                  setIsRelationshipCreateMode(true);
                  setIsRelationshipModalOpen(true);
                }}
                onSelectRelationship={(rel) => {
                  setSelectedRelationship(rel);
                  setIsRelationshipCreateMode(false);
                  setIsRelationshipModalOpen(true);
                }}
                onOpenHierarchyTree={() => setIsHierarchyModalOpen(true)}
              />
            </div>
          </main>

          {/* RIGHT COLUMN: Executive Hierarchy Tree & Member Profiles */}
          <ExecutiveRosterPanel
            hierarchyNodes={hierarchyNodes}
            orgHierarchy={orgHierarchy}
            ladderRoadmap={ladderRoadmap}
            onOpenHierarchyTree={(view, key) => {
              setHierarchyInitialView(view || 'departments');
              setHierarchySelectedKey(key);
              setIsHierarchyModalOpen(true);
            }}
            relationships={relationships}
            selectedLocation={selectedNode}
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
            onDeleteRelationship={(contactId) => {
              setRelationships(prev => prev.filter(c => c.id !== contactId));
              if (selectedRelationship?.id === contactId) {
                setSelectedRelationship(null);
              }
            }}
          />

        </div>

      </div>

      {/* MODALS */}
      {isDispatchModalOpen && dispatchTargetNode && (
        <DispatchModal
          isOpen={isDispatchModalOpen}
          onClose={() => setIsDispatchModalOpen(false)}
          targetNode={dispatchTargetNode}
          roster={roster}
          initialOperationType={dispatchOpType}
          preSelectedMember={dispatchPreSelectedMember}
          onConfirmDispatch={handleConfirmDispatch}
        />
      )}

      {/* Window 4 Modal: Organizational Hierarchy (4 Core Departments & 6-Step Operational Ladder) */}
      {isHierarchyModalOpen && (
        <HierarchyModal
          isOpen={isHierarchyModalOpen}
          onClose={() => setIsHierarchyModalOpen(false)}
          nodes={hierarchyNodes}
          onAddNode={(newNode) => setHierarchyNodes(prev => [...prev, newNode])}
          onUpdateNode={(updatedNode) => setHierarchyNodes(prev => prev.map(n => n.id === updatedNode.id ? updatedNode : n))}
          onDeleteNode={(nodeId) => setHierarchyNodes(prev => prev.filter(n => n.id !== nodeId))}
          orgHierarchy={orgHierarchy}
          onUpdateOrgHierarchy={setOrgHierarchy}
          ladderRoadmap={ladderRoadmap}
          onUpdateLadderRoadmap={setLadderRoadmap}
          selectedLocation={selectedNode}
          initialView={hierarchyInitialView}
          initialSelectedKey={hierarchySelectedKey}
        />
      )}

      {/* Window 5 Modal: Member Profiles & Business Relationship Dossier */}
      {isRelationshipModalOpen && (
        <MemberModal
          isOpen={isRelationshipModalOpen}
          onClose={() => setIsRelationshipModalOpen(false)}
          contact={selectedRelationship}
          isCreateMode={isRelationshipCreateMode}
          selectedLocation={selectedNode}
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
      )}

    </div>
  );
}

