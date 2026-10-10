import { VulnerabilityKnowledgeItem } from '../types/security';

export const VULNERABILITY_CATALOG: VulnerabilityKnowledgeItem[] = [
  // --- Category 1: Web & Application Security ---
  {
    id: 'VULN-001',
    name: 'Cross-Site Scripting (Reflected & Stored XSS)',
    slug: 'cross-site-scripting',
    category: 'Web & Application',
    severity: 'HIGH',
    shortDescription: 'Injection of malicious scripts into trusted websites that execute in victims’ browser contexts.',
    whatItTargets: 'Browser DOM, user session tokens, authentication cookies, sensitive forms.',
    whyItMatters: 'Allows adversaries to hijack authenticated sessions, deface portals, keylog input, or force users to execute unauthorized actions.',
    businessImpact: 'Account takeovers, confidential client data exfiltration, regulatory penalties (GDPR/HIPAA), brand reputation damage.',
    technicalImpact: 'Arbitrary JavaScript execution in user origin context, DOM manipulation, CSRF bypass, session cookie theft if lacking HttpOnly.',
    remediation: 'Implement contextual output encoding, adopt strict Content Security Policy (CSP), and leverage modern frameworks that auto-escape bindings.',
    prevention: 'Never trust user input rendered directly in HTML/attributes. Use textContent over innerHTML. Set cookie flags HttpOnly and SameSite=Strict.',
    detectionApproach: 'Automated DAST reflection analysis, SAST taint tracing from source to unencoded sinks, dynamic header audit.',
    references: [
      { title: 'OWASP Top 10: A03:2021 - Injection', url: 'https://owasp.org/Top10/A03_2021-Injection/' },
      { title: 'CWE-79: Cross-site Scripting', url: 'https://cwe.mitre.org/data/definitions/79.html' },
      { title: 'PortSwigger Web Security Academy: XSS', url: 'https://portswigger.net/web-security/cross-site-scripting' },
    ],
    cweIds: ['CWE-79', 'CWE-80', 'CWE-87'],
    owaspReferences: ['A03:2021-Injection'],
    defaultCvssScore: 7.5,
    cvssRationale: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:N (Scenario: reflected payload stealing auth token from active user)',
    tags: ['XSS', 'DOM', 'Injection', 'Browser Security', 'OWASP Top 10'],
    lastReviewed: '2026-09-15',
    remediationChecklist: [
      'Apply context-aware encoding (HTML body, attributes, JavaScript variables, URL params).',
      'Deploy Content-Security-Policy with strict script-src and nonces.',
      'Enforce HttpOnly flag on all session and authentication cookies.',
      'Sanitize legacy HTML rendering using DOMPurify before DOM insertion.'
    ],
    verificationChecklist: [
      'Confirm special HTML characters (<, >, ", \', &) are safely encoded on output.',
      'Verify CSP header blocks inline scripts and untrusted remote origins.',
      'Inspect cookies to ensure HttpOnly attribute is persistently set.'
    ]
  },
  {
    id: 'VULN-002',
    name: 'SQL Injection (SQLi)',
    slug: 'sql-injection',
    category: 'Web & Application',
    severity: 'CRITICAL',
    shortDescription: 'Flaw where untrusted user input is directly concatenated into dynamic database queries.',
    whatItTargets: 'Relational database engines (PostgreSQL, MySQL, Oracle, MSSQL), stored data tables.',
    whyItMatters: 'Can lead to complete extraction of the database contents, administrative authentication bypass, data destruction, and in some engines, OS command execution.',
    businessImpact: 'Massive customer data breach, total loss of data integrity, severe compliance violations, legal liability.',
    technicalImpact: 'Unauthorized read/write access to all tables, schema enumeration, stored procedure abuse, potential RCE via xp_cmdshell / COPY TO.',
    remediation: 'Use parameterized queries (prepared statements) exclusively or rely on properly configured ORM frameworks. Enforce least-privilege DB credentials.',
    prevention: 'Never use string concatenation or template literals for SQL statements. Restrict database user permissions so web app cannot alter schema.',
    detectionApproach: 'SAST source-to-sink AST analysis for unescaped query strings; passive detection of SQL error disclosures; parameterized query audits.',
    references: [
      { title: 'OWASP SQL Injection Prevention Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html' },
      { title: 'CWE-89: Improper Neutralization of Special Elements used in an SQL Command', url: 'https://cwe.mitre.org/data/definitions/89.html' }
    ],
    cweIds: ['CWE-89'],
    owaspReferences: ['A03:2021-Injection'],
    defaultCvssScore: 9.8,
    cvssRationale: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H (Scenario: unauthenticated boolean/union SQLi leaking entire user database)',
    tags: ['SQLi', 'Database', 'Injection', 'Critical', 'OWASP Top 10'],
    lastReviewed: '2026-08-20',
    remediationChecklist: [
      'Replace all dynamic SQL strings with prepared statements / parameterized bindings.',
      'Migrate database queries to parameterized repository pattern or modern ORM.',
      'Configure database user roles with strict least privilege (no DROP, GRANT, or superuser permissions).',
      'Disable detailed database error messages in production responses.'
    ],
    verificationChecklist: [
      'Verify prepared statements bind parameters separately from execution plan.',
      'Attempt parameter fuzzing to confirm query parameters are treated strictly as data literals.',
      'Audit database accounts to confirm web connections cannot access system tables.'
    ]
  },
  {
    id: 'VULN-003',
    name: 'Broken Object Level Authorization (BOLA / IDOR)',
    slug: 'broken-object-level-authorization',
    category: 'Web & Application',
    severity: 'HIGH',
    shortDescription: 'Failure to verify whether the requesting authenticated user owns or has permission to access the target object identifier.',
    whatItTargets: 'REST API endpoints, GraphQL queries, resource URLs containing sequential or enumerable IDs.',
    whyItMatters: 'Number one threat in API security. An authenticated user can read or manipulate other users’ invoices, documents, accounts, or private records simply by changing an ID.',
    businessImpact: 'Unauthorized mass data harvesting, horizontal privilege escalation, regulatory investigations, loss of client trust.',
    technicalImpact: 'Unauthorized retrieval, modification, or deletion of arbitrary tenant/user records across the database.',
    remediation: 'Implement server-side ownership checks at the data access layer. Validate requestor identity against resource ownership on every operation.',
    prevention: 'Use indirect reference maps, randomized UUID v4 identifiers, and an authorization policy middleware that executes before every DB query.',
    detectionApproach: 'Automated authorization matrix testing comparing responses between different user privileges for identical resource identifiers.',
    references: [
      { title: 'OWASP API Security Top 10: API1:2023 Broken Object Level Authorization', url: 'https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/' },
      { title: 'CWE-639: Authorization Bypass Through User-Controlled Key', url: 'https://cwe.mitre.org/data/definitions/639.html' }
    ],
    cweIds: ['CWE-639', 'CWE-285'],
    owaspReferences: ['API1:2023', 'A01:2021-Broken Access Control'],
    defaultCvssScore: 8.5,
    cvssRationale: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N (Scenario: authenticated user altering order ID to view and download all customer invoices)',
    tags: ['BOLA', 'IDOR', 'API Security', 'Authorization', 'Access Control'],
    lastReviewed: '2026-09-01',
    remediationChecklist: [
      'Ensure every controller or resolver queries records filtered by the authenticated user/tenant ID.',
      'Adopt a centralized policy enforcement point (e.g. CASL, Oso, or domain authorization guards).',
      'Replace auto-incrementing sequential integers with non-enumerable cryptographically random UUIDs.'
    ],
    verificationChecklist: [
      'Issue requests with User A authorization token targeting User B resource ID; verify 403 Forbidden is returned.',
      'Check all HTTP verbs (GET, PUT, PATCH, DELETE) for consistent ownership verification.'
    ]
  },
  {
    id: 'VULN-004',
    name: 'Cross-Site Request Forgery (CSRF)',
    slug: 'cross-site-request-forgery',
    category: 'Web & Application',
    severity: 'MEDIUM',
    shortDescription: 'Forces an authenticated end user to execute unintended actions on a web application where they are currently authenticated.',
    whatItTargets: 'State-changing endpoints (password resets, email updates, balance transfers, admin toggles).',
    whyItMatters: 'Malicious third-party sites can silently submit transactions using the victim’s ambient cookie credentials.',
    businessImpact: 'Unauthorized financial transfers, account takeover via email address replacement, unauthorized settings modification.',
    technicalImpact: 'State mutation in the target application executed with victim’s authorized session.',
    remediation: 'Enforce SameSite=Lax or SameSite=Strict on session cookies. Implement synchronized anti-CSRF tokens for all state-changing requests.',
    prevention: 'Avoid relying solely on cookies for state-changing API operations. Use custom request headers (e.g., X-CSRF-Token) verified server-side.',
    detectionApproach: 'Inspect cookie attributes; check whether state-changing POST/PUT requests succeed without origin verification or CSRF tokens.',
    references: [
      { title: 'OWASP Cross-Site Request Forgery Prevention Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html' },
      { title: 'CWE-352: Cross-Site Request Forgery', url: 'https://cwe.mitre.org/data/definitions/352.html' }
    ],
    cweIds: ['CWE-352'],
    owaspReferences: ['A01:2021-Broken Access Control'],
    defaultCvssScore: 6.5,
    cvssRationale: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:H/A:N (Scenario: victim visiting attacker site triggers password change on target app)',
    tags: ['CSRF', 'Session', 'Cookies', 'Web Security'],
    lastReviewed: '2026-07-10',
    remediationChecklist: [
      'Set SameSite=Lax (or Strict) on all session and auth cookies.',
      'Implement double-submit cookie or synchronized token pattern in application forms.',
      'Verify Origin and Referer headers against an explicit server-side allowlist.'
    ],
    verificationChecklist: [
      'Test state-changing POST requests submitted from an external test origin to verify rejection.',
      'Confirm anti-CSRF token is unique per session and regenerated upon authentication.'
    ]
  },
  {
    id: 'VULN-005',
    name: 'CORS Misconfiguration (Wildcard / Arbitrary Origin Reflection)',
    slug: 'cors-misconfiguration',
    category: 'Web & Application',
    severity: 'MEDIUM',
    shortDescription: 'Overly permissive Cross-Origin Resource Sharing headers allowing untrusted websites to read sensitive API responses.',
    whatItTargets: 'Private authenticated API responses, user profiles, internal endpoints.',
    whyItMatters: 'When Access-Control-Allow-Origin dynamically reflects the incoming Origin and sets Access-Control-Allow-Credentials: true, any external site can steal private user data.',
    businessImpact: 'Silent exfiltration of confidential customer records, financial statements, and account data via drive-by browsing.',
    technicalImpact: 'Bypasses the browser’s Same-Origin Policy (SOP), granting external domains direct read access to authenticated responses.',
    remediation: 'Do not reflect arbitrary Origin headers or use wildcard `*` with credentials enabled. Maintain a strict whitelist of trusted domains.',
    prevention: 'Configure CORS at the gateway or web server with hardcoded, audited allowed origins. Reject null origins.',
    detectionApproach: 'Send HTTP request with Origin: https://evil.example and Origin: null; verify server does not reflect the origin with credentials.',
    references: [
      { title: 'PortSwigger: Cross-origin resource sharing (CORS)', url: 'https://portswigger.net/web-security/cors' },
      { title: 'CWE-942: Permissive Cross-domain Policy with Untrusted Domains', url: 'https://cwe.mitre.org/data/definitions/942.html' }
    ],
    cweIds: ['CWE-942'],
    owaspReferences: ['A05:2021-Security Misconfiguration'],
    defaultCvssScore: 6.5,
    cvssRationale: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N (Scenario: authenticated user visiting rogue site has sensitive account payload stolen)',
    tags: ['CORS', 'API', 'Headers', 'Browser Security'],
    lastReviewed: '2026-08-11',
    remediationChecklist: [
      'Audit CORS middleware to verify Origin header is validated against an explicit whitelist.',
      'Never combine Access-Control-Allow-Origin: * with Access-Control-Allow-Credentials: true.',
      'Block "null" as an allowed origin.'
    ],
    verificationChecklist: [
      'Inspect HTTP response headers with untrusted Origin header to confirm Access-Control-Allow-Origin is not returned.',
      'Ensure preflight OPTIONS requests return appropriate restricted method and header lists.'
    ]
  },
  {
    id: 'VULN-006',
    name: 'Missing or Insecure HTTP Security Headers',
    slug: 'missing-security-headers',
    category: 'Web & Application',
    severity: 'LOW',
    shortDescription: 'Absence of baseline defensive headers such as HSTS, Content-Security-Policy, X-Content-Type-Options, and X-Frame-Options.',
    whatItTargets: 'Browser security posture, transport protocol downgrade resistance, MIME-sniffing defenses.',
    whyItMatters: 'Leaves web applications vulnerable to clickjacking, MIME type confusion attacks, protocol downgrade to plaintext HTTP, and inline script execution.',
    businessImpact: 'Lowered defense-in-depth barrier; easier exploitation of secondary XSS and clickjacking vulnerabilities.',
    technicalImpact: 'Browsers may sniff executable scripts from images, load pages inside malicious iframes, or allow cleartext connections.',
    remediation: 'Configure web servers / CDNs to send Strict-Transport-Security, X-Content-Type-Options: nosniff, X-Frame-Options: DENY, and Content-Security-Policy.',
    prevention: 'Integrate automated header linters in CI/CD pipelines (e.g. Helmet for Node, secure headers in NGINX/Caddy/Cloudflare).',
    detectionApproach: 'Passive HTTP response header analysis comparing present headers against security best practice baselines.',
    references: [
      { title: 'OWASP Secure Headers Project', url: 'https://owasp.org/www-project-secure-headers/' },
      { title: 'Mozilla Observatory Guidelines', url: 'https://infosec.mozilla.org/guidelines/web_security' }
    ],
    cweIds: ['CWE-693', 'CWE-1021'],
    owaspReferences: ['A05:2021-Security Misconfiguration'],
    defaultCvssScore: 4.3,
    cvssRationale: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:N/A:N (Scenario: missing X-Frame-Options enabling UI redress / clickjacking attacks)',
    tags: ['Headers', 'HSTS', 'CSP', 'Defensive Hardening'],
    lastReviewed: '2026-09-02',
    remediationChecklist: [
      'Add Strict-Transport-Security: max-age=31536000; includeSubDomains; preload.',
      'Add X-Content-Type-Options: nosniff.',
      'Add X-Frame-Options: DENY or CSP frame-ancestors \'none\'.',
      'Add Referrer-Policy: strict-origin-when-cross-origin.',
      'Implement baseline Content-Security-Policy.'
    ],
    verificationChecklist: [
      'Run curl -I on target domain and inspect headers.',
      'Verify HSTS preload eligibility on official browser lists.'
    ]
  },
  {
    id: 'VULN-007',
    name: 'Broken Authentication & Session Management',
    slug: 'broken-authentication',
    category: 'Web & Application',
    severity: 'HIGH',
    shortDescription: 'Weaknesses in credential verification, password reset flows, session timeout, or multi-factor authentication enforcement.',
    whatItTargets: 'User login endpoints, session tokens, password recovery mechanisms, MFA verification.',
    whyItMatters: 'Enables credential stuffing, brute force attacks, session fixation, and unauthorized access to privileged user accounts.',
    businessImpact: 'Widespread account takeover, corporate identity theft, unauthorized administrative access, audit failures.',
    technicalImpact: 'Adversary gains full authenticated privileges of compromised user without possessing the original valid credentials.',
    remediation: 'Enforce MFA, apply rate limiting and account lockout on login endpoints, implement secure session invalidation on logout and password change.',
    prevention: 'Adopt established authentication standards (OAuth 2.0 / OpenID Connect, WebAuthn/Passkeys, Argon2id password hashing).',
    detectionApproach: 'Automated brute-force resistance checks, session entropy testing, credential stuffing vulnerability audits.',
    references: [
      { title: 'OWASP Authentication Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html' },
      { title: 'CWE-287: Improper Authentication', url: 'https://cwe.mitre.org/data/definitions/287.html' }
    ],
    cweIds: ['CWE-287', 'CWE-384'],
    owaspReferences: ['A07:2021-Identification and Authentication Failures'],
    defaultCvssScore: 8.1,
    cvssRationale: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N (Scenario: unthrottled login allowing credential stuffing to compromise accounts)',
    tags: ['Authentication', 'Session', 'MFA', 'Credential Stuffing'],
    lastReviewed: '2026-08-30',
    remediationChecklist: [
      'Implement IP- and account-based adaptive rate limiting on all login and password reset routes.',
      'Hash passwords using Argon2id or bcrypt with appropriate work factor.',
      'Invalidate session tokens both client-side and server-side upon logout.',
      'Mandate multi-factor authentication (MFA) for administrative and sensitive roles.'
    ],
    verificationChecklist: [
      'Attempt 10 consecutive failed logins to verify rate limiting or temporary lockout triggers.',
      'Confirm old session cookies cannot be re-used after password changes.'
    ]
  },
  {
    id: 'VULN-008',
    name: 'JWT (JSON Web Token) Security Misconfigurations',
    slug: 'jwt-security-misconfiguration',
    category: 'Web & Application',
    severity: 'HIGH',
    shortDescription: 'Vulnerabilities in token signature validation, including accepting "alg": "none", weak HMAC secrets, or symmetric/asymmetric key confusion.',
    whatItTargets: 'Stateless API authorization filters, microservice trust boundaries.',
    whyItMatters: 'Adversaries can forge arbitrary tokens containing administrative claims, bypassing all authentication and authorization checks.',
    businessImpact: 'Immediate total authorization bypass across API services, allowing attacker to impersonate any user or admin.',
    technicalImpact: 'Server accepts forged claims without verifying cryptographic authenticity, granting unrestricted access.',
    remediation: 'Explicitly enforce the expected signature algorithm on the server, reject "none" algorithm, use 256-bit+ random secrets, or migrate to RS256/EdDSA.',
    prevention: 'Never trust the "alg" header field provided by the client. Hardcode the algorithm requirement in verification configuration.',
    detectionApproach: 'Test token validation with modified payload signed using empty algorithm, known public keys as HMAC secrets, or expired timestamps.',
    references: [
      { title: 'RFC 8725: JSON Web Token Best Current Practices', url: 'https://datatracker.ietf.org/doc/html/rfc8725' },
      { title: 'CWE-1270: Generation of Incorrect Token', url: 'https://cwe.mitre.org/data/definitions/1270.html' }
    ],
    cweIds: ['CWE-347', 'CWE-1270'],
    owaspReferences: ['A02:2021-Cryptographic Failures'],
    defaultCvssScore: 8.8,
    cvssRationale: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H (Scenario: JWT library accepting alg=none, allowing arbitrary role: admin forging)',
    tags: ['JWT', 'Cryptography', 'API Security', 'Tokens'],
    lastReviewed: '2026-09-08',
    remediationChecklist: [
      'Configure JWT verifier to strictly mandate the expected algorithm (e.g. algorithms: [\'RS256\']).',
      'Disallow the "none" algorithm completely in all environments.',
      'Enforce token expiration (exp) and issuer (iss) verification on every request.',
      'Store signing private keys securely in KMS / secrets management.'
    ],
    verificationChecklist: [
      'Send token with "alg": "none" and stripped signature; verify server returns 401 Unauthorized.',
      'Verify expired tokens are rejected.'
    ]
  },
  {
    id: 'VULN-009',
    name: 'Path Traversal & Arbitrary File Read',
    slug: 'path-traversal',
    category: 'Web & Application',
    severity: 'HIGH',
    shortDescription: 'Failure to sanitize user-supplied filenames, allowing directory traversal sequences (../) to access files outside the intended root.',
    whatItTargets: 'File download handlers, image processors, template loaders, system configuration files.',
    whyItMatters: 'Allows attackers to read application source code, environment secrets (.env), database credentials, and OS configuration (/etc/passwd).',
    businessImpact: 'Critical exposure of application secrets, cryptographic keys, and database passwords, enabling downstream attacks.',
    technicalImpact: 'Unauthorized read access to local filesystem files with web server process permissions.',
    remediation: 'Use filesystem IDs rather than raw paths. Validate that the canonical path begins with the designated base directory before reading.',
    prevention: 'Avoid passing user input to file system APIs. Use path.resolve() and verify path.startsWith(allowedBasePath). Store files in object storage (S3/GCS).',
    detectionApproach: 'DAST fuzzing of file parameters with traversal sequences and URL-encoded equivalents; SAST taint tracking.',
    references: [
      { title: 'OWASP Path Traversal', url: 'https://owasp.org/www-community/attacks/Path_Traversal' },
      { title: 'CWE-22: Improper Limitation of a Pathname to a Restricted Directory', url: 'https://cwe.mitre.org/data/definitions/22.html' }
    ],
    cweIds: ['CWE-22', 'CWE-23'],
    owaspReferences: ['A01:2021-Broken Access Control'],
    defaultCvssScore: 7.5,
    cvssRationale: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N (Scenario: unauthenticated path traversal downloading production .env secret file)',
    tags: ['Path Traversal', 'Filesystem', 'Information Disclosure'],
    lastReviewed: '2026-07-25',
    remediationChecklist: [
      'Enforce canonical path resolution and strict prefix verification.',
      'Strip traversal characters (../ and ..\\) using robust path normalization.',
      'Serve static user files from dedicated cloud object storage rather than local disk.'
    ],
    verificationChecklist: [
      'Test file download parameters with ../../../../etc/passwd and verify 400 Bad Request or 404.',
      'Inspect application logs to ensure traversal attempts are flagged and blocked.'
    ]
  },
  {
    id: 'VULN-010',
    name: 'Open URL Redirection',
    slug: 'open-redirect',
    category: 'Web & Application',
    severity: 'LOW',
    shortDescription: 'Application accepts an untrusted destination URL parameter and redirects the user without validation.',
    whatItTargets: 'Login redirect parameters, post-logout landing pages, single sign-on redirect URIs.',
    whyItMatters: 'Frequently leveraged in phishing campaigns because victims trust the legitimate company domain in the initial URL.',
    businessImpact: 'Brand impersonation, customer phishing fraud, credential harvesting using legitimate domain reputation.',
    technicalImpact: 'Browser follows 302/301 HTTP redirect to attacker-controlled phishing site.',
    remediation: 'Validate redirect targets against an explicit allowlist of relative paths or trusted company domains. Avoid open parameter redirects.',
    prevention: 'Use relative paths exclusively (e.g. starting with a single /) and reject protocol-relative URLs (//attacker.com).',
    detectionApproach: 'Automated parameter checks for returnUrl, next, redirect, redirect_uri with external target test domains.',
    references: [
      { title: 'CWE-601: URL Redirection to Untrusted Site', url: 'https://cwe.mitre.org/data/definitions/601.html' },
      { title: 'OWASP Unvalidated Redirects and Forwards', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html' }
    ],
    cweIds: ['CWE-601'],
    owaspReferences: ['A01:2021-Broken Access Control'],
    defaultCvssScore: 4.7,
    cvssRationale: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:N/I:L/A:N (Scenario: login flow redirecting to malicious clone site after valid auth)',
    tags: ['Open Redirect', 'Phishing', 'Web Security'],
    lastReviewed: '2026-08-14',
    remediationChecklist: [
      'Validate redirect URLs against an explicit internal domain whitelist.',
      'Reject URLs starting with http://, https://, or protocol-relative //.',
      'If external redirect is necessary, display an intermediate confirmation page warning the user.'
    ],
    verificationChecklist: [
      'Test ?next=https://example.org on login page; verify application redirects to default internal dashboard.'
    ]
  },

  // --- Category 2: Critical Risk Categories ---
  {
    id: 'VULN-101',
    name: 'Remote Code Execution (RCE) via Unsafe Deserialization',
    slug: 'remote-code-execution-deserialization',
    category: 'Critical Risk Categories',
    severity: 'CRITICAL',
    shortDescription: 'Flaw where untrusted binary or object data is deserialized without validation, instantiating malicious gadget chains.',
    whatItTargets: 'Java (ysoserial), Python (pickle), PHP (unserialize), Node.js (node-serialize), .NET (BinaryFormatter).',
    whyItMatters: 'Enables an adversary to execute arbitrary system commands on the host server with web application privileges.',
    businessImpact: 'Complete server compromise, persistent backdoor installation, lateral movement through corporate cloud infrastructure.',
    technicalImpact: 'Arbitrary shell command execution, reverse shell establishment, server host takeover.',
    remediation: 'Never deserialize data from untrusted sources using native language object formatters. Migrate to standard JSON, Protocol Buffers, or MessagePack.',
    prevention: 'Avoid serialization formats that allow arbitrary object instantiation. Apply cryptographic HMAC signatures if binary serialization is unavoidable.',
    detectionApproach: 'SAST detection of native deserialization calls; DAST analysis of encoded session objects and base64 parameters.',
    references: [
      { title: 'OWASP Deserialization Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html' },
      { title: 'CWE-502: Deserialization of Untrusted Data', url: 'https://cwe.mitre.org/data/definitions/502.html' }
    ],
    cweIds: ['CWE-502', 'CWE-94'],
    owaspReferences: ['A08:2021-Software and Data Integrity Failures'],
    defaultCvssScore: 9.8,
    cvssRationale: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H (Scenario: unauthenticated serialized cookie leading to reverse shell execution)',
    tags: ['RCE', 'Deserialization', 'Critical', 'Gadget Chains'],
    lastReviewed: '2026-09-12',
    remediationChecklist: [
      'Eliminate native pickle, unserialize, or Java ObjectInputStream usage on untrusted inputs.',
      'Replace custom object streams with schema-validated JSON or Protocol Buffers.',
      'Run application process in an immutable, restricted container with read-only root filesystem.'
    ],
    verificationChecklist: [
      'Confirm no endpoints accept serialized object streams.',
      'Verify container runtime security profiles (AppArmor, Seccomp) restrict process execution.'
    ]
  },
  {
    id: 'VULN-102',
    name: 'Server-Side Request Forgery (SSRF)',
    slug: 'server-side-request-forgery',
    category: 'Critical Risk Categories',
    severity: 'CRITICAL',
    shortDescription: 'Application fetches a remote resource based on user-supplied URL without validating the destination IP address or scheme.',
    whatItTargets: 'Internal microservices, AWS/GCP/Azure instance metadata services (169.254.169.254), internal Kubernetes APIs.',
    whyItMatters: 'Allows external attackers to query private internal services, steal cloud IAM credentials, and pivot inside the private network perimeter.',
    businessImpact: 'Exfiltration of cloud IAM role credentials, full cloud account takeover, compromise of internal databases behind firewall.',
    technicalImpact: 'Web server makes HTTP requests to internal IP ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.1, 169.254.169.254).',
    remediation: 'Implement strict network egress filtering. Validate resolved IP addresses against private and reserved CIDR blocks before connecting. Enforce IMDSv2.',
    prevention: 'Use dedicated egress proxy with DNS rebinding protection. Enforce hop limit on cloud metadata service and require session tokens (IMDSv2).',
    detectionApproach: 'Audit URL fetchers; test internal IP ranges, IPv6 localhost, and DNS rebinding payloads against webhook/avatar import features.',
    references: [
      { title: 'OWASP Server-Side Request Forgery Prevention Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html' },
      { title: 'CWE-918: Server-Side Request Forgery (SSRF)', url: 'https://cwe.mitre.org/data/definitions/918.html' }
    ],
    cweIds: ['CWE-918'],
    owaspReferences: ['A10:2021-Server-Side Request Forgery (SSRF)'],
    defaultCvssScore: 9.3,
    cvssRationale: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:L/A:N (Scenario: unauthenticated SSRF leaking cloud instance profile IAM keys)',
    tags: ['SSRF', 'Cloud Security', 'IAM', 'Critical'],
    lastReviewed: '2026-08-28',
    remediationChecklist: [
      'Resolve domain to IP and check that IP is not in RFC 1918, RFC 3927, or loopback ranges before initiating connection.',
      'Enforce IMDSv2 (token-based session) on all AWS EC2 instances and set hop limit to 1.',
      'Route external fetch requests through an isolated egress proxy service.'
    ],
    verificationChecklist: [
      'Submit URL http://169.254.169.254/latest/meta-data/ and verify connection is blocked.',
      'Test DNS rebinding to ensure IP is re-verified at connection establishment.'
    ]
  },
  {
    id: 'VULN-103',
    name: 'OS Command Injection',
    slug: 'os-command-injection',
    category: 'Critical Risk Categories',
    severity: 'CRITICAL',
    shortDescription: 'Application passes unsanitized user input directly to a system shell command (e.g. system(), exec(), popen()).',
    whatItTargets: 'System utility invocations (ping, curl, image conversion, PDF generation, backup scripts).',
    whyItMatters: 'Allows attackers to append arbitrary shell operators (; && | ` $) and execute shell commands with the privileges of the web application.',
    businessImpact: 'Immediate complete host compromise, unauthorized file exfiltration, destruction of system data.',
    technicalImpact: 'Arbitrary shell commands executed on underlying OS kernel, root privilege escalation potential.',
    remediation: 'Avoid calling system shell commands. Use native programming language APIs (e.g. built-in image or networking libraries) instead.',
    prevention: 'If invoking external binaries is mandatory, pass arguments as discrete arrays to execFile without invoking a shell interpreter.',
    detectionApproach: 'SAST rule tracking of command execution functions receiving untrusted inputs; DAST fuzzing of command separators.',
    references: [
      { title: 'OWASP Command Injection', url: 'https://owasp.org/www-community/attacks/Command_Injection' },
      { title: 'CWE-78: Improper Neutralization of Special Elements used in an OS Command', url: 'https://cwe.mitre.org/data/definitions/78.html' }
    ],
    cweIds: ['CWE-78'],
    owaspReferences: ['A03:2021-Injection'],
    defaultCvssScore: 9.8,
    cvssRationale: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H (Scenario: command injection via IP ping diagnostic utility parameter)',
    tags: ['Command Injection', 'RCE', 'Critical', 'Shell'],
    lastReviewed: '2026-09-05',
    remediationChecklist: [
      'Refactor system shell executions to use safe in-process runtime libraries.',
      'Pass arguments strictly via parameterized array signatures (e.g. child_process.execFile([cmd, arg1, arg2])).',
      'Drop OS execution privileges and run server in locked-down distroless container.'
    ],
    verificationChecklist: [
      'Test diagnostic parameters with ; sleep 5 ; and check for timing delays.',
      'Verify shell metacharacters are rejected at the input validation boundary.'
    ]
  },
  {
    id: 'VULN-104',
    name: 'XML External Entity (XXE) Injection',
    slug: 'xml-external-entity-injection',
    category: 'Critical Risk Categories',
    severity: 'HIGH',
    shortDescription: 'Insecurely configured XML parser processes external entity references defined inside untrusted XML documents.',
    whatItTargets: 'XML document parsers, SOAP endpoints, SAML authentication assertions, Office document processors.',
    whyItMatters: 'Can be abused to read local files, trigger SSRF attacks against internal networks, or induce server denial-of-service (Billion Laughs).',
    businessImpact: 'Confidential file disclosure, cloud metadata theft, internal infrastructure scanning.',
    technicalImpact: 'Parser expands DOCTYPE entities to local files (file:///etc/passwd) or internal HTTP endpoints.',
    remediation: 'Disable DTD processing and external entity resolution in all XML parser configurations across the codebase.',
    prevention: 'Configure XML parsers with disallow-doctype-decl = true and external-general-entities = false. Prefer JSON for API messaging.',
    detectionApproach: 'Inject harmless test entity definitions and observe whether external DNS queries or file contents are processed.',
    references: [
      { title: 'OWASP XXE Prevention Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html' },
      { title: 'CWE-611: Improper Restriction of XML External Entity Reference', url: 'https://cwe.mitre.org/data/definitions/611.html' }
    ],
    cweIds: ['CWE-611', 'CWE-827'],
    owaspReferences: ['A05:2021-Security Misconfiguration'],
    defaultCvssScore: 8.2,
    cvssRationale: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:N (Scenario: XXE via invoice upload reading /etc/hosts and initiating internal SSRF)',
    tags: ['XXE', 'XML', 'SSRF', 'File Disclosure'],
    lastReviewed: '2026-08-18',
    remediationChecklist: [
      'Disable external DTDs and entities in all XML parsers (e.g. setFeature("http://apache.org/xml/features/disallow-doctype-decl", true)).',
      'Ensure SAML libraries reject custom DOCTYPE declarations in incoming assertions.',
      'Audit document upload handlers (DOCX, SVG, XLSX) for safe XML parser settings.'
    ],
    verificationChecklist: [
      'Submit XML containing external entity declaration; verify parser returns parse error and rejects entity resolution.'
    ]
  },
  {
    id: 'VULN-105',
    name: 'Cloud Metadata & IAM Role Exposure',
    slug: 'cloud-metadata-iam-exposure',
    category: 'Critical Risk Categories',
    severity: 'CRITICAL',
    shortDescription: 'Exposing cloud provider instance metadata endpoints (169.254.169.254) to workloads or unauthenticated services.',
    whatItTargets: 'AWS EC2 metadata service, GCP metadata server, Azure Instance Metadata Service.',
    whyItMatters: 'Instance metadata services provide temporary STS security credentials for attached IAM roles. Stolen credentials grant cloud API access.',
    businessImpact: 'Takeover of cloud infrastructure, S3 bucket exfiltration, creation of unauthorized cloud instances for cryptomining.',
    technicalImpact: 'Access to security credentials, user-data startup scripts containing environment secrets, and private cloud networking details.',
    remediation: 'Enforce IMDSv2 on AWS (requiring PUT token preflight), restrict metadata network access in container runners, apply strict least privilege IAM roles.',
    prevention: 'Set metadata response hop limit to 1 so container bridges cannot access the host metadata endpoint. Block 169.254.169.254 via local iptables.',
    detectionApproach: 'Audit cloud configuration with CSPM tools; verify IMDSv1 is disabled; check container network policies.',
    references: [
      { title: 'AWS: Transitioning to IMDSv2', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html' },
      { title: 'CWE-200: Exposure of Sensitive Information to an Unauthorized Actor', url: 'https://cwe.mitre.org/data/definitions/200.html' }
    ],
    cweIds: ['CWE-200', 'CWE-552'],
    owaspReferences: ['A05:2021-Security Misconfiguration'],
    defaultCvssScore: 9.1,
    cvssRationale: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:N (Scenario: metadata credential theft granting full S3 and RDS administration)',
    tags: ['Cloud Security', 'AWS', 'IAM', 'Metadata', 'Critical'],
    lastReviewed: '2026-09-10',
    remediationChecklist: [
      'Mandate IMDSv2 on all EC2 instances via launch templates.',
      'Set metadata hop limit = 1 to prevent containers from reaching host metadata.',
      'Grant IAM roles only specific, bounded permissions with minimal cloud access.'
    ],
    verificationChecklist: [
      'Run AWS CLI describe-instances to verify HttpTokens is set to required.',
      'Verify containerized services cannot establish TCP connections to 169.254.169.254.'
    ]
  },
  {
    id: 'VULN-106',
    name: 'Dangerous File Upload & Web Shell Execution',
    slug: 'dangerous-file-upload',
    category: 'Critical Risk Categories',
    severity: 'CRITICAL',
    shortDescription: 'Application allows users to upload files without validating content type, extension, or storage location, enabling direct execution.',
    whatItTargets: 'Public web root, media directories, server-side script interpreters (PHP, ASPX, JSP).',
    whyItMatters: 'Uploading an executable script (web shell) into an executable web directory grants persistent remote command execution.',
    businessImpact: 'Complete web application compromise, permanent adversary persistence, database exfiltration.',
    technicalImpact: 'Web server executes uploaded script within the web server runtime environment.',
    remediation: 'Store uploaded files outside the web root or in dedicated object storage (S3/GCS). Disallow script execution in upload directories. Rename files to random UUIDs.',
    prevention: 'Validate file headers (magic bytes), enforce strict extension allowlists, re-encode images through server-side libraries, strip EXIF metadata.',
    detectionApproach: 'Inspect upload handlers for client-side MIME-only validation; verify uploaded files cannot be executed via direct HTTP GET.',
    references: [
      { title: 'OWASP File Upload Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html' },
      { title: 'CWE-434: Unrestricted Upload of File with Dangerous Type', url: 'https://cwe.mitre.org/data/definitions/434.html' }
    ],
    cweIds: ['CWE-434'],
    owaspReferences: ['A04:2021-Insecure Design'],
    defaultCvssScore: 9.8,
    cvssRationale: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H (Scenario: unauthenticated avatar upload allowing .php web shell execution)',
    tags: ['File Upload', 'Web Shell', 'RCE', 'Critical'],
    lastReviewed: '2026-08-16',
    remediationChecklist: [
      'Store all user-uploaded content in cloud object storage (S3/GCS) with public execution disabled.',
      'Generate a fresh UUID for the saved filename; do not preserve user-supplied names or extensions.',
      'Validate magic bytes of files and re-encode user images to neutralize embedded payloads.',
      'Serve uploaded files via a separate isolated domain (e.g. user-content.example.com).'
    ],
    verificationChecklist: [
      'Attempt uploading a test file with dual extension (.php.png); verify file is rejected or sanitized.',
      'Confirm uploaded media directory does not execute server-side scripts.'
    ]
  },

  // --- Category 3: Software & Malware Threats ---
  {
    id: 'VULN-201',
    name: 'Ransomware & Cryptoviral Extortion',
    slug: 'ransomware-cryptoviral-extortion',
    category: 'Software & Malware Threats',
    severity: 'CRITICAL',
    shortDescription: 'Malicious software that encrypts organizational files and backups, demanding payment in exchange for a decryption key.',
    whatItTargets: 'Local file servers, database volumes, cloud backups, domain controllers, attached NAS storage.',
    whyItMatters: 'One of the most disruptive cyber threats facing enterprises today. Halts operations, threatens double extortion (data leaks), and incurs immense recovery costs.',
    businessImpact: 'Operational shutdown, extortion demands, reputational catastrophe, regulatory fines for compromised client records.',
    technicalImpact: 'Symmetric/asymmetric encryption of all accessible disk volumes, shadow copy deletion, process termination of security tools.',
    remediation: 'Maintain immutable, air-gapped backups (3-2-1 rule), segment networks, deploy EDR with behavioral ransomware containment, enforce least privilege.',
    prevention: 'Disable SMBv1, enforce MFA on all remote access/VPN gateways, patch edge VPN appliances promptly, restrict local administrative privileges.',
    detectionApproach: 'Endpoint Detection and Response (EDR) heuristics monitoring rapid disk write operations, volume shadow copy deletion, and known malware hashes.',
    references: [
      { title: 'CISA: Stop Ransomware Guide', url: 'https://www.cisa.gov/stopransomware' },
      { title: 'MITRE ATT&CK: Data Encrypted for Impact (T1486)', url: 'https://attack.mitre.org/techniques/T1486/' }
    ],
    cweIds: ['CWE-400'],
    defaultCvssScore: 9.0,
    cvssRationale: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:H (Scenario: corporate ransomware deploying enterprise-wide file encryption)',
    tags: ['Ransomware', 'Malware', 'Extortion', 'EDR', 'Disaster Recovery'],
    lastReviewed: '2026-09-18',
    remediationChecklist: [
      'Establish immutable, write-once-read-many (WORM) offsite backups.',
      'Deploy enterprise EDR with real-time canary file traps and automated host isolation.',
      'Conduct regular incident response tabletop simulations for rapid containment.',
      'Disable unnecessary administrative protocols (RDP, SMB) exposed to untrusted segments.'
    ],
    verificationChecklist: [
      'Conduct scheduled restore drills from air-gapped backups to verify recovery time objectives (RTO).',
      'Audit external attack surface for exposed management ports.'
    ]
  },
  {
    id: 'VULN-202',
    name: 'Software Supply Chain Compromise & Dependency Poisoning',
    slug: 'software-supply-chain-compromise',
    category: 'Software & Malware Threats',
    severity: 'HIGH',
    shortDescription: 'Infiltration of malicious code into open-source packages, CI/CD build pipelines, or third-party vendor repositories.',
    whatItTargets: 'npm, PyPI, Maven, crates.io dependencies; GitHub Actions; build artifacts; developer workstations.',
    whyItMatters: 'Downstream applications ingest malicious packages during regular builds, executing backdoors, stealing secrets, or injecting trojans without code review.',
    businessImpact: 'Silent compromise of production environments, loss of intellectual property, distribution of tainted software to enterprise customers.',
    technicalImpact: 'Malicious post-install scripts harvest developer credentials, deploy reverse shells, or backdoor production binaries.',
    remediation: 'Pin exact package versions with lockfiles and hash verification. Implement automated Software Bill of Materials (SBOM) and dependency scanning.',
    prevention: 'Enforce package signing, restrict build runners’ outbound network access, use private repository proxies with automated vulnerability scanning.',
    detectionApproach: 'SCA (Software Composition Analysis) scanning, lockfile diff review, automated detection of typosquatting or anomalous maintainer changes.',
    references: [
      { title: 'NIST: Cybersecurity Supply Chain Risk Management Practices', url: 'https://csrc.nist.gov/publications/detail/sp/800-161/rev-1/final' },
      { title: 'MITRE ATT&CK: Supply Chain Compromise (T1195)', url: 'https://attack.mitre.org/techniques/T1195/' }
    ],
    cweIds: ['CWE-1357', 'CWE-829'],
    owaspReferences: ['A06:2021-Vulnerable and Outdated Components'],
    defaultCvssScore: 8.8,
    cvssRationale: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H (Scenario: compromised popular npm utility executing backdoor in production container)',
    tags: ['Supply Chain', 'Dependencies', 'SCA', 'SBOM', 'npm'],
    lastReviewed: '2026-09-14',
    remediationChecklist: [
      'Mandate lockfile integrity verification (e.g. npm ci with package-lock.json).',
      'Integrate automated SCA vulnerability scanners into CI/CD build gates.',
      'Generate and continuously audit Software Bill of Materials (SBOM) in CycloneDX/SPDX format.',
      'Enforce two-factor authentication and signed commits for all repository contributors.'
    ],
    verificationChecklist: [
      'Check CI build logs to confirm dependencies are pinned and checksums are verified.',
      'Verify build jobs run with minimal required GitHub token permissions.'
    ]
  },
  {
    id: 'VULN-203',
    name: 'Trojan Horses & Remote Access Trojans (RATs)',
    slug: 'trojan-horses-remote-access-trojans',
    category: 'Software & Malware Threats',
    severity: 'HIGH',
    shortDescription: 'Malware disguised as legitimate software that establishes persistent covert remote control for an attacker.',
    whatItTargets: 'Employee endpoints, developer machines, IT administrator management stations.',
    whyItMatters: 'Enables interactive surveillance, microphone/screen capture, credential extraction, and pivot into corporate internal networks.',
    businessImpact: 'Persistent unauthorized network infiltration, corporate espionage, lateral movement toward sensitive production databases.',
    technicalImpact: 'Covert command-and-control (C2) beaconing, process injection, persistence via registry run keys or systemd services.',
    remediation: 'Isolate affected endpoints, perform memory and registry forensic analysis, reset compromised credentials, reinstall operating system from trusted image.',
    prevention: 'Application whitelisting, restrictive endpoint execution policies (AppLocker), DNS filtering, and robust security awareness training.',
    detectionApproach: 'Network traffic analysis for beaconing patterns; behavioral detection of unexpected child processes spawned by office applications or utilities.',
    references: [
      { title: 'MITRE ATT&CK: Remote Access Software (T1219)', url: 'https://attack.mitre.org/techniques/T1219/' },
      { title: 'CISA: Understanding and Defending Against RATs', url: 'https://www.cisa.gov' }
    ],
    cweIds: ['CWE-506'],
    defaultCvssScore: 8.4,
    cvssRationale: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:N (Scenario: phishing attachment deploying RAT granting persistent C2 access to internal network)',
    tags: ['RAT', 'Trojan', 'Malware', 'C2', 'Endpoint Defense'],
    lastReviewed: '2026-08-22',
    remediationChecklist: [
      'Isolate compromised system from the network immediately via EDR agent.',
      'Revoke all user active sessions and rotate credentials and MFA tokens.',
      'Analyze network perimeter logs for outbound C2 communication destinations.'
    ],
    verificationChecklist: [
      'Verify endpoint telemetry reports clean state following remediation.',
      'Ensure endpoint security policy enforces binary signature checks.'
    ]
  },
  {
    id: 'VULN-204',
    name: 'Memory Corruption & Buffer Overflows',
    slug: 'buffer-overflows-memory-corruption',
    category: 'Software & Malware Threats',
    severity: 'HIGH',
    shortDescription: 'Software writes more data to a memory buffer than allocated, corrupting adjacent stack or heap structures.',
    whatItTargets: 'Native compiled binaries (C, C++, Assembly), network daemons, embedded firmware, kernel modules.',
    whyItMatters: 'Allows adversaries to overwrite function return addresses, hijack control flow, and achieve arbitrary code execution at process privilege level.',
    businessImpact: 'Denial of service crashes, remote code execution in critical low-level infrastructure, appliance compromise.',
    technicalImpact: 'Instruction pointer hijacking (RIP/EIP), shellcode execution, stack smashing, use-after-free exploitation.',
    remediation: 'Compile with modern exploit mitigations (ASLR, DEP/NX, Stack Canaries, Control Flow Guard). Migrate new components to memory-safe languages (Rust, Go).',
    prevention: 'Replace unbounded string functions (strcpy, sprintf) with bounds-checked alternatives (strncpy, snprintf). Run memory fuzzers (AFL, AddressSanitizer).',
    detectionApproach: 'Static analysis for unsafe memory functions; dynamic fuzzing; runtime crashes caught by AddressSanitizer (ASan).',
    references: [
      { title: 'CWE-119: Improper Restriction of Operations within the Bounds of a Memory Buffer', url: 'https://cwe.mitre.org/data/definitions/119.html' },
      { title: 'CISA: The Case for Memory Safe Roadmaps', url: 'https://www.cisa.gov/resources-tools/resources/case-memory-safe-roadmaps' }
    ],
    cweIds: ['CWE-119', 'CWE-120', 'CWE-121', 'CWE-122'],
    defaultCvssScore: 8.6,
    cvssRationale: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H (Scenario: network daemon stack overflow allowing remote code execution)',
    tags: ['Memory Safety', 'Buffer Overflow', 'Exploit Defense', 'C/C++'],
    lastReviewed: '2026-09-01',
    remediationChecklist: [
      'Enable compiler mitigations: -fstack-protector-strong, -D_FORTIFY_SOURCE=2, -Wl,-z,relro,-z,now.',
      'Adopt memory-safe languages (Rust, Go) for network-facing parsing services.',
      'Incorporate AddressSanitizer and continuous fuzzing in CI test suites.'
    ],
    verificationChecklist: [
      'Confirm compiled ELF/PE binaries have NX, ASLR, and Canary flags enabled via checksec utility.'
    ]
  },
  {
    id: 'VULN-205',
    name: 'Credential Dumping & Mimikatz Techniques',
    slug: 'credential-dumping-lsass',
    category: 'Software & Malware Threats',
    severity: 'HIGH',
    shortDescription: 'Extraction of plaintext passwords, Kerberos tickets, and NTLM hashes from operating system memory (e.g. LSASS process).',
    whatItTargets: 'Windows Local Security Authority Subsystem Service (LSASS), SAM registry hive, Linux shadow file.',
    whyItMatters: 'Provides attackers with valid credentials for lateral movement across Active Directory domains without needing exploits.',
    businessImpact: 'Domain-wide compromise, privilege escalation to Domain Admin, unauthorized access to all corporate resources.',
    technicalImpact: 'Extraction of cached credentials, Kerberos golden/silver ticket generation, Pass-the-Hash attacks.',
    remediation: 'Enable Credential Guard, run LSASS as Protected Process Light (PPL), disable WDigest, enforce tiered administrative accounts.',
    prevention: 'Never log into unprivileged workstations with domain admin credentials. Deploy Local Administrator Password Solution (LAPS).',
    detectionApproach: 'Audit process open handles to lsass.exe (Sysmon Event ID 10); detect suspicious memory dumps by non-system processes.',
    references: [
      { title: 'MITRE ATT&CK: OS Credential Dumping: LSASS Memory (T1003.001)', url: 'https://attack.mitre.org/techniques/T1003/001/' },
      { title: 'Microsoft: Credential Guard Overview', url: 'https://learn.microsoft.com/en-us/windows/security/identity-protection/credential-guard/' }
    ],
    cweIds: ['CWE-200', 'CWE-255'],
    defaultCvssScore: 8.0,
    cvssRationale: 'CVSS:3.1/AV:L/AC:L/PR:H/UI:N/S:C/C:H/I:H/A:N (Scenario: local admin extracting domain admin Kerberos tickets from memory)',
    tags: ['Credentials', 'Active Directory', 'LSASS', 'Lateral Movement'],
    lastReviewed: '2026-08-05',
    remediationChecklist: [
      'Enable Windows Defender Credential Guard via Group Policy.',
      'Configure RunAsPPL registry key to protect LSASS from unauthorized memory read access.',
      'Deploy Windows LAPS to randomize local administrator passwords across all machines.',
      'Enforce dedicated Jump Hosts with smart-card authentication for administrative access.'
    ],
    verificationChecklist: [
      'Verify msinfo32 reports Credential Guard is Running and Configured.',
      'Check Sysmon logging is active for lsass access events.'
    ]
  }
];
