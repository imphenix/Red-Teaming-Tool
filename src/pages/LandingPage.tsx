import React from 'react';
import { 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  FileCheck, 
  Layers, 
  Lock, 
  Terminal, 
  FileSpreadsheet,
  AlertTriangle,
  Flame,
  ExternalLink
} from 'lucide-react';
import { SeverityBadge } from '../components/ui/SeverityBadge';

interface LandingPageProps {
  onEnterWorkspace: () => void;
  onExploreLibrary: () => void;
  onViewMethodology: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterWorkspace,
  onExploreLibrary,
  onViewMethodology
}) => {
  return (
    <div className="min-h-screen bg-[#090B0F] text-[#F3F5F8] selection:bg-[#FF3548]/30 selection:text-white">
      {/* 3-Zone Top Navigation Contract */}
      <header className="sticky top-0 z-50 h-16 bg-[#090B0F]/90 backdrop-blur-md border-b border-[#252C38] px-6 lg:px-12 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 text-left focus:outline-hidden whitespace-nowrap shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-[#FF3548]/15 border border-[#FF3548]/30 flex items-center justify-center text-[#FF3548]">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <span className="font-bold text-base tracking-tight text-[#F3F5F8]">CODE RED TOOL</span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#98A2B3]">
          <a href="#platform" className="hover:text-[#F3F5F8] transition-colors whitespace-nowrap shrink-0">Platform</a>
          <button onClick={onExploreLibrary} className="hover:text-[#F3F5F8] transition-colors whitespace-nowrap shrink-0">Vulnerability Library</button>
          <button onClick={onViewMethodology} className="hover:text-[#F3F5F8] transition-colors whitespace-nowrap shrink-0">Methodology</button>
          <a href="#coverage" className="hover:text-[#F3F5F8] transition-colors whitespace-nowrap shrink-0">Coverage</a>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onEnterWorkspace}
            className="flex items-center gap-1.5 py-2 px-4 bg-[#FF3548] hover:bg-[#FF3548]/90 text-white rounded-lg text-xs font-semibold shadow-xs transition-all whitespace-nowrap shrink-0"
          >
            <span>Start a Scan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-20 px-6 lg:px-12 border-b border-[#252C38] relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-semibold tracking-wider text-[#FF3548] uppercase">
              Application Security · Built For Defense
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F3F5F8] leading-[1.1] text-balance">
              Find vulnerabilities before attackers do.
            </h1>

            <p className="text-base sm:text-lg text-[#98A2B3] leading-relaxed max-w-xl">
              Upload source code & config files or scan website links. Identify critical injection flaws, exposed credentials, and misconfigurations with simulated attack demonstrations and verified code solutions.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onEnterWorkspace}
                className="flex items-center gap-2 py-3 px-6 bg-[#FF3548] hover:bg-[#FF3548]/90 text-white font-semibold text-sm rounded-lg shadow-sm transition-all"
              >
                <span>Upload File or Scan Link</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreLibrary}
                className="flex items-center gap-2 py-3 px-6 bg-[#141922] hover:bg-[#1a212d] text-[#F3F5F8] border border-[#252C38] font-semibold text-sm rounded-lg transition-all"
              >
                <span>Explore Vulnerability Library</span>
              </button>
            </div>

            <div className="pt-4 text-xs text-[#98A2B3] flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#35C98A]" />
              <span>File Upload & URL Link Scanner · Simulated Attack Vectors · Verified Code Solutions</span>
            </div>
          </div>

          {/* Right Column: Genuine Interactive Product Preview */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-[#252C38] bg-[#10141B] shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#252C38]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#F3F5F8]">Active Finding Triage</span>
                  <span className="text-[10px] text-[#98A2B3]">· Target: demo-store.example</span>
                </div>
                <span className="text-[11px] font-mono text-[#35C98A]">SCAN COMPLETE</span>
              </div>

              {/* Sample Finding Card in Preview */}
              <div className="p-3.5 rounded-lg border border-[#252C38] bg-[#141922] space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-semibold text-[#F3F5F8]">
                    Server-Side Request Forgery via Invoice Webhook Parser
                  </h4>
                  <SeverityBadge severity="CRITICAL" size="sm" />
                </div>
                
                <p className="text-[11px] text-[#98A2B3] line-clamp-2">
                  Endpoint accepted internal destination payload http://169.254.169.254 without private CIDR filtering.
                </p>

                <div className="flex items-center justify-between text-[11px] text-[#98A2B3] pt-1 border-t border-[#252C38]/60">
                  <span className="font-mono text-[#F3F5F8]">POST /api/v1/billing</span>
                  <span className="text-[#FF3548]">CVSS 9.3</span>
                </div>
              </div>

              {/* Secondary sample */}
              <div className="p-3.5 rounded-lg border border-[#252C38] bg-[#141922] space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-semibold text-[#F3F5F8]">
                    Broken Object Level Authorization on Order History
                  </h4>
                  <SeverityBadge severity="HIGH" size="sm" />
                </div>
                
                <div className="flex items-center justify-between text-[11px] text-[#98A2B3]">
                  <span className="font-mono text-[#F3F5F8]">GET /api/v2/orders/:id</span>
                  <span className="text-[#35C98A]">Remediation PR Open</span>
                </div>
              </div>

              {/* Risk Distribution mini bar */}
              <div className="pt-2 border-t border-[#252C38] space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#98A2B3]">Posture Breakdown</span>
                  <span className="text-[#F3F5F8] font-mono">4 Findings Identified</span>
                </div>
                <div className="h-1.5 w-full bg-[#141922] rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#FF3548] w-1/4" title="1 Critical" />
                  <div className="h-full bg-[#FF8A3D] w-1/4" title="1 High" />
                  <div className="h-full bg-[#F5C451] w-1/4" title="1 Medium" />
                  <div className="h-full bg-[#58A6FF] w-1/4" title="1 Low" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section id="platform" className="py-20 px-6 lg:px-12 border-b border-[#252C38]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F3F5F8] tracking-tight">
              Defensive security intelligence designed for engineering velocity.
            </h2>
            <p className="mt-3 text-sm text-[#98A2B3] leading-relaxed">
              We bridge the communication gap between security auditors and developers with transparent evidence and verified remediation instructions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-[#252C38] bg-[#10141B] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#FF3548]/10 border border-[#FF3548]/20 flex items-center justify-center text-[#FF3548]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#F3F5F8]">Discover Exposure</h3>
              <p className="text-xs text-[#98A2B3] leading-relaxed">
                Identify potential weaknesses through supported, non-destructive assessment checks across your authorized perimeter.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#252C38] bg-[#10141B] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#FF8A3D]/10 border border-[#FF8A3D]/20 flex items-center justify-center text-[#FF8A3D]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#F3F5F8]">Prioritize Intelligently</h3>
              <p className="text-xs text-[#98A2B3] leading-relaxed">
                Understand severity, confidence, affected assets, and potential business impact rather than sorting through noisy alerts.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#252C38] bg-[#10141B] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#35C98A]/10 border border-[#35C98A]/20 flex items-center justify-center text-[#35C98A]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#F3F5F8]">Remediate Faster</h3>
              <p className="text-xs text-[#98A2B3] leading-relaxed">
                Give developers clear fixes, verification criteria, and trusted CWE/OWASP references for immediate remediation.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#252C38] bg-[#10141B] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#58A6FF]/10 border border-[#58A6FF]/20 flex items-center justify-center text-[#58A6FF]">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#F3F5F8]">Report with Confidence</h3>
              <p className="text-xs text-[#98A2B3] leading-relaxed">
                Generate professional PDF and CSV reports customized for both technical engineers and non-technical executives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 lg:px-12 border-b border-[#252C38] bg-[#090B0F]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold tracking-wider text-[#98A2B3] uppercase">
              End-to-End Workflow
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#F3F5F8] tracking-tight">
              Four steps from target registration to complete remediation.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-lg border border-[#252C38] bg-[#10141B] space-y-3">
              <div className="text-xs font-mono font-bold text-[#FF3548]">01</div>
              <h4 className="text-sm font-semibold text-[#F3F5F8]">Authorize Asset</h4>
              <p className="text-xs text-[#98A2B3] leading-relaxed">
                Register domain or HTTPS endpoint with explicit authorization confirmation and scope parameters.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-[#252C38] bg-[#10141B] space-y-3">
              <div className="text-xs font-mono font-bold text-[#FF3548]">02</div>
              <h4 className="text-sm font-semibold text-[#F3F5F8]">Run Supported Checks</h4>
              <p className="text-xs text-[#98A2B3] leading-relaxed">
                Execute passive web probes, security configuration checks, or API schema evaluation safely.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-[#252C38] bg-[#10141B] space-y-3">
              <div className="text-xs font-mono font-bold text-[#FF3548]">03</div>
              <h4 className="text-sm font-semibold text-[#F3F5F8]">Review & Prioritize</h4>
              <p className="text-xs text-[#98A2B3] leading-relaxed">
                Triage findings by business risk, assign owners, log developer notes, and transition statuses.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-[#252C38] bg-[#10141B] space-y-3">
              <div className="text-xs font-mono font-bold text-[#FF3548]">04</div>
              <h4 className="text-sm font-semibold text-[#F3F5F8]">Export Reports</h4>
              <p className="text-xs text-[#98A2B3] leading-relaxed">
                Generate downloadable executive summaries and technical PDF reports with remediation criteria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Kali Linux Arsenal Section */}
      <section className="py-20 px-6 lg:px-12 border-b border-[#252C38] bg-gradient-to-b from-[#10141B] to-[#090B0F]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-[#FF3548]/15 border border-[#FF3548]/30 text-[10px] font-mono font-bold text-[#FF3548] uppercase tracking-wider">
                  ALL 600+ KALI LINUX ENGINES INTEGRATED
                </span>
              </div>
              <h2 className="text-3xl font-bold text-[#F3F5F8] tracking-tight flex items-center gap-2.5">
                <span>Arm every attack vector from Kali Linux</span>
                <a
                  href="https://www.kali.org/tools/all-tools/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#58A6FF] hover:underline flex items-center gap-1 font-normal"
                >
                  <span>kali.org/tools/all-tools</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </h2>
              <p className="text-sm text-[#98A2B3] max-w-2xl leading-relaxed">
                When you upload a file or supply a website link, CODE RED TOOL tests against the complete Kali Linux arsenal—firing simulated exploit probes and delivering verified developer code patches.
              </p>
            </div>

            <button
              onClick={onEnterWorkspace}
              className="py-3 px-6 bg-[#FF3548] hover:bg-[#FF3548]/90 text-white font-semibold text-xs rounded-lg shadow-lg shadow-red-500/20 transition-all flex items-center gap-2 self-start md:self-auto shrink-0"
            >
              <Flame className="w-4 h-4 fill-white" />
              <span>Launch Kali Vulnerability Scan</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'Nmap', desc: 'Port & Recon Engine', bin: 'nmap' },
              { name: 'SQLmap', desc: 'Automated SQLi Takeover', bin: 'sqlmap' },
              { name: 'Nuclei', desc: '3,400+ CVE Matcher', bin: 'nuclei' },
              { name: 'Nikto', desc: 'Web Server Header Audit', bin: 'nikto' },
              { name: 'Commix', desc: 'OS Command Injection', bin: 'commix' },
              { name: 'Gobuster', desc: 'Route & Path Buster', bin: 'gobuster' },
              { name: 'OWASP ZAP', desc: 'Active & Passive Proxy', bin: 'zaproxy' },
              { name: 'Hydra', desc: 'Credential Stuffing', bin: 'hydra' },
              { name: 'Hashcat', desc: 'GPU Hash & JWT Cracker', bin: 'hashcat' },
              { name: 'Ghidra', desc: 'NSA Decompilation & AST', bin: 'ghidra' },
              { name: 'LinPEAS', desc: 'Privilege Escalation', bin: 'linpeas' },
              { name: 'Wireshark', desc: 'Deep Packet Analyzer', bin: 'tshark' }
            ].map((tool, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-[#252C38] bg-[#10141B] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#F3F5F8]">{tool.name}</span>
                  <span className="text-[9px] font-mono text-[#00FF88] px-1 py-0.5 rounded bg-[#050A0E] border border-[#252C38]">{tool.bin}</span>
                </div>
                <div className="text-[11px] text-[#98A2B3] line-clamp-1">{tool.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section id="coverage" className="py-20 px-6 lg:px-12 border-b border-[#252C38]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F3F5F8] tracking-tight">
              Vulnerability Coverage & Standards
            </h2>
            <p className="mt-2 text-sm text-[#98A2B3]">
              Curated defense guidance covering OWASP Top 10, CWE standards, and common infrastructure misconfigurations.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs font-medium text-[#F3F5F8]">
            {[
              'Injection & SQLi Flaws',
              'Authentication & MFA Bypass',
              'API Authorization & BOLA',
              'Security Headers & TLS',
              'Sensitive Data Exposure',
              'Dependency & Supply Chain',
              'Cloud & Metadata Exposure',
              'Session Fixation & Cookies',
              'CORS & CSRF Policies',
              'Path Traversal & Filesystem',
              'Remote Code Execution (RCE)',
              'GraphQL Introspection'
            ].map(item => (
              <div key={item} className="p-3.5 rounded-lg border border-[#252C38] bg-[#10141B] flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#35C98A] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-6 lg:px-12 bg-linear-to-b from-[#090B0F] to-[#10141B] text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F3F5F8] tracking-tight">
            Make your next release more secure.
          </h2>
          <p className="text-sm sm:text-base text-[#98A2B3] leading-relaxed">
            Gain continuous visibility into your external attack surface with transparent findings and developer-first remediation.
          </p>
          <div className="pt-2">
            <button
              onClick={onEnterWorkspace}
              className="inline-flex items-center gap-2 py-3 px-8 bg-[#FF3548] hover:bg-[#FF3548]/90 text-white font-semibold text-sm rounded-lg shadow-lg shadow-red-500/10 transition-all"
            >
              <span>Open Security Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-12 border-t border-[#252C38] bg-[#090B0F] text-xs text-[#98A2B3]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#FF3548]" />
            <span className="font-semibold text-[#F3F5F8]">CODE RED TOOL</span>
            <span>· Defensive Vulnerability Assessment & Remediation Platform</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={onViewMethodology} className="hover:text-[#F3F5F8] transition-colors">Methodology</button>
            <button onClick={onExploreLibrary} className="hover:text-[#F3F5F8] transition-colors">Vulnerability Library</button>
            <button onClick={onEnterWorkspace} className="hover:text-[#F3F5F8] transition-colors">Security Workspace</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
