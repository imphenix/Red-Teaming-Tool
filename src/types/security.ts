export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';

export type FindingStatus = 
  | 'OPEN' 
  | 'IN_PROGRESS' 
  | 'FIXED' 
  | 'ACCEPTED_RISK' 
  | 'RETEST_REQUIRED' 
  | 'FALSE_POSITIVE';

export type Confidence = 'HIGH' | 'MEDIUM' | 'LOW';

export type Environment = 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT';

export type ScanProfile = 
  | 'PASSIVE_WEB' 
  | 'SECURITY_CONFIG' 
  | 'API_SECURITY' 
  | 'DEMO_ASSESSMENT'
  | 'FILE_STATIC_ANALYSIS'
  | 'URL_TARGET_SCAN';

export type ScanStatus = 
  | 'QUEUED' 
  | 'RUNNING' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'CANCELLED';

export interface Asset {
  id: string;
  name: string;
  targetUrl: string;
  environment: Environment;
  description: string;
  authorizedBy: string;
  authorizedAt: string;
  createdAt: string;
  status: 'ACTIVE' | 'ARCHIVED';
  lastAssessmentId?: string;
  lastAssessmentDate?: string;
}

export interface Finding {
  id: string;
  scanId: string;
  assetId: string;
  assetName: string;
  title: string;
  severity: Severity;
  confidence: Confidence;
  status: FindingStatus;
  category: string;
  affectedEndpoint: string;
  firstDetected: string;
  lastObserved: string;
  businessImpact: string;
  technicalImpact: string;
  evidence: string;
  detectionMethod: string;
  remediationSummary: string;
  remediationSteps: string[];
  verificationCriteria: string[];
  cweIds: string[];
  owaspCategory?: string;
  cvssScore?: number;
  assignedOwner?: string;
  notes?: { id: string; author: string; timestamp: string; text: string }[];
  isDemo?: boolean;
  codeSnippet?: string;
  lineNumber?: number;
  simulatedAttackVector?: string;
  solutionPatch?: string;
  kaliToolUsed?: string;
  kaliCommand?: string;
  attackPayload?: string;
  attackSimulationResult?: 'EXPLOIT_VERIFIED' | 'DEFENDED' | 'PARTIALLY_VULNERABLE';
  attackOutputLog?: string;
  retestVerificationCommand?: string;
}

export interface Scan {
  id: string;
  assetId: string;
  assetName: string;
  targetUrl: string;
  profile: ScanProfile;
  environment: Environment;
  status: ScanStatus;
  startedAt: string;
  completedAt?: string;
  durationSeconds?: number;
  checksCompleted: number;
  totalChecks: number;
  currentStage: string;
  findingsCount: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    informational: number;
    total: number;
  };
  isDemo: boolean;
  notes?: string;
  fileName?: string;
}


export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: 'ASSESSMENT_COMPLETED' | 'FINDING_STATUS_CHANGED' | 'ASSET_CREATED' | 'REPORT_GENERATED';
  title: string;
  description: string;
  severity?: Severity;
  assetName?: string;
}

export interface VulnerabilityKnowledgeItem {
  id: string;
  name: string;
  slug: string;
  category: 'Web & Application' | 'Critical Risk Categories' | 'Software & Malware Threats';
  severity: Severity;
  shortDescription: string;
  whatItTargets: string;
  whyItMatters: string;
  businessImpact: string;
  technicalImpact: string;
  remediation: string;
  prevention: string;
  detectionApproach: string;
  references: { title: string; url: string }[];
  cweIds: string[];
  owaspReferences?: string[];
  defaultCvssScore?: number;
  cvssRationale?: string;
  tags: string[];
  lastReviewed: string;
  remediationChecklist: string[];
  verificationChecklist: string[];
}
