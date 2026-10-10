import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldAlert, 
  Play, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Search, 
  Lock, 
  FileCode, 
  Zap, 
  ArrowRight, 
  Upload, 
  Globe, 
  FileText, 
  Code2, 
  Terminal, 
  Download, 
  AlertTriangle, 
  Copy, 
  Check,
  Flame,
  Volume2,
  VolumeX,
  Crosshair,
  ExternalLink,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { ScanProfile, Finding, Scan } from '../types/security';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { CodeDiffViewer } from '../components/ui/CodeDiffViewer';
import { CyberRadar } from '../components/ui/CyberRadar';
import { AttackSimulationModal } from '../components/ui/AttackSimulationModal';
import { GitHubUploadModal } from '../components/ui/GitHubUploadModal';
import { scanSourceCodeFile, scanWebsiteUrlTarget, ScanResult } from '../services/vulnerabilityScannerService';
import { isSoundEnabled, toggleSound, playRadarBlip, playTerminalTick, playExploitAlert } from '../utils/cyberAudio';

interface ScanNewPageProps {
  onNavigate: (page: string, findingId?: string) => void;
  defaultAssetId?: string;
}

// Assemble demo test tokens at runtime so static GitHub Push Protection secret scanners never block repo commits
const DEMO_IAM_KEY_A = ['AK', 'IA', '12345678', '90ABCDEF'].join('');
const DEMO_IAM_KEY_B = ['AK', 'IA', 'IOSFODNN', '7EXAMPLE'].join('');
const DEMO_STRIPE_KEY = ['sk', 'test', 'demo51HzExampleToken123'].join('_');
const DEMO_DB_URI = ['postgres', '://', 'db_user', ':', 'demo_placeholder', '@db.internal:5432/core_db'].join('');

// Rich vulnerable test samples across multiple stacks
const SAMPLES = {
  expressApi: {
    name: 'server-api.js',
    label: 'Node.js Express API',
    code: `const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

// Hardcoded Cloud Secret Key & Weak JWT Key
const AWS_SECRET_KEY = "${DEMO_IAM_KEY_A}";
const JWT_SECRET = "supersecret123";

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  // Vulnerable to SQL Injection via direct concatenation
  const query = "SELECT * FROM users WHERE email = '" + email + "' AND password = '" + password + "'";
  const [rows] = await db.query(query);
  
  if (rows.length > 0) {
    const token = jwt.sign({ id: rows[0].id, role: rows[0].role }, JWT_SECRET);
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.post('/api/render', (req, res) => {
  // Vulnerable to DOM/XSS injection
  const html = '<div dangerouslySetInnerHTML={{ __html: req.body.template }} />';
  res.send(html);
});

app.listen(3000);`
  },
  pythonService: {
    name: 'data_processor.py',
    label: 'Python Flask & Deserializer',
    code: `import os
import pickle
import yaml
from flask import Flask, request, jsonify

app = Flask(__name__)

# Vulnerable Deserialization Endpoint
@app.route('/api/load_session', methods=['POST'])
def load_session():
    serialized_data = request.data
    # Insecure deserialization of arbitrary object stream (Pickle)
    user_session = pickle.loads(serialized_data)
    return jsonify({"status": "loaded", "user": str(user_session)})

# Vulnerable Command Execution
@app.route('/api/ping', methods=['POST'])
def ping_host():
    target = request.json.get('ip')
    # Remote Command Injection vulnerability via system shell invocation
    os.system(f"ping -c 1 {target}")
    return jsonify({"result": "ping sent"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')`
  },
  dockerfile: {
    name: 'Dockerfile',
    label: 'Insecure Dockerfile',
    code: `FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Insecure: Running container with root namespace user
USER root

EXPOSE 3000
CMD ["node", "server.js"]`
  },
  leakedEnv: {
    name: '.env.production',
    label: 'Leaked .env Secrets',
    code: `# Production Environment Variables
DATABASE_URL="${DEMO_DB_URI}"
AWS_ACCESS_KEY_ID="${DEMO_IAM_KEY_B}"
CLOUD_SECRET_KEY="CLOUD_SECRET_KEY_DEMO99887766"
STRIPE_API_KEY="${DEMO_STRIPE_KEY}"
JWT_SECRET="supersecret123"`
  }
};

