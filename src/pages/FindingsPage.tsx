import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  MessageSquare, 
  ShieldCheck, 
  Layers,
  ChevronDown,
  Flame,
  Terminal
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { Finding, FindingStatus, Severity } from '../types/security';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { CodeDiffViewer } from '../components/ui/CodeDiffViewer';
import { AttackSimulationModal } from '../components/ui/AttackSimulationModal';
import { exportFindingsToCSV } from '../services/csvExportService';

interface FindingsPageProps {
  initialSelectedFindingId?: string;
}

export const FindingsPage: React.FC<FindingsPageProps> = ({ 
  initialSelectedFindingId 
}) => {
  const { findings, assets, updateFindingStatus, assignFindingOwner, addFindingNote } = useSecurity();

  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterAsset, setFilterAsset] = useState<string>('ALL');
  
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(() => {
    if (initialSelectedFindingId) {
      return findings.find(f => f.id === initialSelectedFindingId) || null;
    }
    return null;
  });

  const [noteInput, setNoteInput] = useState('');
  const [newOwnerInput, setNewOwnerInput] = useState('');
  const [simulationFinding, setSimulationFinding] = useState<Finding | null>(null);

  const filteredFindings = findings.filter(f => {
    const matchSearch = f.title.toLowerCase().includes(search.toLowerCase()) ||
                        f.id.toLowerCase().includes(search.toLowerCase()) ||
                        f.affectedEndpoint.toLowerCase().includes(search.toLowerCase()) ||
                        f.category.toLowerCase().includes(search.toLowerCase());
    const matchSev = filterSeverity === 'ALL' || f.severity === filterSeverity;
    const matchStat = filterStatus === 'ALL' || f.status === filterStatus;
    const matchAsset = filterAsset === 'ALL' || f.assetId === filterAsset;
    return matchSearch && matchSev && matchStat && matchAsset;
  });

  // Summary counts
  const critCount = findings.filter(f => f.severity === 'CRITICAL').length;
  const highCount = findings.filter(f => f.severity === 'HIGH').length;
  const medCount = findings.filter(f => f.severity === 'MEDIUM').length;
  const lowCount = findings.filter(f => f.severity === 'LOW').length;
  const fixedCount = findings.filter(f => f.status === 'FIXED').length;

  const handleStatusChange = (newStatus: FindingStatus) => {
    if (!selectedFinding) return;
    updateFindingStatus(selectedFinding.id, newStatus);
    setSelectedFinding(prev => prev ? { ...prev, status: newStatus } : null);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFinding || !noteInput.trim()) return;
    addFindingNote(selectedFinding.id, noteInput.trim());
    const updatedNotes = [
      ...(selectedFinding.notes || []),
      {
        id: `note-${Date.now()}`,
        author: 'Security Analyst',
        timestamp: new Date().toISOString(),
        text: noteInput.trim()
      }
    ];
    setSelectedFinding(prev => prev ? { ...prev, notes: updatedNotes } : null);
    setNoteInput('');
  };

  const handleAssignOwner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFinding || !newOwnerInput.trim()) return;
    assignFindingOwner(selectedFinding.id, newOwnerInput.trim());
    setSelectedFinding(prev => prev ? { ...prev, assignedOwner: newOwnerInput.trim() } : null);
    setNewOwnerInput('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#F3F5F8] tracking-tight">Security Findings</h2>
          <p className="mt-1 text-xs text-[#98A2B3]">
            Triage detected exposures, coordinate developer remediation, and verify defensive resolutions.
          </p>
        </div>

        <button
          onClick={() => exportFindingsToCSV(filteredFindings)}
          className="flex items-center gap-1.5 py-2 px-3.5 bg-[#141922] hover:bg-[#1a212d] text-[#F3F5F8] border border-[#252C38] rounded-lg text-xs font-medium transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV ({filteredFindings.length})</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="p-4 rounded-xl border border-[#252C38] bg-[#10141B] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <span>Total Findings: <strong className="font-mono text-[#F3F5F8]">{findings.length}</strong></span>
          <span className="text-[#FF3548]">Critical: <strong className="font-mono">{critCount}</strong></span>
          <span className="text-[#FF8A3D]">High: <strong className="font-mono">{highCount}</strong></span>
          <span className="text-[#F5C451]">Medium: <strong className="font-mono">{medCount}</strong></span>
          <span className="text-[#58A6FF]">Low: <strong className="font-mono">{lowCount}</strong></span>
        </div>
        <div className="text-[#35C98A] flex items-center gap-1.5 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{fixedCount} Resolved & Verified</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, ID, endpoint..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#10141B] border border-[#252C38] rounded-lg pl-9 pr-3 py-2 text-xs text-[#F3F5F8] placeholder-[#98A2B3] focus:outline-hidden focus:border-[#FF3548]"
          />
        </div>

        {/* Filter Dropdowns & Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Severity Filter */}
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            className="bg-[#10141B] border border-[#252C38] rounded-lg px-2.5 py-1.5 text-xs text-[#F3F5F8] focus:outline-hidden focus:border-[#FF3548]"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
            <option value="INFORMATIONAL">Informational</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-[#10141B] border border-[#252C38] rounded-lg px-2.5 py-1.5 text-xs text-[#F3F5F8] focus:outline-hidden focus:border-[#FF3548]"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="FIXED">Fixed</option>
            <option value="RETEST_REQUIRED">Retest Needed</option>
            <option value="ACCEPTED_RISK">Accepted Risk</option>
            <option value="FALSE_POSITIVE">False Positive</option>
          </select>

          {/* Asset Filter */}
          <select
            value={filterAsset}
            onChange={e => setFilterAsset(e.target.value)}
            className="bg-[#10141B] border border-[#252C38] rounded-lg px-2.5 py-1.5 text-xs text-[#F3F5F8] focus:outline-hidden focus:border-[#FF3548]"
          >
            <option value="ALL">All Assets</option>
            {assets.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Findings Table */}
      <div className="rounded-xl border border-[#252C38] bg-[#10141B] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141922] text-[#98A2B3] font-medium border-b border-[#252C38]">
              <tr>
                <th className="py-3 px-4">Finding</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Asset & Endpoint</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252C38]">
              {filteredFindings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#98A2B3]">
                    No findings match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredFindings.map(finding => (
                  <tr 
                    key={finding.id} 
                    onClick={() => setSelectedFinding(finding)}
                    className="hover:bg-[#141922]/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[11px] text-[#98A2B3]">{finding.id}</span>
                        <span className="text-[11px] text-[#98A2B3]">· {finding.category}</span>
                      </div>
                      <div className="font-semibold text-[#F3F5F8] hover:text-[#FF3548] transition-colors line-clamp-1">
                        {finding.title}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <SeverityBadge severity={finding.severity} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#F3F5F8]">{finding.assetName}</div>
                      <div className="font-mono text-[11px] text-[#98A2B3] truncate max-w-xs">{finding.affectedEndpoint}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={finding.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-[#98A2B3]">
                      {finding.assignedOwner || 'Unassigned'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedFinding(finding);
                        }}
                        className="py-1 px-2.5 rounded border border-[#252C38] hover:border-[#3B4556] text-[#F3F5F8] text-[11px] font-medium transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Finding Detail Modal / Drawer */}
      <Modal
        isOpen={Boolean(selectedFinding)}
        onClose={() => setSelectedFinding(null)}
        title={selectedFinding ? `${selectedFinding.id}: ${selectedFinding.title}` : 'Finding Details'}
        subtitle={selectedFinding ? `Asset: ${selectedFinding.assetName} • Category: ${selectedFinding.category}` : undefined}
        maxWidth="3xl"
      >
        {selectedFinding && (
          <div className="space-y-6 text-xs text-[#F3F5F8]">
            {/* Top Quick Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg border border-[#252C38] bg-[#141922]">
              <div className="flex items-center gap-3">
                <SeverityBadge severity={selectedFinding.severity} />
                <StatusBadge status={selectedFinding.status} />
                <span className="text-[11px] text-[#98A2B3]">
                  Confidence: <strong className="text-[#F3F5F8]">{selectedFinding.confidence}</strong>
                </span>
              </div>

              {/* Status Transition Control & Replay Button */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setSimulationFinding(selectedFinding)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FF3548]/15 hover:bg-[#FF3548]/25 border border-[#FF3548]/30 text-xs font-semibold text-[#FF3548] transition-colors"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Replay Attack Simulation</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-[#98A2B3] text-[11px]">Workflow:</span>
                  <select
                    value={selectedFinding.status}
                    onChange={e => handleStatusChange(e.target.value as FindingStatus)}
                    className="bg-[#090B0F] border border-[#252C38] rounded-md px-2 py-1 text-xs text-[#F3F5F8] focus:outline-hidden focus:border-[#FF3548]"
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="FIXED">Fixed (Reported)</option>
                    <option value="RETEST_REQUIRED">Retest Needed</option>
                    <option value="ACCEPTED_RISK">Accepted Risk</option>
                    <option value="FALSE_POSITIVE">False Positive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Affected Endpoint & First Detected */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-[#252C38] bg-[#090B0F]">
                <div className="text-[11px] text-[#98A2B3]">Affected Endpoint / Component</div>
                <div className="font-mono text-[#F3F5F8] mt-1 break-all">
                  {selectedFinding.affectedEndpoint}
                </div>
              </div>

              <div className="p-3 rounded-lg border border-[#252C38] bg-[#090B0F]">
                <div className="text-[11px] text-[#98A2B3]">Detection Method & Standards</div>
                <div className="mt-1 text-[#F3F5F8]">
                  {selectedFinding.cweIds.join(', ')} {selectedFinding.owaspCategory ? `· ${selectedFinding.owaspCategory}` : ''}
                </div>
              </div>
            </div>

            {/* Interactive Code Diff Viewer if codeSnippet or solutionPatch present */}
            {(selectedFinding.codeSnippet || selectedFinding.solutionPatch) && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-[#98A2B3] uppercase tracking-wider block">
                  Vulnerability Inspection & Remediation Patch:
                </span>
                <CodeDiffViewer
                  vulnerableCode={selectedFinding.codeSnippet}
                  solutionPatch={selectedFinding.solutionPatch}
                  fileName={selectedFinding.affectedEndpoint}
                  lineNumber={selectedFinding.lineNumber}
                />
              </div>
            )}

            {/* Simulated Attack Vector */}
            {selectedFinding.simulatedAttackVector && (
              <div className="p-3.5 rounded-lg border border-[#FF8A3D]/25 bg-[#FF8A3D]/10 space-y-1">
                <div className="flex items-center gap-1.5 text-[#FF8A3D] font-semibold text-xs">
                  <span>Simulated Attack Vector & Exploit Demonstration:</span>
                </div>
                <p className="text-[#F3F5F8] font-mono text-xs leading-relaxed">
                  {selectedFinding.simulatedAttackVector}
                </p>
              </div>
            )}

            {/* Impact Section */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-[#F3F5F8]">Business & Technical Impact</h4>
              <div className="space-y-2">
                <div className="p-3 rounded-lg border border-[#252C38] bg-[#090B0F]">
                  <strong className="text-[#FF8A3D] block text-[11px] mb-1">Business Consequence:</strong>
                  <p className="text-[#98A2B3] leading-relaxed">{selectedFinding.businessImpact}</p>
                </div>
                <div className="p-3 rounded-lg border border-[#252C38] bg-[#090B0F]">
                  <strong className="text-[#58A6FF] block text-[11px] mb-1">Technical Behavior:</strong>
                  <p className="text-[#98A2B3] leading-relaxed">{selectedFinding.technicalImpact}</p>
                </div>
              </div>
            </div>

            {/* Evidence Summary */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-[#F3F5F8]">Diagnostic Evidence</h4>
              <pre className="p-3.5 rounded-lg border border-[#252C38] bg-[#090B0F] font-mono text-[11px] text-[#35C98A] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {selectedFinding.evidence}
              </pre>
            </div>

            {/* Remediation Steps Checklist */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-[#F3F5F8]">Prioritized Developer Remediation Checklist</h4>
              <div className="p-3.5 rounded-lg border border-[#252C38] bg-[#090B0F] space-y-2">
                {selectedFinding.remediationSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#35C98A] mt-0.5 shrink-0" />
                    <span className="text-[#F3F5F8] leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Criteria */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-[#F3F5F8]">Resolution Verification Criteria</h4>
              <div className="p-3.5 rounded-lg border border-[#252C38] bg-[#090B0F] space-y-2">
                {selectedFinding.verificationCriteria.map((crit, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#58A6FF] mt-0.5 shrink-0" />
                    <span className="text-[#98A2B3] leading-relaxed">{crit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Owner Assignment & Notes Log */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#252C38]">
              {/* Owner Assignment */}
              <div className="space-y-2">
                <h5 className="font-semibold text-xs text-[#F3F5F8]">Assign Lead Engineer</h5>
                <form onSubmit={handleAssignOwner} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={selectedFinding.assignedOwner || "Enter engineer name"}
                    value={newOwnerInput}
                    onChange={e => setNewOwnerInput(e.target.value)}
                    className="flex-1 bg-[#090B0F] border border-[#252C38] rounded-md px-2.5 py-1.5 text-xs text-[#F3F5F8] placeholder-[#98A2B3] focus:outline-hidden focus:border-[#FF3548]"
                  />
                  <button
                    type="submit"
                    className="py-1.5 px-3 rounded-md bg-[#141922] hover:bg-[#1a212d] border border-[#252C38] text-xs font-medium text-[#F3F5F8] transition-colors"
                  >
                    Assign
                  </button>
                </form>
              </div>

              {/* Add Note */}
              <div className="space-y-2">
                <h5 className="font-semibold text-xs text-[#F3F5F8]">Log Remediation Note</h5>
                <form onSubmit={handleAddNote} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. PR #418 deployed to staging..."
                    value={noteInput}
                    onChange={e => setNoteInput(e.target.value)}
                    className="flex-1 bg-[#090B0F] border border-[#252C38] rounded-md px-2.5 py-1.5 text-xs text-[#F3F5F8] placeholder-[#98A2B3] focus:outline-hidden focus:border-[#FF3548]"
                  />
                  <button
                    type="submit"
                    className="py-1.5 px-3 rounded-md bg-[#FF3548] hover:bg-[#FF3548]/90 text-white text-xs font-semibold transition-colors"
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>

            {/* Notes History */}
            {selectedFinding.notes && selectedFinding.notes.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-semibold text-[#98A2B3] uppercase tracking-wider">
                  Audit Notes History
                </div>
                <div className="space-y-2">
                  {selectedFinding.notes.map(n => (
                    <div key={n.id} className="p-2.5 rounded-lg border border-[#252C38] bg-[#090B0F] text-xs space-y-1">
                      <div className="flex justify-between text-[10px] text-[#98A2B3]">
                        <span className="font-medium text-[#F3F5F8]">{n.author}</span>
                        <span>{new Date(n.timestamp).toLocaleDateString()} {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-[#98A2B3] leading-relaxed">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Kali Attack Simulation Replay Modal */}
      <AttackSimulationModal
        finding={simulationFinding}
        isOpen={Boolean(simulationFinding)}
        onClose={() => setSimulationFinding(null)}
      />
    </div>
  );
};
