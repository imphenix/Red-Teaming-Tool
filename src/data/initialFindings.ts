import { Finding } from '../types/security';

export const INITIAL_FINDINGS: Finding[] = [
  {
    id: 'FND-081',
    scanId: 'scan-101',
    assetId: 'asset-01',
    assetName: 'demo-store.example',
    title: 'Server-Side Request Forgery via Invoice Webhook Parser',
    severity: 'CRITICAL',
    confidence: 'HIGH',
    status: 'OPEN',
    category: 'Injection / SSRF',
    affectedEndpoint: 'POST /api/v1/billing/webhook-subscription',
    firstDetected: '2026-10-02T14:32:00Z',
    lastObserved: '2026-10-02T14:32:00Z',
    businessImpact: 'Risk of AWS metadata extraction resulting in compromise of IAM role credentials and cloud storage access.',
    technicalImpact: 'Unrestricted HTTP request emission from the application container to RFC 1918 internal addresses and cloud metadata (169.254.169.254).',
    evidence: 'Endpoint accepted payload {"target_url": "http://169.254.169.254/latest/meta-data/"} and returned internal connection headers without schema or IP verification.',
    detectionMethod: 'Passive configuration review and safe non-destructive parameter probe on registered webhook endpoint.',
    remediationSummary: 'Restrict outbound webhook connections through an isolated egress proxy with strict IP address validation against private ranges.',
    remediationSteps: [
      'Implement DNS resolution pre-check: verify resolved IP does not fall within 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, or 169.254.0.0/16.',
      'Enforce IMDSv2 on AWS EC2 hosting environments with metadata hop limit set to 1.',
      'Deploy egress security group blocking outbound traffic to internal subnets.'
    ],
    verificationCriteria: [
      'Submit RFC 1918 and loopback targets; verify 400 Bad Request is returned.',
      'Confirm webhook client terminates connection if destination IP resolves to private CIDR.'
    ],
    cweIds: ['CWE-918'],
    owaspCategory: 'A10:2021-Server-Side Request Forgery (SSRF)',
    cvssScore: 9.3,
    assignedOwner: 'Alex Rivera (DevSecOps)',
    notes: [
      {
        id: 'n1',
        author: 'Alex Rivera',
        timestamp: '2026-10-03T09:15:00Z',
        text: 'Confirmed vulnerability in staging cluster. Working on network egress proxy filter.'
      }
    ],
    isDemo: true
  },
  {
    id: 'FND-082',
    scanId: 'scan-101',
    assetId: 'asset-01',
    assetName: 'demo-store.example',
    title: 'Broken Object Level Authorization on Order History',
    severity: 'HIGH',
    confidence: 'HIGH',
    status: 'IN_PROGRESS',
    category: 'API Security / Access Control',
    affectedEndpoint: 'GET /api/v2/orders/:orderId',
    firstDetected: '2026-10-02T14:35:00Z',
    lastObserved: '2026-10-02T14:35:00Z',
    businessImpact: 'Authenticated users can access sensitive order manifests, customer addresses, and billing totals belonging to any tenant.',
    technicalImpact: 'Controller fetches order records by ID without checking whether the requesting user token matches the order customer_id.',
    evidence: 'GET /api/v2/orders/ORD-90214 with valid token for User A successfully returned invoice for User B with 200 OK.',
    detectionMethod: 'Authorized cross-account authorization differential probe.',
    remediationSummary: 'Inject user ownership validation directly into the data query filter.',
    remediationSteps: [
      'Update database repository query to enforce WHERE id = :orderId AND organization_id = :orgId.',
      'Implement global tenant isolation interceptor in the API gateway middleware.',
      'Audit related invoice and receipt download endpoints for identical missing checks.'
    ],
    verificationCriteria: [
      'Attempt cross-tenant retrieval; verify response returns 403 Forbidden or 404 Not Found.',
      'Confirm tenant ID is derived securely from JWT claims rather than client request body.'
    ],
    cweIds: ['CWE-639', 'CWE-285'],
    owaspCategory: 'API1:2023-Broken Object Level Authorization',
    cvssScore: 8.5,
    assignedOwner: 'Dev Team Alpha',
    notes: [
      {
        id: 'n2',
        author: 'Dev Team Alpha',
        timestamp: '2026-10-04T11:00:00Z',
        text: 'PR #418 opened with tenancy scoping. Undergoing automated unit and integration tests.'
      }
    ],
    isDemo: true
  },
  {
    id: 'FND-083',
    scanId: 'scan-102',
    assetId: 'asset-02',
    assetName: 'staging-portal.example',
    title: 'Missing Content Security Policy (CSP) Directives',
    severity: 'MEDIUM',
    confidence: 'HIGH',
    status: 'OPEN',
    category: 'Security Headers',
    affectedEndpoint: 'GET https://staging-portal.example/',
    firstDetected: '2026-10-05T09:47:00Z',
    lastObserved: '2026-10-05T09:47:00Z',
    businessImpact: 'Absence of browser script execution constraints heightens exposure to cross-site scripting and unauthorized iframe framing.',
    technicalImpact: 'Browsers load scripts from arbitrary external origins and allow execution of inline scripts without cryptographic nonces or hashes.',
    evidence: 'HTTP response header Content-Security-Policy was absent in response to GET / request.',
    detectionMethod: 'Passive HTTP response header inspection.',
    remediationSummary: 'Deploy a strict Content-Security-Policy header restricting script execution to approved origins and nonces.',
    remediationSteps: [
      'Define baseline CSP: default-src \'self\'; script-src \'self\' \'nonce-{RANDOM}\'; object-src \'none\'; base-uri \'self\'.',
      'Test in report-only mode (Content-Security-Policy-Report-Only) to identify legitimate asset origins.',
      'Enforce full blocking header once telemetry shows no legitimate broken assets.'
    ],
    verificationCriteria: [
      'Inspect response headers on production root and verify presence of Content-Security-Policy.',
      'Ensure inline script tags without matching nonce are blocked by modern browsers.'
    ],
    cweIds: ['CWE-693'],
    owaspCategory: 'A05:2021-Security Misconfiguration',
    cvssScore: 5.4,
    assignedOwner: 'Frontend Ops',
    isDemo: true
  },
  {
    id: 'FND-084',
    scanId: 'scan-102',
    assetId: 'asset-02',
    assetName: 'staging-portal.example',
    title: 'Session Cookie Missing SameSite and Secure Flags',
    severity: 'MEDIUM',
    confidence: 'HIGH',
    status: 'FIXED',
    category: 'Session Management',
    affectedEndpoint: 'POST /auth/session',
    firstDetected: '2026-10-05T09:49:00Z',
    lastObserved: '2026-10-06T12:00:00Z',
    businessImpact: 'Exposes session identifiers to potential interception on unencrypted networks and increases CSRF susceptibility.',
    technicalImpact: 'Set-Cookie header for portal_session lacks Secure; SameSite attribute was set to None.',
    evidence: 'Set-Cookie: portal_session=x9a8f2...; Path=/; HttpOnly (missing Secure and SameSite=Lax).',
    detectionMethod: 'Passive cookie attribute inspection.',
    remediationSummary: 'Configure session cookie generator to enforce Secure; SameSite=Lax (or Strict).',
    remediationSteps: [
      'Update express-session or cookie middleware configuration: cookie: { secure: true, sameSite: \'lax\', httpOnly: true }.',
      'Verify reverse proxy forwards X-Forwarded-Proto: https to enable cookie Secure flag in production.'
    ],
    verificationCriteria: [
      'Confirm all issued cookies contain Secure; HttpOnly; SameSite=Lax.',
      'Verify session cookie is not transmitted over plaintext HTTP.'
    ],
    cweIds: ['CWE-614', 'CWE-1275'],
    owaspCategory: 'A07:2021-Identification and Authentication Failures',
    cvssScore: 6.1,
    assignedOwner: 'Auth Platform Team',
    notes: [
      {
        id: 'n3',
        author: 'Auth Platform Team',
        timestamp: '2026-10-06T14:20:00Z',
        text: 'Updated session cookie policy in release v2.8.2. Verified in staging environment.'
      }
    ],
    isDemo: true
  },
  {
    id: 'FND-085',
    scanId: 'scan-103',
    assetId: 'asset-03',
    assetName: 'api-sandbox.example',
    title: 'GraphQL Introspection Query Publicly Enabled',
    severity: 'LOW',
    confidence: 'HIGH',
    status: 'OPEN',
    category: 'Information Disclosure',
    affectedEndpoint: 'POST /graphql',
    firstDetected: '2026-10-08T16:12:00Z',
    lastObserved: '2026-10-08T16:12:00Z',
    businessImpact: 'Adversaries can automatically reverse-engineer the entire backend schema, unreleased mutation fields, and internal object types.',
    technicalImpact: 'Schema query __schema { types { name } } returns complete type definitions without authentication.',
    evidence: 'POST /graphql query { __schema { queryType { name } } } returned 200 OK with full schema descriptors.',
    detectionMethod: 'Passive schema query introspection check.',
    remediationSummary: 'Disable schema introspection on production and public sandbox environments.',
    remediationSteps: [
      'Set introspection: false in Apollo Server / GraphQL Yoga configuration for production builds.',
      'Restrict schema introspection to authenticated developers possessing special debug scopes.'
    ],
    verificationCriteria: [
      'Execute introspection query; verify server returns GraphQL validation error stating introspection is disabled.'
    ],
    cweIds: ['CWE-200'],
    owaspCategory: 'A05:2021-Security Misconfiguration',
    cvssScore: 4.3,
    assignedOwner: 'API Architecture Group',
    isDemo: true
  },
  {
    id: 'FND-086',
    scanId: 'scan-103',
    assetId: 'asset-03',
    assetName: 'api-sandbox.example',
    title: 'Verbose Server Stack Trace in 500 Error Responses',
    severity: 'INFORMATIONAL',
    confidence: 'HIGH',
    status: 'ACCEPTED_RISK',
    category: 'Information Disclosure',
    affectedEndpoint: 'GET /api/v1/debug/error-simulator',
    firstDetected: '2026-10-08T16:15:00Z',
    lastObserved: '2026-10-08T16:15:00Z',
    businessImpact: 'Discloses backend framework version, internal file paths, and database query libraries, facilitating reconnaissance.',
    technicalImpact: 'Error payload includes JSON stack trace with module paths (/usr/src/app/node_modules/pg/...).',
    evidence: 'Simulated runtime error returned JSON with "stack": "Error: Connection timeout at Client._handleError (/usr/src/app/...)"',
    detectionMethod: 'Error condition handling audit.',
    remediationSummary: 'Mask stack traces in production error handlers, logging full details server-side only.',
    remediationSteps: [
      'Implement global error handling middleware returning standardized error codes (e.g. { error: "Internal server error", requestId: "..." }).',
      'Ensure NODE_ENV is set to production across all runtime pods.'
    ],
    verificationCriteria: [
      'Trigger error state; verify client receives generic error message and unique tracking ID without stack details.'
    ],
    cweIds: ['CWE-209'],
    owaspCategory: 'A05:2021-Security Misconfiguration',
    cvssScore: 3.1,
    assignedOwner: 'API Architecture Group',
    notes: [
      {
        id: 'n4',
        author: 'Security Officer',
        timestamp: '2026-10-08T17:00:00Z',
        text: 'Accepted temporarily in sandbox environment for partner debugging until sandbox rebuild.'
      }
    ],
    isDemo: true
  }
];