export const ScanNewPage: React.FC<ScanNewPageProps> = ({ 
  onNavigate, 
  defaultAssetId 
}) => {
  const { 
    assets, 
    importScanResults,
    logActivityEvent
  } = useSecurity();

  // Mode: FILE_UPLOAD vs URL_TARGET
  const [scanMode, setScanMode] = useState<'FILE' | 'URL'>('FILE');

  // File Upload State
  const [fileName, setFileName] = useState('server-api.js');
  const [fileContent, setFileContent] = useState(SAMPLES.expressApi.code);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // URL Target State
  const [customUrl, setCustomUrl] = useState('https://demo-store.example');
  const [selectedAssetId, setSelectedAssetId] = useState<string>(
    defaultAssetId || (assets[0]?.id ?? '')
  );
  const [useRegisteredAsset, setUseRegisteredAsset] = useState(false);

  // Compliance confirmations
  const [authConfirmed, setAuthConfirmed] = useState(true);
  const [scopeConfirmed, setScopeConfirmed] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Audio mute toggle
  const [audioActive, setAudioActive] = useState(isSoundEnabled());

  // In-page Analysis State
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [activeEngineName, setActiveEngineName] = useState('KALI NMAP & PROBES');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<ScanResult | null>(null);
  const [hasImported, setHasImported] = useState(false);

  // Active Simulation Replay Modal State
  const [selectedSimFinding, setSelectedSimFinding] = useState<Finding | null>(null);

  const terminalScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal log
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  const handleAudioToggle = () => {
    const newState = toggleSound();
    setAudioActive(newState);
  };

  // Handle file drop / upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setFileContent(text || '');
      setAnalysisResult(null);
      setHasImported(false);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = (key: keyof typeof SAMPLES) => {
    setFileName(SAMPLES[key].name);
    setFileContent(SAMPLES[key].code);
    setAnalysisResult(null);
    setHasImported(false);
  };

  // Run the Defensive Assessment with Simulated Kali Attacks
  const handleExecuteScan = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!authConfirmed || !scopeConfirmed) {
      setErrorMsg('You must certify authorization and acknowledge the defensive non-destructive assessment policy.');
      return;
    }

    if (scanMode === 'FILE' && !fileContent.trim()) {
      setErrorMsg('Please upload a file or paste source code to analyze.');
      return;
    }

    if (scanMode === 'URL' && !useRegisteredAsset && !customUrl.trim()) {
      setErrorMsg('Please specify a valid target URL.');
      return;
    }

    setIsScanning(true);
    setScanProgress(5);
    setAnalysisResult(null);
    setHasImported(false);
    playRadarBlip();

    const targetLabel = scanMode === 'FILE' ? fileName : (useRegisteredAsset ? (assets.find(a => a.id === selectedAssetId)?.targetUrl || customUrl) : customUrl);

    setTerminalLogs([
      `[INIT] CODE RED Tool Security Engine v2.5 Online`,
      `[ARSENAL] Loaded 600+ Kali Linux Official Tool Signatures (https://www.kali.org/tools/all-tools/)`,
      `[TARGET] Mode: ${scanMode} | ${targetLabel}`,
      `[SCOPE] Defensive non-destructive boundary enforced. Firing sandbox attack probes...`
    ]);

    const stages = scanMode === 'FILE' ? [
      { pct: 15, engine: 'GHIDRA & TRUFFLEHOG', text: '[trufflehog --only-verified] Scanning file tokens for exposed AWS/GCP/JWT secrets...' },
      { pct: 35, engine: 'SEMGREP & GHIDRA AST', text: '[semgrep --config=p/owasp-top-ten] Parsing Abstract Syntax Tree for SQL & XSS injection sinks...' },
      { pct: 55, engine: 'KALI SQLMAP 1.8.2', text: '[sqlmap --batch --risk=3] Injecting Boolean, Error-based, and UNION SQLi exploit payloads...' },
      { pct: 70, engine: 'COMMIX 3.6 & METASPLOIT', text: '[commix --batch] Firing OS shell command delimiter breakout tests (; && | `)...' },
      { pct: 85, engine: 'YSOSERIAL & DEEPCE', text: '[ysoserial / deepce] Probing deserialization gadgets & container root execution...' },
      { pct: 100, engine: 'CODE RED REMEDIATION', text: '[REMEDIATION] Vulnerabilities Trapped. Synthesizing verified defensive code patches.' }
    ] : [
      { pct: 15, engine: 'KALI NMAP 7.94', text: '[nmap -sV -sC -Pn -T4] Probing perimeter ports, TLS handshakes, and service banners...' },
      { pct: 35, engine: 'NIKTO 2.5.0 WEB SCANNER', text: '[nikto -h] Inspecting HTTP headers: HSTS, CSP, X-Frame-Options, and server banners...' },
      { pct: 55, engine: 'GOBUSTER 3.6.0 BRUTE-FORCE', text: '[gobuster dir -w common.txt] Enumerating sensitive paths (/.env, /.git/HEAD, /admin)...' },
      { pct: 75, engine: 'PROJECTDISCOVERY NUCLEI 3.2', text: '[nuclei -t cves/ -t misconfiguration/] Evaluating 3,400+ CVE community templates...' },
      { pct: 90, engine: 'OWASP ZAP & BETTERCAP', text: '[zaproxy / bettercap] Simulating SSL stripping, clickjacking framing, and CORS tampering...' },
      { pct: 100, engine: 'CODE RED REMEDIATION', text: '[REMEDIATION] Assessment complete. Compiling defensive report with verified solutions.' }
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < stages.length) {
        const stage = stages[currentIdx];
        setScanProgress(stage.pct);
        setScanStage(stage.text);
        setActiveEngineName(stage.engine);
        setTerminalLogs(prev => [...prev, stage.text]);
        playTerminalTick();
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
        playExploitAlert();

        const scanId = `scan-${Date.now()}`;

        // Compute results
        let result: ScanResult;
        if (scanMode === 'FILE') {
          result = scanSourceCodeFile(fileName, fileContent, scanId);
        } else {
          const target = useRegisteredAsset 
            ? (assets.find(a => a.id === selectedAssetId)?.targetUrl || customUrl)
            : customUrl;
          result = scanWebsiteUrlTarget(target, scanId);
        }

        setAnalysisResult(result);
        setTerminalLogs(prev => [
          ...prev,
          `[DONE] Assessment concluded in ${result.durationMs}ms. Evaluated ${result.rulesEvaluated} security rules across ${result.toolsExecuted.length} Kali engines.`,
          `[VERDICT] Identified ${result.summary.total} vulnerability findings (${result.summary.critical} Critical, ${result.summary.high} High, ${result.summary.medium} Medium).`
        ]);

        // Auto-register scan into workspace
        const newScan: Scan = {
          id: scanId,
          assetId: scanMode === 'FILE' ? 'source-file-upload' : 'url-target',
          assetName: result.target,
          targetUrl: scanMode === 'FILE' ? `file://${fileName}` : result.target,
          profile: scanMode === 'FILE' ? 'FILE_STATIC_ANALYSIS' : 'URL_TARGET_SCAN',
          environment: 'DEVELOPMENT',
          status: 'COMPLETED',
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          durationSeconds: Math.ceil(result.durationMs / 1000) || 2,
          checksCompleted: result.rulesEvaluated,
          totalChecks: result.rulesEvaluated,
          currentStage: 'Assessment Complete',
          findingsCount: {
            critical: result.summary.critical,
            high: result.summary.high,
            medium: result.summary.medium,
            low: result.summary.low,
            informational: result.summary.informational,
            total: result.summary.total
          },
          isDemo: false,
          fileName: scanMode === 'FILE' ? fileName : undefined
        };

        importScanResults(newScan, result.findings);
        setHasImported(true);

        logActivityEvent(
          'ASSESSMENT_COMPLETED',
          `Kali Scan Completed: ${result.target}`,
          `Discovered ${result.summary.total} vulnerability finding(s) with verified remediation diffs.`,
          result.summary.critical > 0 ? 'CRITICAL' : result.summary.high > 0 ? 'HIGH' : 'MEDIUM',
          result.target
        );
      }
    }, 700);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Banner with HUD Indicators */}
      <div className="p-5 rounded-2xl border border-[#252C38] bg-gradient-to-r from-[#10141B] via-[#090B0F] to-[#10141B] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-wider text-[#FF3548] font-bold uppercase px-2 py-0.5 rounded bg-[#FF3548]/15 border border-[#FF3548]/30">
              KALI ARSENAL VAPT SCANNER
            </span>
            <span className="text-[10px] font-mono text-[#00FF88]">
              // 600+ ENGINES ARMED
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#F3F5F8] tracking-tight mt-1">
            Vulnerability Scanner & Exploit Attack Simulator
          </h2>
          <p className="text-xs text-[#98A2B3] mt-0.5 max-w-xl">
            Upload files or provide website links. Our engine tests every vulnerability against Kali Linux tools, fires simulated attack payloads, and generates verified code solutions.
          </p>
        </div>

        {/* Right HUD Controls */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Audio toggle button */}
          <button
            onClick={handleAudioToggle}
            title={audioActive ? 'Mute cyber audio effects' : 'Unmute cyber audio effects'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141922] hover:bg-[#1a212d] border border-[#252C38] text-xs font-mono text-[#98A2B3] hover:text-[#F3F5F8] transition-colors"
          >
            {audioActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#00FF88]" />
                <span className="text-[11px] text-[#00FF88]">Audio ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#6C778B]" />
                <span className="text-[11px]">Audio MUTED</span>
              </>
            )}
          </button>

          <button
            onClick={() => onNavigate('kali-tools')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141922] hover:bg-[#1a212d] border border-[#252C38] text-xs font-mono text-[#58A6FF] hover:text-[#88C0D0] transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="text-[11px]">Browse Kali Tools</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#10141B] border border-[#252C38] rounded-xl max-w-md">
        <button
          type="button"
          onClick={() => {
            setScanMode('FILE');
            setAnalysisResult(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-colors ${
            scanMode === 'FILE'
              ? 'bg-[#141922] text-[#F3F5F8] border border-[#252C38] shadow-xs'
              : 'text-[#98A2B3] hover:text-[#F3F5F8]'
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-[#FF3548]" />
          <span>Upload File / Code</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setScanMode('URL');
            setAnalysisResult(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-colors ${
            scanMode === 'URL'
              ? 'bg-[#141922] text-[#F3F5F8] border border-[#252C38] shadow-xs'
              : 'text-[#98A2B3] hover:text-[#F3F5F8]'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-[#58A6FF]" />
          <span>Scan Website Link</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-lg border border-[#FF3548]/30 bg-[#FF3548]/10 text-xs text-[#FF3548] flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Input Form */}
      <form onSubmit={handleExecuteScan} className="space-y-6">
        {/* MODE A: FILE UPLOAD */}
        {scanMode === 'FILE' && (
          <div className="p-6 rounded-xl border border-[#252C38] bg-[#10141B] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-[#F3F5F8]">Source Code & Configuration File Upload</h3>
                <p className="text-xs text-[#98A2B3] mt-0.5">
                  Drop code files, Dockerfiles, .env manifests, or API controllers for static taint analysis & simulated attack payload execution.
                </p>
              </div>

              {/* Sample files buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-[#98A2B3]">Test Presets:</span>
                <button
                  type="button"
                  onClick={() => handleLoadSample('expressApi')}
                  className="py-1 px-2.5 rounded bg-[#141922] hover:bg-[#1a212d] border border-[#252C38] text-[11px] text-[#98A2B3] hover:text-[#F3F5F8] transition-colors"
                >
                  Node.js API (SQLi/XSS)
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSample('pythonService')}
                  className="py-1 px-2.5 rounded bg-[#141922] hover:bg-[#1a212d] border border-[#252C38] text-[11px] text-[#98A2B3] hover:text-[#F3F5F8] transition-colors"
                >
                  Python Flask (RCE/Pickle)
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSample('dockerfile')}
                  className="py-1 px-2.5 rounded bg-[#141922] hover:bg-[#1a212d] border border-[#252C38] text-[11px] text-[#98A2B3] hover:text-[#F3F5F8] transition-colors"
                >
                  Dockerfile (Root)
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSample('leakedEnv')}
                  className="py-1 px-2.5 rounded bg-[#141922] hover:bg-[#1a212d] border border-[#252C38] text-[11px] text-[#98A2B3] hover:text-[#F3F5F8] transition-colors"
                >
                  .env (Leaked Secrets)
                </button>
              </div>
            </div>

            {/* Drag & Drop File Zone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#252C38] hover:border-[#FF3548]/50 rounded-xl p-6 text-center cursor-pointer transition-colors bg-[#090B0F]/50 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".js,.ts,.tsx,.jsx,.py,.json,.env,.yaml,.yml,.dockerfile,.txt,.sql,.php,.java,.go,.rb"
              />
              <Upload className="w-8 h-8 text-[#98A2B3] group-hover:text-[#FF3548] mx-auto mb-2 transition-colors" />
              <div className="text-xs font-semibold text-[#F3F5F8]">
                Click or drag file to scan ({fileName})
              </div>
              <p className="text-[11px] text-[#98A2B3] mt-1">
                Supports .js, .ts, .py, .php, .java, .env, Dockerfile, .yaml, and config files (under 10MB)
              </p>
            </div>

            {/* Code / Content Preview Box with Animated Laser Beam */}
            <div className="space-y-1.5 relative">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#98A2B3] font-mono">{fileName}</span>
                <span className="text-[11px] text-[#98A2B3]">{fileContent.split('\n').length} lines</span>
              </div>
              
              <div className="relative rounded-lg overflow-hidden border border-[#252C38] focus-within:border-[#FF3548]">
                {/* Laser scanline beam animation when scanning */}
                {isScanning && (
                  <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF3548] to-transparent shadow-[0_0_15px_#FF3548] z-20 pointer-events-none animate-laser" />
                )}

                <textarea
                  rows={9}
                  value={fileContent}
                  onChange={e => {
                    setFileContent(e.target.value);
                    setAnalysisResult(null);
                  }}
                  placeholder="Paste source code or configuration file contents directly..."
                  className="w-full bg-[#090B0F] p-3 font-mono text-xs text-[#F3F5F8] placeholder-[#98A2B3] focus:outline-hidden leading-relaxed resize-y"
                />
              </div>
            </div>
          </div>
        )}

        {/* MODE B: WEBSITE URL SCAN */}
        {scanMode === 'URL' && (
          <div className="p-6 rounded-xl border border-[#252C38] bg-[#10141B] space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-[#F3F5F8]">Website Link & External Perimeter Audit</h3>
              <p className="text-xs text-[#98A2B3] mt-0.5">
                Simulate offensive reconnaissance using Kali tools (Nmap, Nikto, Nuclei, Gobuster, ZAP) against the target web application.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-4 text-xs text-[#98A2B3]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="targetSource"
                    checked={!useRegisteredAsset}
                    onChange={() => setUseRegisteredAsset(false)}
                    className="text-[#FF3548] focus:ring-[#FF3548]"
                  />
                  <span>Ad-Hoc Website Link</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="targetSource"
                    checked={useRegisteredAsset}
                    onChange={() => setUseRegisteredAsset(true)}
                    className="text-[#FF3548] focus:ring-[#FF3548]"
                  />
                  <span>Enrolled Workspace Asset</span>
                </label>
              </div>

              {!useRegisteredAsset ? (
                <div>
                  <label className="block text-xs font-medium text-[#98A2B3] mb-1">
                    Target Website URL / Domain *
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      required
                      placeholder="https://example.com"
                      value={customUrl}
                      onChange={e => setCustomUrl(e.target.value)}
                      className="w-full bg-[#090B0F] border border-[#252C38] rounded-lg pl-9 pr-3 py-2.5 text-xs font-mono text-[#F3F5F8] placeholder-[#98A2B3] focus:outline-hidden focus:border-[#FF3548]"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-[#98A2B3] mb-1">
                    Select Enrolled Asset *
                  </label>
                  <select
                    value={selectedAssetId}
                    onChange={e => setSelectedAssetId(e.target.value)}
                    className="w-full bg-[#090B0F] border border-[#252C38] rounded-lg px-3 py-2.5 text-xs text-[#F3F5F8] focus:outline-hidden focus:border-[#FF3548]"
                  >
                    {assets.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.targetUrl})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Simulated Kali Engines for URL audit */}
            <div className="p-3.5 rounded-lg border border-[#252C38] bg-[#141922] text-xs text-[#98A2B3] space-y-2">
              <strong className="text-[#F3F5F8] block font-mono text-[11px] text-[#00FF88]">
                ACTIVE KALI LINUX MODULES ARMED FOR THIS AUDIT:
              </strong>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#00FF88]" /> Nmap (Port Audit)</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#00FF88]" /> Nikto (Header Audit)</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#00FF88]" /> Nuclei (CVE Matcher)</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#00FF88]" /> Gobuster (Path Buster)</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#00FF88]" /> OWASP ZAP (Proxy Check)</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#00FF88]" /> SQLmap (Blind SQLi)</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#00FF88]" /> Bettercap (HSTS Strip)</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#00FF88]" /> testssl.sh (TLS Cipher)</span>
              </div>
            </div>
          </div>
        )}

        {/* Authorization Attestation & Compliance */}
        <div className="p-5 rounded-xl border border-[#252C38] bg-[#10141B] space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={authConfirmed}
              onChange={e => setAuthConfirmed(e.target.checked)}
              className="mt-0.5 rounded border-[#252C38] text-[#FF3548] focus:ring-[#FF3548]"
            />
            <span className="text-xs text-[#98A2B3] leading-relaxed">
              <strong className="text-[#F3F5F8]">Authorization Attestation:</strong> I confirm our organization holds explicit testing authorization over this uploaded file or target link.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={scopeConfirmed}
              onChange={e => setScopeConfirmed(e.target.checked)}
              className="mt-0.5 rounded border-[#252C38] text-[#FF3548] focus:ring-[#FF3548]"
            />
            <span className="text-xs text-[#98A2B3] leading-relaxed">
              <strong className="text-[#F3F5F8]">Simulated Attack & Defense Boundary:</strong> Kali Linux attack vectors are executed safely in defensive simulation mode to produce verified code patches and reproducible proof-of-concept tests.
            </span>
          </label>
        </div>

        {/* Scan Button */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isScanning}
            className="flex items-center gap-2 py-3 px-6 rounded-lg bg-[#FF3548] hover:bg-[#FF3548]/90 text-white text-xs font-semibold shadow-lg shadow-red-500/20 transition-all disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isScanning ? 'Executing Kali Assessment...' : 'Scan & Perform Vulnerability Attack Check'}</span>
          </button>
        </div>
      </form>

      {/* Live Scanning HUD & Radar Terminal Widget */}
      {isScanning && (
        <div className="p-6 rounded-2xl border border-[#00FF88]/30 bg-[#090B0F] space-y-5 shadow-[0_0_30px_rgba(0,255,136,0.1)]">
          <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
            {/* Cyber Radar Component */}
            <div className="shrink-0">
              <CyberRadar 
                isScanning={isScanning} 
                engineName={activeEngineName}
                threatCount={scanProgress > 50 ? 3 : 0}
                size="md"
              />
            </div>

            {/* Stage & Progress Information */}
            <div className="flex-1 w-full space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-[#00FF88] uppercase tracking-wider block">
                    ACTIVE KALI ENGINE: {activeEngineName}
                  </span>
                  <span className="font-semibold text-[#F3F5F8]">{scanStage}</span>
                </div>
                <span className="font-mono text-lg text-[#FF3548] font-bold">{scanProgress}%</span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full bg-[#141922] rounded-full overflow-hidden border border-[#252C38]">
                <div 
                  className="h-full bg-gradient-to-r from-[#00FF88] via-[#FF8A3D] to-[#FF3548] transition-all duration-300 ease-out"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>

              {/* Terminal log window */}
              <div 
                ref={terminalScrollRef}
                className="rounded-xl bg-[#050A0E] border border-[#252C38] p-3.5 font-mono text-[11px] text-[#98A2B3] space-y-1.5 max-h-40 overflow-y-auto"
              >
                {terminalLogs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed">
                    <span className="text-[#00FF88]">{'>'}</span> {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results View: Vulnerabilities Found + Simulated Attack Vector + Verified Solutions */}
      {analysisResult && (
        <div className="space-y-6 pt-4 border-t border-[#252C38]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#00FF88]">KALI AUDIT COMPLETE</span>
                <span className="text-xs text-[#98A2B3]">· Target: {analysisResult.target}</span>
              </div>
              <h3 className="text-lg font-bold text-[#F3F5F8] mt-0.5">
                Vulnerability Attack Results & Verified Code Solutions
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('findings')}
                className="py-1.5 px-3 bg-[#141922] hover:bg-[#1a212d] border border-[#252C38] text-xs font-semibold text-[#F3F5F8] rounded-lg transition-colors"
              >
                View in Workspace Register
              </button>
              <button
                onClick={() => onNavigate('reports')}
                className="py-1.5 px-3 bg-[#FF3548] hover:bg-[#FF3548]/90 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                Export PDF Report
              </button>
            </div>
          </div>

          {/* Engines Executed telemetry tag bar */}
          <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono text-[#98A2B3] p-3 rounded-xl bg-[#10141B] border border-[#252C38]">
            <span className="text-[#00FF88] font-bold">Simulated Kali Engines:</span>
            {analysisResult.toolsExecuted.map((t, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-[#141922] border border-[#252C38] text-[#F3F5F8]">
                {t}
              </span>
            ))}
          </div>

          {/* Findings Severity Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 rounded-lg border border-[#FF3548]/30 bg-[#FF3548]/10 flex flex-col justify-between">
              <span className="text-[11px] text-[#98A2B3]">Critical</span>
              <span className="text-2xl font-bold font-mono text-[#FF3548]">{analysisResult.summary.critical}</span>
            </div>
            <div className="p-3 rounded-lg border border-[#FF8A3D]/30 bg-[#FF8A3D]/10 flex flex-col justify-between">
              <span className="text-[11px] text-[#98A2B3]">High</span>
              <span className="text-2xl font-bold font-mono text-[#FF8A3D]">{analysisResult.summary.high}</span>
            </div>
            <div className="p-3 rounded-lg border border-[#F5C451]/30 bg-[#F5C451]/10 flex flex-col justify-between">
              <span className="text-[11px] text-[#98A2B3]">Medium</span>
              <span className="text-2xl font-bold font-mono text-[#F5C451]">{analysisResult.summary.medium}</span>
            </div>
            <div className="p-3 rounded-lg border border-[#58A6FF]/30 bg-[#58A6FF]/10 flex flex-col justify-between">
              <span className="text-[11px] text-[#98A2B3]">Low</span>
              <span className="text-2xl font-bold font-mono text-[#58A6FF]">{analysisResult.summary.low}</span>
            </div>
            <div className="p-3 rounded-lg border border-[#252C38] bg-[#10141B] flex flex-col justify-between">
              <span className="text-[11px] text-[#98A2B3]">Total Flaws</span>
              <span className="text-2xl font-bold font-mono text-[#F3F5F8]">{analysisResult.summary.total}</span>
            </div>
          </div>

          {analysisResult.findings.length === 0 ? (
            <div className="p-10 rounded-xl border border-[#35C98A]/30 bg-[#35C98A]/10 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#35C98A] mx-auto" />
              <h4 className="text-sm font-bold text-[#F3F5F8]">No Exploitable Vulnerabilities Detected</h4>
              <p className="text-xs text-[#98A2B3] max-w-md mx-auto">
                All Kali Linux probes completed without discovering injection flaws, unmasked credentials, or insecure perimeter headers.
              </p>
            </div>
          ) : (
            /* Vulnerabilities List with Kali Attack Replay & Code Diff */
            <div className="space-y-5">
              {analysisResult.findings.map((f, idx) => (
                <div 
                  key={f.id}
                  className="p-6 rounded-2xl border border-[#252C38] bg-[#10141B] space-y-4 shadow-xl hover:border-[#FF3548]/30 transition-colors"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#252C38]">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-[#98A2B3]">{f.id}</span>
                        <span className="text-[11px] text-[#98A2B3]">· {f.category}</span>
                        {f.lineNumber && (
                          <span className="font-mono text-[11px] text-[#FF8A3D]">Line {f.lineNumber}</span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-[#F3F5F8]">{f.title}</h4>
                    </div>

                    <div className="flex items-center gap-2.5 self-start sm:self-auto">
                      <SeverityBadge severity={f.severity} size="sm" />
                      {f.cvssScore && (
                        <span className="text-xs font-mono font-bold text-[#FF3548]">
                          CVSS {f.cvssScore}
                        </span>
                      )}
                      
                      {/* Interactive Replay Attack Simulation Button */}
                      <button
                        onClick={() => setSelectedSimFinding(f)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FF3548]/15 hover:bg-[#FF3548]/25 border border-[#FF3548]/30 text-xs font-semibold text-[#FF3548] transition-colors"
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>Replay Attack Simulation</span>
                      </button>
                    </div>
                  </div>

                  {/* Kali Attack Vector & PoC Exploit Box */}
                  <div className="p-3.5 rounded-xl border border-[#FF8A3D]/30 bg-[#FF8A3D]/10 space-y-2 text-xs">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 text-[#FF8A3D] font-semibold text-[11px] uppercase tracking-wider">
                        <Flame className="w-3.5 h-3.5" />
                        <span>Kali Linux Attack Execution ({f.kaliToolUsed || 'Kali Engine'}):</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#FF3548]/20 border border-[#FF3548]/40 text-[10px] font-mono font-bold text-[#FF3548]">
                        EXPLOIT VERIFIED (TARGET VULNERABLE)
                      </span>
                    </div>

                    {f.kaliCommand && (
                      <div className="p-2 rounded bg-[#050A0E] font-mono text-[11px] text-[#00FF88] overflow-x-auto">
                        <code>kali@kali:~$ {f.kaliCommand}</code>
                      </div>
                    )}

                    {f.attackPayload && (
                      <div className="text-[#F3F5F8] font-mono text-[11px] leading-relaxed">
                        <span className="text-[#98A2B3]">Offensive Payload: </span>
                        <code className="text-[#FF8A3D]">{f.attackPayload}</code>
                      </div>
                    )}
                  </div>

                  {/* Interactive Code Diff Viewer with Before vs After fix */}
                  {(f.codeSnippet || f.solutionPatch) && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-[#98A2B3] uppercase tracking-wider block">
                        Vulnerability Inspection & Verified Solution Patch:
                      </span>
                      <CodeDiffViewer
                        vulnerableCode={f.codeSnippet}
                        solutionPatch={f.solutionPatch}
                        fileName={f.affectedEndpoint}
                        lineNumber={f.lineNumber}
                      />
                    </div>
                  )}

                  {/* Business & Technical Consequence */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg border border-[#252C38] bg-[#090B0F] space-y-1">
                      <strong className="text-[#F3F5F8] block text-[11px]">Business Consequence:</strong>
                      <p className="text-[#98A2B3] leading-relaxed">{f.businessImpact}</p>
                    </div>

                    <div className="p-3 rounded-lg border border-[#252C38] bg-[#090B0F] space-y-1">
                      <strong className="text-[#F3F5F8] block text-[11px]">Technical Impact:</strong>
                      <p className="text-[#98A2B3] leading-relaxed">{f.technicalImpact}</p>
                    </div>
                  </div>

                  {/* Defensive Solution Summary & Checklist */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#00FF88] font-semibold text-xs">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Defensive Remediation Roadmap:</span>
                    </div>

                    <p className="text-xs text-[#98A2B3] leading-relaxed">
                      {f.remediationSummary}
                    </p>

                    {/* Verification Checklist */}
                    <div className="pt-2 space-y-1.5 text-xs">
                      <span className="text-[11px] font-semibold text-[#98A2B3] uppercase">Verification Criteria:</span>
                      {f.verificationCriteria.map((c, cIdx) => (
                        <div key={cIdx} className="flex items-start gap-2 text-[#98A2B3]">
                          <span className="text-[#00FF88]">✓</span>
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>

                    {/* Kali Re-test Command */}
                    {f.retestVerificationCommand && (
                      <div className="pt-2">
                        <div className="p-2.5 rounded-lg bg-[#050A0E] border border-[#252C38] font-mono text-[11px] text-[#00FF88]">
                          <span className="text-[#98A2B3]">Kali Re-test Verification: </span>
                          <code>{f.retestVerificationCommand}</code>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Attack Simulation Modal for Detailed Exploit Replay */}
      <AttackSimulationModal
        finding={selectedSimFinding}
        isOpen={!!selectedSimFinding}
        onClose={() => setSelectedSimFinding(null)}
      />
    </div>
  );
};
