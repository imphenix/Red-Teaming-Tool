import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  FileText, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { Scan } from '../types/security';

interface ScansListPageProps {
  onNavigate: (page: string, findingId?: string) => void;
}

export const ScansListPage: React.FC<ScansListPageProps> = ({ onNavigate }) => {
  const { scans } = useSecurity();
  const [search, setSearch] = useState('');
  const [filterProfile, setFilterProfile] = useState<string>('ALL');

  const filteredScans = scans.filter(s => {
    const matchSearch = s.assetName.toLowerCase().includes(search.toLowerCase()) ||
                        s.targetUrl.toLowerCase().includes(search.toLowerCase()) ||
                        s.id.toLowerCase().includes(search.toLowerCase());
    const matchProfile = filterProfile === 'ALL' || s.profile === filterProfile;
    return matchSearch && matchProfile;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#F3F5F8] tracking-tight">Security Assessments</h2>
          <p className="mt-1 text-xs text-[#98A2B3]">
            Audit history of passive probes and configuration evaluations across your authorized perimeter.
          </p>
        </div>

        <button
          onClick={() => onNavigate('scan-new')}
          className="flex items-center gap-1.5 py-2 px-4 bg-[#FF3548] hover:bg-[#FF3548]/90 text-white rounded-lg text-xs font-semibold shadow-xs transition-all whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Assessment</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assessments by ID, asset domain..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#10141B] border border-[#252C38] rounded-lg pl-9 pr-3 py-2 text-xs text-[#F3F5F8] placeholder-[#98A2B3] focus:outline-hidden focus:border-[#FF3548]"
          />
        </div>

        {/* Profile Filter */}
        <div className="flex items-center gap-1 bg-[#10141B] border border-[#252C38] rounded-lg p-1 text-xs self-start sm:self-auto overflow-x-auto max-w-full">
          {[
            { id: 'ALL', label: 'All Profiles' },
            { id: 'PASSIVE_WEB', label: 'Passive Web' },
            { id: 'SECURITY_CONFIG', label: 'Config Review' },
            { id: 'API_SECURITY', label: 'API Security' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setFilterProfile(p.id)}
              className={`px-3 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                filterProfile === p.id
                  ? 'bg-[#141922] text-[#F3F5F8] border border-[#252C38]'
                  : 'text-[#98A2B3] hover:text-[#F3F5F8]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Assessments Table */}
      <div className="rounded-xl border border-[#252C38] bg-[#10141B] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141922] text-[#98A2B3] font-medium border-b border-[#252C38]">
              <tr>
                <th className="py-3 px-4">Assessment ID</th>
                <th className="py-3 px-4">Target Asset</th>
                <th className="py-3 px-4">Profile</th>
                <th className="py-3 px-4">Executed</th>
                <th className="py-3 px-4 text-center">Findings</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252C38]">
              {filteredScans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#98A2B3]">
                    No assessments match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredScans.map(scan => (
                  <tr key={scan.id} className="hover:bg-[#141922]/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[#F3F5F8]">
                      {scan.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#F3F5F8]">{scan.assetName}</div>
                      <div className="text-[11px] font-mono text-[#98A2B3]">{scan.targetUrl}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#98A2B3]">
                      {scan.profile.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-4 text-[#98A2B3]">
                      <div>{new Date(scan.startedAt).toLocaleDateString()}</div>
                      <div className="text-[10px] text-[#98A2B3]/70">{new Date(scan.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 font-mono text-xs">
                        {scan.findingsCount.critical > 0 && (
                          <span className="text-[#FF3548] font-bold" title="Critical">{scan.findingsCount.critical}C</span>
                        )}
                        {scan.findingsCount.high > 0 && (
                          <span className="text-[#FF8A3D] font-bold" title="High">{scan.findingsCount.high}H</span>
                        )}
                        {scan.findingsCount.medium > 0 && (
                          <span className="text-[#F5C451] font-bold" title="Medium">{scan.findingsCount.medium}M</span>
                        )}
                        {scan.findingsCount.low > 0 && (
                          <span className="text-[#58A6FF]" title="Low">{scan.findingsCount.low}L</span>
                        )}
                        {scan.findingsCount.total === 0 && (
                          <span className="text-[#35C98A]">0 Clean</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#35C98A]/10 text-[#35C98A] border border-[#35C98A]/25">
                        {scan.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onNavigate('findings')}
                        className="py-1 px-2.5 rounded border border-[#252C38] hover:border-[#3B4556] text-[#F3F5F8] text-[11px] font-medium transition-colors"
                      >
                        View Findings
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
