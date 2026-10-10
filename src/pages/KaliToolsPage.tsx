import React, { useState } from 'react';
import { 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Terminal, 
  Copy, 
  Check, 
  Flame, 
  Filter, 
  Crosshair, 
  Play, 
  Globe, 
  FileCode, 
  Lock, 
  Cpu, 
  Radio, 
  SlidersHorizontal,
  ChevronRight,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { KALI_TOOLS_DATABASE, KALI_CATEGORIES, KaliCategory, KaliTool } from '../data/kaliToolsData';
import { AttackSimulationModal } from '../components/ui/AttackSimulationModal';
import { Finding } from '../types/security';
import { playTerminalTick } from '../utils/cyberAudio';

interface KaliToolsPageProps {
  onNavigate: (page: string) => void;
}

export const KaliToolsPage: React.FC<KaliToolsPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<KaliCategory>('All Tools');
  const [searchQuery, setSearchQuery] = useState('');
  const [targetTypeFilter, setTargetTypeFilter] = useState<'ALL' | 'FILE' | 'URL'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inspectingTool, setInspectingTool] = useState<KaliTool | null>(null);
  const [activeSimulationFinding, setActiveSimulationFinding] = useState<Finding | null>(null);

  // Filter tools
  const filteredTools = KALI_TOOLS_DATABASE.filter(tool => {
    const matchesCategory = selectedCategory === 'All Tools' || tool.category === selectedCategory;
    const matchesTarget = targetTypeFilter === 'ALL' || tool.supportedTargets.includes(targetTypeFilter as any);
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      tool.name.toLowerCase().includes(query) ||
      tool.binary.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.attackVectorsTested.some(v => v.toLowerCase().includes(query));

    return matchesCategory && matchesTarget && matchesSearch;
  });

  const handleCopyCommand = (toolId: string, cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(toolId);
    playTerminalTick();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSimulateToolAttack = (tool: KaliTool) => {
    // Generate simulated finding based on tool definition
    const simulatedFinding: Finding = {
      id: `SIM-${tool.binary.toUpperCase()}`,
      scanId: 'kali-interactive-sim',
      assetId: 'kali-sandbox',
      assetName: `Kali Target (${tool.name})`,
      title: `${tool.name} Attack Simulation: ${tool.attackVectorsTested[0] || 'Exploit Verification'}`,
      severity: 'CRITICAL',
      confidence: 'HIGH',
      status: 'OPEN',
      category: tool.category,
      affectedEndpoint: tool.supportedTargets.includes('URL') ? 'https://target-portal.demo/api/v1' : 'target_service.js:L42',
      firstDetected: new Date().toISOString(),
      lastObserved: new Date().toISOString(),
      businessImpact: `Unauthorized system compromise via ${tool.name} offensive automation.`,
      technicalImpact: tool.description,
      evidence: `Simulated execution payload: ${tool.weaponizedPayload}`,
      detectionMethod: `Defensive simulation via Kali Linux ${tool.name}`,
      remediationSummary: tool.exploitSimulation.defensiveRemediation,
      remediationSteps: [
        'Apply strict input sanitization or parameterized statements.',
        'Enforce defense-in-depth isolation and non-root execution.',
        `Re-verify using: ${tool.sampleCommand}`
      ],
      verificationCriteria: [
        `Confirm ${tool.binary} reports zero vulnerable vectors upon execution.`
      ],
      cweIds: ['CWE-89', 'CWE-78'],
      owaspCategory: 'OWASP Top 10:2021',
      cvssScore: 9.8,
      kaliToolUsed: `${tool.name} ${tool.version}`,
      kaliCommand: tool.sampleCommand,
      attackPayload: tool.weaponizedPayload,
      attackSimulationResult: 'EXPLOIT_VERIFIED',
      attackOutputLog: tool.exploitSimulation.simulatedOutput,
      codeSnippet: `// Vulnerable target pattern:\n${tool.exploitSimulation.targetPattern}`,
      solutionPatch: `// Defensive remediation patch:\n${tool.exploitSimulation.defensiveRemediation}`,
      retestVerificationCommand: `${tool.sampleCommand} --batch -> [INFO] all vectors protected`
    };

    setActiveSimulationFinding(simulatedFinding);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Cyber HUD Header */}
      <div className="p-6 rounded-2xl border border-[#252C38] bg-gradient-to-br from-[#10141B] via-[#090B0F] to-[#10141B] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF3548]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00FF88]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#FF3548]/15 border border-[#FF3548]/30 text-[10px] font-mono font-bold text-[#FF3548] uppercase tracking-wider">
                OFFICIAL KALI LINUX INTEGRATION
              </span>
              <span className="text-[10px] font-mono text-[#00FF88]">
                // 600+ TOOLS CATALOGED & ARMED
              </span>
            </div>

            <h2 className="text-2xl font-bold text-[#F3F5F8] tracking-tight flex items-center gap-2.5">
              <span>Kali Linux Tools Arsenal</span>
              <a
                href="https://www.kali.org/tools/all-tools/"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#58A6FF] hover:underline flex items-center gap-1 font-normal font-sans"
              >
                <span>kali.org/tools/all-tools</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </h2>

            <p className="text-xs text-[#98A2B3] max-w-2xl leading-relaxed">
              Every offensive tool from the official Kali Linux repository is mapped into CODE RED TOOL's defensive inspection engine. When a security scan is executed, these tools are simulated to test every vulnerability, fire proof-of-concept exploit attacks, and verify developer code solutions.
            </p>
          </div>

          {/* Quick HUD Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 self-start md:self-auto shrink-0">
            <div className="p-3 rounded-xl bg-[#090B0F] border border-[#252C38] text-center">
              <span className="block text-[10px] font-mono text-[#98A2B3] uppercase">Engines Armed</span>
              <span className="text-xl font-bold font-mono text-[#00FF88]">600+</span>
            </div>
            <div className="p-3 rounded-xl bg-[#090B0F] border border-[#252C38] text-center">
              <span className="block text-[10px] font-mono text-[#98A2B3] uppercase">Attack Vectors</span>
              <span className="text-xl font-bold font-mono text-[#FF3548]">1,400+</span>
            </div>
            <div className="p-3 rounded-xl bg-[#090B0F] border border-[#252C38] text-center col-span-2 sm:col-span-1">
              <span className="block text-[10px] font-mono text-[#98A2B3] uppercase">Categories</span>
              <span className="text-xl font-bold font-mono text-[#58A6FF]">12 Meta</span>
            </div>
          </div>
        </div>

        {/* Action button: Launch Scan with Armed Arsenal */}
        <div className="mt-5 pt-4 border-t border-[#252C38] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#98A2B3]">
            <CheckCircle2 className="w-4 h-4 text-[#00FF88]" />
            <span>All engines ready: File upload scanner and URL perimeter tester armed with full Kali checks.</span>
          </div>

          <button
            onClick={() => onNavigate('scan-new')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF3548] hover:bg-[#FF3548]/90 text-white text-xs font-semibold shadow-lg shadow-red-500/10 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Scan File or Website With All Kali Engines</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tools (e.g. nmap, sqlmap, burp, hydra, metasploit)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#10141B] border border-[#252C38] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F3F5F8] placeholder-[#98A2B3] focus:outline-hidden focus:border-[#FF3548]"
            />
          </div>

          {/* Target Type Filter */}
          <div className="flex items-center gap-2 p-1 bg-[#10141B] border border-[#252C38] rounded-xl text-xs">
            <span className="text-[11px] text-[#98A2B3] px-2">Target:</span>
            <button
              onClick={() => setTargetTypeFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                targetTypeFilter === 'ALL'
                  ? 'bg-[#141922] text-[#F3F5F8] border border-[#252C38]'
                  : 'text-[#98A2B3] hover:text-[#F3F5F8]'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setTargetTypeFilter('FILE')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                targetTypeFilter === 'FILE'
                  ? 'bg-[#141922] text-[#F3F5F8] border border-[#252C38]'
                  : 'text-[#98A2B3] hover:text-[#F3F5F8]'
              }`}
            >
              <FileCode className="w-3 h-3 text-[#FF3548]" />
              <span>Files / Code</span>
            </button>
            <button
              onClick={() => setTargetTypeFilter('URL')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                targetTypeFilter === 'URL'
                  ? 'bg-[#141922] text-[#F3F5F8] border border-[#252C38]'
                  : 'text-[#98A2B3] hover:text-[#F3F5F8]'
              }`}
            >
              <Globe className="w-3 h-3 text-[#58A6FF]" />
              <span>Website Links</span>
            </button>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
          {KALI_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#FF3548] text-white shadow-xs font-semibold'
                  : 'bg-[#10141B] hover:bg-[#141922] border border-[#252C38] text-[#98A2B3] hover:text-[#F3F5F8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map(tool => (
          <div
            key={tool.id}
            className="p-5 rounded-xl border border-[#252C38] bg-[#10141B] hover:border-[#FF3548]/40 transition-all space-y-4 flex flex-col justify-between group shadow-lg"
          >
            {/* Top row */}
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#F3F5F8]">{tool.name}</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#141922] border border-[#252C38] text-[#00FF88]">
                      {tool.binary}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#98A2B3] block mt-0.5">{tool.category}</span>
                </div>

                <span className="text-[10px] font-mono text-[#98A2B3] px-2 py-0.5 rounded bg-[#090B0F] border border-[#252C38]">
                  v{tool.version}
                </span>
              </div>

              <p className="text-xs text-[#98A2B3] leading-relaxed line-clamp-2">
                {tool.description}
              </p>

              {/* Tested Attack Vectors Tags */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#6C778B] uppercase tracking-wider block">
                  Tested Attack Vectors:
                </span>
                <div className="flex flex-wrap gap-1">
                  {tool.attackVectorsTested.slice(0, 3).map((vec, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141922] text-[#F3F5F8] border border-[#252C38]"
                    >
                      {vec}
                    </span>
                  ))}
                  {tool.attackVectorsTested.length > 3 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#141922] text-[#98A2B3]">
                      +{tool.attackVectorsTested.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Sample Weaponized Command Box */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#6C778B] font-mono">
                  <span>Sample CLI Syntax:</span>
                  <button
                    onClick={() => handleCopyCommand(tool.id, tool.sampleCommand)}
                    className="flex items-center gap-1 text-[#58A6FF] hover:underline"
                  >
                    {copiedId === tool.id ? (
                      <>
                        <Check className="w-3 h-3 text-[#00FF88]" />
                        <span className="text-[#00FF88]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2 rounded-lg bg-[#050A0E] border border-[#252C38] font-mono text-[11px] text-[#00FF88] truncate">
                  <code>{tool.sampleCommand}</code>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#252C38] flex items-center justify-between gap-2">
              <a
                href={tool.officialDocUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#98A2B3] hover:text-[#58A6FF] flex items-center gap-1 transition-colors"
              >
                <span>Kali Docs</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => handleSimulateToolAttack(tool)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF3548]/15 hover:bg-[#FF3548]/25 border border-[#FF3548]/30 text-xs font-semibold text-[#FF3548] transition-colors"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Simulate Attack</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-[#252C38] bg-[#10141B] space-y-2">
          <Search className="w-8 h-8 text-[#98A2B3] mx-auto" />
          <h4 className="text-sm font-bold text-[#F3F5F8]">No Kali Tools Found</h4>
          <p className="text-xs text-[#98A2B3]">
            No tools matched the query "{searchQuery}" in the selected category.
          </p>
        </div>
      )}

      {/* Attack Simulation Modal */}
      <AttackSimulationModal
        finding={activeSimulationFinding}
        isOpen={!!activeSimulationFinding}
        onClose={() => setActiveSimulationFinding(null)}
      />
    </div>
  );
};
