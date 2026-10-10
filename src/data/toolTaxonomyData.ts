export interface ToolDefenseMapping {
  category: string;
  categoryIconName: string;
  threatDescription: string;
  associatedOffensiveTools: string[];
  defensiveCheckImplemented: string;
  vulnerabilityIdentified: string;
  recommendedDefensiveControl: string;
  standardsMapping: string[];
}

export const TOOL_DEFENSE_TAXONOMY: ToolDefenseMapping[] = [
  {
    category: 'Information Gathering & Reconnaissance',
    categoryIconName: 'Globe',
    threatDescription: 'Adversaries harvest DNS records, subdomains, open ports, service banners, and exposed metadata to map the external attack surface.',
    associatedOffensiveTools: ['nmap', 'amass', 'sublist3r', 'theharvester', 'dnsrecon', 'recon-ng', 'fierce', 'maltego'],
    defensiveCheckImplemented: 'Passive perimeter reconnaissance audit, DNS zone transfer exposure checks, and server software banner suppression verification.',
    vulnerabilityIdentified: 'Information Disclosure & Unrestricted Attack Surface Enumeration',
    recommendedDefensiveControl: 'Disable DNS AXFR zone transfers, configure Cloudflare/CDN origin shielding, and strip Server and X-Powered-By response headers.',
    standardsMapping: ['CWE-200', 'OWASP A05:2021', 'CIS Benchmark 1.1']
  },
  {
    category: 'Vulnerability Analysis & Service Auditing',
    categoryIconName: 'ShieldAlert',
    threatDescription: 'Automated probing for known CVEs, unpatched service daemons, default configurations, and misconfigured infrastructure components.',
    associatedOffensiveTools: ['openvas', 'nikto', 'wpscan', 'legion', 'nmap-vuln', 'golismero', 'cve-search'],
    defensiveCheckImplemented: 'Automated configuration linter, outdated TLS handshake detection, and known software dependency vulnerability matching.',
    vulnerabilityIdentified: 'Unpatched Known Vulnerabilities & Security Misconfigurations',
    recommendedDefensiveControl: 'Implement continuous automated dependency scanning (SCA), enforce automated security patch cycles, and disallow legacy protocols.',
    standardsMapping: ['CWE-937', 'OWASP A06:2021', 'NIST SP 800-40']
  },
  {
    category: 'Web Application & Injection Defense',
    categoryIconName: 'Code',
    threatDescription: 'Injection of malicious payloads into web input vectors to manipulate queries, hijack browser contexts, or execute server commands.',
    associatedOffensiveTools: ['sqlmap', 'burpsuite', 'owasp-zap', 'commix', 'wpscan', 'wfuzz', 'ffuf', 'skipfish'],
    defensiveCheckImplemented: 'SAST taint tracking for SQL string concatenation, shell process execution (exec/popen), and unescaped DOM sinks (dangerouslySetInnerHTML).',
    vulnerabilityIdentified: 'SQL Injection, OS Command Injection, and Cross-Site Scripting (XSS)',
    recommendedDefensiveControl: 'Use prepared statements exclusively, replace shell invocations with discrete argument arrays (execFile), and enforce strict CSP.',
    standardsMapping: ['CWE-89', 'CWE-78', 'CWE-79', 'OWASP A03:2021']
  },
  {
    category: 'Authentication & Credential Hardening',
    categoryIconName: 'Lock',
    threatDescription: 'High-speed automated dictionary attacks, credential stuffing from leaked breaches, and password hash cracking.',
    associatedOffensiveTools: ['hydra', 'john', 'hashcat', 'medusa', 'patator', 'crowbar', 'ophcrack', 'ncrack'],
    defensiveCheckImplemented: 'Hardcoded secret detection (AWS keys, JWT signing tokens, private keys) and authentication rate-limiting verification.',
    vulnerabilityIdentified: 'Exposed Credentials, Weak Password Policies, and Lack of Rate Limiting',
    recommendedDefensiveControl: 'Enforce Argon2id password hashing, mandate WebAuthn/FIDO2 MFA, and implement IP- and account-level adaptive rate limiting.',
    standardsMapping: ['CWE-798', 'CWE-307', 'CWE-287', 'OWASP A07:2021']
  },
  {
    category: 'Server-Side Request & Cloud Metadata Defense',
    categoryIconName: 'Server',
    threatDescription: 'Coercing servers into fetching internal network resources, leaking cloud provider IAM role credentials via 169.254.169.254.',
    associatedOffensiveTools: ['ssrf-sheriff', 'burpsuite-collaborator', 'interactsh', 'gopherus', 'cloudlist'],
    defensiveCheckImplemented: 'Inspection of webhook and external URL fetching sinks for private CIDR filtering (RFC 1918) and IMDSv2 token mandates.',
    vulnerabilityIdentified: 'Server-Side Request Forgery (SSRF) & Cloud Metadata Role Exposure',
    recommendedDefensiveControl: 'Route outbound requests through an egress proxy with pre-connection IP resolution verification; enforce IMDSv2 with hop limit 1.',
    standardsMapping: ['CWE-918', 'OWASP A10:2021', 'AWS Security Best Practices']
  },
  {
    category: 'API Security & Object Authorization',
    categoryIconName: 'Zap',
    threatDescription: 'Manipulating sequential or enumerated object IDs in API endpoints to access unauthorized records across organizational tenants.',
    associatedOffensiveTools: ['postman', 'kiterunner', 'arjun', 'graphql-cop', 'inql', 'burp-autorize'],
    defensiveCheckImplemented: 'Audit of endpoint controllers for tenant ownership filters and public GraphQL introspection query enablement.',
    vulnerabilityIdentified: 'Broken Object Level Authorization (BOLA/IDOR) & Introspection Leakage',
    recommendedDefensiveControl: 'Enforce tenant ID validation in data access queries, replace sequential integers with UUID v4, and disable schema introspection.',
    standardsMapping: ['CWE-639', 'OWASP API1:2023', 'OWASP API8:2023']
  },
  {
    category: 'Network & SSL/TLS Protocol Hardening',
    categoryIconName: 'Layers',
    threatDescription: 'Eavesdropping on cleartext traffic, protocol downgrade (SSL stripping), and cryptographic cipher weaknesses.',
    associatedOffensiveTools: ['wireshark', 'tcpdump', 'sslstrip', 'ettercap', 'bettercap', 'mitmproxy', 'sslscan'],
    defensiveCheckImplemented: 'Passive protocol analysis detecting cleartext HTTP, missing HSTS headers, and insecure TLS configurations.',
    vulnerabilityIdentified: 'Cleartext Transport (Missing HTTPS) & Protocol Downgrade Vulnerability',
    recommendedDefensiveControl: 'Enforce TLS 1.3 with forward secrecy ciphers, configure automatic HTTP to HTTPS 301 redirects, and enable HSTS preloading.',
    standardsMapping: ['CWE-319', 'CWE-523', 'OWASP A02:2021']
  },
  {
    category: 'Container & Host Execution Hardening',
    categoryIconName: 'FileCode',
    threatDescription: 'Exploiting application weaknesses to escape container boundaries or escalate privileges through root namespace processes.',
    associatedOffensiveTools: ['deepce', 'linpeas', 'cdk', 'docker-bench', 'kube-bench'],
    defensiveCheckImplemented: 'Dockerfile linter checking for missing unprivileged USER directives and excessive privileges.',
    vulnerabilityIdentified: 'Container Process Running as Root User (Lack of Least Privilege)',
    recommendedDefensiveControl: 'Create dedicated unprivileged users (USER appuser), mount read-only filesystems, and drop Linux kernel capabilities.',
    standardsMapping: ['CWE-250', 'CIS Docker Benchmark 4.1', 'NIST SP 800-190']
  }
];
