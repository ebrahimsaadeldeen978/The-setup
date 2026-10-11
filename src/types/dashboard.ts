/**
 * Core Types for Don's View Empire Operations Command
 */

export type TerritoryRegion = string;

export type SectorIconType = 
  | 'Building' 
  | 'Landmark' 
  | 'Palmtree' 
  | 'Crown' 
  | 'Shield' 
  | 'Star' 
  | 'Anchor' 
  | 'Navigation' 
  | 'Compass' 
  | 'Crosshair';

export interface CitySector {
  id: string;
  name: string;
  lat: number;
  lng: number;
  zoom: number;
  iconName: SectorIconType;
}

export type RacketType = 
  | 'Warehouse' 
  | 'Diner' 
  | 'Chop Shop' 
  | 'Shipping Docks' 
  | 'Casino' 
  | 'Armory' 
  | 'Smuggling Depot' 
  | 'Extortion Front';

export type OwnershipStatus = 'owned' | 'contested' | 'rival' | 'neutral';

export interface RacketNode {
  id: string;
  name: string;
  type: RacketType;
  region: TerritoryRegion;
  x: number; // percentage coordinate 0-100 on map
  y: number; // percentage coordinate 0-100 on map
  lat: number; // Real geographic latitude
  lng: number; // Real geographic longitude
  status: OwnershipStatus;
  controllingSyndicate: string;
  hourlyIncome: number;
  defenseLevel: number; // 0 - 100
  maxDefense: number;
  guardCount: number;
  maxGuards: number;
  ringCategory: string; // e.g. "Chop Shops", "Arms Smuggling", "Gambling"
  strategicBonusText: string;
  underAttack?: boolean;
  smokeEffect?: boolean;
  assignedCapo?: string;
  lastIncident?: string;
}

export interface CrimeRing {
  id: string;
  name: string;
  category: string;
  totalVenues: number;
  ownedVenues: number;
  bonusTitle: string;
  multiplierText: string;
  bonusDescription: string;
  isUnlocked: boolean;
  iconType: string;
}

export type FamilyRank = 'Don' | 'Consigliere' | 'Underboss' | 'Caporegime' | 'Soldier';

export type MemberSpecialty = 
  | 'Demolition' 
  | 'Arson' 
  | 'Safecracker' 
  | 'Bruiser' 
  | 'Medic' 
  | 'Enforcer'
  | 'Sniper';

export interface FamilyMember {
  id: string;
  name: string;
  role: FamilyRank;
  rankTitle: string;
  avatarSeed: string;
  avatarInitials: string;
  status: 'active' | 'assigned' | 'hospitalized';
  healthPercent: number;
  assignedLocation?: string;
  assignedMission?: string;
  weapon: string;
  licenseLevel: string;
  specialties: MemberSpecialty[];
  successBonusPct: number;
  killsCount: number;
}

export interface LiveOperation {
  id: string;
  title: string;
  targetNodeId: string;
  targetNodeName: string;
  operationType: 'takeover' | 'reinforce' | 'arson_bomb' | 'extort' | 'defend';
  progressPercent: number;
  remainingSeconds: number;
  totalDurationSeconds: number;
  assignedMemberIds: string[];
  successProbability: number;
  status: 'in-progress' | 'succeeded' | 'failed';
  startedAt: string;
}

export interface ConsigliereAlert {
  id: string;
  timestamp: string;
  speaker: string;
  message: string;
  severity: 'critical' | 'warning' | 'intel' | 'financial';
}

export interface EmpireFinancials {
  totalWealth: number;
  netHourlyRevenue: number;
  territoryControlPercentage: number;
  dailyExtortionYield: number;
  activeGuardsPayroll: number;
}
