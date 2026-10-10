import React, { useState } from 'react';
import { 
  Sliders, 
  RotateCcw, 
  Server, 
  ShieldCheck, 
  Database, 
  Key, 
  FileCode,
  CheckCircle2,
  Github
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { GitHubUploadModal } from '../components/ui/GitHubUploadModal';

export const SettingsPage: React.FC = () => {
  const { events, resetToDemoData } = useSecurity();
  const [workspaceName, setWorkspaceName] = useState('Enterprise Security Ops');
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);

  const handleReset = () => {
    resetToDemoData();
    setIsResetSuccess(true);
    setTimeout(() => setIsResetSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#F3F5F8] tracking-tight">Workspace Settings & Architecture</h2>
        <p className="mt-1 text-xs text-[#98A2B3]">
          Configure workspace metadata, sync to GitHub repositories, manage simulation data, and review production deployment blueprints.
        </p>
      </div>

      {/* GitHub Repository Upload & Push Protection Status */}
      <div className="p-6 rounded-xl border border-[#35C98A]/30 bg-[#10141B] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4 text-[#35C98A]" />
              <h3 className="text-sm font-semibold text-[#F3F5F8]">GitHub Repository Sync & Push Protection</h3>
              <span className="px-2 py-0.5 rounded bg-[#35C98A]/15 border border-[#35C98A]/30 text-[10px] font-mono text-[#35C98A] font-bold">
                READY TO UPLOAD
              </span>
            </div>
            <p className="text-xs text-[#98A2B3]">
              All simulated vulnerability keys and lockfiles are sanitized for GitHub Secret Scanning. Push reports directly via API or export the full repository.
            </p>
          </div>

          <button
            onClick={() => setIsGitHubModalOpen(true)}
            className="flex items-center gap-2 py-2 px-4 rounded-lg bg-[#35C98A] hover:bg-[#35C98A]/90 text-xs font-semibold text-[#090B0F] transition-colors self-start sm:self-auto shrink-0"
          >
            <Github className="w-4 h-4" />
            <span>Upload to GitHub</span>
          </button>
        </div>
      </div>

      {/* Workspace Profile */}
      <div className="p-6 rounded-xl border border-[#252C38] bg-[#10141B] space-y-4">
        <h3 className="text-sm font-semibold text-[#F3F5F8]">Workspace Identity</h3>
        
        <div className="max-w-md space-y-2">
          <label className="block text-xs font-medium text-[#98A2B3]">Workspace Name</label>
          <input
            type="text"
            value={workspaceName}
            onChange={e => setWorkspaceName(e.target.value)}
            className="w-full bg-[#090B0F] border border-[#252C38] rounded-lg px-3.5 py-2 text-xs text-[#F3F5F8] focus:outline-hidden focus:border-[#FF3548]"
          />
        </div>

        <div className="text-[11px] text-[#98A2B3]">
          Tenant ID: <span className="font-mono text-[#F3F5F8]">wrk_prod_90214_sec</span> · Role: <span className="font-mono text-[#35C98A]">Workspace Owner</span>
        </div>
      </div>

      {/* Demonstration Data Management */}
      <div className="p-6 rounded-xl border border-[#252C38] bg-[#10141B] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[#F3F5F8]">Demonstration Workspace Management</h3>
            <p className="text-xs text-[#98A2B3] mt-0.5">
              Reset the current demo workspace back to pristine seed assets, assessments, and findings.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 py-2 px-4 rounded-lg bg-[#141922] hover:bg-[#1a212d] border border-[#252C38] hover:border-[#FF3548]/40 text-xs font-semibold text-[#F3F5F8] transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FF3548]" />
            <span>Reset Demo Workspace</span>
          </button>
        </div>

        {isResetSuccess && (
          <div className="p-3 rounded-lg border border-[#35C98A]/30 bg-[#35C98A]/10 text-xs text-[#35C98A] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Demo assets, findings, and assessment logs successfully reset to pristine seed state.</span>
          </div>
        )}
      </div>

      {/* Production Readiness Blueprint */}
      <div className="p-6 rounded-xl border border-[#252C38] bg-[#10141B] space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-[#F3F5F8]">Production Architecture Contract</h3>
          <p className="text-xs text-[#98A2B3] mt-0.5">
            Architecture blueprint for transitioning CODE RED TOOL from demo prototype into a commercial SaaS backend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg border border-[#252C38] bg-[#090B0F] space-y-2">
            <div className="flex items-center gap-2 text-[#58A6FF]">
              <Database className="w-4 h-4" />
              <strong className="text-[#F3F5F8]">Relational Storage</strong>
            </div>
            <p className="text-[#98A2B3] leading-relaxed text-[11px]">
              PostgreSQL schema storing normalized entities: <code className="text-[#F3F5F8]">Workspaces</code>, <code className="text-[#F3F5F8]">Assets</code>, <code className="text-[#F3F5F8]">Assessments</code>, <code className="text-[#F3F5F8]">Findings</code>, and <code className="text-[#F3F5F8]">FindingStatusHistory</code>.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-[#252C38] bg-[#090B0F] space-y-2">
            <div className="flex items-center gap-2 text-[#FF3548]">
              <Server className="w-4 h-4" />
              <strong className="text-[#F3F5F8]">Scanning Service API</strong>
            </div>
            <p className="text-[#98A2B3] leading-relaxed text-[11px]">
              FastAPI/Node.js worker queue executing non-destructive checks via isolated egress proxies with DNS rebinding defenses.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-[#252C38] bg-[#090B0F] space-y-2">
            <div className="flex items-center gap-2 text-[#35C98A]">
              <ShieldCheck className="w-4 h-4" />
              <strong className="text-[#F3F5F8]">Access Control & IAM</strong>
            </div>
            <p className="text-[#98A2B3] leading-relaxed text-[11px]">
              Role-Based Access Control (RBAC) ensuring tenant isolation, audit logging, and signed reports in S3/GCS.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-lg border border-[#252C38] bg-[#141922] text-[11px] text-[#98A2B3] space-y-1">
          <strong className="text-[#F3F5F8] block">API Route Architecture:</strong>
          <div className="font-mono text-[#F3F5F8] space-y-0.5 pt-1">
            <div>POST /api/v1/assets · GET /api/v1/assets</div>
            <div>POST /api/v1/assessments · GET /api/v1/assessments/:id</div>
            <div>PATCH /api/v1/findings/:id/status · POST /api/v1/findings/:id/retest</div>
            <div>POST /api/v1/reports/pdf · GET /api/v1/reports/:id/download</div>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="p-6 rounded-xl border border-[#252C38] bg-[#10141B] space-y-4">
        <h3 className="text-sm font-semibold text-[#F3F5F8]">Security Audit Trail ({events.length} Events)</h3>
        
        <div className="rounded-lg border border-[#252C38] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141922] text-[#98A2B3] border-b border-[#252C38]">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Event Type</th>
                <th className="py-2.5 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252C38]">
              {events.slice(0, 8).map(evt => (
                <tr key={evt.id} className="hover:bg-[#141922]/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#98A2B3]">
                    {new Date(evt.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-[#F3F5F8]">
                    {evt.title}
                  </td>
                  <td className="py-2.5 px-3 text-[#98A2B3] text-[11px]">
                    {evt.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <GitHubUploadModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />
    </div>
  );
};
