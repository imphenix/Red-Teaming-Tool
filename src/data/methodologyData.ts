export interface MethodologySection {
  title: string;
  subtitle: string;
  content: string[];
  principles?: { label: string; text: string }[];
}

export const METHODOLOGY_DOCS: MethodologySection[] = [
  {
    title: 'Core Purpose & Defensive Philosophy',
    subtitle: 'Strictly authorized, non-destructive assessment and actionable remediation.',
    content: [
      'CODE RED TOOL is an enterprise-grade defensive security assessment and vulnerability management system. Our mission is to illuminate security weaknesses, translate technical telemetry into concrete business risk, and equip software engineering teams with precise remediation instructions before adversaries exploit them.',
      'Unlike aggressive penetration testing frameworks or exploit generation suites, CODE RED TOOL strictly enforces non-destructive assessment boundaries. We never deploy weaponized payloads, corrupt databases, execute denial-of-service tests, or access unauthorized data.'
    ],
    principles: [
      {
        label: 'Explicit Authorization Requirement',
        text: 'Assessments are strictly constrained to digital assets owned by your organization or for which explicit written authorization has been granted.'
      },
      {
        label: 'Zero Exploitation Guarantee',
        text: 'All checks use safe verification probes (syntactic reflection, configuration queries, header diffing, schema inspection) rather than dangerous active exploitation.'
      },
      {
        label: 'Fix-First Prioritization',
        text: 'Every detected weakness includes verified code examples, infrastructure configuration guidelines, and clear developer verification criteria.'
      }
    ]
  },
  {
    title: 'Assessment Profiles & Supported Checks',
    subtitle: 'Transparent breakdown of what each assessment profile evaluates.',
    content: [
      'Our engine operates across four defined evaluation profiles to align with asset sensitivity and environment risk tiers.'
    ],
    principles: [
      {
        label: 'Passive Web Assessment',
        text: 'Non-intrusive evaluation of publicly exposed web tiers: HTTP response security headers (HSTS, CSP, XFO, XXP), cookie security flags (Secure, HttpOnly, SameSite), TLS certificate validity, cipher suites, DNS security records, and CORS origin policy.'
      },
      {
        label: 'Security Configuration Review',
        text: 'Deep inspection of framework configuration: error page information disclosure, stack trace leakage, directory listing indicators, outdated software headers, debug endpoint exposure, and basic redirection behaviors.'
      },
      {
        label: 'API Security Review',
        text: 'Targeted REST/GraphQL auditing when API scope is explicitly provided: schema introspection, unauthenticated documentation endpoints (Swagger/OpenAPI), object-level authorization patterns, rate limiting indicators, and HTTP method restrictions.'
      },
      {
        label: 'Deterministic Demo Assessment',
        text: 'Simulated assessment workflow designed for testing, training, and evaluation. Deterministically simulates scanning state transitions and returns labeled sample findings without network requests.'
      }
    ]
  },
  {
    title: 'Severity & Risk Scoring Model',
    subtitle: 'Objective criteria for prioritizing remediation based on technical impact and exploitability.',
    content: [
      'Severity ratings reflect both the technical consequence of an issue and the ease with which it could be abused by an unauthenticated or authenticated actor.'
    ],
    principles: [
      {
        label: 'Critical (CVSS 9.0 – 10.0)',
        text: 'Immediate risk of full infrastructure compromise, remote code execution (RCE), unauthenticated data breaches, or cloud IAM takeover. Requires immediate same-day mitigation.'
      },
      {
        label: 'High (CVSS 7.0 – 8.9)',
        text: 'Significant vulnerability allowing broken object level authorization (BOLA), stored XSS, high-impact privilege escalation, or sensitive secret exposure. Prioritize in the current sprint.'
      },
      {
        label: 'Medium (CVSS 4.0 – 6.9)',
        text: 'Issues requiring user interaction, specific preconditions, or partial impact (CSRF, permissive CORS, reflected XSS, missing session flags). Schedule for regular development cycle.'
      },
      {
        label: 'Low (CVSS 0.1 – 3.9)',
        text: 'Defense-in-depth gaps, missing hardening headers, minor information disclosure, or open redirect opportunities. Address during scheduled maintenance.'
      },
      {
        label: 'Informational (CVSS 0.0)',
        text: 'Best practice recommendations, framework version discovery, or architectural observations that pose no direct exploitable risk.'
      }
    ]
  },
  {
    title: 'Limitations of Automated Security Assessment',
    subtitle: 'Understanding what automated tools can and cannot discover.',
    content: [
      'While automated scanners provide vital continuous visibility into configuration gaps and known vulnerability patterns, they are not a replacement for human security engineering.',
      'Automated scans cannot fully discern complex multi-step business logic flaws (e.g. coupon stacking, race conditions in ledger adjustments, complex role workflows).',
      'A scan reporting "zero critical findings" does NOT certify that an application is 100% impenetrable. Security is an ongoing posture, not a single point-in-time seal.'
    ]
  },
  {
    title: 'Responsible Disclosure & Data Handling',
    subtitle: 'Protecting security telemetry and remediation workflows.',
    content: [
      'Security telemetry is sensitive corporate intellectual property. In production deployments, all assessment logs, findings, and evidence artifacts are encrypted in transit via TLS 1.3 and at rest via AES-256.',
      'Our team adheres strictly to responsible vulnerability disclosure timelines (90-day industry standard). When vulnerabilities in third-party libraries or open-source packages are discovered, upstream maintainers are notified privately prior to public discussion.'
    ]
  }
];
