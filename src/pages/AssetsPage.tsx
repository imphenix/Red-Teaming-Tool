import React, { useState } from 'react';
import { 
  Plus, 
  Globe, 
  ExternalLink, 
  ShieldCheck, 
  Archive, 
  Search, 
  AlertCircle 
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { Asset, Environment } from '../types/security';
import { Modal } from '../components/ui/Modal';

interface AssetsPageProps {
  onNavigate: (page: string, assetId?: string) => void;
  onStartScanForAsset: (assetId: string) => void;
}

export const AssetsPage: React.FC<AssetsPageProps> = ({ 
  onNavigate, 
  onStartScanForAsset 
}) => {
  const { assets, addAsset, archiveAsset } = useSecurity();
  const [search, setSearch] = useState('');
  const [filterEnv, setFilterEnv] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formEnv, setFormEnv] = useState<Environment>('PRODUCTION');
  const [formDesc, setFormDesc] = useState('');
  const [formAuthorizedBy, setFormAuthorizedBy] = useState('');
  const [formConfirmed, setFormConfirmed] = useState(false);
  const [formError, setFormError] = useState('');

  const filteredAssets = assets
    .filter(a => a.status === 'ACTIVE')
    .filter(a => {
      const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || 
                          a.targetUrl.toLowerCase().includes(search.toLowerCase()) ||
                          a.description.toLowerCase().includes(search.toLowerCase());
      const matchEnv = filterEnv === 'ALL' || a.environment === filterEnv;
      return matchSearch && matchEnv;
    });

  const handleSubmitAsset = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // URL validation
    if (!formName.trim()) {
      setFormError('Asset name is required.');
      return;
    }
    if (!formUrl.trim() || !formUrl.startsWith('http')) {
      setFormError('Valid target URL starting with http:// or https:// is required.');
      return;
    }
    if (!formAuthorizedBy.trim()) {
      setFormError('Authorizing individual/email is required for security compliance.');
      return;
    }
    if (!formConfirmed) {
      setFormError('You must explicitly confirm you are authorized to assess this asset.');
      return;
    }

    addAsset({
      name: formName.trim(),
      targetUrl: formUrl.trim(),
      environment: formEnv,
      description: formDesc.trim() || 'Custom registered web asset.',
      authorizedBy: formAuthorizedBy.trim(),
      authorizedAt: new Date().toISOString(),
      lastAssessmentDate: undefined
    });

    // Reset & close
    setFormName('');
    setFormUrl('');
    setFormDesc('');
    setFormAuthorizedBy('');
    setFormConfirmed(false);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#F3F5F8] tracking-tight">Authorized Assets</h2>
          <p className="mt-1 text-xs text-[#98A2B3]">
            Manage domains, APIs, and web services authorized for non-destructive security evaluation.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 py-2 px-4 bg-[#FF3548] hover:bg-[#FF3548]/90 text-white rounded-lg text-xs font-semibold shadow-xs transition-all whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Asset</span>
        </button>
      </div>

      {/* Trust Notice Banner */}
      <div className="p-4 rounded-xl border border-[#252C38] bg-[#10141B] flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#35C98A] shrink-0 mt-0.5" />
        <div className="text-xs text-[#98A2B3] leading-relaxed">
          <strong className="text-[#F3F5F8]">Scope Governance Policy:</strong> CODE RED TOOL operates strictly against verified assets where written authorization has been registered. Passive probes and safe configuration reviews never impact production availability or modify underlying business data.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assets by domain, description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#10141B] border border-[#252C38] rounded-lg pl-9 pr-3 py-2 text-xs text-[#F3F5F8] placeholder-[#98A2B3] focus:outline-hidden focus:border-[#FF3548]"
          />
        </div>

        {/* Environment Filter */}
        <div className="flex items-center gap-1 bg-[#10141B] border border-[#252C38] rounded-lg p-1 text-xs self-start sm:self-auto">
          {['ALL', 'PRODUCTION', 'STAGING', 'DEVELOPMENT'].map(env => (
            <button
              key={env}
              onClick={() => setFilterEnv(env)}
              className={`px-3 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                filterEnv === env
                  ? 'bg-[#141922] text-[#F3F5F8] border border-[#252C38]'
                  : 'text-[#98A2B3] hover:text-[#F3F5F8]'
              }`}
            >
              {env === 'ALL' ? 'All Environments' : env}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAssets.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-xl border border-[#252C38] bg-[#10141B] space-y-3">
            <Globe className="w-8 h-8 text-[#98A2B3] mx-auto" />
            <h4 className="text-sm font-semibold text-[#F3F5F8]">No matching assets found</h4>
            <p className="text-xs text-[#98A2B3] max-w-sm mx-auto">
              No assets match your current search or environment filter. Add a new target asset to begin.
            </p>
          </div>
        ) : (
          filteredAssets.map(asset => {
            const envBadgeClass = 
              asset.environment === 'PRODUCTION' ? 'text-[#FF3548] border-[#FF3548]/30 bg-[#FF3548]/10' :
              asset.environment === 'STAGING' ? 'text-[#F5C451] border-[#F5C451]/30 bg-[#F5C451]/10' :
              'text-[#58A6FF] border-[#58A6FF]/30 bg-[#58A6FF]/10';

            return (
              <div 
                key={asset.id} 
                className="p-5 rounded-xl border border-[#252C38] bg-[#10141B] flex flex-col justify-between space-y-4 hover:border-[#3B4556] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border ${envBadgeClass} uppercase tracking-wider`}>
                        {asset.environment}
                      </span>
                      <h3 className="text-sm font-semibold text-[#F3F5F8] flex items-center gap-1.5 pt-1">
                        <span>{asset.name}</span>
                      </h3>
                    </div>

                    <button
                      onClick={() => archiveAsset(asset.id)}
                      className="p-1.5 text-[#98A2B3] hover:text-[#FF3548] rounded hover:bg-[#141922] transition-colors"
                      title="Archive asset"
                      aria-label="Archive asset"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>

                  <a 
                    href={asset.targetUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs font-mono text-[#98A2B3] hover:text-[#58A6FF] flex items-center gap-1 break-all"
                  >
                    <span>{asset.targetUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>

                  <p className="text-xs text-[#98A2B3] line-clamp-2 leading-relaxed">
                    {asset.description}
                  </p>

                  <div className="pt-2 border-t border-[#252C38]/70 text-[11px] text-[#98A2B3] space-y-1">
                    <div className="flex justify-between">
                      <span>Authorized by:</span>
                      <span className="text-[#F3F5F8] font-medium">{asset.authorizedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Assessment:</span>
                      <span className="text-[#F3F5F8] font-mono">
                        {asset.lastAssessmentDate ? new Date(asset.lastAssessmentDate).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#252C38] flex items-center gap-2">
                  <button
                    onClick={() => onStartScanForAsset(asset.id)}
                    className="flex-1 py-1.5 px-3 bg-[#FF3548]/15 hover:bg-[#FF3548]/25 text-[#FF3548] border border-[#FF3548]/30 rounded-lg text-xs font-semibold transition-colors text-center"
                  >
                    Run Assessment
                  </button>
                  <button
                    onClick={() => onNavigate('findings')}
                    className="py-1.5 px-3 bg-[#141922] hover:bg-[#1a212d] text-[#F3F5F8] border border-[#252C38] rounded-lg text-xs font-medium transition-colors"
                  >
                    Findings
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Asset Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Enroll Authorized Asset"
        subtitle="Register a domain or API endpoint for non-destructive security assessment."
        maxWidth="xl"
      >
        <form onSubmit={handleSubmitAsset} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg border border-[#FF3548]/30 bg-[#FF3548]/10 text-xs text-[#FF3548] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#F3F5F8] mb-1">
              Asset Display Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. checkout.example.com or Customer Portal API"
              value={formName}
              onChange={e => setFormName(e.target.value)}
              className="w-full bg-[#090B0F] border border-[#252C38] rounded-lg px-3 py-2 text-xs text-[#F3F5F8] placeholder-[#98A2B3] focus:outline-hidden focus:border-[#FF3548]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F3F5F8] mb-1">
              Target URL / Domain *
            </label>
            <input
              type="url"
              required
              placeholder="https://example.com"
              value={formUrl}
              onChange={e => setFormUrl(e.target.value)}
              className="w-full bg-[#090B0F] border border-[#252C38] rounded-lg px-3 py-2 text-xs text-[#F3F5F8] font-mono placeholder-[#98A2B3] focus:outline-hidden focus:border-[#FF3548]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F3F5F8] mb-1">
              Deployment Environment
            </label>
            <select
              value={formEnv}
              onChange={e => setFormEnv(e.target.value as Environment)}
              className="w-full bg-[#090B0F] border border-[#252C38] rounded-lg px-3 py-2 text-xs text-[#F3F5F8] focus:outline-hidden focus:border-[#FF3548]"
            >
              <option value="PRODUCTION">Production</option>
              <option value="STAGING">Staging</option>
              <option value="DEVELOPMENT">Development</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F3F5F8] mb-1">
              Description / Component Purpose
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Microservices gateway handling authentication and payment settlement"
              value={formDesc}
              onChange={e => setFormDesc(e.target.value)}
              className="w-full bg-[#090B0F] border border-[#252C38] rounded-lg px-3 py-2 text-xs text-[#F3F5F8] placeholder-[#98A2B3] focus:outline-hidden focus:border-[#FF3548]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F3F5F8] mb-1">
              Authorized Individual / Owner Email *
            </label>
            <input
              type="email"
              required
              placeholder="security-officer@yourdomain.com"
              value={formAuthorizedBy}
              onChange={e => setFormAuthorizedBy(e.target.value)}
              className="w-full bg-[#090B0F] border border-[#252C38] rounded-lg px-3 py-2 text-xs text-[#F3F5F8] placeholder-[#98A2B3] focus:outline-hidden focus:border-[#FF3548]"
            />
          </div>

          {/* Authorization Checkbox */}
          <div className="p-3 rounded-lg border border-[#252C38] bg-[#090B0F] space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formConfirmed}
                onChange={e => setFormConfirmed(e.target.checked)}
                className="mt-0.5 rounded border-[#252C38] text-[#FF3548] focus:ring-[#FF3548]"
              />
              <span className="text-[11px] text-[#98A2B3] leading-relaxed">
                I hereby attest that our organization owns or has explicit written authority to perform defensive security assessments on this target asset.
              </span>
            </label>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="py-2 px-4 rounded-lg border border-[#252C38] text-xs font-medium text-[#98A2B3] hover:text-[#F3F5F8] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 rounded-lg bg-[#FF3548] hover:bg-[#FF3548]/90 text-white text-xs font-semibold transition-colors"
            >
              Enroll Asset
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
