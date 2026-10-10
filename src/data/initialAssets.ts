import { Asset } from '../types/security';

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'asset-01',
    name: 'demo-store.example',
    targetUrl: 'https://demo-store.example',
    environment: 'PRODUCTION',
    description: 'Customer checkout gateway, public storefront, and payment processing endpoints.',
    authorizedBy: 'security-admin@demo.corp',
    authorizedAt: '2026-09-01T08:00:00Z',
    createdAt: '2026-09-01T08:00:00Z',
    status: 'ACTIVE',
    lastAssessmentId: 'scan-101',
    lastAssessmentDate: '2026-10-02T14:30:00Z'
  },
  {
    id: 'asset-02',
    name: 'staging-portal.example',
    targetUrl: 'https://staging-portal.example',
    environment: 'STAGING',
    description: 'Pre-production customer dashboard, profile management, and document exchange.',
    authorizedBy: 'devsecops-lead@demo.corp',
    authorizedAt: '2026-09-10T10:15:00Z',
    createdAt: '2026-09-10T10:15:00Z',
    status: 'ACTIVE',
    lastAssessmentId: 'scan-102',
    lastAssessmentDate: '2026-10-05T09:45:00Z'
  },
  {
    id: 'asset-03',
    name: 'api-sandbox.example',
    targetUrl: 'https://api-sandbox.example',
    environment: 'DEVELOPMENT',
    description: 'REST and GraphQL services API gateway for partner integration testing.',
    authorizedBy: 'api-architect@demo.corp',
    authorizedAt: '2026-09-15T11:20:00Z',
    createdAt: '2026-09-15T11:20:00Z',
    status: 'ACTIVE',
    lastAssessmentId: 'scan-103',
    lastAssessmentDate: '2026-10-08T16:10:00Z'
  }
];
