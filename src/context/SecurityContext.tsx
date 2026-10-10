import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Asset, 
  Scan, 
  Finding, 
  ActivityEvent, 
  FindingStatus, 
  Severity, 
  ScanProfile 
} from '../types/security';
import { INITIAL_ASSETS } from '../data/initialAssets';
import { INITIAL_FINDINGS } from '../data/initialFindings';
import { INITIAL_SCANS } from '../data/initialScans';

const ASSETS_STORAGE_KEY = 'codered_assets_v1';
const SCANS_STORAGE_KEY = 'codered_scans_v1';
const FINDINGS_STORAGE_KEY = 'codered_findings_v1';
const EVENTS_STORAGE_KEY = 'codered_events_v1';

interface SecurityContextType {
  assets: Asset[];
  scans: Scan[];
  findings: Finding[];
  events: ActivityEvent[];
  activeScan: Scan | null;
  activeScanProgress: { stage: string; percent: number; checksCompleted: number; totalChecks: number } | null;
  addAsset: (assetData: Omit<Asset, 'id' | 'createdAt' | 'status'>) => Asset;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  archiveAsset: (id: string) => void;
  startAssessment: (assetId: string, profile: ScanProfile, notes?: string) => Scan;
  cancelAssessment: (scanId: string) => void;
  updateFindingStatus: (findingId: string, status: FindingStatus, note?: string) => void;
  assignFindingOwner: (findingId: string, owner: string) => void;
  addFindingNote: (findingId: string, text: string) => void;
  importScanResults: (scan: Scan, newFindings: Finding[]) => void;
  resetToDemoData: () => void;
  logActivityEvent: (type: ActivityEvent['type'], title: string, description: string, severity?: Severity, assetName?: string) => void;
  metrics: {
    assetsAssessed: number;
    completedAssessments: number;
    openFindings: number;
    criticalHighCount: number;
    severityDistribution: Record<Severity, number>;
    statusDistribution: Record<FindingStatus, number>;
  };
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

const INITIAL_EVENTS: ActivityEvent[] = [
  {
    id: 'evt-01',
    timestamp: '2026-10-08T16:18:15Z',
    type: 'ASSESSMENT_COMPLETED',
    title: 'Assessment Finished',
    description: 'API Security assessment completed for api-sandbox.example with 2 findings identified.',
    severity: 'LOW',
    assetName: 'api-sandbox.example'
  },
  {
    id: 'evt-02',
    timestamp: '2026-10-06T14:20:00Z',
    type: 'FINDING_STATUS_CHANGED',
    title: 'Finding Remediated',
    description: 'Session Cookie Missing SameSite and Secure Flags marked as FIXED by Auth Platform Team.',
    severity: 'MEDIUM',
    assetName: 'staging-portal.example'
  },
  {
    id: 'evt-03',
    timestamp: '2026-10-05T09:51:30Z',
    type: 'ASSESSMENT_COMPLETED',
    title: 'Assessment Finished',
    description: 'Security Configuration Review completed for staging-portal.example with 2 findings.',
    severity: 'MEDIUM',
    assetName: 'staging-portal.example'
  },
  {
    id: 'evt-04',
    timestamp: '2026-10-02T14:36:20Z',
    type: 'ASSESSMENT_COMPLETED',
    title: 'Critical Weakness Identified',
    description: 'Passive Web Assessment detected SSRF on demo-store.example.',
    severity: 'CRITICAL',
    assetName: 'demo-store.example'
  }
];

export const SecurityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>(() => {
    try {
      const stored = localStorage.getItem(ASSETS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_ASSETS;
    } catch {
      return INITIAL_ASSETS;
    }
  });

  const [scans, setScans] = useState<Scan[]>(() => {
    try {
      const stored = localStorage.getItem(SCANS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_SCANS;
    } catch {
      return INITIAL_SCANS;
    }
  });

  const [findings, setFindings] = useState<Finding[]>(() => {
    try {
      const stored = localStorage.getItem(FINDINGS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_FINDINGS;
    } catch {
      return INITIAL_FINDINGS;
    }
  });

  const [events, setEvents] = useState<ActivityEvent[]>(() => {
    try {
      const stored = localStorage.getItem(EVENTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [activeScan, setActiveScan] = useState<Scan | null>(null);
  const [activeScanProgress, setActiveScanProgress] = useState<{
    stage: string;
    percent: number;
    checksCompleted: number;
    totalChecks: number;
  } | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(assets));
    } catch {}
  }, [assets]);

  useEffect(() => {
    try {
      localStorage.setItem(SCANS_STORAGE_KEY, JSON.stringify(scans));
    } catch {}
  }, [scans]);

  useEffect(() => {
    try {
      localStorage.setItem(FINDINGS_STORAGE_KEY, JSON.stringify(findings));
    } catch {}
  }, [findings]);

  useEffect(() => {
    try {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    } catch {}
  }, [events]);

  const logActivityEvent = (
    type: ActivityEvent['type'],
    title: string,
    description: string,
    severity?: Severity,
    assetName?: string
  ) => {
    const newEvent: ActivityEvent = {
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      type,
      title,
      description,
      severity,
      assetName
    };
    setEvents(prev => [newEvent, ...prev.slice(0, 49)]);
  };

  const addAsset = (assetData: Omit<Asset, 'id' | 'createdAt' | 'status'>): Asset => {
    const newAsset: Asset = {
      ...assetData,
      id: `asset-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'ACTIVE'
    };
    setAssets(prev => [newAsset, ...prev]);
    logActivityEvent('ASSET_CREATED', 'Asset Enrolled', `Asset ${newAsset.name} enrolled under ${newAsset.environment} scope.`, undefined, newAsset.name);
    return newAsset;
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const archiveAsset = (id: string) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, status: 'ARCHIVED' } : a));
  };

  const updateFindingStatus = (findingId: string, status: FindingStatus, note?: string) => {
    setFindings(prev => prev.map(f => {
      if (f.id === findingId) {
        const updatedNotes = note ? [
          ...(f.notes || []),
          {
            id: `note-${Date.now()}`,
            author: 'Security Analyst',
            timestamp: new Date().toISOString(),
            text: note
          }
        ] : f.notes;

        logActivityEvent(
          'FINDING_STATUS_CHANGED',
          `Status changed to ${status.replace('_', ' ')}`,
          `Finding "${f.title}" marked as ${status.replace('_', ' ')}.`,
          f.severity,
          f.assetName
        );

        return { ...f, status, notes: updatedNotes };
      }
      return f;
    }));
  };

  const assignFindingOwner = (findingId: string, owner: string) => {
    setFindings(prev => prev.map(f => f.id === findingId ? { ...f, assignedOwner: owner } : f));
  };

  const addFindingNote = (findingId: string, text: string) => {
    setFindings(prev => prev.map(f => {
      if (f.id === findingId) {
        const newNote = {
          id: `note-${Date.now()}`,
          author: 'Security Team Member',
          timestamp: new Date().toISOString(),
          text
        };
        return {
          ...f,
          notes: [...(f.notes || []), newNote]
        };
      }
      return f;
    }));
  };

  const startAssessment = (assetId: string, profile: ScanProfile, notes?: string): Scan => {
    const targetAsset = assets.find(a => a.id === assetId) || {
      id: assetId,
      name: 'Custom Target',
      targetUrl: 'https://example.com',
      environment: 'PRODUCTION' as const
    };

    const scanId = `scan-${Date.now()}`;
    const totalChecks = profile === 'PASSIVE_WEB' ? 44 : profile === 'SECURITY_CONFIG' ? 56 : profile === 'API_SECURITY' ? 62 : 38;

    const newScan: Scan = {
      id: scanId,
      assetId: targetAsset.id,
      assetName: targetAsset.name,
      targetUrl: targetAsset.targetUrl,
      profile,
      environment: targetAsset.environment,
      status: 'RUNNING',
      startedAt: new Date().toISOString(),
      checksCompleted: 0,
      totalChecks,
      currentStage: 'Validating scope & permissions',
      findingsCount: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        informational: 0,
        total: 0
      },
      isDemo: true,
      notes
    };

    setActiveScan(newScan);
    setScans(prev => [newScan, ...prev]);

    // Simulated assessment progression across genuine lifecycle stages
    const stages = [
      { name: '1. Validating asset authorization & target DNS reachability', pct: 15, checks: Math.floor(totalChecks * 0.15) },
      { name: '2. Probing TLS protocol handshake & certificate chain', pct: 35, checks: Math.floor(totalChecks * 0.35) },
      { name: '3. Inspecting HTTP security headers & cookie policies', pct: 60, checks: Math.floor(totalChecks * 0.6) },
      { name: '4. Evaluating CORS policies & safe diagnostic endpoints', pct: 85, checks: Math.floor(totalChecks * 0.85) },
      { name: '5. Normalizing findings & synthesizing remediation roadmap', pct: 100, checks: totalChecks }
    ];

    let currentStageIndex = 0;

    const interval = setInterval(() => {
      if (currentStageIndex < stages.length) {
        const step = stages[currentStageIndex];
        setActiveScanProgress({
          stage: step.name,
          percent: step.pct,
          checksCompleted: step.checks,
          totalChecks
        });

        setActiveScan(prev => prev ? {
          ...prev,
          currentStage: step.name,
          checksCompleted: step.checks
        } : null);

        currentStageIndex++;
      } else {
        clearInterval(interval);
        // Completed scan
        const completedTimestamp = new Date().toISOString();
        
        // Generate simulated findings for this assessment
        const generatedFinding: Finding = {
          id: `FND-${Date.now().toString().slice(-4)}`,
          scanId,
          assetId: targetAsset.id,
          assetName: targetAsset.name,
          title: profile === 'API_SECURITY' 
            ? 'API Response Discloses Internal Microservice Telemetry' 
            : profile === 'SECURITY_CONFIG' 
              ? 'Permissions-Policy Header Missing on Key Authentication Routes' 
              : 'Strict-Transport-Security Header Max-Age Lower Than Recommended 1 Year',
          severity: profile === 'API_SECURITY' ? 'MEDIUM' : profile === 'SECURITY_CONFIG' ? 'LOW' : 'LOW',
          confidence: 'HIGH',
          status: 'OPEN',
          category: profile === 'API_SECURITY' ? 'Information Disclosure' : 'Security Headers',
          affectedEndpoint: `${targetAsset.targetUrl}/api/health`,
          firstDetected: completedTimestamp,
          lastObserved: completedTimestamp,
          businessImpact: 'Reduces defense-in-depth posture against browser-based manipulation.',
          technicalImpact: 'Fails security baseline benchmarks recommended by OWASP Secure Headers guide.',
          evidence: 'Response from target endpoint omitted required header attributes during passive validation.',
          detectionMethod: 'Passive configuration inspection.',
          remediationSummary: 'Configure the API gateway or reverse proxy to include standard defensive HTTP response headers.',
          remediationSteps: [
            'Update edge proxy configuration with standard header policy.',
            'Verify header propagation using automated integration check.'
          ],
          verificationCriteria: [
            'Execute curl -I against target; verify presence of designated header with compliant attributes.'
          ],
          cweIds: ['CWE-693'],
          owaspCategory: 'A05:2021-Security Misconfiguration',
          cvssScore: 4.2,
          assignedOwner: 'Unassigned',
          isDemo: true
        };

        const updatedFindings = [generatedFinding];

        setFindings(prev => [generatedFinding, ...prev]);

        setScans(prev => prev.map(s => {
          if (s.id === scanId) {
            return {
              ...s,
              status: 'COMPLETED',
              completedAt: completedTimestamp,
              durationSeconds: 15,
              checksCompleted: totalChecks,
              currentStage: 'Assessment Complete',
              findingsCount: {
                critical: 0,
                high: 0,
                medium: generatedFinding.severity === 'MEDIUM' ? 1 : 0,
                low: generatedFinding.severity === 'LOW' ? 1 : 0,
                informational: 0,
                total: 1
              }
            };
          }
          return s;
        }));

        setAssets(prev => prev.map(a => {
          if (a.id === targetAsset.id) {
            return {
              ...a,
              lastAssessmentId: scanId,
              lastAssessmentDate: completedTimestamp
            };
          }
          return a;
        }));

        setActiveScan(null);
        setActiveScanProgress(null);

        logActivityEvent(
          'ASSESSMENT_COMPLETED',
          'Assessment Completed',
          `${profile.replace('_', ' ')} assessment on ${targetAsset.name} concluded with ${updatedFindings.length} finding.`,
          generatedFinding.severity,
          targetAsset.name
        );
      }
    }, 2200);

    return newScan;
  };

  const cancelAssessment = (scanId: string) => {
    setActiveScan(null);
    setActiveScanProgress(null);
    setScans(prev => prev.map(s => s.id === scanId ? { ...s, status: 'CANCELLED', currentStage: 'Cancelled by operator' } : s));
  };

  const importScanResults = (newScan: Scan, newFindings: Finding[]) => {
    setScans(prev => [newScan, ...prev]);
    if (newFindings.length > 0) {
      setFindings(prev => [...newFindings, ...prev]);
    }
    logActivityEvent(
      'ASSESSMENT_COMPLETED',
      'Scan Assessment Complete',
      `${newScan.profile.replace('_', ' ')} on ${newScan.assetName} finished with ${newFindings.length} finding(s).`,
      newFindings[0]?.severity,
      newScan.assetName
    );
  };

  const resetToDemoData = () => {
    setAssets(INITIAL_ASSETS);
    setScans(INITIAL_SCANS);
    setFindings(INITIAL_FINDINGS);
    setEvents(INITIAL_EVENTS);
    setActiveScan(null);
    setActiveScanProgress(null);
    try {
      localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(INITIAL_ASSETS));
      localStorage.setItem(SCANS_STORAGE_KEY, JSON.stringify(INITIAL_SCANS));
      localStorage.setItem(FINDINGS_STORAGE_KEY, JSON.stringify(INITIAL_FINDINGS));
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
    } catch {}
  };

  // Synchronized metrics
  const metrics = useMemo(() => {
    const assetsAssessed = assets.filter(a => a.status === 'ACTIVE').length;
    const completedAssessments = scans.filter(s => s.status === 'COMPLETED').length;
    const openFindings = findings.filter(f => f.status === 'OPEN' || f.status === 'IN_PROGRESS' || f.status === 'RETEST_REQUIRED').length;
    const criticalHighCount = findings.filter(f => (f.severity === 'CRITICAL' || f.severity === 'HIGH') && f.status !== 'FIXED' && f.status !== 'FALSE_POSITIVE').length;

    const severityDistribution: Record<Severity, number> = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
      INFORMATIONAL: 0
    };

    const statusDistribution: Record<FindingStatus, number> = {
      OPEN: 0,
      IN_PROGRESS: 0,
      FIXED: 0,
      ACCEPTED_RISK: 0,
      RETEST_REQUIRED: 0,
      FALSE_POSITIVE: 0
    };

    findings.forEach(f => {
      severityDistribution[f.severity] = (severityDistribution[f.severity] || 0) + 1;
      statusDistribution[f.status] = (statusDistribution[f.status] || 0) + 1;
    });

    return {
      assetsAssessed,
      completedAssessments,
      openFindings,
      criticalHighCount,
      severityDistribution,
      statusDistribution
    };
  }, [assets, scans, findings]);

  return (
    <SecurityContext.Provider value={{
      assets,
      scans,
      findings,
      events,
      activeScan,
      activeScanProgress,
      addAsset,
      updateAsset,
      archiveAsset,
      startAssessment,
      cancelAssessment,
      updateFindingStatus,
      assignFindingOwner,
      addFindingNote,
      importScanResults,
      resetToDemoData,
      logActivityEvent,
      metrics
    }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
