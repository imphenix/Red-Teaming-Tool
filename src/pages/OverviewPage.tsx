import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Plus, 
  ArrowUpRight, 
  ArrowRight,
  Clock,
  Layers,
  ChevronRight,
  Flame,
  Crosshair,
  ExternalLink
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SecurityPostureGauge } from '../components/ui/SecurityPostureGauge';
import { Severity } from '../types/security';

interface OverviewPageProps {
  onNavigate: (page: string, findingId?: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  const { metrics, scans, findings, events } = useSecurity();

  // Top 4 critical/high findings
  const highPriorityFindings = findings
    .filter(f => f.status !== 'FIXED' && f.status !== 'FALSE_POSITIVE')
    .sort((a, b) => {
      const order: Record<Severity, number> = { CRITICAL: 5, HIGH: 4, MEDIUM: 3, LOW: 2, INFORMATIONAL: 1 };
      return order[b.severity] - order[a.severity];
    })
    .slice(0, 4);

  const recentScans = scans.slice(0, 4);
  const recentEvents = events.slice(0, 5);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-[#35C98A] tracking-wider uppercase px-2 py-0.5 rounded bg-[#35C98A]/10 border border-[#35C98A]/30">
              Live Perimeter Active
            </span>
            <span className="text-xs text-[#98A2B3]">· Real-time assessment telemetry</span>
          </div>
          <h2 className="text-2xl font-bold text-[#F3F5F8] tracking-tight">Security Overview</h2>
          <p className="mt-1 text-xs text-[#98A2B3]">
            Understand your exposure and track remediation across assessed assets.
          </p>
        </div>

        <button
          onClick={() => onNavigate('scan-new')}
          className="flex items-center gap-1.5 py-2.5 px-4 bg-[#FF3548] hover:bg-[#FF3548]/90 text-white rounded-lg text-xs font-semibold crimson-glow transition-all whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Assessment</span>
        </button>
      </div>

      {/* Interactive Posture Gauge */}
      <SecurityPostureGauge
        criticalCount={metrics.severityDistribution.CRITICAL}
        highCount={metrics.severityDistribution.HIGH}
        mediumCount={metrics.severityDistribution.MEDIUM}
        lowCount={metrics.severityDistribution.LOW}
        fixedCount={metrics.statusDistribution.FIXED}
      />

      {/* Kali Linux Arsenal Quick HUD Banner */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[#FF3548]/30 bg-gradient-to-r from-[#10141B] via-[#141922] to-[#10141B] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#FF3548]/15 border border-[#FF3548]/30 shrink-0">
            <Flame className="w-6 h-6 text-[#FF3548] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#00FF88] font-bold uppercase tracking-wider">
                600+ KALI LINUX ENGINES INTEGRATED
              </span>
              <span className="text-[10px] text-[#98A2B3]">· Nmap, SQLmap, Nuclei, Nikto, Commix, Metasploit</span>
            </div>
            <h4 className="text-sm font-bold text-[#F3F5F8]">
              Automated Offensive Simulation & Verified Defensive Patches
            </h4>
            <p className="text-xs text-[#98A2B3] mt-0.5">
              Upload source code files or test website URLs to simulate weapons-grade attack vectors and generate verified code fixes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
          <button
            onClick={() => onNavigate('kali-tools')}
            className="py-2 px-3.5 rounded-lg bg-[#090B0F] hover:bg-[#141922] border border-[#252C38] text-xs font-semibold text-[#58A6FF] transition-colors"
          >
            Explore Arsenal
          </button>
          <button
            onClick={() => onNavigate('scan-new')}
            className="py-2 px-4 rounded-lg bg-[#FF3548] hover:bg-[#FF3548]/90 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Launch Kali Scan</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl cyber-surface space-y-3 hover:translate-y-[-2px] transition-transform">
          <div className="flex items-center justify-between text-xs text-[#98A2B3]">
            <span>Assets Assessed</span>
            <Layers className="w-4 h-4 text-[#98A2B3]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#F3F5F8] tabular-nums">
            {metrics.assetsAssessed}
          </div>
          <div className="text-[11px] text-[#98A2B3]">
            Active domains in authorized scope
          </div>
        </div>

        <div className="p-5 rounded-xl cyber-surface space-y-3 hover:translate-y-[-2px] transition-transform">
          <div className="flex items-center justify-between text-xs text-[#98A2B3]">
            <span>Completed Assessments</span>
            <FileText className="w-4 h-4 text-[#98A2B3]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#F3F5F8] tabular-nums">
            {metrics.completedAssessments}
          </div>
          <div className="text-[11px] text-[#35C98A]">
            100% non-destructive telemetry
          </div>
        </div>

        <div className="p-5 rounded-xl cyber-surface space-y-3 hover:translate-y-[-2px] transition-transform">
          <div className="flex items-center justify-between text-xs text-[#98A2B3]">
            <span>Open Findings</span>
            <AlertTriangle className="w-4 h-4 text-[#F5C451]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#F3F5F8] tabular-nums">
            {metrics.openFindings}
          </div>
          <div className="text-[11px] text-[#98A2B3]">
            Awaiting verification or triage
          </div>
        </div>

        <div className="p-5 rounded-xl cyber-surface space-y-3 hover:translate-y-[-2px] transition-transform">
          <div className="flex items-center justify-between text-xs text-[#98A2B3]">
            <span>Critical & High Findings</span>
            <ShieldAlert className="w-4 h-4 text-[#FF3548]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#FF3548] tabular-nums">
            {metrics.criticalHighCount}
          </div>
          <div className="text-[11px] text-[#FF3548]/90">
            Immediate remediation recommended
          </div>
        </div>
      </div>

      {/* Risk Summary & Severity Breakdown */}
      <div className="p-6 rounded-xl border border-[#252C38] bg-[#10141B] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-[#F3F5F8]">Severity Distribution</h3>
            <p className="text-xs text-[#98A2B3]">Defensive risk posture across all evaluated targets.</p>
          </div>
          <button
            onClick={() => onNavigate('findings')}
            className="text-xs text-[#FF3548] hover:text-[#FF3548]/80 font-medium flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Findings</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Severity Count Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          {[
            { label: 'Critical', count: metrics.severityDistribution.CRITICAL, color: 'text-[#FF3548]', bg: 'bg-[#FF3548]/10', border: 'border-[#FF3548]/20' },
            { label: 'High', count: metrics.severityDistribution.HIGH, color: 'text-[#FF8A3D]', bg: 'bg-[#FF8A3D]/10', border: 'border-[#FF8A3D]/20' },
            { label: 'Medium', count: metrics.severityDistribution.MEDIUM, color: 'text-[#F5C451]', bg: 'bg-[#F5C451]/10', border: 'border-[#F5C451]/20' },
            { label: 'Low', count: metrics.severityDistribution.LOW, color: 'text-[#58A6FF]', bg: 'bg-[#58A6FF]/10', border: 'border-[#58A6FF]/20' },
            { label: 'Informational', count: metrics.severityDistribution.INFORMATIONAL, color: 'text-[#8B95A7]', bg: 'bg-[#8B95A7]/10', border: 'border-[#8B95A7]/20' }
          ].map(item => (
            <div key={item.label} className={`p-3.5 rounded-lg border ${item.border} ${item.bg} flex flex-col justify-between`}>
              <span className="text-[11px] font-medium text-[#98A2B3]">{item.label}</span>
              <span className={`text-2xl font-bold font-mono mt-1 ${item.color} tabular-nums`}>
                {item.count}
              </span>
            </div>
          ))}
        </div>

        {/* Remediation Progress Mini Strip */}
        <div className="pt-3 border-t border-[#252C38] flex flex-wrap items-center justify-between gap-4 text-xs text-[#98A2B3]">
          <div className="flex items-center gap-6">
            <span>Open: <strong className="text-[#F3F5F8] font-mono">{metrics.statusDistribution.OPEN}</strong></span>
            <span>In Progress: <strong className="text-[#F3F5F8] font-mono">{metrics.statusDistribution.IN_PROGRESS}</strong></span>
            <span>Fixed: <strong className="text-[#35C98A] font-mono">{metrics.statusDistribution.FIXED}</strong></span>
            <span>Accepted Risk: <strong className="text-[#98A2B3] font-mono">{metrics.statusDistribution.ACCEPTED_RISK}</strong></span>
          </div>
          <button 
            onClick={() => onNavigate('reports')}
            className="text-xs text-[#98A2B3] hover:text-[#F3F5F8] flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Executive Report</span>
          </button>
        </div>
      </div>

      {/* Two Column Grid: Highest Priority Findings & Recent Assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Highest-Priority Findings */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#F3F5F8]">Highest-Priority Findings</h3>
            <button
              onClick={() => onNavigate('findings')}
              className="text-xs text-[#98A2B3] hover:text-[#F3F5F8] transition-colors"
            >
              See all ({findings.length})
            </button>
          </div>

          <div className="space-y-3">
            {highPriorityFindings.length === 0 ? (
              <div className="p-8 rounded-xl border border-[#252C38] bg-[#10141B] text-center text-xs text-[#98A2B3]">
                No open critical or high findings recorded.
              </div>
            ) : (
              highPriorityFindings.map(finding => (
                <div
                  key={finding.id}
                  onClick={() => onNavigate('findings', finding.id)}
                  className="p-4 rounded-xl border border-[#252C38] bg-[#10141B] hover:border-[#3B4556] cursor-pointer transition-colors space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[#98A2B3]">{finding.id}</span>
                        <span className="text-[11px] text-[#98A2B3]">· {finding.assetName}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-[#F3F5F8] hover:text-[#FF3548] transition-colors">
                        {finding.title}
                      </h4>
                    </div>
                    <SeverityBadge severity={finding.severity} size="sm" />
                  </div>

                  <p className="text-xs text-[#98A2B3] line-clamp-1">
                    {finding.businessImpact}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#252C38]/60 text-[11px] text-[#98A2B3]">
                    <span className="font-mono">{finding.affectedEndpoint}</span>
                    <StatusBadge status={finding.status} size="sm" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Recent Assessments & Activity */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Assessments */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#F3F5F8]">Recent Assessments</h3>
              <button
                onClick={() => onNavigate('scans')}
                className="text-xs text-[#98A2B3] hover:text-[#F3F5F8] transition-colors"
              >
                View all ({scans.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {recentScans.map(scan => (
                <div 
                  key={scan.id} 
                  className="p-3.5 rounded-lg border border-[#252C38] bg-[#10141B] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-medium text-[#F3F5F8]">{scan.assetName}</div>
                    <div className="text-[11px] text-[#98A2B3]">
                      {scan.profile.replace('_', ' ')} · {new Date(scan.startedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="text-right space-y-0.5">
                    <span className="font-mono text-[11px] text-[#35C98A]">
                      {scan.status}
                    </span>
                    <div className="text-[10px] text-[#98A2B3]">
                      {scan.findingsCount.total} findings
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-[#F3F5F8]">Recent Activity</h3>
            <div className="space-y-2.5">
              {recentEvents.map(evt => (
                <div key={evt.id} className="p-3 rounded-lg border border-[#252C38]/80 bg-[#10141B] space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-[#F3F5F8]">{evt.title}</span>
                    <span className="text-[#98A2B3] text-[10px]">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#98A2B3] leading-relaxed">
                    {evt.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
