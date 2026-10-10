import { Scan } from '../types/security';

export const INITIAL_SCANS: Scan[] = [
  {
    id: 'scan-101',
    assetId: 'asset-01',
    assetName: 'demo-store.example',
    targetUrl: 'https://demo-store.example',
    profile: 'PASSIVE_WEB',
    environment: 'PRODUCTION',
    status: 'COMPLETED',
    startedAt: '2026-10-02T14:28:10Z',
    completedAt: '2026-10-02T14:36:20Z',
    durationSeconds: 490,
    checksCompleted: 42,
    totalChecks: 42,
    currentStage: 'Assessment Complete',
    findingsCount: {
      critical: 1,
      high: 1,
      medium: 0,
      low: 0,
      informational: 0,
      total: 2
    },
    isDemo: true,
    notes: 'Baseline passive security audit of production customer checkout domain.'
  },
  {
    id: 'scan-102',
    assetId: 'asset-02',
    assetName: 'staging-portal.example',
    targetUrl: 'https://staging-portal.example',
    profile: 'SECURITY_CONFIG',
    environment: 'STAGING',
    status: 'COMPLETED',
    startedAt: '2026-10-05T09:40:00Z',
    completedAt: '2026-10-05T09:51:30Z',
    durationSeconds: 690,
    checksCompleted: 58,
    totalChecks: 58,
    currentStage: 'Assessment Complete',
    findingsCount: {
      critical: 0,
      high: 0,
      medium: 2,
      low: 0,
      informational: 0,
      total: 2
    },
    isDemo: true,
    notes: 'Security headers, TLS configuration, and cookie posture evaluation.'
  },
  {
    id: 'scan-103',
    assetId: 'asset-03',
    assetName: 'api-sandbox.example',
    targetUrl: 'https://api-sandbox.example',
    profile: 'API_SECURITY',
    environment: 'DEVELOPMENT',
    status: 'COMPLETED',
    startedAt: '2026-10-08T16:05:00Z',
    completedAt: '2026-10-08T16:18:15Z',
    durationSeconds: 795,
    checksCompleted: 64,
    totalChecks: 64,
    currentStage: 'Assessment Complete',
    findingsCount: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 1,
      informational: 1,
      total: 2
    },
    isDemo: true,
    notes: 'Developer sandbox REST & GraphQL schema exposure audit.'
  }
];
