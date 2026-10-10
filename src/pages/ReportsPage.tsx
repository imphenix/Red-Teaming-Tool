import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Eye, 
  Printer, 
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { generateSecurityReportPDF, ReportConfig } from '../services/pdfReportGenerator';
import { exportFindingsToCSV } from '../services/csvExportService';
import { SeverityBadge } from '../components/ui/SeverityBadge';

export const ReportsPage: React.FC = () => {
  const { assets, findings, scans, logActivityEvent } = useSecurity();

  const [reportType, setReportType] = useState<'EXECUTIVE' | 'TECHNICAL' | 'COMBINED'>('COMBINED');
  const [selectedAssetId, setSelectedAssetId] = useState<string>('ALL');
  const [includeRemediation, setIncludeRemediation] = useState(true);
  const [includeTechnicalAppendix, setIncludeTechnicalAppendix] = useState(true);
  const [includeMethodology, setIncludeMethodology] = useState(true);
  const [reportTitle, setReportTitle] = useState('CODE RED Security Assessment & Remediation Report');
  const [authorName, setAuthorName] = useState('Security Operations Team');

  // Filter findings for this report
  const reportFindings = findings.filter(f => {
    if (selectedAssetId === 'ALL') return true;
    return f.assetId === selectedAssetId;
  });

  const targetAssets = selectedAssetId === 'ALL' 
    ? assets 
    : assets.filter(a => a.id === selectedAssetId);

  const critCount = reportFindings.filter(f => f.severity === 'CRITICAL').length;
  const highCount = reportFindings.filter(f => f.severity === 'HIGH').length;
  const medCount = reportFindings.filter(f => f.severity === 'MEDIUM').length;
  const lowCount = reportFindings.filter(f => f.severity === 'LOW').length;

  const handleDownloadPDF = () => {
    const config: ReportConfig = {
      reportType,
      title: reportTitle,
      targetAssets,
      findings: reportFindings,
      scans,
      includeRemediation,
      includeTechnicalAppendix,
      includeMethodology,
      generatedBy: authorName
    };

    generateSecurityReportPDF(config);
    logActivityEvent(
      'REPORT_GENERATED',
      'Report Downloaded',
      `${reportType} security report generated for ${targetAssets.length} asset(s).`
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#F3F5F8] tracking-tight">Security Assessment Reports</h2>
        <p className="mt-1 text-xs text-[#98A2B3]">
          Generate and export publication-ready executive risk summaries and technical remediation reports.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (5 cols): Report Configuration */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-xl border border-[#252C38] bg-[#10141B] space-y-5">
            <h3 className="text-sm font-semibold text-[#F3F5F8]">Report Parameters</h3>

            {/* Format Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#98A2B3]">Report Format</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'COMBINED', label: 'Combined' },
                  { id: 'EXECUTIVE', label: 'Executive' },
                  { id: 'TECHNICAL', label: 'Technical' }
                ].map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setReportType(type.id as any)}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all text-center whitespace-nowrap ${
                      reportType === type.id
                        ? 'border-[#FF3548] bg-[#FF3548]/10 text-[#FF3548]'
                        : 'border-[#252C38] bg-[#141922] text-[#98A2B3] hover:text-[#F3F5F8]'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Scope */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#98A2B3]">Asset Scope</label>
              <select
                value={selectedAssetId}
                onChange={e => setSelectedAssetId(e.target.value)}
                className="w-full bg-[#090B0F] border border-[#252C38] rounded-lg px-3 py-2 text-xs text-[#F3F5F8] focus:outline-hidden focus:border-[#FF3548]"
              >
                <option value="ALL">All Enrolled Assets ({assets.length})</option>
                {assets.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.environment})</option>
                ))}
              </select>
            </div>

            {/* Report Title */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#98A2B3]">Document Title</label>
              <input
                type="text"
                value={reportTitle}
                onChange={e => setReportTitle(e.target.value)}
                className="w-full bg-[#090B0F] border border-[#252C38] rounded-lg px-3 py-2 text-xs text-[#F3F5F8] focus:outline-hidden focus:border-[#FF3548]"
              />
            </div>

            {/* Author / Preparer */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#98A2B3]">Prepared By</label>
              <input
                type="text"
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                className="w-full bg-[#090B0F] border border-[#252C38] rounded-lg px-3 py-2 text-xs text-[#F3F5F8] focus:outline-hidden focus:border-[#FF3548]"
              />
            </div>

            {/* Inclusions Checkboxes */}
            <div className="space-y-2.5 pt-2 border-t border-[#252C38]">
              <label className="block text-xs font-medium text-[#98A2B3]">Section Inclusions</label>
              
              <label className="flex items-center gap-2.5 text-xs text-[#F3F5F8] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeRemediation}
                  onChange={e => setIncludeRemediation(e.target.checked)}
                  className="rounded border-[#252C38] text-[#FF3548] focus:ring-[#FF3548]"
                />
                <span>Include Developer Remediation Checklists</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#F3F5F8] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTechnicalAppendix}
                  onChange={e => setIncludeTechnicalAppendix(e.target.checked)}
                  className="rounded border-[#252C38] text-[#FF3548] focus:ring-[#FF3548]"
                />
                <span>Include Diagnostic Evidence & CWE Standards</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#F3F5F8] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeMethodology}
                  onChange={e => setIncludeMethodology(e.target.checked)}
                  className="rounded border-[#252C38] text-[#FF3548] focus:ring-[#FF3548]"
                />
                <span>Include Methodology & Limitations Notice</span>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#252C38] space-y-2.5">
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#FF3548] hover:bg-[#FF3548]/90 text-white text-xs font-semibold shadow-md shadow-red-500/10 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Official PDF Report</span>
              </button>

              <button
                type="button"
                onClick={() => exportFindingsToCSV(reportFindings)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-[#141922] hover:bg-[#1a212d] border border-[#252C38] text-[#98A2B3] hover:text-[#F3F5F8] text-xs font-medium transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export Findings to CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Document Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#F3F5F8] flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#98A2B3]" />
              <span>Interactive Document Preview</span>
            </h3>
            <span className="text-[11px] font-mono text-[#35C98A]">LIVE SYNCED</span>
          </div>

          <div className="p-8 rounded-xl border border-[#252C38] bg-[#141922] shadow-2xl space-y-6 text-xs text-[#F3F5F8]">
            {/* Report Header simulation */}
            <div className="border-b border-[#252C38] pb-5 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#98A2B3]">
                <span className="font-bold text-[#FF3548] tracking-wider">CODE RED TOOL</span>
                <span className="font-mono">CONFIDENTIAL</span>
              </div>
              <h2 className="text-xl font-bold text-[#F3F5F8]">{reportTitle}</h2>
              <div className="text-[11px] text-[#98A2B3]">
                Scope: {targetAssets.map(a => a.name).join(', ')} · Prepared by {authorName} · {new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Posture Summary Box */}
            <div className="p-4 rounded-lg border border-[#252C38] bg-[#10141B] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-[#F3F5F8]">Executive Exposure Evaluation</span>
                <span className={`font-mono text-xs font-bold ${critCount > 0 ? 'text-[#FF3548]' : 'text-[#35C98A]'}`}>
                  {critCount > 0 ? 'CRITICAL EXPOSURE DETECTED' : 'EVALUATION NORMAL'}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center pt-1">
                <div className="p-2 rounded border border-[#FF3548]/20 bg-[#FF3548]/10">
                  <span className="block text-[10px] text-[#98A2B3]">Critical</span>
                  <span className="text-lg font-bold font-mono text-[#FF3548]">{critCount}</span>
                </div>
                <div className="p-2 rounded border border-[#FF8A3D]/20 bg-[#FF8A3D]/10">
                  <span className="block text-[10px] text-[#98A2B3]">High</span>
                  <span className="text-lg font-bold font-mono text-[#FF8A3D]">{highCount}</span>
                </div>
                <div className="p-2 rounded border border-[#F5C451]/20 bg-[#F5C451]/10">
                  <span className="block text-[10px] text-[#98A2B3]">Medium</span>
                  <span className="text-lg font-bold font-mono text-[#F5C451]">{medCount}</span>
                </div>
                <div className="p-2 rounded border border-[#58A6FF]/20 bg-[#58A6FF]/10">
                  <span className="block text-[10px] text-[#98A2B3]">Low</span>
                  <span className="text-lg font-bold font-mono text-[#58A6FF]">{lowCount}</span>
                </div>
              </div>
            </div>

            {/* Findings Preview List */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-[#F3F5F8]">Included Vulnerability Findings ({reportFindings.length})</h4>
              
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {reportFindings.map(f => (
                  <div key={f.id} className="p-3.5 rounded-lg border border-[#252C38] bg-[#10141B] space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="font-mono text-[10px] text-[#98A2B3]">{f.id} · {f.assetName}</span>
                        <div className="font-semibold text-xs text-[#F3F5F8]">{f.title}</div>
                      </div>
                      <SeverityBadge severity={f.severity} size="sm" />
                    </div>

                    <div className="text-[11px] text-[#98A2B3] font-mono truncate">
                      {f.affectedEndpoint}
                    </div>

                    {includeRemediation && (
                      <div className="text-[11px] text-[#35C98A] pt-1 border-t border-[#252C38]/60 line-clamp-1">
                        Remediation: {f.remediationSummary}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Limitations Notice */}
            {includeMethodology && (
              <div className="p-3 rounded-lg border border-[#252C38] bg-[#090B0F] text-[10px] text-[#98A2B3] leading-relaxed">
                <strong className="text-[#F3F5F8]">Assessment Scope Notice:</strong> Defensive assessments provide point-in-time posture checks based on non-destructive probes. Continuous code and architectural reviews are recommended prior to release.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
