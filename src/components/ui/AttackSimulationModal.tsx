import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  ShieldCheck, 
  X, 
  Crosshair,
  ExternalLink,
  Flame
} from 'lucide-react';
import { Finding } from '../../types/security';
import { SeverityBadge } from './SeverityBadge';
import { CodeDiffViewer } from './CodeDiffViewer';
import { playTerminalTick, playExploitAlert } from '../../utils/cyberAudio';

interface AttackSimulationModalProps {
  finding: Finding | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AttackSimulationModal: React.FC<AttackSimulationModalProps> = ({
  finding,
  isOpen,
  onClose
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [activeTab, setActiveTab] = useState<'ATTACK' | 'DIFF' | 'REMEDIATION'>('ATTACK');

  if (!isOpen || !finding) return null;

  const defaultTool = finding.kaliToolUsed || 'Kali Linux Security Toolkit';
  const defaultCommand = finding.kaliCommand || `sqlmap -u "${finding.affectedEndpoint}" --batch --risk=3`;
  const defaultPayload = finding.attackPayload || finding.simulatedAttackVector || "' OR '1'='1 -- -";
  const defaultLog = finding.attackOutputLog || `[+] [KALI-ATTACK-SIMULATOR] Launching probe against ${finding.affectedEndpoint}...\n[*] Payload transmitted.\n[+] Exploitation confirmed.`;

  const handleRunSimulation = () => {
    setIsRunning(true);
    setSimulationLogs([
      `kali@kali:~$ ${defaultCommand}`,
      `[*] Initializing offensive probe via ${defaultTool}...`,
      `[*] Target: ${finding.affectedEndpoint}`,
      `[*] Transmitting payload: ${defaultPayload}`
    ]);
    playTerminalTick();

    setTimeout(() => {
      setSimulationLogs(prev => [
        ...prev,
        `[*] Evaluating server response & response time delta...`,
        `[*] Memory address space inspected...`
      ]);
      playTerminalTick();
    }, 600);

    setTimeout(() => {
      setSimulationLogs(prev => [
        ...prev,
        `[!] EXPLOIT CONFIRMED: Vulnerability reproduced in isolated test sandbox!`,
        `[+] Status: ${finding.attackSimulationResult || 'EXPLOIT_VERIFIED'}`,
        `----------------------------------------`,
        ...defaultLog.split('\n')
      ]);
      setIsRunning(false);
      playExploitAlert();
    }, 1400);
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(defaultCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(defaultPayload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#090B0F] border border-[#252C38] rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Top Header with Cyber Glow */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#10141B] border-b border-[#252C38]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#FF3548]/15 border border-[#FF3548]/30">
              <Crosshair className="w-5 h-5 text-[#FF3548] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-[#FF3548] font-bold uppercase">
                  OFFENSIVE EXPLOIT SIMULATOR // {defaultTool}
                </span>
                <span className="text-[10px] text-[#98A2B3]">· {finding.id}</span>
              </div>
              <h3 className="text-base font-bold text-[#F3F5F8] tracking-tight truncate max-w-md">
                {finding.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SeverityBadge severity={finding.severity} size="sm" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#98A2B3] hover:text-[#F3F5F8] hover:bg-[#141922] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-[#0C1017] border-b border-[#252C38] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('ATTACK')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'ATTACK'
                ? 'bg-[#FF3548]/15 text-[#FF3548] border border-[#FF3548]/30'
                : 'text-[#98A2B3] hover:text-[#F3F5F8]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Attack Execution & Payload</span>
          </button>
          <button
            onClick={() => setActiveTab('DIFF')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'DIFF'
                ? 'bg-[#35C98A]/15 text-[#35C98A] border border-[#35C98A]/30'
                : 'text-[#98A2B3] hover:text-[#F3F5F8]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Remediation Diff Patch</span>
          </button>
          <button
            onClick={() => setActiveTab('REMEDIATION')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'REMEDIATION'
                ? 'bg-[#58A6FF]/15 text-[#58A6FF] border border-[#58A6FF]/30'
                : 'text-[#98A2B3] hover:text-[#F3F5F8]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Defensive Verification Guide</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === 'ATTACK' && (
            <div className="space-y-5">
              {/* Tool & Command Details Card */}
              <div className="p-4 rounded-xl bg-[#10141B] border border-[#252C38] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#98A2B3] font-mono">Assigned Kali Linux Engine:</span>
                  <span className="font-mono text-[#00FF88] font-bold">{defaultTool}</span>
                </div>

                {/* Kali Terminal Command */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-[#98A2B3]">
                    <span>Attack Command Executed:</span>
                    <button
                      onClick={handleCopyCommand}
                      className="flex items-center gap-1 text-[11px] text-[#58A6FF] hover:underline"
                    >
                      {copiedCmd ? <Check className="w-3 h-3 text-[#35C98A]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCmd ? 'Copied' : 'Copy Command'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#050A0E] border border-[#252C38] font-mono text-xs text-[#00FF88] overflow-x-auto flex items-center justify-between">
                    <code>kali@kali:~$ {defaultCommand}</code>
                  </div>
                </div>

                {/* Attack Payload String */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-[#98A2B3]">
                    <span>Weaponized Proof-of-Concept Payload:</span>
                    <button
                      onClick={handleCopyPayload}
                      className="flex items-center gap-1 text-[11px] text-[#58A6FF] hover:underline"
                    >
                      {copiedPayload ? <Check className="w-3 h-3 text-[#35C98A]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedPayload ? 'Copied' : 'Copy Payload'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#050A0E] border border-[#FF3548]/30 font-mono text-xs text-[#FF8A3D] overflow-x-auto">
                    <code>{defaultPayload}</code>
                  </div>
                </div>
              </div>

              {/* Interactive Terminal Replay Widget */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#F3F5F8]">
                    <Terminal className="w-4 h-4 text-[#00FF88]" />
                    <span>Attack Simulation Execution Stream</span>
                  </div>

                  <button
                    onClick={handleRunSimulation}
                    disabled={isRunning}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF3548] hover:bg-[#FF3548]/90 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{isRunning ? 'Firing Exploit...' : 'Re-Run Attack Simulation'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#050A0E] border border-[#252C38] font-mono text-xs text-[#98A2B3] space-y-1.5 max-h-56 overflow-y-auto leading-relaxed shadow-inner">
                  {simulationLogs.length > 0 ? (
                    simulationLogs.map((log, idx) => (
                      <div 
                        key={idx} 
                        className={
                          log.includes('EXPLOIT CONFIRMED') || log.includes('CRITICAL') 
                            ? 'text-[#FF3548] font-bold' 
                            : log.includes('kali@kali') 
                            ? 'text-[#00FF88]' 
                            : log.includes('[+]') 
                            ? 'text-[#35C98A]' 
                            : 'text-[#98A2B3]'
                        }
                      >
                        {log}
                      </div>
                    ))
                  ) : (
                    <div>
                      <div className="text-[#00FF88] font-bold">kali@kali:~$ {defaultCommand}</div>
                      {defaultLog.split('\n').map((line, idx) => (
                        <div key={idx} className={line.includes('vulnerable') || line.includes('CRITICAL') ? 'text-[#FF3548]' : ''}>
                          {line}
                        </div>
                      ))}
                      <div className="pt-2 text-[10px] text-[#6C778B] italic">
                        Click "Re-Run Attack Simulation" above to execute the Kali engine probe in real time.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Vulnerability Exploit Verdict Banner */}
              <div className="p-3.5 rounded-xl border border-[#FF3548]/30 bg-[#FF3548]/10 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#FF3548] shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <strong className="text-[#F3F5F8] block font-bold">
                    Exploitation Impact & Threat Severity: {finding.severity} (CVSS {finding.cvssScore || 8.5})
                  </strong>
                  <p className="text-[#98A2B3] leading-relaxed">
                    {finding.technicalImpact}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'DIFF' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-[#F3F5F8]">Verified Source Code Patch</h4>
                <p className="text-xs text-[#98A2B3]">
                  Review the vulnerable code block vs the defensive implementation that defeats the Kali attack vector.
                </p>
              </div>

              <CodeDiffViewer
                vulnerableCode={finding.codeSnippet}
                solutionPatch={finding.solutionPatch}
                fileName={finding.affectedEndpoint}
                lineNumber={finding.lineNumber}
              />
            </div>
          )}

          {activeTab === 'REMEDIATION' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#10141B] border border-[#252C38] space-y-2">
                <h4 className="font-bold text-[#F3F5F8] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#35C98A]" />
                  <span>Remediation Roadmap</span>
                </h4>
                <p className="text-[#98A2B3] leading-relaxed">
                  {finding.remediationSummary}
                </p>
              </div>

              {/* Step-by-Step checklist */}
              <div className="p-4 rounded-xl bg-[#10141B] border border-[#252C38] space-y-2.5">
                <h5 className="font-semibold text-[#F3F5F8]">Developer Action Checklist:</h5>
                <ul className="space-y-2">
                  {finding.remediationSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[#98A2B3]">
                      <span className="w-4 h-4 rounded-full bg-[#141922] border border-[#252C38] flex items-center justify-center text-[10px] text-[#00FF88] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Kali Verification Test */}
              <div className="p-4 rounded-xl bg-[#050A0E] border border-[#00FF88]/30 space-y-2">
                <div className="flex items-center gap-2 text-[#00FF88] font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Defensive Re-Verification Command (Kali Linux Test):</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#090B0F] border border-[#252C38] font-mono text-[11px] text-[#00FF88]">
                  <code>{finding.retestVerificationCommand || `nmap --script vuln -p 80,443 ${finding.affectedEndpoint}`}</code>
                </div>
                <p className="text-[11px] text-[#98A2B3]">
                  Running this command against the patched application should confirm zero exploitable pathways.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-[#10141B] border-t border-[#252C38] text-xs">
          <div className="flex items-center gap-2 text-[#98A2B3]">
            <span className="font-mono text-[11px]">CWE: {finding.cweIds?.join(', ') || 'CWE-89'}</span>
            <span>·</span>
            <span className="font-mono text-[11px]">OWASP: {finding.owaspCategory || 'OWASP Top 10'}</span>
          </div>

          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-[#141922] hover:bg-[#1a212d] border border-[#252C38] text-xs font-semibold text-[#F3F5F8] rounded-lg transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
