

export enum View {
  LOGIN = 'LOGIN', // New Entry Point
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  SIMULATION = 'SIMULATION',
  BUILDER = 'BUILDER', 
  LABS = 'LABS',
  AUDIT = 'AUDIT',
  PROFILE = 'PROFILE',
  RANK = 'RANK',
  STRESS_TEST = 'STRESS_TEST',
  PATH_SUCCESS = 'PATH_SUCCESS',
}

export enum PathId {
  SOVEREIGN = 'SOVEREIGN',
  WALLET_MASTERY = 'WALLET_MASTERY',
  PROTOCOL_ENGINEER = 'PROTOCOL_ENGINEER',
  LIGHTNING_OPERATOR = 'LIGHTNING_OPERATOR',
  SOVEREIGN_MERCHANT = 'SOVEREIGN_MERCHANT',
  SECURITY_PRACTITIONER = 'SECURITY_PRACTITIONER',
  P2P_MARKET = 'P2P_MARKET',
  COMMUNITY_BUILDER = 'COMMUNITY_BUILDER',
}

export interface Module {
  id: string;
  title: string;
  description: string;
  type: 'SIMULATION' | 'LAB';
  status: 'AVAILABLE' | 'LOCKED' | 'COMPLETED' | 'IN_PROGRESS';
  difficulty: string;
  estimatedTime: string;
  xp: number;
}

export interface Path {
  id: PathId;
  title: string;
  description: string;
  icon: string;
  activeLearners: string;
  modules: Module[];
}

export interface AppNotification {
  id: string;
  type: 'PENALTY' | 'INFO' | 'ACHIEVEMENT';
  title: string;
  message: string;
  data?: any;
}

export interface UserState {
  isGuest: boolean;
  pubkey?: string; // Hex public key
  npub?: string;   // Displayable ID
  reputation: number;
  rank: string;
  completedModules: string[];
  currentPath: PathId | null;
  streak: number;
  lastActive: string; // ISO Date String
  lastDailyClaim?: string; // ISO Date String for Daily Bonus
  notifications: AppNotification[];
}

export interface SimulationOption {
  id: string;
  label: string;
  isCorrect: boolean;
  feedback: string;
}

export interface SimulationStep {
  id: string;
  title: string;
  explanation: string;
  question?: string; 
  visualType: string;
  options: SimulationOption[];
}

export interface ModuleContent {
  id: string;
  steps: SimulationStep[];
}

// --- NEW BUILDER TYPES ---

export interface BuilderStep {
  id: string;
  title: string;
  description: string;
  
  // New Educational Fields
  conceptTitle?: string;
  conceptExplanation?: string;
  referenceCode?: string; // Example code to show the user

  initialCode: string;
  language: 'bitcoin-script' | 'json' | 'ini' | 'bash';
  validationPattern?: RegExp | string; // Regex or exact match
  validationFunction?: (code: string) => { passed: boolean; error?: string };
  hint: string;
  successMessage: string;
}

export interface BuilderContent {
  id: string;
  title: string;
  steps: BuilderStep[];
}

// Stress Test Models
export type StressEventSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface StressEvent {
  id: string;
  type: string;
  title: string;
  symptom: string; 
  rootCause: string; 
  severity: StressEventSeverity;
  decayRate: number; 
  resolved: boolean;
  timestamp: string;
}

export interface StressTestProof {
  pathId: PathId;
  sessionId: string;
  uptime: number;
  failuresResolved: number;
  competenceVerified: boolean;
}