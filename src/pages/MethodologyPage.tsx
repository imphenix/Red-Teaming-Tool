import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  Compass, 
  CheckCircle2, 
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { METHODOLOGY_DOCS } from '../data/methodologyData';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#F3F5F8] tracking-tight">Security Methodology & Standards</h2>
        <p className="mt-1 text-xs text-[#98A2B3]">
          Defensive assessment guidelines, scope governance policies, and scoring criteria.
        </p>
      </div>

      {/* Trust & Ethics Banner */}
      <div className="p-5 rounded-xl border border-[#252C38] bg-[#10141B] flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-[#35C98A] shrink-0 mt-0.5" />
        <div className="space-y-1.5 text-xs text-[#98A2B3] leading-relaxed">
          <h3 className="font-semibold text-sm text-[#F3F5F8]">Ethical & Defensive Foundation</h3>
          <p>
            CODE RED TOOL operates strictly as a defensive vulnerability assessment and remediation guidance platform. Our checks are designed to safeguard digital assets through non-destructive inspection, passive header verification, and configuration auditing. We prohibit weaponized exploits, credential brute-forcing, and unauthorized intrusion techniques.
          </p>
        </div>
      </div>

      {/* Methodology Sections */}
      <div className="space-y-6">
        {METHODOLOGY_DOCS.map((section, idx) => (
          <div key={idx} className="p-6 rounded-xl border border-[#252C38] bg-[#10141B] space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#F3F5F8]">{section.title}</h3>
              <p className="text-xs text-[#98A2B3] mt-0.5">{section.subtitle}</p>
            </div>

            <div className="space-y-2 text-xs text-[#98A2B3] leading-relaxed">
              {section.content.map((p, pIdx) => (
                <p key={pIdx}>{p}</p>
              ))}
            </div>

            {section.principles && (
              <div className="space-y-2.5 pt-3 border-t border-[#252C38]">
                {section.principles.map((pr, prIdx) => (
                  <div key={prIdx} className="p-3.5 rounded-lg border border-[#252C38] bg-[#090B0F] space-y-1">
                    <strong className="text-xs font-semibold text-[#F3F5F8] block">
                      {pr.label}
                    </strong>
                    <p className="text-xs text-[#98A2B3] leading-relaxed">
                      {pr.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Offensive Tool Vectors vs Defensive Controls */}
      <div className="p-6 rounded-xl border border-[#252C38] bg-[#10141B] space-y-4">
        <div>
          <h3 className="text-base font-bold text-[#F3F5F8]">Tool Taxonomy & Offensive Threat Vector Mapping</h3>
          <p className="text-xs text-[#98A2B3] mt-0.5">
            How CODE RED TOOL translates penetration testing suites (such as Kali Linux tooling) into safe defensive engineering controls.
          </p>
        </div>

        <p className="text-xs text-[#98A2B3] leading-relaxed">
          While offensive toolkits (such as Nmap, sqlmap, Hydra, John the Ripper, and Metasploit) execute active intrusion, brute-force cracking, and weaponized payloads, CODE RED TOOL is engineered specifically for defensive operations. We map the attack surfaces targeted by those tools directly into safe, non-destructive static rules, passive configuration inspections, and verified code patches.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-lg border border-[#252C38] bg-[#090B0F] space-y-1">
            <strong className="text-[#FF8A3D] block text-xs">Offensive Vector: SQL Injection (e.g. sqlmap)</strong>
            <p className="text-[#98A2B3]">Automated extraction of databases via boolean, time-based, or error payloads.</p>
            <div className="text-[#35C98A] text-[11px] pt-1">✓ CODE RED Control: AST taint analysis & parameterized query enforcement ($1, prepared statements).</div>
          </div>

          <div className="p-3.5 rounded-lg border border-[#252C38] bg-[#090B0F] space-y-1">
            <strong className="text-[#FF8A3D] block text-xs">Offensive Vector: Credential Cracking (e.g. Hydra, John)</strong>
            <p className="text-[#98A2B3]">High-speed dictionary and brute-force attacks against login and basic auth routes.</p>
            <div className="text-[#35C98A] text-[11px] pt-1">✓ CODE RED Control: Static secret leakage detection, Argon2id hashing, and adaptive rate-limiting validation.</div>
          </div>

          <div className="p-3.5 rounded-lg border border-[#252C38] bg-[#090B0F] space-y-1">
            <strong className="text-[#FF8A3D] block text-xs">Offensive Vector: Network Reconnaissance (e.g. Nmap, Nikto)</strong>
            <p className="text-[#98A2B3]">Port scanning, OS fingerprinting, and automated banner grabbing.</p>
            <div className="text-[#35C98A] text-[11px] pt-1">✓ CODE RED Control: Passive software banner suppression auditing & cloud security group validation.</div>
          </div>

          <div className="p-3.5 rounded-lg border border-[#252C38] bg-[#090B0F] space-y-1">
            <strong className="text-[#FF8A3D] block text-xs">Offensive Vector: Transport Downgrade (e.g. sslstrip, Wireshark)</strong>
            <p className="text-[#98A2B3]">Man-in-the-Middle traffic sniffing and plaintext SSL stripping.</p>
            <div className="text-[#35C98A] text-[11px] pt-1">✓ CODE RED Control: Passive HSTS max-age audit, TLS 1.3 verification, and HTTP-to-HTTPS redirect enforcement.</div>
          </div>
        </div>
      </div>

      {/* Responsible Disclosure Placeholder notice */}
      <div className="p-5 rounded-xl border border-[#252C38] bg-[#10141B] space-y-2 text-xs">
        <h4 className="font-semibold text-[#F3F5F8]">Responsible Vulnerability Disclosure Framework</h4>
        <p className="text-[#98A2B3] leading-relaxed">
          If you identify potential vulnerabilities in external libraries or partner services during assessments, our policy mandates coordinated 90-day responsible disclosure. Report vulnerabilities to security@yourorganization.com with encrypted proof-of-concept logs.
        </p>
      </div>
    </div>
  );
};
